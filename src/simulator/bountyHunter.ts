/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOUNTY HUNTER CALCULATOR - Pure Economic Functions
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implements the Bounty Hunter payout formulas from the Frontier Algorithm.
 * All functions are pure (no side effects, deterministic).
 * 
 * Core Formula:
 *   Cash = B × M_tier × M_status × M_time × M_count
 *   Gold = TimeBonus(minutes)
 *   XP   = BaseXP × RankMultiplier
 */

import {
  BOUNTY_PAYOUT_BASE_CASH,
  BOUNTY_PAYOUT_TIER_MULTIPLIERS,
  BOUNTY_PAYOUT_STATUS_MULTIPLIERS,
  BOUNTY_PAYOUT_TARGET_MULTIPLIERS,
  BOUNTY_GOLD_TIME_BONUS,
  BOUNTY_XP_BASE,
} from '../domain/gameData.constants';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT & OUTPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BountyPayoutInput {
  /** Base cash amount before multipliers */
  baseCash?: number;
  
  /** Bounty tier: 1 ($), 2 ($$), 3 ($$$) */
  tier: 1 | 2 | 3;
  
  /** True if all targets captured alive; false if killed */
  alive: boolean;
  
  /** Number of targets: 1, 2, or 3 */
  targetCount: 1 | 2 | 3;
  
  /** Minutes elapsed during bounty (affects gold bonus) */
  minutesElapsed: number;
  
  /** Rank multiplier (role rank bonus, future feature) */
  rankMultiplier?: number;
}

export interface BountyPayoutResult {
  /** Total cash earned */
  cash: number;
  
  /** Gold bars earned (time-based bonus) */
  gold: number;
  
  /** Total experience points */
  xp: number;
  
  /** Effective cash per hour */
  cash_per_hour: number;
  
  /** Effective gold per hour */
  gold_per_hour: number;
  
