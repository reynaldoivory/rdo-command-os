# AIOPS Quick Reference Card

**Purpose:** Daily quick reference for AI-assisted development workflow. Keep this open during work sessions.

**Last Updated:** December 7, 2025, 11:21 AM EST

---

## 📍 Current Status

### Active Phase
**MVP Phase 5:** Visual Polish (AIOPS-0009)  
**Status:** Phase 2 in progress (core components styled)

### Last Completed
**AIOPS-0008:** Modular ProfileContext + GitHub push (Dec 7, 9:19 AM EST)

### Next Up
- Complete AIOPS-0009 Phase 2 (apply RDR2 theme to remaining widgets)
- Apply theme to catalog widgets
- Final visual QA

---

## 🚨 Last Stable Points

| Rollback Level | AIOPS Entry | Commit SHA | What's Safe |
|---|---|---|---|
| 🟢 **Current Stable** | AIOPS-0008 | `a87510bf` | Everything before visual polish |
| 🟡 Pre-Features | AIOPS-0004 | [See log] | Runtime fixed, architecture solid |
| 🔴 Do Not Go Past | AIOPS-0004 | [See log] | App won't run before this |

**Emergency Rollback:**
```bash
git reset --hard a87510bf  # Rollback to AIOPS-0008
```

---

## 🧠 Model Decision Tree

### When to Use Which Model

```
Need to...                          →  Use this model
──────────────────────────────────────────────────
Move 5+ files                       →  Composer 1
Design new component                →  Opus 4.5
Debug complex state issue           →  Opus 4.5
Analyze performance                 →  GPT-5 Codex Max High
Validate architecture pattern       →  Gemini 3 Pro (browser)
Plan next feature                   →  Perplexity Pro (browser)
Quick import/export fixes           →  Composer 1
Refactor to Context-First           →  Opus 4.5
Apply visual styling                →  Composer 1
Fix React Fast Refresh warnings     →  Opus 4.5
```

### Multi-Model Workflows

**New Feature (Full Cycle):**
```
1. Perplexity Pro → Plan approach
2. Gemini 3 Pro   → Validate Context-First patterns
3. Opus 4.5       → Implement in Cursor
4. Manual Testing → Verify functionality
```

**Bug Fix (Fast Track):**
```
1. Opus 4.5       → Diagnose in Cursor
2. GPT-5 Codex    → Precision fix
3. Manual Testing → Verify fix
```

**Quick Styling:**
```
1. Composer 1 only → Apply Tailwind classes
```

---

## ✅ Pre-Work Checklist

**Before Starting Any AIOPS Task:**

```bash
# 1. Run pre-flight check
bash scripts/preflight.sh

# 2. Verify git status
git status  # Should be clean or only expected changes

# 3. Pull latest (if working with team)
git pull origin main

# 4. Check last AIOPS entry
tail -50 docs/AI_OPS_LOG.md
```

**In Your Head:**
- [ ] Do I know what AIOPS entry this will be? (AIOPS-00XX)
- [ ] Have I filled out the Context Package Template?
- [ ] Do I know which model(s) to use? (Check decision tree above)
- [ ] Have I reviewed related AIOPS entries?
- [ ] Is .cursorrules loaded in Cursor?

---

## ✅ Post-Work Checklist

**After Completing Any AIOPS Task:**

```bash
# 1. Run linter
npm run lint

# 2. Run tests (if they exist)
npm test

# 3. Build check
npm run build

# 4. Verify in browser
npm run dev
# Open localhost and test manually

# 5. Check console for errors
# (No red errors allowed)
```

**Documentation:**
- [ ] Fill out AIOPS entry in AI_OPS_LOG.md
  - Use docs/AIOPS_ENTRY_TEMPLATE.md
  - Include model performance notes
  - Document validation results
  - Add git commit SHA
- [ ] Update AIOPS_ROLLBACK_INDEX.md if new stable point
- [ ] Commit with semantic message

```bash
git add .
git commit -m "feat(scope): description [AIOPS-00XX]"
git push origin main
```

---

## 🚨 Emergency Procedures

### If AI Breaks the App

**Step 1: STOP**
- Do NOT let AI "fix" its own breaking changes
- Do NOT make additional changes

**Step 2: Assess Damage**
```bash
npm run dev  # Does it start?
git status   # What changed?
git diff     # Review actual changes
```

**Step 3: Rollback Decision**

**Option A: Minor Issue (console error, styling broken)**
```bash
# Manually fix the specific issue
# Commit fix separately
```

