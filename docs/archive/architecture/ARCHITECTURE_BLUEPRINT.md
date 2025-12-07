# 🎯 PHASE A COMPLETE: Clean Reframe & Next Steps

## Executive Summary

You now have a **production-grade three-layer architecture** for the RDO Economic Engine:

### ✅ What's Done (Phase A)

| Layer | Component | File(s) | Status |
|-------|-----------|---------|:------:|
| **Knowledge** | Type Schema | `src/domain/rdo_unified_schema.ts` | ✅ Frozen |
| **Knowledge** | Game Constants | `src/domain/gameData.constants.ts` | ✅ Maintainable |
| **Simulation** | Bounty Calculator | `src/simulator/bountyHunter.ts` | ✅ Tested |
| **Simulation** | Trader Calculator | `src/simulator/trader.ts` | ✅ Tested |
| **Infrastructure** | Redux Store | `src/app/store.ts` | ✅ Ready |
| **Infrastructure** | TypeScript Config | `tsconfig.json` | ✅ Configured |
| **Dev Server** | Vite + React | Running on `localhost:5177` | ✅ Live |

---

## Architecture: Three Clean Layers

```
┌─────────────────────────────────────────────────┐
│  INTERFACE LAYER (React UI)                     │
│  useAppSelector() → UI components display data  │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ Pure data flow
                 │
┌─────────────────────────────────────────────────┐
│  SIMULATION LAYER (Business Logic)              │
│  ✅ bountyHunter.ts - calculateBountyPayout()  │
│  ✅ trader.ts - calculateTraderDelivery()      │
│  🔲 moonshiner.ts - (next)                     │
│  🔲 collector.ts - (next)                      │
│  🔲 bestActivity.ts - (next)                   │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ imports from
                 │
┌─────────────────────────────────────────────────┐
│  KNOWLEDGE LAYER (Static Data)                  │
│  ✅ rdo_unified_schema.ts (TypeScript types)   │
│  ✅ gameData.constants.ts (numeric values)     │
│  🔲 compendium.json (actual game data)         │
└─────────────────────────────────────────────────┘
```

**Key Principle**: Each layer depends only on the layer below it. Top layer never touches bottom layer directly.

---

## How This Solves Your Original Problems

### Problem 1: "Mixed concerns tangled together"
**Solution**: Each file has ONE job
- `rdo_unified_schema.ts` = types only
- `gameData.constants.ts` = numbers only  
- `bountyHunter.ts` = bounty logic only
- `trader.ts` = trader logic only
- React components = UI only

### Problem 2: "Hard to maintain when formulas change"
**Solution**: Update `gameData.constants.ts` in ONE place, all calculators auto-use new values
```typescript
// Change this ONE line...
BOUNTY_PAYOUT_BASE_CASH = 35  // Was 30

// ...and ALL bounty calculations instantly use $35 instead of $30
```

### Problem 3: "Calculators can't be tested outside React"
**Solution**: All simulators are pure functions = testable anywhere
```typescript
// Run in Node.js, browser, CLI, Discord bot, etc.
const payout = calculateBountyPayout({ tier: 2, alive: true, targetCount: 1, minutesElapsed: 12 });
```

### Problem 4: "Data comes from 5 sources, hard to track reliability"
**Solution**: VersionedValue<T> wrapper + SourceRef tracking
```typescript
const bounty_base: VersionedValue<number> = {
  value: 30,
  confidence: 'HIGH',
  sources: [{ type: 'GAME_TEST', date: '2025-11-20', verified_by: 'TestPlayer' }],
  last_verified: '2025-11-20',
  patch_version: '1.40'
}

// UI can filter: "show only HIGH confidence data"
```

---

## Files Created: Quick Reference

### 1. `src/domain/rdo_unified_schema.ts`
**What**: TypeScript interfaces (the contract)  
**Size**: 650 lines  
**Key Types**: VersionedValue, Confidence, RDOItem, Animal, EconomicFormula, Role, RDOCompendium  
**Never Imported By**: You should import FROM this file, not the other way around  
**Usage**:
```typescript
import type { RDOItem, RDOCompendium, EconomicFormula } from './domain/rdo_unified_schema';
```

### 2. `src/domain/gameData.constants.ts`
**What**: All numeric constants from your Frontier Algorithm  
**Size**: 400 lines  
**Key Exports**: BOUNTY_PAYOUT_BASE_CASH, TRADER_GOODS_CONVERSION, MOONSHINER_BASE_BATCH_PROFIT, etc.  
**Usage**:
```typescript
import { BOUNTY_PAYOUT_BASE_CASH, BOUNTY_PAYOUT_TIER_MULTIPLIERS } from './domain/gameData.constants';

const cash = BOUNTY_PAYOUT_BASE_CASH * BOUNTY_PAYOUT_TIER_MULTIPLIERS[2];
```

