# RDO Command OS — agent instructions

Single source of truth for AI coding agents (Cursor, Copilot, Claude Code,
etc.). Facts below verified against the code on 2026-07-18; if this file and
the code disagree, the code wins — then fix this file.

## What this is

React + Vite companion app for Red Dead Online: feeds a player profile
(rank, cash, gold, role XP) through a priority rule registry and recommends
the next best action, alongside dashboard widgets (dailies, weekly specials,
hunting, travel, wallet/catalog planning). "Plan before you play."

## Commands

```bash
npm run dev          # Vite dev server (localhost:5173)
npm test             # Vitest, single run (test:watch for watch mode)
npm run test:e2e     # Playwright (chromium); specs in tests/
npm run lint         # ESLint 9 flat config — must pass with 0 errors
npm run build        # production build
npm run check-size   # bundle budgets (brotli): main entry ≤110 kB,
                     # total JS ≤125 kB, CSS ≤10 kB
```

Pre-commit (husky + lint-staged) runs eslint --fix, a full build, and the
size gate — a commit that passes locally has already met all three.

## Architecture (Context-First)

- `src/logic/` — rule registry `nextBestAction.ts` (first match wins; the
  two Naturalist rules deliberately sit AFTER the economy rules — see the
  in-file comment before reordering anything), thresholds/vectors in
  `decisionRules.ts`, profile selectors in `selectors.ts`. TypeScript,
  typed via `src/types/rdo.types.ts`.
- `src/engine/` — `DecisionTree.ts`.
- `src/context/` — Profile state split by concern into flat files
  (instance / provider / hooks / constants / `index.js` barrel). Consume
  via hooks (`useProfile()`); never prop-drill what a context provides.
- `src/components/widgets/` — dashboard panels, registered in
  `PanelsRegistry.jsx` (lazy-loaded; lazy components need default exports).
  Note: the registry maps `wallet:` to **WalletWidget** (WalletPanel is an
  unmounted older copy) — check the registry before editing a widget.
- `src/hooks/` — data hooks. `useDailies`/`useSpecials` hydrate from
  localStorage cache in `useState` initializers and fetch in cancellable
  mount effects with async-only setState; keep that shape
  (react-hooks/set-state-in-effect is an error).
- `src/data/` — static config/catalog data (no React). `public/data/` —
  runtime-fetched JSON.
- Business logic lives in `logic/`/`engine/`, never in components.

## Conventions

- Function components + hooks only. React Testing Library: test behavior
  via roles/labels, not implementation.
- Unit tests co-located (`Component.test.jsx` beside `Component.jsx`);
  Playwright E2E in `tests/` only (Vitest excludes that dir — keep it so).
- Component size target: ≤200 lines. Several widgets exceed it; do not
  make it worse — extract logic/subcomponents instead.
- Naming (lint-enforced): identifiers `final`, `finished`, `complete`,
  `done` are denied — the codebase treats no file as ever finished.
- Semantic commit prefixes (`feat:`, `fix:`, `ci:`, `chore:`, `docs:`).
- **PR descriptions must contain a "Technical Recommendation" section** —
  CI's protocol-check fails without it.
- Never remove/rename files in `src/data`, `src/logic`, `src/engine`
  without explicit maintainer confirmation.
- Node 20+; Tailwind stays on 3.4 (monorepo pin). ESLint flat config only.

## Gotchas

- This repo is nested inside the `~/projects` npm-workspaces monorepo but
  syncs through its own remote (`reynaldoivory/rdo-command-os`). Running
  `npm install` here updates the MONOREPO root lockfile, not this repo's
  `package-lock.json` — regenerate the standalone lock in an isolated temp
  dir (`npm install --package-lock-only --ignore-scripts`) or GitHub CI's
  `npm ci` breaks.
- Quality Gate workflow is a neutral no-op until a `SONAR_TOKEN` repo
  secret exists.
- localStorage cache keys are versioned by shape; don't change persisted
  structures without handling old values.
