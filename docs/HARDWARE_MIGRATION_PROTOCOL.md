# 🖥️ Hardware Migration Protocol - RDO Command OS

**Status**: Ready for Execution  
**Target System**: Desktop (7900XT + 9800X3D)  
**Migration Window**: Dec 7-8, 2025 (This Weekend)  
**Current Checkpoint**: AIOPS-0009 Phase 2 Complete (Perfect Stability Point)

---

## 🎯 Why Migrate Now

### ✅ Perfect Timing
- **AIOPS-0008 Complete** - Stable checkpoint, no mid-refactor work
- **Phase 2 Complete** - Visual theme foundation done, Phase 3 can start fresh
- **Git Clean** - All changes committed, working tree clean
- **Natural Break** - Between Phase 2 and Phase 3 (catalog widgets)

### 🚀 Performance Benefits
- **Build Times**: 3-4x faster (Vite builds, TypeScript compilation)
- **Dev Server**: Instant HMR (Hot Module Replacement)
- **Visual Polish**: Phase 3 benefits massively from faster iteration
- **Future-Proof**: 9800X3D + 7900XT = 2-3 years of headroom

---

## 📋 Pre-Migration Checklist (Friday - Today)

### Step 1: Create Stable Tag
```bash
# Tag current state as stable checkpoint
git tag -a stable-pre-migration -m "Stable checkpoint before hardware migration - AIOPS-0009 Phase 2 complete"
git push origin stable-pre-migration
```

### Step 2: Full Repository Backup (3-2-1 Strategy)
```bash
# 1. Local backup (external drive or secondary location)
cd C:\Users\chadl\rdo-app
tar -czf rdo-app-backup-$(date +%Y%m%d).tar.gz . --exclude=node_modules --exclude=.git/objects

# 2. Verify git remote is up to date
git remote -v
# Should show: origin https://github.com/reynaldoivory/rdo-command-os.git

# 3. Push all commits to remote (if not already done)
git push origin main

# 4. Verify remote has all commits
git log --oneline origin/main -5
```

### Step 3: Document Current Environment
```bash
# Capture Node.js version
node --version > migration-env.txt
npm --version >> migration-env.txt

# Capture Git version
git --version >> migration-env.txt

# Capture Cursor version (if available)
# Check: Help > About in Cursor IDE

# Capture installed global packages
npm list -g --depth=0 >> migration-env.txt

# Save to repo
git add migration-env.txt
git commit -m "docs: capture environment state for hardware migration"
git push origin main
```

### Step 4: Export Critical Configurations
```bash
# Export VS Code/Cursor settings (if using)
# Windows: %APPDATA%\Cursor\User\settings.json
# Copy to: docs/migration/cursor-settings.json

# Export Git config
git config --list > docs/migration/git-config.txt

# Export npm config
npm config list > docs/migration/npm-config.txt

# Export environment variables (if any custom ones)
# PowerShell:
Get-ChildItem Env: | Where-Object { $_.Name -like "*NODE*" -or $_.Name -like "*RDO*" } | Format-Table -AutoSize > docs/migration/env-vars.txt
```

### Step 5: Verify All Tests Pass
```bash
# Run full test suite
npm test

# Run linting
npm run lint

# Run build
npm run build

# Verify bundle size
npm run check-size

# All should pass before migration
```

---

## 🚀 Migration Day (Saturday - Dec 7, 2025)

### Phase 1: New System Setup (2-3 hours)

#### 1.1 Install Base Software
```bash
# Install Node.js (match version from migration-env.txt)
# Download from: https://nodejs.org/
# Verify: node --version

# Install Git
# Download from: https://git-scm.com/
# Verify: git --version

# Install Cursor IDE
# Download from: https://cursor.sh/
# Verify: Open Cursor, check version
```

#### 1.2 Clone Repository
```bash
# Clone from GitHub
cd C:\Users\[YourUsername]\
git clone https://github.com/reynaldoivory/rdo-command-os.git rdo-app
cd rdo-app

# Verify remote
git remote -v
# Should show: origin https://github.com/reynaldoivory/rdo-command-os.git

# Checkout main branch
git checkout main

# Verify you're at stable tag
git log --oneline -1
# Should show: feat(AIOPS-0009): apply RDR2 visual theme...
```

#### 1.3 Restore Environment
```bash
# Install dependencies
npm install

# Verify installation
npm list --depth=0

# Restore Git config (if customized)
# Copy from docs/migration/git-config.txt and apply:
# git config --global user.name "Your Name"
# git config --global user.email "your.email@example.com"

# Restore Cursor settings (if customized)
# Copy docs/migration/cursor-settings.json to:
# %APPDATA%\Cursor\User\settings.json
```

