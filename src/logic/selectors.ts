// FILE: src/logic/selectors.ts
// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS - Pure state accessors for the Profile object
// Single source of truth for reading game state values
// All modules (nextBestAction, EfficiencyEngine, etc.) should use these
// ═══════════════════════════════════════════════════════════════════════════

import { THRESHOLDS } from './decisionRules';
import type { RDOProfile, WagonState } from '../types/rdo.types';

/**
 * Safe getter for nested object paths
 * Handles null, undefined, and type coercion gracefully
 */
export const safeGetNumber = (obj: unknown, path: string, fallback: number = 0): number => {
    const val = path
        .split('.')
        .reduce((acc: unknown, part: string) => (acc && typeof acc === 'object' && (acc as Record<string, unknown>)[part] !== undefined ? (acc as Record<string, unknown>)[part] : undefined), obj);
    const num = typeof val === 'number' ? val : parseFloat(val as string);
    return Number.isFinite(num) ? num : fallback;
};

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMY SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const getGold = (profile: RDOProfile): number => safeGetNumber(profile, 'gold', 0);
export const getCash = (profile: RDOProfile): number => safeGetNumber(profile, 'cash', 0);
export const getRank = (profile: RDOProfile): number => safeGetNumber(profile, 'rank', 1);

// Status checks
export const isGoldCritical = (profile: RDOProfile): boolean => getGold(profile) < THRESHOLDS.GOLD_CRITICAL;
export const isGoldSafe = (profile: RDOProfile): boolean => getGold(profile) >= THRESHOLDS.GOLD_SAFE;
export const isCashPoor = (profile: RDOProfile): boolean => getCash(profile) < THRESHOLDS.CASH_POOR;

// ═══════════════════════════════════════════════════════════════════════════
// ROLE SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

export const getTraderLevel = (profile: RDOProfile): number => safeGetNumber(profile, 'roles.trader', 0);
export const getBountyLevel = (profile: RDOProfile): number => safeGetNumber(profile, 'roles.bountyHunter', 0);
export const getCollectorLevel = (profile: RDOProfile): number => safeGetNumber(profile, 'roles.collector', 0);
export const getMoonshinerLevel = (profile: RDOProfile): number => safeGetNumber(profile, 'roles.moonshiner', 0);
export const getNaturalistLevel = (profile: RDOProfile): number => safeGetNumber(profile, 'roles.naturalist', 0);

export const hasTrader = (profile: RDOProfile): boolean => getTraderLevel(profile) > 0;
export const hasBounty = (profile: RDOProfile): boolean => getBountyLevel(profile) > 0;
export const hasCollector = (profile: RDOProfile): boolean => getCollectorLevel(profile) > 0;
export const hasMoonshiner = (profile: RDOProfile): boolean => getMoonshinerLevel(profile) > 0;
export const hasAnyRole = (profile: RDOProfile): boolean => {
    const roles = profile?.roles || {};
    return Object.values(roles).some(xp => (xp as number) > 0);
};

// ═══════════════════════════════════════════════════════════════════════════
// WAGON / TRADER STATE SELECTORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get wagon load percentage
 * Accepts optional override object for transient state (e.g., from WagonCalculator)
 */
export const getWagonLoad = (profile: RDOProfile, wagonStateOverride?: WagonState): number => {
    if (wagonStateOverride && typeof wagonStateOverride.load === 'number') {
        return wagonStateOverride.load;
    }
    return safeGetNumber(profile, 'traderState.goodsPercent', 0);
};

export const isWagonFull = (profile: RDOProfile, wagonState?: WagonState): boolean =>
    getWagonLoad(profile, wagonState) >= THRESHOLDS.WAGON_FULL;

export const isWagonEmpty = (profile: RDOProfile, wagonState?: WagonState): boolean =>
    getWagonLoad(profile, wagonState) < THRESHOLDS.WAGON_EMPTY;

export const isWagonNearFull = (profile: RDOProfile, wagonState?: WagonState): boolean =>
    getWagonLoad(profile, wagonState) >= THRESHOLDS.WAGON_NEAR_FULL;
