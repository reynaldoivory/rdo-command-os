// =========================================================================
// PLAYER & ROLE PROGRESSION TABLES
// Source: In-game data, SmurfinGTA guides, r/RedDeadOnline community
// =========================================================================

// Player rank XP requirements (cumulative XP needed for each rank)
export const RANK_XP_TABLE = [
  0, 0, 500, 1100, 1800, 2600, 3500, 4500, 5600, 6800, 8100,  // 1-10
  9500, 11000, 12600, 14300, 16100, 18000, 20000, 22100, 24300, 26600,  // 11-20
  29000, 31500, 34100, 36800, 39600, 42500, 45500, 48600, 51800, 55100,  // 21-30
  58500, 62000, 65600, 69300, 73100, 77000, 81000, 85100, 89300, 93600,  // 31-40
  98000, 102500, 107100, 111800, 116600, 121500, 126500, 131600, 136800, 142100,  // 41-50
  147500, 153000, 158600, 164300, 170100, 176000, 182000, 188100, 194300, 200600,  // 51-60
  207000, 213500, 220100, 226800, 233600, 240500, 247500, 254600, 261800, 269100,  // 61-70
  276500, 284000, 291600, 299300, 307100, 315000, 323000, 331100, 339300, 347600,  // 71-80
  356000, 364500, 373100, 381800, 390600, 399500, 408500, 417600, 426800, 436100,  // 81-90
  445500, 455000, 464600, 474300, 484100, 494000, 504000, 514100, 524300, 534600,  // 91-100
];

// Role XP requirements per level (1-20 for roles, 1-30 for Bounty Hunter with prestige)
export const ROLE_XP_TABLE = [
  0, 0, 400, 900, 1500, 2200, 3000, 3900, 4900, 5900, 7000,  // 1-10
  8200, 9500, 10900, 12400, 14000, 15700, 17500, 19400, 21400, 23500,  // 11-20
  25700, 28000, 30400, 32900, 35500, 38200, 41000, 43900, 46900, 50000,  // 21-30 (Bounty Hunter prestige)
];

/**
 * Get player/role level from cumulative XP
 * @param {number} xp - Current XP
 * @param {number[]} table - XP table to use (RANK_XP_TABLE or ROLE_XP_TABLE)
 * @returns {number} Current level
 */
export function getLevelFromXP(xp, table = RANK_XP_TABLE) {
  for (let i = table.length - 1; i >= 0; i--) {
    if (xp >= table[i]) {
      return i;
    }
  }
  return 1;
}

/**
 * Get XP progress within current level
 * @param {number} xp - Current XP
 * @param {number[]} table - XP table to use
 * @returns {{ level: number, currentXP: number, nextLevelXP: number, progress: number }}
 */
export function getXPProgress(xp, table = RANK_XP_TABLE) {
  const level = getLevelFromXP(xp, table);
  const currentLevelXP = table[level] || 0;
  const nextLevelXP = table[level + 1] || table[table.length - 1];
  const xpIntoLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  
  return {
    level,
    currentXP: xpIntoLevel,
    nextLevelXP: xpNeeded,
    progress: xpNeeded > 0 ? (xpIntoLevel / xpNeeded) * 100 : 100,
  };
}

// Role definitions - ORDERED BY OPTIMAL UNLOCK PROGRESSION
export const ROLES = {
  bountyHunter: {
    id: 'bountyHunter',
    name: 'Bounty Hunter',
    icon: '🎯',
    color: '#C41E3A',
    unlockCost: 15,              // Gold bars
    maxLevel: 30,                // With prestigious license
    vendor: 'Rhodes Sheriff',
    description: 'Hunt wanted criminals. ONLY role that earns Gold Bars.',
  },
  trader: {
    id: 'trader',
    name: 'Trader',
    icon: '🦌',
    color: '#8B4513',
    unlockCost: 15,
    maxLevel: 20,
    vendor: 'Cripps (Camp)',
    description: 'Hunt animals, sell goods. Passive income from camp.',
  },
  collector: {
    id: 'collector',
    name: 'Collector',
    icon: '🔍',
    color: '#FFD700',
    unlockCost: 15,
    maxLevel: 20,
    vendor: 'Madam Nazar',
    description: 'Find collectibles across the map. Best cash/hour with map.',
  },
  moonshiner: {
    id: 'moonshiner',
    name: 'Moonshiner',
    icon: '🥃',
    color: '#4A2C2A',
    unlockCost: 25,
    maxLevel: 20,
    vendor: 'Maggie (Shack)',
    requires: 'Trader Rank 5',
    description: 'Brew and sell moonshine. Story missions included.',
  },
  naturalist: {
    id: 'naturalist',
    name: 'Naturalist',
    icon: '🌿',
    color: '#228B22',
    unlockCost: 25,
    maxLevel: 20,
    vendor: 'Harriet Davenport',
    description: 'Study/sample wildlife. Conflicts with Trader hunting.',
  },
};

