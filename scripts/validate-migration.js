/* eslint-env node */
/* global process */
// Migration Validation Script
// Run this on new system to verify setup is correct

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Validating Hardware Migration...\n');
console.log('='.repeat(60));

let allPassed = true;
const results = [];

// Check 1: Node.js Version
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const envFile = join(rootDir, 'migration-env.txt');
  let expectedVersion = null;
  
  if (existsSync(envFile)) {
    const envContent = readFileSync(envFile, 'utf-8');
    const match = envContent.match(/v(\d+\.\d+\.\d+)/);
    if (match) expectedVersion = match[1];
  }
  
  const passed = !expectedVersion || nodeVersion.includes(expectedVersion);
  results.push({
    name: 'Node.js Version',
    status: passed ? '✅' : '⚠️',
    value: nodeVersion,
    expected: expectedVersion ? `v${expectedVersion}` : 'Any',
    passed
  });
  if (!passed) allPassed = false;
} catch {
  results.push({
    name: 'Node.js Version',
    status: '❌',
    value: 'FAILED',
    expected: 'N/A',
    passed: false
  });
  allPassed = false;
}

// Check 2: npm Version
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  results.push({
    name: 'npm Version',
    status: '✅',
    value: npmVersion,
    expected: 'Any',
    passed: true
  });
} catch {
  results.push({
    name: 'npm Version',
    status: '❌',
    value: 'FAILED',
    expected: 'N/A',
    passed: false
  });
  allPassed = false;
}

// Check 3: Git Remote
try {
  const gitRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  const expectedRemote = 'https://github.com/reynaldoivory/rdo-command-os.git';
  const passed = gitRemote === expectedRemote || gitRemote.includes('rdo-command-os');
  
  results.push({
    name: 'Git Remote',
    status: passed ? '✅' : '❌',
    value: gitRemote,
    expected: expectedRemote,
    passed
  });
  if (!passed) allPassed = false;
} catch {
  results.push({
    name: 'Git Remote',
    status: '❌',
    value: 'FAILED',
    expected: 'N/A',
    passed: false
  });
  allPassed = false;
}

// Check 4: Dependencies Installed
try {
  const nodeModulesExists = existsSync(join(rootDir, 'node_modules'));
  const packageJsonExists = existsSync(join(rootDir, 'package.json'));
  
  if (nodeModulesExists && packageJsonExists) {
    results.push({
      name: 'Dependencies',
      status: '✅',
      value: 'Installed',
      expected: 'Installed',
      passed: true
    });
  } else {
    results.push({
      name: 'Dependencies',
      status: '❌',
      value: 'Missing',
      expected: 'Installed',
      passed: false
    });
    allPassed = false;
  }
} catch {
  results.push({
    name: 'Dependencies',
    status: '❌',
    value: 'ERROR',
    expected: 'N/A',
    passed: false
  });
  allPassed = false;
}

// Check 5: Build Test
try {
  console.log('\n📦 Testing build (this may take a moment)...');
  const buildStart = Date.now();
  execSync('npm run build', { 
    encoding: 'utf-8',
    stdio: 'pipe',
    cwd: rootDir
  });
  const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2);
  
  results.push({
    name: 'Build Test',
    status: '✅',
    value: `${buildTime}s`,
    expected: '< 15s',
    passed: parseFloat(buildTime) < 15
  });
} catch {
  results.push({
    name: 'Build Test',
    status: '❌',
    value: 'FAILED',
    expected: 'Success',
    passed: false
  });
  allPassed = false;
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('📊 Validation Results:\n');

results.forEach(result => {
  console.log(`${result.status} ${result.name}`);
  console.log(`   Current: ${result.value}`);
  console.log(`   Expected: ${result.expected}`);
  console.log('');
});

console.log('='.repeat(60));

if (allPassed) {
  console.log('\n✅ Migration validation PASSED!');
  console.log('🚀 Your new system is ready for development.\n');
  process.exit(0);
} else {
  console.log('\n❌ Migration validation FAILED.');
  console.log('⚠️  Please review the errors above and fix them before continuing.\n');
  process.exit(1);
}

