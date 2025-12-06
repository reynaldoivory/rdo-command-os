# Reverse-Engineered Original Prompt
## RDO Collector Tracker - Pedagogical Game Utility

---

## HIGH-LEVEL REQUIREMENTS

Create a **React+Vite educational game utility** for tracking and optimizing collectible gathering in Red Dead Redemption 2. The app teaches advanced computer science concepts (state management, algorithms, data structures, performance optimization, persistence) through a polished, professional interface that hides sophisticated systems underneath.

### Target Audience
- Non-STEM underclassmen (Class of 2030+)
- UMES CSET Gamification Initiative
- Classroom learning environment prioritizing engagement over lectures

### Core Philosophy
**"Glass Box" Engineering** - Users see a polished interface; developers see sophisticated teaching systems underneath. Learning happens through engagement and code inspection, not lectures.

---

## FUNCTIONAL REQUIREMENTS

### 1. Collectible Item System
The app must track **6 categories of collectible items** found in Red Dead Redemption 2:

| Category | Items | Special Rules | Bonus Value |
|----------|-------|----------------|-------------|
| Tarot Cards | 14 | Repeatable, no tools | $240.50 set |
| Bird Eggs | 6 | Requires Varmint Rifle | $150.00 set |
| Wild Flowers | 3 | Night-only spawns | $150.00 set |
| Coins | 2 | Rank 5+, Metal Detector | $540.00 set |
| Arrowheads | 1 | Shovel required | $300.00 set |
| Heirlooms | 1 | Shovel required | Variable |

Each item must have:
- Unique ID and name
- Monetary value ($)
- XP reward
- Required tools (none/shovel/metal_detector/varmint_rifle)
- Spawn locations (map coordinates)
- Tool requirements and rank restrictions

### 2. Tool/Equipment System
Players must purchase tools to unlock certain items:

- **Shovel** ($350) - Unlocks arrowheads, some heirlooms
- **Metal Detector** ($700) - Unlocks coins (requires Rank 5+)
- **Varmint Rifle** ($72) - Helps collect bird eggs

Tool purchasing must:
- Deduct cash from character wallet
- Persist in character inventory
- Support undo/refund functionality
- Display in inventory modal with purchase status

### 3. Character Progression System
Track persistent character stats:

- **Rank** (display only, 1-100+)
- **Cash** (integer or float with decimals)
- **Gold bars** (float with decimals for premium currency)
- **Collector Rank** (1-5, gate for certain items)
- **Total XP earned** (lifetime accumulation)
- **Total items collected** (lifetime counter)
- **Tool inventory** (boolean flags per tool)

### 4. Session Management
Players run collecting sessions (episodic play):

**Session Lifecycle:**
1. START - User clicks play, timer begins, session becomes active
2. PAUSE - Temporarily stop timer without ending session
3. RESUME - Continue paused session
4. END - Conclude session, save earnings, update character stats
5. RESET - Abort session, discard unsaved earnings

**Session State Tracking:**
- Session active status (boolean)
- Elapsed time (seconds, display as MM:SS)
- Pause state
- Items collected in current session (IDs list)
- Session XP earned (accumulated)
- Session cash earned (accumulated)

**Auto-save on END:**
- Move session cash → character.cash
- Move session XP → character.totalXP
- Increment character.totalItemsCollected
- Add session record to sessionHistory (last 20 sessions)
- Clear session state

### 5. Item Collection Mechanics
User toggles items to mark them collected:

**Collection Rules:**
- Items with tool requirement require that tool to be owned
- Items with rank requirement require character to meet rank
- Metal Detector items require BOTH metal_detector tool ownership AND Rank ≥ 5
- Varmint Rifle items require varmint_rifle tool ownership
- Collecting calculates XP/cash deltas: `delta = isCollected ? +amount : -amount`
- Session counters update immediately
- Display clear validation feedback if item cannot be collected

**Validation Example:**
```
"Cannot collect: Requires Metal Detector ($700) + Rank 5"
"Cannot collect: Requires Shovel ($350)"
"Cannot collect: Rank 5 required (you are Rank 4)"
```

### 6. Location Cycling System
Some categories have randomized spawns (items appear in different locations):

**Cycle Logic:**
- Each category has a `cycle` counter (1-6)
- Each item has locations object: `{ 1: "New Austin", 2: "West Elizabeth", ... }`
- Current location = `item.locations[category.cycle]`
- Cycle increments per category as user collects
- Display current location in item details
- Teaching Point: Loot table randomization, game design pattern

### 7. Analytics & Performance Metrics (Real-time Calculations)
Display live session statistics:

