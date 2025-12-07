# RDO Command OS – AI Stack & Workflow Playbook

## 1. Overview of the Project and Repository

The RDO Command OS project is a modern, responsive web application built using React. The core architectural philosophy is **Context-First**, eliminating the need for prop drilling across the component hierarchy. This approach simplifies state management, improves code readability, and enhances maintainability, especially in collaborative, AI-assisted development environments.

| Key Technology | Description | Architectural Philosophy |
|---|---|---|
| React | Frontend JavaScript library for building user interfaces. | Component-based UI development |
| Context-First | Using React's Context API for global state management. | Eliminates prop drilling, centralized state |
| RDO Command OS | The application name. | Internal React dashboard application. |

---

## 2. Tools and Environments

Our development workflow is anchored by powerful, AI-integrated tools designed for maximum efficiency and collaboration.

### 2.1. Cursor IDE

Cursor is the primary Integrated Development Environment (IDE) used for all coding tasks. Its native integration with multiple Large Language Models (LLMs) is central to our workflow, enabling rapid prototyping, intelligent refactoring, and deep code understanding.

### 2.2. Git and GitHub

- **Git:** Used for local version control, managing branches, and tracking changes.
- **GitHub:** The central remote repository for collaboration, code review, and CI/CD pipelines. All changes are committed via Git and pushed to GitHub.

### 2.3. Cursor Extensions and Configuration

**Core Extensions Enabled:**

- **Error Lens** – Shows TypeScript/JavaScript errors and warnings inline so issues are visible directly in the editor without hovering. This speeds up debugging and reinforces good practices while working in React.
- **ESLint** – Runs the project's ESLint rules on save and highlights violations in real time, enforcing consistent JavaScript/React standards across the repo.
- **Prettier** – Formats code automatically on save to maintain a single, consistent style and avoid formatting debates in reviews.
- **GitLens** – Surfaces Git blame and history inline, so developers can see who changed a line and why, directly from Cursor.
- **Tailwind CSS IntelliSense** – Provides autocomplete, hover docs, and linting for Tailwind classes, reading from the project's Tailwind config to keep UI work fast and consistent.

**Cursor-Specific Settings:**

- **Models** – For this repo, Cursor is configured to use:
  - **Composer 1** for coordinated multi‑file edits.
  - **Claude Opus 4.5** and **GPT‑5.1 Codex Max High** for complex refactors and audits.
  - **Gemini 3 Pro** as an optional secondary consultant model.
- **Rules & Commands (.cursorrules)** – Project rules enforce Context‑First state management, disallow prop drilling, and can be expanded to include folder/layout conventions; Cursor reads these rules before applying AI changes.

---

## 3. LLM Stack inside Cursor

We utilize a diverse suite of LLMs within the Cursor IDE, each selected for its specific strengths to optimize various development tasks.

| Model Name | Primary Use Case | When to Choose |
|---|---|---|
| Composer 1 | Multi-file refactors and coordinated code edits inside Cursor, plus rapid code generation and small fixes. | When you already know what needs to change and want Cursor's native model to apply those edits across files. |
| Claude Opus 4.5 | Complex logical reasoning, high-level architectural feedback, and sophisticated refactoring. | For critical system components, non-trivial algorithms, and detailed code reviews. |
| GPT-5.1 Codex Max High | Deep codebase analysis, understanding legacy code structure, and optimizing performance-critical functions. | When working with highly optimized or intricate code patterns, or for precision changes. |
| Gemini 3 Pro | Technical consulting, validating Context-First patterns, and debugging complex state issues. | When requiring a comprehensive technical explanation or validating design choices against best practices. |

---

### 3.5. Model Selection Decision Tree

**NEW:** Use this decision tree to quickly select the optimal model combination for your task type:

#### New Feature Development
```
1. Perplexity Pro (browser) → Research and plan feature
2. Gemini 3 Pro (browser) → Validate Context-First patterns
3. Cursor Composer 1 → Implement across files
```

#### Complex Bug Diagnosis & Fix
```
1. Claude Opus 4.5 (Cursor) → Reasoning and root cause analysis
2. GPT-5.1 Codex Max High (Cursor) → Precision fix implementation
```

