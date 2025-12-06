// =========================================================================
// GAME BONUSES, EVENTS & COLLECTIONS
// Source: Rockstar Newswire, r/RedDeadOnline community tracking
// =========================================================================

// XP rewards for various in-game activities
export const XP_BONUSES = {
  combat: {
    killNPC: 5,
    killPlayer: 10,
    headshot: 5,        // Bonus on top of kill
    execution: 10,      // Bonus on top of kill
    specialAmmo: 5,     // Bonus for explosive/incendiary kills
  },
  hunting: {
    killAnimal: 5,      // Base (scaled by animal size)
    perfectPelt: 10,    // Bonus for 3-star
    skinAnimal: 5,
    trackAnimal: 5,
  },
  misc: {
    discoverLocation: 10,
    treasureMap: 100,   // Plus cash/gold
    storyMission: 200,  // Average, varies by mission
    stranger: 100,      // Stranger mission completion
  },
};

// Collector set values (selling complete sets to Madam Nazar)
// Source: Jean Ropke map, verified December 2024
export const COLLECTOR_SETS = {
  tarotCups: { items: 14, value: 289.00 },
  tarotPentacles: { items: 14, value: 289.00 },
  tarotSwords: { items: 14, value: 289.00 },
  tarotWands: { items: 14, value: 289.00 },
  coins: { items: 15, value: 540.00 },          // Highest value set
  bracelets: { items: 9, value: 315.00 },
  earrings: { items: 9, value: 315.00 },
  necklaces: { items: 9, value: 315.00 },
  rings: { items: 9, value: 315.00 },
  arrowheads: { items: 12, value: 288.00 },
  eggs: { items: 9, value: 181.00 },
  heirlooms: { items: 9, value: 315.00 },
  flowers: { items: 10, value: 175.00 },        // Fast to collect
  alcohol: { items: 9, value: 155.00 },
  familyHeirlooms: { items: 9, value: 315.00 },
  lostJewelry: { items: 9, value: 315.00 },
  fossils: { items: 9, value: 321.00 },
};

// Calculate total value of all collector sets
export const COLLECTOR_TOTAL_VALUE = Object.values(COLLECTOR_SETS)
  .reduce((sum, set) => sum + set.value, 0);

// Role payout estimates (per hour, approximate)
// Source: SmurfinGTA Roles Guide, community testing
export const ROLE_PAYOUTS = {
  bountyHunter: {
    goldPerHour: 0.32,
    cashPerHour: 60,
    xpPerHour: 800,
    note: 'Best gold source. Wait until last 30 seconds for max payout.',
    tips: [
      'Legendary bounties give most gold',
      '12 minute timer is optimal for gold/hour',
      'Prestigious license adds 10 more legendaries',
    ],
  },
  trader: {
    goldPerHour: 0,
    cashPerHour: 125,         // With large wagon
    xpPerHour: 600,
    note: 'Passive income while hunting. Distant deliveries = +25% but PvP risk.',
    deliveryPayouts: {
      local: { small: 62.50, medium: 150, large: 500 },
      distant: { small: 78.12, medium: 187.50, large: 625 },
    },
  },
  collector: {
    goldPerHour: 0,
    cashPerHour: 200,         // With Jean Ropke map
    xpPerHour: 1500,          // Highest XP role
    note: 'Best cash/hour with collectible map. Coins set = $540.',
    tips: [
      'Use jeanropke.github.io map',
      'Metal Detector + Shovel required for best sets',
      'Duplicates sell individually at lower value',
    ],
  },
  moonshiner: {
    goldPerHour: 0,
    cashPerHour: 88,          // Strong moonshine, accounting for mash cost
    xpPerHour: 400,
    note: 'Semi-passive. Requires Trader Rank 5. Story missions included.',
    profitPerBatch: {
      weak: { sale: 50, mashCost: 30, profit: 20 },
      average: { sale: 100, mashCost: 50, profit: 50 },
      strong: { sale: 226, mashCost: 50, profit: 176 },
    },
  },
  naturalist: {
    goldPerHour: 0.08,
    cashPerHour: 50,
    xpPerHour: 400,
    note: 'Slowest role. Legendary animals good for Trader materials.',
    tips: [
      'Sample sets pay poorly vs time',
      'Legendary pelts work for Trader',
      'Wilderness Camp = portable fast travel',
    ],
  },
};

// =========================================================================
// RDO UPDATE SCHEDULE & CURRENT BONUSES
// Source: r/RedDeadOnline community tracking (reddit.com/r/RedDeadOnline)
// Verification: Monthly bonus posts by u/PapaXan, community megathreads
// =========================================================================

