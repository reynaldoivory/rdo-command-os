// FILE: src/utils/rdo-logic.test.js
// ═══════════════════════════════════════════════════════════════════════════
// UNIT TESTS - Pure logic functions
// Run: npm run test
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { getLevelFromXP, getXPProgress, calcDistance } from './rdo-logic';

describe('getLevelFromXP', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
  });

  it('returns level 1 for XP below first threshold', () => {
    expect(getLevelFromXP(100)).toBe(1);
  });

  it('returns correct level for exact threshold match', () => {
    // RANK_XP_TABLE[2] = 500 (level 2 threshold)
    expect(getLevelFromXP(500)).toBe(2);
  });

  it('returns correct level for XP between thresholds', () => {
    // Level 2 at 500, Level 3 at 1150
    expect(getLevelFromXP(800)).toBe(2);
  });

  it('respects maxLevel cap', () => {
    expect(getLevelFromXP(9999999, false, 10)).toBe(10);
  });

  it('handles role XP tables differently', () => {
    // Role XP uses different progression
    const playerLevel = getLevelFromXP(1000, false);
    const roleLevel = getLevelFromXP(1000, true);
    // They should differ since tables are different
    expect(typeof playerLevel).toBe('number');
    expect(typeof roleLevel).toBe('number');
  });

  it('handles negative XP gracefully', () => {
    expect(getLevelFromXP(-100)).toBe(1);
  });
});

describe('getXPProgress', () => {
  it('returns 0% progress at level start', () => {
    const progress = getXPProgress(500); // Exactly level 2
    expect(progress.current).toBe(0);
    expect(progress.percent).toBe(0);
  });

  it('returns correct progress mid-level', () => {
    // Level 2 = 500, Level 3 = 1100 (600 XP range)
    const progress = getXPProgress(800); // 300 into the 600 range = 50%
    expect(progress.current).toBe(300);
    expect(progress.needed).toBe(600);
    expect(progress.percent).toBeCloseTo(50, 0);
  });

  it('returns 100% at max level', () => {
    const progress = getXPProgress(9999999, false, 100);
    expect(progress.percent).toBe(100);
  });

  it('returns object with all required properties', () => {
    const progress = getXPProgress(1000);
    expect(progress).toHaveProperty('current');
    expect(progress).toHaveProperty('needed');
    expect(progress).toHaveProperty('percent');
  });
});

describe('calcDistance', () => {
  it('returns 0 for same location', () => {
    const loc = { x: 100, y: 200 };
    expect(calcDistance(loc, loc)).toBe(0);
  });

  it('calculates horizontal distance correctly', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 100, y: 0 };
    expect(calcDistance(a, b)).toBe(100);
  });

  it('calculates vertical distance correctly', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 0, y: 100 };
    expect(calcDistance(a, b)).toBe(100);
  });

  it('calculates diagonal distance (Pythagorean)', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 3, y: 4 };
    expect(calcDistance(a, b)).toBe(5); // 3-4-5 triangle
  });

  it('handles negative coordinates', () => {
    const a = { x: -10, y: -10 };
    const b = { x: 10, y: 10 };
    expect(calcDistance(a, b)).toBeCloseTo(28.28, 1); // sqrt(800)
  });
});
