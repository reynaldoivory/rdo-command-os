# RDO Simulator: Compendium, Catalogue & Wiki
## Checkpoint-Based Development Roadmap

**Project Goal**: Build the most comprehensive, professionally-architected Red Dead Online companion system that functions as simulator, decision engine, and interactive reference resource.

**Architecture Philosophy**: 
- Checkpoint-driven (not time-based)
- Self-contained milestones
- No deadlines, no pressure
- Work in any order that makes sense
- Each checkpoint delivers usable functionality

---

## 📍 PHASE 0: FOUNDATION ✅ COMPLETE

### Status: 🟢 Ready to Build

All data extraction, schema design, and architectural planning is complete.

**Deliverables**:
- ✅ `rdo_extraction_log.json` - Structured data from all 3 sources
- ✅ `rdo_unified_schema.ts` - Complete TypeScript interfaces
- ✅ `IMPLEMENTATION_GUIDE.md` - 15K-word developer documentation
- ✅ Data integrity principles documented
- ✅ Economic formulas reverse-engineered

**What You Have**:
- Complete understanding of RDO economic systems
- Comprehensive catalog data structure
- Fast travel matrix with coordinates
- Bounty payout formulas
- Trader material economics
- Collector cycle logic
- Animal compendium schema
- Confidence tier system

**Move to Phase 1 when**: You're ready to start implementing code.

---

## 🏗️ PHASE 1: CORE INFRASTRUCTURE

### Checkpoint 1.1: Project Structure & Data Files

**Goal**: Organize your codebase to support the v3 data model

**Tasks**:
- [ ] Create `/src/data/` directory structure:
  - `/src/data/catalog/` - All purchasable items
  - `/src/data/animals/` - Animal spawn data
  - `/src/data/locations/` - Geographic & fast travel nodes
  - `/src/data/formulas/` - Economic calculation definitions
  - `/src/data/schema.ts` - TypeScript interfaces (from rdo_unified_schema.ts)

- [ ] Create `/src/store/` Redux architecture:
  - `/src/store/slices/catalogSlice.js` - Item management
  - `/src/store/slices/animalSlice.js` - Animal data
  - `/src/store/slices/locationSlice.js` - Geographic data
  - `/src/store/slices/simulationSlice.js` - User simulation state
  - `/src/store/selectors.js` - Memoized query functions
  - `/src/store/formulas.js` - Pure calculation functions

- [ ] Create `/src/utils/` helper functions:
  - `/src/utils/validation.js` - Data integrity checks
  - `/src/utils/calculations.js` - Economic math
  - `/src/utils/confidence.js` - Confidence tier filtering

**Output**: 
- Organized file structure ready for data population
- All directories created and empty files stubbed

**Validation**: 
```bash
# Verify structure
ls -R src/data src/store src/utils
# All directories exist and contain stub files
```

---

### Checkpoint 1.2: TypeScript Schema Integration

**Goal**: Define complete data structures with confidence tiers and source attribution

**Tasks**:
- [ ] Copy `rdo_unified_schema.ts` content to `/src/data/schema.ts`
- [ ] Verify all 8 interface types are present:
  - `RDOItem` (catalog items)
  - `Animal` (hunting/spawns)
  - `EconomicFormula` (payout calculations)
  - `FastTravelNode` (coordinates & costs)
  - `CollectorSet` (rotation schedules)
  - `RoleProgression` (unlock chains)
  - `ConfidenceTier` (data quality levels)
  - `DataSource` (attribution & versioning)

- [ ] Create JSDoc documentation for each interface
- [ ] Add example implementations for each type
- [ ] Validate that all fields are optional/required correctly

**Output**: 
- `/src/data/schema.ts` with complete, documented interfaces
- Example data objects for each type

**Validation**: 
```javascript
// Test that example data conforms to schema
import { validateItem, validateAnimal } from './data/schema.js';
validateItem(exampleNavyRevolver); // No errors
validateAnimal(exampleCougar); // No errors
```

---

### Checkpoint 1.3: Redux Store Foundation

**Goal**: Set up Redux infrastructure to manage all game data

**Tasks**:
- [ ] Install Redux dependencies (if not present):
  ```bash
  npm install @reduxjs/toolkit react-redux
  ```

- [ ] Create `/src/store/store.js`:
  - Configure Redux store
  - Register all slices
  - Enable Redux DevTools

- [ ] Create placeholder slices:
  - `catalogSlice.js` with actions: `setItems`, `updateItem`, `filterByShop`
  - `animalSlice.js` with actions: `setAnimals`, `updateSpawn`
  - `locationSlice.js` with actions: `setLocations`
  - `simulationSlice.js` with actions: `setSim`, `updateResources`

- [ ] Create `/src/store/selectors.js` with memoized selectors:
  - `selectAllItems()`
  - `selectItemsByShop(shopId)`
  - `selectAffordableItems(cash, gold, tokens)`
  - `selectAllAnimals()`
  - `selectAnimalsByRegion(region)`
  - (More selectors will be added in later checkpoints)

**Output**: 
- Complete Redux store setup with empty data
- Memoized selectors ready to query data

**Validation**: 
```javascript
// Redux store initializes without errors
import store from './store/store.js';
console.log(store.getState()); // { catalog: {}, animals: {}, ... }

// Selectors work
const items = selectAllItems(store.getState());
console.log(items); // []
```

---

### Checkpoint 1.4: Data Loader System

**Goal**: Create system to load external data files into Redux

**Tasks**:
- [ ] Create `/src/data/loaders.js`:
  - `loadCatalog()` - Load items from JSON
  - `loadAnimals()` - Load animal data
  - `loadLocations()` - Load fast travel matrix
  - `loadFormulas()` - Load economic definitions

- [ ] Create `/src/hooks/useDataLoad.js`:
  - Custom hook to dispatch data loading on app start
  - Handle loading states (loading, error, success)
  - Cache data to avoid re-fetching

- [ ] Add error handling:
  - Validate loaded data against schema
  - Log validation errors
  - Provide fallback empty data

**Output**: 
- Data loaders that populate Redux from JSON files
- Custom React hook for declarative data loading
- Error handling and validation

**Validation**: 
```javascript
// Hook loads data on component mount
function App() {
  const { loading, error, data } = useDataLoad();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  // Data is now in Redux store
}
```

---

**PHASE 1 COMPLETE WHEN**:
- ✅ Project structure is organized
- ✅ TypeScript schemas are defined
- ✅ Redux store is configured
- ✅ Data loading system works

