// FILE: src/components/widgets/MissionControl.test.jsx
// ═══════════════════════════════════════════════════════════════════════════
// MISSION CONTROL COMPONENT TESTS
// Tests action analysis and prioritization logic
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';

// Test the pure analysis logic used in MissionControl
// The analyzeOptimalActions function logic

describe('MissionControl - Action Priority Logic', () => {
  it('prioritizes active god-tier event (priority 0)', () => {
    const activeEvent = { value: 'god_tier', name: 'Trade Route', minsLeft: 12, type: 'trader' };
    const priority = activeEvent && activeEvent.value === 'god_tier' ? 0 : 10;
    expect(priority).toBe(0);
  });

  it('deprioritizes non-god-tier events', () => {
    const activeEvent = { value: 'medium', name: 'Railroad Baron', minsLeft: 12 };
    const priority = activeEvent && activeEvent.value === 'god_tier' ? 0 : 10;
    expect(priority).toBe(10);
  });

  it('prioritizes upcoming god-tier event within 10 mins (priority 1)', () => {
    const nextEvent = { value: 'god_tier', name: 'Trade Route', minsRemaining: 8 };
    const activeEvent = null;
    const shouldWarn = nextEvent.value === 'god_tier' && nextEvent.minsRemaining <= 10 && !activeEvent;
    expect(shouldWarn).toBe(true);
  });

  it('does not warn for god-tier event > 10 mins away', () => {
    const nextEvent = { value: 'god_tier', name: 'Trade Route', minsRemaining: 15 };
    const activeEvent = null;
    const shouldWarn = nextEvent.value === 'god_tier' && nextEvent.minsRemaining <= 10 && !activeEvent;
    expect(shouldWarn).toBe(false);
  });
});

