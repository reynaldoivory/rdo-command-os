#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * V2 TO V3 MIGRATION RUNNER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 *   npm run migrate                  # Run migration with default path
 *   npm run migrate -- data/custom.json  # Run with custom input file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { migrateV2ToV3 } from '../migration/v2_to_v3_migrator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

// Get input file from args or use default
const inputFile = process.argv[2] || 'rdo_extraction_log.json';
const inputPath = path.resolve(__dirname, '../../data', inputFile);
const outputDir = path.resolve(__dirname, '../../data/v3');

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n🎯 RDO V2→V3 MIGRATION ENGINE\n');
console.log(`📂 Input:  ${inputPath}`);
console.log(`📂 Output: ${outputDir}\n`);

// Validate input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Input file not found: ${inputPath}`);
  process.exit(1);
}

// Read v2 extraction log
let v2Data: any;
try {
  const rawData = fs.readFileSync(inputPath, 'utf-8');
  v2Data = JSON.parse(rawData);
  console.log(`✅ Loaded input file (${rawData.length} bytes)`);
} catch (err) {
  console.error(`❌ Failed to parse input file: ${(err as Error).message}`);
  process.exit(1);
}

// Run migration
console.log('\n🔄 Running migration...\n');
const result = migrateV2ToV3(v2Data);

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Created output directory`);
}

// Save migrated data
try {
  const compendiumPath = path.join(outputDir, 'compendium.json');
  const economicsPath = path.join(outputDir, 'economics.json');
  const reportPath = path.join(outputDir, 'migration_report.json');

  fs.writeFileSync(
    compendiumPath,
    JSON.stringify(
      {
        items: result.items,
        animals: result.animals,
        fast_travel_nodes: result.fast_travel_nodes,
        fast_travel_routes: result.fast_travel_routes,
        collector_items: result.collector_items,
        roles: result.roles,
      },
      null,
      2
    )
  );
  console.log(`✅ Saved compendium: ${compendiumPath}`);

  fs.writeFileSync(
    economicsPath,
    JSON.stringify(
      {
        formulas: result.formulas,
      },
      null,
      2
    )
  );
  console.log(`✅ Saved economics: ${economicsPath}`);

  fs.writeFileSync(reportPath, JSON.stringify(result.report, null, 2));
  console.log(`✅ Saved report: ${reportPath}`);
} catch (err) {
  console.error(`❌ Failed to write output files: ${(err as Error).message}`);
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n' + '═'.repeat(70));
console.log('MIGRATION REPORT');
console.log('═'.repeat(70) + '\n');

const {
  stats,
  success,
  warnings,
  errors,
  gaps,
  timestamp,
  summary,
} = result.report;

console.log(summary);

console.log('\n📊 STATISTICS:\n');
console.log(`  Items:          ${stats.items_migrated}`);
console.log(`  Formulas:       ${stats.formulas_migrated}`);
console.log(`  Animals:        ${stats.animals_migrated}`);
console.log(`  Fast Travel:    ${stats.fast_travel_nodes}`);
console.log(`  Collector:      ${stats.collector_items}`);
console.log(`  Roles:          ${stats.roles_migrated}`);
console.log(`  ─────────────────────────────────`);
console.log(
  `  TOTAL:          ${stats.items_migrated + stats.formulas_migrated + stats.animals_migrated + stats.fast_travel_nodes + stats.collector_items + stats.roles_migrated}`
);

console.log('\n📈 CONFIDENCE:\n');
console.log(`  🟢 HIGH:        ${stats.high_confidence_items}`);
console.log(`  🟡 MEDIUM:      ${stats.medium_confidence_items}`);
console.log(`  🔴 LOW:         ${stats.low_confidence_items}`);

if (errors.length > 0) {
  console.log(`\n❌ ERRORS (${errors.length}):\n`);
  errors.slice(0, 5).forEach((err, i) => {
    console.log(`  ${i + 1}. ${err}`);
  });
  if (errors.length > 5) {
    console.log(`  ... and ${errors.length - 5} more`);
  }
}

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):\n`);
  warnings.slice(0, 5).forEach((warn, i) => {
    console.log(`  ${i + 1}. ${warn}`);
  });
  if (warnings.length > 5) {
    console.log(`  ... and ${warnings.length - 5} more`);
  }
}

if (gaps.length > 0) {
  console.log(`\n🔍 DATA GAPS (${gaps.length} entries need verification):\n`);
  gaps.slice(0, 5).forEach((gap, i) => {
    console.log(`  ${i + 1}. ${gap}`);
  });
  if (gaps.length > 5) {
    console.log(`  ... and ${gaps.length - 5} more`);
  }
}

console.log('\n⏱️  Timestamp: ' + timestamp);
console.log('\n' + '═'.repeat(70) + '\n');

if (success) {
  console.log('✅ Migration successful! Data ready for Redux store.\n');
  process.exit(0);
} else {
  console.log('❌ Migration completed with errors. Review report above.\n');
  process.exit(1);
}
