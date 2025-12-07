// FILE: src/logic/selectors.js
// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS - Pure state accessors for the Profile object
// Single source of truth for reading game state values
// All modules (nextBestAction, EfficiencyEngine, etc.) should use these
// ═══════════════════════════════════════════════════════════════════════════

import { THRESHOLDS } from './decisionRules';

/**
 * Safe getter for nested object paths
 * Handles null, undefined, and type coercion gracefully
 * @param {Object} obj - Source object
 * @param {string} path - Dot-notation path (e.g., 'roles.trader')
 * @param {number} fallback - Default value if path not found or NaN
 */
export const safeGetNumber = (obj, path, fallback = 0) => {
    const val = path
        .split('.')
        .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    const num = typeof val === 'number' ? val : parseFloat(val);
    return Number.isFinite(num) ? num : fallback;
};

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMY SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const getGold = (profile) => safeGetNumber(profile, 'gold', 0);
export const getCash = (profile) => safeGetNumber(profile, 'cash', 0);
export const getRank = (profile) => safeGetNumber(profile, 'rank', 1);

// Status checks
export const isGoldCritical = (profile) => getGold(profile) < THRESHOLDS.GOLD_CRITICAL;
export const isGoldSafe = (profile) => getGold(profile) >= THRESHOLDS.GOLD_SAFE;
export const isCashPoor = (profile) => getCash(profile) < THRESHOLDS.CASH_POOR;

// ═══════════════════════════════════════════════════════════════════════════
// ROLE SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const getTraderLevel = (profile) => safeGetNumber(profile, 'roles.trader', 0);
export const getBountyLevel = (profile) => safeGetNumber(profile, 'roles.bountyHunter', 0);
export const getCollectorLevel = (profile) => safeGetNumber(profile, 'roles.collector', 0);
export const getMoonshinerLevel = (profile) => safeGetNumber(profile, 'roles.moonshiner', 0);
export const getNaturalistLevel = (profile) => safeGetNumber(profile, 'roles.naturalist', 0);

export const hasTrader = (profile) => getTraderLevel(profile) > 0;
export const hasBounty = (profile) => getBountyLevel(profile) > 0;
export const hasCollector = (profile) => getCollectorLevel(profile) > 0;
export const hasMoonshiner = (profile) => getMoonshinerLevel(profile) > 0;
export const hasAnyRole = (profile) => {
    const roles = profile?.roles || {};
    return Object.values(roles).some(xp => xp > 0);
};

// ═══════════════════════════════════════════════════════════════════════════
// WAGON / TRADER STATE SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get wagon load percentage
 * Accepts optional override object for transient state (e.g., from WagonCalculator)
 */
export const getWagonLoad = (profile, wagonStateOverride) => {
    if (wagonStateOverride && typeof wagonStateOverride.load === 'number') {
        return wagonStateOverride.load;
    }
    return safeGetNumber(profile, 'traderState.goodsPercent', 0);
};

export const isWagonFull = (profile, wagonState) =>
    getWagonLoad(profile, wagonState) >= THRESHOLDS.WAGON_FULL;

export const isWagonEmpty = (profile, wagonState) =>
    getWagonLoad(profile, wagonState) < THRESHOLDS.WAGON_EMPTY;

export const isWagonNearFull = (profile, wagonState) =>
    getWagonLoad(profile, wagonState) >= THRESHOLDS.WAGON_NEAR_FULL;
