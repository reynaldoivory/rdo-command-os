// =========================================================================
// CALCULATION HOOKS - BOUNTY, TRADER, MOONSHINE EFFICIENCY
// =========================================================================

import { useMemo } from 'react';
import { ROLE_PAYOUTS, HUNTING_VALUES, COLLECTOR_SETS } from '../data';

// =========================================================================
// BOUNTY HUNTER CALCULATIONS
// =========================================================================

/**
 * Calculate optimal bounty payout based on time spent
 * @param {number} timeMinutes - Time spent on bounty (0-30)
 * @param {boolean} isLegendary - Is this a legendary bounty?
 * @param {number} difficulty - Difficulty level (1-5 for legendary)
 * @returns {{ gold: number, cash: number, xp: number, efficiency: number }}
 */
export function calculateBountyPayout(timeMinutes, isLegendary = false, difficulty = 1) {
  // Optimal window is 9-12 minutes for max efficiency
  // Source: SmurfinGTA timer guide
  
  if (isLegendary) {
    // Legendary bounties scale with difficulty and time
    const baseGold = 0.08 * difficulty;
    const baseCash = 20 * difficulty;
    const baseXP = 300 * difficulty;
    
    // Time multiplier (capped at 30 minutes)
    const timeMultiplier = Math.min(timeMinutes / 12, 2.5);
    
    return {
      gold: parseFloat((baseGold * timeMultiplier).toFixed(2)),
      cash: Math.round(baseCash * timeMultiplier),
      xp: Math.round(baseXP * timeMultiplier),
      efficiency: parseFloat((baseGold * timeMultiplier / timeMinutes * 60).toFixed(2)), // Gold per hour
    };
  }
  
  // Regular bounty payout tiers
  if (timeMinutes <= 3) {
    return { gold: 0.08, cash: 10, xp: 200, efficiency: 1.6 };
  } else if (timeMinutes <= 6) {
    return { gold: 0.12, cash: 15, xp: 300, efficiency: 1.2 };
  } else if (timeMinutes <= 9) {
    return { gold: 0.16, cash: 20, xp: 400, efficiency: 1.07 };
  } else if (timeMinutes <= 12) {
    return { gold: 0.24, cash: 40, xp: 600, efficiency: 1.2 }; // Sweet spot
  } else {
    // Diminishing returns after 12 minutes
    const extraTime = timeMinutes - 12;
    const extraGold = Math.min(extraTime * 0.02, 0.24); // Max 0.48 total
    return {
      gold: parseFloat((0.24 + extraGold).toFixed(2)),
      cash: Math.min(40 + extraTime * 2, 80),
      xp: Math.min(600 + extraTime * 30, 1200),
      efficiency: parseFloat(((0.24 + extraGold) / timeMinutes * 60).toFixed(2)),
    };
  }
}

/**
 * Hook for bounty efficiency calculations
 */
export function useBountyCalculator() {
  return useMemo(() => ({
    calculatePayout: calculateBountyPayout,
    optimalTime: { min: 9, max: 12 },
    tips: [
      'Wait until 30 seconds remain for maximum gold',
      '12 minute timer gives best gold/hour ratio',
      'Legendary bounties at 5-star difficulty pay most',
      'Turn in bounties alive for extra XP',
    ],
  }), []);
}

// =========================================================================
// TRADER CALCULATIONS
// =========================================================================

/**
 * Calculate trader delivery payout
 * @param {number} goods - Number of goods (1-100)
 * @param {boolean} isDistant - Distant delivery (+25% but PvP risk)
 * @param {number} posseSize - Number of posse members (1-7)
 * @returns {{ owner: number, perMember: number, total: number, risk: string }}
 */
export function calculateTraderDelivery(goods, isDistant = false, posseSize = 1) {
  const basePerGood = 5.00; // $5 per good for local
  const distantMultiplier = isDistant ? 1.25 : 1.00;
  
  const ownerPayout = goods * basePerGood * distantMultiplier;
  const memberPayout = ownerPayout * 0.5; // Posse members get 50%
  
  return {
    owner: parseFloat(ownerPayout.toFixed(2)),
    perMember: parseFloat(memberPayout.toFixed(2)),
    total: parseFloat((ownerPayout + memberPayout * (posseSize - 1)).toFixed(2)),
    risk: isDistant ? 'High (PvP enabled)' : 'Low',
  };
}

/**
 * Calculate materials value from hunting
 * @param {Object[]} animals - Array of { type: string, quality: 1|2|3, count: number }
 * @returns {{ materials: number, meat: number, estimatedTime: number }}
 */
