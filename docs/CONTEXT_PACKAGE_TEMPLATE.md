# Context Package Template

**Purpose:** Copy this template at the start of every Perplexity Pro or Gemini 3 Pro session to maintain continuity across AI models. This eliminates 5-10 minutes of "catching up" time.

---

## Context Package v[N] - [Date]

### Current Task
- **AIOPS ID:** AIOPS-00XX
- **Phase:** [MVP Phase X - Feature Name]
- **Goal:** [One sentence description of what you're trying to accomplish]
- **Blockers:** [None / List any blockers]
- **Context:** [Brief explanation of why this task exists]

---

### Architecture Summary

**Pattern:** Context-First (no prop drilling)

**File Structure:**
- **Components:** `src/components/widgets/` (all UI panels)
- **Layout:** `src/components/layout/` (Dashboard.jsx orchestrator)
- **Contexts:** `src/context/` (modular: hooks, constants, instance, index)
- **Registry:** `src/components/PanelsRegistry.jsx` (widget registry)
- **Logic:** `src/logic/` (pure functions, no React)

**Key Rules:**
- NO prop drilling—state flows via Context only
- Widgets MUST be in `src/components/widgets/`
- All contexts are modular (split into hooks, constants, instance files)
- Dashboard.jsx orchestrates layout via PanelsRegistry
- React.lazy used for code-splitting

---

### Recent Changes (Last 3 Commits)

1. **[SHA]** - [Commit message]
   - Summary: [What changed]
   
2. **[SHA]** - [Commit message]
   - Summary: [What changed]
   
3. **[SHA]** - [Commit message]
   - Summary: [What changed]

---

### Active Files (Currently Working On)

- **[File path]** - [Brief description of purpose]
- **[File path]** - [Brief description of purpose]
- **[File path]** - [Brief description of purpose]

---

### Current State

**What's Working:**
- [List features that are stable]

**What's Broken/In Progress:**
- [List issues or incomplete work]

**Next Immediate Steps:**
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

---

### .cursorrules Reminder (Critical Constraints)

```
ARCHITECTURE PROTOCOL:
- Context providers: src/context/
- Widgets: src/components/widgets/
- Layout orchestrators: src/components/layout/
- Pure logic: src/logic/
- NO prop drilling (use Context)
- PanelsRegistry pattern for dynamic layouts
- Dashboard as layout orchestrator ONLY
```

---

### Related Documentation

- **AI Ops Log:** `docs/AI_OPS_LOG.md` (entry AIOPS-00XX)
- **Architecture:** `docs/ARCHITECTURE.md`
- **Workflow Playbook:** `docs/AI_STACK_WORKFLOW_PLAYBOOK.md`
- **Implementation Guide:** [Specific guide if applicable]

---

## Example Usage

**When starting a Perplexity Pro session:**
```
I'm continuing work on RDO Command OS. Here's my context:

[Paste Context Package v3 from above]

Now help me plan the implementation of [specific feature].
```

**When starting a Gemini 3 Pro session:**
```
Acting as my React/architecture consultant for RDO Command OS:

[Paste Context Package v3 from above]

Validate this approach against Context-First principles: [describe approach]
```

---

## Version History

**v1 (Dec 7, 2025):** Initial template created after AIOPS-0009 (Visual Polish)

---

**Pro Tip:** Increment the version number (v1 → v2 → v3) each time you switch between models or after significant progress. This creates clear checkpoints in your workflow.
