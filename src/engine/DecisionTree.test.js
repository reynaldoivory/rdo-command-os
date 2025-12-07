// FILE: src/engine/DecisionTree.test.js
// ═══════════════════════════════════════════════════════════════════════════
// DECISION TREE UNIT TESTS
// Tests the efficiency analysis engine with various player scenarios
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { analyzeEfficiency, canAffordItem, estimateTimeToAfford } from './DecisionTree';

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_CATALOG = [
  { id: 'cheap_item', name: 'Cheap Item', price: 50, gold: 0, rank: 1, type: 'weapon' },
  { id: 'expensive_item', name: 'Expensive Item', price: 500, gold: 0, rank: 1, type: 'weapon' },
  { id: 'gold_item', name: 'Gold Item', price: 0, gold: 10, rank: 1, type: 'weapon' },
  { id: 'dual_currency', name: 'Dual Currency', price: 200, gold: 5, rank: 1, type: 'weapon' },
  { id: 'locked_item', name: 'Locked Item', price: 100, gold: 0, rank: 50, type: 'weapon' },
  { id: 'w_rif_bolt', name: 'Bolt Action Rifle', price: 216, gold: 0, rank: 7, type: 'weapon' },
  { id: 'high_value', name: 'High Value', price: 600, gold: 0, rank: 1, type: 'weapon' },
  { id: 'high_value_2', name: 'High Value 2', price: 550, gold: 0, rank: 1, type: 'weapon' },
];

