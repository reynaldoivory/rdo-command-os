# RDO App - Quick Reference Guide

## New Patterns - Quick Start

### 1. Using ACTIONS Constants

**For Dispatching:**
```javascript
// ✅ CORRECT - Use ACTIONS constant
dispatch({ type: ACTIONS.START_SESSION });
dispatch({ type: ACTIONS.TOGGLE_ITEM, payload: itemId });
dispatch({ type: ACTIONS.RESET_SESSION });

// ❌ WRONG - Don't use magic strings
dispatch({ type: 'START_SESSION' }); // Will cause error!
```

**In Reducer:**
```javascript
// ✅ CORRECT
case ACTIONS.START_SESSION:
  return { ...state, session: { ...state.session, active: true } };

// ❌ WRONG
case 'START_SESSION':
  return { ...state, session: { ...state.session, active: true } };
```

**All Available Actions:**
```javascript
ACTIONS.START_SESSION       // Begin tracking session
ACTIONS.PAUSE_SESSION       // Pause timer
ACTIONS.RESUME_SESSION      // Resume paused session
ACTIONS.END_SESSION         // End session, save history
ACTIONS.RESET_SESSION       // Clear collected items this session
ACTIONS.TICK_TIMER          // Increment timer (1 second)
ACTIONS.TOGGLE_ITEM         // Collect/uncollect item
ACTIONS.UNDO_ACTION         // Undo last item toggle
ACTIONS.TOGGLE_TOOL         // Add/remove tool from inventory
ACTIONS.CYCLE_CATEGORY      // Rotate to next cycle
ACTIONS.SET_VIEW_TAB        // Switch main view (dashboard/items/etc)
ACTIONS.SET_CATEGORY        // Filter items by category
ACTIONS.TOGGLE_TOOLS_MODAL  // Show/hide tools inventory
ACTIONS.TOGGLE_EXPORT_MODAL // Show/hide export modal
ACTIONS.IMPORT_STATE        // Load saved game data
```

---

### 2. Using THEME Colors

**Available Color Values:**
```javascript
// Brown Palette
THEME.colors.brown.primary   // '#8B4513' - Main UI color
THEME.colors.brown.dark      // '#5C2E0F' - Deep backgrounds
THEME.colors.brown.darker    // '#2d2620' - Card backgrounds
THEME.colors.brown.bg        // '#1a1410' - Page background

// Gold Accents
THEME.colors.gold.primary    // '#D4AF37' - Buttons, borders
THEME.colors.gold.dim        // '#AA8C2C' - Hover states

// Text Colors
THEME.colors.cream           // '#F5DEB3' - Main text
THEME.colors.muted           // '#8B8680' - Secondary text

// Status Colors
THEME.colors.red             // '#8B0000' - Danger actions
THEME.colors.red_accent      // '#DC143C' - Highlights
THEME.colors.green           // '#556B2F' - Success states
```

**Usage Example:**
```javascript
// In inline styles
className={`bg-[${THEME.colors.gold.primary}] text-[${THEME.colors.cream}]`}

// Or for Tailwind (using hex values)
className="bg-[#D4AF37] text-[#F5DEB3]"  // Reference THEME colors
```

---

### 3. Using UI Primitives

**Button Component:**
```javascript
// Basic usage
<Button>Click Me</Button>

// With variants
<Button variant="primary">Start Session</Button>      // Gold CTA
<Button variant="secondary">Pause</Button>            // Brown
<Button variant="danger">Reset</Button>               // Red
<Button variant="ghost">Close</Button>                // Transparent

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// With icons (using lucide-react)
<Button variant="danger"><RotateCcw size={18} />Reset</Button>

// With custom styling
<Button className="w-full">Full Width Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>
```

**Card Component:**
```javascript
// Basic usage
<Card>
  <h3>Session Stats</h3>
  <p>XP: 1200</p>
</Card>

// With custom padding
<Card className="p-6">
  <h2>Large Padding Card</h2>
</Card>

// With other classes
<Card className="flex justify-between items-center">
  <div>Left Content</div>
  <div>Right Content</div>
</Card>
```

---

## Common Development Tasks

### Adding a New Dispatch Call

```javascript
// Step 1: Use ACTIONS constant (never magic strings)
dispatch({ type: ACTIONS.YOUR_ACTION_NAME, payload: data });

// Step 2: Add case to reducer
case ACTIONS.YOUR_ACTION_NAME:
  return {
    ...state,
    // Your state update here
  };
```

### Creating a Styled Button

```javascript
// Use Button primitive instead of inline Tailwind
<Button variant="danger" onClick={handleReset}>
  <RotateCcw size={18} />
  Reset Session
</Button>

// NOT this:
<button className="bg-[#8B0000] text-[#F5DEB3] border border-[#500] hover:bg-[#600] px-4 py-2 rounded">
  Reset Session
</button>
```

### Creating a Card Container

```javascript
// Use Card primitive
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// NOT this:
<div className="bg-[#2d2620] border-2 border-[#5C2E0F] rounded p-4 shadow-inner p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Accessing Character State

```javascript
const { character } = state;
character.name              // "Chad Lance"
character.rank              // 47
character.collectorRank     // 4
character.cash              // 1466.00
character.gold              // 9.2
character.tools             // { shovel: false, metal_detector: false, varmint_rifle: true }
```

### Accessing Session State

```javascript
const { session } = state;
session.active              // Is session running?
session.elapsed             // Seconds elapsed
session.paused              // Is timer paused?
session.collectedIds        // Array of collected item IDs
session.sessionXP           // XP earned this session
session.sessionCash         // Cash earned this session
```

---

## Error Troubleshooting

**Error: "ACTIONS is not defined"**
- Make sure you're using `ACTIONS.ACTION_NAME` not `'ACTION_NAME'`
- Check that the action exists in the ACTIONS object

**Error: "Cannot read property of undefined"**
- Verify the reducer case matches exactly: `case ACTIONS.TOGGLE_ITEM:`
- Make sure dispatch payload matches what the case expects

**Color Not Applied**
- If using inline Tailwind, make sure you have: `className="bg-[#8B4513]"`
- For dynamic colors, use THEME: `bg-[${THEME.colors.brown.primary}]`

---

## Testing Checklist

When making changes, verify:

- [ ] App loads without console errors
- [ ] ACTIONS constants used in all dispatch calls
- [ ] Session start/pause/reset buttons work
- [ ] Item toggle collecting/uncollecting works
- [ ] Character state updates on item toggle
- [ ] Session history saves on end session
- [ ] Settings modal opens/closes
- [ ] Colors match Red Dead aesthetic
- [ ] Mobile view responsive
- [ ] localStorage persists data after refresh

---

## Performance Tips

1. **Use ACTIONS**: No typos = fewer bugs = faster debugging
2. **Use THEME**: Single color change updates entire app
3. **Use Primitives**: Consistent styling = better performance
4. **Memoization**: useAnalytics is memoized (no unnecessary recalculations)
5. **Debouncing**: localStorage saves debounced 1000ms (prevents IO thrashing)

---

## Learning Resources

**ACTIONS Pattern:**
- Teaches type safety without TypeScript
- Pattern used in Redux, MobX, Zustand
- Professional React practice

**THEME System:**
- Teaches design systems and configuration
- Enables easy dark/light mode switching
- Foundation for scalable design

**UI Primitives:**
- Teaches component composition
- DRY principle (Don't Repeat Yourself)
- Reduces maintenance burden

---

**Last Updated: December 3, 2025**