// =========================================================================
// PROGRESSION WEIGHTING SYSTEM - VERIFIED FROM RDO COMMUNITY GUIDES
// Sources: SmurfinGTA Megathread, Captain Balrick's Arsenal, r/RedDeadOnline
// =========================================================================

export const PROGRESSION_WEIGHTS = {
  // ===== WEAPON PRIORITY ORDER (Community Consensus) =====
  // Source: SmurfinGTA Weapons Guide
  weapons: {
    essential: [
      { id: 'Bolt Action Rifle', reason: 'Best for hunting AND PvP. One-shot headshots. Everyone needs this.' },
      { id: 'Varmint Rifle', reason: 'Small game hunting. Fast firing for practicing headshots.' },
      { id: 'Lancaster Repeater', reason: 'Best repeater accuracy. Fast hip-fire. All-around meta.' },
      { id: 'Navy Revolver', reason: 'Best sidearm stats. Slow reload but holster trick bypasses it.' },
      { id: 'Pump Shotgun', reason: 'Better range than Semi-Auto. Reliable close combat.' },
    ],
    recommended: [
      { id: 'Carcano Rifle', reason: 'Fast-firing sniper. PvP meta for long range.' },
      { id: 'Semi-Auto Shotgun', reason: 'Fastest hip-fire shotgun. 5 quick shots.' },
      { id: 'LeMat Revolver', reason: '9 rounds + 1 shotgun shell. Great versatility.' },
      { id: 'Improved Bow', reason: 'Stealth hunting. Counters Slippery Bastard with Paint It Black.' },
      { id: 'Sawed-Off Shotgun', reason: 'Sidearm slot shotgun. Dual wield with Navy for versatility.' },
    ],
    optional: [
      { id: 'Rolling Block Rifle', reason: 'One-shot body kills at range. Slower than Carcano.' },
      { id: 'Evans Repeater', reason: '26 rounds. Good for PIB spam builds.' },
      { id: 'Double Action Revolver', reason: 'Fastest dual-wield fire rate. Staggers enemies.' },
      { id: 'Elephant Rifle', reason: 'Legendary animal hunting. Powerful first shot.' },
    ],
  },
  
  // ===== ROLE UNLOCK ORDER (Community Consensus) =====
  // Source: SmurfinGTA Roles Guide, Reddit FAQ
  roleOrder: [
    { 
      role: 'bountyHunter', 
      priority: 1, 
      reason: 'ONLY role that earns Gold Bars. Essential to unlock other roles without real money.',
      goldPerHour: '0.32-0.48',
      tips: ['Wait until last 30 seconds for max payout', '12 minute timer is optimal', 'Legendary bounties give most gold'],
    },
    { 
      role: 'collector', 
      priority: 2, 
      reason: 'Highest cash/hour with Jean Ropke map. Passive income while doing other activities.',
      cashPerHour: '$200-$400',
      tips: ['Use jeanropke.github.io map', 'Metal Detector + Shovel = access to best sets', 'Coins set worth $540'],
    },
    { 
      role: 'trader', 
      priority: 3, 
      reason: 'Good passive income. Hunting fits naturally into gameplay. Unlocks Moonshiner.',
      cashPerHour: '$125-$156',
      tips: ['Distant delivery = 25% more money but PvP risk', 'Hunting Wagon stores 5 large carcasses', 'Legendary pelts from Naturalist work too'],
    },
    { 
      role: 'moonshiner', 
      priority: 4, 
      reason: 'Requires Trader Rank 5. Good semi-passive income. Story missions.',
      cashPerHour: '$88-$220',
      tips: ['Strong moonshine $226 sale, $50 mash cost = $176 profit', 'Upgrade Condenser first, then Polished Copper', 'Bar expansion is cosmetic only'],
    },
    { 
      role: 'naturalist', 
      priority: 5, 
      reason: 'Least profitable. Late game role. Conflicts with Trader (Harriet sprays you for killing).',
      cashPerHour: '$50-$100',
      tips: ['Legendary animals give great Trader materials', 'Wilderness Camp is useful fast travel', 'Sample sets pay poorly vs time investment'],
    },
  ],

  // ===== ABILITY CARD PRIORITY (Community Consensus) =====
  // Source: Captain Balrick's Arsenal, SmurfinGTA Ability Cards Guide
  abilityCards: {
    deadEye: {
      tier1: [
        { id: 'Paint It Black', use: 'PvP/PvE', reason: 'Perfect accuracy. Tag headshots. Counter Slippery Bastard with bow.' },
        { id: 'Slow and Steady', use: 'Tank/PvP', reason: 'Survive headshots. Great with tonics. Stand and deliver.' },
      ],
      tier2: [
        { id: 'Slippery Bastard', use: 'PvP', reason: 'Counter auto-aim. Rush with shotgun or lasso. High skill ceiling.' },
        { id: 'Focus Fire', use: 'Sniper', reason: 'Damage buff for posse. Pairs with Sharpshooter.' },
        { id: 'Quite an Inspiration', use: 'Support', reason: 'Heals entire posse. Great for group content.' },
      ],
    },
    passive: {
      combat: [
        { id: 'Winning Streak', priority: 'essential', reason: 'Damage increases with consecutive hits. Counter tanks.' },
        { id: 'Sharpshooter', priority: 'essential', reason: 'Scope damage buff. Sniper builds.' },
        { id: "Gunslinger's Choice", priority: 'recommended', reason: 'Dual wield accuracy + damage. Sidearm builds.' },
      ],
      recovery: [
        { id: 'Strange Medicine', priority: 'essential', reason: 'Heal on dealing damage. Core PvE card.' },
        { id: 'Cold Blooded', priority: 'essential', reason: 'Heal on kill. Pairs with Strange Medicine.' },
        { id: 'Eye for an Eye', priority: 'recommended', reason: 'Dead Eye restore on headshots. Sustain.' },
      ],
      defense: [
        { id: 'Iron Lung', priority: 'essential', reason: 'More stamina = more health. Universal defense.' },
        { id: 'Fool Me Once', priority: 'essential', reason: 'Take less damage from consecutive shots.' },
        { id: 'Unblinking Eye', priority: 'recommended', reason: 'Longer Dead Eye and Eagle Eye duration.' },
      ],
    },
    builds: {
      pvp: ['Paint It Black', 'Iron Lung', 'Winning Streak', 'Fool Me Once'],
      pve: ['Paint It Black', 'Strange Medicine', 'Cold Blooded', 'Eye for an Eye'],
      tank: ['Slow and Steady', 'Iron Lung', 'Fool Me Once', 'Unblinking Eye'],
      sniper: ['Focus Fire', 'Sharpshooter', 'Iron Lung', 'Unblinking Eye'],
      hunting: ['Paint It Black', 'Unblinking Eye', "Landon's Patience", 'Live for the Fight'],
    },
  },

  // ===== HORSE + SADDLE PRIORITY =====
  horses: {
    earlyGame: { 
      recommendation: 'Any free horse works until Rank 35-40',
      reason: 'Horse stats matter less than saddle/stirrups. Save money for weapons first.',
    },
    metaSetup: {
      saddle: 'Nacogdoches Saddle',
      stirrups: 'Hooded Stirrups',
      reason: 'Best stamina regen (-50% core drain). +35% regen. Available at Rank 35.',
    },
    endgame: [
      { horse: 'Missouri Fox Trotter', reason: 'Best speed + stamina balance. Multi-coat variants.' },
      { horse: 'Arabian', reason: 'Best handling. Skittish around predators. Rose Grey at Rank 68.' },
      { horse: 'Breton', reason: 'Bounty Hunter role. Most brave horse. War class.' },
      { horse: 'Gypsy Cob', reason: 'Trader role. Most health in game. Draft class.' },
    ],
  },

  // ===== PURCHASE PRIORITY BY RANK =====
  purchaseOrder: {
    rank1to10: [
      'Varmint Rifle (Rank 8) - Small game hunting',
      'Bolt Action Rifle (Rank 7) - Large game + PvP',
      'Bow (Rank 10) - Stealth hunting',
    ],
    rank10to25: [
      'Lancaster Repeater (Rank 12) - Best repeater',
      'Off-hand Holster (Rank 25) - Dual wield',
      'Pump Shotgun (Rank 5 but save money early)',
      'First Ability Card upgrades ($350 each)',
    ],
    rank25to50: [
      'Nacogdoches Saddle (Rank 35) - META saddle',
      'Navy Revolver (Rank 0 but save for it)',
      'Carcano Rifle (Rank 50) - Sniper meta',
      'Second role license (15 Gold)',
    ],
    rank50plus: [
      'Upgraded Ability Cards ($500 each)',
      'Role-specific horses (Breton, Gypsy Cob)',
      'Explosive ammo pamphlets (Rank 90+)',
      'Missouri Fox Trotter or Arabian',
    ],
  },
};

