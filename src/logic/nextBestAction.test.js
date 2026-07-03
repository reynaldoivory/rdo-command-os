// FILE: src/logic/nextBestAction.test.js
// ═══════════════════════════════════════════════════════════════════════════
// DECISION ENGINE TESTS
// Tests the rule registry and profile analysis logic
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { analyzeProfile, explainAnalysis } from './nextBestAction';
import { PHASES, PRIORITIES } from './decisionRules';

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const FRESH_SPAWN = {
  cash: 50,
  gold: 2,
  rank: 1,
  xp: 0,
  roles: { bountyHunter: 0, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
};

const EARLY_GAME_NO_TRADER = {
  cash: 500,
  gold: 20,
  rank: 15,
  xp: 15000,
  roles: { bountyHunter: 5000, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
};

const MID_GAME_WITH_TRADER = {
  cash: 2000,
  gold: 40,
  rank: 45,
  xp: 100000,
  roles: { bountyHunter: 10000, trader: 8000, collector: 5000, moonshiner: 0, naturalist: 0 }
};

const LOW_GOLD_PROFILE = {
  cash: 5000,
  gold: 10,
  rank: 50,
  xp: 120000,
  roles: { bountyHunter: 10000, trader: 8000, collector: 5000, moonshiner: 0, naturalist: 0 }
};

const LOW_CASH_PROFILE = {
  cash: 200,
  gold: 50,
  rank: 35,
  xp: 80000,
  roles: { bountyHunter: 10000, trader: 8000, collector: 5000, moonshiner: 0, naturalist: 0 }
};

// ═══════════════════════════════════════════════════════════════════════════
// RULE MATCHING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Rule Matching', () => {
  describe('RULE: trader_sale (wagon full)', () => {
    it('triggers when wagon is 90%+ full', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 95 });
      expect(result.primaryAction.text).toContain('Trader Wagon');
      expect(result.priority).toBe(PRIORITIES.CRITICAL.level);
    });

    it('does not trigger when wagon is 89% full', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 89 });
      expect(result.primaryAction.text).not.toContain('Trader Wagon at Capacity');
    });

    it('does not trigger if player has no trader role', () => {
      const result = analyzeProfile(EARLY_GAME_NO_TRADER, { load: 95 });
      expect(result.primaryAction.text).not.toContain('Trader Wagon');
    });

    it('includes gold warning if gold is critical', () => {
      const lowGoldTrader = { ...MID_GAME_WITH_TRADER, gold: 10 };
      const result = analyzeProfile(lowGoldTrader, { load: 95 });
      expect(result.secondaryAction.text).toContain('Gold Critical');
    });

    it('suggests restocking after sale if gold is safe', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 95 });
      expect(result.secondaryAction.text).toContain('Restock materials');
    });
  });

  describe('RULE: gold_critical', () => {
    it('triggers when gold < 15', () => {
      const result = analyzeProfile(LOW_GOLD_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toContain('Gold');
      expect(result.priority).toBe(PRIORITIES.HIGH.level);
    });

    it('recommends bounty hunting', () => {
      const result = analyzeProfile(LOW_GOLD_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toContain('Bounties');
    });

    it('adds HOLD GOLD constraint', () => {
      const result = analyzeProfile(LOW_GOLD_PROFILE, { load: 50 });
      expect(result.constraints).toContain('HOLD GOLD');
    });

    it('does not trigger when gold >= 15', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
      expect(result.primaryAction.text).not.toContain('Gold Reserves Critical');
    });
  });

  describe('RULE: trader_resupply (wagon empty)', () => {
    it('triggers when wagon < 10%', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 5 });
      expect(result.primaryAction.text).toContain('Materials Critical');
      expect(result.priority).toBe(PRIORITIES.HIGH.level);
    });

    it('suggests hunting high-value animals', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 5 });
      expect(result.primaryAction.text).toMatch(/Hunt.*Cougars|Bucks/i);
    });

    it('does not trigger when wagon is 11%', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 11 });
      expect(result.primaryAction.text).not.toContain('Materials Critical');
    });

    it('does not trigger without trader role', () => {
      const result = analyzeProfile(EARLY_GAME_NO_TRADER, { load: 5 });
      expect(result.primaryAction.text).not.toContain('Materials Critical');
    });
  });

  describe('RULE: trader_near_full', () => {
    it('triggers when wagon is 75-89%', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 80 });
      expect(result.primaryAction.text).toContain('Wagon');
      expect(result.primaryAction.text).toContain('Full');
    });

    it('shows current load percentage', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 80 });
      expect(result.primaryAction.text).toContain('80%');
    });

    it('suggests distant delivery option', () => {
      const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 80 });
      expect(result.secondaryAction.text).toContain('distant delivery');
    });
  });

  describe('RULE: cash_farm (early game)', () => {
    it('triggers when cash < 500 and rank < 40', () => {
      const result = analyzeProfile(LOW_CASH_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toMatch(/Cash|Collector/i);
    });

    it('recommends collector cycle', () => {
      const result = analyzeProfile(LOW_CASH_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toContain('Collector');
    });

    it('does not trigger in mid-game rank', () => {
      const midGamePoor = { ...LOW_CASH_PROFILE, rank: 50 };
      const result = analyzeProfile(midGamePoor, { load: 50 });
      // Should match different rule or default
      expect(result.primaryAction.text).not.toContain('"Coin" Cycle');
    });
  });

  describe('RULE: collector_sets (cash poor with collector)', () => {
    it('triggers when cash < 500 and has collector role', () => {
      const result = analyzeProfile(LOW_CASH_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toMatch(/Collector/i);
    });

    it('suggests complete sets', () => {
      const result = analyzeProfile(LOW_CASH_PROFILE, { load: 50 });
      expect(result.primaryAction.text).toContain('Collector');
    });

    it('does not trigger without collector role', () => {
      const noCollector = { ...LOW_CASH_PROFILE, roles: { ...LOW_CASH_PROFILE.roles, collector: 0 } };
      const result = analyzeProfile(noCollector, { load: 50 });
      expect(result.primaryAction.text).not.toContain('Complete sets');
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PHASE DETECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Phase Detection', () => {
  it('identifies EARLY phase (rank < 40)', () => {
    const result = analyzeProfile(EARLY_GAME_NO_TRADER, { load: 0 });
    expect(result.phase).toBe(PHASES.EARLY);
  });

  it('identifies MID phase (rank 40-89)', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 0 });
    expect(result.phase).toBe(PHASES.MID);
  });

  it('identifies LATE phase (rank 90+)', () => {
    const lateGame = { ...MID_GAME_WITH_TRADER, rank: 95 };
    const result = analyzeProfile(lateGame, { load: 0 });
    expect(result.phase).toBe(PHASES.LATE);
  });

  it('handles boundary at rank 40', () => {
    const boundary = { ...MID_GAME_WITH_TRADER, rank: 40 };
    const result = analyzeProfile(boundary, { load: 0 });
    expect(result.phase).toBe(PHASES.MID);
  });

  it('handles boundary at rank 90', () => {
    const boundary = { ...MID_GAME_WITH_TRADER, rank: 90 };
    const result = analyzeProfile(boundary, { load: 0 });
    expect(result.phase).toBe(PHASES.LATE);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CONSTRAINT TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Constraints', () => {
  it('adds HOLD GOLD constraint when gold < 40', () => {
    const result = analyzeProfile(LOW_GOLD_PROFILE, { load: 50 });
    expect(result.constraints).toContain('HOLD GOLD');
  });

  it('does not add HOLD GOLD when gold >= 40', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(result.constraints).not.toContain('HOLD GOLD');
  });

  it('adds NO COSMETICS constraint when gold critical', () => {
    const result = analyzeProfile(LOW_GOLD_PROFILE, { load: 50 });
    expect(result.constraints).toContain('NO COSMETICS');
  });

  it('merges rule-specific and global constraints', () => {
    const lowGoldTrader = { ...MID_GAME_WITH_TRADER, gold: 10 };
    const result = analyzeProfile(lowGoldTrader, { load: 95 });
    expect(result.constraints).toContain('HOLD GOLD');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT ACTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Default Fallback', () => {
  it('returns daily challenges when no rules match', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(result.primaryAction.text).toContain('Daily Challenges');
  });

  it('default has MAINTAIN priority', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(result.priority).toBe(PRIORITIES.MAINTAIN.level);
  });

  it('suggests streak maintenance', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(result.primaryAction.subtext).toContain('streak');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// WAGON STATE NORMALIZATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Wagon State Handling', () => {
  it('accepts wagon state as { load: number }', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.primaryAction.text).toContain('Trader Wagon');
  });

  it('accepts wagon state as { fillPercent: number }', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { fillPercent: 95 });
    expect(result.primaryAction.text).toContain('Trader Wagon');
  });

  it('defaults to 0 if wagon state missing', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, {});
    expect(result.primaryAction.text).not.toContain('Trader Wagon at Capacity');
  });

  it('handles null wagon state', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER);
    expect(result).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPLAIN ANALYSIS TESTS (Diagnostics)
