// FILE: src/hooks/useCalculators.test.js
// ═══════════════════════════════════════════════════════════════════════════
// CALCULATOR HOOKS UNIT TESTS
// Tests calculation logic for bounty, trader, moonshiner, and collector
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  calculateBountyPayout,
  calculateTraderDelivery,
  calculateHuntingValue,
  calculateMoonshineBatch,
  calculateCollectorSets,
} from './useCalculators';

// ═══════════════════════════════════════════════════════════════════════════
// BOUNTY HUNTER CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateBountyPayout', () => {
  describe('Regular Bounties', () => {
    it('returns correct payout for 0-3 minute bounty', () => {
      const result = calculateBountyPayout(3, false);
      expect(result.gold).toBe(0.08);
      expect(result.cash).toBe(10);
      expect(result.xp).toBe(200);
      expect(result.efficiency).toBe(1.6);
    });

    it('returns correct payout for 4-6 minute bounty', () => {
      const result = calculateBountyPayout(6, false);
      expect(result.gold).toBe(0.12);
      expect(result.cash).toBe(15);
      expect(result.xp).toBe(300);
      expect(result.efficiency).toBe(1.2);
    });

    it('returns correct payout for 7-9 minute bounty', () => {
      const result = calculateBountyPayout(9, false);
      expect(result.gold).toBe(0.16);
      expect(result.cash).toBe(20);
      expect(result.xp).toBe(400);
      expect(result.efficiency).toBe(1.07);
    });

    it('returns optimal payout for 10-12 minute bounty (sweet spot)', () => {
      const result = calculateBountyPayout(12, false);
      expect(result.gold).toBe(0.24);
      expect(result.cash).toBe(40);
      expect(result.xp).toBe(600);
      expect(result.efficiency).toBe(1.2);
    });

    it('handles diminishing returns after 12 minutes', () => {
      const result = calculateBountyPayout(18, false);
      expect(result.gold).toBeGreaterThan(0.24);
      expect(result.cash).toBeGreaterThan(40);
      expect(result.xp).toBeGreaterThan(600);
      expect(result.efficiency).toBeLessThanOrEqual(1.2);
    });

    it('caps extra gold at 0.48 total', () => {
      const result = calculateBountyPayout(30, false);
      expect(result.gold).toBeLessThanOrEqual(0.48);
    });
  });

  describe('Legendary Bounties', () => {
    it('calculates legendary bounty at difficulty 1', () => {
      const result = calculateBountyPayout(12, true, 1);
      expect(result.gold).toBeGreaterThan(0);
      expect(result.cash).toBeGreaterThan(0);
      expect(result.xp).toBeGreaterThan(0);
    });

    it('scales with difficulty level', () => {
      const diff1 = calculateBountyPayout(12, true, 1);
      const diff5 = calculateBountyPayout(12, true, 5);

      expect(diff5.gold).toBeGreaterThan(diff1.gold);
      expect(diff5.cash).toBeGreaterThan(diff1.cash);
      expect(diff5.xp).toBeGreaterThan(diff1.xp);
    });

    it('scales with time spent', () => {
      const short = calculateBountyPayout(6, true, 3);
      const long = calculateBountyPayout(18, true, 3);

      expect(long.gold).toBeGreaterThan(short.gold);
      expect(long.cash).toBeGreaterThan(short.cash);
      expect(long.xp).toBeGreaterThan(short.xp);
    });

    it('caps time multiplier at 2.5x', () => {
      const result = calculateBountyPayout(60, true, 5);
      const maxMultiplier = 60 / 12;
      expect(result.gold).toBeLessThanOrEqual(0.08 * 5 * 2.5);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TRADER CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateTraderDelivery', () => {
  it('calculates local delivery correctly', () => {
    const result = calculateTraderDelivery(100, false, 1);
    expect(result.owner).toBe(500);
    expect(result.perMember).toBe(250);
    expect(result.total).toBe(500);
    expect(result.risk).toBe('Low');
  });

  it('calculates distant delivery with 25% bonus', () => {
    const result = calculateTraderDelivery(100, true, 1);
    expect(result.owner).toBe(625);
    expect(result.perMember).toBe(312.5);
    expect(result.risk).toBe('High (PvP enabled)');
  });

  it('handles partial goods correctly', () => {
    const result = calculateTraderDelivery(50, false, 1);
    expect(result.owner).toBe(250);
  });

  it('calculates posse member payouts', () => {
    const result = calculateTraderDelivery(100, false, 4);
    // Owner: $500, 3 members at $250 each
    expect(result.total).toBe(500 + 250 * 3);
  });

  it('handles single-member posse', () => {
    const result = calculateTraderDelivery(100, false, 1);
    expect(result.total).toBe(result.owner);
  });
});

describe('calculateHuntingValue', () => {
  it('handles empty animal array', () => {
    const result = calculateHuntingValue([]);
    expect(result.materials).toBe(0);
    expect(result.meat).toBe(0);
  });

  it('calculates materials for 3-star quality', () => {
    const result = calculateHuntingValue([
      { type: 'deer', quality: 3, count: 1 }
    ]);
    expect(result.materials).toBeGreaterThanOrEqual(0);
  });

  it('reduces materials for 2-star quality (60%)', () => {
    const perfect = calculateHuntingValue([
      { type: 'deer', quality: 3, count: 1 }
    ]);
    const good = calculateHuntingValue([
      { type: 'deer', quality: 2, count: 1 }
    ]);

    expect(good.materials).toBeCloseTo(perfect.materials * 0.6, 1);
  });

  it('reduces materials for 1-star quality (30%)', () => {
    const perfect = calculateHuntingValue([
      { type: 'deer', quality: 3, count: 1 }
    ]);
    const poor = calculateHuntingValue([
      { type: 'deer', quality: 1, count: 1 }
    ]);

    expect(poor.materials).toBeCloseTo(perfect.materials * 0.3, 1);
  });

  it('handles multiple animals', () => {
    const result = calculateHuntingValue([
      { type: 'deer', quality: 3, count: 2 },
      { type: 'rabbit', quality: 3, count: 3 }
    ]);
    expect(result.materials).toBeGreaterThan(0);
  });

  it('estimates time based on materials', () => {
    const result = calculateHuntingValue([
      { type: 'deer', quality: 3, count: 10 }
    ]);
    expect(result.estimatedTime).toBeGreaterThanOrEqual(0);
  });

  it('handles unknown animal types gracefully', () => {
    const result = calculateHuntingValue([
      { type: 'unicorn', quality: 3, count: 1 }
    ]);
    expect(result.materials).toBe(0);
    expect(result.meat).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MOONSHINER CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateMoonshineBatch', () => {
  it('calculates weak moonshine batch', () => {
    const result = calculateMoonshineBatch('weak', false, false, 0);
    expect(result.sale).toBe(50);
    expect(result.cost).toBe(30);
    expect(result.profit).toBe(20);
    expect(result.time).toBe(30);
  });

  it('calculates average moonshine batch', () => {
    const result = calculateMoonshineBatch('average', false, false, 0);
    expect(result.sale).toBe(100);
    expect(result.cost).toBe(60);
    expect(result.profit).toBe(40);
    expect(result.time).toBe(45);
  });

  it('calculates strong moonshine batch', () => {
    const result = calculateMoonshineBatch('strong', false, false, 0);
    expect(result.sale).toBe(226);
    expect(result.cost).toBe(50);
    expect(result.profit).toBe(176);
    expect(result.time).toBe(48);
  });

  it('reduces time with condenser upgrade (20%)', () => {
    const withoutUpgrade = calculateMoonshineBatch('strong', false, false, 0);
    const withUpgrade = calculateMoonshineBatch('strong', true, false, 0);

    expect(withUpgrade.time).toBeLessThan(withoutUpgrade.time);
    expect(withUpgrade.time).toBeCloseTo(48 * 0.8, 1);
  });

  it('reduces time with polished copper upgrade (10%)', () => {
    const withoutUpgrade = calculateMoonshineBatch('strong', false, false, 0);
    const withUpgrade = calculateMoonshineBatch('strong', false, true, 0);

    expect(withUpgrade.time).toBeLessThan(withoutUpgrade.time);
    expect(withUpgrade.time).toBeCloseTo(48 * 0.9, 1);
  });

  it('stacks both upgrades (30% total reduction)', () => {
    const result = calculateMoonshineBatch('strong', true, true, 0);
    expect(result.time).toBeCloseTo(48 * 0.7, 1);
  });

  it('includes flavor recipe cost in total', () => {
    const result = calculateMoonshineBatch('strong', false, false, 30);
    expect(result.cost).toBe(80); // 50 + 30
    expect(result.profit).toBe(146); // 226 - 80
  });

  it('calculates per-hour earnings correctly', () => {
    const result = calculateMoonshineBatch('strong', false, false, 0);
    const expectedPerHour = (result.profit / result.time) * 60;
    expect(result.perHour).toBeCloseTo(expectedPerHour, 1);
  });

  it('defaults to weak if invalid strength provided', () => {
    const result = calculateMoonshineBatch('invalid', false, false, 0);
    expect(result.sale).toBe(50);
    expect(result.time).toBe(30);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTOR CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe('calculateCollectorSets', () => {
  it('handles empty set array', () => {
    const result = calculateCollectorSets([]);
    expect(result.total).toBe(0);
    expect(result.perSet).toEqual({});
    expect(result.bestFirst).toEqual([]);
  });

  it('calculates single set value', () => {
    const result = calculateCollectorSets(['coins']);
    expect(result.total).toBeGreaterThan(0);
    expect(result.perSet.coins).toBeGreaterThan(0);
  });

  it('calculates multiple sets', () => {
    const result = calculateCollectorSets(['coins', 'tarot']);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(Object.keys(result.perSet).length).toBeGreaterThan(0);
  });

  it('sorts sets by value descending', () => {
    const result = calculateCollectorSets(['coins', 'tarot', 'flowers']);
    const values = result.bestFirst.map(name => result.perSet[name]);

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
    }
  });

  it('handles unknown set names gracefully', () => {
    const result = calculateCollectorSets(['unknown_set', 'coins']);
    expect(result.perSet.unknown_set).toBeUndefined();
    expect(result.perSet.coins).toBeGreaterThan(0);
  });

  it('sums total value correctly', () => {
    const result = calculateCollectorSets(['coins', 'tarot']);
    const foundSets = Object.values(result.perSet);
    const manualTotal = foundSets.reduce((sum, val) => sum + val, 0);
    expect(result.total).toBe(manualTotal);
  });
});
