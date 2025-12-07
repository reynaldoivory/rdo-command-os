is this ready for DOCS/ saving and printing

# 🛡️ HR SCREENING PROTOCOL: RDO COMMAND OS
**Role:** Junior Developer / Intern
**Interviewer:** HR / Non-Technical Screen
**Time:** 20 Minutes
**Objective:** Filter for "High-Velocity Learners." Reject "Lazy Coders" and "Buzzword Specialists."

---

## 🚨 READ THIS FIRST
This is not a standard coding interview. We hire for **AI-assisted workflow fluency**, not syntax memorization.

* **What they MUST know:**
    * React basics (Components, Props, State)
    * Terminal/npm basics
    * How to use AI as a tool, not a crutch
* **What triggers an IMMEDIATE FAIL:**
    * Blindly copy-pasting AI output without understanding
    * Drowning in buzzwords ("Microservices") to hide lack of real experience

**INTERVIEW FLOW:** If they fail Part 1, stop immediately. Part 2 is only for candidates who pass fundamentals.

---

## PART 1: FUNDAMENTALS (10 minutes)
*Can they actually code?*

### Q1: React Component Basics
**Ask:** "In your own words, what is a React component? Give me an example."

* ✅ **PASS:** "A reusable piece of UI, like a button or navigation bar." / "A building block—like Lego pieces for a website." / "A function that returns what you see on screen."
* 🚩 **FAIL:** "It's a backend thing." / "It's a framework." / Cannot provide any concrete example.

### Q2: Props vs State
**Ask:** "What's the difference between props and state in React?"

* ✅ **PASS:** "Props come from the parent, like instructions. State is internal, what the component remembers."
* 🚩 **FAIL:** "They're the same thing." / "Props are for styling." / Immediately mentions Redux without answering the basic question (dodging).

### Q3: Terminal & npm
**Ask:** "Have you used npm and a terminal? How do you start a React project?"

* ✅ **PASS:** Names commands: `npm install`, `npm start`, `npm run dev`. / "I run commands in the terminal to install packages."
* 🚩 **FAIL:** "What's npm?" / "I only code in CodePen/browser." / Has never used a terminal before.
* *Why this matters:* Our workflow requires running scripts. No terminal = can't work.

---

## PART 2: WORKFLOW FIT (10 minutes)
*Can they thrive in our AI-driven architecture?*

### Q4: AI Integration
**Ask:** "We use AI tools like Cursor to move fast. How do you use AI in your workflow?"

* ✅ **THE HIRED ANSWER:** "I use it for boilerplate and tedious stuff, but I **review the code**." / "It's like a junior partner—I don't trust it blindly."
* 🚩 **RED FLAGS:** "AI does everything for me, it's perfect." (Will ship broken code) / "I never use AI, I write everything by hand." (Too slow for us).

### Q5: Architecture Understanding (MOST IMPORTANT)
**Ask:** "Our architect hates 'Prop Drilling.' Why is passing data through 10 components bad, and what would you use instead?"

* ✅ **THE HIRED ANSWER:** "It's messy, like a game of telephone. I'd use **Context** to give data directly to where it's needed."
* *Keywords to look for:* Context, global state, "source of truth", direct access.
* 🚩 **RED FLAGS:** "Prop drilling is fine." / No idea what you're talking about. / Immediately jumps to Redux (Over-engineering).
* *Gatekeeper:* Our entire architecture is Context-First. If they don't get this, they cannot work here.

### Q6: Independent Problem Solving
**Ask:** "You hit an error. The senior dev is offline. Walk me through your next 15 minutes."

* ✅ **PASS:** "Read the error message. Check Git history. Ask AI specific questions. Document what I tried."
* 🚩 **FAIL:** "Keep trying random things." / "Wait for the senior dev." / "Restart everything."

---

## 📝 SCORING RUBRIC

| Profile | Part 1 | Part 2 | Decision | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **The Pilot** | ✅ Pass | ✅ Pass | **HIRE** | Uses AI as tool, understands architecture, can debug. |
| **The Passenger** | ✅ Pass | 🚩 Blindly trusts AI | **REJECT** | Will ship buggy code without review. |
| **The Purist** | ✅ Pass | 🚩 Refuses AI | **REJECT** | Too slow for our workflow; won't adapt. |
| **The Tourist** | 🚩 Fail | N/A | **REJECT** | Uses buzzwords to hide lack of knowledge. |

---

## CLOSING SCRIPTS

**✅ IF THEY PASSED (Pilot Profile)**
> "Excellent. You have the React fundamentals we need, and your approach to AI matches our workflow. We use a Context-First architecture here, which aligns with what you described. I'll pass your information to our Lead Developer for next steps."

**🚩 IF THEY FAILED**
> "Thank you for your time today. For this particular role, we need someone with more hands-on experience with React, terminal workflows, and AI-assisted development. We'll keep your information on file."

---

## ✂️ QUICK REFERENCE CARD (Print & Attach)

**PASS = HIRE:**
* [ ] Explains components clearly
* [ ] Mentions **Context** or similar for state
* [ ] Has used **npm/terminal**
* [ ] Uses AI but **reviews output**
* [ ] Can debug independently

**FAIL = REJECT:**
* [ ] Can't explain React basics
* [ ] No terminal experience
* [ ] Blindly trusts AI **OR** refuses to use it
* [ ] No problem-solving process

> **ONE-LINER:** "If they say **Context** is good and they use AI carefully, they're hired. If they can't define a component or never used npm, they fail."