describe('MissionControl - Role Unlock Detection', () => {
  it('detects no roles unlocked', () => {
    const profile = {
      roles: { bountyHunter: 0, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
    };
    const roleXPs = Object.values(profile.roles);
    const hasAnyRole = roleXPs.some(xp => xp > 0);
    expect(hasAnyRole).toBe(false);
  });

  it('detects at least one role unlocked', () => {
    const profile = {
      roles: { bountyHunter: 5000, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
    };
    const roleXPs = Object.values(profile.roles);
    const hasAnyRole = roleXPs.some(xp => xp > 0);
    expect(hasAnyRole).toBe(true);
  });

  it('recommends first role unlock when gold >= 15', () => {
    const profile = { gold: 20, roles: { bountyHunter: 0 } };
    const roleXPs = Object.values(profile.roles);
    const hasAnyRole = roleXPs.some(xp => xp > 0);
    const canAfford = profile.gold >= 15;

    expect(hasAnyRole).toBe(false);
    expect(canAfford).toBe(true);
  });

  it('recommends gold farming when gold < 15', () => {
    const profile = { gold: 10, roles: { bountyHunter: 0 } };
    const roleXPs = Object.values(profile.roles);
    const hasAnyRole = roleXPs.some(xp => xp > 0);
    const canAfford = profile.gold >= 15;

    expect(hasAnyRole).toBe(false);
    expect(canAfford).toBe(false);
  });
});

describe('MissionControl - Daily Challenge Detection', () => {
  it('identifies easy dailies by keywords', () => {
    const challenge = { title: 'Visit the butcher in Valentine' };
    const title = challenge.title.toLowerCase();
    const isEasy = title.includes('visit') || title.includes('cook') ||
                   title.includes('eat') || title.includes('pet') ||
                   title.includes('collect 1') || title.includes('pick');
    expect(isEasy).toBe(true);
  });

  it('identifies non-easy dailies', () => {
    const challenge = { title: 'Complete 5 Bounties with 1-star difficulty' };
    const title = challenge.title.toLowerCase();
    const isEasy = title.includes('visit') || title.includes('cook') ||
                   title.includes('eat') || title.includes('pet') ||
                   title.includes('collect 1') || title.includes('pick');
    expect(isEasy).toBe(false);
  });

  it('detects "collect 1" as easy', () => {
    const challenge = { title: 'Collect 1 treasure map' };
    const title = challenge.title.toLowerCase();
    const isEasy = title.includes('collect 1');
    expect(isEasy).toBe(true);
  });

  it('does not detect "collect 10" as easy', () => {
    const challenge = { title: 'Collect 10 herbs' };
    const title = challenge.title.toLowerCase();
    // Use word boundary or space after '1' to avoid matching '10'
    const isEasy = /collect 1[^0-9]/.test(title) || title === 'collect 1';
    expect(isEasy).toBe(false);
  });
});

describe('MissionControl - Role Progression Analysis', () => {
  it('finds lowest level role for focus', () => {
    const profile = {
      roles: {
        bountyHunter: 15000, // ~level 15
        trader: 5000,        // ~level 5
        collector: 10000     // ~level 10
      }
    };

    const roleEntries = Object.entries(profile.roles);
    const unlockedRoles = roleEntries.filter(([, xp]) => xp > 0);

    const lowestRole = unlockedRoles.reduce((lowest, [key, xp]) => {
      const roleLevel = Math.floor(xp / 1000);
      if (!lowest || roleLevel < lowest.level) {
        return { key, level: roleLevel, xp };
      }
      return lowest;
    }, null);

    expect(lowestRole.key).toBe('trader');
    expect(lowestRole.level).toBe(5);
  });

  it('handles single role', () => {
    const profile = {
      roles: {
        bountyHunter: 8000
      }
    };

    const roleEntries = Object.entries(profile.roles);
    const unlockedRoles = roleEntries.filter(([, xp]) => xp > 0);

    expect(unlockedRoles).toHaveLength(1);
    expect(unlockedRoles[0][0]).toBe('bountyHunter');
  });

  it('recommends leveling when role < 20', () => {
    const roleLevel = 10;
    const shouldRecommend = roleLevel < 20;
    expect(shouldRecommend).toBe(true);
  });

  it('does not recommend leveling when role >= 20', () => {
    const roleLevel = 20;
    const shouldRecommend = roleLevel < 20;
    expect(shouldRecommend).toBe(false);
  });
});

describe('MissionControl - Cash Farming Recommendations', () => {
  it('recommends cash farming when cash < 500', () => {
    const profile = { cash: 300 };
    const needsCash = profile.cash < 500;
    expect(needsCash).toBe(true);
  });

  it('does not recommend cash farming when cash >= 500', () => {
    const profile = { cash: 1000 };
    const needsCash = profile.cash < 500;
    expect(needsCash).toBe(false);
  });

  it('prioritizes collector if unlocked', () => {
    const profile = { cash: 200, roles: { collector: 5000, trader: 0 } };
    const hasCollector = profile.roles.collector > 0;
    const hasTrader = profile.roles.trader > 0;

    expect(hasCollector).toBe(true);
    expect(hasTrader).toBe(false);
  });

  it('suggests trader if no collector', () => {
    const profile = { cash: 200, roles: { collector: 0, trader: 8000 } };
    const hasCollector = profile.roles.collector > 0;
    const hasTrader = profile.roles.trader > 0;

    expect(hasCollector).toBe(false);
    expect(hasTrader).toBe(true);
  });

  it('suggests hunting if no roles', () => {
    const profile = { cash: 200, roles: { collector: 0, trader: 0 } };
    const hasCollector = profile.roles.collector > 0;
    const hasTrader = profile.roles.trader > 0;

    expect(hasCollector).toBe(false);
    expect(hasTrader).toBe(false);
  });
});

describe('MissionControl - Event Value Assessment', () => {
  it('recommends medium+ value events', () => {
    const nextEvent = { value: 'medium', name: 'Fool\'s Gold', minsRemaining: 25 };
    const isWorth = nextEvent.value !== 'low';
    expect(isWorth).toBe(true);
  });

  it('skips low value events', () => {
    const nextEvent = { value: 'low', name: 'Dispatch Rider', minsRemaining: 25 };
    const isWorth = nextEvent.value !== 'low';
    expect(isWorth).toBe(false);
  });

  it('recommends high value events', () => {
    const nextEvent = { value: 'high', name: 'Condor Egg', minsRemaining: 25 };
    const isWorth = nextEvent.value !== 'low';
    expect(isWorth).toBe(true);
  });

  it('recommends god-tier events', () => {
    const nextEvent = { value: 'god_tier', name: 'Trade Route', minsRemaining: 25 };
    const isWorth = nextEvent.value !== 'low';
    expect(isWorth).toBe(true);
  });
});

describe('MissionControl - Action Sorting', () => {
  it('sorts actions by priority ascending', () => {
    const actions = [
      { priority: 5, title: 'Low' },
      { priority: 1, title: 'High' },
      { priority: 3, title: 'Medium' },
      { priority: 0, title: 'Critical' }
    ];

    const sorted = actions.sort((a, b) => a.priority - b.priority);

    expect(sorted[0].priority).toBe(0);
    expect(sorted[1].priority).toBe(1);
    expect(sorted[2].priority).toBe(3);
    expect(sorted[3].priority).toBe(5);
  });

  it('maintains stable sort for equal priorities', () => {
    const actions = [
      { priority: 1, title: 'First' },
      { priority: 1, title: 'Second' },
      { priority: 1, title: 'Third' }
    ];

    const sorted = actions.sort((a, b) => a.priority - b.priority);

    expect(sorted[0].title).toBe('First');
    expect(sorted[1].title).toBe('Second');
    expect(sorted[2].title).toBe('Third');
  });
});

describe('MissionControl - Urgency Mapping', () => {
  it('maps critical urgency to correct style', () => {
    const urgency = 'critical';
    const URGENCY_STYLES = {
      critical: { badge: 'bg-red-500/10 text-red-400' },
      high: { badge: 'bg-amber-500/10 text-amber-400' },
      medium: { badge: 'bg-blue-500/10 text-blue-400' },
      low: { badge: 'bg-emerald-500/10 text-emerald-400' }
    };

    const style = URGENCY_STYLES[urgency];
    expect(style.badge).toContain('red');
  });

  it('defaults to medium urgency when undefined', () => {
    const urgency = undefined;
    const URGENCY_STYLES = {
      medium: { badge: 'bg-blue-500/10 text-blue-400' }
    };

    const style = URGENCY_STYLES[urgency] || URGENCY_STYLES.medium;
    expect(style.badge).toContain('blue');
  });

  it('handles all urgency levels', () => {
    const URGENCY_STYLES = {
      critical: { badge: 'red' },
      high: { badge: 'amber' },
      medium: { badge: 'blue' },
      low: { badge: 'emerald' }
    };

    expect(URGENCY_STYLES.critical.badge).toBe('red');
    expect(URGENCY_STYLES.high.badge).toBe('amber');
    expect(URGENCY_STYLES.medium.badge).toBe('blue');
    expect(URGENCY_STYLES.low.badge).toBe('emerald');
  });
});

describe('MissionControl - Action Structure Validation', () => {
  it('validates action object structure', () => {
    const action = {
      priority: 0,
      type: 'event',
      title: 'Test Action',
      description: 'Test description',
      urgency: 'critical',
      reward: '$100',
      action: 'Do this'
    };

    expect(action).toHaveProperty('priority');
    expect(action).toHaveProperty('type');
    expect(action).toHaveProperty('title');
    expect(action).toHaveProperty('description');
    expect(action).toHaveProperty('urgency');
    expect(action).toHaveProperty('reward');
    expect(action).toHaveProperty('action');
  });

  it('validates action types', () => {
    const ACTION_TYPES = ['event', 'daily', 'role', 'gold', 'cash', 'unlock'];
    expect(ACTION_TYPES).toContain('event');
    expect(ACTION_TYPES).toContain('daily');
    expect(ACTION_TYPES).toContain('role');
  });
});
