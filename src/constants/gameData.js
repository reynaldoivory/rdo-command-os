// FILE: src/constants/gameData.js
// RDO COMMAND OS - GAME DATA UPDATE (Infinite Horizon)
// Verified 2025-12-16

export const CYCLES = {
  MOONSHINE_BATCH_MINUTES: 48,
  LEGENDARY_BOUNTY_COOLDOWN: 48,
  TRADER_FULL_WAGON_MINUTES: 200, // 2 mins per good
};

export const PAYOUTS = {
  // December 2025 Values (2X Trader)
  TRADER_DELIVERY_LARGE_LOCAL: 1000,
  TRADER_DELIVERY_LARGE_DISTANT: 1250,
  MOONSHINE_STRONG_BERRY: 226.87, // Base value
  ETTA_DOYLE_30_MIN: { cash: 225, gold: 0.48 },
  INAHME_ELK_MATERIALS: 41.16,
  GOLDEN_SPIRIT_BEAR_MATERIALS: 62.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// HARRIET MISSIONS - Materials Per Minute (MPM) Efficiency Rankings
// Optimized for Bayou camp + Fast Travel setup (Efficiency Mode)
// ═══════════════════════════════════════════════════════════════════════════
export const HARRIET_MISSIONS = {
  // TIER 1: Bayou Kings (Fastest Turnaround - 8-10 min missions)
  INAHME_ELK: {
    id: 'inahme_elk',
    name: 'Legendary Inahme Elk',
    materials: 41.16,
    timeMinutes: 9, // Fast travel to Lagras → Mission → Kill/Skin → Fast Travel to Camp
    mpm: 4.57, // Materials Per Minute
    tier: 'meta',
    region: 'Spider Gorge (Colter)',
    strategy: 'Linear mission, fast spawn. Best for speed runs.',
    risk: 'low',
    cooldown: '48h species cooldown'
  },
  PAYTA_BISON: {
    id: 'payta_bison',
    name: 'Legendary Payta Bison',
    materials: 58.75,
    timeMinutes: 12, // Herd mechanics add 2 minutes
    mpm: 4.90,
    tier: 'meta',
    region: 'Little Creek River',
    strategy: 'Open field = easy kills. Massive payout worth extra time.',
    risk: 'low',
    cooldown: '48h species cooldown'
  },
  BANDED_GATOR: {
    id: 'banded_gator',
    name: 'Legendary Banded Gator',
    materials: 38.50,
    timeMinutes: 8, // Spawns right next to Saint Denis/Lagras
    mpm: 4.81,
    tier: 'meta',
    region: 'Bayou Nwa (near Lagras)',
    strategy: 'Closest to Bayou camp. Water combat = instant kill risk.',
    risk: 'high', // Can kill you instantly in water
    requirement: 'Pump shotgun + Slow & Steady recommended',
    cooldown: '48h species cooldown'
  },

  // TIER 2: Heavy Hitters (High Value, Slower - 12-15 min missions)
  GOLDEN_SPIRIT_BEAR: {
    id: 'golden_spirit_bear',
    name: 'Legendary Golden Spirit Bear',
    materials: 62.50, // KING OF MATERIALS - fills 62% of bar
    timeMinutes: 15, // Long tracking in Big Valley woods
    mpm: 4.17,
    tier: 'efficient',
    region: 'Big Valley',
    strategy: 'ALWAYS take if available. Single best item for Cripps.',
    risk: 'high', // Lethal bear
    cooldown: '48h species cooldown',
    priority: 'always' // Override other missions if available
  },
  SAPA_COUGAR: {
    id: 'sapa_cougar',
    name: 'Legendary Sapa Cougar',
    materials: 58.75,
    timeMinutes: 14, // Fog/cages navigation slows speed run
    mpm: 4.20,
    tier: 'efficient',
    region: 'Roanoke Ridge',
    strategy: 'Huge payout but slower due to fog mechanics.',
    risk: 'medium',
    cooldown: '48h species cooldown'
  },

  // TIER 3: Avoid List (Terrible MPM or Bug-Prone)
  MOONSTONE_WOLF: {
    id: 'moonstone_wolf',
    name: 'Legendary Moonstone Wolf',
    materials: 35.00,
    timeMinutes: 18, // Long tracking sequences, buggy pathfinding
    mpm: 1.94,
    tier: 'avoid',
    region: 'Ambarino',
    strategy: 'DO NOT FLY. Terrible Materials-to-Time ratio.',
    risk: 'low',
    cooldown: '48h species cooldown'
  },
  SHADOW_BUCK: {
    id: 'shadow_buck',
    name: 'Legendary Shadow Buck',
    materials: 28.00,
    timeMinutes: 12,
    mpm: 2.33,
    tier: 'avoid',
    region: 'Big Valley',
    strategy: 'Low material value vs Elk/Bison. Skip.',
    risk: 'low',
    cooldown: '48h species cooldown'
  },
  MILK_COYOTE: {
    id: 'milk_coyote',
    name: 'Legendary Milk Coyote',
    materials: 22.00,
    timeMinutes: 15, // Annoying AI behavior (running constantly)
    mpm: 1.47,
    tier: 'avoid',
    region: 'Great Plains',
    strategy: 'DO NOT FLY. Low value + annoying mechanics.',
    risk: 'low',
    cooldown: '48h species cooldown'
  },
  BEAVER_ANY: {
    id: 'beaver_any',
    name: 'Any Legendary Beaver',
    materials: 18.00, // Average beaver value
    timeMinutes: 10,
    mpm: 1.80,
    tier: 'avoid',
    region: 'Various',
    strategy: 'Material value too low (~18-20) to justify mission load times.',
    risk: 'low',
    cooldown: '48h species cooldown'
  }
};

// Helper function to get best Harriet mission by MPM
export function getBestHarrietMission() {
  const missions = Object.values(HARRIET_MISSIONS);
  const tier1 = missions.filter(m => m.tier === 'meta').sort((a, b) => b.mpm - a.mpm);
  const tier2 = missions.filter(m => m.tier === 'efficient').sort((a, b) => b.mpm - a.mpm);
  
  // Check for Golden Spirit Bear first (always priority)
  const bear = missions.find(m => m.id === 'golden_spirit_bear');
  if (bear) return bear;
  
  // Return best Tier 1, fallback to Tier 2
  return tier1[0] || tier2[0] || null;
}

// Get missions by tier
export function getHarrietMissionsByTier(tier) {
  return Object.values(HARRIET_MISSIONS).filter(m => m.tier === tier);
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOOD MONEY OPPORTUNITIES - Capitale Recovery Protocol
// ═══════════════════════════════════════════════════════════════════════════
export const BLOOD_MONEY_OPPORTUNITIES = {
  COVINGTON_EMERALD: {
    id: 'covington_emerald',
    name: 'The Covington Emerald',
    capitaleCost: 25,
    difficulty: 'ruthless', // Highest payout
    payout: {
      cash: 225, // Standard payout
      gold: 0.48, // At 30-minute mark
      cashDouble: 450, // During 2X events
      goldDouble: 0.96 // During 2X events
    },
    timeMinutes: 30, // Optimal time for max payout
    location: 'Saint Denis',
    giver: 'Anthony Foreman',
    strategy: 'Wait 30 minutes total time for max payout. Do NOT turn in immediately.',
    recovery: true, // This is the recovery mission
    roi: 'Converts 25 Capitale → 0.48 Gold + $225 Cash'
  },
  EMBER_OF_THE_EAST: {
    id: 'ember_of_the_east',
    name: 'Ember of the East',
    capitaleCost: 15,
    difficulty: 'ruthless',
    payout: {
      cash: 150,
      gold: 0.32,
      cashDouble: 300,
      goldDouble: 0.64
    },
    timeMinutes: 30,
    location: 'Saint Denis',
    giver: 'Anthony Foreman',
    strategy: 'Lower cost but lower payout. Use if Covington unavailable.',
    recovery: false
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CAPITALE WARNING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
export const CAPITALE_WARNINGS = {
  BUYING_WITH_GOLD: {
    message: 'CRITICAL FINANCIAL ERROR',
    description: 'Buying Capitale with Gold is a -92% ROI. Never do this.',
    math: '12 Gold → 50 Capitale → 1 Gold + $450 Cash = Net loss of 11 Gold',
    alternative: 'Get Capitale free: Loot bodies in Blood Money Crimes or open lockboxes.'
  },
  HIGH_CAPITALE_THRESHOLD: 25, // Suggest burn if above this
  RECOVERY_PRIORITY: 'critical' // Highest priority when Capitale > 25
};

// ═══════════════════════════════════════════════════════════════════════════
// LEGACY ITEM SYSTEM (Dec 2025 Update)
// ═══════════════════════════════════════════════════════════════════════════
// Outlaw Pass is DEAD. No new passes since 2021.
// Rockstar now re-releases old passes/items during monthly events:
// - Halloween Pass 2 returns every October (~15-20 Gold, refunds on completion)
// - Legacy items given as login rewards or weekly challenges
// - No need to save 35-40 Gold for "new" passes anymore
// ═══════════════════════════════════════════════════════════════════════════
export const LEGACY_ITEM_SYSTEM = {
  BUFFER_GOLD: 20, // Maintain 20 Gold for legacy item drops
  TYPICAL_COST: 15, // Most re-released passes cost 15-20 Gold
  REFUND_ON_COMPLETION: true, // Completing pass returns the Gold spent
  FOCUS: 'Monthly Event Bonuses', // 2X Trader, 3X Bounties, etc.
  NOTE: 'Stop researching Outlaw Pass. Focus on active event bonuses.'
};

export const LOCATIONS = {
  SHACK_BAYOU: { name: "Bayou Nwa Shack", fastTravel: true },
  HARRIET_LAGRAS: { name: "Harriet (Lagras)", fastTravel: true },
  FENCE_SAINT_DENIS: { name: "Saint Denis Fence", fastTravel: true },
};

