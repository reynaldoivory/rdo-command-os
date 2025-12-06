# Universal System Architecture - Implementation Guide

## ✅ What's Been Created

You now have a complete **modular, plug-and-play architecture** for RDO Companion. Here's what was set up:

### Directory Structure
```
src/
├── app/                              # Redux & App Configuration
│   ├── store.ts                     # Central Redux Store
│   └── hooks.ts                     # Typed Redux Hooks
├── features/                         # Redux Slices (State)
│   ├── simulationSlice.ts           # Player State (Cash, Gold, Rank)
│   ├── compendiumSlice.ts           # Static Data (Items, Animals, Formulas)
│   ├── environmentSlice.ts          # Game World (Time, Weather, Bonuses)
│   └── economicsSlice.ts            # Economic Calculations Cache
├── data/
│   ├── schema/
│   │   └── rdo_unified_schema.ts   # THE CONTRACT (All TypeScript Interfaces)
│   └── static/                      # (Will hold JSON compendium files)
├── hooks/
│   └── useSystemLoader.ts           # Bootstrap Hook (Adapter Pattern)
├── models/                          # Logic Layer (Pure Functions)
├── utils/                           # Helpers & Calculators
├── components/
│   ├── common/                      # Reusable UI Components
│   ├── layout/                      # App Layout
│   └── features/                    # Feature-Specific Components
└── AppNew.tsx                       # New App Entry Point (v3.0)
```

---

## 🏗️ Architecture Layers

### Layer 1: THE CONTRACT (Schema)
**File**: `src/data/schema/rdo_unified_schema.ts`

Defines all TypeScript interfaces:
- `PlayerCharacter` - Player state shape
- `CatalogItem` - Purchasable items
- `Animal` / `LegendaryAnimal` - Hunting targets
- `EconomicFormula` - Calculation rules
- `FastTravelNode` / `Region` - Geography
- `RDOCompendium` - Master data structure
- `DataQuality` - Confidence tiers & source tracking

**Purpose**: Single source of truth for data shapes. When adding new systems (Naturalist, Poker), define the interface here first.

### Layer 2: THE STATE (Redux Slices)
**Files**: `src/features/*.ts`

Four slices handle different concerns:

1. **simulationSlice** - Player character state
   - Actions: `updatePlayerCash`, `updateRoleRank`, `setPlayerState`, etc.
   - Updates trigger `last_update` timestamp

2. **compendiumSlice** - Static game data
   - Loaded once at app startup from JSON
   - Actions: `loadCompendiumSuccess`, `updateItem`, `mergeCompendium`
   - Selectors: `selectAllItems`, `selectAllAnimals`, `selectCompendiumLoaded`

3. **environmentSlice** - Game world conditions
   - Tracks: `time_of_day`, `weather`, `active_bonuses`, `current_date`
   - Updates based on real time or simulation time

4. **economicsSlice** - Cached calculations
   - Stores: `calculated_profits`, `optimal_routes`, `role_rankings`
   - Memoized selectors prevent recalculation on every render

### Layer 3: THE LOGIC (Models)
**Directory**: `src/models/`

Pure functions that transform data:
- `calculators.ts` - Math engines (Bounty, Trader, Moonshiner, etc.)
- `adapters.ts` - Data transformers (JSON → Redux format)
- `decision-engine.ts` - "What should I do next?" AI

### Layer 4: THE DATA (Static Files)
**Directory**: `src/data/static/`

JSON files containing:
- `compendium.json` - Merged items, animals, formulas
- `constants.ts` - Physics (Fast Travel costs, spawn rates)
- `sources.json` - Data quality metadata

---

## 🔌 How to Add New Systems

The architecture is designed for **plug-and-play feature addition**. Here's the pattern:

### Example: Adding Naturalist System

#### Step 1: Define the Contract (Schema)
Edit `src/data/schema/rdo_unified_schema.ts`:
```typescript
export interface NaturalistSample {
  animal_id: string;
  quality: 'poor' | 'good' | 'perfect';
  location: { lat: number; lon: number };
  completion_value: number;  // Gold bars from Harriet
}

export interface RDOCompendium {
  // ... existing fields ...
  naturalist_samples?: NaturalistSample[];
}
```

#### Step 2: Define the Logic (Model)
Create `src/models/naturalist-logic.ts`:
```typescript
export const calculateSampleValue = (
  quality: 'poor' | 'good' | 'perfect'
): number => {
  const multipliers = { poor: 0.5, good: 1.0, perfect: 1.5 };
  const base = 0.75;  // Gold bars
  return base * multipliers[quality];
};
```

#### Step 3: Create the Slice (State)
Create `src/features/naturalistSlice.ts`:
```typescript
const naturalistSlice = createSlice({
  name: 'naturalist',
  initialState: {
    collected_samples: [],
    active_studies: [],
  },
  reducers: {
    stampSample: (state, action) => { /* ... */ },
    completeSample: (state, action) => { /* ... */ },
  },
});
```

#### Step 4: Register in Store
Edit `src/app/store.ts`:
```typescript
import naturalistReducer from '../features/naturalistSlice';

const rootReducer = combineReducers({
  // ... existing ...
  naturalist: naturalistReducer,  // ← NEW
});
```

#### Step 5: Add Data
Create `src/data/static/naturalist.json`:
```json
{
  "samples": {
    "cougar_pelt": { ... },
    "panther_pelt": { ... }
  }
}
```

#### Step 6: Load Data in Hook
Edit `src/hooks/useSystemLoader.ts`:
```typescript
import naturalistData from '../data/static/naturalist.json';

const loadNaturalist = async () => {
  dispatch(naturalistActions.loadSamples(naturalistData.samples));
};

// Call in bootSystem():
await loadNaturalist();
```