### 3. `src/simulator/bountyHunter.ts`
**What**: Pure functions for Bounty Hunter economics  
**Size**: 350 lines  
**Key Functions**:
- `calculateGoldTimeBonus(minutesElapsed)` → gold bars earned
- `calculateBountyPayout(input)` → { cash, gold, xp, breakdown }
- `simulateBountySession(config)` → full session income projection

**Usage**:
```typescript
import { calculateBountyPayout } from './simulator/bountyHunter';

const result = calculateBountyPayout({
  tier: 2,
  alive: true,
  targetCount: 1,
  minutesElapsed: 12
});
```

### 4. `src/simulator/trader.ts`
**What**: Pure functions for Trader economics  
**Size**: 400 lines  
**Key Functions**:
- `calculateTraderDelivery(input)` → { base_cash, time_bonus, distance_bonus, total_cash }
- `simulateTraderSession(config)` → full session income + hunting time estimate

**Usage**:
```typescript
import { calculateTraderDelivery } from './simulator/trader';

const delivery = calculateTraderDelivery({
  goodsCount: 100,
  wagonSize: 'large',
  deliveryTimeMinutes: 20,
  deliveryDistance: 'medium'
});
```

---

## Example: From Constants → Calculation → UI

### Step 1: Define constant
```typescript
// src/domain/gameData.constants.ts
export const BOUNTY_PAYOUT_BASE_CASH = 30;  // Verified: GAME_TEST 2025-11-20
```

### Step 2: Use in calculator
```typescript
// src/simulator/bountyHunter.ts
import { BOUNTY_PAYOUT_BASE_CASH } from '../domain/gameData.constants';

export function calculateBountyPayout(input) {
  const baseCash = BOUNTY_PAYOUT_BASE_CASH;  // ← uses constant
  const cash = baseCash * tierMultiplier * statusMultiplier * ...;
  return { cash, ... };
}
```

### Step 3: Use in Redux
```typescript
// src/features/simulationSlice.ts
import { calculateBountyPayout } from '../simulator/bountyHunter';

reducers: {
  completeBounty: (state, action) => {
    const payout = calculateBountyPayout(action.payload);  // ← calls function
    state.cash += payout.cash;
  }
}
```

### Step 4: Display in UI
```typescript
// src/ui/components/BountyTracker.tsx
import { useAppSelector } from '../app/hooks';
import { calculateBountyPayout } from '../simulator/bountyHunter';

export function BountyTracker() {
  const sim = useAppSelector(state => state.simulation);
  
  const projection = calculateBountyPayout({
    tier: 2,
    alive: true,
    targetCount: 1,
    minutesElapsed: 12
  });
  
  return <div>
    Projected: ${projection.cash} | {projection.gold} gold | 
    ${projection.cash_per_hour}/hr
  </div>;
}
```

**Key Insight**: The SAME `calculateBountyPayout()` function works in:
- Redux reducer (server-side calculation)
- React component (UI projection)
- CLI script (batch analysis)
- Discord bot (income reporting)

---

## Immediate Next Steps (Choose One)

### 🎯 Option A: Implement Moonshiner Calculator (40 min)
Create `src/simulator/moonshiner.ts` using the same pattern as bountyHunter.ts

**You'll need**:
- Read the Moonshiner section from Frontier Algorithm
- Extract: base profits by mash type, time bonuses, shack upgrades
- Create pure functions: `calculateMoonshinerProfit()`, `simulateMoonshinerSession()`
- Add constants to `gameData.constants.ts`

**Files to create/modify**:
- Create: `src/simulator/moonshiner.ts` (~400 lines)
- Update: `src/domain/gameData.constants.ts` (add MOONSHINER_* constants)

---

### 🎯 Option B: Create UI Debug Panel (30 min)
Create a React component that uses these calculators live

**You'll create**:
- `src/ui/panels/CalculatorDebug.tsx` - Interactive form to test calculations
- Sliders for each parameter (tier, time, goods, etc.)
- Real-time output showing cash/gold/xp
- Breakdown table showing the math

**Files to create**:
- Create: `src/ui/panels/CalculatorDebug.tsx` (~200 lines)
- Update: `src/AppNew.tsx` to add panel to boot screen

---

### 🎯 Option C: Wire Redux Completion Actions (20 min)
Add `completeBounty` and `completeTraderDelivery` reducers

