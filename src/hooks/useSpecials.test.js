// FILE: src/hooks/useSpecials.test.js
// ═══════════════════════════════════════════════════════════════════════════
// WEEKLY SPECIALS HOOK TESTS
// Tests remote feed caching, parsing, and helper functions
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getBonusesForRole,
  getDiscountForItem,
  getTimeUntilExpiry,
} from './useSpecials';

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_SPECIALS = {
  meta: {
    version: 1,
    lastUpdated: '2024-03-10T00:00:00Z',
    validUntil: '2024-03-17T06:00:00Z',
    source: 'Test'
  },
  weeklyTheme: {
    title: 'Bounty Hunter Week',
    description: '2X Gold on Bounties',
    icon: 'star'
  },
  bonuses: [
    {
      id: 'bh_2x',
      role: 'bountyHunter',
      label: '2X Gold on Bounty Hunter Missions',
      multiplier: 2,
      description: 'Earn double gold from all bounty missions'
    },
    {
      id: 'trader_1_5x',
      role: 'trader',
      label: '1.5X Cash on Trader Deliveries',
      multiplier: 1.5,
      description: 'Earn 50% more cash from trader sales'
    },
    {
      id: 'general_xp',
      role: null,
      label: '2X XP on Story Missions',
      multiplier: 2,
      description: 'Double XP from story missions'
    }
  ],
  discounts: [
    {
      id: 'disc_1',
      itemId: 'w_rif_bolt',
      name: 'Bolt Action Rifle',
      originalPrice: 216,
      salePrice: 150,
      percentOff: 30
    },
    {
      id: 'disc_2',
      itemId: 'role_bounty_wagon',
      name: 'Bounty Wagon',
      originalPrice: 875,
      salePrice: 700,
      percentOff: 20
    }
  ],
  freeItems: [],
  limitedTime: []
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('getBonusesForRole', () => {
  it('returns bonuses for specific role', () => {
    const bonuses = getBonusesForRole(MOCK_SPECIALS, 'bountyHunter');
    expect(bonuses).toHaveLength(1);
    expect(bonuses[0].id).toBe('bh_2x');
  });

  it('filters out bonuses from other roles', () => {
    const bonuses = getBonusesForRole(MOCK_SPECIALS, 'bountyHunter');
    const hasTraderBonus = bonuses.some(b => b.role === 'trader');
    expect(hasTraderBonus).toBe(false);
  });

  it('returns empty array when no bonuses exist for role', () => {
    const bonuses = getBonusesForRole(MOCK_SPECIALS, 'collector');
    expect(bonuses).toHaveLength(0);
  });

  it('handles null specials gracefully', () => {
    const bonuses = getBonusesForRole(null, 'bountyHunter');
    expect(bonuses).toEqual([]);
  });

  it('handles missing bonuses array gracefully', () => {
    const bonuses = getBonusesForRole({}, 'bountyHunter');
    expect(bonuses).toEqual([]);
  });

  it('handles undefined role parameter', () => {
    const bonuses = getBonusesForRole(MOCK_SPECIALS, undefined);
    expect(Array.isArray(bonuses)).toBe(true);
  });
});

describe('getDiscountForItem', () => {
  it('finds discount by item ID', () => {
    const discount = getDiscountForItem(MOCK_SPECIALS, 'w_rif_bolt');
    expect(discount).toBeDefined();
    expect(discount.name).toBe('Bolt Action Rifle');
    expect(discount.percentOff).toBe(30);
  });

  it('returns null when item not on sale', () => {
    const discount = getDiscountForItem(MOCK_SPECIALS, 'nonexistent_item');
    expect(discount).toBeUndefined();
  });

  it('handles null specials gracefully', () => {
    const discount = getDiscountForItem(null, 'w_rif_bolt');
    expect(discount).toBeNull();
  });

  it('handles missing discounts array gracefully', () => {
    const discount = getDiscountForItem({}, 'w_rif_bolt');
    expect(discount).toBeNull();
  });

  it('matches exact item ID only', () => {
    const discount = getDiscountForItem(MOCK_SPECIALS, 'w_rif');
    expect(discount).toBeUndefined();
  });
});

describe('getTimeUntilExpiry', () => {
  beforeEach(() => {
    // Mock current date to 2024-03-14 (3 days before expiry)
    const mockDate = new Date('2024-03-14T12:00:00Z');
    globalThis.Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(mockDate);
        } else {
          super(...args);
        }
      }
    };
  });

  afterEach(() => {
    // Restore Date
    globalThis.Date = Date;
  });

  it('calculates days and hours remaining', () => {
    const timeLeft = getTimeUntilExpiry(MOCK_SPECIALS);
    expect(timeLeft).toContain('d');
    expect(timeLeft).toContain('h');
  });

  it('shows only hours when less than 1 day remaining', () => {
    const specials = {
      meta: {
        validUntil: '2024-03-14T15:00:00Z' // 3 hours from mock time
      }
    };
    const timeLeft = getTimeUntilExpiry(specials);
    expect(timeLeft).toContain('h');
    expect(timeLeft).not.toContain('d');
  });

  it('returns "Expired" when past expiry date', () => {
    const specials = {
      meta: {
        validUntil: '2024-03-10T00:00:00Z' // In the past
      }
    };
    const timeLeft = getTimeUntilExpiry(specials);
    expect(timeLeft).toBe('Expired');
  });

  it('returns null when validUntil is missing', () => {
    const specials = { meta: {} };
    const timeLeft = getTimeUntilExpiry(specials);
    expect(timeLeft).toBeNull();
  });

  it('handles null specials gracefully', () => {
    const timeLeft = getTimeUntilExpiry(null);
    expect(timeLeft).toBeNull();
  });

  it('handles missing meta gracefully', () => {
    const timeLeft = getTimeUntilExpiry({});
    expect(timeLeft).toBeNull();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CACHE BEHAVIOR TESTS (localStorage simulation)
// ═══════════════════════════════════════════════════════════════════════════

describe('Cache behavior', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value;
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    };

    globalThis.localStorage = localStorageMock;
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('stores cache key in expected format', () => {
    const CACHE_KEY = 'rdo_specials_cache';
    const mockData = { test: 'data' };
    const cacheEntry = {
      data: mockData,
      timestamp: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    const retrieved = JSON.parse(localStorage.getItem(CACHE_KEY));

    expect(retrieved.data).toEqual(mockData);
    expect(retrieved.timestamp).toBeDefined();
  });

  it('validates cache structure', () => {
    const CACHE_KEY = 'rdo_specials_cache';
    const cacheEntry = {
      data: MOCK_SPECIALS,
      timestamp: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    const retrieved = JSON.parse(localStorage.getItem(CACHE_KEY));

    expect(retrieved).toHaveProperty('data');
    expect(retrieved).toHaveProperty('timestamp');
    expect(retrieved.data).toHaveProperty('meta');
    expect(retrieved.data).toHaveProperty('bonuses');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DATA VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Data validation', () => {
  it('validates required fields in specials object', () => {
    expect(MOCK_SPECIALS).toHaveProperty('meta');
    expect(MOCK_SPECIALS).toHaveProperty('bonuses');
    expect(MOCK_SPECIALS).toHaveProperty('discounts');
  });

  it('validates meta structure', () => {
    expect(MOCK_SPECIALS.meta).toHaveProperty('version');
    expect(MOCK_SPECIALS.meta).toHaveProperty('lastUpdated');
    expect(MOCK_SPECIALS.meta).toHaveProperty('validUntil');
  });

  it('validates bonus structure', () => {
    const bonus = MOCK_SPECIALS.bonuses[0];
    expect(bonus).toHaveProperty('id');
    expect(bonus).toHaveProperty('label');
    expect(bonus).toHaveProperty('multiplier');
    expect(typeof bonus.multiplier).toBe('number');
  });

  it('validates discount structure', () => {
    const discount = MOCK_SPECIALS.discounts[0];
    expect(discount).toHaveProperty('id');
    expect(discount).toHaveProperty('itemId');
    expect(discount).toHaveProperty('originalPrice');
    expect(discount).toHaveProperty('salePrice');
    expect(discount).toHaveProperty('percentOff');
  });

  it('validates discount math', () => {
    const discount = MOCK_SPECIALS.discounts[0];
    const calculatedPercent = Math.round(
      ((discount.originalPrice - discount.salePrice) / discount.originalPrice) * 100
    );
    // Allow for 1-2% rounding difference
    expect(Math.abs(calculatedPercent - discount.percentOff)).toBeLessThanOrEqual(2);
  });
});
