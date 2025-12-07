/* eslint-env node */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RDO COMMAND - OCR Catalog Ingestion Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * USAGE:
 *   1. Take screenshots of RDO catalog pages (clothing, hats, etc.)
 *   2. Place them in ./ingest_queue/ folder
 *   3. Run: node scripts/ingest-catalog.js
 *   4. Output: public/data/wardrobe.json
 * 
 * The script uses Tesseract.js OCR to extract item names and prices from
 * screenshots, then outputs a structured JSON file for the WardrobeTracker.
 * 
 * ARCHITECTURE: Consumes the Unified Data Contract (src/data/schemas.js)
 * to ensure schema consistency between ingestion and UI consumption.
 */

import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DATA CONTRACT IMPORT
// ═══════════════════════════════════════════════════════════════════════════
import {
    CATEGORY,
    defaultWardrobeItem,
    normalizePrice,
    detectSubCategory,
    generateItemId,
    validateWardrobeItem,
} from '../src/data/schemas.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    INPUT_DIR: path.join(__dirname, '..', 'ingest_queue'),
    OUTPUT_FILE: path.join(__dirname, '..', 'public', 'data', 'wardrobe.json'),
    SUPPORTED_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.webp', '.bmp'],
    DEFAULT_VARIANTS: 10,
    OCR_LANGUAGE: 'eng',
    // Lines containing these patterns are noise (menu headers, etc.)
    IGNORE_PATTERNS: [/catalogue/i, /wheeler/i, /rawson/i, /select/i, /^rank\s/i, /owned/i],
};

// ═══════════════════════════════════════════════════════════════════════════
// PRICE EXTRACTION PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

const PATTERNS = {
    // Cash: $14.50, $ 14.50, $14
    CASH: /\$\s?(\d+(?:\.\d{2})?)/g,
    // Gold: 3G, 3 G, 3 Gold, 3 gold
    GOLD: /(\d+)\s?(?:G|Gold|gold)/gi,
    // Filter noise: common OCR garbage
    NOISE: /^[\d\s.$G]+$|^\W+$|^.{1,2}$/,
};

// ═══════════════════════════════════════════════════════════════════════════
// TEXT CLEANING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extract cash and gold values from a line of text
 */
function extractPrices(line) {
    const cashMatch = line.match(PATTERNS.CASH);
    const goldMatch = line.match(PATTERNS.GOLD);

    return {
        cash: cashMatch ? parseFloat(cashMatch[0].replace('$', '').trim()) : 0,
        gold: goldMatch ? parseInt(goldMatch[0].replace(/\D/g, '')) : 0,
    };
}

/**
 * Clean item name from OCR text
 */