// ═══════════════════════════════════════════════════════════════════════════

describe('explainAnalysis - Diagnostics', () => {
  it('includes diagnostics object', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result).toHaveProperty('diagnostics');
  });

  it('includes input snapshot', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.diagnostics).toHaveProperty('inputSnapshot');
    expect(result.diagnostics.inputSnapshot).toHaveProperty('rank');
    expect(result.diagnostics.inputSnapshot).toHaveProperty('cash');
    expect(result.diagnostics.inputSnapshot).toHaveProperty('gold');
  });

  it('includes rule evaluations', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.diagnostics).toHaveProperty('ruleEvaluations');
    expect(Array.isArray(result.diagnostics.ruleEvaluations)).toBe(true);
  });

  it('identifies active rule', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.diagnostics.ruleId).toBe('trader_sale');
  });

  it('shows which rules were skipped', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.diagnostics).toHaveProperty('skipTrace');
    expect(Array.isArray(result.diagnostics.skipTrace)).toBe(true);
  });

  it('includes timestamp', () => {
    const result = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.diagnostics.timestamp).toBeGreaterThan(0);
  });

  it('returns same action as analyzeProfile', () => {
    const standard = analyzeProfile(MID_GAME_WITH_TRADER, { load: 95 });
    const explained = explainAnalysis(MID_GAME_WITH_TRADER, { load: 95 });

    expect(explained.primaryAction).toEqual(standard.primaryAction);
    expect(explained.priority).toEqual(standard.priority);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// RETURN STRUCTURE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Return Structure', () => {
  it('returns all expected top-level properties', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(result).toHaveProperty('phase');
    expect(result).toHaveProperty('priority');
    expect(result).toHaveProperty('primaryAction');
    expect(result).toHaveProperty('secondaryAction');
    expect(result).toHaveProperty('constraints');
  });

  it('primaryAction has required fields', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 95 });
    expect(result.primaryAction).toHaveProperty('icon');
    expect(result.primaryAction).toHaveProperty('text');
    expect(result.primaryAction).toHaveProperty('subtext');
    expect(result.primaryAction).toHaveProperty('impact');
  });

  it('constraints is always an array', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    expect(Array.isArray(result.constraints)).toBe(true);
  });

  it('secondaryAction can be null', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 50 });
    // Default action has no secondary
    expect(result.secondaryAction).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════════════════

