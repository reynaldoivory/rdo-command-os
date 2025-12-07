# 🌊 DEEP WATER PROTOCOL: Staged Deployment
**Target:** Zero to Senior-Speed via Staged Progression.
**Role:** Junior Developer / Intern
**Status:** REQUIRED READING

---

## STAGE I: THE TOOLCHAIN (Force Multipliers)
1.  **Install Cursor:** Download from [cursor.com](https://cursor.com).
    * *Note:* Cursor is a fork of VS Code optimized for AI. Use it as your primary editor.
2.  **Student Unlock:** Go to [cursor.com/students](https://cursor.com/students) and verify with your `.edu` email.
    * *Why:* This grants you **$240/yr of Pro AI** for free. Do not use the limited trial; grab the grant.
3.  **Open Repo:** `File > Open Folder` > Select the **Root** of this repo.
    * *Critical:* You must open the root folder (containing `.git` and `package.json`) so the AI understands the full project context.

---

## STAGE II: THE CONFIGURATION (Clean Cockpit)

### Stage II.1: Model Selection
1.  **Select the Brain:**
    * Open **Settings** (Gear Icon or `Cmd/Ctrl + Shift + J`).
    * Navigate to **Models**.
    * Enable the strongest reasoning model available (Currently **Claude 3.5 Sonnet** or best available).

### Stage II.2: Extensions
2.  **Install Extensions (Only These 4):**
    * **ESLint:** The law.
    * **Prettier:** The polish.
    * **Tailwind CSS IntelliSense:** The speed.
    * **GitLens:** The history.

3.  **TOOLING CONFLICT:** Do **NOT** install the "GitHub Copilot" extension inside Cursor.
    * *Reason:* Cursor has its own native "Tab" autocomplete that is context-aware. Running Copilot alongside it causes overlapping suggestions and UI noise. Stick to the native tools for this workflow.

### Stage II.3: Optimize Editor Behavior
4.  **Format & Save:**
    * Settings → Editor: Format On Save → **Enable**
    * Settings → Editor: Default Formatter → **Prettier**
    * *Why:* AI edits get auto-normalized; no manual formatting needed.

5.  **Auto Save:**
    * Settings → Files: Auto Save → **afterDelay**
    * Settings → Files: Auto Save Delay → **1000ms**
    * *Why:* Multi-file Composer edits don't leave orphaned unsaved buffers.

6.  **ESLint Integration:**
    * Settings → ESLint: Auto Fix On Save → **Enable**
    * Settings → Editor: Code Actions On Save → Add `"source.fixAll.eslint": true`
    * *Why:* Lint errors from AI code get fixed immediately.

7.  **Model Consistency:**
    * Settings → Cursor → General → Use [model] for both Chat and Composer → **Enable**
    * *Why:* No "model switching confusion" mid-session.

8.  **Git Integration:**
    * Enable GitLens inline blame and file annotations
    * Settings → Git: Auto Fetch → **Enable**
    * *Why:* Always see who changed what; fewer "wait, did I write this?" moments.

---

## STAGE III: THE GOVERNANCE (.cursorrules)
*Cursor reads this file to understand our architecture. Without it, the AI defaults to generic, sloppy patterns.*

**Action:** Verify `.cursorrules` exists in the project root and contains the architecture protocol.

**What it does:**
- Defines folder structure and purposes
- Enforces Context-First architecture (no prop drilling)
- Specifies Registry Pattern for widgets
- Sets AI tone (explain vs. ship code)

**If missing, create it now** (see `.cursorrules` file content below).

---

## STAGE IV: THE WORKFLOW (How to Swim)

### A. The "Tab" (Micro-Edits)
**Context:** Writing a single function or finishing a line.
**Action:** Just type. Cursor will show gray ghost text.
**Trigger:** Press Tab to accept.
**Why:** It predicts your next move based on your last 10 edits.

### B. The "Composer" (Macro-Edits)
**Context:** Refactoring, creating new features, or touching multiple files.
**Trigger:** Click the Composer button (or use default shortcut Cmd/Ctrl + I).
**Action:** Type a natural language instruction.

**Example prompt:**

Refactor all widgets in src/components/widgets to use useProfile()
instead of receiving profile as props. Update PanelsRegistry and
Dashboard accordingly. Respect .cursorrules: context-first architecture.

text

**Power:** It edits multiple files at once. This is your superpower.

### C. The "Chat" (Understanding)
**Context:** You are lost or don't understand the architecture.
**Trigger:** Open the Chat Panel (or use default shortcut Cmd/Ctrl + L).
**Action:** Type @Codebase followed by your question.

**Example:**

@Codebase Explain how NextBestAction calculates priority and
which components consume it.

text

---

## STAGE V: QUALIFICATION (The Breach)
Execute this drill to prove your environment is active. You must not edit files manually.

### The Drill

1. **Open Composer:** (Cmd/Ctrl + I)

2. **Enter Prompt:**

Create a new AmmoWidget in src/components/widgets that consumes
useProfile to display a dummy ammo count. Register it in
src/components/PanelsRegistry.jsx and add it to the 'left'
column in src/components/Dashboard.jsx.

text

3. **Verify Success:**
   - [ ] Did src/components/widgets/AmmoWidget.jsx get created?
   - [ ] Did src/components/PanelsRegistry.jsx get updated?
   - [ ] Did the dashboard layout update without breaking?
   - [ ] Check GitLens: You should see the AI's diffs clearly.

**If all checks pass: Welcome to the team.**

---

## INFINITE HORIZON PROTOCOLS (Advanced)

### Prompt Best Practices

**Always include scope + files:**

In src/context/ProfileContext.jsx and src/components/Dashboard.jsx,
wire nextBestAction from context and remove profile props from panels.

text

**Restate architectural laws for big changes:**

Respect .cursorrules: logic stays in src/logic, panels use useProfile(),
Dashboard is layout only. Now: [your instruction]

text

**Prefer diffs and patterns:**

Apply the same useProfile() refactor you did in WalletWidget
to all panels in src/components/widgets.

text

**Two modes:**
- Explain mode: "Explain why we keep NextBestAction in src/logic"
- Ship mode: "Do not explain; just update PanelsRegistry to register AmmoWidget"

---

## TROUBLESHOOTING

### "Cursor isn't suggesting code"
- Check model selection (Settings → Models)
- Verify you're on the correct plan (Pro/Student)
- Restart Cursor

### "Composer changes too many files"
- Be more specific in prompt: list exact file paths
- Use "Only modify [file1] and [file2]" in prompt

### "Code doesn't match .cursorrules"
- Explicitly mention .cursorrules in prompt
- Example: "Respect .cursorrules and use useProfile()"

---

## FINAL SYSTEM STATUS
* **Architecture:** Clean (Context-First).
* **Workflow:** Optimized (Cursor + Sonnet).
* **Onboarding:** Automated (Deep Water Protocol).

**Next Steps:** Complete Stage V qualification, then review DOCS/ARCHITECTURE.md for system design overview.