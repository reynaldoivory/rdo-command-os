/* eslint-env node */
/* global process */
// Pre-Migration Checklist Script
// Run this on current system (laptop) before migration

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('📋 Pre-Migration Checklist\n');
console.log('='.repeat(60));

const checks = [];
let allPassed = true;

// Check 1: Git Status
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  const isClean = gitStatus === '';
  
  checks.push({
    name: 'Git Working Tree Clean',
    status: isClean ? '✅' : '❌',
    message: isClean ? 'No uncommitted changes' : 'Uncommitted changes detected',
    passed: isClean
  });
  
  if (!isClean) {
    console.log('⚠️  Uncommitted changes:');
    console.log(gitStatus);
    allPassed = false;
  }
} catch {
  checks.push({
    name: 'Git Working Tree Clean',
    status: '❌',
    message: 'Git command failed',
    passed: false
  });
  allPassed = false;
}

// Check 2: All Tests Pass
try {
  console.log('\n🧪 Running tests...');
  execSync('npm test', { 
    encoding: 'utf-8',
    stdio: 'inherit',
    cwd: rootDir
  });
  checks.push({
    name: 'All Tests Pass',
    status: '✅',
    message: 'Test suite passed',
    passed: true
  });
} catch {
  checks.push({
    name: 'All Tests Pass',
    status: '❌',
    message: 'Tests failed - fix before migration',
    passed: false
  });
  allPassed = false;
}

// Check 3: Build Succeeds
try {
  console.log('\n📦 Testing build...');
  execSync('npm run build', { 
    encoding: 'utf-8',
    stdio: 'inherit',
    cwd: rootDir
  });
  checks.push({
    name: 'Build Succeeds',
    status: '✅',
    message: 'Build completed successfully',
    passed: true
  });
} catch {
  checks.push({
    name: 'Build Succeeds',
    status: '❌',
    message: 'Build failed - fix before migration',
    passed: false
  });
  allPassed = false;
}

// Check 4: Linting Passes
try {
  console.log('\n🔍 Running linter...');
  execSync('npm run lint', { 
    encoding: 'utf-8',
    stdio: 'inherit',
    cwd: rootDir
  });
  checks.push({
    name: 'Linting Passes',
    status: '✅',
    message: 'No linting errors',
    passed: true
  });
} catch {
  checks.push({
    name: 'Linting Passes',
    status: '❌',
    message: 'Linting errors found - fix before migration',
    passed: false
  });
  allPassed = false;
}

// Check 5: Git Remote Configured
try {
  const gitRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  const hasRemote = gitRemote && gitRemote.includes('rdo-command-os');
  
  checks.push({
    name: 'Git Remote Configured',
    status: hasRemote ? '✅' : '❌',
    message: hasRemote ? `Remote: ${gitRemote}` : 'No remote configured',
    passed: hasRemote
  });
  
  if (!hasRemote) allPassed = false;
} catch {
  checks.push({
    name: 'Git Remote Configured',
    status: '❌',
    message: 'Could not check remote',
    passed: false
  });
  allPassed = false;
}

// Check 6: Capture Environment
try {
  console.log('\n📝 Capturing environment...');
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
  
  const envContent = [
    `Node.js: ${nodeVersion}`,
    `npm: ${npmVersion}`,
    `Git: ${gitVersion}`,
    `Date: ${new Date().toISOString()}`,
    ''
  ].join('\n');
  
  const envFile = join(rootDir, 'migration-env.txt');
  writeFileSync(envFile, envContent);
  
  checks.push({
    name: 'Environment Captured',
    status: '✅',
    message: `Saved to migration-env.txt`,
    passed: true
  });
} catch {
  checks.push({
    name: 'Environment Captured',
    status: '❌',
    message: 'Failed to capture environment',
    passed: false
  });
  allPassed = false;
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('📊 Checklist Results:\n');

checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  console.log(`   ${check.message}`);
  console.log('');
});

console.log('='.repeat(60));

if (allPassed) {
  console.log('\n✅ Pre-migration checklist PASSED!');
  console.log('🚀 You are ready to migrate.\n');
  console.log('Next steps:');
  console.log('1. Create stable tag: git tag -a stable-pre-migration -m "Pre-migration checkpoint"');
  console.log('2. Push tag: git push origin stable-pre-migration');
  console.log('3. Push all commits: git push origin main');
  console.log('4. Review docs/HARDWARE_MIGRATION_PROTOCOL.md for Saturday migration\n');
  process.exit(0);
} else {
  console.log('\n❌ Pre-migration checklist FAILED.');
  console.log('⚠️  Please fix the issues above before migrating.\n');
  process.exit(1);
}