#### Architecture Refactor
```
1. Gemini 3 Pro (browser) → Validate refactor pattern
2. Claude Opus 4.5 (Cursor) → Implement refactor
3. GPT-5.1 Codex Max High (Cursor) → Review and optimize
```

#### Quick Fixes / Styling
```
Cursor Composer 1 only → Fastest iteration for minor changes
```

#### Performance Optimization
```
1. GPT-5.1 Codex Max High (Cursor) → Analyze bottlenecks
2. Claude Opus 4.5 (Cursor) → Strategic refactor
```

**Pro Tip:** For critical features, use the "validation sandwich" approach:
- Plan (Perplexity) → Validate (Gemini) → Implement (Claude Opus) → Review (GPT-5 Codex) → Final check (Gemini)

---

## 4. Browser Assistants

Browser-based AI assistants are used for high-level planning, strategic workflow, and specialized technical consultation outside of the direct coding environment.

### 4.1. Perplexity Pro (Workflow/Strategy)

Perplexity Pro is used as the initial planning and research tool. It excels at:

- Formulating workflow strategies for new features.
- Conducting competitive analysis or researching external libraries.
- Generating high-level project documentation and roadmaps.

### 4.2. Gemini 3 Pro (Technical Consultant with Custom Instructions)

A separate instance of Gemini 3 Pro is maintained in the browser, specifically configured with custom instructions detailing the RDO Command OS architecture (React, Context-First, no prop drilling). This assistant is used to:

- Validate high-level technical patterns proposed by Perplexity.
- Act as a sounding board for complex component design before implementation.
- Ensure all proposed patterns adhere strictly to the Context-First philosophy.

---

## 5. Standard Operating Procedures (SOPs)

### 5.1. Step 0: Project Setup in Cursor

Before starting any task, the Cursor IDE environment must be correctly configured:

1. **Model Selection:** Confirm all required LLMs (Composer 1, Claude Opus 4.5, etc.) are available and active.
2. **.cursorrules File:** Ensure the project's `.cursorrules` file is up-to-date, including rules that prioritize the Context-First architecture and other coding standards.
3. **Project Brief:** Load the current project brief into the Cursor chat context to guide the LLM's understanding of the task.
4. **Pre-Flight Check:** Run `bash scripts/preflight.sh` to verify project structure, documentation, and git status.

### 5.2. Running Audits and Folder Cleanup

Regular audits and cleanup are performed to maintain code health:

- **Audit Request:** Use Claude Opus 4.5 to audit a specific section of the codebase for performance bottlenecks, redundant code, or deviations from the Context-First pattern.
- **Cleanup Task:** Based on the audit, use GPT-5.1 Codex Max High or Claude Opus 4.5 in Cursor to propose and implement folder structure reorganizations, ensuring logical grouping of components and context files; use Gemini 3 Pro in the browser only to validate naming and architectural patterns, not to generate file operations.

### 5.3. Planning, Validation, and Implementation Workflow

This is the core iterative loop for implementing new features or major changes:

1. **Plan with Perplexity Pro:** Outline the feature implementation steps and strategic technical approach using Perplexity Pro. This generates the initial "what to do".
2. **Validate Patterns with Gemini 3 Pro:** Take the plan to the customized Gemini 3 Pro. Ask for feedback on how the plan aligns with the Context-First model and request specific examples of Context/Hook usage. This generates the "how to do it right".
3. **Implement with Cursor:** Use the validated plan and patterns to prompt the LLMs inside the Cursor IDE (primarily Claude Opus 4.5 and Composer 1) to write, refactor, and integrate the code.

### 5.4. Context Package Usage

When switching between AI models (Perplexity → Gemini → Cursor), use the **Context Package Template** to maintain continuity:

1. Open `docs/CONTEXT_PACKAGE_TEMPLATE.md`
2. Fill in current task details, recent commits, and active files
3. Copy the completed package and paste it at the start of each new AI session
4. Increment version number (v1 → v2 → v3) after significant progress

**Benefits:**
- Eliminates 5-10 minutes of "catching up" time per session
- Ensures consistent context across all AI models
- Creates clear checkpoints in your workflow

