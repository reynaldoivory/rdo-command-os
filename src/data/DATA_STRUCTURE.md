# Data Structure Documentation

**Last Updated:** 2025-01-11
**Version:** 2.0.0

## Overview

The `/src/data` directory contains all game data, UI configuration, and data validation schemas for the RDO Command OS application. This document describes the purpose of each file, how data flows through the system, and how to add new data.

---

## Directory Structure

```
src/data/
├── index.js              # Barrel file - exports everything
├── bonuses.js            # XP bonuses, collector sets, role payouts
├── catalog.js            # Master item catalog (weapons, horses, roles, etc.)
├── encyclopedia.js       # Legendary animals, free roam events, timers
├── fastTravel.js         # Fast travel cost calculations
├── geography.js          # Fast travel locations & game coordinates
├── meta-strats.js        # Meta strategies and game guides
├── mocks.js              # Test/demo data
├── progression.js        # XP tables, roles, hunting values
├── rdo-atlas.js          # Map data and regions (if present)
├── rdo-data.js           # DEPRECATED - backward compatibility only
├── schemas.js            # Data validators & TypeScript definitions
├── topology.js           # Metro map visual coordinates
└── ui-config.js          # UI styling & display configuration
```

---

## File-by-File Reference

### 1. `index.js` (Barrel File)

**Purpose:** Single entry point for all data imports. Re-exports from other files for convenience.

**Usage:**
```javascript
// Import from the barrel file
import { CATALOG, ROLES, FAST_TRAVEL_LOCATIONS } from '../data';

// Or import directly from specific files
import { CATALOG } from '../data/catalog';
```

**When to update:** Add new exports whenever you create a new data file or add new exports to existing files.

---

### 2. `catalog.js` (Master Item Catalog)

**Purpose:** Contains all purchasable items in RDO - weapons, horses, saddles, ability cards, role licenses, tools, pamphlets, and consumables.

**Data Structure:**
```javascript
export const CATALOG = [
  {
    id: 'w_rev_navy',           // Unique identifier
    type: 'weapon',              // Item type (weapon, horse, ability, etc.)
    category: 'Revolver',        // Sub-category
    name: 'Navy Revolver',       // Display name
    price: 275,                  // Cash price
    gold: 0,                     // Gold bar cost
    rank: 1,                     // Minimum rank required
    priority: 'essential',       // Priority tier (starter, essential, recommended, optional, luxury)
    desc: 'Description',         // Short description with meta info
    aliases: ['navy', '...'],    // Alternative search terms
    role: 'bountyHunter',        // Required role (optional)
  }
];
```

**Helper Functions:**
- `getCatalogByType(type)` - Filter by item type
- `getCatalogByCategory(type, category)` - Filter by type AND category
- `getCatalogByPriority(priority)` - Filter by priority tier
- `getEssentialItems()` - Get all essential items sorted by price
- `getCatalogByRole(role)` - Get role-specific items
- `getAffordableItems(cash, gold, rank)` - Filter by what player can afford
- `calculateCartTotal(itemIds)` - Calculate total cost of multiple items
- `getCategoriesForType(type)` - Get unique categories for a type

**Used By:**
- `ProfileContext.jsx` - Main catalog access
- `CommandSearch.jsx` - Search functionality
- `logic/nextBestAction.js` - Purchase recommendations

**How to Add Items:**
1. Add new object to `CATALOG` array
2. Use consistent structure (copy existing similar item)
3. Assign unique `id` (prefix convention: `w_` weapons, `h_` horses, `a_` abilities, etc.)
4. Set appropriate `priority` based on meta value
5. Add relevant `aliases` for search
6. Run `npm run lint` to check for errors

---

### 3. `ui-config.js` (UI Configuration)

**Purpose:** Visual styling and display configuration. Contains NO game data - only how to display it.

**Data Structure:**
```javascript
export const UI_CONFIG = {
  priorities: {
    essential: {
      label: 'Essential',
      emoji: '⚡',
      color: 'text-emerald-300',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-700/40',
      order: 1
    },
    // ... other priority tiers
  },
  types: {
    weapon: { label: 'Weapons', icon: Crosshair },
    // ... other item types
  }
};
```

**Used By:**
- `ProfileContext.jsx` - Item filtering and display
- UI components that render catalog items

**When to Update:**
- Adding new priority tier
- Adding new item type
- Changing visual styling/colors

---

### 4. `geography.js` (Game World Coordinates)

**Purpose:** Actual game map coordinates for fast travel locations. Used for distance-based cost calculations.

**Data Structure:**
```javascript
export const FAST_TRAVEL_LOCATIONS = {
  valentine: {
    name: 'Valentine',
    region: 'New Hanover',
    x: 0,    // Game coordinate X
    y: 0     // Game coordinate Y
  },
  // ... other locations
};
```

**CRITICAL:** Keys in this object MUST match `id` values in `topology.js` NODES array.

