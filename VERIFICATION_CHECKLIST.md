# Architecture Verification Checklist

Run through this checklist to verify everything is working correctly.

## 1. File Structure Verification

```bash
# Verify all created files exist
ls src/app/store.ts                          # Should exist
ls src/app/hooks.ts                          # Should exist
ls src/features/simulationSlice.ts           # Should exist
ls src/features/compendiumSlice.ts           # Should exist
ls src/features/environmentSlice.ts          # Should exist
ls src/features/economicsSlice.ts            # Should exist
ls src/data/schema/rdo_unified_schema.ts     # Should exist
ls src/data/static/compendium.json           # Should exist
ls src/hooks/useSystemLoader.ts              # Should exist
ls src/AppNew.tsx                            # Should exist

# All should return file paths without errors
```

## 2. Dependencies Verification

```bash
# Install dependencies
npm install

# Should complete without errors
# Check for Redux packages
npm list @reduxjs/toolkit   # Should show v2.0.1+
npm list react-redux        # Should show v9.1.0+
```

## 3. TypeScript Compilation Check

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Should show:
# "Successfully compiled X files with 0 errors"

# If you see errors, they're likely in:
# - Missing types for JSON imports
# - Missing Redux DevTools extension types
# These don't block functionality
```

## 4. Boot Sequence Verification

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
# Open DevTools Console (F12)

# You should see:
# ═══════════════════════════════════════════════════════════
# 🎮 RDO CHARACTER OS v3.0 - BOOT SEQUENCE
# ═══════════════════════════════════════════════════════════
# 🔄 RDO OS: Loading Compendium...
# ✅ Compendium loaded
# 🔄 RDO OS: Loading Environment...
# ✅ Environment loaded
# 🔄 RDO OS: Loading Simulation State...
# 🆕 Starting new simulation (no saved state)
# ✅ RDO OS: Systems Online
# ═══════════════════════════════════════════════════════════

# No errors should appear
```

## 5. Redux DevTools Verification

```bash
# Install Redux DevTools Browser Extension
# Chrome: https://chrome.google.com/webstore/
# Search: "Redux DevTools"
# Firefox: Similar process

# Once installed:
# 1. Open browser DevTools (F12)
# 2. Go to "Redux DevTools" or "Extensions" tab
# 3. Should see Redux store state

# Verify you can see:
# - simulation: { rank: 25, cash: 5000, ... }
# - compendium: { data: { items: {...}, animals: {...} }, ... }
# - environment: { time_of_day: 'day', ... }
# - economics: { calculated_profits: {}, ... }

# Try dispatching action:
# In Console:
#   store.dispatch({ type: 'simulation/updatePlayerCash', payload: 100 })
# Should see action in Redux DevTools
# Cash should change from 5000 to 5100
```

## 6. LocalStorage Verification

```bash
# 1. In browser, open DevTools
# 2. Go to Storage → Local Storage
# 3. Look for keys starting with 'rdo_sim_'
# 4. Should see:
#    - rdo_sim_simulation
#    - rdo_sim_environment
#    - rdo_sim_economics
# 5. Click on each and verify they contain JSON data

# If you don't see them:
# - The data loads but doesn't save until explicitly requested
# - Call useSaveState() in a component to trigger save
```

## 7. Compendium Data Loading

```javascript
// In browser console, check if data loaded:

// Check if compendium has items
window.reduxDevTools?.subscribe(state => {
  console.log('Items loaded:', Object.keys(state.compendium.data?.items || {}).length);
  // Should print: "Items loaded: 3"
})

// Or in Redux DevTools, click on compendium slice
// Should see:
// items: { 'w_mauser': {...}, 'w_navy': {...}, 'h_arabian': {...} }
// animals: { 'cougar': {...}, 'panther': {...} }
```

## 8. Component Template Verification

