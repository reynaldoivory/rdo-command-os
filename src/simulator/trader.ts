/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRADER CALCULATOR - Pure Economic Functions
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implements the Trader role income formulas:
 * 1. Hunt materials → materials (loot)
 * 2. Accumulate materials → goods (Cripps conversion)
 * 3. Sell goods to buyers → cash (with time/distance bonuses)
 * 
 * Pure functions for transparent economics modeling.
 */

import {
  TRADER_MATERIAL_PAYOUTS,
  TRADER_GOODS_CONVERSION,
  TRADER_WAGON_CAPACITY,
  TRADER_SESSION_EFFICIENCY,
} from '../domain/gameData.constants';

// ═══════════════════════════════════════════════════════════════════════════
// INPUT & OUTPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TraderDeliveryInput {
  /** Amount of goods (0-100 for large wagon) */
  goodsCount: number;

  /** Wagon size: 'small' (50) or 'large' (100) */
  wagonSize: 'small' | 'large';

  /** Minutes taken to deliver goods */
  deliveryTimeMinutes: number;

  /** Approximate distance to buyer (short/medium/long) */
  deliveryDistance: 'short' | 'medium' | 'long';

  /** If true, buyer is far away (rare long-distance bonus) */
  isLongDistance?: boolean;
}

export interface TraderDeliveryResult {
  /** Base payout before bonuses */
  base_cash: number;

  /** Time bonus (delivered within optimal window) */
  time_bonus: number;

  /** Distance bonus (longer trips pay more) */
  distance_bonus: number;

  /** Total cash received */
  total_cash: number;

  /** Effective cash per minute */
  cash_per_minute: number;

  /** Breakdown for transparency */
  breakdown?: {
    goods_count: number;
    base_per_100: number;
    time_bonus_percent: number;
    distance_bonus_percent: number;
  };
}

export interface TraderSessionInput {
  /** Session duration in hours */
  sessionHours: number;

  /** Wagon size: 'small' (50) or 'large' (100) */
  wagonSize: 'small' | 'large';

  /** Number of delivery runs per hour */
  runsPerHour: number;

  /** Typical delivery time (minutes) */
  avgDeliveryMinutes: number;

  /** Average delivery distance */
  avgDeliveryDistance: 'short' | 'medium' | 'long';

  /** How full wagon is per run (0.0-1.0) */
  wagonFillFactor: number;

  /** Cripps conversion efficiency (0.8 = 80% of hunted materials become goods) */
  conversionEfficiency?: number;
}