**Required Metrics:**
- **XP/Hour** - Current session XP per hour (if elapsed > 0)
- **Cash/Hour** - Current session cash per hour
- **Items/Hour** - Current session items collected per hour
- **Session Efficiency %** - (Items collected) / (possible items) × 100
- **Efficiency Rating** - Qualitative: "Poor" → "Godly" based on %
- **Time to Rank 5** - Hours needed at current XP rate
- **Cumulative Stats** - Total lifetime XP, items, cash

**Optimization Teaching:**
- Use useMemo to avoid recalculation on every render
- Dependency array: [elapsed, sessionXP, sessionCash, collectedIds.length, totalXP]
- Show real-time as timer ticks

### 8. Route Optimization (Advanced Algorithm)
Implement **Traveling Salesperson Problem (TSP)** solver:

**Algorithm:** Nearest-Neighbor heuristic
- Input: Array of item locations (x, y coordinates)
- Process: Start at one point, always move to nearest unvisited location
- Output: Optimized item collection order (visual path on map)

**Features:**
- Memoize calculation via useMemo(useTSP)
- Recalculate only when collected items change
- Display as Canvas visualization (optional: SVG)
- Show distance between points
- Teaching Point: Algorithm optimization, computational complexity

**Location Coordinate System:**
- Deterministic hashing: `hashCoords(itemId) → { x, y }`
- Consistent coordinates for same item across sessions
- Use prime numbers + modulo for pseudo-random distribution

### 9. Data Persistence
Implement multi-layer persistence:

**localStorage Implementation:**
- Key: `'rdo_tracker_ultimate'`
- Trigger: Debounced save (1000ms) on state change via useEffect
- Serialize: JSON.stringify(state)
- On App load: Retrieve from localStorage, validate version, hydrate state

**Version Management:**
- Current version: 3
- Check `state.version` on load
- If version mismatch: log warning, reset to initialState (prevent corrupted data)
- Document breaking changes per version

**Import/Export System:**
- Manual JSON export via modal (user downloads file)
- Manual JSON import via file picker (user uploads file)
- Support IMPORT_STATE action in reducer
- Validation: Check structure before applying

**Session History:**
- Auto-record each END_SESSION event
- Store last 20 sessions with: timestamp, duration, items collected, XP earned, cash earned
- Display in session history view/tab

### 10. Undo Functionality
Implement undo stack (teaching state management):

**History Stack:**
- Maintain last 10 states in `historyStack` array
- On significant action: `pushHistory()` before state change
- UNDO_ACTION: Restore previous state from stack
- Teaching Point: Immutable state, stack data structure

**Significant Actions:**
- TOGGLE_ITEM (yes)
- BUY_TOOL (yes)
- CYCLE_CATEGORY (no)
- TICK_TIMER (no)

---

## UI/UX REQUIREMENTS

