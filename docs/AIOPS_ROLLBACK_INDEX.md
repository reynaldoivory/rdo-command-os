# AIOPS Rollback Index

**Purpose:** Quick reference for safe rollback points when AI-generated code breaks the application. Organized by feature and model for rapid emergency recovery.

**Last Updated:** December 7, 2025  
**Current Stable:** AIOPS-0009 (Phase 2 complete - RDR2 visual theme applied to core components)

---

## 🚨 Quick Emergency Rollback

**If the app is completely broken:**
```bash
# 1. Find last stable commit
git reflog | grep -i "stable\|complete\|working"

# 2. Create backup
git branch emergency-backup-$(date +%Y%m%d-%H%M%S)

# 3. Rollback to AIOPS-0008 (last fully stable)
git reset --hard a87510bf  # AIOPS-0008 completion commit

# 4. Verify
npm install && npm run dev
```

---

## By Feature / System

### Architecture Foundation
**AIOPS-0001 → AIOPS-0004**  
**Feature:** Context-First structure, PanelsRegistry pattern, Dashboard orchestrator

| AIOPS Entry | Commit SHA | Status | What's Stable |
|---|---|---|---|
| AIOPS-0001 | [Find in log] | ✅ Stable | Model config, .cursorrules verified |
| AIOPS-0002 | [Find in log] | ✅ Stable | Widgets moved to /widgets folder |
| AIOPS-0003 | [Find in log] | ✅ Stable | Dashboard.jsx created |
| AIOPS-0004 | [Find in log] | ✅✅ **Recommended** | Runtime errors fixed, lazy loading working |

**Safe Rollback Point:** AIOPS-0004  
**Critical Dependencies:** PanelsRegistry.jsx, Dashboard.jsx, all widget imports  
**Rollback Risk:** LOW (isolated architectural changes)

**Emergency Command:**
```bash
git reset --hard [AIOPS-0004-COMMIT-SHA]
```

---

### Code Quality & Linting
**AIOPS-0005 → AIOPS-0006**  
**Feature:** ESLint cleanup, bundle size adjustments, functional verification

| AIOPS Entry | Commit SHA | Status | What's Stable |
|---|---|---|---|
| AIOPS-0005 | [Find in log] | ✅ Stable | All lint errors fixed, bundle < 110kB |
| AIOPS-0006 | [Find in log] | ✅ Stable | Manual verification complete, no regressions |

**Safe Rollback Point:** AIOPS-0005 (if you need clean linting but not full verification)  
**Critical Dependencies:** ESLint config, package.json bundle limits  
**Rollback Risk:** LOW (mostly cleanup, no functional changes)

---

### User Interactivity & State Management
**AIOPS-0007 → AIOPS-0008**  
**Feature:** Editable profiles, wallet, roles + modular ProfileContext refactor

| AIOPS Entry | Commit SHA | Status | What's Stable |
|---|---|---|---|
| AIOPS-0007 | [Find in log] | ✅ Stable | Edit mode working, localStorage persistence |
| AIOPS-0008 | a87510bf | ✅✅ **Recommended** | Modular context structure, Fast Refresh fixed |

**Safe Rollback Point:** AIOPS-0008 (current stable before visual polish)  
**Critical Dependencies:**
- `src/context/profileHooks.js`
- `src/context/profileConstants.js`
- `src/context/profileContextInstance.js`
- `src/context/index.js`
- All components importing from `./context`

**Rollback Risk:** MEDIUM (affects all profile-dependent widgets)  
**Warning:** Rolling back past AIOPS-0007 loses edit functionality

**Emergency Command:**
```bash
# Rollback to AIOPS-0008 (recommended)
git reset --hard a87510bf

# Or rollback to AIOPS-0007 (if modular context is broken)
git reset --hard [AIOPS-0007-COMMIT-SHA]
```

---

### Visual Polish (RDR2 Theme)
**AIOPS-0009 (IN PROGRESS)**  
**Feature:** Red Dead Redemption 2 visual aesthetic

| Phase | Commit SHA | Status | What's Stable |
|---|---|---|---|
| Phase 1: Foundation | d876f7b3 | ✅ Complete | Tailwind config with RDR2 colors |
| Phase 1: Foundation | 2a0db255 | ✅ Complete | Implementation guide created |
| Phase 1: Foundation | a87510bf | ✅ Complete | AI Ops Log updated |
| Phase 2: Components | [Pending] | 🔄 In Progress | Core components styled |
| Phase 3: Final Polish | [Pending] | ⏳ Not Started | Catalog widgets, hover states |

**Safe Rollback Point (if visual theme breaks):**
- **Before visual work:** a87510bf (AIOPS-0008 - stable functional app)
- **After Tailwind config:** d876f7b3 (colors added, not yet applied)

**Critical Dependencies:**
- `tailwind.config.cjs` (RDR2 colors)
- All component files (if Phase 2 applied)