**Next Phase**: PHASE 2 - Catalog Population

---

## 📦 PHASE 2: CATALOG POPULATION

### Checkpoint 2.1: Wheeler, Rawson & Co. Complete Catalog

**Goal**: Populate all purchasable items with prices, unlock levels, and metadata

**Tasks**:
- [ ] Create `/src/data/catalog/weapons.json`:
  - All sidearms (Revolvers, Pistols)
  - All longarms (Rifles, Shotguns, Bows)
  - All ammo types
  - Include: price, gold cost, unlock rank, meta score, hidden stats

- [ ] Create `/src/data/catalog/horses.json`:
  - All horse breeds
  - Horse tack & saddles
  - Include: price, gold cost, stamina, health, speed stats

- [ ] Create `/src/data/catalog/clothing.json`:
  - All outfit components
  - Bandoliers, accessories
  - Include: price, category, availability

- [ ] Create `/src/data/catalog/consumables.json`:
  - Tonics, provisions, ammunition
  - Include: price, effect, type

- [ ] Create `/src/data/catalog/role-items.json`:
  - Role-specific tools (Metal Detector, Shovel, etc.)
  - Upgrades (Stills, Wagons, Safes)
  - Include: price, gold cost, role, rank requirement, effect

- [ ] Add metadata to ALL items:
  - `confidence`: HIGH/MEDIUM/LOW
  - `sources`: Array of { type, date, verified_by }
  - `meta_score`: 1-10 (usefulness ranking)
  - `opportunity_cost`: String explaining alternatives
  - `hidden_stats`: Object of non-visible properties

**Data Source**: 
- Extract from `rdo_extraction_log.json` (Frontier Algorithm)
- Extract from Complete RDO Catalog v4.2 research
- Cross-reference with in-game testing

**Output**: 
- 5 JSON files with 200+ items
- All items have confidence tiers
- All items have source attribution

**Validation**: 
```javascript
// All items load and validate
const weapons = require('./data/catalog/weapons.json');
weapons.forEach(item => {
  assert(item.id, 'Missing id');
  assert(item.price !== undefined, 'Missing price');
  assert(item.confidence, 'Missing confidence tier');
  assert(item.sources.length > 0, 'Missing sources');
});
```

---

### Checkpoint 2.2: Role Progression & Prerequisites

**Goal**: Map out which items unlock at which ranks and which roles have prerequisites

**Tasks**:
- [ ] Create `/src/data/roles.json`:
  ```json
  {
    "id": "trader",
    "name": "Trader",
    "unlock_cost_gold": 15,
    "unlock_cost_cash": 0,
    "unlock_rank": 5,
    "max_rank": 20,
    "prerequisites": [],
    "description": "Hunt and sell animal materials"
  }
  ```

- [ ] Add for each role: Trader, Collector, Bounty Hunter, Moonshiner, Naturalist

- [ ] Create `/src/data/unlock-chains.json`:
  - Map which items require which ranks
  - Map which roles require other roles (Moonshiner → Trader Rank 5)
  - Include conditional unlocks (Collector Metal Detector at Rank 5)

- [ ] Create `/src/utils/prerequisites.js`:
  - Function: `getPrerequisitesFor(itemId, currentStats)` → [ { type, status, cost } ]
  - Function: `canUnlock(itemId, stats)` → boolean
  - Function: `calculateUnlockPath(targetItem, currentStats)` → [ { step, activity, duration } ]

**Output**: 
- Complete role definitions
- Unlock chain documentation
- Utility functions for prerequisite checking

**Validation**: 
```javascript
// Check prerequisites
const prereqs = getPrerequisitesFor('metal_detector', { rank: 3, collector_rank: 2 });
// Returns: [{ type: 'role_rank', role: 'collector', current: 2, needed: 5 }]

// Can unlock?
const canUnlock = canUnlock('moon shiner_license', { rank: 5, gold: 30, trader_rank: 5 });
// Returns: true (assuming all conditions met)
```

---

### Checkpoint 2.3: Affordability & Opportunity Cost Calculator

**Goal**: Create real-time affordability checking with alternative suggestions

**Tasks**:
- [ ] Create `/src/utils/affordability.js`:
  - Function: `canAfford(item, cash, gold, tokens)` → boolean
  - Function: `getAffordableItems(cash, gold, tokens, allItems)` → [ items ]
  - Function: `howMuchLonger(cashNeeded, hourlyRate)` → "2.5 hours of Trader runs"

- [ ] Create `/src/utils/opportunity-cost.js`:
  - Function: `getAlternatives(item)` → [ { item, reason, value_difference } ]
  - Function: `getOpportunityCost(item, playerContext)` → string explanation
  - Examples:
    - "Black Arabian (42 GB) costs same as 3 role licenses that generate income forever"
    - "Using collectibles in Moonshine loses $400 set completion bonus"

- [ ] Create `/src/store/selectors/affordabilitySelectors.js`:
  - `selectAffordableItemsByShop(state, shopId)`
  - `selectItemsYouCantAfford(state)`
  - `selectItemsByHowCloseYouAre(state)` (Sort by proximity to unlock)

**Output**: 
- Utility functions for affordability checking
- Opportunity cost explanations
- Redux selectors for UI queries

**Validation**: 
```javascript
// Affordability check
const affordable = canAfford(metalDetector, 700, 2); // true if 700+ cash and 2+ gold
const alternatives = getAlternatives(metalDetector);
// Returns: [{ item: Shovel, reason: "Unlocks same role", value_difference: -350 }]
```

---

### Checkpoint 2.4: Catalog Browser Component

**Goal**: Build React component to browse and search items by shop/category

**Tasks**:
- [ ] Create `/src/components/Catalog/CatalogBrowser.jsx`:
  - Display items in grid layout
  - Filter by shop
  - Filter by affordability (yours, not afforded, locked)
  - Search by name
  - Show confidence badge on each item

- [ ] Create `/src/components/Catalog/CatalogItem.jsx`:
  - Display item card with:
    - Name, icon/image, description
    - Price (cash or gold)
    - Unlock level required
    - Confidence tier + sources link
    - Meta score badge
    - Opportunity cost warning (if applicable)
  - Click to view details

- [ ] Create `/src/components/Catalog/CatalogDetail.jsx`:
  - Full item information modal:
    - Complete stats (visible + hidden)
    - Prerequisite chain visualization
    - Alternative items with comparisons
    - Source attribution (clickable to original source)
    - Player can simulate affording it