**Used By:**
- `utils/geo-spatial.js` - Distance calculations
- `utils/rdo-logic.js` - Fast travel cost formulas
- `components/widgets/FastTravelCalc.jsx` - Cost calculator
- `components/widgets/TravelMap.jsx` - Travel logic controller

---

### 5. `topology.js` (Visual Metro Map)

**Purpose:** Abstract SVG coordinates for the metro-style map visualization. These are NOT actual game coordinates.

**Data Structure:**
```javascript
export const NODES = [
  {
    id: 'valentine',    // MUST match key in geography.js
    name: 'VALENTINE',  // Display name
    x: 500,             // SVG X coordinate (0-1000)
    y: 250              // SVG Y coordinate (0-600)
  }
];

export const LINKS = [
  { from: 'valentine', to: 'rhodes' }  // Define visual connections
];
```

**Used By:**
- `components/widgets/MapBoard.jsx` - Renders the metro map
- `utils/graph-logic.js` - Pathfinding for route visualization

**When to Update:**
- Adjust visual layout of metro map
- Add new fast travel location (must also update geography.js)

---

### 6. `progression.js` (XP & Role Data)

**Purpose:** Player and role progression tables, role definitions, hunting values, and progression weighting.

**Data Structure:**
```javascript
// XP required for each player rank (cumulative)
export const RANK_XP_TABLE = [0, 0, 500, 1100, ...];

// XP required for each role rank (cumulative)
export const ROLE_XP_TABLE = [0, 0, 400, 900, ...];

// Role definitions
export const ROLES = {
  bountyHunter: {
    id: 'bountyHunter',
    name: 'Bounty Hunter',
    icon: '🎯',
    color: '#C41E3A',
    unlockCost: 15,  // Gold bars
    maxLevel: 30,
    vendor: 'Rhodes Sheriff',
    description: '...'
  }
};

// Hunting material values
export const HUNTING_VALUES = {
  largeAnimals: {
    cougar: { materials: 16.50, meat: 1, rare: true }
  }
};

// Progression weights (meta recommendations)
export const PROGRESSION_WEIGHTS = {
  weapons: { essential: [...], recommended: [...] },
  roleOrder: [...],
  abilityCards: {...},
  purchaseOrder: {...}
};
```

**Helper Functions:**
- `getLevelFromXP(xp, table)` - Convert XP to level
- `getXPProgress(xp, table)` - Get progress within current level

**Used By:**
- `utils/rdo-logic.js` - Level calculations
- `components/widgets/MissionControl.jsx` - Role display
- `components/widgets/RolesPanel.jsx` - Role cards
- Progression analysis logic

---

### 7. `encyclopedia.js` (Game Mechanics)

**Purpose:** Hidden game mechanics, legendary animals, free roam events, cooldowns, and reset timers.

**Data Structure:**
```javascript
// Cooldown constants
export const SPECIES_COOLDOWN_HOURS = 72;
export const MOONSHINE_BATCH_MINUTES = 48;

// Legendary animal database
export const LEGENDARY_ANIMALS = [
  {
    id: 'la_bear_golden',
    name: 'Golden Spirit Bear',
    species: 'BEAR',           // Species group (shares cooldown)
    location: 'Big Valley',
    time: 'Day',
    weather: 'Any',
    value: 62.50,              // Butcher sale value
    materials: 60,             // Trader materials
    coords: { x: 280, y: 250 },
    nodeId: 'strawberry',      // Nearest fast travel
    notes: 'Spawns near river...'
  }
];

// Free roam events
export const FREE_ROAM_EVENTS = [
  {
    id: 'fre_trade_route',
    name: 'Trade Route',
    type: 'trader',
    benefit: '+18 Goods',
    description: '...',
    duration: 10,
    recommended: true
  }
];

// Reset timers (UTC)
export const RESET_TIMES = {
  daily: { hour: 6, minute: 0 },
  weekly: { day: 2, hour: 6, minute: 0 }
};
```

**Helper Functions:**
- `getUniqueSpecies()` - Get list of all species
- `groupBySpecies()` - Group animals by species
- `getTimeUntilDailyReset()` - Calculate time until daily reset
- `getTimeUntilWeeklyReset()` - Calculate time until weekly reset
- `formatCountdown(ms)` - Format milliseconds to human-readable

**Used By:**
- `components/widgets/Compendium.jsx` - Encyclopedia display
- `hooks/useGameTimers.js` - Cooldown tracking

---

### 8. `schemas.js` (Validators & Types)

**Purpose:** Runtime validators, helper functions, and TypeScript/JSDoc type definitions. Pure JavaScript (no React, no Node, no browser APIs).

**Sections:**
1. **Enums** - `CATEGORY`, `SUBCATEGORY`, etc.
2. **Factory Functions** - `defaultWardrobeItem()`, `defaultCoreItem()`
3. **Validators & Helpers** - `normalizePrice()`, `clampVariants()`, `validateWardrobeItem()`
4. **TypeScript/JSDoc Types** - Type definitions for documentation

