// =========================================================================
// ICON REGISTRY - Centralized icon mapping for UI components
// Separates data from presentation to enable game-agnostic architecture
// =========================================================================

import {
  Compass, Box, Skull, Wine, Leaf,           // Role icons
  Crosshair, Target, Zap, Tent, ScrollText,  // Type icons
  Shirt, Package, Sparkles, Star, Award,     // Priority icons
  MapPin, Train                               // Misc icons
} from 'lucide-react';

// =========================================================================
// ROLE ICONS - Maps role ID to Lucide icon component
// =========================================================================

export const ROLE_ICONS = {
  collector: Compass,
  trader: Box,
  bountyHunter: Skull,
  moonshiner: Wine,
  naturalist: Leaf,
};

// =========================================================================
// TYPE ICONS - Maps item type to Lucide icon component
// =========================================================================

export const TYPE_ICONS = {
  weapon: Crosshair,
  horse: Compass,
  saddle: Box,
  tack: Box,
  role: Target,
  tool: Compass,
  ability: Zap,
  camp: Tent,
  pamphlet: ScrollText,
  clothing: Shirt,
  item: Package,
};

// =========================================================================
// PRIORITY ICONS - Maps priority level to Lucide icon component
// =========================================================================

export const PRIORITY_ICONS = {
  essential: Zap,
  recommended: Sparkles,
  optional: Star,
  luxury: Award,
  starter: Package,
};

// =========================================================================
// HELPER: Get icon for any entity type
// =========================================================================

export function getIcon(type, key) {
  switch (type) {
    case 'role':
      return ROLE_ICONS[key] || Target;
    case 'type':
      return TYPE_ICONS[key] || Package;
    case 'priority':
      return PRIORITY_ICONS[key] || Star;
    default:
      return Package;
  }
}

// =========================================================================
// ROLE UI CONFIG - Combines icons with styling (UI-specific)
// =========================================================================

export const ROLE_UI = {
  collector: { 
    icon: Compass, 
    color: 'text-violet-400', 
    bg: 'bg-violet-500',
    gradient: 'from-violet-500/20 to-violet-900/10'
  },
  trader: { 
    icon: Box, 
    color: 'text-amber-500', 
    bg: 'bg-amber-500',
    gradient: 'from-amber-500/20 to-amber-900/10'
  },
  bountyHunter: { 
    icon: Skull, 
    color: 'text-red-400', 
    bg: 'bg-red-500',
    gradient: 'from-red-500/20 to-red-900/10'
  },
  moonshiner: { 
    icon: Wine, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500',
    gradient: 'from-cyan-500/20 to-cyan-900/10'
  },
  naturalist: { 
    icon: Leaf, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500',
    gradient: 'from-emerald-500/20 to-emerald-900/10'
  },
};

// =========================================================================
// TYPE UI CONFIG - Full styling for item type navigation
// =========================================================================

export const TYPE_UI = {
  weapon: { icon: Crosshair, label: 'Weapons', color: 'text-red-300/80', bg: 'bg-red-950/50' },
  horse: { icon: Compass, label: 'Horses', color: 'text-amber-300/80', bg: 'bg-amber-950/50' },
  saddle: { icon: Box, label: 'Saddles', color: 'text-orange-300/80', bg: 'bg-orange-950/50' },
  tack: { icon: Box, label: 'Tack', color: 'text-yellow-300/80', bg: 'bg-yellow-950/50' },
  role: { icon: Target, label: 'Roles', color: 'text-violet-300/80', bg: 'bg-violet-950/50' },
  tool: { icon: Compass, label: 'Tools', color: 'text-cyan-300/80', bg: 'bg-cyan-950/50' },
  ability: { icon: Zap, label: 'Abilities', color: 'text-blue-300/80', bg: 'bg-blue-950/50' },
  camp: { icon: Tent, label: 'Camp', color: 'text-emerald-300/80', bg: 'bg-emerald-950/50' },
  pamphlet: { icon: ScrollText, label: 'Pamphlets', color: 'text-indigo-300/80', bg: 'bg-indigo-950/50' },
  clothing: { icon: Shirt, label: 'Clothing', color: 'text-rose-300/80', bg: 'bg-rose-950/50' },
  item: { icon: Package, label: 'Items', color: 'text-zinc-400/80', bg: 'bg-zinc-800/50' },
};

// =========================================================================
// PRIORITY UI CONFIG - Full styling for priority badges
// =========================================================================

export const PRIORITY_UI = {
  essential: { 
    icon: Zap,
    label: 'Essential', 
    emoji: '⚡',
    color: 'text-emerald-300/90', 
    bg: 'bg-emerald-950/60', 
    border: 'border-emerald-700/40', 
    glow: 'shadow-emerald-900/30',
    order: 1, 
    desc: 'Must-have items. Buy these first.',
  },
  recommended: { 
    icon: Sparkles,
    label: 'Recommended', 
    emoji: '⭐',
    color: 'text-sky-300/90', 
    bg: 'bg-sky-950/60', 
    border: 'border-sky-700/40', 
    glow: 'shadow-sky-900/30',
    order: 2, 
    desc: 'Strong upgrades. Good value.',
  },
  optional: { 
    icon: Star,
    label: 'Optional', 
    emoji: '👍',
    color: 'text-amber-300/90', 
    bg: 'bg-amber-950/60', 
    border: 'border-amber-700/40', 
    glow: 'shadow-amber-900/30',
    order: 3, 
    desc: 'Nice to have. Not urgent.',
  },
  luxury: { 
    icon: Award,
    label: 'Luxury', 
    emoji: '💎',
    color: 'text-fuchsia-300/90', 
    bg: 'bg-fuchsia-950/60', 
    border: 'border-fuchsia-700/40', 
    glow: 'shadow-fuchsia-900/30',
    order: 4, 
    desc: 'Endgame/cosmetic. When rich.',
  },
  starter: { 
    icon: Package,
    label: 'Starter', 
    emoji: '🌱',
    color: 'text-zinc-400/90', 
    bg: 'bg-zinc-900/60', 
    border: 'border-zinc-700/40', 
    glow: 'shadow-zinc-800/30',
    order: 5, 
    desc: 'Free or default items.',
  },
};