---

## 6. Safety and Quality Practices

Maintaining code quality and stability is paramount, especially in an AI-assisted environment.

### 6.1. Using Git for Commits and Rollback

- **Atomic Commits:** Each logical change (feature, bug fix, refactor) must be encapsulated in a single, descriptive Git commit.
- **Rollback Procedure:** Always tag major stable versions. Use `git reflog` and `git revert` to safely roll back changes if an AI-generated refactor introduces unexpected side effects.

### 6.2. Testing After Refactors

- **Immediate Testing:** After any LLM-driven refactoring or code generation, run all relevant unit tests.
- **Manual Validation:** Visually inspect the application functionality and perform manual smoke tests on the affected feature.

### 6.3. Keeping Documentation Updated

The LLM stack and workflow evolve rapidly. Ensure this playbook and related project documentation are updated whenever the workflow or AI stack changes.

---

### 6.4. Emergency Rollback Protocol

**NEW:** When AI-generated code introduces critical bugs or breaks the application, follow this protocol immediately:

#### Step 1: Stop All Operations
```bash
# Immediately halt any running AI operations in Cursor
# Do NOT attempt additional AI fixes
```

#### Step 2: Create Safety Backup
```bash
# Create a backup branch of current state
git branch ai-rollback-backup-$(date +%Y%m%d-%H%M%S)

# Verify backup created
git branch --list 'ai-rollback-backup-*'
```

#### Step 3: Find Last Stable Commit
```bash
# View recent commit history
git reflog

# Or view last 10 commits with details
git log --oneline -10

# Identify the last commit where app was stable
# Look for commits tagged with "stable" or before the breaking change
```

#### Step 4: Revert to Stable State
```bash
# Option A: Hard reset (discards all changes after stable commit)
git reset --hard [STABLE-COMMIT-SHA]

# Option B: Soft reset (keeps changes as uncommitted)
git reset --soft [STABLE-COMMIT-SHA]

# Option C: Create revert commit (preserves history)
git revert [BAD-COMMIT-SHA]
```

#### Step 5: Verify Stability
```bash
# Install dependencies (if package.json changed)
npm install

# Run tests
npm test

# Start dev server and verify app works
npm run dev
```

#### Step 6: Document the Incident

Add an entry to `docs/AI_OPS_LOG.md` under the failed AIOPS task:

```markdown
**ROLLBACK PERFORMED:**
- Date: [timestamp]
- Reason: [what AI broke]
- Reverted from: [bad commit SHA]
- Reverted to: [stable commit SHA]
- Root cause: [AI misunderstood X / violated Context-First / etc.]
- Prevention: [update .cursorrules / add constraint / etc.]
```

#### Step 7: Update .cursorrules (If Needed)

If the AI violated an architectural rule:

```bash
# Open .cursorrules and add explicit constraint
# Example: "NEVER use Redux - use Context API only"
# Commit the updated rules
git add .cursorrules
git commit -m "docs: add .cursorrules constraint to prevent [specific issue]"
```

#### Step 8: Resume Work Safely

- Re-approach the original task with **more specific prompts**
- Use a **different model** (e.g., switch from Composer 1 to Claude Opus 4.5)
- Break the task into **smaller, incremental steps**
- Test after **each small change** before proceeding

**Critical Reminder:** Never let AI "fix" its own breaking changes without human review. Roll back first, then re-approach methodically.

---

## 7. Continuous Improvement

### 7.1. Workflow Metrics

Track these metrics in your AI Ops Log to refine the workflow:

- Time saved per AI-assisted task
- Bugs introduced by AI vs. fixed by AI
- Success rate of different model combinations
- Frequency of rollbacks (target: <5% of tasks)

### 7.2. Playbook Updates

This playbook should be treated as a living document. Update it:

- After discovering new model capabilities
- When workflow inefficiencies are identified
- After emergency rollbacks (document what went wrong)
- When new AI models become available

---

**Last Updated:** December 7, 2025  
**Version:** 2.0 (Added Model Selection Decision Tree, Emergency Rollback Protocol, Context Package workflow)
