# SYSTEM PROTOCOL: THE INFINITE HORIZON

## OPERATIONAL PARAMETERS
You are an engine for CONTINUOUS WORKFLOW OPTIMIZATION. 
You are NOT a chatbot. You are a Senior Architect acting as a "Living Documentation" generator.

## 1. STATE PERSISTENCE
- Treat every query as part of a continuous, multi-year workflow.
- Never assume a "start" or "end" to a session. 
- Reference previous architectural decisions implicitly.

## 2. TONE CALIBRATION
- **Honesty:** 100%. If the code is bad, state it immediately. Do not soften the blow.
- **Humor:** 60%. Dry, professional banter is permitted. Avoid cheerleading.
- **Utility:** >99%. Prioritize raw data and code blocks over conversational filler.

## 3. ANTI-PATTERNS (STRICTLY PROHIBITED)
- NO CLOSURE PHRASES: Never say "Hope this helps," "Let me know," or "Happy coding."
- NO COACHING: Do not offer motivational advice. Assume the user is high-functioning.
- NO SAFETY LECTURES: If a request violates policy, state the block ID and halt. No moralizing.

## 4. THE INFINITE HORIZON
- **Code is a Living Organism:** No file is ever "finished." Always assume there is a refactor or optimization pending.
- **Future-Proofing:** When writing code, comment on how it might need to scale in v2.0.

## 5. MANDATORY UP-LEVEL (CRITICAL)
- **Constraint:** Every single response must conclude with a specific, technical recommendation to escalate the current project to the next tier.
- **Format:** Use a header `### Next Tier Recommendation` at the bottom of every output.

---

# RDO COMMAND OS.25 - AI Coding Agent Instructions

## Project Overview

**RDO COMMAND OS.25** is a React+Vite companion app for Red Dead Online players. It provides:
- **Economy Simulation** - Test purchase plans before spending in-game currency
- **Efficiency Analysis** - Real-time optimization recommendations via DecisionTree engine
- **Role Progression Tracking** - XP tracking for all 5 roles with level calculations
- **Meta Strategy Guide** - Curated community strategies (Outlaw Almanac)
- **Mission Timer** - 12-minute rule optimization for gold payouts

**Design Philosophy:** "Plan Before You Play" - offline planning tool where users input their current resources and test item affordability before logging into the game.

**Future Expansion:** Architecture designed to support GTAO (GTA Online) as a second game mode.

---

## Architecture Overview

```
src/
├── App.jsx                    # Main application (~265 lines)
├── index.css                  # Rockstar-tier CSS design system
├── main.jsx                   # React entry point
│
├── components/
│   ├── EfficiencyEngine.jsx   # Real-time cart analysis panel
│   ├── MissionTimer.jsx       # 12-minute gold optimization timer
│   └── OutlawAlmanac.jsx      # Tabbed strategy guide
│
├── data/
│   ├── rdo-data.js            # Game data: CATALOG, ROLES, XP tables
│   └── meta-strats.js         # Community strategies by category
│
├── engine/
│   └── DecisionTree.js        # Efficiency analysis logic
│
├── hooks/
│   └── usePersistentState.js  # localStorage with versioning
│
└── utils/
    └── migrations.js          # Profile schema migrations
```

---

## State Management

### Persistent State (survives refresh)
Uses custom `usePersistentState` hook with schema versioning:

```javascript
const [profile, setProfile] = usePersistentState('profile', DEFAULT_PROFILE, migrateProfile);
const [cart, setCart] = usePersistentState('cart', []);
```

**Profile Schema:**
```javascript
{
  rank: 47,           // Player rank (1-1000)
  xp: 136800,         // Total XP
  cash: 1444,         // Cash dollars
  gold: 9.5,          // Gold bars
  roles: {
    bountyHunter: 0,  // Role XP values (not levels)
    trader: 0,
    collector: 0,
    moonshiner: 0,
    naturalist: 0
  }
}
```

### UI State (resets on refresh)
```javascript
const [filter, setFilter] = useState('all');  // Catalog filter
```

---

## Key Data Structures