**Used By:**
- `hooks/useWardrobe.js` - Wardrobe item validation
- `components/widgets/WardrobeTracker.jsx` - Item display

**When to Update:**
- Adding new data validation rules
- Adding new helper functions
- Adding new TypeScript type definitions

---

### 9. `fastTravel.js` (Cost Calculations)

**Purpose:** Fast travel cost formulas and pricing data.

**Exports:**
- `FAST_TRAVEL_PRICES` - Price matrix
- `FAST_TRAVEL_PROMO` - Promotional pricing
- `calcDistance(loc1, loc2)` - Distance calculator
- `calcFastTravelCost(from, to)` - Cost calculator
- `generateFastTravelMatrix()` - Generate cost matrix
- `getCurrentFastTravelCost()` - Get current cost with promos

**Used By:**
- Fast travel calculators
- Route optimization

---

### 10. `bonuses.js` (XP & Economy)

**Purpose:** XP bonuses, collector sets, role payouts, and RDO update information.

**Exports:**
- `XP_BONUSES` - XP multipliers
- `COLLECTOR_SETS` - Complete sets and their values
- `COLLECTOR_TOTAL_VALUE` - Total value of all sets
- `ROLE_PAYOUTS` - Role-specific payout data
- `RDO_UPDATE_INFO` - Game update history

---

### 11. `rdo-data.js` (DEPRECATED)

**Purpose:** Backward compatibility during migration. DO NOT USE FOR NEW CODE.

**Status:** Will be removed in future update once all imports are migrated.

**Migration Guide:**
```javascript
// OLD (deprecated)
import { CATALOG, UI_CONFIG, FAST_TRAVEL_LOCATIONS, ROLES } from '../data/rdo-data';

// NEW (correct)
import { CATALOG } from '../data/catalog';
import { UI_CONFIG } from '../data/ui-config';
import { FAST_TRAVEL_LOCATIONS } from '../data/geography';
import { ROLES } from '../data/progression';
```

---

## Data Flow

```
┌─────────────────┐
│   Data Files    │
│  (catalog.js,   │
│  progression.js)│
└────────┬────────┘
         │
         ↓
    ┌────────┐
    │index.js│ ← Barrel exports
    └────┬───┘
         │
         ↓
┌────────────────┐
│   Contexts     │
│(ProfileContext)│ ← Central state
└────────┬───────┘
         │
         ↓
┌────────────────┐
│   Components   │
│  (Widgets)     │ ← UI rendering
└────────────────┘
```

---

## Adding New Data

### Adding a New Item to Catalog

1. Open `src/data/catalog.js`
2. Add new object to `CATALOG` array:
```javascript
{
  id: 'w_new_weapon',
  type: 'weapon',
  category: 'Rifle',
  name: 'New Rifle',
  price: 500,
  gold: 0,
  rank: 25,
  priority: 'recommended',
  desc: 'Description with meta info',
  aliases: ['new', 'rifle']
}
```
3. Run `npm run lint` to check syntax
4. Test in app

### Adding a New Fast Travel Location

1. Add to `geography.js`:
```javascript
newtown: {
  name: 'New Town',
  region: 'Lemoyne',
  x: 40,
  y: -20
}
```
2. Add to `topology.js` NODES:
```javascript
{ id: 'newtown', name: 'NEW TOWN', x: 700, y: 300 }
```
3. Add connections in `topology.js` LINKS:
```javascript
{ from: 'newtown', to: 'rhodes' }
```

### Adding a New Role

1. Add to `progression.js` ROLES:
```javascript
newRole: {
  id: 'newRole',
  name: 'New Role',
  icon: '🎭',
  color: '#3B82F6',
  unlockCost: 25,
  maxLevel: 20,
  vendor: 'Vendor Name',
  description: 'Role description'
}
```
2. Add role-specific items to catalog with `role: 'newRole'`

---

## Import Best Practices

### ✅ Good

```javascript
// Import from specific files
import { CATALOG } from '../data/catalog';
import { ROLES } from '../data/progression';

// Or import from barrel file
import { CATALOG, ROLES } from '../data';
```

### ❌ Bad

```javascript
// Don't import from deprecated file
import { CATALOG } from '../data/rdo-data';  // DEPRECATED

// Don't import everything
import * as DATA from '../data';  // Too broad
```

---

## File Naming Conventions

- **kebab-case** for file names: `fast-travel.js`, `ui-config.js`
- **SCREAMING_SNAKE_CASE** for data constants: `CATALOG`, `FAST_TRAVEL_LOCATIONS`
- **camelCase** for functions: `getLevelFromXP`, `calcDistance`
- **PascalCase** for React components (not in /data)

---

## Testing Data Changes

1. Run linter: `npm run lint`
2. Check for import errors
3. Test affected components in UI
4. Verify backward compatibility if changing exports

---

## Questions?

If you need to add new data or restructure existing data:
1. Check if it fits in an existing file
2. If not, create a new file following conventions
3. Add exports to `index.js`
4. Document in this file
5. Update relevant components