#### 1.4 First-Boot Validation
```bash
# Run validation script (create this)
npm run validate-migration

# Or manually:
# 1. Test build
npm run build
# Expected: Build completes in < 15 seconds (vs 45+ on laptop)

# 2. Test dev server
npm run dev
# Expected: Server starts in < 3 seconds
# Open http://localhost:5174
# Verify: App loads, no console errors

# 3. Test linting
npm run lint
# Expected: No errors

# 4. Test bundle size
npm run check-size
# Expected: Within limits (110 kB)

# 5. Run tests
npm test
# Expected: All tests pass
```

### Phase 2: Performance Benchmarking (30 minutes)

#### 2.1 Create Benchmark Script
Create `scripts/benchmark-migration.js`:
```javascript
import { performance } from 'perf_hooks';
import { execSync } from 'child_process';

const benchmarks = {
  build: () => {
    const start = performance.now();
    execSync('npm run build', { stdio: 'inherit' });
    return performance.now() - start;
  },
  lint: () => {
    const start = performance.now();
    execSync('npm run lint', { stdio: 'inherit' });
    return performance.now() - start;
  },
  test: () => {
    const start = performance.now();
    execSync('npm test', { stdio: 'inherit' });
    return performance.now() - start;
  }
};

console.log('🚀 Migration Performance Benchmark\n');
console.log('='.repeat(50));

for (const [name, fn] of Object.entries(benchmarks)) {
  console.log(`\n📊 ${name.toUpperCase()}:`);
  const time = fn();
  console.log(`   ⏱️  ${(time / 1000).toFixed(2)}s`);
}

console.log('\n' + '='.repeat(50));
console.log('✅ Benchmark complete!');
```

#### 2.2 Run Benchmarks
```bash
# Add to package.json:
# "benchmark": "node scripts/benchmark-migration.js"

npm run benchmark

# Record results:
# Build: ___ seconds (target: < 15s)
# Lint: ___ seconds (target: < 5s)
# Test: ___ seconds (target: < 10s)
```

### Phase 3: Parallel Operation Period (48 hours)

#### 3.1 Saturday Evening - Start Parallel Work
- **Laptop**: Keep as backup, don't make new commits
- **Desktop**: Start AIOPS-0009 Phase 3 (catalog widgets)
- **Both**: Sync via GitHub (pull before push)

#### 3.2 Sunday - Validation Day
```bash
# On Desktop:
# 1. Make test commit
echo "# Migration Test" > docs/migration-test.md
git add docs/migration-test.md
git commit -m "test: verify git workflow on new system"
git push origin main

# 2. Verify on Laptop
git pull origin main
# Should see migration-test.md

# 3. Delete test file
git rm docs/migration-test.md
git commit -m "test: remove migration test file"
git push origin main
```

#### 3.3 Monday - Full Day on Desktop
- Complete AIOPS-0009 Phase 3
- Verify all features work
- Run full test suite
- Commit and push

---

## 🔄 Rollback Procedures

### If Migration Fails

#### Scenario 1: Build Fails
```bash
# Check Node.js version matches
node --version
# Compare with migration-env.txt

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# If still fails, check for OS-specific issues
npm run build 2>&1 | tee build-error.log
```

#### Scenario 2: Tests Fail
```bash
# Check if tests are environment-specific
npm test -- --reporter=verbose

# Check for missing environment variables
# Compare with docs/migration/env-vars.txt
```

#### Scenario 3: Git Issues
```bash
# Verify remote connection
git remote -v
git fetch origin

# If authentication fails, re-setup SSH keys or HTTPS credentials
```

#### Scenario 4: Performance Not Improved
```bash
# Check CPU/GPU utilization during build
# Windows: Task Manager > Performance tab

# Verify Node.js is using correct architecture (64-bit)
node -p "process.arch"

# Check for background processes interfering
```

### Emergency Rollback to Laptop
```bash
# On Laptop:
git pull origin main
git checkout stable-pre-migration
# Or:
git reset --hard stable-pre-migration

# Continue work on laptop
# Desktop becomes backup
```

---

## ✅ Post-Migration Validation (Tuesday)

### Day 1 Checklist
- [ ] All tests pass
- [ ] Build completes successfully
- [ ] Dev server starts without errors
- [ ] App loads in browser
- [ ] No console errors
- [ ] Git push/pull works
- [ ] Cursor IDE functions correctly
- [ ] Performance meets expectations

### Day 2 Checklist
- [ ] Complete one full feature (AIOPS-0009 Phase 3)
- [ ] Commit and push successfully
- [ ] Verify on laptop (pull works)
- [ ] No data loss
- [ ] All configurations restored

### Day 3: Decommission Laptop (Optional)
- [ ] 48-hour parallel period complete
- [ ] All work successfully migrated
- [ ] No issues detected
- [ ] Laptop can be repurposed or stored as backup