// ===== HUNTING EFFICIENCY DATA =====
// Source: SmurfinGTA Hunting Guide, Trader materials values
export const HUNTING_VALUES = {
  // Materials value for Cripps (perfect 3-star)
  largeAnimals: {
    whitetailBuck: { materials: 10.00, meat: 2, antlers: true },
    whitetailDeer: { materials: 6.50, meat: 2, antlers: false },
    pronghorn: { materials: 6.50, meat: 2, antlers: true },
    elk: { materials: 12.00, meat: 5, antlers: true },
    moose: { materials: 16.00, meat: 5, antlers: true, rare: true },
    cougar: { materials: 16.50, meat: 1, rare: true },
    panther: { materials: 18.00, meat: 1, rare: true },
    grizzlyBear: { materials: 14.00, meat: 5 },
    blackBear: { materials: 8.00, meat: 4 },
    alligator: { materials: 13.00, meat: 5 },
  },
  mediumAnimals: {
    coyote: { materials: 3.00, meat: 1 },
    fox: { materials: 3.00, meat: 1 },
    beaver: { materials: 3.00, meat: 1 },
    boar: { materials: 6.50, meat: 3 },
    sheep: { materials: 4.00, meat: 2 },
    goat: { materials: 4.00, meat: 2 },
  },
  smallAnimals: {
    rabbit: { materials: 1.00, meat: 1 },
    raccoon: { materials: 1.50, meat: 1 },
    skunk: { materials: 1.00, meat: 1 },
    opossum: { materials: 1.00, meat: 1 },
    muskrat: { materials: 1.50, meat: 1 },
  },
  birds: {
    turkey: { materials: 4.00, meat: 2, feathers: true },
    goose: { materials: 2.00, meat: 1, feathers: true },
    duck: { materials: 1.50, meat: 1, feathers: true },
    heron: { materials: 3.50, plumes: true, note: 'Plumes stack, safe from griefers' },
    spoonbill: { materials: 3.00, plumes: true },
    pelican: { materials: 4.00, feathers: true },
    owl: { materials: 3.50, feathers: true },
    hawk: { materials: 2.00, feathers: true },
    eagle: { materials: 2.50, feathers: true },
  },
  tips: [
    'Plumes stack in satchel - safe from losing on death',
    'Hunting Wagon stores 5 large carcasses + 10 medium/small',
    'Perfect Trader animal = headshot with correct weapon',
    'Bolt Action for large, Varmint for small, Bow for stealth',
    'Fill horse first, then call Hunting Wagon to store more',
  ],
};