**Output**: 
- 3 React components for browsing catalog
- Search and filter functionality
- Confidence tier badges
- Opportunity cost warnings

**Validation**: 
```
1. Click "Weapons" filter → Only weapons display
2. Search "Revolver" → Only revolvers
3. Hover item → Show confidence badge
4. Click item → Open modal with full details
5. Modal shows: "You need Rank 50 (Current: 47)" in red
6. Modal shows: "Alternatives: Rolling Block Rifle (-$45, similar scope)"
```

---

**PHASE 2 COMPLETE WHEN**:
- ✅ All catalog data is populated (200+ items)
- ✅ All items have confidence tiers and sources
- ✅ Affordability and opportunity cost functions work
- ✅ Catalog browser component is functional

**Next Phase**: PHASE 3 - Animal Compendium

---

## 🐻 PHASE 3: ANIMAL COMPENDIUM

### Checkpoint 3.1: Animal Database with Geographic Data

**Goal**: Build complete animal compendium with spawn locations and economics

**Tasks**:
- [ ] Create `/src/data/animals/predators.json`:
  - Cougar, Panther, Bear, Puma, etc.
  - For each: spawn regions, pelt values, material values, hunting difficulty
  - Include coordinates from Jeanropke data where available

- [ ] Create `/src/data/animals/herbivores.json`:
  - Deer, Elk, Bison, etc.
  - Material values for Trader
  - Spawning patterns by season

- [ ] Create `/src/data/animals/small-game.json`:
  - Rabbits, Squirrels, Muskrats, etc.
  - Material values
  - Quick-cash efficiency ranking

- [ ] Create `/src/data/animals/legendary.json`:
  - All legendary animals
  - Study phases for Naturalist
  - Material bomb values
  - Specific spawn locations and conditions

- [ ] Add to ALL animals:
  - `spawn_locations`: [ { region, coordinates, probability } ]
  - `perfect_pelt_value`: Cash value
  - `material_value`: Trader donation value
  - `efficiency_rating`: Hunting time vs payout
  - `seasonality`: When they spawn
  - `confidence`: HIGH/MEDIUM/LOW
  - `sources`: Attribution array

**Data Source**:
- Jeanropke map coordinates (geographic)
- Frontier Algorithm (economic data)
- RDO community testing (spawn probabilities)

**Output**: 
- 4 JSON files with 100+ animals
- All animals have geographic coordinates
- All animals have economic values
- Confidence tiers on all data points

**Validation**: 
```javascript
// Verify animal data structure
const animals = require('./data/animals/*.json');
animals.forEach(animal => {
  assert(animal.id, 'Missing id');
  assert(animal.spawn_locations, 'Missing spawn data');
  assert(animal.perfect_pelt_value > 0, 'Missing pelt value');
  assert(animal.confidence, 'Missing confidence');
});
```

---

### Checkpoint 3.2: Hunting Economics Calculator

**Goal**: Create system to calculate hunting profitability by animal/region/time

**Tasks**:
- [ ] Create `/src/utils/hunting-calc.js`:
  - Function: `getProfitPerHour(animal, method)` → { cash_per_hour, materials_per_hour }
  - Function: `getOptimalHuntingRoute(region, time_available, pelt_quality)` → [ animals ]
  - Function: `estimateHuntingTime(animal, difficulty_level)` → minutes
  - Include modifiers for:
    - Trader rank (Efficiency perk: +25%)
    - Naturalist rank (legendary access)
    - Player skill (weapon choice affects time)

- [ ] Create `/src/store/selectors/huntingSelectors.js`:
  - `selectProfitableAnimalsInRegion(state, region)`
  - `selectOptimalHuntingRoute(state, params)`
  - `selectAnimalsByEfficiency(state)` (rank by profit/hour)
  - `selectLegendaryAnimalsAvailable(state)` (filtered by Naturalist rank)

**Output**: 
- Utility functions for hunting optimization
- Redux selectors for querying hunting data
- Profit per hour calculations

**Validation**: 
```javascript
// Calculate hunting profitability
const cougar_profit = getProfitPerHour({ id: 'cougar' }, 'perfect_pelt');
// Returns: { cash_per_hour: 187.50, materials_per_hour: 16.88 }

// Get optimal route
const route = getOptimalHuntingRoute('West Elizabeth', 120, '3_star');
// Returns: [{ animal: 'Cougar', location: {...}, estimated_time: 45 }, ...]
```

---

### Checkpoint 3.3: Animal Browser Component

**Goal**: Create UI to explore animal data and hunting guides

**Tasks**:
- [ ] Create `/src/components/Compendium/AnimalBrowser.jsx`:
  - Display animals in grid (thumbnails + names)
  - Filter by: region, type (predator/herbivore), profitability
  - Search by name
  - Sort by: profit/hour, difficulty, spawn rate

- [ ] Create `/src/components/Compendium/AnimalCard.jsx`:
  - Quick info: name, region, pelt value, material value
  - Efficiency badge (gold star if top 10)
  - Confidence tier indicator

- [ ] Create `/src/components/Compendium/AnimalDetail.jsx`:
  - Full animal guide:
    - Spawn locations (with coordinates)
    - Spawn probability map
    - Hunting guide (best weapon, approach method)
    - Economic comparison (pelt vs materials vs Naturalist study)
    - Seasonal variations
    - Source attribution

- [ ] Create `/src/components/Compendium/HuntingRoute.jsx`:
  - Route optimizer visualization:
    - Select region and time
    - Display optimized animal sequence
    - Show travel route between animals
    - Estimate total profit/hour
    - Include waypoints

**Output**: 
- 4 React components for animal exploration
- Animal browsing and search
- Route optimization display

**Validation**: 
```
1. Click "Animals" in sidebar → Animal browser displays
2. Filter "West Elizabeth" → Shows only that region's animals
3. Sort by "Profit/Hour" → Cougars at top ($187/hr)
4. Click "Cougar" → Detail modal shows:
   - Spawn locations with coordinates
   - "Perfect 3-star: $5.00 pelt, 16.88 materials"
   - "Estimated 15 min hunt time"
   - Map showing spawn areas
5. Click "Generate Route" → Shows sequence of 4 cougars, Est. $187/hour
```

---

