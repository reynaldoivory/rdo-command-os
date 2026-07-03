/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RDO COMMAND - Unified Schema & Validators
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CRITICAL: This file must be PURE JavaScript.
 * - No React imports
 * - No Node-specific APIs (fs, path, etc.)
 * - No browser-specific APIs (window, document, etc.)
 *
 * This ensures the schema runs in:
 * - Node.js (scripts/ingest-catalog.js)
 * - Browser (React components)
 * - Test runners (Jest, Vitest, Playwright)
 *
 * VERSIONING: Increment when schema changes break compatibility.
 */

export const SCHEMA_VERSION = '1.0.0';

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: ENUMS (Source of Truth)
// ═══════════════════════════════════════════════════════════════════════════

export const CATEGORY = Object.freeze({
    CLOTHING: 'clothing',
    WEAPON_VISUAL: 'weapon_visual',
    HORSE_TACK: 'horse_tack',
});

export const SUBCATEGORY = Object.freeze({
    // Clothing
    HAT: 'hat',
    COAT: 'coat',
    VEST: 'vest',
    SHIRT: 'shirt',
    PANTS: 'pants',
    BOOTS: 'boots',
    GLOVES: 'gloves',
    BANDANA: 'bandana',
    EYEWEAR: 'eyewear',
    BELT: 'belt',
    SPURS: 'spurs',
    SUSPENDERS: 'suspenders',
    CHAPS: 'chaps',
    PONCHO: 'poncho',
    SKIRT: 'skirt',
    NECKWEAR: 'neckwear',
    RING: 'ring',
    MISC: 'misc',

    // Weapon Visuals
    BARREL: 'barrel',
    SIGHT: 'sight',
    METAL: 'metal',
    VARNISH: 'varnish',
    WRAP: 'wrap',
    CARVING: 'carving',

    // Horse Tack
    SADDLE: 'saddle',
    STIRRUPS: 'stirrups',
    HORN: 'horn',
    BLANKET: 'blanket',
    BEDROLL: 'bedroll',
    SADDLEBAG: 'saddlebag',
    MANE: 'mane',
    TAIL: 'tail',
});

/**
 * Maps keywords in item names to subcategories for auto-detection
 */
export const SUBCATEGORY_KEYWORDS = Object.freeze({
    [SUBCATEGORY.HAT]: ['hat', 'cap', 'hood', 'headwear', 'helmet', 'beret'],
    [SUBCATEGORY.COAT]: ['coat', 'jacket', 'duster', 'overcoat', 'cloak'],
    [SUBCATEGORY.VEST]: ['vest', 'waistcoat'],
    [SUBCATEGORY.SHIRT]: ['shirt', 'blouse', 'union suit'],
    [SUBCATEGORY.PANTS]: ['pants', 'trousers', 'jeans'],
    [SUBCATEGORY.BOOTS]: ['boots', 'shoes'],
    [SUBCATEGORY.GLOVES]: ['gloves', 'gauntlet'],
    [SUBCATEGORY.BANDANA]: ['bandana', 'mask', 'face'],
    [SUBCATEGORY.EYEWEAR]: ['glasses', 'eyewear', 'spectacles', 'goggles'],
    [SUBCATEGORY.BELT]: ['belt', 'buckle', 'holster'],
    [SUBCATEGORY.SPURS]: ['spurs'],
    [SUBCATEGORY.SUSPENDERS]: ['suspenders'],
    [SUBCATEGORY.CHAPS]: ['chaps'],
    [SUBCATEGORY.PONCHO]: ['poncho', 'serape'],
    [SUBCATEGORY.SKIRT]: ['skirt'],
    [SUBCATEGORY.NECKWEAR]: ['neckwear', 'tie', 'scarf', 'neckerchief'],
    [SUBCATEGORY.RING]: ['ring'],
});

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: FACTORY FUNCTIONS (Consistent Object Creation)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates a standard Wardrobe Item (Cosmetic)
 * @returns {WardrobeItem}
 */
