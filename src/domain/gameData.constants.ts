/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GAME DATA CONSTANTS - Extracted Static Values
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Hardcoded values derived from Frontier Algorithm and verified sources.
 * These form the "foundation layer" of economic calculations.
 * 
 * Each constant includes:
 * - The value
 * - A comment with source/date
 * - Usage context (which calculators use it)
 */

// ═══════════════════════════════════════════════════════════════════════════
// ROLE UNLOCK COSTS
// ═══════════════════════════════════════════════════════════════════════════

export const ROLE_UNLOCK_COSTS = {
  trader: {
    gold: 15.0,           // Verified: GAME_TEST 2025-11-20
    player_rank_required: 5,
  },
  moonshiner: {
    gold: 25.0,           // Verified: GAME_TEST 2025-11-20
    player_rank_required: 5,
  },
  bounty_hunter: {
    gold: 15.0,           // Verified: GAME_TEST 2025-11-20
    player_rank_required: 5,
  },
  collector: {
    gold: 15.0,           // Verified: WIKI 2025-11-15
    player_rank_required: 5,
  },
  naturalist: {
    gold: 25.0,           // Verified: GAME_TEST 2025-11-18
    player_rank_required: 5,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BOUNTY HUNTER - Payout Structure
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base cash payout for single-target bounties.
 * Source: FRONTIER_ALGORITHM + GAME_TEST verification
 * Used by: calculateBountyPayout()
 */
export const BOUNTY_PAYOUT_BASE_CASH = 30;

/**
 * Tier multipliers for bounty difficulty.
 * $    = 1 star   = 1.0x
 * $$   = 2 stars  = 1.25x
 * $$$ = 3 stars  = 1.5x
 * Source: FRONTIER_ALGORITHM verified 2025-11-10
 */
export const BOUNTY_PAYOUT_TIER_MULTIPLIERS = {
  1: 1.0,
  2: 1.25,
  3: 1.5,
} as const;

/**
 * Status multiplier: alive vs dead target
 * Alive bonus = 1.0x
 * Dead penalty = 0.5x
 * Source: FRONTIER_ALGORITHM verified 2025-11-10
 */
export const BOUNTY_PAYOUT_STATUS_MULTIPLIERS = {
  alive: 1.0,
  dead: 0.5,
} as const;

/**
 * Target count multipliers (multi-target bounties)
 * 1 target = 1.0x
 * 2 targets = 5/3 ≈ 1.667x
 * 3 targets = 2.0x (capped at 3 max)
 * Source: FRONTIER_ALGORITHM 2025-11-05
 */
export const BOUNTY_PAYOUT_TARGET_MULTIPLIERS = {
  1: 1.0,
  2: 5 / 3,  // 1.667
  3: 2.0,
} as const;

/**
 * Gold step function for time bonus.
 * Grants 0.08 gold per 3 minutes (0-12 min window = up to 0.32 gold)
 * Then diminishing returns:
 *   12-15 min: 0.04 gold
 *   15-30 min: 0.04 per 5 min increments
 * Source: FRONTIER_ALGORITHM 2025-11-01 (matches in-game observations)
 */
export const BOUNTY_GOLD_TIME_BONUS = {
  base_increment: 0.08,        // per 3 minutes
  window_minutes: 3,
  optimal_duration_minutes: 12,
  optimal_gold: 0.32,
  post_optimal_increment: 0.04,
  post_optimal_window: 5,
} as const;

/**
 * XP base values for bounties.
 * Exact multipliers pending verification.
 */
export const BOUNTY_XP_BASE = {
  cash_kill: 50,               // XP for cash-based kill
  ranked_kill: 100,            // XP for ranked bounties
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRADER - Material → Goods → Payout
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Material payout values (sold to general store, not through Cripps).
 * Source: GAME_TEST 2025-11-15
 */
export const TRADER_MATERIAL_PAYOUTS = {
  deer_pelt_perfect: 4.5,
  cougar_pelt_perfect: 12.5,
  wolf_pelt_perfect: 8.0,
  alligator_skin_perfect: 10.0,
  panther_pelt_perfect: 25.0,
} as const;

/**
 * Goods value per unit delivered to buyers.
 * 100 goods = $625 + time bonus (up to $75)
 * Source: FRONTIER_ALGORITHM verified 2025-11-08
 */
export const TRADER_GOODS_CONVERSION = {
  goods_per_unit_sold: 1,
  base_payout_per_100_goods: 625,  // Without time bonus
  max_time_bonus: 75,               // If delivered within 30 min
  max_distance_bonus: 50,           // If destination is far (rare)
} as const;

/**
 * Wagon size → goods capacity
 */
export const TRADER_WAGON_CAPACITY = {
  small: 50,
  large: 100,
} as const;

/**
 * Material gathering efficiency (typical sessions).
 * Assumes optimal hunt + material yield + no waste.
 */
export const TRADER_SESSION_EFFICIENCY = {
  avg_materials_per_hour: 30,  // Typically 3-5 kills per bounty loop
  materials_to_goods_ratio: 1, // 1 material = 1 goods (simplified)
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MOONSHINER - Batch Profit Matrix
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base batch profit by mash type (before time, distance, mood multipliers).
 * Source: FRONTIER_ALGORITHM 2025-10-28
 */
export const MOONSHINER_BASE_BATCH_PROFIT = {
  corn: 48.75,
  rye: 52.50,
  wheat: 56.25,
  sugar: 60.00,
  agave: 65.00,
} as const;

/**
 * Time bonus structure for selling batches.
 * Optimal window: 2-4 hours of aging → 1.25x multiplier
 * Beyond 4 hours: 1.0x (no additional bonus, but less flavor penalty)
 */
export const MOONSHINER_TIME_BONUS = {
  min_age_hours: 2,
  max_age_hours: 4,
  optimal_multiplier: 1.25,
  beyond_optimal_multiplier: 1.0,
} as const;

/**
 * Distance bonus (delivery location).
 * Farther = more money (incentivizes risk/effort)
 */
export const MOONSHINER_DISTANCE_BONUS = {
  nearby: 1.0,      // Nearby safe buyer
  medium: 1.1,      // Further into wilderness
  far: 1.25,        // Rival gang territory or remote
} as const;

/**
 * Mood multipliers for shack ambiance/decor (future expansion).
 * Currently all batches assume neutral mood (1.0x).
 */
export const MOONSHINER_MOOD_MULTIPLIER = {
  poor: 0.8,
  neutral: 1.0,
  good: 1.1,
  excellent: 1.2,
} as const;

/**
 * Shack upgrade levels and their profit multipliers.
 */
export const MOONSHINER_SHACK_LEVELS = {
  1: { cost: 0, profit_multiplier: 1.0 },
  2: { cost: 50, profit_multiplier: 1.05 },
  3: { cost: 100, profit_multiplier: 1.1 },
  4: { cost: 100, profit_multiplier: 1.15 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTOR - Item Economics
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base payout per collector item (varies by set + cycle).
 * Average across all sets: ~$2-3 per item
 * Complete set bonus: $10-20 depending on set
 * Source: JEANROPKE_MAP + GAME_TEST 2025-11-12
 */
export const COLLECTOR_PAYOUT_BY_SET = {
  tarot_cards: {
    per_card: 2.5,
    complete_set_bonus: 15.0,
    total_per_cycle: 22.5 + 15,  // 10 cards
  },
  coins: {
    per_coin: 3.0,
    complete_set_bonus: 20.0,
    total_per_cycle: 42 + 20,     // 14 coins
  },
  flowers: {
    per_flower: 3.5,
    complete_set_bonus: 20.0,
    total_per_cycle: 35 + 20,     // 10 flowers
  },
  lost_gang_hideout_items: {
    per_item: 4.0,
    complete_set_bonus: 25.0,
    total_per_cycle: 24 + 25,     // 6 items
  },
} as const;

/**
 * Average collection time per item (including travel).
 * Varies by set difficulty and region spread.
 */
export const COLLECTOR_TIME_PER_ITEM_MINUTES = {
  tarot_cards: 3,       // Relatively compact spawn area
  coins: 5,             // Spread across map
  flowers: 4,           // Moderate spread
  lost_gang_hideout_items: 6,  // Most spread out
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// NATURALIST - Study Payouts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cash + RDO$ per animal studied to Harriet Davenport.
 * Source: GAME_TEST 2025-11-18
 */
export const NATURALIST_STUDY_PAYOUT = {
  small_animal: { cash: 4.5, gold: 0.02 },
  large_animal: { cash: 8.0, gold: 0.04 },
  legendary_animal: { cash: 25.0, gold: 0.10 },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// FAST TRAVEL - Cost Structure
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base fast travel costs (camp → destination).
 * Note: Some routes are asymmetric (e.g., Saint Denis → Strawberry differs from reverse).
 * Source: GAME_TEST + WIKI 2025-11-10
 */
export const FAST_TRAVEL_BASE_COSTS = {
  short_distance: 3.75,   // <10 miles
  medium_distance: 5.0,   // 10-25 miles
  long_distance: 7.5,     // 25+ miles
} as const;

/**
 * Special fast travel cost tiers (main towns).
 */
export const FAST_TRAVEL_FIXED_COSTS = {
  valentine: 5.0,
  saint_denis: 5.0,
  strawberry: 3.75,
  emerald_station: 3.75,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// PLAYER PROGRESSION - Rank XP Curve
// ═══════════════════════════════════════════════════════════════════════════

/**
 * XP required per rank level (simplified cubic curve).
 * Pending detailed verification from GAME_TEST.
 * Current values are placeholder based on typical RPG patterns.
 */
export const RANK_XP_CURVE = {
  base_multiplier: 100,
  curve_exponent: 1.3,  // Cubic-ish growth

  // Precomputed for ranks 1-500 (simplified lookup)
  // In production, use: XP_for_rank = base * (rank ^ exponent)
} as const;

/**
 * Ability card unlock schedule.
 * Pending detailed mapping from in-game testing.
 */
export const ABILITY_CARD_UNLOCK_RANKS = {
  // Placeholder; fill in after testing
  Dead_Eye_Basics: 3,
  Gunslinger_Techniques: 10,
  // ... (add others)
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTION CYCLES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Collector set definitions + cycle counts.
 * Each set has 1-3 cycles; items rotate per cycle.
 * Source: JEANROPKE_MAP + COMMUNITY_TESTED 2025-11-15
 */
export const COLLECTION_SETS = {
  tarot_cards: {
    item_count: 10,
    cycle_count: 3,
    bonus_cash_per_set: 15.0,
  },
  coins: {
    item_count: 14,
    cycle_count: 3,
    bonus_cash_per_set: 20.0,
  },
  flowers: {
    item_count: 10,
    cycle_count: 3,
    bonus_cash_per_set: 20.0,
  },
  lost_gang_hideout_items: {
    item_count: 6,
    cycle_count: 1,         // Single cycle
    bonus_cash_per_set: 25.0,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATION DEFAULTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default player state for simulations (e.g., "beginner" profile).
 * Used when user hasn't logged in or wants a fresh sandbox.
 */
export const DEFAULT_PLAYER_PROFILE = {
  rank: 10,
  cash: 250,
  gold_bars: 5,
  roles_owned: [],
  trader_rank: 0,
  moonshiner_rank: 0,
  bounty_hunter_rank: 0,
  collector_rank: 0,
  naturalist_rank: 0,
} as const;

/**
 * Intermediate player profile (mid-game, all roles unlocked).
 */
export const INTERMEDIATE_PLAYER_PROFILE = {
  rank: 75,
  cash: 5000,
  gold_bars: 50,
  roles_owned: ['trader', 'moonshiner', 'bounty_hunter', 'collector', 'naturalist'],
  trader_rank: 10,
  moonshiner_rank: 10,
  bounty_hunter_rank: 10,
  collector_rank: 5,
  naturalist_rank: 5,
} as const;

/**
 * Advanced player profile (endgame, optimized).
 */
export const ADVANCED_PLAYER_PROFILE = {
  rank: 500,
  cash: 100000,
  gold_bars: 500,
  roles_owned: ['trader', 'moonshiner', 'bounty_hunter', 'collector', 'naturalist'],
  trader_rank: 20,
  moonshiner_rank: 20,
  bounty_hunter_rank: 20,
  collector_rank: 20,
  naturalist_rank: 20,
} as const;

export default {
  ROLE_UNLOCK_COSTS,
  BOUNTY_PAYOUT_BASE_CASH,
  BOUNTY_PAYOUT_TIER_MULTIPLIERS,
  BOUNTY_PAYOUT_STATUS_MULTIPLIERS,
  BOUNTY_PAYOUT_TARGET_MULTIPLIERS,
  BOUNTY_GOLD_TIME_BONUS,
  TRADER_MATERIAL_PAYOUTS,
  TRADER_GOODS_CONVERSION,
  TRADER_WAGON_CAPACITY,
  MOONSHINER_BASE_BATCH_PROFIT,
  MOONSHINER_TIME_BONUS,
  COLLECTOR_PAYOUT_BY_SET,
  COLLECTION_SETS,
  FAST_TRAVEL_BASE_COSTS,
  DEFAULT_PLAYER_PROFILE,
  INTERMEDIATE_PLAYER_PROFILE,
  ADVANCED_PLAYER_PROFILE,
};
