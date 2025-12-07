// FILE: src/utils/rdo-logic.js
// ═══════════════════════════════════════════════════════════════════════════
// PURE LOGIC LAYER - No React, No Side Effects
// Extracted for testability and separation of concerns
// ═══════════════════════════════════════════════════════════════════════════

import { RANK_XP_TABLE, ROLE_XP_TABLE } from '../data/rdo-data';

/**
 * Calculate level from cumulative XP
 * @param {number} xp - Total XP accumulated
 * @param {boolean} isRole - Whether this is role XP (uses different table)
 * @param {number} maxLevel - Maximum level cap
 * @returns {number} Current level
 */
export const getLevelFromXP = (xp, isRole = false, maxLevel = 100) => {
  const table = isRole ? ROLE_XP_TABLE : RANK_XP_TABLE;
  let level = 1;

  for (let i = 1; i < Math.min(table.length, maxLevel + 1); i++) {
    if (xp >= table[i]) level = i;
    else break;
  }

  return Math.min(level, maxLevel);
};

/**
 * Get minimum XP required for a given level
 * @param {number} level - Target level
 * @param {boolean} isRole - Whether this is role XP
 * @returns {number} Minimum XP for that level
 */
export const getXPFromLevel = (level, isRole = false) => {
  const table = isRole ? ROLE_XP_TABLE : RANK_XP_TABLE;
  const clampedLevel = Math.max(1, Math.min(level, table.length - 1));
  return table[clampedLevel] || 0;
};

/**
 * Calculate XP progress within current level
 * @param {number} xp - Total XP accumulated
 * @param {boolean} isRole - Whether this is role XP
 * @param {number} maxLevel - Maximum level cap
 * @returns {{ current: number, needed: number, percent: number }}
 */
export const getXPProgress = (xp, isRole = false, maxLevel = 100) => {
  const table = isRole ? ROLE_XP_TABLE : RANK_XP_TABLE;
  const level = getLevelFromXP(xp, isRole, maxLevel);

  if (level >= maxLevel || level >= table.length - 1) {
    return { current: 0, needed: 0, percent: 100 };
  }

  const currentLevelXP = table[level];
  const nextLevelXP = table[level + 1];
  const xpIntoLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return {
    current: xpIntoLevel,
    needed: xpNeeded,
    percent: Math.min(100, (xpIntoLevel / xpNeeded) * 100)
  };
};

/**
 * Calculate Euclidean distance between two map locations
 * @param {{ x: number, y: number }} locA - First location
 * @param {{ x: number, y: number }} locB - Second location
 * @returns {number} Distance units
 */
export const calcDistance = (locA, locB) => {
  return Math.sqrt(Math.pow(locB.x - locA.x, 2) + Math.pow(locB.y - locA.y, 2));
};

/**
 * Calculate fast travel cost between locations
 * @param {{ x: number, y: number }} from - Origin
 * @param {{ x: number, y: number }} to - Destination
 * @returns {number} Cost in dollars
 */
export const calcFastTravelCost = (from, to) => {
  return Math.ceil(calcDistance(from, to) / 10);
};

/**
 * RDO Gold Payout Formula (Community Verified)
 * Gold payout scales with time spent in mission
 * Source: SmurfinGTA, OnlyPVPCat research
 * 
 * @param {number} minutes - Time spent in mission
 * @param {boolean} isStranger - Is this a stranger mission (lower base)
 * @returns {{ gold: number, tier: string }}
 */
export const calculateGoldPayout = (minutes) => {
  // Base rate: 0.08 gold per 3 minutes (0.0267 per minute)
  // Caps at 12 minutes for regular, 30 for legendary
  const baseRate = 0.08;
  const tierMinutes = 3;

  // Calculate tier (0.08, 0.16, 0.24, 0.32 at 3, 6, 9, 12 min)
  const tier = Math.min(4, Math.floor(minutes / tierMinutes));
  const gold = tier * baseRate;

  const tierLabels = ['Minimum', 'Bronze', 'Silver', 'Gold', 'Platinum'];

  return {
    gold: parseFloat(gold.toFixed(2)),
    tier: tierLabels[tier] || 'Platinum',
    nextTierAt: tier < 4 ? (tier + 1) * tierMinutes : null,
    isOptimal: minutes >= 12 && minutes <= 15
  };
};

/**
 * Calculate hourly earnings for different activities
 * @param {string} activity - Activity type
 * @param {Object} options - Activity-specific options
 * @returns {{ goldPerHour: number, cashPerHour: number, xpPerHour: number }}
 */
export const calculateHourlyEarnings = (activity) => {
  const earnings = {
    // Bounty Hunter (waiting 12 min per bounty = 5 per hour)
    bountyHunter: { goldPerHour: 1.6, cashPerHour: 125, xpPerHour: 1500 },

    // Trader (full delivery every 50 min)
    trader: { goldPerHour: 0.5, cashPerHour: 625, xpPerHour: 2000 },

    // Collector (using Jean Ropke map)
    collector: { goldPerHour: 0, cashPerHour: 1000, xpPerHour: 3000 },

    // Moonshiner (delivery every 48 min)
    moonshiner: { goldPerHour: 0.4, cashPerHour: 226, xpPerHour: 1200 },

    // Stranger Missions (waiting 12 min)
    stranger: { goldPerHour: 1.28, cashPerHour: 40, xpPerHour: 400 },

    // Call to Arms (wave 10 completion ~30 min)
    callToArms: { goldPerHour: 2.0, cashPerHour: 600, xpPerHour: 4000 },
  };

  return earnings[activity] || { goldPerHour: 0, cashPerHour: 0, xpPerHour: 0 };
};

/**
 * Estimate time to earn target amount
 * @param {number} targetGold - Gold needed
 * @param {number} targetCash - Cash needed
 * @param {string} activity - Primary activity
 * @returns {{ hours: number, sessions: string }}
 */
export const estimateGrindTime = (targetGold, targetCash, activity = 'bountyHunter') => {
  const rates = calculateHourlyEarnings(activity);

  const hoursForGold = targetGold > 0 ? targetGold / rates.goldPerHour : 0;
  const hoursForCash = targetCash > 0 ? targetCash / rates.cashPerHour : 0;

  const totalHours = Math.max(hoursForGold, hoursForCash);

  // Assuming 2-hour average session
  const sessions = Math.ceil(totalHours / 2);

  return {
    hours: parseFloat(totalHours.toFixed(1)),
    sessions: sessions === 1 ? '1 session' : `${sessions} sessions`
  };
};
