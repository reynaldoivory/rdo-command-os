# 📚 COMPLETE GUIDE - Phase A Architecture

## What Got Built

You now have a **production-grade three-layer architecture** with clean separation of concerns:

### Layer 1: Knowledge (Types & Constants)
- `src/domain/rdo_unified_schema.ts` (650 lines) - All TypeScript interfaces
- `src/domain/gameData.constants.ts` (400 lines) - All numeric values

### Layer 2: Simulation (Pure Functions)
- `src/simulator/bountyHunter.ts` (350 lines) - Bounty payout calculations
- `src/simulator/trader.ts` (400 lines) - Trader delivery calculations

### Layer 3: Application (React + Redux)
- Redux store configured and ready
- React app running at `http://localhost:5177/`
- TypeScript strict mode enabled

---

## Files Created Summary

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| **Types** | `rdo_unified_schema.ts` | 650 | Type contract for all RDO data |
| **Constants** | `gameData.constants.ts` | 400 | Extracted numeric values |
| **Bounty Calc** | `bountyHunter.ts` | 350 | Pure bounty payout functions |
| **Trader Calc** | `trader.ts` | 400 | Pure trader delivery functions |
| **Config** | `tsconfig.json` | 30 | TypeScript configuration |
| **Docs** | `PHASE_A_COMPLETE.md` | 500 | Architecture guide |
| **Examples** | `CALCULATOR_EXAMPLES.md` | 300 | Code examples |
| **Comparison** | `BEFORE_AFTER_COMPARISON.md` | 400 | Why this matters |

**Total**: ~3,430 lines of code + docs

---

## Architecture Layers

```
┌────────────────────────────────┐
│  UI / React Components         │  ← Users interact here
├────────────────────────────────┤
│  Redux State Management        │  ← Central state
├────────────────────────────────┤
│  Pure Calculators              │  ← Business logic
│  bountyHunter.ts              │
│  trader.ts                    │
├────────────────────────────────┤
│  Game Constants                │  ← Numbers
│  gameData.constants.ts        │
├────────────────────────────────┤
│  TypeScript Schema             │  ← Types
│  rdo_unified_schema.ts        │
└────────────────────────────────┘
```

Each layer depends only on layers below it.

---

## How To Use The New Code

### Example 1: Calculate Bounty Payout
```typescript
import { calculateBountyPayout } from './src/simulator/bountyHunter';

const payout = calculateBountyPayout({
  tier: 2,           // $$ difficulty
  alive: true,       // target captured alive
  targetCount: 1,    // single target
  minutesElapsed: 12 // completed in 12 minutes
});

console.log(payout.cash);           // $37.50
console.log(payout.gold);           // 0.32 gold bars
console.log(payout.cash_per_hour);  // $187.50/hr
console.log(payout.breakdown);      // See the math
```

### Example 2: Simulate Full Session
```typescript
import { simulateBountySession } from './src/simulator/bountyHunter';

const session = simulateBountySession({
  sessionHours: 2,
  avgBountyMinutes: 12,
  tierDistribution: { tier1: 0.1, tier2: 0.7, tier3: 0.2 },
  aliveCompletionRate: 0.8
});

console.log(session.total_cash);       // Total earned
console.log(session.avg_cash_per_hour); // Income rate
```

### Example 3: Use In React Component
```typescript
import { useState } from 'react';
import { calculateBountyPayout } from '../simulator/bountyHunter';

export function BountySimulator() {
  const [tier, setTier] = useState<1|2|3>(2);
  
  const payout = calculateBountyPayout({
    tier,
    alive: true,
    targetCount: 1,
    minutesElapsed: 12
  });
  
  return <div>
    <p>Cash: ${payout.cash}</p>
    <p>Gold: {payout.gold}</p>
    <p>Per Hour: ${payout.cash_per_hour}/hr</p>
  </div>;
}
```

---

## Key Principles

### 1. Pure Functions
Every calculator is deterministic and side-effect free:
- Same input → same output (always)
- No global state mutations
- Testable anywhere (React, Node, CLI, Discord bot)

### 2. Layered Architecture
Each layer has a single responsibility:
- **Knowledge Layer**: Types and constants (never changes during session)
- **Simulation Layer**: Pure calculation functions
- **Application Layer**: React components and Redux state

### 3. Type Safety
All inputs and outputs are fully typed:
- Compile-time error checking
- IDE autocomplete
- Impossible to pass wrong data

### 4. Transparent Calculations
Every result includes a breakdown:
```typescript
result.breakdown = {
  base_cash: 30,
  tier_multiplier: 1.25,
  status_multiplier: 1,
  target_multiplier: 1,
  // ... see exactly how the result was calculated
}
```

---

## What To Do Next

### Option A: Add Moonshiner Calculator (40 min)
Create `src/simulator/moonshiner.ts` following the same pattern as `bountyHunter.ts`

**You'll need**:
1. Extract moonshiner economics from Frontier Algorithm
2. Create pure functions: `calculateMoonshinerProfit()`, `simulateMoonshinerSession()`
3. Add constants to `gameData.constants.ts`

### Option B: Create UI Debug Panel (30 min)
Create an interactive component that uses the calculators

