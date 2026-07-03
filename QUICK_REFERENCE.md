# RDO Command OS - Quick Reference

**Last Updated:** December 16, 2025  
**Architecture:** Context-First React (ProfileContext)

---

## 🎯 Core Patterns

### 1. Using ProfileContext Hooks

**Access Profile State:**
```javascript
import { useProfile, useCart, useWallet } from './context';

function MyComponent() {
  const { profile, updateProfile } = useProfile();
  const { cart, addToCart, removeFromCart } = useCart();
  const { cash, gold, tokens, capitale } = useWallet();
  
  // Access profile data
  profile.rank          // Current rank
  profile.xp            // Total XP
  profile.cash          // Cash amount
  profile.gold          // Gold bars
  profile.capitale      // Blood Money currency
  profile.location      // Current location
  profile.roles.trader  // Trader role level
  profile.roles.moonshiner // Moonshiner role level
  // ... etc
}
```

**Update Profile:**
```javascript
const { updateProfile } = useProfile();

// Update single field
updateProfile({ cash: 1500 });

// Update multiple fields
updateProfile({ 
  cash: 1500, 
  gold: 12.5,
  rank: 47 
});

// Update nested role
updateProfile({ 
  roles: { 
    ...profile.roles, 
    trader: 5 
  } 
});
```

---

### 2. Storage Keys (localStorage)

**Always use STORAGE_KEYS constants:**
```javascript
import { STORAGE_KEYS } from './constants/storage';

// ✅ CORRECT
const profileData = localStorage.getItem(STORAGE_KEYS.PROFILE('Main'));
localStorage.setItem(STORAGE_KEYS.CART('Main'), cartData);
localStorage.removeItem(STORAGE_KEYS.PROFILE(currentProfileId));

// ❌ WRONG - Don't use magic strings
localStorage.getItem('rdo_os_profile_Main'); // Will break if key changes!
```

**Available Keys:**
```javascript
STORAGE_KEYS.PROFILE(id)      // `rdo_os_profile_${id}`
STORAGE_KEYS.CART(id)         // `rdo_os_cart_${id}`
STORAGE_KEYS.ACTIVE_SLOT      // `rdo_active_slot`
```

---

### 3. Game Data Constants

**Access Game Data:**
```javascript
import { 
  CYCLES, 
  PAYOUTS, 
  HARRIET_MISSIONS,
  BLOOD_MONEY_OPPORTUNITIES,
  CAPITALE_WARNINGS,
  LEGACY_ITEM_SYSTEM 
} from './constants/gameData';

// Cycles
CYCLES.MOONSHINE_BATCH_MINUTES        // 48
CYCLES.LEGENDARY_BOUNTY_COOLDOWN      // 48
CYCLES.TRADER_FULL_WAGON_MINUTES      // 200

// Payouts (December 2025 - 2X Trader)
PAYOUTS.TRADER_DELIVERY_LARGE_LOCAL   // 1000
PAYOUTS.TRADER_DELIVERY_LARGE_DISTANT // 1250
PAYOUTS.MOONSHINE_STRONG_BERRY        // 226.87
PAYOUTS.ETTA_DOYLE_30_MIN             // { cash: 225, gold: 0.48 }

// Harriet Missions (MPM efficiency)
HARRIET_MISSIONS.GOLDEN_SPIRIT_BEAR   // Best materials (62.5)
HARRIET_MISSIONS.INAHME_ELK           // Fastest (4.57 MPM)
getBestHarrietMission()               // Returns best mission by MPM

// Blood Money Opportunities
BLOOD_MONEY_OPPORTUNITIES.COVINGTON_EMERALD  // Capitale recovery mission
CAPITALE_WARNINGS.HIGH_CAPITALE_THRESHOLD   // 25 (suggest burn above this)

// Legacy Items (Outlaw Pass is dead)
LEGACY_ITEM_SYSTEM.BUFFER_GOLD         // 20 (maintain for legacy drops)
```

---

### 4. Decision Rules & Thresholds

**Access Decision Rules:**
```javascript
import { 
  THRESHOLDS, 
  PHASES, 
  PRIORITIES, 
  VECTORS,
  getPhaseFromRank 
} from './logic/decisionRules';

// Gold thresholds (Dec 2025 - Outlaw Pass is dead)
THRESHOLDS.GOLD_CRITICAL          // 15 (force gold farming below this)
THRESHOLDS.GOLD_LEGACY_BUFFER     // 20 (buffer for legacy item drops)
THRESHOLDS.GOLD_SAFE              // 20 (can spend freely above this)

// Cash thresholds
THRESHOLDS.CASH_POOR              // 500 (force cash farming below this)
THRESHOLDS.CASH_COMFORTABLE       // 2000 (can invest freely above this)

// Wagon thresholds (percentage)
THRESHOLDS.WAGON_FULL             // 90 (sell immediately)
THRESHOLDS.WAGON_NEAR_FULL        // 75 (prepare for sale)
THRESHOLDS.WAGON_EMPTY            // 10 (focus on materials)

// Get phase from rank
const phase = getPhaseFromRank(profile.rank); // EARLY, MID, or LATE
```

---

### 5. Widget Registration (PanelsRegistry)