**PHASE 3 COMPLETE WHEN**:
- ✅ All animal data populated (100+ animals)
- ✅ Geographic coordinates mapped
- ✅ Economic values calculated
- ✅ Animal browser components work
- ✅ Hunting route optimizer functional

**Next Phase**: PHASE 4 - Economic Calculators

---

## 💰 PHASE 4: ECONOMIC CALCULATORS

### Checkpoint 4.1: Bounty Hunter Payout Calculator

**Goal**: Implement reverse-engineered bounty formula with time optimization

**Tasks**:
- [ ] Create `/src/data/formulas/bounty-payout.json`:
  ```json
  {
    "formula": "P = B × M_tier × M_status × M_time × M_count",
    "variables": {
      "B": { "description": "Base Cash", "standard": 30 },
      "M_tier": { "description": "Tier Multiplier", "values": { "1": 1.0, "2": 1.25, "3": 1.5 } }
    },
    "optimal_parameters": { "turn_in_time_minutes": 12, "status": "alive" },
    "gold_step_function": [
      { "minutes": 3, "gold": 0.08, "rate": 0.026 },
      { "minutes": 12, "gold": 0.32, "rate": 0.026, "note": "Peak efficiency" }
    ]
  }
  ```

- [ ] Create `/src/utils/bounty-calc.js`:
  - Function: `calculateCashPayout(base, tier, status, minutes, targetCount)` → cash
  - Function: `calculateGoldPayout(minutes)` → gold
  - Function: `getOptimalTurnInTime()` → 12 minutes (with explanation)
  - Function: `compareBountyProfitability(bounties)` → ranked list

- [ ] Create `/src/store/selectors/bountySelectors.js`:
  - `selectBountyProfitPerHour(state, bountyId)`
  - `selectOptimalBountiesByRegion(state, region)`
  - `selectBountyPayout(state, params)` (real-time calculator)

**Output**: 
- Formula documentation in JSON
- Bounty calculator functions
- Redux selectors for bounty queries

**Validation**: 
```javascript
// Calculate bounty payout
const payout = calculateCashPayout(30, 1.5, 'alive', 12, 1);
// Returns: 45 (base) × 1.5 (tier) × 1.0 (alive) × time_multiplier × 1.0 (count)

const gold = calculateGoldPayout(12);
// Returns: 0.32 GB (peak efficiency point)

// Get optimal strategy
const timing = getOptimalTurnInTime();
// Returns: { minutes: 12, reason: "Peak gold/hour efficiency", explanation: "..." }
```

---

### Checkpoint 4.2: Trader Goods Production Calculator

**Goal**: Model Trader role economics (material input → goods → cash output)

**Tasks**:
- [ ] Create `/src/data/formulas/trader-production.json`:
  ```json
  {
    "material_input_rate": 2,
    "supply_input_rate": 1,
    "goods_produced": 1,
    "production_time_minutes": 2,
    "production_time_total_for_100": 200,
    "local_delivery_value": 500,
    "distant_delivery_value": 625,
    "efficiency_perk_bonus": 0.25,
    "legendary_animal_materials": { "golden_spirit_bear": 62.5, "payta_bison": 58.75 }
  }
  ```

- [ ] Create `/src/utils/trader-calc.js`:
  - Function: `materialsToCash(materials, rank, perkActive)` → cash
  - Function: `timeToProduction(materials)` → minutes
  - Function: `deliveryProfit(goods, local_or_distant)` → cash
  - Function: `legendaryAnimalValue(animal_id)` → materials
  - Function: `getProfitPerHour(huntingMethod)` → cash/hour

- [ ] Create `/src/store/selectors/traderSelectors.js`:
  - `selectTraderProfitPerHour(state)`
  - `selectMaterialValueByAnimal(state, animalId)`
  - `selectLegendaryAnimalValue(state, animalId)`

**Output**: 
- Trader production formula documentation
- Production calculator functions
- Profit per hour estimations

**Validation**: 
```javascript
// Goods production
const cashValue = materialsToCash(100, 15, true); // rank 15, with Efficiency perk
// Returns: 500 (base) × 1.25 (distant delivery) × 1.25 (efficiency perk) = 781.25

// Legendary animal value
const bear_value = legendaryAnimalValue('golden_spirit_bear');
// Returns: 62.5 materials (fills ~62% of 100-good batch)

// Time to production
const time = timeToProduction(100); // 100 goods
// Returns: 200 minutes (3 hours 20 minutes)
```

---

### Checkpoint 4.3: Moonshiner Profit Maximizer

**Goal**: Calculate Moonshine production costs and optimal flavor profiles

**Tasks**:
- [ ] Create `/src/data/formulas/moonshiner-economics.json`:
  ```json
  {
    "base_mash_cost": 50,
    "bootlegger_mission_discount": 20,
    "floor_price": 10,
    "discount_duration_minutes": 2880,
    "production_flavors": {
      "unflavored": { "multiplier": 1.0, "base_value": 144.37 },
      "2_star": { "multiplier": 1.57, "base_value": 226.87, "ingredients": ["peaches"] },
      "3_star": { "multiplier": 1.71, "base_value": 247.50, "ingredients": ["collectibles"] }
    },
    "optimal_choice": "2_star_berry_cobbler"
  }
  ```

- [ ] Create `/src/utils/moonshiner-calc.js`:
  - Function: `calculateMoonshineProfit(mashCost, strength, flavor)` → profit
  - Function: `compareFlavorProfit(strength)` → { unflavored, 2star, 3star } with margins
  - Function: `bootleggerMissionROI(missionTime)` → { savings, time_cost, worthwhile }
  - Function: `getProfitPerHour(mashCost, flavor)` → profit/hour
  - Include: "Collectible Trap" warning (using items in moonshine vs selling as sets)

- [ ] Create `/src/store/selectors/moonshineSel ectors.js`:
  - `selectBestMoonshineStrategy(state)`
  - `selectMoonshineProfit(state, mashCost, strength)`
  - `selectCollectibleTrapWarning(state, itemId)`

**Output**: 
- Moonshiner economics formula
- Profit calculator with flavor comparisons
- Warnings about collectible trap

