# RDO Simulator v3.0 - Integration & Architecture Guide

## Executive Summary

You now have:

1. **Complete Checkpoint Roadmap** (`DEVELOPMENT_ROADMAP.md`)
   - 8 phases with 40+ self-contained checkpoints
   - No deadlines, work at your own pace
   - Each checkpoint delivers usable functionality
   - Clear validation criteria

2. **Unified Data Schema** (`src/data/schema.js`)
   - JSDoc interfaces for all data types
   - Confidence tier system for data quality
   - Source attribution for all values
   - Complete examples for each type

3. **Architecture Documentation** (This file)
   - How to integrate new systems
   - Data flow patterns
   - Best practices for maintainability
   - Redux state management structure

---

## Data Architecture Overview

### Three-Layer Design

```
┌─────────────────────────────────────────────────────────┐
│ UI LAYER (React Components)                             │
│ - CatalogBrowser, AnimalCompendium, Calculators       │
│ - useSelector hooks to query Redux                     │
│ - Dispatch actions for user interactions               │
└─────────────────────────────────────────────────────────┘
                          ↕
                    (React Hooks)
                          ↕
┌─────────────────────────────────────────────────────────┐
│ APPLICATION LAYER (Redux + Selectors)                   │
│ - Redux store with slices for each domain             │
│ - Memoized selectors for efficient queries            │
│ - Pure reducer functions                               │
│ - Data transformations (economic calculations)        │
└─────────────────────────────────────────────────────────┘
                          ↕
                  (JSON imports)
                          ↕
┌─────────────────────────────────────────────────────────┐
│ DATA LAYER (JSON + Schemas)                             │
│ - Static JSON files for catalog, animals, formulas    │
│ - Schema validation (TypeScript/JSDoc)                │
│ - Data quality metadata (confidence, sources)         │
│ - Version tracking (patch notes)                       │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
src/
├── data/
│   ├── schema.js                 ← Core interfaces (THIS FILE)
│   ├── catalog/
│   │   ├── weapons.json          ← Weapons with prices/ranks
│   │   ├── horses.json           ← Horses + tack
│   │   ├── clothing.json         ← Outfits
│   │   ├── consumables.json      ← Food, tonics
│   │   └── role-items.json       ← Tools, upgrades, vehicles
│   ├── animals/
│   │   ├── predators.json        ← Cougars, panthers, bears
│   │   ├── herbivores.json       ← Deer, elk, bison
│   │   ├── small-game.json       ← Rabbits, muskrats
│   │   └── legendary.json        ← Legendary animals
│   ├── locations/
│   │   ├── fast-travel-nodes.json
│   │   ├── fast-travel-matrix.json
│   │   ├── regions.json
│   │   └── collector-cycles.json
│   ├── formulas/
│   │   ├── bounty-payout.json
│   │   ├── trader-economics.json
│   │   ├── moonshiner-profit.json
│   │   ├── collector-income.json
│   │   └── naturalist-study.json
│   ├── roles.json                ← Role definitions
│   └── loaders.js                ← Load JSON into Redux
│
├── store/
│   ├── store.js                  ← Redux store setup
│   ├── slices/
│   │   ├── catalogSlice.js       ← Catalog items state
│   │   ├── animalSlice.js        ← Animals state
│   │   ├── locationSlice.js      ← Locations state
│   │   ├── formulaSlice.js       ← Formulas state
│   │   └── simulationSlice.js    ← User sim state
│   └── selectors.js              ← Memoized query functions
│
├── utils/
│   ├── validation.js             ← Data validators
│   ├── calculations.js           ← Pure calculation logic
│   ├── affordability.js          ← Affordability checker
│   ├── hunting-calc.js           ← Hunting profitability
│   ├── bounty-calc.js            ← Bounty payouts
│   ├── trader-calc.js            ← Trader economics
│   ├── moonshiner-calc.js        ← Moonshine profit
│   ├── collector-calc.js         ← Collector routes
│   ├── confidence.js             ← Confidence tier filtering
│   ├── decision-engine.js        ← "What should I do?" logic
│   └── patch-manager.js          ← Version tracking
│
├── hooks/
│   ├── useDataLoad.js            ← Load data on app start
│   ├── useSimulation.js          ← Simulation state hook
│   └── useOptimalHunting.js      ← Calculate hunting routes
│
├── components/
│   ├── Catalog/
│   │   ├── CatalogBrowser.jsx
│   │   ├── CatalogItem.jsx
│   │   └── CatalogDetail.jsx
│   ├── Compendium/
│   │   ├── AnimalBrowser.jsx
│   │   ├── AnimalCard.jsx
│   │   ├── AnimalDetail.jsx
│   │   ├── HuntingRoute.jsx
│   │   └── CollectorRoute.jsx
│   ├── Analysis/
│   │   ├── RoleComparison.jsx
│   │   ├── EconomyInsights.jsx
│   │   ├── EconomyCalculator.jsx
│   │   └── RecommendationCard.jsx
│   ├── Map/
│   │   ├── MapViewer.jsx
│   │   ├── LayerControls.jsx
│   │   └── RouteVisualizer.jsx
│   ├── Settings/
│   │   └── SettingsPanel.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
│
└── App.jsx                       ← Main entry point
```