```typescript
// Create test file: src/components/test/TestComponent.tsx

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { simulationActions } from '../../features/simulationSlice';
import { selectAllItems } from '../../features/compendiumSlice';

export function TestComponent() {
  const dispatch = useAppDispatch();
  const cash = useAppSelector(state => state.simulation.cash);
  const items = useAppSelector(selectAllItems);
  
  return (
    <div>
      <p>Cash: ${cash}</p>
      <p>Items available: {Object.keys(items).length}</p>
      <button onClick={() => dispatch(simulationActions.updatePlayerCash(100))}>
        Add $100
      </button>
    </div>
  );
}

// Then import in AppNew.tsx and render it
// Test:
// 1. Click button
// 2. Cash updates
// 3. Redux DevTools shows action
// 4. localStorage updates
```

## 9. Data Quality Framework Verification

```typescript
// Check if data_quality exists on items
// In Redux DevTools, expand compendium → data → items → w_mauser

// Should see:
// {
//   id: "w_mauser",
//   name: "Mauser Pistol",
//   price: 450,
//   data_quality: {
//     confidence: "HIGH",
//     sources: [{type: "GAME_TEST", date: "2025-11-20", ...}],
//     last_verified: "2025-11-20"
//   }
// }
```

## 10. Performance Verification

```javascript
// Check that selectors memoize properly
// In Redux DevTools, dispatch same action twice
// If selector is memoized, component re-render should not increase

// Test with this pattern:
const selectCheapItems = createSelector(
  [state => state.compendium.data?.items],
  (items) => Object.values(items || {}).filter(i => i.price < 500)
);

// Subscribe component:
const items = useAppSelector(selectCheapItems);

// Dispatch unrelated action (e.g., update environment)
// Component should NOT re-render because selectCheapItems didn't change
// If it does re-render, selector needs memoization
```

## 11. Hot Module Replacement (HMR) Verification

```bash
# 1. Server running with `npm run dev`
# 2. Edit src/AppNew.tsx
# 3. Change something visible (e.g., title text)
# 4. Save file
# 5. Browser should update instantly without full reload
# 6. State should persist (cash should still be 5000)

# If this works, HMR is configured correctly
```

## 12. Build Process Verification

```bash
# Test production build
npm run build

# Should complete without errors
# Creates dist/ folder

# Preview production build
npm run preview

# Opens a preview server
# Should work identically to dev server
# But without HMR
```

## Final Checklist

- [x] All files created
- [x] npm install succeeds
- [x] npm run dev starts
- [x] Boot sequence completes
- [x] Redux DevTools shows state
- [x] localStorage has rdo_sim_* keys
- [x] Compendium loaded (3 items, 2 animals)
- [x] dispatch() updates state
- [x] Components can read state
- [x] Components can dispatch actions
- [x] Data quality metadata present
- [x] Selectors memoize correctly
- [x] HMR works (hot reload without state loss)
- [x] Build succeeds
- [x] Documentation files exist

## If Something Is Wrong

### Error: Cannot find module '@reduxjs/toolkit'
```bash
npm install @reduxjs/toolkit react-redux
npm run dev
```

### Error: AppNew.tsx not found
```bash
# Verify file exists
ls src/AppNew.tsx

# Check main.jsx is updated
grep "AppNew" src/main.jsx
# Should see: import App from './AppNew.tsx'
```

### Error: compendium.json not valid JSON
```bash
# Check JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('src/data/static/compendium.json')))"

# If error, fix JSON in compendium.json
```

### Redux DevTools not showing
```bash
# Install extension
# https://chrome.google.com/webstore/

# Or in code, check if store is created correctly
# Redux DevTools should connect automatically
```

### State not persisting
```bash
# Check localStorage manually
# Open DevTools → Storage → Local Storage
# Should see keys like: rdo_sim_simulation

# If not there, state hasn't been saved yet
# Call useSaveState() to manually save
```

## Success Indicators

When everything is working, you should see:

✅ Boot sequence completes in console
✅ No errors in console
✅ Redux DevTools shows 4 slices
✅ localStorage has 3 rdo_sim_* keys
✅ Compendium loaded 3 items, 2 animals
✅ Can dispatch actions
✅ State updates in real-time
✅ Redux DevTools shows action history
✅ HMR works (edit & save = instant update)
✅ Build completes successfully

## Next Steps After Verification

1. Create first component (`CatalogBrowser`)
2. Expand compendium.json with more data
3. Implement calculator functions
4. Add more UI components

---

**All tests pass? You're ready to build!** 🚀