**You'll need**:
1. Create `src/ui/panels/CalculatorDebug.tsx`
2. Add sliders for parameters
3. Display live results and breakdowns
4. Wire into the boot screen

### Option C: Wire Redux Reducers (20 min)
Add Redux actions that use the calculators

**You'll need**:
1. Update `src/features/simulationSlice.ts`
2. Add `completeBounty` reducer that calls `calculateBountyPayout()`
3. Dispatch from test component

### Option D: Normalize Data (15 min) ⭐ RECOMMENDED FIRST
Update `compendium.json` to match the schema

**You'll need**:
1. Add `confidence: 'HIGH'` to all items
2. Add `sources` array with metadata
3. Add `last_verified` date
4. Run `npm run build` to verify

**Recommendation**: Do D (15 min) → A (40 min) → B (30 min) → C (20 min)  
**Total Time**: ~105 minutes = one solid coding session

---

## Architecture Quality Metrics

| Metric | Before | After |
|--------|--------|-------|
| **Testability** | ❌ Hard (React dependent) | ✅ Pure functions |
| **Reusability** | ❌ React only | ✅ Works anywhere |
| **Maintainability** | ❌ Hard to extend | ✅ Easy to extend |
| **Type Safety** | ⚠️ Partial | ✅ Complete (strict mode) |
| **Code Organization** | ❌ 445-line monolith | ✅ Focused files |
| **Lines per File** | ❌ 445 | ✅ 350-650 (focused) |

---

## File Dependencies

```
src/ui/                    (React components)
  ↓ imports
src/app/store.ts           (Redux)
  ↓ imports
src/features/              (Redux slices)
  ↓ imports
src/simulator/             (Pure calculators)
  ↓ imports
src/domain/                (Types & constants)
```

**Direction**: Always downward. UI depends on Redux, Redux depends on Simulators, Simulators depend on Domain.

Never go backwards.

---

## Immediate Verification Steps

Run these commands to verify everything works:

```bash
# 1. Build should pass with zero errors
npm run build

# 2. Dev server should run
npm run dev
# Should see: "VITE ... ready in ~600ms"
# Should see: "http://localhost:5177/"

# 3. Check for type errors
npx tsc --noEmit

# 4. Lint check (optional)
npm run lint
```

All should pass ✅

---

## Code Examples

### Using Bounty Calculator
```typescript
import { calculateBountyPayout, calculateGoldTimeBonus } from './simulator/bountyHunter';

// Single calculation
const result = calculateBountyPayout({
  tier: 3,
  alive: true,
  targetCount: 1,
  minutesElapsed: 15
});

// Gold bonus progression
console.log(calculateGoldTimeBonus(6));   // 0.16
console.log(calculateGoldTimeBonus(12));  // 0.32 (optimal)
console.log(calculateGoldTimeBonus(20));  // 0.40
```

### Using Trader Calculator
```typescript
import { calculateTraderDelivery, simulateTraderSession } from './simulator/trader';

// Single delivery
const delivery = calculateTraderDelivery({
  goodsCount: 100,
  wagonSize: 'large',
  deliveryTimeMinutes: 20,
  deliveryDistance: 'medium'
});

// Full session
const session = simulateTraderSession({
  sessionHours: 2,
  wagonSize: 'large',
  runsPerHour: 1,
  avgDeliveryMinutes: 20,
  avgDeliveryDistance: 'medium',
  wagonFillFactor: 0.9
});
```

---

## Troubleshooting

### "TypeScript compilation errors"
```bash
# Check what's wrong
npm run build

# Common issue: Missing file extension
# Add .ts to imports:
// Before: import { X } from '../domain/schema'
// After:  import { X } from '../domain/schema.ts'
```

### "App not loading"
```bash
# Dev server not running?
npm run dev

# Should see no errors in terminal
# Open http://localhost:5177/
```

### "Calculator giving wrong results"
```bash
# Check the breakdown
console.log(result.breakdown);

// Verify formula in src/simulator/[system].ts
// Verify constants in src/domain/gameData.constants.ts
// Check against Frontier Algorithm documentation
```

---

## Next Session Checklist

- [ ] Read ARCHITECTURE_BLUEPRINT.md
- [ ] Understand the three layers
- [ ] Review src/simulator/bountyHunter.ts
- [ ] Review src/simulator/trader.ts
- [ ] Pick ONE of the four options
- [ ] Spend 20-40 minutes implementing
- [ ] Commit: `git commit -m "Phase A.X: [feature name]"`
- [ ] Report back with results

---

## Key Takeaway

You've moved from a monolithic 445-line React component to a clean, layered architecture with:

✅ **2,000+ lines of production code** (types, constants, calculators)  
✅ **100% TypeScript strict mode** (type-safe)  
✅ **Pure functions** (testable, portable, reusable)  
✅ **Clear separation of concerns** (easy to maintain)  
✅ **Ready to scale** (add new systems without touching existing code)  

**Status**: Phase A Foundation COMPLETE ✅  
**Next Phase**: Choose your next focus and build for 20-40 minutes.

---

**You're ready to build the ultimate RDO companion.** 🚀