export function defaultWardrobeItem() {
    return {
        id: '',
        name: 'Unknown Item',
        category: CATEGORY.CLOTHING,
        subCategory: SUBCATEGORY.HAT,
        unitCost: { cash: 0, gold: 0 },
        variantsTotal: 10,
        variantsOwned: 0,
        tags: [],
    };
}

/**
 * Creates a standard Core Item (Functional/Stats-affecting)
 * @returns {CoreItem}
 */
export function defaultCoreItem() {
    return {
        sku: '',
        category: 'weapon',
        subCategory: 'revolver',
        name: 'New Weapon',
        unitCost: { cash: 0, gold: 0 },
        requirements: {
            rank: 1,
            role: null,
            roleRank: 0,
        },
        stats: {},
        tags: [],
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: VALIDATORS & HELPERS (Logic Sharing)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Normalizes raw price inputs to safe numeric values
 * @param {any} rawCash - Raw cash value (may be string, null, undefined)
 * @param {any} rawGold - Raw gold value (may be string, null, undefined)
 * @returns {{ cash: number, gold: number }}
 */
export function normalizePrice(rawCash, rawGold) {
    const parseCash = parseFloat(rawCash);
    const parseGold = parseFloat(rawGold);
    return {
        cash: Number.isFinite(parseCash) ? Math.max(0, parseCash) : 0,
        gold: Number.isFinite(parseGold) ? Math.max(0, parseGold) : 0,
    };
}

/**
 * Clamps variant counts to valid range [0, total]
 * Prevents negative ownership or exceeding total variants
 * @param {number} owned - Current owned count
 * @param {number} total - Total available variants
 * @returns {{ variantsOwned: number, variantsTotal: number }}
 */
export function clampVariants(owned, total) {
    const safeTotal = Math.max(1, Math.floor(total) || 1);
    const safeOwned = Math.max(0, Math.min(safeTotal, Math.floor(owned) || 0));
    return { variantsOwned: safeOwned, variantsTotal: safeTotal };
}

/**
 * Auto-detect subcategory from item name using keyword matching
 * @param {string} name - Item name to analyze
 * @returns {string} - Matching subcategory or MISC
 */
export function detectSubCategory(name) {
    const lower = (name || '').toLowerCase();
    for (const [subCat, keywords] of Object.entries(SUBCATEGORY_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) {
            return subCat;
        }
    }
    return SUBCATEGORY.MISC;
}

/**
 * Generate a URL-safe slug from item name
 * @param {string} name - Item name
 * @param {string} [prefix='W'] - ID prefix
 * @returns {string}
 */
export function generateItemId(name, prefix = 'W') {
    const slug = (name || 'unknown')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
    return `${prefix}_${slug}`;
}

/**
 * Calculate cost to complete a collection
 * @param {Array} items - Array of wardrobe items
 * @returns {{ cash: number, gold: number, itemsRemaining: number, variantsRemaining: number }}
 */
export function calculateCompletionCost(items) {
    return items.reduce((acc, item) => {
        const remaining = (item.variantsTotal || 0) - (item.variantsOwned || 0);
        if (remaining <= 0) return acc;

        const cost = item.unitCost || { cash: 0, gold: 0 };
        return {
            cash: acc.cash + (remaining * (cost.cash || 0)),
            gold: acc.gold + (remaining * (cost.gold || 0)),
            itemsRemaining: acc.itemsRemaining + (remaining > 0 ? 1 : 0),
            variantsRemaining: acc.variantsRemaining + remaining,
        };
    }, { cash: 0, gold: 0, itemsRemaining: 0, variantsRemaining: 0 });
}

/**
 * Validate a wardrobe item against the schema
 * @param {object} item - Item to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateWardrobeItem(item) {
    const errors = [];

    if (!item.id || typeof item.id !== 'string') {
        errors.push('Missing or invalid id');
    }
    if (!item.name || typeof item.name !== 'string') {
        errors.push('Missing or invalid name');
    }
    if (!Object.values(CATEGORY).includes(item.category)) {
        errors.push(`Invalid category: ${item.category}`);
    }
    if (!Object.values(SUBCATEGORY).includes(item.subCategory)) {
        errors.push(`Invalid subCategory: ${item.subCategory}`);
    }
    if (typeof item.variantsTotal !== 'number' || item.variantsTotal < 1) {
        errors.push('variantsTotal must be >= 1');
    }
    if (typeof item.variantsOwned !== 'number' || item.variantsOwned < 0) {
        errors.push('variantsOwned must be >= 0');
    }
    if (item.variantsOwned > item.variantsTotal) {
        errors.push('variantsOwned cannot exceed variantsTotal');
    }

    return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: TYPESCRIPT/JSDOC TYPE DEFINITIONS (Documentation)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} DataSource
 * @property {'GAME_TEST'|'REDDIT'|'WIKI'|'YOUTUBE'|'COMMUNITY_TESTED'} type
 * @property {string} date ISO 8601 date (YYYY-MM-DD)
 * @property {string} [verified_by] Player or researcher who verified
 * @property {string} [url] Link to source
 * @property {string} [notes] Additional context
 */

/**
 * @typedef {'HIGH'|'MEDIUM'|'LOW'} ConfidenceLevel
 * HIGH: Verified by multiple independent sources, in-game tested
 * MEDIUM: Verified by one source, community consensus
 * LOW: Estimated, anecdotal, awaiting confirmation
 */

/**
 * @typedef {Object} DataQuality
 * @property {ConfidenceLevel} confidence
 * @property {DataSource[]} sources
 * @property {string} last_verified ISO 8601 date when last confirmed
 * @property {string} [patch_version] RDO patch version this is valid for
 * @property {string} [deprecation_warning] If null, data is current
 */

/**
 * @typedef {Object} RDOItem
 * @property {string} id Unique identifier (snake_case)
 * @property {string} name Display name
 * @property {string} [description] Detailed description
 * @property {'weapon'|'horse'|'tack'|'clothing'|'consumable'|'tool'|'upgrade'|'vehicle'} type
 * @property {'gunsmith'|'stable'|'tailor'|'fence'|'general'|'nazar'|'roles'|'harriet'} shop Which vendor sells it
 * @property {number} price Cash price (0 if gold-only)
 * @property {number} gold_cost Gold bar cost (0 if cash-only)
 * @property {number} [tokens] Role tokens required (0 if not applicable)
 * @property {number} rank_required Minimum character rank to purchase
 * @property {string} [role_required] If role-gated (e.g., 'trader', 'collector')
 * @property {number} [role_rank_required] Minimum role level required
 * @property {number} meta_score 1-10 ranking of usefulness
 * @property {string} meta_reason Why this item is valued
 * @property {DataQuality} data_quality
 */

/**
 * @typedef {Object} HorseData
 * @extends RDOItem
 * @property {number} speed 1-10 rating
 * @property {number} health 1-10 rating
 * @property {number} stamina 1-10 rating
 * @property {number} acceleration 1-10 rating
 * @property {string} [breed] Horse breed classification
 * @property {boolean} is_legendary True for epilogue legendary horses
 */

/**
 * @typedef {Object} WeaponData
 * @extends RDOItem
 * @property {'sidearm'|'longarm'|'melee'} weapon_class
 * @property {number} damage 1-100 visible rating
 * @property {number} range 1-100 visible rating
 * @property {number} accuracy 1-100 visible rating
 * @property {number} fire_rate 1-100 visible rating
 */

/**
 * @typedef {Object} WardrobeItem
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {string} category One of CATEGORY enum values
 * @property {string} subCategory One of SUBCATEGORY enum values
 * @property {{ cash: number, gold: number }} unitCost Cost per variant
 * @property {number} variantsTotal Total variants available
 * @property {number} variantsOwned Variants player owns
 * @property {string[]} tags Optional tags for filtering
 */

/**
 * @typedef {Object} CoreItem
 * @property {string} sku Unique stock-keeping unit identifier
 * @property {string} category Item category
 * @property {string} subCategory Item subcategory
 * @property {string} name Display name
 * @property {{ cash: number, gold: number }} unitCost Purchase cost
 * @property {{ rank: number, role: string|null, roleRank: number }} requirements Unlock requirements
 * @property {Object} stats Game stats (varies by item type)
 * @property {string[]} tags Optional tags for filtering
 */