**Rollback Risk:** LOW (visual-only changes, no logic affected)  
**Note:** Phase 2 component updates are safe to revert individually

**Emergency Command:**
```bash
# Rollback all visual changes (back to gray theme)
git reset --hard a87510bf  # Before AIOPS-0009 started

# Rollback component styling only (keep Tailwind config)
git reset --hard d876f7b3  # After colors added, before applied
```

---

## By Model Performance

### Opus 4.5 Refactors
**Entries:** AIOPS-0004, AIOPS-0007, AIOPS-0008

**Pattern:** Excellent for structural changes and architectural refactors  
**Success Rate:** 100% (3/3)  
**Risk Profile:**
- ✅ Understands Context-First principles
- ✅ Proposes modular solutions (e.g., splitting ProfileContext)
- ⚠️ May over-engineer simple fixes

**Safe Rollback Strategy:**
- Opus refactors are usually well-architected
- Risk is low, but test thoroughly before committing
- If something breaks, likely a missing import or export

---

### Composer 1 Multi-File Edits
**Entries:** AIOPS-0002, AIOPS-0003, AIOPS-0005

**Pattern:** Fast for file moves and coordinated edits  
**Success Rate:** 100% (3/3)  
**Risk Profile:**
- ✅ Excellent at following explicit instructions
- ✅ Updates imports automatically
- ⚠️ Doesn't validate architectural patterns
- ⚠️ May miss edge cases (e.g., missing default exports)

**Safe Rollback Strategy:**
- Composer changes are usually straightforward to revert
- Risk is low for file moves, medium for logic changes
- Always verify lazy-loaded components have default exports

---

### Gemini 3 Pro Validations
**Entries:** Used in planning for AIOPS-0001, AIOPS-0002

**Pattern:** Validates Context-First patterns before implementation  
**Success Rate:** 100% (validation only, no direct code changes)  
**Risk Profile:**
- ✅ Excellent at catching architectural violations
- ✅ No direct code changes, so no rollback needed
- ✅ Use as safety check before complex refactors

---

### Perplexity Pro Planning
**Entries:** Used in planning for all major phases

**Pattern:** High-level workflow planning and strategy  
**Success Rate:** 100% (planning only)  
**Risk Profile:**
- ✅ No code changes, so no rollback risk
- ✅ Use for feature roadmapping and approach design

---

## Feature Dependency Map

### If You Rollback AIOPS-0008 (Modular Context)
**Breaks:**
- All imports from `src/context` (need to revert to `src/context/ProfileContext`)
- Fast Refresh will show warnings again

**Still Works:**
- Profile editing (from AIOPS-0007)
- Dashboard layout (from AIOPS-0003)
- Widget structure (from AIOPS-0002)

---

### If You Rollback AIOPS-0007 (Edit Mode)
**Breaks:**
- Wallet editing
- Role editing
- Profile switching

**Still Works:**
- App renders without errors
- Dashboard layout
- Widget structure
- Read-only displays

---

### If You Rollback AIOPS-0004 (Runtime Fixes)
**Breaks:**
- App crashes with "Cannot convert object to primitive value"
- Lazy loading errors

**Still Works:**
- Nothing (app won't run)
- **Do NOT rollback past this point**

---

## Commit SHA Quick Reference

| AIOPS Entry | Commit SHA (Short) | Full SHA | Status |
|---|---|---|---|
| AIOPS-0008 | a87510b | a87510bf7d891f1e7ef79425e33b3517c3071948 | ✅✅ Current Stable |
| AIOPS-0009 (Phase 1) | d876f7b | d876f7b3906e9a0af828557650538f4edb9baa4c | ✅ Tailwind Config |
| AIOPS-0009 (Phase 1) | 2a0db25 | 2a0db2553339aff418fac7fce5ed33e1df91e474 | ✅ Guide Created |
| AIOPS-0009 (Phase 1) | a87510b | a87510bf7d891f1e7ef79425e33b3517c3071948 | ✅ Log Updated |

*(Update this table after each new AIOPS entry)*

---

## Emergency Contact (Models)

**If Opus 4.5 breaks something:**
- → Use GPT-5 Codex Max High to review and fix
- Or rollback and re-approach with Composer 1 + manual review

**If Composer 1 breaks something:**
- → Use Opus 4.5 to diagnose and propose architectural fix
- Or rollback and break task into smaller steps

**If unsure which model broke it:**
- → Check AIOPS log for last entry
- → Review "Model Performance Notes" section
- → Rollback to last ✅✅ Recommended point

---

## Maintenance

**Update this index:**
- After completing each AIOPS entry
- After identifying a new safe rollback point
- After discovering model-specific patterns
- Weekly during AIOPS review sessions

**Review frequency:** Weekly or after every 5 AIOPS entries

---

**Version:** 1.0  
**Created:** December 7, 2025  
**Next Review:** After AIOPS-0009 complete
