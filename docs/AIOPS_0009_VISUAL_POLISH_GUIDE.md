# AIOPS-0009: Red Dead Redemption 2 Visual Polish Guide

**Status:** In Progress  
**Goal:** Transform the functional dashboard into an authentic RDR2 in-game catalog/pause menu experience.

---

## ✅ Phase 1: Foundation (COMPLETED)

### Colors Added to Tailwind Config
```javascript
'rdo-red': '#8B0000',      // Deep crimson (primary accent)
'rdo-gold': '#D4AF37',     // Antique gold (highlights/borders)
'rdo-paper': '#F4E8D0',    // Aged paper (text on dark backgrounds)
'rdo-leather': '#3E2723',  // Dark leather brown (panels/cards)
'rdo-dark': '#1A0F0A',     // Deep brown-black (main background)
'rdo-tan': '#C4A57B',      // Light tan (secondary text)
'rdo-rust': '#A0522D',     // Rust orange (warnings/alerts)
'rdo-green': '#2E7D32',    // Muted green (success states)
```

### Fonts Loaded (Google Fonts)
- **Rye**: Western display font (headers/titles)
- **Bitter**: Slab-serif body font (readable text)
- **JetBrains Mono**: Monospace for stats/numbers

---

## 🎯 Phase 2: Component Updates (NEXT STEPS)

### Priority Order
1. **App.jsx / Global Styles** (foundation)
2. **Dashboard.jsx** (main layout)
3. **CommandCenter.jsx** (top bar)
4. **WalletWidget.jsx** (stats display)
5. **MissionControl.jsx** (recommendations)
6. **RoleCard.jsx** (role progression)
7. **Catalog widgets** (shop experience)

---

## 📋 Implementation Checklist

### 1. App.jsx - Global Background
```jsx
// BEFORE:
<div className="min-h-screen bg-gray-900 text-white">

// AFTER:
<div className="min-h-screen bg-rdo-dark text-rdo-paper font-body">
```

**Changes:**
- Background: `bg-gray-900` → `bg-rdo-dark`
- Text: `text-white` → `text-rdo-paper`
- Font: Add `font-body` (Bitter)

---

### 2. Dashboard.jsx - Layout Container
```jsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-rdo-dark">
```

**Changes:**
- Increase gap: `gap-4` → `gap-6` (more spacious Western feel)
- Increase padding: `p-4` → `p-6`
- Background: Add `bg-rdo-dark`

---

### 3. CommandCenter.jsx - Top Bar
```jsx
// BEFORE:
<header className="bg-gray-800 border-b border-gray-700 p-4">
  <h1 className="text-2xl font-bold">RDO Command OS</h1>
</header>

// AFTER:
<header className="bg-rdo-leather border-b-2 border-rdo-gold p-4 shadow-rdo">
  <h1 className="text-3xl font-western text-rdo-gold tracking-wide uppercase">
    RDO Command OS
  </h1>
  <p className="text-sm text-rdo-tan mt-1">Outlaw Management System</p>
</header>
```

**Changes:**
- Background: `bg-gray-800` → `bg-rdo-leather`
- Border: `border-gray-700` → `border-rdo-gold` with `border-b-2` (thicker gold line)
- Title font: Add `font-western text-rdo-gold tracking-wide uppercase`
- Add subtitle with `text-rdo-tan`
- Add `shadow-rdo` (custom shadow from Tailwind config)

---

### 4. WalletWidget.jsx - Stats Panel
```jsx
// BEFORE:
<div className="bg-gray-800 p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-4">Wallet</h2>
  <div className="space-y-2">
    <p>Cash: ${cash}</p>
    <p>Gold: {gold} bars</p>
    <p>Rank: {rank}</p>
  </div>
</div>

// AFTER:
<div className="bg-rdo-leather border-2 border-rdo-gold p-6 rounded-lg shadow-rdo-gold">
  <h2 className="text-2xl font-western text-rdo-gold mb-4 border-b border-rdo-gold pb-2">
    Wallet
  </h2>
  <div className="space-y-3 font-mono">
    <div className="flex justify-between items-center">
      <span className="text-rdo-tan">Cash:</span>
      <span className="text-rdo-paper font-semibold">${cash}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-rdo-tan">Gold:</span>
      <span className="text-rdo-gold font-semibold">{gold} bars</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-rdo-tan">Rank:</span>
      <span className="text-rdo-red font-semibold">{rank}</span>
    </div>
  </div>
</div>
```

**Changes:**
- Container: Add `border-2 border-rdo-gold` and `shadow-rdo-gold`
- Heading: `font-western text-rdo-gold` with gold underline
- Stats: Two-column layout with labels in `text-rdo-tan` and values in `text-rdo-paper`
- Accent colors: Gold for gold bars, red for rank

---

### 5. MissionControl.jsx - Recommendation Cards
```jsx
// BEFORE:
<div className="bg-gray-700 p-3 rounded">
  <h3 className="font-semibold">{rec.title}</h3>
  <p className="text-sm text-gray-400">{rec.description}</p>
</div>

// AFTER:
<div className="bg-rdo-leather border-l-4 border-rdo-red p-4 rounded shadow-rdo hover:border-rdo-gold transition-colors">
  <h3 className="font-western text-rdo-paper text-lg">{rec.title}</h3>
  <p className="text-sm text-rdo-tan mt-1">{rec.description}</p>
  <span className="inline-block mt-2 text-xs text-rdo-gold uppercase tracking-wider">
    Priority: {rec.priority}
  </span>
</div>
```