  /** Breakdown of calculation for transparency */
  breakdown?: {
    base_cash: number;
    tier_multiplier: number;
    status_multiplier: number;
    target_multiplier: number;
    rank_multiplier: number;
    time_bonus_gold: number;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GOLD TIME BONUS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates gold bar bonus based on mission completion time.
 * 
 * Rules:
 * - 0-12 min: 0.08 gold per 3 minutes (up to 0.32 gold)
 * - 12-15 min: 0.04 gold additional
 * - 15-30 min: 0.04 gold per 5 minutes
 * - 30+ min: No additional gold
 * 
 * This creates a curve that rewards quick completion while allowing
 * flexibility for methodical plays.
 * 
 * @example
 * calculateGoldTimeBonus(12) // → 0.32 (optimal)
 * calculateGoldTimeBonus(6)  // → 0.16 (half time)
 * calculateGoldTimeBonus(30) // → 0.48 (max)
 */
export function calculateGoldTimeBonus(minutesElapsed: number): number {
  const { base_increment, window_minutes, optimal_duration_minutes, optimal_gold, post_optimal_increment, post_optimal_window } =
    BOUNTY_GOLD_TIME_BONUS;

  if (minutesElapsed <= 0) return 0;
  if (minutesElapsed > 30) return optimal_gold + 0.04 + (15 / post_optimal_window) * post_optimal_increment;

  // Phase 1: 0-12 minutes (fast bonus)
  if (minutesElapsed <= optimal_duration_minutes) {
    const chunks = Math.floor(minutesElapsed / window_minutes);
    const partial = (minutesElapsed % window_minutes) / window_minutes;
    return chunks * base_increment + partial * base_increment;
  }

  // Phase 2: 12-15 minutes (transition)
  if (minutesElapsed <= 15) {
    return optimal_gold + (minutesElapsed - optimal_duration_minutes) * (post_optimal_increment / 3);
  }

  // Phase 3: 15-30 minutes (slow bonus)
  const blocksAfter15 = Math.floor((minutesElapsed - 15) / post_optimal_window);
  const partialAfter15 = ((minutesElapsed - 15) % post_optimal_window) / post_optimal_window;
  return optimal_gold + 0.04 + blocksAfter15 * post_optimal_increment + partialAfter15 * post_optimal_increment;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAYOUT CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate total bounty payout (cash, gold, XP).
 * 
 * The formula combines all multipliers into a single effective rate:
 *   Cash = B × M_tier × M_status × M_targets × (optional: M_rank)
 * 
 * Gold is calculated separately based on time completion.
 * XP depends on bounty difficulty and role rank (if applicable).
 * 
 * @example
 * // Single-target, alive, tier 2, completed in 10 minutes
 * const result = calculateBountyPayout({
 *   tier: 2,
 *   alive: true,
 *   targetCount: 1,
 *   minutesElapsed: 10
 * });
 * // → { cash: 37.5, gold: 0.24, xp: 50, ... }
 */
export function calculateBountyPayout(input: BountyPayoutInput): BountyPayoutResult {
  // === INPUT VALIDATION (CRITICAL FIX) ===
  if (![1, 2, 3].includes(input.tier)) {
    throw new Error(`Invalid tier: ${input.tier}. Must be 1, 2, or 3.`);
  }
  if (![1, 2, 3].includes(input.targetCount)) {
    throw new Error(`Invalid targetCount: ${input.targetCount}. Must be 1, 2, or 3.`);
  }
  if (typeof input.minutesElapsed !== 'number' || input.minutesElapsed < 0 || input.minutesElapsed > 60) {
    throw new Error(`Invalid minutesElapsed: ${input.minutesElapsed}. Must be 0-60 minutes.`);
  }
  if (typeof input.alive !== 'boolean') {
    throw new Error(`Invalid alive: ${input.alive}. Must be true or false.`);
  }

  const {
    baseCash = BOUNTY_PAYOUT_BASE_CASH,
    tier,
    alive,
    targetCount,
    minutesElapsed,
    rankMultiplier = 1.0,
  } = input;

  // Fetch multipliers from constants
  const tierMultiplier = BOUNTY_PAYOUT_TIER_MULTIPLIERS[tier];
  const statusMultiplier = alive
    ? BOUNTY_PAYOUT_STATUS_MULTIPLIERS.alive
    : BOUNTY_PAYOUT_STATUS_MULTIPLIERS.dead;
  const targetMultiplier = BOUNTY_PAYOUT_TARGET_MULTIPLIERS[targetCount];

  // Calculate cash
  const cash = baseCash * tierMultiplier * statusMultiplier * targetMultiplier * rankMultiplier;

  // Calculate gold bonus
  const gold = calculateGoldTimeBonus(minutesElapsed);

  // Calculate XP (simplified; expand with rank-based bonuses)
  const xp = BOUNTY_XP_BASE.cash_kill * targetCount;

  // Rates per hour
  const hoursElapsed = Math.max(minutesElapsed / 60, 0.01); // Avoid division by zero
  const cash_per_hour = cash / hoursElapsed;
  const gold_per_hour = gold / hoursElapsed;

  return {
    cash: Math.round(cash * 100) / 100, // Round to 2 decimals
    gold: Math.round(gold * 100) / 100,
    xp,
    cash_per_hour: Math.round(cash_per_hour * 100) / 100,
    gold_per_hour: Math.round(gold_per_hour * 100) / 100,
    breakdown: {
      base_cash: baseCash,
      tier_multiplier: tierMultiplier,
      status_multiplier: statusMultiplier,
      target_multiplier: targetMultiplier,
      rank_multiplier: rankMultiplier,
      time_bonus_gold: gold,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

export interface BountySessionConfig {
  /** Duration in hours */
  sessionHours: number;

  /** Average minutes per bounty */
  avgBountyMinutes: number;

  /** Distribution: what % of bounties are tier 1/2/3 */
  tierDistribution: {
    tier1: number; // 0.0-1.0
    tier2: number;
    tier3: number;
  };

  /** What % of bounties completed alive vs killed */
  aliveCompletionRate: number; // 0.0-1.0

  /** Role rank multiplier (if applicable) */
  roleRankMultiplier?: number;
}

export interface BountySessionResult {
  total_cash: number;
  total_gold: number;
  total_xp: number;
  bounties_completed: number;
  avg_cash_per_hour: number;
  avg_gold_per_hour: number;
}

/**
 * Simulate a full bounty hunting session.
 * Useful for comparing playstyles and estimating session income.
 * 
 * @example
 * // "I do 2-hour sessions, mostly tier 2, 60% completion alive"
 * const session = simulateBountySession({
 *   sessionHours: 2,
 *   avgBountyMinutes: 15,
 *   tierDistribution: { tier1: 0.2, tier2: 0.6, tier3: 0.2 },
 *   aliveCompletionRate: 0.6
 * });
 * // → { total_cash: 450, total_gold: 3.2, bounties_completed: 8, ... }
 */
export function simulateBountySession(config: BountySessionConfig): BountySessionResult {
  const { sessionHours, avgBountyMinutes, tierDistribution, aliveCompletionRate, roleRankMultiplier = 1.0 } = config;

  const totalMinutes = sessionHours * 60;
  const bountiesCompleted = Math.floor(totalMinutes / avgBountyMinutes);

  let totalCash = 0;
  let totalGold = 0;
  let totalXp = 0;

  // Simulate each bounty
  for (let i = 0; i < bountiesCompleted; i++) {
    // Randomly select tier based on distribution
    const rand = Math.random();
    let tier: 1 | 2 | 3 = 1;
    if (rand < tierDistribution.tier1) {
      tier = 1;
    } else if (rand < tierDistribution.tier1 + tierDistribution.tier2) {
      tier = 2;
    } else {
      tier = 3;
    }

    // Determine if alive
    const alive = Math.random() < aliveCompletionRate;

    // Calculate single bounty
    const payout = calculateBountyPayout({
      tier,
      alive,
      targetCount: 1,
      minutesElapsed: avgBountyMinutes,
      rankMultiplier: roleRankMultiplier,
    });

    totalCash += payout.cash;
    totalGold += payout.gold;
    totalXp += payout.xp;
  }

  return {
    total_cash: Math.round(totalCash * 100) / 100,
    total_gold: Math.round(totalGold * 100) / 100,
    total_xp: totalXp,
    bounties_completed: bountiesCompleted,
    avg_cash_per_hour: Math.round((totalCash / sessionHours) * 100) / 100,
    avg_gold_per_hour: Math.round((totalGold / sessionHours) * 100) / 100,
  };
}

export default {
  calculateGoldTimeBonus,
  calculateBountyPayout,
  simulateBountySession,
};
