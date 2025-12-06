// FILE: src/data/meta-strats.js
// Curated meta strategies from RDO community (Jean Ropke, Reddit, Discord)

export const META_STRATS = {
  GOLD_FARMING: [
    {
      id: 'strat_etta',
      title: 'Etta Doyle Legendary Bounty',
      role: 'bountyHunter',
      desc: '1. Launch 5-Star Etta Doyle. 2. Hide in tunnel immediately. 3. Wait until she says "Let\'s go." 4. Tackle her (no combat). 5. Wait until 12:00 before turning in.',
      yield: '0.32 GB + $225',
      tags: ['AFK Friendly', 'Solo']
    },
    {
      id: 'strat_reset',
      title: 'Award Reset Exploit',
      role: 'all',
      desc: 'Progress > Awards > Reset gold-tier awards (Sharpshooter, Bounty Hunter, etc). Each reset = 0.4 GB. Repeatable infinitely.',
      yield: '0.4 GB each',
      tags: ['Micro-Optimization']
    },
    {
      id: 'strat_dailies',
      title: 'Daily Challenge Streak',
      role: 'all',
      desc: 'Complete 1+ daily challenge every day. Week 1: 0.1 GB each. Week 4: 0.25 GB each. Max streak = 9 dailies × 0.25 = 2.25 GB/day.',
      yield: 'Up to 2.25 GB/day',
      tags: ['Consistency', 'Long-term']
    }
  ],
  CASH_FARMING: [
    {
      id: 'strat_ropke',
      title: 'Jean Ropke Collector Run',
      role: 'collector',
      desc: 'Use jeanropke.github.io/RDR2CollectorsMap. Focus ONLY on Coins ($540) and Jewelry sets. Ignore Tarot/Flowers (random spawns).',
      yield: '$1,000-2,000/hr',
      tags: ['Third-Party Tool', 'Essential']
    },
    {
      id: 'strat_gaptooth',
      title: 'Gaptooth Ridge Trader',
      role: 'trader',
      desc: 'Move camp to Gaptooth Ridge (New Austin). Local deliveries have the shortest, flattest routes. 30 sec - 2 min per delivery.',
      yield: '$500 per delivery',
      tags: ['Location Optimization']
    },
    {
      id: 'strat_moonshine',
      title: 'Strong Moonshine Rotation',
      role: 'moonshiner',
      desc: 'Check daily for 2-ingredient strong recipes (Berry Cobbler, Agarita Sunrise). Brew time: 48 min. Sell for $226-247.',
      yield: '$247/48 min',
      tags: ['Passive Income']
    }
  ],
  QUALITY_OF_LIFE: [
    {
      id: 'strat_wilderness',
      title: 'Wilderness Fast Travel',
      role: 'naturalist',
      desc: 'Naturalist Rank 5 → Wilderness Camp ($750) → Fast Travel Pamphlet ($1,280). Teleport from ANYWHERE on the map.',
      yield: '∞ Time Saved',
      tags: ['God Tier', 'Essential']
    },
    {
      id: 'strat_hunting_wagon',
      title: 'Hunting Wagon Storage',
      role: 'trader',
      desc: 'Store 5 large carcasses or 10 medium. Dismiss wagon → carcasses persist. Perfect for legendary animal hunting.',
      yield: 'Inventory Management',
      tags: ['Utility']
    },
    {
      id: 'strat_defensive',
      title: 'Defensive Mode',
      role: 'all',
      desc: 'Online Options > Playing Style > Defensive. Prevents lock-on targeting. Essential for peaceful grinding.',
      yield: 'Anti-Griefer',
      tags: ['Safety']
    }
  ]
};

export const STRAT_CATEGORIES = {
  GOLD_FARMING: { label: 'Gold Farming', color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/30' },
  CASH_FARMING: { label: 'Cash Farming', color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/30' },
  QUALITY_OF_LIFE: { label: 'Quality of Life', color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/30' }
};