**Option B: Major Issue (app won't load, runtime errors)**
```bash
# 1. Create backup
git branch emergency-backup-$(date +%Y%m%d-%H%M%S)

# 2. Find last stable
grep -A 2 "Current Stable" docs/AIOPS_ROLLBACK_INDEX.md

# 3. Rollback
git reset --hard [STABLE-COMMIT-SHA]

# 4. Verify
npm install && npm run dev
```

**Step 4: Document**
- Add rollback note to failed AIOPS entry
- Update AIOPS_ROLLBACK_INDEX.md
- Update .cursorrules if AI violated a rule

**Step 5: Re-Approach**
- Break task into smaller steps
- Use different model
- Add more specific constraints to prompt

---

## 📚 Key Files

### Documentation
- **AI Ops Log:** `docs/AI_OPS_LOG.md` (complete history)
- **Playbook:** `docs/AI_STACK_WORKFLOW_PLAYBOOK.md` (workflow guide)
- **Rollback Index:** `docs/AIOPS_ROLLBACK_INDEX.md` (emergency recovery)
- **Entry Template:** `docs/AIOPS_ENTRY_TEMPLATE.md` (for new entries)
- **Context Package:** `docs/CONTEXT_PACKAGE_TEMPLATE.md` (multi-model sessions)
- **Architecture:** `docs/ARCHITECTURE.md` (Context-First rules)
- **Prompt Templates:** `docs/PROMPT_TEMPLATES.md` (proven prompts)

### Scripts
- **Pre-Flight:** `bash scripts/preflight.sh` (run before work)

### Configuration
- **Cursor Rules:** `.cursorrules` (AI constraints)
- **Tailwind Config:** `tailwind.config.cjs` (RDR2 theme)

---

## 📊 Current Metrics (Track These)

### Model Performance (AIOPS-0001 through AIOPS-0008)
- **Opus 4.5:** 3 tasks, 3 successes (100%)
- **Composer 1:** 3 tasks, 3 successes (100%)
- **Gemini 3 Pro:** 2 validations, 2 successes (100%)
- **GPT-5 Codex:** 0 tasks (not needed yet)

### Time Savings
- **Context Package:** ~5-10 min/session
- **Pre-Flight Script:** ~2-3 min/session
- **Model Decision Tree:** ~3-5 min/session
**Total:** ~10-18 min saved per session

### Rollbacks
- **Total:** 0 (target: <5% of tasks)
- **Last Rollback:** None

---

## 📝 Common Commands

### Git
```bash
# View recent commits
git log --oneline -10

# View reflog (for recovery)
git reflog

# Create backup branch
git branch backup-$(date +%Y%m%d-%H%M%S)

# Rollback (CAREFUL)
git reset --hard [COMMIT-SHA]

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

### NPM
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Lint check
npm run lint

# Lint fix
npm run lint -- --fix

# Build production
npm run build

# Run tests
npm test
```

### Cursor
```bash
# Open project
cursor .

# (In Cursor) Open .cursorrules
Ctrl+P → type .cursorrules

# (In Cursor) Use Composer
Ctrl+K or Cmd+K
```

---

## 🤔 When in Doubt

1. **Check the Playbook** (Section 3.5 - Model Selection Decision Tree)
2. **Review Last AIOPS Entry** (what was done last?)
3. **Run Pre-Flight Check** (`bash scripts/preflight.sh`)
4. **Use Context Package Template** (maintain continuity)
5. **Start Small** (test incrementally, commit often)

---

## 🚀 Productivity Tips

### Keep These Open During Work
1. This Quick Reference Card
2. AIOPS_ROLLBACK_INDEX.md (emergency reference)
3. Current AIOPS entry (in AI_OPS_LOG.md)
4. Model Decision Tree (Section 3.5 in Playbook)

### Keyboard Shortcuts (Cursor)
- `Ctrl+K` / `Cmd+K` → Composer
- `Ctrl+P` / `Cmd+P` → Quick Open
- `Ctrl+Shift+P` / `Cmd+Shift+P` → Command Palette
- `Ctrl+`` ` → Terminal

### Time-Saving Habits
- Always run `preflight.sh` first (2 min upfront saves 20 min debugging)
- Fill Context Package before switching models (5 min saves 10 min)
- Commit after each atomic change (easy rollback)
- Test after each change (catch issues early)

---

**This is a living document. Update after each major workflow change or AIOPS milestone.**

**Version:** 1.0  
**Created:** December 7, 2025  
**Next Review:** After AIOPS-0010
