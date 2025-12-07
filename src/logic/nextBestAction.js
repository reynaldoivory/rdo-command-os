// FILE: src/logic/nextBestAction.js
// ═══════════════════════════════════════════════════════════════════════════
// NEXT BEST ACTION ENGINE
// Pure logic module using Rule Registry pattern
// Consumes selectors for state access, returns prioritized actions
// ═══════════════════════════════════════════════════════════════════════════

import { PHASES, THRESHOLDS, PRIORITIES, VECTORS } from './decisionRules';
import * as sel from './selectors';

// ═══════════════════════════════════════════════════════════════════════════
// RULE REGISTRY - Ordered by precedence (first match wins)
// Each rule: { id, predicate(profile, wagon), build(profile, wagon) }
// ═══════════════════════════════════════════════════════════════════════════

const RULES = [
    // ─────────────────────────────────────────────────────────────────────────
    // RULE 1: TRADER WAGON FULL → CRITICAL SALE
    // Money sitting on the table, always top priority
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'trader_sale',
        predicate: (p, w) => sel.hasTrader(p) && sel.isWagonFull(p, w),
        explain: (p, w) => {
            const hasTrader = sel.hasTrader(p);
            const wagonLoad = sel.getWagonLoad(p, w);
            const isFull = sel.isWagonFull(p, w);
            if (!hasTrader) return `hasTrader: false (trader XP: ${sel.getTraderLevel(p)})`;
            if (!isFull) return `wagonLoad: ${wagonLoad}% < WAGON_FULL(${THRESHOLDS.WAGON_FULL}%)`;
            return 'MATCHED: hasTrader && wagonFull';
        },
        build: (p) => {
            const gold = sel.getGold(p);
            const isGoldCritical = sel.isGoldCritical(p);

            return {
                priority: PRIORITIES.CRITICAL.level,
                primary: {
                    icon: VECTORS.TRADER_SALE.icon,
                    text: 'Trader Wagon at Capacity. Execute Delivery.',
                    subtext: 'High risk of raid. Recruit posse if possible.',
                    impact: '+$625.00'
                },
                secondary: isGoldCritical
                    ? { text: `Gold Critical (${gold.toFixed(1)}). Switch to Bounties after sale.` }
                    : { text: 'Restock materials immediately to maintain uptime.' },
                constraints: isGoldCritical ? ['HOLD GOLD'] : []
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 2: GOLD CRITICAL → FORCE BOUNTIES
    // Can't progress without gold, override other priorities
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'gold_critical',
        predicate: (p) => sel.isGoldCritical(p),
        explain: (p) => {
            const gold = sel.getGold(p);
            const threshold = THRESHOLDS.GOLD_CRITICAL;
            if (gold >= threshold) return `gold: ${gold.toFixed(1)} >= GOLD_CRITICAL(${threshold})`;
            return `MATCHED: gold ${gold.toFixed(1)} < ${threshold}`;
        },
        build: (p) => ({
            priority: PRIORITIES.HIGH.level,
            primary: {
                icon: VECTORS.BOUNTY_HUNTER.icon,
                text: `Gold Reserves Critical (${sel.getGold(p).toFixed(1)}). Run Bounties.`,
                subtext: 'Do not buy cosmetics. Save for next Role.',
                impact: '+0.32 GB / 12m'
            },
            secondary: { text: 'Complete Daily Challenges to rebuild streak multiplier.' },
            constraints: ['NO COSMETICS', 'HOLD GOLD']
        })
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 3: TRADER MATERIALS EMPTY → RESUPPLY
    // Cripps has halted production
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'trader_resupply',
        predicate: (p, w) => sel.hasTrader(p) && sel.isWagonEmpty(p, w),
        explain: (p, w) => {
            const hasTrader = sel.hasTrader(p);
            const wagonLoad = sel.getWagonLoad(p, w);
            const isEmpty = sel.isWagonEmpty(p, w);
            if (!hasTrader) return `hasTrader: false`;
            if (!isEmpty) return `wagonLoad: ${wagonLoad}% >= WAGON_EMPTY(${THRESHOLDS.WAGON_EMPTY}%)`;
            return `MATCHED: hasTrader && wagonEmpty (${wagonLoad}%)`;
        },
        build: () => ({
            priority: PRIORITIES.HIGH.level,
            primary: {
                icon: VECTORS.TRADER_RESUPPLY.icon,
                text: 'Materials Critical. Hunt 2x Cougars or 3x Bucks.',
                subtext: 'Cripps has halted production.',
                impact: 'RESTART ENGINE'
            },
            secondary: { text: 'Check "Hunting Terminal" for nearest high-value spawns.' },
            constraints: []
        })
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 4: TRADER NEAR FULL → PREPARE SALE
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'trader_near_full',
        predicate: (p, w) => sel.hasTrader(p) && sel.isWagonNearFull(p, w),
        explain: (p, w) => {
            const hasTrader = sel.hasTrader(p);
            const wagonLoad = sel.getWagonLoad(p, w);
            const isNearFull = sel.isWagonNearFull(p, w);
            if (!hasTrader) return `hasTrader: false`;
            if (!isNearFull) return `wagonLoad: ${wagonLoad}% < WAGON_NEAR_FULL(${THRESHOLDS.WAGON_NEAR_FULL}%)`;
            return `MATCHED: hasTrader && wagonNearFull (${wagonLoad}%)`;
        },
        build: (p, w) => {
            const load = sel.getWagonLoad(p, w);
            return {
                priority: PRIORITIES.HIGH.level,
                primary: {
                    icon: VECTORS.TRADER_SALE.icon,
                    text: `Wagon ${load}% Full. Prepare Delivery Route.`,
                    subtext: 'Production ongoing. Plan your next sale.',
                    impact: `~$${Math.floor(625 * (load / 100))}`
                },
                secondary: { text: 'Consider distant delivery for +50% bonus.' },
                constraints: []
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 5: CASH POOR (EARLY GAME) → COLLECTOR CYCLE
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'cash_farm',
        predicate: (p) => sel.isCashPoor(p) && sel.getRank(p) < PHASES.MID.range[0],
        explain: (p) => {
            const cash = sel.getCash(p);
            const rank = sel.getRank(p);
            const isCashPoor = sel.isCashPoor(p);
            const isEarlyGame = rank < PHASES.MID.range[0];
            if (!isCashPoor) return `cash: $${cash.toFixed(0)} >= CASH_POOR($${THRESHOLDS.CASH_POOR})`;
            if (!isEarlyGame) return `rank: ${rank} >= MID_GAME(${PHASES.MID.range[0]})`;
            return `MATCHED: cashPoor ($${cash.toFixed(0)}) && earlyGame (rank ${rank})`;
        },
        build: () => ({
            priority: PRIORITIES.MAINTAIN.level,
            primary: {
                icon: VECTORS.COLLECTOR_CYCLE.icon,
                text: 'Cash Reserves Low. Run Collector "Coin" Cycle.',
                subtext: 'Use the Jean Ropke map integration.',
                impact: 'LIQUIDITY'
            },
            secondary: null,
            constraints: []
        })
    },

    // ─────────────────────────────────────────────────────────────────────────
    // RULE 6: CASH POOR (MID/LATE) + COLLECTOR → COLLECTION SETS
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: 'collector_sets',
        predicate: (p) => sel.isCashPoor(p) && sel.hasCollector(p),
        explain: (p) => {
            const cash = sel.getCash(p);
            const hasCollector = sel.hasCollector(p);
            const isCashPoor = sel.isCashPoor(p);
            if (!isCashPoor) return `cash: $${cash.toFixed(0)} >= CASH_POOR($${THRESHOLDS.CASH_POOR})`;
            if (!hasCollector) return `hasCollector: false (collector XP: ${sel.getCollectorLevel(p)})`;
            return `MATCHED: cashPoor ($${cash.toFixed(0)}) && hasCollector`;
        },
        build: () => ({
            priority: PRIORITIES.MAINTAIN.level,
            primary: {
                icon: VECTORS.COLLECTOR_CYCLE.icon,
                text: 'Run Full Collector Route.',
                subtext: 'Complete sets for maximum payout.',
                impact: '$1000+'
            },
            secondary: { text: 'Coin and Jewelry sets have highest value.' },
            constraints: []
        })
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT FALLBACK ACTION
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_ACTION = {
    priority: PRIORITIES.MAINTAIN.level,
    primary: {
        icon: VECTORS.DAILIES.icon,
        text: 'Economy Stable. Complete Daily Challenges.',
        subtext: 'Maintain your streak for gold multiplier.',
        impact: 'STREAK'
    },
    secondary: null,
    constraints: []
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENGINE - Pure function
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analyze profile state and return best next action
 * @param {Object} profile - User profile with rank, cash, gold, roles
 * @param {Object} wagonState - Trader wagon state { load: 0-100 }
 * @returns {Object} { phase, priority, primaryAction, secondaryAction, constraints }
 */
export const analyzeProfile = (profile = {}, wagonState = { load: 0 }) => {
    // Normalize wagon input
    const normalizedWagon = {
        load: typeof wagonState.load === 'number'
            ? wagonState.load
            : sel.safeGetNumber(wagonState, 'fillPercent', 0)
    };

    const rank = sel.getRank(profile);

    // Determine phase from rank
    let phase = PHASES.EARLY;
    if (rank >= PHASES.MID.range[0] && rank < PHASES.LATE.range[0]) phase = PHASES.MID;
    if (rank >= PHASES.LATE.range[0]) phase = PHASES.LATE;

    // Find first matching rule
    const activeRule = RULES.find(r => r.predicate(profile, normalizedWagon));
    const result = activeRule
        ? activeRule.build(profile, normalizedWagon)
        : DEFAULT_ACTION;

    // Global constraint layer - safety net for gold
    const globalConstraints = new Set(result.constraints || []);
    if (!sel.isGoldSafe(profile)) {
        globalConstraints.add('HOLD GOLD');
    }

    return {
        phase,
        priority: result.priority,
        primaryAction: result.primary,
        secondaryAction: result.secondary,
        constraints: Array.from(globalConstraints)
    };
};

// ═══════════════════════════════════════════════════════════════════════════
// DIAGNOSTICS HELPER - Explains WHY a rule fired
// For senior dev debugging and optional UI "why" disclosure
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Explain analysis with full diagnostic trace
 * @param {Object} profile - User profile
 * @param {Object} wagonState - Wagon state { load: 0-100 }
 * @returns {Object} Full analysis + diagnostic metadata
 */
export const explainAnalysis = (profile = {}, wagonState = { load: 0 }) => {
    // Normalize wagon input
    const normalizedWagon = {
        load: typeof wagonState.load === 'number'
            ? wagonState.load
            : sel.safeGetNumber(wagonState, 'fillPercent', 0)
    };

    // Capture input snapshot for traceability
    const inputSnapshot = {
        rank: sel.getRank(profile),
        cash: sel.getCash(profile),
        gold: sel.getGold(profile),
        wagonLoad: normalizedWagon.load,
        hasTrader: sel.hasTrader(profile),
        hasBounty: sel.hasBounty(profile),
        hasCollector: sel.hasCollector(profile),
        isGoldCritical: sel.isGoldCritical(profile),
        isGoldSafe: sel.isGoldSafe(profile),
        isCashPoor: sel.isCashPoor(profile),
        isWagonFull: sel.isWagonFull(profile, normalizedWagon),
        isWagonEmpty: sel.isWagonEmpty(profile, normalizedWagon),
        isWagonNearFull: sel.isWagonNearFull(profile, normalizedWagon)
    };

    // Determine phase
    const rank = inputSnapshot.rank;
    let phase = PHASES.EARLY;
    if (rank >= PHASES.MID.range[0] && rank < PHASES.LATE.range[0]) phase = PHASES.MID;
    if (rank >= PHASES.LATE.range[0]) phase = PHASES.LATE;

    // Evaluate all rules and capture which fired + WHY
    const ruleEvaluations = RULES.map(rule => ({
        id: rule.id,
        matched: rule.predicate(profile, normalizedWagon),
        reason: rule.explain ? rule.explain(profile, normalizedWagon) : 'no explain function'
    }));

    // Find first matching rule
    const activeRule = RULES.find(r => r.predicate(profile, normalizedWagon));
    const ruleId = activeRule ? activeRule.id : 'default_dailies';
    const result = activeRule
        ? activeRule.build(profile, normalizedWagon)
        : DEFAULT_ACTION;

    // Global constraint layer
    const globalConstraints = new Set(result.constraints || []);
    if (!sel.isGoldSafe(profile)) {
        globalConstraints.add('HOLD GOLD');
    }

    // Build skipTrace - rules skipped before the active one
    const activeIndex = activeRule ? RULES.indexOf(activeRule) : RULES.length;
    const skipTrace = RULES.slice(0, activeIndex).map(r => ({
        id: r.id,
        reason: r.explain ? r.explain(profile, normalizedWagon) : 'skipped'
    }));

    return {
        // Standard analysis output
        phase,
        priority: result.priority,
        primaryAction: result.primary,
        secondaryAction: result.secondary,
        constraints: Array.from(globalConstraints),

        // Diagnostic metadata
        diagnostics: {
            ruleId,
            inputSnapshot,
            ruleEvaluations,
            skipTrace,
            timestamp: Date.now()
        }
    };
};