function cleanName(line) {
    return line
        .replace(PATTERNS.CASH, '')
        .replace(PATTERNS.GOLD, '')
        .replace(/[^\w\s'-]/g, '')
        .trim();
}

/**
 * Convert string to Title Case
 */
function titleCase(str) {
    return str.replace(/\w\S*/g, txt =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// OCR PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Process a single image file and extract catalog items
 */
async function processImage(imagePath) {
    const filename = path.basename(imagePath);
    console.log(`\n📷 Scanning: ${filename}`);

    try {
        const { data: { text, confidence } } = await Tesseract.recognize(
            imagePath,
            CONFIG.OCR_LANGUAGE,
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        // eslint-disable-next-line no-undef
                        process.stdout.write(`\r   Progress: ${Math.floor(m.progress * 100)}%`);
                    }
                }
            }
        );

        console.log(`\n   Confidence: ${confidence.toFixed(1)}%`);

        const items = parseOCRText(text, filename);
        console.log(`   Found: ${items.length} items`);

        return items;

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return [];
    }
}

/**
 * Parse OCR text output into structured item objects
 * Uses the Unified Data Contract for consistent object creation
 */
function parseOCRText(text, sourceFile) {
    const items = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 3);

    for (const line of lines) {
        // Skip noise lines
        if (PATTERNS.NOISE.test(line)) continue;
        if (CONFIG.IGNORE_PATTERNS.some(p => p.test(line))) continue;

        // Extract prices
        const { cash, gold } = extractPrices(line);
        if (cash === 0 && gold === 0) continue;

        // Clean and validate name
        const rawName = cleanName(line);
        if (rawName.length < 3 || /^\d+$/.test(rawName)) continue;

        const name = titleCase(rawName);

        // USE THE SCHEMA FACTORY - Start with safe defaults
        const newItem = {
            ...defaultWardrobeItem(),
            id: generateItemId(name, 'W'),
            name,
            category: CATEGORY.CLOTHING,
            subCategory: detectSubCategory(name),
            unitCost: normalizePrice(cash, gold),
            variantsTotal: CONFIG.DEFAULT_VARIANTS,
            variantsOwned: 0,
            tags: ['scanned', `source:${sourceFile}`],
        };

        // Validate before adding
        const { valid, errors } = validateWardrobeItem(newItem);
        if (valid) {
            items.push(newItem);
        } else {
            console.warn(`   ⚠️ Skipping invalid item "${name}": ${errors.join(', ')}`);
        }
    }

    return items;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEDUPLICATION & MERGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Merge new items with existing wardrobe, avoiding duplicates
 */
function mergeWithExisting(newItems) {
    let existing = [];

    if (fs.existsSync(CONFIG.OUTPUT_FILE)) {
        try {
            const raw = JSON.parse(fs.readFileSync(CONFIG.OUTPUT_FILE, 'utf-8'));
            // Handle both array root and { items: [] } wrapper
            existing = Array.isArray(raw) ? raw : (raw.items || []);
            console.log(`\n📂 Existing wardrobe: ${existing.length} items`);
        } catch {
            console.log('\n⚠️  Could not parse existing wardrobe.json, starting fresh');
        }
    }

    // Dedupe by normalized name
    const seen = new Set(existing.map(i => (i.name || '').toLowerCase()));
    const unique = newItems.filter(item => {
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`   New unique items: ${unique.length}`);
    return [...existing, ...unique];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN RUNNER
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   RDO COMMAND - OCR Catalog Ingestion Engine v2.0');
    console.log('   Using Unified Data Contract (src/data/schemas.js)');
    console.log('═══════════════════════════════════════════════════════════════');

    // Ensure directories exist
    if (!fs.existsSync(CONFIG.INPUT_DIR)) {
        fs.mkdirSync(CONFIG.INPUT_DIR, { recursive: true });
        console.log(`\n📁 Created input directory: ${CONFIG.INPUT_DIR}`);
        console.log('   Place your screenshots here and run again.');
        return;
    }

    const outputDir = path.dirname(CONFIG.OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Get image files
    const files = fs.readdirSync(CONFIG.INPUT_DIR)
        .filter(f => CONFIG.SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()));

    if (files.length === 0) {
        console.log(`\n⚠️  No images found in ${CONFIG.INPUT_DIR}`);
        console.log('   Supported formats:', CONFIG.SUPPORTED_EXTENSIONS.join(', '));
        return;
    }

    console.log(`\n🔍 Found ${files.length} image(s) to process`);

    // Process all images
    let allItems = [];
    for (const file of files) {
        const items = await processImage(path.join(CONFIG.INPUT_DIR, file));
        allItems = [...allItems, ...items];
    }

    // Merge and save
    const finalList = mergeWithExisting(allItems);

    // Output with schema version for future migrations
    const output = {
        schemaVersion: '1.0.0',
        generatedAt: new Date().toISOString(),
        items: finalList,
    };

    fs.writeFileSync(CONFIG.OUTPUT_FILE, JSON.stringify(output, null, 2));

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`✅ Generated: ${CONFIG.OUTPUT_FILE}`);
    console.log(`   Schema Version: ${output.schemaVersion}`);
    console.log(`   Total items: ${finalList.length}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