### 1. Visual Design
**Aesthetic:** Red Dead Redemption 2 Western theme
- Color palette: Browns (#8B4513), golds (#D4AF37), creams (#F5DEB3), dark reds
- Typography: Serif fonts for immersion, clear hierarchy
- Leather/parchment texture effects (CSS)
- Responsive: Mobile, tablet, desktop layouts

### 2. Layout Structure

**Header Component:**
- Character name + rank display (left)
- Cash ($) and Gold bars (icons, right)
- Settings gear icon (opens settings modal)

**Main Content Area (Tabbed):**

1. **Dashboard Tab** (default)
   - Active session status (PAUSED/RUNNING/IDLE)
   - Large timer display (MM:SS format)
   - Session buttons: START, PAUSE/RESUME, END, RESET, UNDO
   - Real-time analytics: XP/hr, $/hr, Items/hr, Efficiency %
   - Category progress cards (6 cards, one per category)

2. **Items Tab**
   - Filter by category (dropdown or pill buttons)
   - Grid layout: 2-4 columns responsive
   - Each item card shows:
     - Item name
     - $ value and XP reward
     - Checkbox (collect/uncollect)
     - Current location (based on cycle)
     - Tool requirement (if any)
     - Green checkmark if collected

3. **Map/Route Tab** (optional but recommended)
   - Canvas visualization of item locations
   - Drawn path showing optimized route
   - Color-coded by category
   - Clickable items to toggle collection

4. **History Tab**
   - Session history list (last 20)
   - Columns: Date, Duration, Items, XP, Cash earned
   - Sortable by date/xp/cash
   - Total lifetime stats at top

5. **Tools/Inventory Tab**
   - 3 tool cards (Shovel, Metal Detector, Varmint Rifle)
   - Show: Icon, name, price, owned/not owned
   - BUY button for unowned tools
   - Confirmation dialog before purchase
   - Show purchase requirements if not met

### 3. Modals/Dialogs

**Tools Modal** - Full-screen overlay
- Tools list with purchase buttons
- Import/Export game state buttons at bottom
- Close button (X)

**Settings Modal**
- Character name input
- Reset character stats button (with confirmation)
- Theme toggle (future: dark/light mode)

**Export Modal**
- Show current state as JSON
- Copy to clipboard button
- Download as file button

**Import Modal**
- File picker input
- Upload and validate JSON
- Confirmation before overwriting
- Error messages if invalid format

### 4. Interactive Feedback

**Buttons:**
- Hover states (color change, scale)
- Active states (pressed appearance)
- Disabled states (opacity, no cursor change)
- Icons + text for clarity

**Item Toggles:**
- Green checkmark when collected
- Fade effect when toggled
- Validation error message if cannot collect

**Session Timer:**
- Large, monospace font (24px+)
- Pause state: visually dimmed, shows "PAUSED"
- Running state: clear, bright, seconds tick

**Toast/Alert Messages:**
- "Session started!"
- "Item collected: +$150, +50 XP"
- "Cannot collect: Requires Metal Detector"
- "Session ended: +$500, +200 XP" with summary

### 5. Responsive Design
- **Mobile (320px+):** 1 column layout, stacked modals
- **Tablet (768px+):** 2 column item grid, side-by-side stats
- **Desktop (1024px+):** 4 column items, full layout

---

## TECHNICAL REQUIREMENTS

### 1. Architecture & State Management

**Pattern: useReducer State Machine** (not Redux - simpler for learning)

```javascript
const [state, dispatch] = useReducer(gameReducer, initialState);

// Single action structure
dispatch({ 
  type: ACTIONS.TOGGLE_ITEM, 
  payload: itemId 
});

// Reducer handles all mutations
case ACTIONS.TOGGLE_ITEM:
  return { ...state, session: { ...state.session, ... } };
```

**State Structure:**
```javascript
{
  version: 3,
  character: { name, rank, cash, gold, totalXP, totalItemsCollected, tools: {} },
  session: { active, startTime, elapsed, paused, collectedIds[], sessionXP, sessionCash },
  cycles: { tarot, eggs, flowers, coins, arrowheads, heirlooms },
  view: { currentTab, selectedCategory, modals... },
  historyStack: [state, state, ...],  // Last 10 states
  sessionHistory: [{ timestamp, duration, items, xp, cash }, ...]  // Last 20
}
```

**Key Rules:**
- All mutations through reducer only (no direct state.xxx = ...)
- Spread operator for immutable updates
- No direct mutation of nested objects
- One action → one state shape change
- Action types as constants (prevent typos)

### 2. Custom Hooks (Teaching Composition)

**useSessionPersistence(state)**
- Auto-save to localStorage with 1000ms debounce
- Serialize entire state on each save
- Load on mount from localStorage key `'rdo_tracker_ultimate'`
- Validate version, reset if mismatch

**useAnalytics(session, character)**
- Calculate xpPerHour, cashPerHour, itemsPerHour, efficiency, efficiencyRating
- Calculate xpToRank5, hoursToRank5
- Return object with all metrics
- Use useMemo with dependency array [elapsed, sessionXP, sessionCash, items.length, totalXP]

**useTSP(collectedLocations)**
- Implement Nearest-Neighbor algorithm
- Return ordered array of item IDs (optimal route)
- Memoize with collectedLocations as dependency
- Never recalculate every render

**useAudio(soundId)** (optional, graceful fallback)
- Play sound effects via Web Audio API
- Silent fallback if not supported
- Possible sounds: collect, level-up, purchase, error

### 3. Performance Patterns

- **useMemo** for: expensive calculations (analytics, category filtering, set progress)
- **useCallback** for: event handlers passed to child components
- **useRef** for: Canvas element reference (route visualization)
- **Debouncing** for: localStorage saves (1000ms)

### 4. Technology Stack

- **React 19.2.0+** - Core framework, hooks
- **Vite 7.2.4+** - Build tool, HMR (Hot Module Replacement)
- **Tailwind CSS 3.4.18** - Utility-first styling
- **Lucide-react** - Icon library (16+ icons)
- **PostCSS + Autoprefixer** - CSS processing
- **ESLint** - Linting (varsIgnorePattern for constants)
- **Canvas API** (optional) or **SVG** (for route visualization)
- **Web Audio API** (optional, graceful fallback)
- **File API** (for import/export)
- **localStorage** - Browser persistence

### 5. Build Configuration

**Vite:**
- Entry: `index.html` → `src/main.jsx` → `<App />`
- Development: `npm run dev` (HMR enabled)
- Production: `npm run build` → `/dist` folder
- Preview: `npm run preview`

**No Custom Aliases:** Keep it simple for learning

**Tailwind:**
- Default theme, minimal customization
- No Dark Mode config initially (save for Phase 2)

---

## CODE QUALITY & DOCUMENTATION

### 1. Code Organization
- **Single-file monolith** (`src/App.jsx`) - prioritizes portability and classroom learning
- **Well-commented sections** - teaching points embedded
- **Clear function names** - `canCollectItem()`, `calculateSetProgress()`, `getCurrentLocation()`
- **Action constants** - prevent magic strings, enable autocomplete
- **THEME object** - centralized colors for design system

### 2. Comments & Documentation
- **SECTION headers** - divide file into logical parts
- **TEACHING POINT comments** - explain why pattern matters
- **Inline comments** - for complex logic (TSP, hashing)
- **JSDoc comments** - on functions explaining params/returns
- **State shape documentation** - initialState is self-documenting

### 3. Pedagogical Value
Code must teach these CS concepts:

1. **State Management** - useReducer pattern, immutability, single source of truth
2. **Algorithms** - TSP (Nearest-Neighbor heuristic), coordinate hashing
3. **Data Structures** - Objects, arrays, Sets, normalized schemas
4. **Performance** - Memoization, debouncing, lazy evaluation
5. **Persistence** - localStorage, versioning, import/export
6. **Web APIs** - Canvas, Audio Context, File API
7. **UI/UX** - Responsive design, accessibility, user feedback
8. **React Patterns** - Hooks, composition, custom hooks, component isolation

---

## TESTING & VALIDATION

### Manual Testing Checklist

- [ ] **Session Management**: START → PAUSE → RESUME → END flow works
- [ ] **Item Collection**: Toggle item on/off updates counters
- [ ] **Validation**: Cannot collect items without required tools or rank
- [ ] **Tool Purchasing**: Buy tool, deducts cash, enables items
- [ ] **Analytics**: Real-time XP/hr, $/hr calculations show live
- [ ] **Persistence**: Refresh page, state is restored
- [ ] **Undo**: Previous state restored
- [ ] **History**: Session records saved, last 20 shown
- [ ] **Import/Export**: JSON roundtrips without data loss
- [ ] **Responsive**: UI works mobile, tablet, desktop
- [ ] **Accessibility**: Keyboard navigation, color contrast OK

### Performance Benchmarks

- Initial load: <2 seconds
- localStorage save: <100ms (debounced)
- Render on toggle: <50ms
- TSP calculation: <200ms for 20 items
- No console errors on dev or prod build

---

## DELIVERABLES

### Files to Create

1. **`src/App.jsx`** (1200-1400 lines)
   - Complete application component
   - All state management, hooks, UI components
   - Thoroughly commented

2. **`src/main.jsx`** (10 lines)
   - React entry point
   - Renders `<App />` to DOM

3. **`src/index.css`** (15 lines)
   - Tailwind imports
   - Global styles

4. **`src/App.css`** (100-200 lines)
   - Custom styles (leather texture, canvas)
   - Game-specific effects
   - Not in Tailwind

5. **`index.html`** (20 lines)
   - Standard React entry point

6. **`package.json`** (Dependencies listed above)

7. **`vite.config.js`** (20 lines)
   - Standard Vite + React plugin

8. **`tailwind.config.js`** (20 lines)
   - Default theme, minimal customization

9. **`eslint.config.js`** (20 lines)
   - Standard React + refresh rules

### Documentation (Recommended)

1. **`README.md`** - Quick start, feature overview
2. **`ARCHITECTURE.md`** - State machine deep dive, data flow
3. **`GAMEPLAY.md`** - Item lists, tool requirements, tips
4. **`.github/copilot-instructions.md`** - AI agent guidance

---

## NICE-TO-HAVES (Phase 2)

- Dark/Light theme toggle via THEME object swap
- Achievement system (collect all items, speed runs, efficiency goals)
- Leaderboard (localStorage-based, no backend)
- Multi-character support (separate saves per character)
- Advanced route visualization (SVG with animated path)
- Audio feedback (collect sound, level-up chime, error buzz)
- Mobile-optimized layout
- Cloud sync (Firebase or simple API)
- Item hunt guides/tips modal

---

## SUMMARY

Build a **polished, professional Red Dead Redemption 2 collectible tracker** that teaches advanced CS concepts through engagement. The "Glass Box" design hides sophisticated systems (state machines, algorithms, persistence) under an intuitive interface. Use React Hooks, Vite, and Tailwind for modern web development, keeping the monolith architecture for classroom portability and learning.

**Success Metrics:**
- ✅ All 6 collectible categories tracked
- ✅ Tool purchasing and validation working
- ✅ Real-time session analytics displayed
- ✅ TSP route optimization implemented
- ✅ Data persists across refreshes
- ✅ Undo/history stack functional
- ✅ Responsive and accessible UI
- ✅ Zero console errors
- ✅ Code teaches professional patterns
- ✅ Classroom-ready, single-file design

---

*Generated by reverse-engineering the final RDO Collector Tracker implementation*