const FRESH_SPAWN_PROFILE = {
  cash: 50,
  gold: 2,
  rank: 1,
  xp: 0,
  roles: { bountyHunter: 0, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
};

const MID_GAME_PROFILE = {
  cash: 1500,
  gold: 25,
  rank: 45,
  xp: 100000,
  roles: { bountyHunter: 5000, trader: 3000, collector: 2000, moonshiner: 0, naturalist: 0 }
};

const WEALTHY_PROFILE = {
  cash: 50000,
  gold: 500,
  rank: 100,
  xp: 500000,
  roles: { bountyHunter: 50000, trader: 50000, collector: 50000, moonshiner: 50000, naturalist: 50000 }
};

// ═══════════════════════════════════════════════════════════════════════════
// analyzeEfficiency TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeEfficiency', () => {
  describe('Empty Cart Scenarios', () => {
    it('returns IDLE bottleneck for empty cart', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, []);
      expect(result.metrics.bottleneck).toBe('IDLE');
    });

    it('has info recommendation for empty cart', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, []);
      const emptyCartRec = result.recommendations.find(r => r.title === 'No Active Plan');
      expect(emptyCartRec).toBeDefined();
      expect(emptyCartRec.type).toBe('info');
    });

    it('returns zero cart totals for empty cart', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, []);
      expect(result.cartTotals.cash).toBe(0);
      expect(result.cartTotals.gold).toBe(0);
    });
  });

  describe('Budget Overrun Detection', () => {
    it('detects cash deficit', () => {
      const poorProfile = { ...MID_GAME_PROFILE, cash: 100 };
      const result = analyzeEfficiency(poorProfile, MOCK_CATALOG, ['expensive_item']);
      
      expect(result.metrics.bottleneck).toBe('CASH');
      const cashRec = result.recommendations.find(r => r.title === 'Cash Deficit');
      expect(cashRec).toBeDefined();
      expect(cashRec.type).toBe('critical');
    });

    it('detects gold deficit', () => {
      const lowGoldProfile = { ...MID_GAME_PROFILE, gold: 5 };
      const result = analyzeEfficiency(lowGoldProfile, MOCK_CATALOG, ['gold_item']);
      
      expect(result.metrics.bottleneck).toBe('GOLD');
      const goldRec = result.recommendations.find(r => r.title === 'Gold Deficit');
      expect(goldRec).toBeDefined();
      expect(goldRec.type).toBe('critical');
    });

    it('detects dual currency deficit', () => {
      const brokeProfile = { cash: 100, gold: 2, rank: 50, xp: 0, roles: {} };
      const result = analyzeEfficiency(brokeProfile, MOCK_CATALOG, ['expensive_item', 'gold_item']);
      
      expect(result.metrics.bottleneck).toBe('CASH + GOLD');
    });
  });

  describe('Reserve Warnings', () => {
    it('warns about low cash reserve after purchase', () => {
      const profile = { ...MID_GAME_PROFILE, cash: 150 };
      const result = analyzeEfficiency(profile, MOCK_CATALOG, ['cheap_item']);
      
      // After buying $50 item, $100 remains - exactly at threshold
      // But profile has $150, after $50 = $100, which equals CASH_RESERVE_MIN
      // So no warning should trigger. Let's test with less.
      const tightProfile = { ...MID_GAME_PROFILE, cash: 100 };
      const tightResult = analyzeEfficiency(tightProfile, MOCK_CATALOG, ['cheap_item']);
      
      const lowCashRec = tightResult.recommendations.find(r => r.title === 'Low Cash Reserve');
      expect(lowCashRec).toBeDefined();
      expect(lowCashRec.type).toBe('warning');
    });

    it('warns about low gold reserve after purchase', () => {
      const profile = { ...MID_GAME_PROFILE, gold: 12 };
      const result = analyzeEfficiency(profile, MOCK_CATALOG, ['gold_item']);
      
      // After buying 10 gold item, 2 GB remains
      const lowGoldRec = result.recommendations.find(r => r.title === 'Low Gold Reserve');
      expect(lowGoldRec).toBeDefined();
      expect(lowGoldRec.type).toBe('warning');
    });
  });

  describe('Rank-Locked Items', () => {
    it('detects locked items in cart', () => {
      const lowRankProfile = { ...MID_GAME_PROFILE, rank: 10 };
      const result = analyzeEfficiency(lowRankProfile, MOCK_CATALOG, ['locked_item']);
      
      const lockedRec = result.recommendations.find(r => r.title === 'Rank-Locked Items');
      expect(lockedRec).toBeDefined();
      expect(lockedRec.type).toBe('critical');
      expect(lockedRec.desc).toContain('Rank 50');
    });

    it('no warning when rank is sufficient', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, ['cheap_item']);
      
      const lockedRec = result.recommendations.find(r => r.title === 'Rank-Locked Items');
      expect(lockedRec).toBeUndefined();
    });
  });

  describe('Fresh Spawn Detection', () => {
    it('identifies fresh spawn player with cart', () => {
      // Fresh spawn with item in cart - should show GOLD (CRITICAL)
      const result = analyzeEfficiency(FRESH_SPAWN_PROFILE, MOCK_CATALOG, ['cheap_item']);
      
      expect(result.metrics.bottleneck).toBe('GOLD (CRITICAL)');
      // Efficiency is low due to fresh spawn status + reserve warnings
      expect(result.metrics.efficiency).toBeLessThanOrEqual(30);
    });

    it('shows IDLE for fresh spawn with empty cart', () => {
      // Empty cart overrides bottleneck to IDLE (by design)
      const result = analyzeEfficiency(FRESH_SPAWN_PROFILE, MOCK_CATALOG, []);
      
      // The empty cart check runs after fresh spawn detection
      expect(result.metrics.bottleneck).toBe('IDLE');
    });

    it('provides 15 Gold objective for fresh spawn', () => {
      const result = analyzeEfficiency(FRESH_SPAWN_PROFILE, MOCK_CATALOG, []);
      
      const goldObjective = result.recommendations.find(r => 
        r.title.includes('15 Gold')
      );
      expect(goldObjective).toBeDefined();
      expect(goldObjective.type).toBe('critical');
    });

    it('provides story mission advice for low cash fresh spawn', () => {
      const result = analyzeEfficiency(FRESH_SPAWN_PROFILE, MOCK_CATALOG, []);
      
      const storyRec = result.recommendations.find(r => 
        r.title.includes('Story Missions')
      );
      expect(storyRec).toBeDefined();
    });

    it('provides daily challenge advice', () => {
      const result = analyzeEfficiency(FRESH_SPAWN_PROFILE, MOCK_CATALOG, []);
      
      const dailyRec = result.recommendations.find(r => 
        r.title.includes('Daily Challenge')
      );
      expect(dailyRec).toBeDefined();
    });
  });

  describe('High-Value Item Detection', () => {
    it('warns about multiple high-value items', () => {
      const result = analyzeEfficiency(WEALTHY_PROFILE, MOCK_CATALOG, ['high_value', 'high_value_2']);
      
      const highValueRec = result.recommendations.find(r => 
        r.title === 'Multiple High-Value Items'
      );
      expect(highValueRec).toBeDefined();
      expect(highValueRec.type).toBe('warning');
    });

    it('no warning for single high-value item', () => {
      const result = analyzeEfficiency(WEALTHY_PROFILE, MOCK_CATALOG, ['high_value']);
      
      const highValueRec = result.recommendations.find(r => 
        r.title === 'Multiple High-Value Items'
      );
      expect(highValueRec).toBeUndefined();
    });
  });

  describe('Efficiency Score Calculation', () => {
    it('returns 100 efficiency for wealthy player with affordable cart', () => {
      const result = analyzeEfficiency(WEALTHY_PROFILE, MOCK_CATALOG, ['cheap_item']);
      
      // Base 100 + 5 (cash reserve) + 5 (gold reserve) = 110, clamped to 100
      expect(result.metrics.efficiency).toBe(100);
    });

    it('reduces efficiency for critical issues', () => {
      const brokeProfile = { cash: 10, gold: 1, rank: 1, xp: 0, roles: {} };
      const result = analyzeEfficiency(brokeProfile, MOCK_CATALOG, ['expensive_item']);
      
      expect(result.metrics.efficiency).toBeLessThan(100);
    });

    it('clamps efficiency to 0-100 range', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, []);
      expect(result.metrics.efficiency).toBeGreaterThanOrEqual(0);
      expect(result.metrics.efficiency).toBeLessThanOrEqual(100);
    });
  });

  describe('Return Structure', () => {
    it('returns all expected properties', () => {
      const result = analyzeEfficiency(MID_GAME_PROFILE, MOCK_CATALOG, ['cheap_item']);
      
      expect(result).toHaveProperty('metrics');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('cartTotals');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('summary');
    });

    it('sorts recommendations by priority', () => {
      const brokeProfile = { cash: 10, gold: 1, rank: 1, xp: 0, roles: {} };
      const result = analyzeEfficiency(brokeProfile, MOCK_CATALOG, ['expensive_item', 'locked_item']);
      
      for (let i = 1; i < result.recommendations.length; i++) {
        expect(result.recommendations[i].priority).toBeGreaterThanOrEqual(
          result.recommendations[i - 1].priority
        );
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// canAffordItem TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('canAffordItem', () => {
  it('returns true when player can afford item', () => {
    const item = { price: 100, gold: 5, rank: 10 };
    const profile = { cash: 500, gold: 20, rank: 50 };
    
    expect(canAffordItem(profile, item)).toBe(true);
  });

  it('returns false when cash is insufficient', () => {
    const item = { price: 100, gold: 0, rank: 1 };
    const profile = { cash: 50, gold: 20, rank: 50 };
    
    expect(canAffordItem(profile, item)).toBe(false);
  });

  it('returns false when gold is insufficient', () => {
    const item = { price: 0, gold: 10, rank: 1 };
    const profile = { cash: 500, gold: 5, rank: 50 };
    
    expect(canAffordItem(profile, item)).toBe(false);
  });

  it('returns false when rank is insufficient', () => {
    const item = { price: 100, gold: 0, rank: 50 };
    const profile = { cash: 500, gold: 20, rank: 10 };
    
    expect(canAffordItem(profile, item)).toBe(false);
  });

  it('handles items with undefined price/gold/rank', () => {
    const item = { name: 'Free Item' };
    const profile = { cash: 0, gold: 0, rank: 1 };
    
    expect(canAffordItem(profile, item)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// estimateTimeToAfford TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('estimateTimeToAfford', () => {
  it('returns 0 when player can already afford item', () => {
    const profile = { cash: 500, gold: 20 };
    const item = { price: 100, gold: 5 };
    
    expect(estimateTimeToAfford(profile, item)).toBe(0);
  });

  it('calculates time based on cash needed', () => {
    const profile = { cash: 0, gold: 100 };
    const item = { price: 200, gold: 0 };
    const earnings = { cash: 200, gold: 0.5 };
    
    // Need $200 at $200/hr = 1 hour
    expect(estimateTimeToAfford(profile, item, earnings)).toBe(1);
  });

  it('calculates time based on gold needed', () => {
    const profile = { cash: 10000, gold: 0 };
    const item = { price: 0, gold: 10 };
    const earnings = { cash: 200, gold: 0.5 };
    
    // Need 10 gold at 0.5/hr = 20 hours
    expect(estimateTimeToAfford(profile, item, earnings)).toBe(20);
  });

  it('returns max of cash time and gold time', () => {
    const profile = { cash: 0, gold: 0 };
    const item = { price: 400, gold: 5 };
    const earnings = { cash: 200, gold: 0.5 };
    
    // Cash: $400 at $200/hr = 2 hours
    // Gold: 5 at 0.5/hr = 10 hours
    // Max = 10 hours
    expect(estimateTimeToAfford(profile, item, earnings)).toBe(10);
  });

  it('uses default earnings when not provided', () => {
    const profile = { cash: 0, gold: 0 };
    const item = { price: 200, gold: 0 };
    
    // Default: $200/hr for cash
    expect(estimateTimeToAfford(profile, item)).toBe(1);
  });
});
