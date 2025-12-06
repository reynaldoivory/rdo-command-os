// =========================================================================
// SIMULATOR HOOK - CART, AFFORDABILITY, AND PROFILE MANAGEMENT
// =========================================================================

import { useMemo, useCallback } from 'react';
import { CATALOG, getLevelFromXP, ROLES } from '../data';

// =========================================================================
// CART CALCULATIONS
// =========================================================================

/**
 * Calculate cart totals from item IDs
 * @param {string[]} itemIds - Array of item IDs in cart
 * @returns {{ cash: number, gold: number, items: Object[], count: number }}
 */
export function calculateCartTotals(itemIds) {
  const items = itemIds
    .map(id => CATALOG.find(item => item.id === id))
    .filter(Boolean);
  
  return {
    cash: items.reduce((sum, item) => sum + item.price, 0),
    gold: items.reduce((sum, item) => sum + item.gold, 0),
    items,
    count: items.length,
  };
}

/**
 * Check if player can afford cart
 * @param {Object} profile - Player profile { cash, gold, rank, roles }
 * @param {string[]} itemIds - Array of item IDs
 * @returns {{ canAfford: boolean, shortfall: Object, unlockedItems: string[], lockedItems: string[] }}
 */
export function checkAffordability(profile, itemIds) {
  const totals = calculateCartTotals(itemIds);
  
  const cashShortfall = Math.max(0, totals.cash - profile.cash);
  const goldShortfall = Math.max(0, totals.gold - profile.gold);
  
  // Check rank requirements for each item
  const unlockedItems = [];
  const lockedItems = [];
  
  totals.items.forEach(item => {
    if (profile.rank >= item.rank) {
      unlockedItems.push(item.id);
    } else {
      lockedItems.push(item.id);
    }
  });
  
  return {
    canAfford: cashShortfall === 0 && goldShortfall === 0,
    shortfall: {
      cash: cashShortfall,
      gold: goldShortfall,
    },
    unlockedItems,
    lockedItems,
    allUnlocked: lockedItems.length === 0,
  };
}

/**
 * Calculate remaining resources after purchase
 * @param {Object} profile - Player profile
 * @param {string[]} itemIds - Array of item IDs
 * @returns {{ cash: number, gold: number, isNegative: boolean }}
 */
export function calculateRemaining(profile, itemIds) {
  const totals = calculateCartTotals(itemIds);
  
  const remainingCash = profile.cash - totals.cash;
  const remainingGold = profile.gold - totals.gold;
  
  return {
    cash: remainingCash,
    gold: remainingGold,
    isNegative: remainingCash < 0 || remainingGold < 0,
  };
}

// =========================================================================
// SIMULATOR HOOK
// =========================================================================

/**
 * Custom hook for simulator state and calculations
 * @param {Object} profile - Current player profile
 * @param {string[]} cart - Current cart item IDs
 * @returns {Object} Simulator utilities
 */
export function useSimulator(profile, cart) {
  // Memoized cart totals
  const cartTotals = useMemo(() => calculateCartTotals(cart), [cart]);
  
  // Memoized affordability check
  const affordability = useMemo(
    () => checkAffordability(profile, cart),
    [profile, cart]
  );
  
  // Memoized remaining resources
  const remaining = useMemo(
    () => calculateRemaining(profile, cart),
    [profile, cart]
  );
  
  // Check if a single item is affordable
  const isItemAffordable = useCallback((itemId) => {
    const item = CATALOG.find(i => i.id === itemId);
    if (!item) return false;
    
    return (
      profile.cash >= item.price &&
      profile.gold >= item.gold &&
      profile.rank >= item.rank
    );
  }, [profile]);
  
  // Check if item is unlocked (rank requirement met)
  const isItemUnlocked = useCallback((itemId) => {
    const item = CATALOG.find(i => i.id === itemId);
    if (!item) return false;
    return profile.rank >= item.rank;
  }, [profile]);
  
  // Get role level from profile
  const getRoleLevel = useCallback((roleKey) => {
    const roleXP = profile.roles?.[roleKey] || 0;
    const maxLevel = ROLES[roleKey]?.maxLevel || 20;
    return getLevelFromXP(roleXP, true, maxLevel);
  }, [profile]);
  
  // Check if role requirement is met for an item
  const isRoleUnlocked = useCallback((itemId) => {
    const item = CATALOG.find(i => i.id === itemId);
    if (!item || !item.role) return true; // No role requirement
    
    const roleLevel = getRoleLevel(item.role);
    const requiredLevel = item.roleRank || 1;
    return roleLevel >= requiredLevel;
  }, [getRoleLevel]);
  
  return {
    // Cart data
    cartTotals,
    cartCount: cart.length,
    
    // Affordability
    affordability,
    canAffordCart: affordability.canAfford && affordability.allUnlocked,
    
    // Resources
    remaining,
    
    // Item checks
    isItemAffordable,
    isItemUnlocked,
    isRoleUnlocked,
    getRoleLevel,
    
    // Helpers
    getItem: (id) => CATALOG.find(i => i.id === id),
  };
}

// =========================================================================
// PROFILE HELPERS
// =========================================================================

/**
 * Calculate total role XP across all roles
 * @param {Object} roles - Role XP object { collector: 0, trader: 0, ... }
 * @returns {number} Total XP
 */
export function calculateTotalRoleXP(roles) {
  return Object.values(roles).reduce((sum, xp) => sum + xp, 0);
}

/**
 * Calculate player's "power level" - a composite score
 * @param {Object} profile - Full player profile
 * @returns {number} Power score (0-1000)
 */
export function calculatePowerLevel(profile) {
  // Weighted scoring
  const rankScore = Math.min(profile.rank, 100) * 3; // Max 300
  const cashScore = Math.min(profile.cash / 100, 100); // Max 100
  const goldScore = Math.min(profile.gold * 2, 200); // Max 200
  
  // Role levels
  let roleScore = 0;
  Object.entries(profile.roles || {}).forEach(([key, xp]) => {
    const maxLevel = ROLES[key]?.maxLevel || 20;
    const level = getLevelFromXP(xp, true, maxLevel);
    roleScore += (level / maxLevel) * 80; // Max 80 per role = 400
  });
  
  return Math.round(rankScore + cashScore + goldScore + roleScore);
}