---

## Redux State Shape

```javascript
{
  // Catalog domain - all purchasable items
  catalog: {
    items: {
      'w_navy': { id: 'w_navy', name: 'Navy Revolver', ... },
      'h_arabian': { id: 'h_arabian', name: 'Black Arabian', ... },
      ...
    },
    loading: false,
    error: null,
    lastLoaded: '2025-12-03T10:30:00Z'
  },

  // Animals domain - all huntable animals
  animals: {
    all: {
      'cougar': { id: 'cougar', name: 'Cougar', ... },
      'panther': { id: 'panther', name: 'Panther', ... },
      ...
    },
    by_region: {
      'west_elizabeth': ['cougar', 'puma', 'elk'],
      'lemoyne': ['panther', 'deer', 'boar']
    },
    loading: false,
    error: null
  },

  // Locations domain - fast travel, regions, spawns
  locations: {
    fast_travel_nodes: {
      'valentine': { id: 'valentine', name: 'Valentine', ... },
      'annesburg': { id: 'annesburg', name: 'Annesburg', ... },
      ...
    },
    regions: {
      'west_elizabeth': { id: 'west_elizabeth', name: 'West Elizabeth', ... },
      'lemoyne': { id: 'lemoyne', name: 'Lemoyne', ... },
      ...
    },
    routes_matrix: { /* fast travel costs */ },
    loading: false
  },

  // Formulas domain - economic calculations
  formulas: {
    all: {
      'bounty_cash_payout': { id: 'bounty_cash_payout', formula: '...', ... },
      'trader_production': { id: 'trader_production', ... },
      ...
    },
    loading: false
  },

  // Simulation domain - user's current session
  simulation: {
    base_stats: {
      rank: 47,
      cash: 1466.00,
      gold: 9.20,
      tokens: 25,
      role_ranks: { trader: 20, collector: 4, ... }
    },
    adjustments: {
      cash_bonus: 0,
      gold_bonus: 0,
      rank_boost: 0
    },
    projected_purchases: [],
    is_simulation_mode: false
  }
}
```

---

## Selector Patterns

### Creating Memoized Selectors

```javascript
// src/store/selectors.js

import { createSelector } from '@reduxjs/toolkit';

// Simple selector - get all items
export const selectAllItems = (state) => state.catalog.items;

// Memoized selector - filter by shop
export const selectItemsByShop = createSelector(
  [selectAllItems, (state, shopId) => shopId],
  (items, shopId) => Object.values(items).filter(item => item.shop === shopId)
);

// Memoized selector - affordability check
export const selectAffordableItems = createSelector(
  [selectAllItems, (state) => state.simulation.base_stats],
  (items, stats) => {
    return Object.values(items).filter(item => {
      const canAfford = 
        stats.cash >= item.price && 
        stats.gold >= (item.gold_cost || 0) &&
        stats.tokens >= (item.tokens || 0);
      const rankUnlocked = stats.rank >= item.rank_required;
      return canAfford && rankUnlocked;
    });
  }
);

// Complex selector - optimal hunting route
export const selectOptimalHuntingRoute = createSelector(
  [
    (state) => state.animals.all,
    (state) => state.locations.regions,
    (state, params) => params.region,
    (state, params) => params.timeAvailable,
  ],
  (animals, regions, region, timeAvailable) => {
    const regionAnimals = regions[region]?.animal_ids || [];
    // ... calculation logic
    return optimizedRoute;
  }
);
```

### Using Selectors in Components