**Validation**: 
```javascript
// Calculate profit
const profit = calculateMoonshineProfit(50, 'strong', '2_star');
// Returns: 226.87 (revenue) - 50 (mash) = 176.87 profit

// Compare strategies
const comparison = compareFlavorProfit('strong');
// Returns: {
//   unflavored: { revenue: 144.37, profit: 94.37, per_hour: 118.00 },
//   2_star: { revenue: 226.87, profit: 176.87, per_hour: 221.09 },
//   3_star: { revenue: 247.50, profit: 197.50, per_hour: 246.88, warning: "Uses collectible" }
// }

// Bootlegger mission analysis
const roi = bootleggerMissionROI(15); // 15 minute mission
// Returns: { 
//   savings: 20, 
//   time_cost: 15, 
//   profitable_if_else_earns_more_than: 80 
// }
```

---

### Checkpoint 4.4: Collector Route Optimizer

**Goal**: Build collector route optimizer using Jeanropke coordinates

**Tasks**:
- [ ] Create `/src/data/locations/collector-cycles.json`:
  - All 14 collector sets with location data
  - Cycle rotation schedule
  - Jeanropke map ID cross-reference

- [ ] Create `/src/utils/collector-calc.js`:
  - Function: `getCollectorRoute(setName, cycle)` → [ locations in optimal order ]
  - Function: `estimateCollectorProfit(fullRun)` → { cash, xp, time }
  - Function: `getMapCost(maps_purchased)` → cost (Madam Nazar maps)
  - Function: `compareWithJeanropke()` → efficiency improvement

- [ ] Create `/src/components/Compendium/CollectorRoute.jsx`:
  - Select collection set
  - Select cycle (auto-calculated from date or manual)
  - Display route on map
  - Show item locations
  - Estimate time and profit
  - Link to Jeanropke map

**Output**: 
- Collector set and cycle data
- Route optimization functions
- React component for route planning

**Validation**: 
```javascript
// Get optimal collector route
const route = getCollectorRoute('tarot_cards', 5);
// Returns: [
//   { id: 't1', name: 'Tarot - The Fool', location: {...}, distance_to_next: 0.3 },
//   { id: 't7', name: 'Tarot - The Magician', location: {...}, distance_to_next: 0.5 },
//   ...
// ]

// Estimate profit
const profit = estimateCollectorProfit(fullRun);
// Returns: { cash: 800, xp: 11600, time_minutes: 90 }
```

---

### Checkpoint 4.5: Role Comparison Dashboard

**Goal**: Create comparison tool showing all roles side-by-side

**Tasks**:
- [ ] Create `/src/components/Analysis/RoleComparison.jsx`:
  - 5 cards (one per role)
  - For each role show:
    - Profit per hour (cash, gold)
    - Unlock cost and requirement
    - Complexity level (active vs passive)
    - Time commitment
    - Best rotation (what to do when)
    - Unlocked items
    - Efficiency tips

- [ ] Create `/src/components/Analysis/EconomyInsights.jsx`:
  - Key findings:
    - "Bounty Hunter is the ONLY active role that generates Gold"
    - "Collector is fastest XP but requires 200+ items of running"
    - "Moonshiner is your passive income while doing other things"
    - "Trader converts animal biomass to cash with time gate"
    - "Naturalist studies legendary animals for Trader material bombs"

**Output**: 
- Role comparison component
- Economic insights panel

**Validation**: 
```
RoleComparison displays:
1. Card for each role with:
   - Icon, name, unlock cost
   - "Profit/Hour: $187.50" (in gold if applicable)
   - "Time to Unlock: 5 Rank + 15 Gold"
   - "Complexity: Passive (check in daily)"
   - Top 3 tips

2. EconomyInsights shows:
   - "Gold is bottleneck - only Bounty Hunter generates it"
   - "Legendary Bounties earn $450+ for 30-min wait"
   - "Collector + Jeanropke map = $400+/hr (4x intended)"
```

---

**PHASE 4 COMPLETE WHEN**:
- ✅ All 5 economic formulas implemented
- ✅ Profit calculators for all roles working
- ✅ Collector route optimizer functional
- ✅ Role comparison dashboard displays correctly

**Next Phase**: PHASE 5 - Geographic Systems

---

## 🗺️ PHASE 5: GEOGRAPHIC SYSTEMS

### Checkpoint 5.1: Fast Travel Network & Distance Matrix

**Goal**: Implement complete fast travel system with exploit documentation

**Tasks**:
- [ ] Create `/src/data/locations/fast-travel-nodes.json`:
  ```json
  {
    "nodes": [
      { "id": "valentine", "name": "Valentine", "coordinates": [44.5, -73.2], "cost_from_camp": 2.50 },
      { "id": "annesburg", "name": "Annesburg", "coordinates": [78.1, -18.5], "cost_from_camp": 5.50 },
      ...
    ],
    "matrix": {
      "valentine_to_annesburg": { "distance_miles": 145.65, "cost": 12.00, "notes": "Capped at max" },
      ...
    }
  }
  ```

- [ ] Create `/src/utils/fast-travel-calc.js`:
  - Function: `calculateTravelCost(origin, destination)` → cash
  - Function: `isWildernessCampArbitrage(origin, destination)` → boolean + savings
  - Function: `getAllRoutesFromNode(node)` → [ { destination, cost, distance } ] sorted by cost

- [ ] Create `/src/data/locations/wilderness-camp-exploit.json`:
  - Document the $1 wilderness camp exploit
  - Calculate savings potential
  - Include: "Cost to unlock exploit: $2,030 + tokens"

**Output**: 
- Fast travel node coordinates
- Distance matrix with costs
- Wilderness Camp arbitrage calculator
- Exploit documentation

**Validation**: 
```javascript
// Standard fast travel
const cost = calculateTravelCost('valentine', 'annesburg');
// Returns: 12.00 (capped at maximum)

// Wilderness Camp arbitrage
const arbitrage = isWildernessCampArbitrage('tumbleweed', 'heartlands');
// Returns: { savings: 7.00, normal_cost: 10.00, arbitrage_cost: 3.00 }
```

---

### Checkpoint 5.2: Region & Biome System

**Goal**: Organize map into regions with economic profiles

**Tasks**:
- [ ] Create `/src/data/locations/regions.json`:
  ```json
  {
    "regions": [
      { 
        "id": "west_elizabeth",
        "name": "West Elizabeth",
        "animals": ["cougar", "puma", "elk", ...],
        "fast_travel_hubs": ["valentine", "strawberry"],
        "optimal_for": "Hunting (predators, top-tier pelts)"
      },
      ...
    ]
  }
  ```

- [ ] For each region document:
  - Best animals (by profit/hour)
  - Biome type (forest, desert, grassland)
  - Climate (affects animal spawns)
  - Fast travel accessibility
  - Danger level (NPC encounter rate)