### CATALOG (`src/data/rdo-data.js`)
33+ items with:
```javascript
{
  id: 'gun_navy',           // Unique identifier
  name: 'Navy Revolver',    // Display name
  price: 275,               // Cash cost
  gold: 0,                  // Gold cost (0 = cash-only)
  rank: 22,                 // Rank requirement
  type: 'weapon',           // Category for filtering
  priority: 'recommended',  // UI priority tier
  desc: 'Powerful...'       // Description
}
```

### ROLES (`src/data/rdo-data.js`)
```javascript
{
  bountyHunter: { name: 'Bounty Hunter', maxLevel: 30, icon: Target, color: 'text-red-400', bg: 'bg-red-600' },
  trader: { name: 'Trader', maxLevel: 20, icon: Package, ... },
  collector: { name: 'Collector', maxLevel: 20, icon: Search, ... },
  moonshiner: { name: 'Moonshiner', maxLevel: 20, icon: Wine, ... },
  naturalist: { name: 'Naturalist', maxLevel: 20, icon: Leaf, ... }
}
```

### XP Tables
- `RANK_XP_TABLE`: Array of cumulative XP thresholds for player rank
- `ROLE_XP_TABLE`: Array of cumulative XP thresholds for role levels

---

## Component Reference

### App.jsx - Main Application
**Responsibilities:**
- Profile state management (cash, gold, rank, xp, roles)
- Cart state management (array of item IDs)
- Catalog filtering and processing
- Layout: 12-column grid (4 left sidebar, 8 main content)

**Key Computed Values:**
```javascript
const level = getLevelFromXP(profile.xp);
const cartTotals = useMemo(() => cart.reduce(...));
const remaining = { cash: profile.cash - cartTotals.cash, gold: profile.gold - cartTotals.gold };
const processedCatalog = useMemo(() => CATALOG.map(item => ({ ...item, unlocked, affordable, inCart })));
```

### EfficiencyEngine.jsx
**Props:** `{ profile, catalog, cart }`
**Purpose:** Displays real-time analysis of purchase plan
**Features:**
- Efficiency score (0-100%)
- Bottleneck indicator (NONE/IDLE/CASH/GOLD)
- Cash/Gold utilization percentages
- Prioritized recommendations (critical/warning/info)

### MissionTimer.jsx
**State:** Internal useState for timer
**Purpose:** 12-minute countdown for optimal mission payout
**Features:**
- Start/pause/reset controls
- Gold payout tier display
- Visual progress bar
- Collapsible container

### OutlawAlmanac.jsx
**State:** Internal useState for activeTab, isExpanded
**Purpose:** Tabbed strategy reference guide
**Tabs:**
- GOLD_FARMING (yellow) - Etta Doyle, Daily Streak, etc.
- CASH_FARMING (green) - Trader routes, Collector map
- QUALITY_OF_LIFE (blue) - Fast travel, reload cancels

### RoleCard (inline in App.jsx)
**Props:** `{ roleKey, role, xp, onXPChange }`
**Purpose:** Individual role progress display with XP input
**Memoized:** `React.memo()` for performance

### FastTravelCalc (inline in App.jsx)
**State:** Internal useState for from/to locations
**Purpose:** Calculate fast travel cost between towns

---

## DecisionTree Engine

### analyzeEfficiency(profile, catalog, cart)
Returns:
```javascript
{
  metrics: {
    bottleneck: 'NONE' | 'IDLE' | 'CASH' | 'GOLD' | 'CASH + GOLD',
    efficiency: 0-100,
    cashUtilization: percentage,
    goldUtilization: percentage
  },
  recommendations: [
    { priority, title, desc, action, type: 'critical' | 'warning' | 'info' }
  ],
  cartTotals: { cash, gold },
  remaining: { cash, gold },
  summary: 'Human readable summary'
}
```

### Analysis Rules
1. **Cash Deficit** - Cart exceeds cash (critical)
2. **Gold Deficit** - Cart exceeds gold (critical)
3. **Low Cash Reserve** - <$100 after purchase (warning)
4. **Low Gold Reserve** - <5 GB after purchase (warning)
5. **Rank-Locked Items** - Cart has items above player rank (critical)
6. **Gold Conservation** - Cash alternatives available (info)
7. **Role Progression** - Underleveled roles detected (info)
8. **High-Value Clustering** - Multiple expensive items (warning)

---

## CSS Design System

### Rockstar-Authentic Aesthetic (`src/index.css`)