**You'll do**:
- Update `src/features/simulationSlice.ts`
- Add 2-3 new reducers that use the calculators
- Dispatch from a test component to verify Redux + calculators work together

**Files to modify**:
- Update: `src/features/simulationSlice.ts` (add new reducers)
- Create: `src/ui/test/ActionTest.tsx` (dispatch test component)

---

### 🎯 Option D: Normalize compendium.json (15 min) ⭐ **RECOMMENDED FIRST**
Update the existing `compendium.json` to match schema

**You'll do**:
- Add `confidence: 'HIGH'` to all 3 items
- Add `sources` array with { type, date } to each item
- Add `last_verified` date to each item
- Verify it matches RDOCompendium schema

**Files to modify**:
- Update: `src/data/static/compendium.json`
- Verify: `npm run build` passes TypeScript check

---

## Recommendation: Do All Four in This Order

1. **Option D (15 min)**: Normalize compendium.json
   - Quick win, unblocks other work
   
2. **Option A (40 min)**: Implement moonshiner.ts
   - Doubles your simulator coverage
   - Follows bountyHunter.ts pattern, should be fast
   
3. **Option B (30 min)**: Create UI debug panel
   - See calculators working live
   - Great for validating the math
   
4. **Option C (20 min)**: Wire Redux actions
   - Complete the loop: action → calculator → state → UI

**Total Time**: ~105 minutes = a solid 2-hour coding session
**Result**: 3 complete economic systems + live UI + Redux integration

---

## Philosophy: Why This Architecture Works

### 1. **Composability**
```typescript
// Combine calculators to answer complex questions
function findBestActivity(player) {
  const bountyPay = calculateBountyPayout({ ... });
  const traderPay = calculateTraderDelivery({ ... });
  const moonshinerPay = calculateMoonshinerProfit({ ... });
  
  return [bountyPay, traderPay, moonshinerPay].sort((a,b) => b.cash - a.cash)[0];
}
```

### 2. **Testability**
```typescript
// Every function is pure and independently testable
test('bounty payout for tier 2, alive, 12 min', () => {
  const result = calculateBountyPayout({ tier: 2, alive: true, minutesElapsed: 12 });
  expect(result.cash).toBe(37.5);
  expect(result.gold).toBe(0.32);
});
```

### 3. **Transparency**
```typescript
// Users see exactly why they earned $X
const result = calculateBountyPayout({ ... });
console.log(result.breakdown);
// { base_cash: 30, tier_multiplier: 1.25, status_multiplier: 1, ... }
```

### 4. **Maintainability**
```typescript
// When R* patches game, update ONE place
// Example: In patch 1.41, bounty base payout increases to $35
BOUNTY_PAYOUT_BASE_CASH = 35;  // ← change once
// All 1000 lines of code automatically use the new value
```

### 5. **Extensibility**
```typescript
// Add new economic system without touching existing code
// Create: src/simulator/pokerRing.ts
// Create: src/domain/gameData.constants.ts POKER_* entries
// Existing bounty/trader/trader code unchanged
```

---

## Key Files to Remember

| File | Edit Frequency | When to Change |
|------|-----------------|-----------------|
| `rdo_unified_schema.ts` | Rarely | When adding new data type (e.g., "Legendary Bounties") |
| `gameData.constants.ts` | Often | When R* patches game or community finds new values |
| `bountyHunter.ts` | Rarely | When formula logic changes (e.g., gold bonus algorithm) |
| `trader.ts` | Rarely | When formula logic changes |
| `compendium.json` | Often | As you add items, animals, routes to database |

**Pro Tip**: When R* patches the game, check `gameData.constants.ts` first. Update constants there, everything else auto-updates.

---

## Architecture Validation ✅

```
✅ Types defined (rdo_unified_schema.ts)
✅ Constants extracted (gameData.constants.ts)  
✅ Pure calculators implemented (bountyHunter.ts, trader.ts)
✅ Redux infrastructure ready (store.ts, hooks.ts, slices.ts)
✅ React app booting (AppNew.tsx → http://localhost:5177/)
✅ TypeScript compiling (zero errors in src/)
✅ Dev server running (HMR enabled)
```

---

## Next Session Checklist

- [ ] Read PHASE_A_COMPLETE.md (this file)
- [ ] Run `npm run build` to ensure no compilation errors
- [ ] Pick ONE of the 4 options above
- [ ] Execute it (should take 15-40 min)
- [ ] Commit to git with message "Phase A.X: [activity name]"
- [ ] Report back with results

**You're ready to build the most comprehensive RDO tool ever created.** 🚀
