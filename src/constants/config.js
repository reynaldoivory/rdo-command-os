// =========================================================================
// APPLICATION CONFIGURATION - TYPES, PRIORITIES, AND UI CONSTANTS
// =========================================================================

import { 
  Crosshair, Compass, Box, Target, Zap, Tent, ScrollText, Shirt, Package,
  Sparkles, Star, Award
} from 'lucide-react';

// =========================================================================
// PRIORITY DEFINITIONS - ENHANCED WITH GRADIENTS
// =========================================================================

export const PRIORITY_CONFIG = {
  essential: { 
    label: 'Essential', 
    emoji: '⚡',
    color: 'text-emerald-300/90', 
    bg: 'bg-emerald-950/60', 
    border: 'border-emerald-700/40', 
    glow: 'shadow-emerald-900/30',
    order: 1, 
    desc: 'Must-have items. Buy these first.',
    icon: Zap
  },
  recommended: { 
    label: 'Recommended', 
    emoji: '⭐',
    color: 'text-sky-300/90', 
    bg: 'bg-sky-950/60', 
    border: 'border-sky-700/40', 
    glow: 'shadow-sky-900/30',
    order: 2, 
    desc: 'Strong upgrades. Good value.',
    icon: Sparkles
  },
  optional: { 
    label: 'Optional', 
    emoji: '👍',
    color: 'text-amber-300/90', 
    bg: 'bg-amber-950/60', 
    border: 'border-amber-700/40', 
    glow: 'shadow-amber-900/30',
    order: 3, 
    desc: 'Nice to have. Not urgent.',
    icon: Star
  },
  luxury: { 
    label: 'Luxury', 
    emoji: '💎',
    color: 'text-fuchsia-300/90', 
    bg: 'bg-fuchsia-950/60', 
    border: 'border-fuchsia-700/40', 
    glow: 'shadow-fuchsia-900/30',
    order: 4, 
    desc: 'Endgame/cosmetic. When rich.',
    icon: Award
  },
  starter: { 
    label: 'Starter', 
    emoji: '🌱',
    color: 'text-zinc-400/90', 
    bg: 'bg-zinc-900/60', 
    border: 'border-zinc-700/40', 
    glow: 'shadow-zinc-800/30',
    order: 5, 
    desc: 'Free or default items.',
    icon: Package
  },
};

// =========================================================================
// TYPE CATEGORIES WITH ICONS - FOR NAVIGATION
// =========================================================================

export const TYPE_CONFIG = {
  weapon: { label: 'Weapons', icon: Crosshair, color: 'text-red-300/80', bg: 'bg-red-950/50' },
  horse: { label: 'Horses', icon: Compass, color: 'text-amber-300/80', bg: 'bg-amber-950/50' },
  saddle: { label: 'Saddles', icon: Box, color: 'text-orange-300/80', bg: 'bg-orange-950/50' },
  tack: { label: 'Tack', icon: Box, color: 'text-yellow-300/80', bg: 'bg-yellow-950/50' },
  role: { label: 'Roles', icon: Target, color: 'text-violet-300/80', bg: 'bg-violet-950/50' },
  tool: { label: 'Tools', icon: Compass, color: 'text-cyan-300/80', bg: 'bg-cyan-950/50' },
  ability: { label: 'Abilities', icon: Zap, color: 'text-blue-300/80', bg: 'bg-blue-950/50' },
  camp: { label: 'Camp', icon: Tent, color: 'text-emerald-300/80', bg: 'bg-emerald-950/50' },
  pamphlet: { label: 'Pamphlets', icon: ScrollText, color: 'text-indigo-300/80', bg: 'bg-indigo-950/50' },
  clothing: { label: 'Clothing', icon: Shirt, color: 'text-rose-300/80', bg: 'bg-rose-950/50' },
  item: { label: 'Items', icon: Package, color: 'text-zinc-400/80', bg: 'bg-zinc-800/50' },
};

// =========================================================================
// THEME CONFIGURATION
// =========================================================================

export const THEME = {
  colors: {
    gold: {
      primary: '#D4AF37',
      dim: '#AA8C2C',
      glow: '#D4AF37/20',
    },
    brown: {
      dark: '#1a1512',
      darker: '#12100d',
      darkest: '#0d0a08',
    },
    resource: {
      cash: 'text-neutral-100',
      gold: 'text-[#D4AF37]',
      tokens: 'text-blue-400',
    },
  },
  fonts: {
    western: 'font-western',
    mono: 'font-mono',
  },
};

// =========================================================================
// DEFAULT PLAYER PROFILE
// =========================================================================

export const DEFAULT_PROFILE = {
  xp: 0,
  rank: 1,
  cash: 0,
  gold: 0,
  tokens: 0,
  roles: {
    collector: 0,
    trader: 0,
    bountyHunter: 0,
    moonshiner: 0,
    naturalist: 0,
  },
};

// =========================================================================
// APPLICATION SETTINGS
// =========================================================================

export const APP_CONFIG = {
  name: 'RDO Character OS',
  version: '2.0.0',
  maxRank: 100,
  maxRoleLevel: 20,
  maxBountyHunterLevel: 30, // With prestigious license
};