**Changes:**
- Add left border accent: `border-l-4 border-rdo-red`
- Hover effect: `hover:border-rdo-gold transition-colors`
- Title: `font-western text-rdo-paper`
- Add priority badge in gold

---

### 6. RoleCard.jsx - Role Progression
```jsx
// BEFORE:
<div className="bg-gray-800 p-4 rounded">
  <h3>{role.name}</h3>
  <div className="w-full bg-gray-700 h-2 rounded mt-2">
    <div className="bg-blue-500 h-2 rounded" style={{width: `${progress}%`}}></div>
  </div>
</div>

// AFTER:
<div className="bg-rdo-leather border border-rdo-gold p-5 rounded-lg shadow-rdo relative overflow-hidden">
  {/* Decorative corner accent */}
  <div className="absolute top-0 right-0 w-16 h-16 bg-rdo-gold opacity-10 rotate-45 transform translate-x-8 -translate-y-8"></div>
  
  <h3 className="font-western text-rdo-gold text-xl mb-3">{role.name}</h3>
  
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-rdo-tan">Level {role.level}</span>
      <span className="text-rdo-paper">{role.xp} / {role.maxXp} XP</span>
    </div>
    
    {/* Progress bar with gold fill */}
    <div className="w-full bg-rdo-dark h-3 rounded-full border border-rdo-gold overflow-hidden">
      <div 
        className="bg-gradient-to-r from-rdo-gold to-rdo-rust h-full transition-all duration-500"
        style={{width: `${progress}%`}}
      ></div>
    </div>
  </div>
</div>
```

**Changes:**
- Add decorative corner accent (subtle gold diamond)
- Heading: `font-western text-rdo-gold`
- Progress bar: Gold gradient fill with dark background and gold border
- Add smooth transition animation

---

### 7. Catalog Widgets - Shop Experience

**ItemCard.jsx Pattern:**
```jsx
<div className="bg-rdo-leather border border-rdo-tan p-3 rounded hover:border-rdo-gold transition-colors group">
  {/* Item image */}
  <div className="aspect-square bg-rdo-dark rounded mb-2 overflow-hidden">
    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
  </div>
  
  {/* Item name */}
  <h4 className="font-western text-rdo-paper text-sm mb-1">{item.name}</h4>
  
  {/* Price */}
  <div className="flex items-center gap-2">
    {item.goldPrice ? (
      <span className="text-rdo-gold font-mono font-bold">{item.goldPrice} Gold</span>
    ) : (
      <span className="text-rdo-paper font-mono">${item.cashPrice}</span>
    )}
  </div>
  
  {/* Add to Cart button */}
  <button className="w-full mt-2 bg-rdo-red text-rdo-paper py-1 rounded hover:bg-rdo-gold hover:text-rdo-dark transition-colors font-semibold text-sm">
    Add to Cart
  </button>
</div>
```

---

## 🎨 Design Principles

### Color Usage Rules
1. **Backgrounds:** Always use `bg-rdo-dark` (main) or `bg-rdo-leather` (panels)
2. **Text:** `text-rdo-paper` (primary), `text-rdo-tan` (secondary/labels)
3. **Accents:** `text-rdo-gold` (highlights), `text-rdo-red` (alerts/CTAs)
4. **Borders:** `border-rdo-gold` (premium feel)

### Typography Rules
1. **Headers:** `font-western` (Rye) + `text-rdo-gold` + `uppercase`
2. **Body:** `font-body` (Bitter) + `text-rdo-paper`
3. **Stats/Numbers:** `font-mono` (JetBrains Mono)
4. **Labels:** `text-rdo-tan` + smaller size

### Spacing & Layout
1. **Generous padding:** Use `p-5` or `p-6` instead of `p-3` or `p-4`
2. **Wider gaps:** Use `gap-6` instead of `gap-4`
3. **Thicker borders:** Use `border-2` or `border-l-4` for emphasis

---

## 🚀 Next Actions

### Step 1: Global Update
```bash
# In Cursor, run this prompt:
"Update App.jsx to use RDR2 theme: bg-rdo-dark, text-rdo-paper, font-body"
```

### Step 2: Dashboard Update
```bash
# Then run:
"Update Dashboard.jsx layout to use RDR2 spacing (gap-6, p-6, bg-rdo-dark)"
```

### Step 3: Component-by-Component
```bash
# For each widget, run:
"Apply RDR2 visual theme to [ComponentName] following docs/AIOPS_0009_VISUAL_POLISH_GUIDE.md"
```

---

## 📸 Visual Reference

### RDR2 Pause Menu Aesthetic Goals
- **Background:** Deep brown-black with subtle texture
- **Panels:** Dark leather with gold borders
- **Text:** Cream/paper color on dark backgrounds
- **Accents:** Antique gold for highlights, crimson red for actions
- **Typography:** Western slab-serif for headers, readable serif for body
- **Spacing:** Generous whitespace, not cramped
- **Shadows:** Subtle red/gold glows on interactive elements

### Hover States
- Borders: Transition from tan/red to gold
- Buttons: Background from red to gold, text from paper to dark
- Cards: Add subtle gold shadow glow

---

## ✅ Definition of Done

- [ ] All components use RDR2 color palette (no gray-* classes remain)
- [ ] All headings use `font-western` with gold color
- [ ] All body text uses `font-body` with paper color
- [ ] All panels have gold borders and leather backgrounds
- [ ] Interactive elements have hover states (gold accents)
- [ ] Spacing feels generous and Western (not cramped/modern)
- [ ] App visually resembles RDR2 in-game catalog/pause menu

---

**Last Updated:** Dec 7, 2025 10:42 AM EST  
**Next Review:** After component updates in Phase 2
