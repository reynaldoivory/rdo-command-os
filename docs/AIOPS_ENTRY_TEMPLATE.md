# AIOPS Entry Template (Enhanced)

**Version:** 2.0  
**Purpose:** Standardized template for all AI Ops Log entries. Copy this for each new AIOPS-XXXX task.

---

## Entry # AIOPS-XXXX

**Date / Session Label**  
[Month Day, Year HH:MM AM/PM EST] / [Phase Name] – [Descriptive Task Name]

**Task**  
[One-sentence objective describing what needs to be accomplished]

**Context**

- **Repo:** [repository name]
- **Branch:** [branch name]
- **Scope:** [affected folders/files - be specific]
- **Related Entries:** AIOPS-XXXX (predecessor), AIOPS-YYYY (related)
- **Why Now:** [Brief explanation of why this task is being done now]

---

## Tools & Models Used

| Model | Version | Role in This Task |
|---|---|---|
| [Model Name] | [e.g., Opus 4.5] | [Specific role: planning, implementation, validation] |
| [Model Name] | [e.g., Composer 1] | [Specific role] |
| [Browser Tool] | [e.g., Perplexity Pro] | [Specific role] |

---

## Model Performance Notes

**✅ What Worked Well:**
- **[Model Name]:** [Specific success - e.g., "Correctly identified Fast Refresh violation and proposed modular split"]
- **[Model Name]:** [Specific success]

**⚠️ Limitations Encountered:**
- **[Model Name]:** [What it struggled with - e.g., "Initially suggested suppression instead of refactor"]

**❌ Not Used / Failed:**
- **[Model Name]:** [Why not used or what failed - e.g., "Would have been overkill for this structural change"]

**Learnings:**
- [Model-specific insight gained from this task]
- [Reusable pattern discovered]

---

## Prompts / Commands Used

### Prompt 1: [Short descriptive name]
```
[Exact prompt text - verbatim]
```
- **Target Model:** [Which AI model]
- **Result:** [Brief outcome - success/failure/partial]
- **Notes:** [Any important context about why this prompt worked/failed]

### Prompt 2: [Short descriptive name]
```
[Exact prompt text - verbatim]
```
- **Target Model:** [Which AI model]
- **Result:** [Brief outcome]
- **Notes:** [Context]

*(Add more prompts as needed)*

---

## Actions Taken

**Phase 1: [Planning/Implementation/etc.]**
- [Action 1 with specific file references - e.g., "Moved 20 components from src/components/ to src/components/widgets/"]
- [Action 2 with file references]

**Phase 2: [Next phase name]**
- [Action 3]
- [Action 4]

*(Use phases to organize complex multi-step tasks)*

---

## Outcome

**✅ Successes:**
- [Success criterion 1 with evidence - e.g., "App loads without runtime errors"]
- [Success criterion 2]
- [Success criterion 3]

**⚠️ Warnings / Partial Success:**
- [Warning 1 - e.g., "Bundle size increased by 16kB, within acceptable range"]
- [Warning 2]

**❌ Failures / Regressions:**
- [Failure 1 - if any]
- [Mitigation taken]

---

## Validation

### Manual Testing
- **Test 1:** [What was tested] → **Result:** [Pass/Fail with evidence]
- **Test 2:** [What was tested] → **Result:** [Pass/Fail]
- **Test 3:** [What was tested] → **Result:** [Pass/Fail]

### Automated Testing
- **ESLint:** [✅ Pass / ❌ Fail with error count]
- **Build:** [✅ Pass / ❌ Fail]
- **Unit Tests:** [✅ Pass (X/Y) / ❌ Fail / ⏳ Not run]
- **Bundle Size:** [Current size vs. limit - e.g., "106kB / 110kB"]

### Edge Cases
**⚠️ Not Tested:**
- [Edge case 1 - e.g., "Corrupted localStorage data"]
- [Edge case 2]
- [Plan to test: Now / Later / Never (with reason)]

---

## Git Reference

- **Commit SHA:** [Full hash or short hash]
- **Commit Message:** "[Semantic commit message]"
- **Branch:** [branch name]
- **Files Changed:** [count] ([list critical files])
- **Lines Changed:** +[additions] -[deletions]
- **GitHub Link:** [Direct link to commit on GitHub]

**Semantic Commit Format:**
```
feat(scope): add feature X
fix(scope): resolve bug Y
refactor(scope): restructure Z
chore(scope): cleanup/maintenance
docs(scope): update documentation
```

---

## Duration

- **Total Time:** [X minutes]
  - **Planning:** [X minutes] (Perplexity/Gemini research)
  - **Implementation:** [X minutes] (Cursor coding)
  - **Validation:** [X minutes] (Testing/verification)
  - **Documentation:** [X minutes] (Writing this entry)
- **Blockers:** [None / Description of what caused delays]
- **Context Switches:** [Number of times switched between tools/models]

**Efficiency Notes:**
- [What took longer than expected and why]
- [What was faster than expected and why]

---

## Follow-ups / Next Actions

**Immediate (This Session):**
- [ ] AIOPS-YYYY: [Next task in sequence]
- [ ] [Other immediate action]

**Future (Backlog):**
- [ ] AIOPS-ZZZZ: [Related future task]
- [ ] [Enhancement idea discovered during this task]

**Dependencies:**
- [What other AIOPS entries depend on this being complete]

---

## Notes for Playbook Updates

**Sections to Update:**
- [ ] Section X.Y: [Specific update needed - e.g., "Add Fast Refresh rules to troubleshooting"]
- [ ] PROMPT_TEMPLATES.md: [Add new proven prompt]
- [ ] .cursorrules: [Add new constraint if pattern violated]

**New Patterns Discovered:**
- [Reusable pattern 1]
- [Reusable pattern 2]

---

## Learnings

**What Would You Do Differently?**
- [Retrospective insight 1]
- [Retrospective insight 2]

**What Worked Exceptionally Well?**
- [Success factor 1]
- [Success factor 2]

**Model-Specific Insights:**
- [Which models were best suited for this task type]
- [Which models to avoid for similar tasks]

---

## Anti-Patterns Avoided / Discovered

**✅ Successfully Avoided:**
- [Anti-pattern 1 that was consciously avoided]

**⚠️ Discovered (Add to Anti-Patterns Doc):**
- [New anti-pattern discovered during this task]
- [How to prevent it in future]

---

## Rollback Information

**Safe Rollback Point:**
- **AIOPS Entry:** AIOPS-XXXX (last stable before this change)
- **Commit SHA:** [commit hash]
- **What's Safe:** [What functionality is guaranteed stable at rollback point]

**Critical Dependencies:**
- [File/component 1 that other systems depend on]
- [File/component 2]

**Rollback Risk Assessment:**
- **Low:** [Isolated change, easy to revert]
- **Medium:** [Affects 2-3 systems]
- **High:** [Core architecture change, many dependencies]

---

**Template Version:** 2.0 (Enhanced)  
**Last Updated:** December 7, 2025  
**Changelog:** Added model performance tracking, git metadata, validation status, duration tracking, rollback information.