- [ ] Create `/src/store/selectors/locationSelectors.js`:
  - `selectAnimalsByRegion(state, regionId)`
  - `selectBestHuntingRegion(state)` (ranked by profit/hour)
  - `selectFastTravelNearestTo(state, coordinates)`

**Output**: 
- Regional organization system
- Animal-to-region mapping
- Redux selectors for location queries

**Validation**: 
```javascript
// Query animals by region
const we_animals = selectAnimalsByRegion(state, 'west_elizabeth');
// Returns: [ Cougar, Puma, Elk, Boar, ... ] (top predators)

// Get best hunting region
const best = selectBestHuntingRegion(state);
// Returns: West Elizabeth ($187/hr avg)
```

---

### Checkpoint 5.3: Map Component with Route Visualization

**Goal**: Build interactive map showing animals, spawns, and routes

**Tasks**:
- [ ] Create `/src/components/Map/MapViewer.jsx`:
  - Canvas or SVG-based map of RDO world
  - Overlays: Animals, Spawns, Routes, Fast Travel Nodes
  - Zoom & pan functionality
  - Toggle layers (animals, routes, nodes)

- [ ] Create `/src/components/Map/LayerControls.jsx`:
  - Checkboxes for: Animals, Hunting Routes, Fast Travel, Regions
  - Filter by profitability
  - Select specific animal to highlight spawns

- [ ] Create `/src/components/Map/RouteVisualizer.jsx`:
  - Display current/planned hunting route as line
  - Show waypoints with distance/time estimates
  - Display total route profit/hour

**Output**: 
- Interactive map component
- Layer control system
- Route visualization

**Validation**: 
```
Map displays:
1. RDO world coordinates
2. Layer toggle shows/hides elements
3. Click animal type → shows all spawns in that color
4. Select route → draws polyline between waypoints
5. Hover waypoint → shows "Cougar spawn, Est. 15 min hunt"
```

---

**PHASE 5 COMPLETE WHEN**:
- ✅ Fast travel matrix complete and tested
- ✅ Region system organized
- ✅ Map component displays correctly
- ✅ Route visualization working

**Next Phase**: PHASE 6 - UI Components & Integration

---

## 🎨 PHASE 6: UI COMPONENTS & INTEGRATION

### Checkpoint 6.1: Refactor App.jsx with New Systems

**Goal**: Integrate v3 architecture into main app while preserving existing functionality

**Tasks**:
- [ ] Update `/src/App.jsx`:
  - Import Redux store and useSelector hooks
  - Replace hardcoded MASTER_CATALOG with Redux data
  - Connect SimulationHub to Redux simulation state
  - Connect ShopBrowser to selectAffordableItems selector

- [ ] Update `/src/components/SimulationHub.jsx`:
  - Read from Redux `simulationSlice`
  - Dispatch actions instead of local reducer
  - Display confidence badges for items
  - Show opportunity cost warnings

- [ ] Integrate confidence tier UI:
  - Add small badge to catalog items
  - Hover to show sources
  - Color code by confidence (GREEN=HIGH, YELLOW=MEDIUM, RED=LOW)

**Output**: 
- App.jsx integrated with Redux
- Catalog data now dynamic (loaded from JSON)
- Confidence tiers displayed in UI

**Validation**: 
```
1. App loads without errors
2. Catalog items load from Redux (not hardcoded)
3. Filters still work (by shop, affordability)
4. Confidence badges appear on items
5. Hover badge shows "HIGH confidence - Verified: Reddit (11/20/25)"
```

---

### Checkpoint 6.2: Navigation & Layout Refactor

**Goal**: Restructure sidebar to include all new features

**Tasks**:
- [ ] Expand sidebar sections:
  - Dashboard (existing)
  - Catalog (existing)
  - **Animals (new)** - Compendium browser
  - **Routes (new)** - Hunting route optimizer
  - **Analysis (new)** - Role comparison, economy insights
  - **Map (new)** - Geographic viewer

- [ ] Update RopkeSidebar to reflect new structure
- [ ] Ensure mobile responsiveness

**Output**: 
- Expanded navigation menu
- All new features accessible from sidebar

**Validation**: 
```
Sidebar shows:
- Dashboard
- Catalog → [Weapons, Horses, Clothing, etc.]
- Animals → [Predators, Herbivores, Legendary]
- Routes → [Hunting Routes, Collector Routes]
- Analysis → [Role Comparison, Economic Insights]
- Map → [Interactive Map, Region Browser]
```

---

### Checkpoint 6.3: Decision Engine & Recommendations

**Goal**: Implement "What should I do next?" recommendation system

**Tasks**:
- [ ] Create `/src/utils/decision-engine.js`:
  - Function: `getNextRecommendation(playerStats, currentSession)` → action
  - Logic:
    - If no roles unlocked: "Buy Collector (fastest XP)"
    - If cash < $700: "Run Collector route ($400+/hr)"
    - If gold < 15: "Run Bounty Hunts (12-min meta: 0.32 GB)"
    - If Trader active: "Deliver goods every 2 hours for $500+"
    - If Moonshiner active: "Your batch is ready ($226 profit)"

- [ ] Create `/src/components/Dashboard/RecommendationCard.jsx`:
  - Display next recommended action
  - Show: What, Why, Expected Reward, Time Estimate
  - Include: "Learn More" link to detailed guide

**Output**: 
- Decision engine logic
- Recommendation UI component

**Validation**: 
```
Dashboard shows card:
"🎯 NEXT ACTION: Complete Bounty Hunt
Why: Gold is your bottleneck (9.20 / 15 needed)
Reward: +0.32 Gold Bars (optimal 12-min route)
Time: ~15 minutes
💡 Tip: Wait exactly 12 minutes for peak efficiency"
```

---

### Checkpoint 6.4: Settings & Preferences

**Goal**: Add user preferences and data management

**Tasks**:
- [ ] Create `/src/components/Settings/SettingsPanel.jsx`:
  - Character profile (name, rank, money)
  - Data visibility:
    - Show/hide confidence badges
    - Show/hide hidden stats
    - Show/hide opportunity costs
  - Display preferences:
    - Dark/light mode toggle
    - Map zoom level default
    - Currency display (USD equivalent, optional)
  - Data management:
    - Export simulation as JSON
    - Import saved state
    - Reset to defaults

