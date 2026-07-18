# RDO Command OS

Red Dead Online decision engine and dashboard. Feeds a player profile (rank,
cash, gold, role XP) through a priority rule registry and recommends the next
best action — trader sales, gold farming, collector routes, role unlocks —
alongside widgets for dailies, weekly specials, hunting spawns, and travel
planning.

React 19 + Vite + Tailwind CSS 3.4, ESLint 9 flat config, Node 20+.

## Commands

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm test             # Vitest unit tests (single run)
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright E2E (headless)
npm run lint         # ESLint
npm run build        # Production build → dist/
npm run check-size   # Bundle budgets: main JS ≤110 kB, total JS ≤125 kB, CSS ≤10 kB (brotli)
npm run bundle       # Visual bundle treemap → stats.html
```

## Architecture

- `src/engine/` — DecisionTree
- `src/logic/` — rule registry (`nextBestAction.ts`), thresholds/vectors
  (`decisionRules.ts`), profile selectors (`selectors.ts`)
- `src/context/` — Profile context (state, hooks, constants split by concern)
- `src/components/widgets/` — dashboard panels (lazy-loaded via `PanelsRegistry`)
- `src/hooks/` — data hooks (dailies, specials, calculators)
- `public/data/` — runtime-fetched JSON (weekly specials, catalog)

Unit tests are co-located with their sources; Playwright specs live in
`tests/`. See `docs/ARCHITECTURE.md` for detail and
[the monorepo CLAUDE.md](../../CLAUDE.md) for cross-project conventions.

## CI

GitHub Actions: install → lint → test → build → bundle-size gate + Playwright
E2E. PR descriptions must include a "Technical Recommendation" section
(protocol check). Pre-commit (husky + lint-staged) runs ESLint, a production
build, and the size gate.