#### Step 7: Create Components
Create `src/components/features/naturalist/`:
```
├── NaturalistBrowser.tsx
├── SampleCard.tsx
└── HarrietMenu.tsx
```

**That's it!** The system is now integrated without touching core logic.

---

## 📊 Redux Store Shape

```typescript
{
  simulation: {
    character_id: 'demo_character',
    rank: 25,
    cash: 5000.00,
    gold_bars: 50.00,
    trader_rank: 10,
    // ... all player state
    last_update: 1702664400000,
  },
  
  compendium: {
    data: {
      items: {
        'w_mauser': { id: 'w_mauser', name: 'Mauser Pistol', ... },
        'h_arabian': { id: 'h_arabian', name: 'Black Arabian', ... },
      },
      animals: {
        'cougar': { id: 'cougar', name: 'Cougar', ... },
      },
      formulas: { /* ... */ },
      regions: { /* ... */ },
      // ... all static data
    },
    loading: false,
    error: null,
    lastLoaded: '2025-12-03T10:00:00Z',
  },
  
  environment: {
    time_of_day: 'day',
    weather: 'clear',
    active_bonuses: [
      { id: 'trader_bonus', multiplier: 1.5, end_date: '2025-12-10' },
    ],
    current_date: '2025-12-03',
  },
  
  economics: {
    calculated_profits: {
      'trader_optimized': {
        activity: 'trader',
        base_profit: 500,
        total_profit: 750,
        profit_per_hour: 225,
      },
    },
    optimal_routes: { /* ... */ },
    role_rankings: [ /* ... */ ],
    last_calculated: '2025-12-03T10:05:00Z',
  },
}
```

---

## 🎣 Using Hooks in Components

### Typed Hooks
```typescript
import { useAppDispatch, useAppSelector, useSimulationState } from '../app/hooks';

function MyComponent() {
  // ✅ Typed dispatch
  const dispatch = useAppDispatch();
  
  // ✅ Typed selector
  const cash = useAppSelector((state) => state.simulation.cash);
  
  // ✅ Convenience hook
  const sim = useSimulationState();
  
  return <div>Cash: ${cash}</div>;
}
```

### Memoized Selectors (Advanced)
```typescript
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from '../app/hooks';

// Outside component
const selectAffordableItems = createSelector(
  [(state) => state.compendium.data?.items, (state) => state.simulation],
  (items, sim) => 
    Object.values(items || {}).filter(item =>
      sim.cash >= item.price && sim.gold_bars >= (item.gold_cost || 0)
    )
);

// Inside component
function CatalogBrowser() {
  const items = useAppSelector(selectAffordableItems);
  // Re-renders ONLY when items array actually changes
}
```

---

## 💾 Persistence

### Save State
```typescript
import { useSaveState } from '../hooks/useSystemLoader';

function App() {
  const saveState = useSaveState();
  
  useEffect(() => {
    // Save whenever simulation changes
    const timer = setInterval(saveState, 30000); // Every 30s
    return () => clearInterval(timer);
  }, [saveState]);
}
```

### Load State
Automatically happens in `useSystemLoader` boot sequence.

### Export/Import
```typescript
import { store, saveStateToStorage, loadStateFromStorage } from '../app/store';

// Export to file
const state = store.getState();
const json = JSON.stringify(state, null, 2);
const file = new Blob([json], { type: 'application/json' });
// ... download file ...

// Import from file
const imported = JSON.parse(fileContents);
store.dispatch(simulationActions.restoreSimulation(imported.simulation));
```

---

## 🚀 Next Steps

### Immediate
1. **Update `main.jsx`** to use `AppNew.tsx` instead of `App.jsx`
2. **Install Redux Dependencies**:
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```
3. **Create `src/data/static/compendium.json`** with initial item data
4. **Test System Loader** - App should boot successfully

### Short Term
5. Create feature components (CatalogBrowser, AnimalBrowser, etc.)
6. Implement calculator models
7. Populate compendium JSON with full item list
8. Add animal compendium data

### Medium Term
9. Add Naturalist system (following plug-in pattern above)
10. Add Stranger Missions system
11. Implement Decision Engine ("What should I do?")
12. Build Analytics & Comparisons

---

## 📝 File Checklist

- ✅ `src/data/schema/rdo_unified_schema.ts` - Complete schema
- ✅ `src/app/store.ts` - Redux store configuration
- ✅ `src/app/hooks.ts` - Typed hooks
- ✅ `src/features/simulationSlice.ts` - Player state
- ✅ `src/features/compendiumSlice.ts` - Static data
- ✅ `src/features/environmentSlice.ts` - Game world
- ✅ `src/features/economicsSlice.ts` - Calculations
- ✅ `src/hooks/useSystemLoader.ts` - Boot sequence
- ✅ `src/AppNew.tsx` - New app entry point
- ⬜ `src/main.jsx` - Update to use AppNew
- ⬜ `src/data/static/compendium.json` - Item catalog
- ⬜ `src/models/calculators.ts` - Math engines
- ⬜ `src/components/features/*` - Feature UI

---

## 🎯 Philosophy

> **"Every new system is an island that doesn't touch the mainland."**

- Add features by creating new folders under `/features/` and `/components/`
- Never modify core Redux logic to support new systems
- Always define interfaces in schema first
- Use the Adapter Pattern (System Loader) to bridge JSON data into Redux
- Keep calculators pure and testable

This architecture scales from 1 system to 100+ without architectural changes.

---

**Ready to build. Pick a feature and create a component.** 🎯
