# AI Anti-Patterns & Lessons Learned

**Purpose:** Document mistakes made during AI-assisted development to prevent recurrence. Learn from experience, not repetition.

**Principle:** Every mistake is a future prevention opportunity.

**Last Updated:** December 7, 2025

---

## How to Use This Document

1. **Before Starting Work:** Review relevant sections for your task type
2. **After Discovering Issues:** Add new anti-patterns immediately
3. **During Planning:** Reference when creating prompts
4. **Weekly Review:** Update Playbook with lessons learned

---

## ❌ Prompting Anti-Patterns

### Don't: Ask for "Fix All Errors" Without Scope

**Entry:** AIOPS-0005  
**What Happened:** Initially asked agent to "fix all errors" - it tried to refactor business logic instead of just cleaning imports.

**Why It Failed:**
- AI interpreted "all errors" too broadly
- Made architectural changes when only lint cleanup needed
- Introduced new issues while fixing old ones

**Better Approach:**
```
Fix unused imports and unused variables only.
Do NOT change business logic.
Do NOT refactor component structure.
Do NOT modify function signatures.
```

**Prevention:**
- Always scope AI tasks with explicit boundaries
- Use negative constraints ("Do NOT...")
- Specify what should NOT change

**Playbook Update:** Section 5.3 - Add "Scoping AI Tasks" subsection

---

### Don't: Assume AI Knows Your Architecture

**Entry:** AIOPS-0002  
**What Happened:** Asked AI to "organize components better" without specifying Context-First rules - it created Redux-style architecture.

**Why It Failed:**
- AI defaulted to common patterns, not your custom architecture
- Violated Context-First principles
- Required full rewrite

**Better Approach:**
```
@.cursorrules Refactor components folder to match architecture rules:
- Move [specific files] to src/components/widgets/
- Maintain Context-First pattern (no prop drilling)
- Update imports in PanelsRegistry.jsx
```

**Prevention:**
- Always tag @.cursorrules in Cursor
- Reference specific architecture rules
- Provide explicit file paths
- Include examples of correct patterns

**Playbook Update:** Section 5.1 - Emphasize @.cursorrules usage

---

### Don't: Use Vague Descriptors Like "Better" or "Cleaner"

**What Happens:**
- "Make this code cleaner" → AI adds unnecessary abstractions
- "Make this UI better" → AI changes functionality, not just styling
- "Improve performance" → AI optimizes wrong bottlenecks

**Better Approach:**
- "Extract this 50-line function into 3 smaller functions with single responsibilities"
- "Change button color from blue to gold (#D4AF37) and increase padding to p-4"
- "Memoize this expensive calculation using useMemo with dependencies [x, y]"

**Prevention:**
- Be specific about WHAT to improve
- Define "better" with measurable criteria
- Provide exact values (colors, sizes, metrics)

---

## ❌ Architecture Anti-Patterns

### Don't: Assume Default Exports Exist

**Entry:** AIOPS-0004  
**What Happened:** React.lazy crashed because EfficiencyEngine.jsx had no default export.

**Why It Failed:**
- AI created component with named export only
- React.lazy() requires default export
- Runtime crash on code-split load

**Error Message:**
```
Error: Element type is invalid: expected a string or a class/function
but got: undefined. Check the render method of `Lazy`.
```

**Better Approach:**
- Always verify lazy-loaded components have `export default`
- Use this prompt template:
```
Create ComponentName.jsx with:
1. Function component
2. Default export (for React.lazy)
3. Named export for testing

export default function ComponentName() { ... }
export { ComponentName }; // For tests
```

**Prevention:**
- Add to .cursorrules: "All lazy-loaded components MUST have default export"
- Code review checklist item
- ESLint rule (if possible)

**Playbook Update:** Section 10 - Add to anti-patterns list

---

### Don't: Interpolate Objects Directly in JSX

**Entry:** AIOPS-0004  
**What Happened:** Error "Cannot convert object to primitive value" when rendering `{profile}` in JSX.

**Why It Failed:**
- React can't render objects directly
- Need to access primitive properties
- Common mistake when working with Context

**Error Message:**
```
Uncaught Error: Objects are not valid as a React child
(found: object with keys {name, role, wallet}).
```

**Better Approach:**
```javascript
// ❌ Wrong
<div>{profile}</div>

// ✅ Correct
<div>{profile.name}</div>
<div>{profile.role.current}</div>
<div>${profile.wallet.gold.toFixed(2)}</div>
```