export function calculateHuntingValue(animals) {
  let totalMaterials = 0;
  let totalMeat = 0;
  
  animals.forEach(({ type, quality = 3, count = 1 }) => {
    // Find animal in any category
    let animalData = null;
    for (const category of Object.values(HUNTING_VALUES)) {
      if (typeof category === 'object' && !Array.isArray(category)) {
        if (category[type]) {
          animalData = category[type];
          break;
        }
      }
    }
    
    if (animalData) {
      // Quality affects materials: 3-star = 100%, 2-star = 60%, 1-star = 30%
      const qualityMultiplier = quality === 3 ? 1.0 : quality === 2 ? 0.6 : 0.3;
      totalMaterials += animalData.materials * qualityMultiplier * count;
      totalMeat += (animalData.meat || 0) * count;
    }
  });
  
  return {
    materials: parseFloat(totalMaterials.toFixed(2)),
    meat: totalMeat,
    estimatedTime: Math.ceil(totalMaterials / 20) * 5, // ~5 min per 20 materials
  };
}

/**
 * Hook for trader efficiency calculations
 */
export function useTraderCalculator() {
  return useMemo(() => ({
    calculateDelivery: calculateTraderDelivery,
    calculateHunting: calculateHuntingValue,
    payouts: ROLE_PAYOUTS.trader,
    huntingValues: HUNTING_VALUES,
    tips: HUNTING_VALUES.tips,
  }), []);
}

// =========================================================================
// MOONSHINER CALCULATIONS
// =========================================================================

/**
 * Calculate moonshine batch profit
 * @param {string} strength - 'weak' | 'average' | 'strong'
 * @param {boolean} hasCondenser - Has condenser upgrade
 * @param {boolean} hasPolishedCopper - Has polished copper upgrade
 * @param {number} flavorRecipeCost - Cost of flavor recipe (0 for basic)
 * @returns {{ sale: number, cost: number, profit: number, time: number, perHour: number }}
 */
export function calculateMoonshineBatch(strength, hasCondenser = false, hasPolishedCopper = false, flavorRecipeCost = 0) {
  let baseData;
  switch (strength) {
    case 'strong':
      baseData = { sale: 226, cost: 50, time: 48 };
      break;
    case 'average':
      baseData = { sale: 100, cost: 60, time: 45 };
      break;
    default: // weak
      baseData = { sale: 50, cost: 30, time: 30 };
  }
  
  // Upgrades affect brewing time
  let timeReduction = 0;
  if (hasCondenser) timeReduction += 0.2; // 20% faster
  if (hasPolishedCopper) timeReduction += 0.1; // 10% faster
  
  const adjustedTime = baseData.time * (1 - timeReduction);
  const profit = baseData.sale - baseData.cost - flavorRecipeCost;
  const perHour = (profit / adjustedTime) * 60;
  
  return {
    sale: baseData.sale,
    cost: baseData.cost + flavorRecipeCost,
    profit: parseFloat(profit.toFixed(2)),
    time: parseFloat(adjustedTime.toFixed(1)),
    perHour: parseFloat(perHour.toFixed(2)),
  };
}

/**
 * Hook for moonshiner efficiency calculations
 */
export function useMoonshinerCalculator() {
  return useMemo(() => ({
    calculateBatch: calculateMoonshineBatch,
    payouts: ROLE_PAYOUTS.moonshiner,
    tips: [
      'Strong moonshine with buyer = $226 sale, $50 mash = $176 profit',
      'Upgrade Condenser first for faster brewing',
      'Polished Copper is best final upgrade',
      'Bar expansion is cosmetic only - skip it',
      'Berry Cobbler Moonshine has best profit margin',
    ],
  }), []);
}

// =========================================================================
// COLLECTOR CALCULATIONS
// =========================================================================

/**
 * Calculate collector set value
 * @param {string[]} setNames - Array of set names to calculate
 * @returns {{ total: number, perSet: Object, bestFirst: string[] }}
 */
export function calculateCollectorSets(setNames) {
  const perSet = {};
  let total = 0;
  
  setNames.forEach(name => {
    const set = COLLECTOR_SETS[name];
    if (set) {
      perSet[name] = set.value;
      total += set.value;
    }
  });
  
  // Sort by value descending
  const bestFirst = Object.entries(perSet)
    .sort(([, a], [, b]) => b - a)
    .map(([name]) => name);
  
  return { total, perSet, bestFirst };
}