- [ ] Add localStorage persistence:
  - Save user preferences
  - Save simulation state (auto-save every minute)
  - Allow restore previous session

**Output**: 
- Settings panel component
- Preference persistence
- Data export/import functionality

**Validation**: 
```
Settings panel shows:
1. Character info (editable for simulation)
2. Toggle "Show Confidence Badges" (default: on)
3. Toggle "Show Hidden Stats" (default: off)
4. Button "Export Simulation" → Downloads JSON
5. Button "Import Simulation" → Loads JSON
6. After logout and return: Session restored
```

---

**PHASE 6 COMPLETE WHEN**:
- ✅ App.jsx integrated with Redux
- ✅ New sidebar sections visible
- ✅ Confidence tiers display correctly
- ✅ Decision engine provides recommendations
- ✅ Settings and persistence work

**Next Phase**: PHASE 7 - Data Integrity & Validation

---

## ✅ PHASE 7: DATA INTEGRITY & VALIDATION

### Checkpoint 7.1: Data Validation System

**Goal**: Ensure all data conforms to schema and is internally consistent

**Tasks**:
- [ ] Create `/src/utils/validators.js`:
  - Function: `validateItem(item)` → { isValid, errors: [] }
  - Function: `validateAnimal(animal)` → { isValid, errors: [] }
  - Function: `validateFormula(formula)` → { isValid, errors: [] }
  - Check all required fields present
  - Check field types correct
  - Check values are within reasonable ranges

- [ ] Create `/src/utils/consistency-checker.js`:
  - Function: `checkCatalogConsistency()` → { issues: [] }
  - Checks:
    - No duplicate item IDs
    - All role references exist
    - All prices are positive
    - Unlock ranks are realistic (1-100)
    - Item counts match declared totals
  - Function: `checkAnimalConsistency()` → { issues: [] }
  - Function: `checkFormulaConsistency()` → { issues: [] }

- [ ] Create `/src/utils/data-health-report.js`:
  - Function: `generateHealthReport()` → detailed report
  - Shows:
    - Total items loaded
    - Data with HIGH/MEDIUM/LOW confidence
    - Last verified dates
    - Consistency issues (if any)
    - Missing data
    - Warnings about out-of-date values

**Output**: 
- Validation functions for all data types
- Consistency checker
- Health report generator

**Validation**: 
```javascript
// Validate item
const result = validateItem(metalDetector);
// Returns: { isValid: true, errors: [] }

// Run consistency check
const report = generateHealthReport();
// Returns: {
//   total_items: 247,
//   confidence_breakdown: { HIGH: 180, MEDIUM: 52, LOW: 15 },
//   consistency_issues: 0,
//   last_verified: '2025-12-03',
//   warnings: ["Naturalist prices last verified 2025-11-20 (13 days old)"]
// }
```

---

### Checkpoint 7.2: Patch Tracking & Version Control

**Goal**: Track game changes and maintain data history

**Tasks**:
- [ ] Create `/src/data/patch-history.json`:
  ```json
  {
    "current_patch": "1.29.0",
    "patch_date": "2025-12-01",
    "patches": [
      {
        "version": "1.29.0",
        "date": "2025-12-01",
        "changes": [
          { "type": "PRICE_CHANGE", "item": "w_carcano", "old": 456, "new": 476 },
          { "type": "UNLOCK_CHANGE", "item": "h_arabian", "old_rank": 70, "new_rank": 68 }
        ],
        "notes": "Weapon rebalance update"
      }
    ]
  }
  ```

- [ ] Create `/src/utils/patch-manager.js`:
  - Function: `applyPatch(patch)` → updates item values
  - Function: `getPatchHistory(itemId)` → [ { version, old_value, new_value } ]
  - Function: `markValueAsObsolete(itemId, reason)` → adds deprecation warning

- [ ] Add deprecation warnings:
  - When displaying outdated prices/stats
  - Show: "Value may have changed in patch X.XX (Y days ago)"

**Output**: 
- Patch history tracking
- Version control system
- Deprecation warning system

**Validation**: 
```javascript
// Get price history
const history = getPatchHistory('w_carcano');
// Returns: [
//   { patch: '1.29.0', date: '2025-12-01', old: 456, new: 476, reason: 'Weapon rebalance' }
// ]

// Display deprecation warning
const carcano = getItem('w_carcano');
if (carcano.last_verified < 30_days_ago) {
  showWarning("Price may have changed. Last verified 35 days ago.");
}
```

---

### Checkpoint 7.3: Community Verification System

**Goal**: Allow community to report/verify data accuracy

**Tasks**:
- [ ] Create `/src/components/DataQuality/VerificationPanel.jsx`:
  - Button on every item: "Report Inaccuracy"
  - Shows:
    - Current data + confidence
    - Form to report issue
    - Option to provide alternative value + proof
  - Responses stored locally (for now; could integrate backend later)

- [ ] Create `/src/utils/feedback-logger.js`:
  - Log user reports to localStorage
  - Can export reports as CSV for review
  - Track: item, issue type, user comment, date

- [ ] Display community consensus:
  - If multiple users report same discrepancy: flag item as "Disputed"
  - Show: "3 users reported price as $500 (vs. current $456)"

**Output**: 
- Verification UI component
- Feedback logging system
- Community data quality tracking

**Validation**: 
```
On any item card:
1. Click "Report Issue" → Modal opens
2. Select issue type: "Price Wrong", "Unlock Rank Wrong", "Missing Info"
3. Provide comment: "I paid $500 in-game, not $456"
4. Click "Submit" → Logged locally
5. If multiple reports: Item shows "⚠️ Disputed Price"
```

---

**PHASE 7 COMPLETE WHEN**:
- ✅ Data validation works for all types
- ✅ Consistency checker runs without errors
- ✅ Patch history tracking functional
- ✅ Community verification system in place
- ✅ Health report generates correctly

**Next Phase**: PHASE 8 - Advanced Features

---

## 🚀 PHASE 8: ADVANCED FEATURES

### Checkpoint 8.1: Build Templates & Loadout Planner

**Goal**: Let users plan character builds and purchases

**Tasks**:
- [ ] Create `/src/components/Planner/LoadoutBuilder.jsx`:
  - "Build Planner" tool
  - Select: weapons, horse, ability cards
  - Calculate: total cost, unlock requirements
  - Suggest: "You need Rank 50 + $1,200 to unlock this build"

