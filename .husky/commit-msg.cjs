#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// INFINITE HORIZON PROTOCOL - COMMIT MESSAGE VALIDATOR
// Code is never "final" - reject commits that claim otherwise
// ═══════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

// Get commit message file path from args
const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error('No commit message file provided');
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgFile, 'utf8');

// Check for forbidden "finality" words (case-insensitive)
const forbiddenPatterns = [
  /\bfinal\b/i,
  /\bfinished\b/i,
  /\bcomplete[d]?\b/i,
  /\bdone\b/i
];

const violations = forbiddenPatterns.filter(p => p.test(commitMsg));

if (violations.length > 0) {
  console.log('');
  console.log('⛔ PROTOCOL VIOLATION: The Infinite Horizon');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log("Forbidden terms detected: 'final', 'finished', 'complete', 'done'");
  console.log('');
  console.log("Code is a living organism. No commit is ever 'final'.");
  console.log('');
  console.log('REWRITE SUGGESTIONS:');
  console.log("  ❌ 'Final fix for bug'     → ✅ 'Iteration on bug fix'");
  console.log("  ❌ 'Finished feature'      → ✅ 'Feature baseline established'");
  console.log("  ❌ 'Complete redesign'     → ✅ 'Redesign v1.0'");
  console.log("  ❌ 'Done with refactor'    → ✅ 'Refactor checkpoint'");
  console.log('');
  process.exit(1);
}

// All clear
process.exit(0);
