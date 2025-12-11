// FILE: src/logic/decisionRules.js
// ═══════════════════════════════════════════════════════════════════════════
// DECISION RULES CONFIGURATION
// Single source of truth for all "magic numbers" and UX labels
// Logic and UI both read from this config for consistency
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PHASES - Character progression stages
 * Determines which vectors are available and what guidance is appropriate
 * Range values are [min, max) - inclusive min, exclusive max
 */
export const PHASES = {
    EARLY: {
        id: 'early',
        name: 'Survival & Acquisition',
        color: 'text-red-400',
        range: [0, 40],
        focus: 'CASH',
        description: 'Focus on unlocking roles and building capital'
    },
    MID: {
        id: 'mid',
        name: 'Mid-Game Consolidation',
        color: 'text-amber-400',
        range: [40, 90],
        focus: 'EFFICIENCY',
        description: 'Optimize role progression and efficiency'
    },
    LATE: {
        id: 'late',
        name: 'Endgame Optimization',
        color: 'text-green-400',
        range: [90, 999],
        focus: 'GOLD',
        description: 'Max efficiency farming and collection completion'
    }
};

/**
 * THRESHOLDS - Critical values that trigger actions
 * All monetary values in their respective currencies
 */
export const THRESHOLDS = {
    // Gold thresholds (Dev 1 values - more realistic for role purchases)
    GOLD_CRITICAL: 15,     // Below this: force gold farming
    GOLD_SAFE: 40,         // Above this: can spend freely

    // Cash thresholds
    CASH_POOR: 500,        // Below this: force cash farming
    CASH_COMFORTABLE: 2000, // Above this: can invest freely

    // Wagon thresholds (percentage)
    WAGON_FULL: 90,        // Sell immediately (90% buffer for raids)
    WAGON_NEAR_FULL: 75,   // Prepare for sale
    WAGON_EMPTY: 10        // Focus on materials
};

/**
 * PRIORITIES - Action urgency levels
 * Determines visual treatment and sort order
 * Includes level field for engine output and style for direct CSS mapping
 */
export const PRIORITIES = {
    CRITICAL: {
        level: 'critical',
        order: 0,
        badge: 'IMMEDIATE ACTION',
        style: 'bg-red-900/50 text-red-400 border-red-500'
    },
    HIGH: {
        level: 'high',
        order: 1,
        badge: 'RECOMMENDED',
        style: 'bg-amber-900/50 text-amber-400 border-amber-500'
    },
    MAINTAIN: {
        level: 'medium',
        order: 2,
        badge: 'OPPORTUNITY',
        style: 'bg-blue-900/50 text-blue-400 border-blue-500'
    },
    LOW: {
        level: 'low',
        order: 3,
        badge: 'OPTIONAL',
        style: 'bg-gray-900/50 text-gray-400 border-gray-500'
    }
};

/**
 * VECTORS - Action categories the engine can recommend
 * Each vector has associated icons and typical yields
 */
export const VECTORS = {
    TRADER_SALE: {
        id: 'trader_sale',
        icon: 'Truck',
        category: 'TRADER',
        baseYield: '$625',
        description: 'Sell full trader wagon'
    },
    TRADER_RESUPPLY: {
        id: 'trader_resupply',
        icon: 'Crosshair',
        category: 'TRADER',
        baseYield: null,
        description: 'Gather materials for Cripps'
    },
    BOUNTY_HUNTER: {
        id: 'bounty_hunter',
        icon: 'Star',
        category: 'BOUNTY',
        baseYield: '~0.32 GB',
        description: 'Run bounty for gold'
    },
    COLLECTOR_CYCLE: {
        id: 'collector_cycle',
        icon: 'Map',
        category: 'COLLECTOR',
        baseYield: '$1000+',
        description: 'Complete collection sets'
    },
    MOONSHINER: {
        id: 'moonshiner',
        icon: 'Flask',
        category: 'MOONSHINER',
        baseYield: '$247',
        description: 'Deliver moonshine batch'
    },
    FREE_ROAM: {
        id: 'free_roam',
        icon: 'Compass',
        category: 'FREE_ROAM',
        baseYield: 'Varies',
        description: 'Participate in Free Roam events'
    },
    DAILIES: {
        id: 'dailies',
        icon: 'Calendar',
        category: 'DAILIES',
        baseYield: '~0.2-0.5 GB',
        description: 'Complete daily challenges'
    },
    NATURALIST_UNLOCK: {
        id: 'naturalist_unlock',
        icon: 'Leaf',
        category: 'NATURALIST',
        baseYield: 'New Role',
        description: 'Purchase Naturalist Sample Kit'
    },
    NATURALIST_FARM: {
        id: 'naturalist_farm',
        icon: 'Leaf',
        category: 'NATURALIST',
        baseYield: 'Gold Farm',
        description: 'Farm gold to unlock Naturalist'
    }
};

/**
 * Helper to get phase from rank
 */
export const getPhaseFromRank = (rank) => {
    if (rank < PHASES.MID.range[0]) return PHASES.EARLY;
    if (rank < PHASES.LATE.range[0]) return PHASES.MID;
    return PHASES.LATE;
};