- [ ] Create `/src/components/Planner/PurchasePath.jsx`:
  - Show optimal purchase order given resources
  - Example: "You have $1,400, Rank 47"
  - Suggests: "Buy Carcano ($456), then save $944 for next item"
  - Include: "Time to save for next item at current rates"

**Output**: 
- Build planner component
- Purchase path recommendations

**Validation**: 
```
User clicks "Plan a Build":
1. Selects: Navy Revolver + Carcano + Nacogdoches Saddle
2. System shows: "Total cost: $1,243, requires Rank 50"
3. Shows: "You need Rank 3 more (40 mins at Bounty Hunt rate)"
4. Recommends: "Buy Navy first ($275), then Saddle ($512), then save for Carcano"
```

---

### Checkpoint 8.2: Progression Simulator

**Goal**: Let users simulate long-term progression

**Tasks**:
- [ ] Create `/src/components/Planner/ProgressionSimulator.jsx`:
  - Input: "I play 2 hours per day"
  - Select: "What I want to achieve" (e.g., "Max all roles")
  - System calculates: "Time to achieve: 3 months (at 2 hrs/day)"
  - Show breakdown: Which activities, in which order

- [ ] Create `/src/utils/progression-sim.js`:
  - Function: `estimateTimeToGoal(goal, hoursPerDay)` → days/weeks/months
  - Include: Different playstyles (Collector-focused, Bounty-focused, balanced)

**Output**: 
- Progression simulator component
- Time-to-goal calculator

**Validation**: 
```
User inputs: "2 hours/day", goal: "Max all roles"
System shows:
- Day 1-14: Collector grinding (11,600 XP/90 min)
- Day 15-30: Bounty hunting (Gold acquisition)
- Month 2: Role progression
- Total estimated time: 12 weeks

Shows: "At current efficiency, you'll max all roles by ~March 2026"
```

---

### Checkpoint 8.3: Event Calendar & Bonus Tracker

**Goal**: Track Rockstar bonus weeks and auto-calculate multipliers

**Tasks**:
- [ ] Create `/src/data/events/calendar.json`:
  - Known bonus weeks (past and scheduled if announced)
  - Example: "2025-12-15 to 2025-12-22: Bounty Hunter +50%"

- [ ] Create `/src/utils/event-multiplier.js`:
  - Function: `getCurrentBonusMultiplier(role)` → 1.0 or 1.5 or 2.0 (depending on week)
  - Function: `getUpcomingBonuses()` → [ future events ]

- [ ] Update all calculators:
  - Display: "Normal rate: $187.50/hr, Bonus week rate: $281.25/hr (+50%)"

**Output**: 
- Event calendar data
- Multiplier calculator
- Updated UI showing bonus rates

**Validation**: 
```
If Bounty Bonus Week active:
- Bounty calculator shows: "$X (normal) → $X × 1.5 (bonus week)"
- Role comparison dashboard highlights Bounty Hunter in gold
- Recommendation engine suggests: "This is the perfect week for Bounty hunting!"
```

---

### Checkpoint 8.4: Comparative Analysis & Leaderboards (Optional)

**Goal**: Compare your progress to other players (local, no backend)

**Tasks**:
- [ ] Create `/src/components/Analysis/Leaderboard.jsx`:
  - Local leaderboard (stored in localStorage)
  - Can export/import character snapshots
  - Shows: Rank, Total Wealth, Role Levels, Efficiency Score

- [ ] Create `/src/utils/efficiency-score.js`:
  - Calculate: "How optimized is this player?"
  - Metric: Wealth per rank (higher = more efficient)
  - Metric: Role spread (balanced vs focused)
  - Metric: Tool ownership (completed unlock chains)

**Output**: 
- Local leaderboard component
- Efficiency scoring system

**Validation**: 
```
Leaderboard shows:
1. Your character: Rank 47, Wealth $1,400, Efficiency Score 8.5/10
2. Export snapshot → JSON file
3. Compare to friend's snapshot → Show differences
4. Show: "You're 15% wealthier than average for Rank 47"
```

---

**PHASE 8 COMPLETE WHEN**:
- ✅ Build planner functional
- ✅ Progression simulator works
- ✅ Event calendar and multipliers integrated
- ✅ (Optional) Leaderboard/efficiency scoring

**PROJECT STATUS**: 🟢 FEATURE COMPLETE

---

## 🎯 SUMMARY: CHECKPOINT SYSTEM

### How to Use This Roadmap

**Each checkpoint is independent**:
- Complete them in any order
- Skip optional checkpoints if not needed
- Add new checkpoints if ideas emerge

**Progress tracking**:
```
PHASE 0: Foundation ████████████████████ 100% ✅
PHASE 1: Core Infrastructure ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 2: Catalog Population ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 3: Animal Compendium ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 4: Economic Calculators ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 5: Geographic Systems ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 6: UI & Integration ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 7: Data Integrity ░░░░░░░░░░░░░░░░░░░░   0%
PHASE 8: Advanced Features ░░░░░░░░░░░░░░░░░░░░   0%
```

**No deadlines. No pressure. Just systematic progress.**

### Key Principles

1. **Each checkpoint delivers value immediately** - Not blocked by other checkpoints
2. **Validation criteria for each** - Know when you're done
3. **Clear output specification** - Understand what you're building
4. **Integration points identified** - How it connects to existing code
5. **Flexibility** - Work at your own pace, skip what's not needed

---

## 📦 PROJECT COMPLETION CRITERIA

Your RDO Companion App is **COMPLETE** when:

✅ **Core Data** (Phase 0-2):
- All items cataloged with prices and unlock levels
- Confidence tiers on all data
- Source attribution complete

✅ **Functional Systems** (Phase 3-5):
- Animal compendium with spawns
- Economic calculators for all 5 roles
- Geographic systems (fast travel, regions, map)

✅ **User Interface** (Phase 6-7):
- Catalog browser with search
- Animal compendium explorer
- Role comparison dashboard
- Data quality reporting

✅ **Polish** (Phase 8):
- Build planner
- Progression simulator
- Event calendar

### What Makes This Ultimate

- **Most comprehensive** - All systems + all data
- **Most transparent** - Confidence tiers + source attribution
- **Most educational** - Formulas explained, not black boxes
- **Most interactive** - Simulation tools, route planning, decision engine
- **Most maintainable** - Modular, checkpoint-based, well-documented

---

**You're ready. Pick any checkpoint and start building.** 🎯