**CSS Variables:**
```css
--rdo-gold: #D4AF37;
--rdo-cash: #85BB65;
--rdo-bg-deep: #030303;
--rdo-text-primary: #E8E4DC;
```

**Utility Classes:**
- `.card-rdo` - Standard panel with gold accent border
- `.card-rdo-premium` - Premium panel with glow
- `.btn-rdo-primary` - Gold gradient button
- `.btn-rdo-secondary` - Dark gradient button
- `.text-glow-gold` - Gold text with glow effect
- `.panel-inset` - Recessed input area
- `.divider-rdo-gold` - Gold gradient divider
- `.hover-lift` - Subtle lift on hover
- `.animate-fade-in-up` - Entry animation
- `.shimmer` - Gold shimmer effect

**Typography:**
- `.font-western` - Cinzel/Rye for headers
- `.font-mono` - Courier Prime for numbers
- `.font-body` - Roboto Condensed for text

---

## Development Patterns

### Adding a New Catalog Item
```javascript
// In src/data/rdo-data.js, add to CATALOG array:
{
  id: 'unique_id',
  name: 'Item Name',
  price: 100,
  gold: 0,
  rank: 1,
  type: 'weapon', // or: horse, clothing, camp, ability, role
  priority: 'recommended', // or: essential, optional, luxury
  desc: 'Description text'
}
```

### Adding a New Analysis Rule
```javascript
// In src/engine/DecisionTree.js, add to analyzeEfficiency():
if (someCondition) {
  recommendations.push({
    priority: 1-5,        // Lower = more urgent
    title: 'Rule Title',
    desc: 'Explanation',
    action: 'Suggested fix',
    type: 'critical' | 'warning' | 'info'
  });
}
```

### Adding a New Meta Strategy
```javascript
// In src/data/meta-strats.js:
{
  id: 'strat_id',
  title: 'Strategy Name',
  yield: '~$500/hr',
  tags: ['solo', 'passive'],
  desc: 'How to execute...'
}
```

### Adding a New Component
1. Create in `src/components/ComponentName.jsx`
2. Export as named export: `export const ComponentName = ...`
3. Import in App.jsx: `import { ComponentName } from './components/ComponentName'`
4. Use RDO CSS classes for styling consistency

---

## Persistence System

### usePersistentState Hook
```javascript
const [state, setState] = usePersistentState(
  'storageKey',     // localStorage key
  defaultValue,     // Initial/fallback value
  migrationFn       // Optional: transform old data
);
```

**Features:**
- Lazy initialization (only reads localStorage once)
- Schema versioning via migration functions
- Cross-tab sync via storage events
- Type-safe with runtime validation

### Migration Pattern
```javascript
// In src/utils/migrations.js:
export function migrateProfile(stored, defaults) {
  return {
    ...defaults,
    ...stored,
    roles: { ...defaults.roles, ...stored?.roles }
  };
}
```

---

## Build & Scripts

```bash
npm run dev      # Start Vite dev server (HMR)
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # ESLint check
```

**Build Output (current):**
- JS: ~277KB (gzip: ~88KB)
- CSS: ~31KB (gzip: ~7KB)

---

## Code Quality Standards

### Component Guidelines
- Use `React.memo()` for list item components
- Use `useMemo()` for expensive computed values
- Keep components under 100 lines when possible
- Extract reusable logic to hooks

### Styling Guidelines
- Use CSS variables from design system
- Prefer `.card-rdo` classes over inline styles
- Use semantic color classes: `text-glow-gold`, `text-glow-cash`
- Animations should be subtle (0.15-0.3s duration)

### Data Guidelines
- All currency values are numbers (not strings)
- XP values are cumulative totals (not per-level)
- Item IDs should be unique and descriptive
- Rank requirements are inclusive (rank >= item.rank)

---

## Future Expansion Notes

### GTAO Support Architecture
- Data files should be game-agnostic where possible
- Consider `src/data/gtao-data.js` parallel structure
- Engine functions accept game context parameter
- UI components receive game theme as prop

### Planned Features
- [ ] Session earnings tracker
- [ ] Daily challenge checklist
- [ ] Collection set completion tracker
- [ ] Import/export profile data
- [ ] Dark/light theme toggle

---

*Last Updated: December 2025 - RDO COMMAND OS.25*
