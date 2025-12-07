# Universal Architecture - Quick Reference

## 🚀 Common Tasks

### Use Player State in Component
```typescript
import { useAppSelector } from '../app/hooks';

function StatsDisplay() {
  const { cash, gold_bars, rank } = useAppSelector(state => state.simulation);
  return <div>Cash: ${cash} | Gold: {gold_bars} | Rank: {rank}</div>;
}
```

### Dispatch Action to Update State
```typescript
import { useAppDispatch } from '../app/hooks';
import { simulationActions } from '../features/simulationSlice';

function AddCashButton() {
  const dispatch = useAppDispatch();
  
  return (
    <button onClick={() => dispatch(simulationActions.updatePlayerCash(1000))}>
      Add $1,000
    </button>
  );
}
```

### Query Compendium Data
```typescript
import { useAppSelector } from '../app/hooks';
import { selectAllItems } from '../features/compendiumSlice';

function ItemBrowser() {
  const items = useAppSelector(selectAllItems);
  
  return (
    <ul>
      {Object.values(items).map(item => (
        <li key={item.id}>{item.name} - ${item.price}</li>
      ))}
    </ul>
  );
}
```

### Check Affordability
```typescript
function AffordabilityCheck({ item }) {
  const { cash, gold_bars } = useAppSelector(state => state.simulation);
  
  const canAfford = 
    cash >= item.price && 
    gold_bars >= (item.gold_cost || 0);
  
  return (
    <div className={canAfford ? 'green' : 'red'}>
      {canAfford ? '✅ Can afford' : '❌ Cannot afford'}
    </div>
  );
}
```

### Create Memoized Selector
```typescript
import { createSelector } from '@reduxjs/toolkit';
import { useAppSelector } from '../app/hooks';

// Define outside component
const selectExpensiveItems = createSelector(
  [state => state.compendium.data?.items],
  (items) => Object.values(items || {}).filter(i => i.price > 1000)
);

// Use in component
function ExpensiveItemsList() {
  const items = useAppSelector(selectExpensiveItems);
  return <div>{items.length} items cost over $1,000</div>;
}
```

### Dispatch Multiple Actions
```typescript
import { useAppDispatch } from '../app/hooks';
import { simulationActions } from '../features/simulationSlice';

function PurchaseItem({ item }) {
  const dispatch = useAppDispatch();
  
  const handlePurchase = () => {
    dispatch(simulationActions.updatePlayerCash(-item.price));
    if (item.gold_cost) {
      dispatch(simulationActions.updatePlayerGold(-item.gold_cost));
    }
    // Log purchase
  };
  
  return <button onClick={handlePurchase}>Buy {item.name}</button>;
}
```

---

## 📂 Where Things Live

| What | Where |
|------|-------|
| Data shapes | `src/data/schema/rdo_unified_schema.ts` |
| Redux store | `src/app/store.ts` |
| Typed hooks | `src/app/hooks.ts` |
| Player state | `src/features/simulationSlice.ts` |
| Game data | `src/features/compendiumSlice.ts` |
| World state | `src/features/environmentSlice.ts` |
| Calculations | `src/features/economicsSlice.ts` |
| Boot logic | `src/hooks/useSystemLoader.ts` |
| Math functions | `src/models/*.ts` |
| UI components | `src/components/**/*.tsx` |
| Static data | `src/data/static/*.json` |

---

## 🔧 Redux Quick Cheatsheet

### Slice Structure
```typescript
// 1. Import
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 2. Initial state
const initialState = { /* ... */ };

// 3. Create slice
const mySlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Action: (state, action) => { /* mutate state */ }
    updateValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

// 4. Export
export const myActions = mySlice.actions;
export default mySlice.reducer;
```

### Using in Component
```typescript
const dispatch = useAppDispatch();
const value = useAppSelector(state => state.feature.value);

dispatch(myActions.updateValue(42));
```

---

## 🎨 Component Structure

### Feature Component
```typescript
// src/components/features/myFeature/MyFeature.tsx

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { myActions, selectMyData } from '../../../features/mySlice';

export function MyFeature() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectMyData);
  
  return (
    <div className="feature">
      {/* Component content */}
    </div>
  );
}
```

### Layout Component
```typescript
// src/components/layout/Header.tsx

import { useAppSelector } from '../../app/hooks';

export function Header() {
  const { cash, gold_bars, rank } = useAppSelector(state => state.simulation);
  
  return (
    <header className="header">
      <h1>RDO Character OS</h1>
      <div className="stats">
        <span>${cash}</span>
        <span>{gold_bars} Gold</span>
        <span>Rank {rank}</span>
      </div>
    </header>
  );
}
```

---

## 📊 Common Selectors

```typescript
// Player stats
state.simulation.cash
state.simulation.gold_bars
state.simulation.rank

// All items
state.compendium.data?.items

// All animals
state.compendium.data?.animals

// All roles
state.compendium.data?.roles

// Is data loaded
state.compendium.data !== null && !state.compendium.loading

// Current bonuses
state.environment.active_bonuses

// Cached profits
state.economics.calculated_profits
```

---

## 🐛 Debugging

### Log Redux State
```typescript
import store from '../app/store';

console.log(store.getState());
```

### Log Dispatches
```typescript
// Redux DevTools extension shows all dispatches automatically
// Check browser DevTools Extensions tab
```

### Check if Selector is Memoizing
```typescript
// If component re-renders when it shouldn't,
// check that your selector returns the same reference
// Use createSelector for memoization:

const selectMyValue = createSelector(
  [state => state.feature.data],
  (data) => data.filtered_items  // ✅ Memoized
);

// Don't do this:
const value = useAppSelector(state => 
  state.feature.data.filter(x => x.active) // ❌ New array every render
);
```

---

## ⚡ Performance Tips

1. **Use memoized selectors for computed values**
   ```typescript
   const selectExpensive = createSelector([...], (data) => expensive_calc(data));
   ```

2. **Split selectors for fine-grained updates**
   ```typescript
   // ✅ Component only re-renders if cash changes
   const cash = useAppSelector(state => state.simulation.cash);
   ```

3. **Use `React.memo` for expensive components**
   ```typescript
   export const ItemCard = React.memo(({ item }) => {
     return <div>{item.name}</div>;
   });
   ```

4. **Normalize data in slices**
   ```typescript
   // ✅ Store by ID for fast lookup
   items: { 'w_mauser': {...}, 'w_volcanic': {...} }
   
   // ❌ Don't use arrays
   items: [{id: 'w_mauser', ...}]
   ```

---

## 🆕 Adding a New Feature System

1. **Add to schema** (`src/data/schema/rdo_unified_schema.ts`)
2. **Create slice** (`src/features/featureSlice.ts`)
3. **Register in store** (`src/app/store.ts`)
4. **Create components** (`src/components/features/feature/`)
5. **Add data** (`src/data/static/feature.json`)
6. **Load in hook** (`src/hooks/useSystemLoader.ts`)

See `UNIVERSAL_ARCHITECTURE.md` for detailed example.

---

## 📞 Common Issues

### "state.compendium.data is null"
- The system is still loading. Wrap component in `useSystemLoader` check.

### "Selector runs every render"
- Use `createSelector` for memoization instead of inline filtering.

### "Redux DevTools not showing"
- Install Redux DevTools browser extension.

### "JSON.stringify error"
- Use `serializableCheck: false` in store config (already done).

---

**Start building. Reference this as needed.** 🚀