export const RDO_UPDATE_INFO = {
  // === UPDATE SCHEDULE (Verified July 2022 - Present) ===
  schedule: {
    type: 'monthly',
    timing: 'First Tuesday of each month, 5am EST',
    source: 'Rockstar July 2022 Community Update',
    sourceUrl: 'https://www.rockstargames.com/newswire/article/9k74k52737912k/grand-theft-auto-and-red-dead-online-community-update',
    verifiedVia: 'reddit.com/r/RedDeadOnline/comments/vtnbww (July 2022 Megathread)',
    notes: [
      'Weekly updates discontinued July 2022',
      'Monthly events rotate role bonuses (Bounty Hunter → Collector → Trader → Moonshiner → Naturalist)',
      'Base catalog prices are static; discounts only during monthly events',
      'Holiday events (Halloween, Christmas) still occur annually',
    ],
  },

  // === DECEMBER 2025 EVENT (Dec 2 - Jan 6) ===
  // Source: reddit.com/r/RedDeadOnline/comments/1pboa58/monthly_discounts_and_bonuses_december_2nd_to/
  currentEvent: {
    name: 'Holiday 2025 / Naturalist Month',
    dateRange: 'December 2, 2025 - January 6, 2026',
    lastUpdated: '2025-12-04',
    verified: true,
    
    bonuses: {
      naturalistSampleSales: { multiplier: '3X', rewards: 'RDO$, Role XP' },
      freeRoamEvents: { multiplier: '3X', rewards: 'RDO$, Ability Card XP, XP' },
      merryCallToArms: { multiplier: '2X', rewards: 'RDO$, Gold, XP', newMap: 'Fort Wallace' },
      headForTheHills: { multiplier: '2X', rewards: 'RDO$, Gold, XP', newMap: 'Ewing Basin (Dec 2-8)' },
    },
    
    discounts: {
      free: ['Fast Travel', 'Sedative Ammo'],
      goldOff: [{ item: 'Sample Kit', discount: '10 Gold Bars off' }],
      fiftyPercent: ['Novice/Promising Naturalist Items', 'Trinkets', 'Varmint Rifle', 'Pistols', 'Pistol Customization'],
      fortyPercent: ['Cripps Outfits', 'Arabian Horses', 'Mustang Horses', 'Hats', 'Coats', 'Chaps', 'Gloves'],
    },
    
    freeItems: [
      { item: 'Winter Evans Repeater Variant', condition: 'Login Dec 2 - Jan 5' },
      { item: 'Redcliff Outfit (Quick Draw Pass 1)', condition: 'Login Dec 23-31' },
      { item: 'Free Emote + Honor Reset + Weight Loss Tonic', condition: 'Login Jan 1-5' },
      { item: 'Amador Coat (Outlaw Pass 3)', condition: 'Rank 20 Naturalist login' },
      { item: 'Amador Pants (Outlaw Pass 3)', condition: 'Sell any animal sample to Harriet' },
      { item: 'Prowler Hat (Outlaw Pass 1)', condition: 'Sample a Legendary Animal' },
      { item: 'Red Morning Tail Coat', condition: 'Reach Wave 4 in A Merry Call to Arms' },
      { item: 'Krampus Shotgun Variant', condition: 'Returns Dec 9 (rank lock lifted)' },
    ],
  },

  // === JULY 2025 CONTENT UPDATE ===
  // Source: reddit.com/r/RedDeadOnline/comments/1longf3/new_content_for_the_month_of_july_strange_tales/
  recentContent: {
    strangeTalesVol1: {
      name: 'Strange Tales of the West Vol. 1',
      releaseDate: 'July 2025',
      type: 'Telegram Missions',
      verified: true,
      description: 'Theodore Levin needs help investigating bizarre and unexplained mysteries',
      missions: [
        'Strange Tales of the Plague - Undead enemies',
        'Strange Tales of Modern Science - Robot/automaton enemies', 
        'Strange Tales of the Wilderness - Swamp beasts in Bayou Nwa',
        'Additional investigation missions',
      ],
      notes: 'First significant new content since monthly schedule began',
    },
  },

  // === COMMUNITY RESOURCES ===
  resources: {
    weeklyBonuses: 'reddit.com/r/RedDeadOnline (sort by new, look for "Monthly Discounts and Bonuses" posts)',
    dailyChallenges: 'reddit.com/r/RedDeadDailies',
    collectibles: 'jeanropke.github.io/RDR2CollectorsMap',
    madamNazar: 'madamnazar.io',
    communityFAQ: 'reddit.com/r/RedDeadOnline/comments/yoec6k/rreddeadonline_simple_questions_faq_thread/',
  },

  // === HISTORICAL REFERENCE ===
  historicalBonuses: {
    note: 'These were common bonus types during active development',
    roleXP: { typical: '1.5x-3x', affected: 'Rotating monthly role' },
    goldMultiplier: { typical: '2x', affected: 'Featured series, Call to Arms' },
    cashBonus: { typical: '2x-3x', affected: 'Role sales and activities' },
    freeItems: { typical: 'Outlaw Pass items, clothing, weapon variants' },
  },
};