---

## 📊 Success Metrics

### Performance Targets
| Metric | Laptop (Before) | Desktop (Target) | Improvement |
|-------|----------------|-----------------|-------------|
| Build Time | ~45s | < 15s | 3x faster |
| Dev Server Start | ~8s | < 3s | 2.5x faster |
| HMR Update | ~2s | < 0.5s | 4x faster |
| Test Suite | ~12s | < 5s | 2.4x faster |

### Quality Targets
- ✅ Zero test failures
- ✅ Zero linting errors
- ✅ Bundle size within limits
- ✅ All features functional
- ✅ Git workflow intact

---

## 🛠️ Migration Scripts

### Create `scripts/validate-migration.js`
```javascript
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

console.log('🔍 Validating Migration...\n');

const checks = [
  {
    name: 'Node.js Version',
    command: 'node --version',
    expected: readFileSync('migration-env.txt', 'utf-8').match(/v\d+\.\d+\.\d+/)?.[0]
  },
  {
    name: 'Git Remote',
    command: 'git remote get-url origin',
    expected: 'https://github.com/reynaldoivory/rdo-command-os.git'
  },
  {
    name: 'Dependencies Installed',
    command: 'test -d node_modules && echo "OK" || echo "MISSING"',
    expected: 'OK'
  }
];

let allPassed = true;

for (const check of checks) {
  try {
    const result = execSync(check.command, { encoding: 'utf-8' }).trim();
    const passed = result.includes(check.expected);
    console.log(`${passed ? '✅' : '❌'} ${check.name}: ${result}`);
    if (!passed) allPassed = false;
  } catch (error) {
    console.log(`❌ ${check.name}: FAILED`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n✅ Migration validation passed!');
  process.exit(0);
} else {
  console.log('\n❌ Migration validation failed. Review errors above.');
  process.exit(1);
}
```

Add to `package.json`:
```json
{
  "scripts": {
    "validate-migration": "node scripts/validate-migration.js"
  }
}
```

---

## 📝 Migration Log Template

Create `docs/migration/MIGRATION_LOG.md`:

```markdown
# Hardware Migration Log - Dec 7-8, 2025

## Pre-Migration (Friday)
- [ ] Stable tag created: `stable-pre-migration`
- [ ] Repository backed up (3-2-1 strategy)
- [ ] Environment documented
- [ ] Configurations exported
- [ ] All tests passing

## Migration Day (Saturday)
- [ ] Base software installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] First-boot validation passed
- [ ] Performance benchmarks recorded

## Parallel Operation (Sunday-Monday)
- [ ] Test commit successful
- [ ] Git workflow verified
- [ ] AIOPS-0009 Phase 3 started
- [ ] No issues detected

## Post-Migration (Tuesday)
- [ ] Full validation complete
- [ ] Performance targets met
- [ ] Laptop decommissioned (optional)
```

---

## 🎯 Timeline Summary

| Day | Time | Task | Duration |
|-----|------|------|----------|
| **Friday** | Evening | Pre-migration checklist | 1-2 hours |
| **Saturday** | Morning | New system setup | 2-3 hours |
| **Saturday** | Afternoon | Validation & benchmarking | 1 hour |
| **Saturday** | Evening | Start Phase 3 work | 2-3 hours |
| **Sunday** | All day | Parallel operation validation | 4-6 hours |
| **Monday** | All day | Full day on desktop | 6-8 hours |
| **Tuesday** | Morning | Final validation | 1 hour |
| **Tuesday** | Afternoon | Laptop decommission (optional) | 1 hour |

**Total Migration Time**: ~20-25 hours over 4 days  
**Active Migration Window**: 4-8 hours on Saturday

---

## 🚨 Emergency Contacts & Resources

### If Something Goes Wrong
1. **Git Issues**: Check `docs/migration/git-config.txt`
2. **Build Issues**: Check `migration-env.txt` for version mismatches
3. **Performance Issues**: Run `npm run benchmark` and compare
4. **Data Loss**: Restore from `stable-pre-migration` tag

### Rollback Command
```bash
git checkout stable-pre-migration
git branch -D main
git checkout -b main
```

### Support Resources
- GitHub Issues: https://github.com/reynaldoivory/rdo-command-os/issues
- Cursor Docs: https://cursor.sh/docs
- Node.js Docs: https://nodejs.org/docs

---

## ✅ Ready to Migrate?

**Pre-Migration Checklist Complete?**
- [ ] Stable tag created and pushed
- [ ] Repository backed up (3-2-1)
- [ ] Environment documented
- [ ] All tests passing
- [ ] Configurations exported

**If all checked, you're ready for Saturday migration!** 🚀

---

**Last Updated**: Dec 7, 2025  
**Next Review**: After migration completion

