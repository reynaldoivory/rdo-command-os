// FILE: src/data/mocks.js
// ═══════════════════════════════════════════════════════════════════════════
// MOCK ANALYSIS DATA
// Used for Storybook, testing, and UI development without live engine
// ═══════════════════════════════════════════════════════════════════════════

import { PHASES, VECTORS } from '../logic/decisionRules';

/**
 * CRITICAL state - Wagon full, needs immediate sale
 */
export const MOCK_ANALYSIS_CRITICAL = {
    phase: PHASES.MID_GAME,
    priority: 'critical',
    primaryAction: {
        ...VECTORS.TRADER_SALE,
        text: 'Sell Trader Wagon NOW',
        impact: '$625'
    },
    secondaryAction: {
        ...VECTORS.TRADER_RESUPPLY,
        text: 'Then: Hunt 3-star animals for Cripps'
    },
    constraints: ['LOW GOLD']
};

/**
 * HIGH priority state - Gold critical, needs bounties
 */
export const MOCK_ANALYSIS_HIGH = {
    phase: PHASES.EARLY_GAME,
    priority: 'high',
    primaryAction: {
        ...VECTORS.BOUNTY_HUNTER,
        text: 'Run Bounties for Gold',
        impact: '~0.32 GB/mission'
    },
    secondaryAction: {
        ...VECTORS.DAILIES,
        text: 'Complete dailies between bounties'
    },
    constraints: ['GOLD CRITICAL', 'LOW CASH']
};

/**
 * MEDIUM priority state - Normal farming
 */
export const MOCK_ANALYSIS_MIDGAME = {
    phase: PHASES.MID_GAME,
    priority: 'medium',
    primaryAction: {
        ...VECTORS.COLLECTOR_CYCLE,
        text: 'Run Collector Route',
        impact: '$1000+'
    },
    secondaryAction: {
        ...VECTORS.DAILIES,
        text: 'Keep daily streak alive'
    },
    constraints: []
};

/**
 * SAFE state - All good, just maintain
 */
export const MOCK_ANALYSIS_SAFE = {
    phase: PHASES.LATE_GAME,
    priority: 'low',
    primaryAction: {
        ...VECTORS.DAILIES,
        text: 'Maintain Daily Streak',
        impact: '~0.2-0.5 GB'
    },
    secondaryAction: {
        ...VECTORS.FREE_ROAM,
        text: 'Join Free Roam events for fun'
    },
    constraints: []
};

/**
 * Mock profiles for testing the engine
 */
export const MOCK_PROFILES = {
    // New player - no roles, low everything
    NEW_PLAYER: {
        rank: 5,
        xp: 2000,
        cash: 50,
        gold: 2,
        roles: {}
    },

    // Early trader - just unlocked trader
    EARLY_TRADER: {
        rank: 15,
        xp: 15000,
        cash: 200,
        gold: 8,
        roles: { trader: 500 }
    },

    // Mid-game player - multiple roles
    MID_GAME: {
        rank: 47,
        xp: 136800,
        cash: 1444,
        gold: 9.5,
        roles: {
            bountyHunter: 5000,
            trader: 12000,
            collector: 8000,
            moonshiner: 3000
        }
    },

    // End-game player - maxed out
    END_GAME: {
        rank: 150,
        xp: 500000,
        cash: 25000,
        gold: 200,
        roles: {
            bountyHunter: 50000,
            trader: 50000,
            collector: 50000,
            moonshiner: 50000,
            naturalist: 50000
        }
    }
};