**Prevention:**
- Add to .cursorrules: "Only render primitives in JSX"
- Destructure context values immediately
- Use template: `const { name, role } = useProfile();`

**Playbook Update:** Section 4 - Context-First guidelines

---

### Don't: Trust Bundle Size Limits Blindly

**Entry:** AIOPS-0005  
**What Happened:** Pre-commit blocked valid refactor due to 90kB limit, but bundle was actually optimized correctly.

**Why It Failed:**
- Arbitrary limit set too low
- Tree-shaking was working correctly
- Blocked legitimate feature additions

**Better Approach:**
1. Analyze bundle with `npm run build -- --stats`
2. Check bundle composition (not just size)
3. Verify tree-shaking is working
4. Set limit based on actual requirements
5. Increased to 110kB after analysis

**Prevention:**
- Review bundle analysis before changing limits
- Document WHY limit was set at X kB
- Re-evaluate limits quarterly
- Use bundle analyzer, not just file size

**Playbook Update:** Section 8 - Performance best practices

---

## ❌ Context & State Anti-Patterns

### Don't: Put Component Definitions Inside Context Files

**Entry:** AIOPS-0008  
**What Happened:** Fast Refresh stopped working because ProfileContext.jsx contained both provider and consumer components.

**Why It Failed:**
- React Fast Refresh requires stable component boundaries
- Mixing concerns in single file confuses HMR
- Warning: "Fast Refresh only works with files that only export components"

**Error Message:**
```
Warning: Fast Refresh will perform a full reload when it sees
a file that also exports non-component values.
```

**Better Approach:**
- Split into modular structure:
  - `profileHooks.js` → Custom hooks (useProfile, useCart)
  - `profileConstants.js` → Default values, enums
  - `profileContextInstance.js` → Context instance
  - `ProfileProvider.jsx` → Provider component only
  - `index.js` → Central exports

**Prevention:**
- Add to .cursorrules: "Context files: modular structure required"
- One concern per file
- Hooks separate from components
- Constants separate from logic

**Playbook Update:** Section 2 - Folder responsibilities (src/context/)

---

### Don't: Pass Callbacks Through 2+ Layers as Props

**Pattern:** Prop drilling callbacks

**What It Looks Like:**
```javascript
// ❌ Anti-pattern
<Dashboard>
  <Panel onClick={handler}>
    <Widget onClick={handler}>
      <Button onClick={handler} />
    </Widget>
  </Panel>
</Dashboard>
```

**Why It Fails:**
- Violates Context-First architecture
- Makes refactoring difficult
- Couples components unnecessarily
- Hard to trace data flow

**Better Approach:**
```javascript
// ✅ Context-First
// Create context with handler
const ActionContext = createContext();

// Dashboard provides
<ActionContext.Provider value={{ handleAction }}>
  <Panel>
    <Widget>
      <Button /> {/* Uses useAction() hook directly */}
    </Widget>
  </Panel>
</ActionContext.Provider>

// Button consumes
function Button() {
  const { handleAction } = useAction();
  return <button onClick={handleAction}>Click</button>;
}
```

**Prevention:**
- If passing callbacks through 2+ layers → refactor to Context
- Add ESLint rule to detect prop drilling (research)
- Code review checklist item

**Playbook Update:** Section 4 - Context-First guidelines (expand)

---

## ❌ Git & Version Control Anti-Patterns

### Don't: Commit AI Changes Without Testing

**What Happens:**
- AI generates code that passes linter
- Looks correct in code review
- Breaks at runtime
- Forces emergency rollback

**Better Approach:**
1. AI generates code
2. **Run `npm run dev` and test manually**
3. Check browser console (no errors)
4. Test affected features
5. Run `npm run build` (production check)
6. Then commit

**Prevention:**
- Never skip manual testing
- Use post-work checklist (AIOPS_QUICK_REFERENCE.md)
- "npm run dev" before every commit

---

### Don't: Make Multiple Changes in One Commit

**What Happens:**
- AI fixes 3 unrelated issues
- One fix breaks something
- Can't revert specific fix
- Have to rollback all 3 changes

**Better Approach:**
- One logical change per commit
- Commit after each atomic task
- Use semantic commit messages

