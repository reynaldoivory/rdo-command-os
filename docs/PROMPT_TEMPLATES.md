# AI Prompt Templates

## 1. The Surgical Move (Organization Refactor)

_Use this to clean up the `src/components` folder._

@Codebase
I need to clean up the component structure to match .cursorrules.

ACTION:
Move the following files from 'src/components/' to 'src/components/widgets/':

- CartPanel.jsx
- DailyOracle.jsx
- ShopColumn.jsx
- SpecialsBanner.jsx
- RolesPanel.jsx
- TravelMap.jsx
- WagonCalculator.jsx
- WardrobeTracker.jsx
- WalletPanel.jsx
- Compendium.jsx
- Chronometer.jsx
- DiagnosticsPanel.jsx
- FastTravelCalc.jsx
- HuntingTerminal.jsx
- MapBoard.jsx
- MissionControl.jsx
- MissionTimer.jsx
- OutlawAlmanac.jsx
- ProfileManager.jsx
- RoleCard.jsx

UPDATE:

- Update all import paths in 'src/components/PanelsRegistry.jsx' to reflect these moves.
- Do NOT move 'PanelsRegistry.jsx'.
- Do NOT move anything inside existing subfolders (common, features, layout, widgets).

---

## 2. The Missing Orchestrator (Create Dashboard)

_Run this ONLY after verifying step 1._

@Codebase
Create the missing layout orchestrator defined in our architecture.

ACTION:

1. Create 'src/components/layout/Dashboard.jsx'.
2. It should:
   - Import 'PanelsRegistry'.
   - Accept a 'layoutConfig' prop (or similar) or just iterate through active panels.
   - Render a simple grid container (Tailwind 'grid grid-cols-1 md:grid-cols-3 gap-4').
   - Map through the registry entries and render them.
3. Export it as default.

---

## 3. The Bug Fix (Primitive Value Error)

_Run this ONLY after verifying step 2._

@Codebase
@.cursorrules

Fix the runtime error: "Cannot convert object to primitive value" while respecting the rule that we never interpolate whole objects in JSX.

1. Scan these files:

   - src/App.jsx
   - src/context/ProfileContext.jsx
   - any other context/provider files used at the top level.

2. Find all places where:

   - A context or props object is concatenated into a string, OR
   - Used directly inside JSX text, OR
   - Used directly in className or style.

3. For each violation:
   - Replace the interpolation with a specific primitive property (like user.name, status, id) or a safe string.
   - Keep rendering only strings/numbers/booleans in text or className.

First, show me the locations you found and a proposed diff.
Do not apply the diff until I confirm.

## STYLE CHANGES AIOPS-0009

@Codebase
@.cursorrules

DESIGN OVERHAUL: The app currently looks like a generic dark dashboard. It needs to match the "Red Dead Redemption 2" catalog aesthetic.

ACTION:

1. Update `tailwind.config.js`:

   - Add RDO specific colors:
     - 'rdo-red': '#cc0000' (The classic dead eye red)
     - 'rdo-black': '#1a1a1a' (Deep charcoal)
     - 'rdo-paper': '#e8e4dc' (The catalog paper color)
     - 'rdo-gold': '#cda85f' (The UI gold)
   - Add fonts: 'Rye' (Header) and 'Roboto Condensed' (Body).

2. Create `src/index.css`:

   - Add `@import url('https://fonts.googleapis.com/css2?family=Rye&family=Roboto+Condensed:wght@300;400;700&display=swap');`
   - Apply a subtle "paper texture" background or a deep textured charcoal background to `body`.

3. Style Refactor (Dashboard.jsx & Widgets):
   - Update the Dashboard grid container to use the new font family.
   - Update widget borders to be double-borders (`border-double border-4 border-rdo-black/20` or similar).
   - Change primary buttons to use 'rdo-red' background with white text (Dead Eye style).
   - Change secondary accents to 'rdo-gold'.

GOAL: Make it look like the in-game handheld catalog.