describe('analyzeProfile - Edge Cases', () => {
  it('handles empty profile gracefully', () => {
    const result = analyzeProfile({}, { load: 0 });
    expect(result).toBeDefined();
    expect(result.phase).toBe(PHASES.EARLY);
  });

  it('handles null profile gracefully', () => {
    const result = analyzeProfile(null, { load: 0 });
    expect(result).toBeDefined();
  });

  it('handles undefined profile gracefully', () => {
    const result = analyzeProfile(undefined, { load: 0 });
    expect(result).toBeDefined();
  });

  it('handles rank 0', () => {
    const rank0 = { ...FRESH_SPAWN, rank: 0 };
    const result = analyzeProfile(rank0, { load: 0 });
    expect(result.phase).toBe(PHASES.EARLY);
  });

  it('handles negative gold', () => {
    const negGold = { ...MID_GAME_WITH_TRADER, gold: -10 };
    const result = analyzeProfile(negGold, { load: 50 });
    expect(result).toBeDefined();
    expect(result.constraints).toContain('HOLD GOLD');
  });

  it('handles wagon load > 100', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: 150 });
    expect(result.primaryAction.text).toContain('Trader Wagon');
  });

  it('handles wagon load < 0', () => {
    const result = analyzeProfile(MID_GAME_WITH_TRADER, { load: -10 });
    expect(result).toBeDefined();
  });
});