**Examples:**
```bash
# ✅ Good (atomic)
git commit -m "fix(ProfileWidget): resolve undefined wallet error"
git commit -m "refactor(context): split ProfileContext into modular files"
git commit -m "chore(lint): remove unused imports from widgets"

# ❌ Bad (mixed)
git commit -m "fixes and improvements"
```

**Prevention:**
- Commit after each AIOPS subtask
- Use Git staging area strategically
- Review diff before committing

---

## ❌ Model Selection Anti-Patterns

### Don't: Use Opus 4.5 for Simple Tasks

**What Happens:**
- Opus over-engineers simple fixes
- Adds unnecessary abstractions
- Takes 10 minutes instead of 2
- Creates complex solution to simple problem

**Example:**
- Task: "Change button color to gold"
- Opus: Creates theme system, color utilities, design tokens
- Composer 1: Changes `className="bg-blue-500"` to `className="bg-rdo-gold"`

**Better Approach:**
- Simple tasks → Composer 1
- Architectural tasks → Opus 4.5
- Check Model Decision Tree (AIOPS_QUICK_REFERENCE.md)

**Prevention:**
- Follow decision tree strictly
- "When in doubt, start simple"
- Escalate to Opus only if Composer fails

---

### Don't: Switch Models Mid-Task Without Context Package

**What Happens:**
- Start with Perplexity planning
- Switch to Cursor Composer
- Composer doesn't know the plan
- Implements different approach
- Wastes 20 minutes re-explaining

**Better Approach:**
1. Plan in Perplexity
2. Fill Context Package Template
3. Paste Context Package into Cursor
4. Execute with full context

**Prevention:**
- Always use Context Package Template
- Never switch models without context handoff
- See CONTEXT_PACKAGE_TEMPLATE.md

---

## ❌ Testing & Validation Anti-Patterns

### Don't: Trust "It Builds" as Validation

**What Happens:**
- `npm run build` succeeds
- Deploy to production
- Runtime error on user interaction
- Emergency rollback

**Why "Build Passes" Isn't Enough:**
- Build checks syntax, not logic
- Doesn't test user workflows
- Misses runtime errors
- Misses edge cases

**Better Approach:**
1. ✅ Build passes
2. ✅ Lint passes
3. ✅ Manual testing (affected features)
4. ✅ Console clean (no errors)
5. ✅ Test edge cases (corrupted data, empty states)
6. Then deploy

**Prevention:**
- Use validation checklist (AIOPS_ENTRY_TEMPLATE.md)
- Never skip manual testing
- Document edge cases tested

---

## 📚 Adding New Anti-Patterns

**When You Discover a Mistake:**

1. **Document Immediately** (while fresh in memory)
2. **Use This Template:**

```markdown
### Don't: [Concise description]

**Entry:** AIOPS-XXXX  
**What Happened:** [Specific mistake]

**Why It Failed:**
- [Root cause 1]
- [Root cause 2]

**Error Message:** (if applicable)
```
[Exact error text]
```

**Better Approach:**
[Correct way to do it]

**Prevention:**
- [How to avoid in future]
- [Tool/rule to add]

**Playbook Update:** [Section to update]
```

3. **Update Related Docs:**
   - .cursorrules (if architectural)
   - Playbook (if workflow)
   - Quick Reference (if daily use)

4. **Tag in AIOPS Log:**
   - Add to "Learnings" section
   - Reference this anti-pattern

---

## 📊 Anti-Pattern Statistics

**Track these metrics:**

| Category | Count | Last Occurrence |
|---|---|---|
| Prompting | 3 | AIOPS-0005 |
| Architecture | 3 | AIOPS-0008 |
| Git/Version Control | 2 | AIOPS-0005 |
| Model Selection | 2 | N/A (preventive) |
| Testing | 1 | AIOPS-0004 |

**Goal:** Reduce recurrence rate to 0%

---

## ✅ Success Patterns (What DOES Work)

### Do: Use Explicit File Paths
**Success Rate:** 100% (5/5 tasks)

### Do: Scope AI Tasks with "Do NOT" Constraints
**Success Rate:** 100% (3/3 tasks)

### Do: Test After Each Atomic Change
**Success Rate:** 100% (prevented 2 issues)

### Do: Use Context Package for Model Switching
**Success Rate:** 100% (saved 10+ min per session)

---

**This document grows with experience. Every mistake is a lesson.**

**Version:** 1.0  
**Created:** December 7, 2025  
**Review:** After each rollback or significant issue