```javascript
// src/components/Catalog/CatalogBrowser.jsx

import { useSelector } from 'react-redux';
import { selectItemsByShop } from '../../store/selectors';

function CatalogBrowser({ shopId }) {
  // Selector only re-runs when shop or relevant state changes
  const items = useSelector(state => selectItemsByShop(state, shopId));

  return (
    <div className="grid">
      {items.map(item => (
        <CatalogItem key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## Data Quality & Confidence System

### Confidence Tiers Explained

```javascript
// HIGH confidence - Multiple independent verified sources
{
  confidence: 'HIGH',
  sources: [
    { type: 'GAME_TEST', date: '2025-11-20', verified_by: 'Professional1994' },
    { type: 'REDDIT', date: '2025-11-19', url: 'reddit.com/...' }
  ],
  last_verified: '2025-11-20'
}

// MEDIUM confidence - One source, community consensus
{
  confidence: 'MEDIUM',
  sources: [
    { type: 'WIKI', date: '2025-10-15', url: 'wiki.example.com' }
  ],
  last_verified: '2025-10-15'
}

// LOW confidence - Estimated or single anecdote
{
  confidence: 'LOW',
  sources: [
    { type: 'COMMUNITY_TESTED', date: '2025-11-01', notes: 'Single player report' }
  ],
  last_verified: '2025-11-01',
  deprecation_warning: 'Awaiting confirmation from multiple sources'
}
```

### UI Implementation

```jsx
// Display confidence badge
function ConfidenceBadge({ confidence, sources, lastVerified }) {
  const colors = {
    HIGH: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`px-2 py-1 rounded text-xs font-bold ${colors[confidence]}`}>
      {confidence} Confidence
      <button onClick={() => showSourceModal(sources)}>
        (? sources)
      </button>
    </div>
  );
}
```

---

## Economic Calculators

### Calculator Function Pattern

```javascript
// src/utils/bounty-calc.js

/**
 * Calculate cash payout for a bounty mission
 * @param {number} base - Base cash value ($30)
 * @param {number} tier_multiplier - Tier bonus (1.0, 1.25, 1.5)
 * @param {number} status_multiplier - Alive=1.0, Dead=0.5
 * @param {number} time_multiplier - Depends on mission duration
 * @param {number} count_multiplier - Number of targets (1.0, 1.67, 2.0)
 * @returns {number} Total payout in cash
 */
export const calculateBountyCash = (base, tier, status, time, count) => {
  return base * tier * status * time * count;
};

/**
 * Calculate gold payout for a bounty
 * Gold follows a step function:
 * - 0-12 minutes: +0.08 per 3 minutes
 * - 12-15 minutes: Diminishing returns
 * - 15+ minutes: Further diminishing
 *
 * @param {number} minutes - Time held before turning in
 * @returns {number} Gold bars earned
 */
export const calculateBountyGold = (minutes) => {
  if (minutes < 3) return 0;
  if (minutes <= 12) return Math.floor(minutes / 3) * 0.08;
  if (minutes <= 15) return 0.32 + (minutes - 12) * 0.013;
  return 0.32 + 0.04 + ((minutes - 15) / 5) * 0.04;
};

/**
 * Get the optimal time to turn in a bounty
 * @returns {Object} { minutes, gold, reason }
 */
export const getOptimalBountyTime = () => {
  return {
    minutes: 12,
    gold: 0.32,
    reason: 'Peak gold per hour efficiency',
    explanation: 'Waiting beyond 12 minutes yields only 50% more gold for 150% more time'
  };
};
```

### Redux Integration

```javascript
// src/store/slices/simulationSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { calculateBountyGold } from '../../utils/bounty-calc';

const formulaSlice = createSlice({
  name: 'simulation',
  initialState: { /* ... */ },
  reducers: {
    // Action to calculate bounty payout in real-time
    updateBountyCalculation: (state, action) => {
      const { minutes } = action.payload;
      const gold = calculateBountyGold(minutes);
      return { ...state, calculated_gold: gold };
    }
  }
});

export default formulaSlice.reducer;
```

---

## Confidence Tier Filtering

### Add to Selectors

```javascript
export const selectHighConfidenceOnly = createSelector(
  [selectAllItems],
  (items) => Object.values(items).filter(item => 
    item.data_quality?.confidence === 'HIGH'
  )
);

