#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// INFINITE HORIZON PROTOCOL - PRE-COMMIT GUARD
// Enforces code quality and bundle size budgets before commit
// ═══════════════════════════════════════════════════════════════

const { execSync } = require('child_process');

function run(cmd, label) {
  console.log(`\n⚙️  ${label}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

console.log('\n═══════════════════════════════════════════════════════');
console.log('        INFINITE HORIZON PROTOCOL - PRE-COMMIT');
console.log('═══════════════════════════════════════════════════════\n');

// Run lint-staged (only lints changed files)
if (!run('npx lint-staged', 'Linting staged files')) {
  console.log('\n⛔ ESLint violations detected. Fix before committing.');
  process.exit(1);
}

if (!run('npm run build', 'Building project')) {
  console.log('\n⛔ Build failed. Fix errors before committing.');
  process.exit(1);
}

if (!run('npm run check-size', 'Checking bundle sizes')) {
  console.log('\n⛔ Bundle size budget exceeded. Optimize before committing.');
  process.exit(1);
}

console.log('\n✅ All pre-commit checks passed.\n');