**Register a New Widget:**
```javascript
// In src/components/PanelsRegistry.jsx
import { MyNewWidget } from './widgets/MyNewWidget';

export const PanelsRegistry = {
  // ... existing widgets
  myWidget: MyNewWidget,  // Add your widget here
};
```

**Use in Dashboard:**
```javascript
// Widgets are automatically available via PanelsRegistry
// The Dashboard component renders them based on layout config
```

**Lazy Loading:**
```javascript
// For large widgets, use React.lazy
const MyHeavyWidget = React.lazy(() => import('./widgets/MyHeavyWidget'));

export const PanelsRegistry = {
  heavyWidget: MyHeavyWidget,  // Will be code-split automatically
};
```

---

### 6. Default Profile Structure

**Reference:**
```javascript
import { DEFAULT_PROFILE } from './context/profileConstants';

// Structure:
{
  rank: 1,
  xp: 0,
  cash: 0,
  gold: 0,
  tokens: 0,
  capitale: 0,        // Blood Money currency
  location: 'valentine',
  roles: {
    bountyHunter: 0,
    trader: 0,
    collector: 0,
    moonshiner: 0,
    naturalist: 0
  }
}
```

---

## 🎨 Styling (RDO Theme)

**Color Palette (Tailwind):**
```javascript
// Gold accents
text-[#D4AF37]        // Primary gold
bg-[#D4AF37]/30       // Gold with opacity
border-[#D4AF37]/20   // Gold border

// Paper/text
text-rdo-paper        // Main text color
bg-rdo-dark           // Dark background

// Common patterns
className="bg-black/40 border-2 border-[#D4AF37]/30 rounded"
```

---

## 📁 File Structure

```
src/
├── App.jsx                    # Root container (profile switching)
├── constants/
│   ├── storage.js            # STORAGE_KEYS
│   └── gameData.js           # CYCLES, PAYOUTS, HARRIET_MISSIONS, etc.
├── context/
│   ├── ProfileContext.jsx    # Main provider
│   ├── profileHooks.js       # useProfile, useCart, useWallet
│   ├── profileConstants.js   # DEFAULT_PROFILE
│   └── index.js              # Central exports
├── components/
│   ├── PanelsRegistry.jsx    # Widget registry
│   └── widgets/              # All widget components
├── hooks/
│   ├── useLayoutConfig.js    # Dashboard layout engine
│   └── useSessionTracker.js  # Session analytics
├── logic/
│   ├── decisionRules.js      # THRESHOLDS, PHASES, PRIORITIES
│   └── sessionAnalytics.js   # Analytics calculations
└── data/
    └── rdo-atlas.js          # Geospatial data (POIs, ingredients)
```

---

## 🚀 Common Tasks

### Add a New Widget

1. **Create widget component:**
```javascript
// src/components/widgets/MyWidget.jsx
import { useProfile } from '../../context';

export function MyWidget() {
  const { profile } = useProfile();
  return <div>Rank: {profile.rank}</div>;
}
```

2. **Register in PanelsRegistry:**
```javascript
// src/components/PanelsRegistry.jsx
import { MyWidget } from './widgets/MyWidget';
export const PanelsRegistry = {
  // ... existing
  myWidget: MyWidget,
};
```

3. **Add to layout config** (handled by `useLayoutConfig` hook)

---

### Access Profile in Component

```javascript
import { useProfile } from '../context';

function MyComponent() {
  const { profile, updateProfile } = useProfile();
  
  // Read
  const cash = profile.cash;
  
  // Write
  const handleAddCash = () => {
    updateProfile({ cash: profile.cash + 100 });
  };
  
  return <div>Cash: ${cash}</div>;
}
```

---

### Check Game Thresholds

```javascript
import { THRESHOLDS } from '../logic/decisionRules';
import { useWallet } from '../context';

function MyComponent() {
  const { gold, cash } = useWallet();
  
  const isGoldCritical = gold < THRESHOLDS.GOLD_CRITICAL;
  const isCashPoor = cash < THRESHOLDS.CASH_POOR;
  
  if (isGoldCritical) {
    return <div className="text-red-400">⚠️ Low Gold!</div>;
  }
}
```

---

## 🔧 Development Commands

```bash
# Dev server
npm run dev

# Build production
npm run build

# Lint
npm run lint
npm run lint -- --fix

# Check bundle size
npm run check-size
```

---

## ⚠️ Important Notes

1. **Always use STORAGE_KEYS** - Never hardcode localStorage keys
2. **Context-First** - Use `useProfile`/`useCart`/`useWallet` hooks, not prop drilling
3. **Game Data** - Import from `constants/gameData.js`, don't hardcode values
4. **Widget Registry** - Add new widgets to `PanelsRegistry.jsx`
5. **Profile Updates** - Use `updateProfile()` from `useProfile()` hook

---

## 📚 Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md`
- **Cursor Rules:** `.cursorrules`
- **Game Data:** `src/constants/gameData.js`
- **Decision Rules:** `src/logic/decisionRules.js`

---

**Version:** 2.0 (Context-First Architecture)  
**Previous Version:** Redux-based (archived in `docs/archive/QUICK_REFERENCE.md`)