export const selectItemsNeedingVerification = createSelector(
  [selectAllItems],
  (items) => Object.values(items).filter(item => 
    item.data_quality?.confidence === 'LOW' || 
    (new Date() - new Date(item.data_quality?.last_verified)) > 30 * 24 * 60 * 60 * 1000
  )
);
```

### UI Filter Component

```jsx
// src/components/DataQuality/ConfidenceFilter.jsx

function ConfidenceFilter() {
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const items = useSelector(state => 
    selectedLevel === 'ALL' 
      ? selectAllItems(state)
      : selectItemsByConfidence(state, selectedLevel)
  );

  return (
    <>
      <div className="flex gap-2 mb-4">
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={selectedLevel === level ? 'bg-blue-500' : 'bg-gray-300'}
          >
            {level}
          </button>
        ))}
      </div>
      <div>{items.length} items matching filter</div>
    </>
  );
}
```

---

## Best Practices

### 1. Data Loading

```javascript
// src/hooks/useDataLoad.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCatalog, loadAnimals, loadLocations } from '../data/loaders';

export const useDataLoad = () => {
  const dispatch = useDispatch();
  const loading = useSelector(state => 
    state.catalog.loading || state.animals.loading || state.locations.loading
  );
  const error = useSelector(state => 
    state.catalog.error || state.animals.error || state.locations.error
  );

  useEffect(() => {
    // Load all data on app start
    dispatch(loadCatalog());
    dispatch(loadAnimals());
    dispatch(loadLocations());
  }, [dispatch]);

  return { loading, error };
};
```

### 2. Memoization Strategy

```javascript
// Components using expensive selectors should be wrapped in memo
import { memo } from 'react';

export const CatalogBrowser = memo(({ shopId }) => {
  const items = useSelector(state => selectItemsByShop(state, shopId));
  // Component only re-renders if items changes
  return <ItemGrid items={items} />;
});
```

### 3. Error Handling

```javascript
// Validate data on load
export const validateLoadedData = (data) => {
  const errors = [];
  
  data.forEach(item => {
    if (!item.id) errors.push(`Item missing id: ${JSON.stringify(item)}`);
    if (item.price === undefined) errors.push(`Item ${item.id} missing price`);
    if (!item.data_quality) errors.push(`Item ${item.id} missing data_quality`);
  });
  
  if (errors.length > 0) {
    console.error('Data validation errors:', errors);
    return { valid: false, errors };
  }
  
  return { valid: true, errors: [] };
};
```

### 4. Performance Considerations

```javascript
// Use virtualization for large lists
import { FixedSizeList } from 'react-window';

export const LargeCatalog = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={60}
  >
    {({ index, style }) => (
      <div style={style}>
        <CatalogItem item={items[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

---

## Next Steps

### Immediate (Pick Any Checkpoint)

1. **CHECKPOINT 1.1**: Create directory structure and stub files
2. **CHECKPOINT 1.2**: Validate schema.js is in place
3. **CHECKPOINT 1.3**: Set up Redux store with placeholder slices
4. **CHECKPOINT 1.4**: Create data loader system

### Short Term

5. **CHECKPOINT 2.x**: Populate catalog JSON files
6. **CHECKPOINT 3.x**: Add animal data with coordinates
7. **CHECKPOINT 4.x**: Implement economic calculators
8. **CHECKPOINT 6.x**: Build React components

### As Needed

9. **CHECKPOINT 7.x**: Add validation and data quality checks
10. **CHECKPOINT 8.x**: Advanced features (build planner, progression simulator)

---

## Resources

- **Schema**: `src/data/schema.js` - Complete interface documentation
- **Roadmap**: `DEVELOPMENT_ROADMAP.md` - 40+ checkpoints with tasks
- **Data Sources**:
  - Frontier Algorithm analysis (Bounty/Trader/Collector/Moonshiner formulas)
  - Jeanropke Map (Collector locations & coordinates)
  - RDO Community wiki (item prices, unlock levels)
  - Game testing (confidence verification)

---

## Questions to Consider

1. **Data Sync**: If implementing backend later, how will you sync local JSON to cloud?
2. **Community Contributions**: Will you accept pull requests for data updates?
3. **Mobile**: Plan for mobile-responsive components from the start
4. **Analytics**: Want to track which calculators users rely on most?
5. **Offline Mode**: Should app work completely offline (yes, currently designed this way)?

---

**Ready to build. Pick a checkpoint and start coding.** 🎯