export interface TraderSessionResult {
  total_cash: number;
  total_goods_delivered: number;
  delivery_runs: number;
  avg_cash_per_run: number;
  avg_cash_per_hour: number;
  materials_needed_to_hunt: number;
  estimated_hunting_time_hours: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME BONUS CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates time bonus multiplier for trader delivery.
 * 
 * Optimal window: 0-30 minutes → 1.0x (full payout)
 * Beyond 30 minutes: No additional penalty, but bonus opportunity missed
 * 
 * This incentivizes quick, consistent deliveries but allows flexibility.
 * 
 * @example
 * getTimeBonus(10)  // → 1.0 (optimal)
 * getTimeBonus(30)  // → 1.0 (still in window)
 * getTimeBonus(45)  // → 1.0 (no penalty, just no bonus)
 */
export function getTimeBonus(deliveryTimeMinutes: number): number {
  if (deliveryTimeMinutes <= 30) {
    return 1.0;
  }
  // For times beyond 30 min, there's no additional penalty in the base formula
  // but the reward $75 bonus is lost
  return 1.0;
}

/**
 * Calculates distance bonus multiplier.
 * 
 * Short distance: No inherent bonus (safe, nearby)
 * Medium distance: Typical delivery (expected baseline)
 * Long distance: Premium pay (risk/reward for distant buyers)
 * 
 * Note: This is simplified from actual RDO mechanics.
 * Real game also considers buyer faction and supply level.
 */
export function getDistanceBonus(deliveryDistance: 'short' | 'medium' | 'long'): number {
  switch (deliveryDistance) {
    case 'short':
      return 1.0;
    case 'medium':
      return 1.0; // Baseline
    case 'long':
      return 1.15; // 15% premium
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// DELIVERY PAYOUT CALCULATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate cash payout for a single trader goods delivery.
 * 
 * Base formula:
 *   CashBase = (goods / 100) × $625
 *   CashTotal = CashBase × DistanceMultiplier
 * 
 * Bonuses (capped at $75 + $50 = $125):
 *   - Time bonus: $75 if delivered within 30 minutes
 *   - Distance bonus: $50 if delivery is far (rare)
 * 
 * @example
 * // Deliver 100 goods (large wagon full), 20 min, medium distance
 * const result = calculateTraderDelivery({
 *   goodsCount: 100,
 *   wagonSize: 'large',
 *   deliveryTimeMinutes: 20,
 *   deliveryDistance: 'medium'
 * });
 * // → { base_cash: 625, time_bonus: 75, distance_bonus: 0, total_cash: 700 }
 */
export function calculateTraderDelivery(input: TraderDeliveryInput): TraderDeliveryResult {
  // === INPUT VALIDATION (CRITICAL FIX) ===
  if (typeof input.goodsCount !== 'number' || input.goodsCount < 0 || input.goodsCount > 100) {
    throw new Error(`Invalid goodsCount: ${input.goodsCount}. Must be 0-100.`);
  }
  if (!['small', 'large'].includes(input.wagonSize)) {
    throw new Error(`Invalid wagonSize: ${input.wagonSize}. Must be 'small' or 'large'.`);
  }
  if (typeof input.deliveryTimeMinutes !== 'number' || input.deliveryTimeMinutes < 0 || input.deliveryTimeMinutes > 60) {
    throw new Error(`Invalid deliveryTimeMinutes: ${input.deliveryTimeMinutes}. Must be 0-60.`);
  }
  if (!['short', 'medium', 'long'].includes(input.deliveryDistance)) {
    throw new Error(`Invalid deliveryDistance: ${input.deliveryDistance}. Must be 'short', 'medium', or 'long'.`);
  }

  const { goodsCount, wagonSize, deliveryTimeMinutes, deliveryDistance, isLongDistance } = input;

  const { base_payout_per_100_goods, max_time_bonus, max_distance_bonus } = TRADER_GOODS_CONVERSION;

  // Validate input
  const wagonCap = TRADER_WAGON_CAPACITY[wagonSize];
  const actualGoods = Math.min(goodsCount, wagonCap);

  // Base payout
  const base_cash = (actualGoods / 100) * base_payout_per_100_goods;

  // Time bonus (if delivered within 30 minutes)
  const time_bonus = deliveryTimeMinutes <= 30 ? max_time_bonus : 0;

  // Distance bonus (if delivery is far or flagged as long-distance)
  const distance_bonus = isLongDistance ? max_distance_bonus : 0;

  // Total payout
  const total_cash = base_cash + time_bonus + distance_bonus;

  // Effective rate
  const cash_per_minute = deliveryTimeMinutes > 0 ? total_cash / deliveryTimeMinutes : total_cash;

  return {
    base_cash: Math.round(base_cash * 100) / 100,
    time_bonus,
    distance_bonus,
    total_cash: Math.round(total_cash * 100) / 100,
    cash_per_minute: Math.round(cash_per_minute * 100) / 100,
    breakdown: {
      goods_count: actualGoods,
      base_per_100: base_payout_per_100_goods,
      time_bonus_percent: deliveryTimeMinutes <= 30 ? 100 : 0,
      distance_bonus_percent: isLongDistance ? 100 : 0,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION SIMULATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulate a full trader session including hunting, goods accumulation, delivery.
 * 
 * Flow:
 * 1. Hunt for X hours → accumulate materials (efficiency-based)
 * 2. Cripps converts materials → goods (1:1 ratio, simplified)
 * 3. Deliver goods → receive cash + bonuses
 * 
 * @example
 * // "I'll hunt for 2 hours then do a delivery run"
 * const session = simulateTraderSession({
 *   sessionHours: 2,
 *   wagonSize: 'large',
 *   runsPerHour: 1,  // One delivery after every hour
 *   avgDeliveryMinutes: 25,
 *   avgDeliveryDistance: 'medium',
 *   wagonFillFactor: 0.9  // 90 goods out of 100
 * });
 * // → { total_cash: 1350, total_goods_delivered: 180, avg_cash_per_hour: 675, ... }
 */
export function simulateTraderSession(input: TraderSessionInput): TraderSessionResult {
  const {
    sessionHours,
    wagonSize,
    runsPerHour,
    avgDeliveryMinutes,
    avgDeliveryDistance,
    wagonFillFactor = 0.9,
    conversionEfficiency = 0.85,
  } = input;

  const wagonCap = TRADER_WAGON_CAPACITY[wagonSize];
  const avgGoodsPerRun = Math.floor(wagonCap * wagonFillFactor);

  // Calculate number of delivery runs
  const deliveryRuns = Math.floor(sessionHours * runsPerHour);

  // Calculate total goods delivered
  const totalGoodsDelivered = avgGoodsPerRun * deliveryRuns;

  // Calculate cash from deliveries
  let totalCash = 0;
  for (let i = 0; i < deliveryRuns; i++) {
    const payout = calculateTraderDelivery({
      goodsCount: avgGoodsPerRun,
      wagonSize,
      deliveryTimeMinutes: avgDeliveryMinutes,
      deliveryDistance: avgDeliveryDistance,
    });
    totalCash += payout.total_cash;
  }

  // Estimate hunting time needed
  // Goods = Materials × conversionEfficiency
  // Materials needed = Goods / conversionEfficiency
  // Hunting rate = avgSessionEfficiency materials per hour
  const materialsNeeded = Math.ceil(totalGoodsDelivered / conversionEfficiency);
  const { avg_materials_per_hour } = TRADER_SESSION_EFFICIENCY;
  const estimatedHuntingTimeHours = materialsNeeded / avg_materials_per_hour;

  return {
    total_cash: Math.round(totalCash * 100) / 100,
    total_goods_delivered: totalGoodsDelivered,
    delivery_runs: deliveryRuns,
    avg_cash_per_run: Math.round((totalCash / deliveryRuns) * 100) / 100,
    avg_cash_per_hour: Math.round((totalCash / sessionHours) * 100) / 100,
    materials_needed_to_hunt: materialsNeeded,
    estimated_hunting_time_hours: Math.round(estimatedHuntingTimeHours * 10) / 10,
  };
}

export default {
  getTimeBonus,
  getDistanceBonus,
  calculateTraderDelivery,
  simulateTraderSession,
};
