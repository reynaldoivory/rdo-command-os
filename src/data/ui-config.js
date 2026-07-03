// FILE: src/data/ui-config.js
// =========================================================================
// UI CONFIGURATION - Display Settings & Styling
// =========================================================================
// Contains UI-only configuration for visual elements across the app.
// Does NOT contain game data - just how to display it.

import { Compass, Box, Skull, Wine, Leaf, Crosshair, Zap, Sparkles, Star, Award, Package, ScrollText, Shirt, Tent, Target } from 'lucide-react';

/**
 * Priority tier configuration for catalog items
 * Defines how items are visually categorized and styled
 */
export const UI_CONFIG = {
  priorities: {
    starter: {
      label: 'Fresh Spawn',
      emoji: '🌱',
      color: 'text-lime-300',
      bg: 'bg-lime-950/60',
      border: 'border-lime-700/40',
      order: 0
    },
    essential: {
      label: 'Essential',
      emoji: '⚡',
      color: 'text-emerald-300',
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-700/40',
      order: 1
    },
    recommended: {
      label: 'Recommended',
      emoji: '⭐',
      color: 'text-sky-300',
      bg: 'bg-sky-950/60',
      border: 'border-sky-700/40',
      order: 2
    },
    optional: {
      label: 'Optional',
      emoji: '👍',
      color: 'text-amber-300',
      bg: 'bg-amber-950/60',
      border: 'border-amber-700/40',
      order: 3
    },
    luxury: {
      label: 'Luxury',
      emoji: '💎',
      color: 'text-fuchsia-300',
      bg: 'bg-fuchsia-950/60',
      border: 'border-fuchsia-700/40',
      order: 4
    },
  },

  types: {
    weapon: { label: 'Weapons', icon: Crosshair },
    ability: { label: 'Abilities', icon: Zap },
    role: { label: 'Roles', icon: Target },
    tool: { label: 'Tools', icon: Compass },
    horse: { label: 'Horses', icon: Compass },
    saddle: { label: 'Saddles', icon: Box },
    camp: { label: 'Camp', icon: Tent },
    clothing: { label: 'Clothing', icon: Shirt },
    pamphlet: { label: 'Pamphlets', icon: ScrollText },
    item: { label: 'Items', icon: Package },
  }
};
