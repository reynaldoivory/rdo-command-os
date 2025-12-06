// FILE: src/engine/DecisionTree.js
// ═══════════════════════════════════════════════════════════════════════════
// EFFICIENCY ANALYSIS ENGINE
// Analyzes player state, cart, and catalog to surface optimization opportunities
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Core efficiency thresholds - tuned for RDO economy
 */
const THRESHOLDS = {
  // Gold is precious - warn if spending leaves player with less than this
  GOLD_RESERVE_MIN: 5,
  // Cash reserve for unexpected expenses (fast travel, ammo, camp fees)
  CASH_RESERVE_MIN: 100,
  // Warn if cart total exceeds this percentage of available funds
  BUDGET_WARNING_PERCENT: 0.9,
  // Role XP thresholds for "underleveled" warning
  ROLE_UNDERLEVELED: 5,
  // Rank thresholds
  RANK_LOW: 25,
  RANK_MID: 50,
};

/**
 * Analyze efficiency of current state and cart
 * @param {Object} profile - Player profile { cash, gold, rank, xp, roles }
 * @param {Array} catalog - Full item catalog
 * @param {Array} cart - Array of item IDs in cart
 * @returns {Object} Analysis results with metrics and recommendations
 */
export function analyzeEfficiency(profile, catalog, cart) {
  const recommendations = [];
  const metrics = {
    bottleneck: 'NONE',
    efficiency: 100,
    cashUtilization: 0,
    goldUtilization: 0,
  };

  // Get cart items
  const cartItems = cart.map(id => catalog.find(i => i.id === id)).filter(Boolean);
  
  // Calculate totals
  const cartTotals = cartItems.reduce((acc, item) => ({
    cash: acc.cash + (item.price || 0),
    gold: acc.gold + (item.gold || 0),
  }), { cash: 0, gold: 0 });

  // Calculate utilization percentages
  metrics.cashUtilization = profile.cash > 0 ? (cartTotals.cash / profile.cash) * 100 : 0;
  metrics.goldUtilization = profile.gold > 0 ? (cartTotals.gold / profile.gold) * 100 : 0;

  // ═══ PHASE 0: FRESH SPAWN DETECTION (The First 15 Gold) ═══
  // This is the hardest part of the game. Wrong spending here sets you back weeks.
  
  const hasAnyRole = Object.values(profile.roles || {}).some(xp => xp > 0);
  const isFreshSpawn = profile.gold < 15 && !hasAnyRole && profile.rank < 15;

  if (isFreshSpawn) {
    metrics.bottleneck = 'GOLD (CRITICAL)';
    metrics.efficiency = 20; // Fresh spawns are inherently inefficient

    // Primary objective
    recommendations.push({
      priority: 0,
      title: '🎯 PRIMARY OBJECTIVE: 15 Gold Bars',
      desc: 'Do NOT spend Gold on cosmetics. You need exactly 15.0 Gold to unlock the Bounty Hunter role. This is the ONLY role that pays Gold back.',
      action: 'Grind Stranger Missions (wait until 12:00 timer for max payout)',
      type: 'critical',
    });

    // Story missions for cash
    if (profile.cash < 200) {
      recommendations.push({
        priority: 0,
        title: '📜 Story Missions (Land of Opportunities)',
        desc: 'Complete the yellow Story Missions immediately. They pay a first-time cash bonus (~$200) that funds your initial weapons.',
        action: 'Play Story from Online menu',
        type: 'critical',
      });
    }

    // Daily streak importance
    recommendations.push({
      priority: 1,
      title: '📅 Daily Challenge Streak (NEVER BREAK)',
      desc: 'Complete at least 1 Daily Challenge every 24 hours. After 21 days, you earn 2.5x Gold. This is your ticket to escaping poverty.',
      action: 'Do 1 Daily today - ANY daily',
      type: 'warning',
    });
  }

  // Bolt Action Rifle guidance (Rank 1-10)
  if (profile.rank < 7 && profile.rank >= 1) {
    recommendations.push({
      priority: 2,
      title: '🔫 Save for Bolt Action Rifle (Rank 7)',
      desc: 'Do NOT buy clothes or cosmetics. The Bolt Action Rifle ($216) is the most versatile weapon in the game. You need this to hunt and defend yourself.',
      action: 'Hoard Cash until Rank 7',
      type: 'warning',
    });
  }

  // Bolt Action unlock notification
  const boltAction = catalog.find(i => i.id === 'w_rif_bolt');
  const hasBoltInCart = boltAction && cart.includes(boltAction.id);
  
  if (profile.rank >= 7 && profile.rank < 15 && !hasBoltInCart && profile.cash >= 216) {
    recommendations.push({
      priority: 1,
      title: '✅ PURCHASE NOW: Bolt Action Rifle',
      desc: 'You have unlocked and can afford the Bolt Action Rifle. This is your #1 priority purchase. Buy it immediately.',
      action: 'Add to cart and purchase',
      type: 'critical',
    });
  }

  // Varmint Rifle for hunting
  if (profile.rank >= 8 && profile.rank < 20) {
    const varmint = catalog.find(i => i.id === 'w_rif_varmint');
    const hasVarmintInCart = varmint && cart.includes(varmint.id);
    
    if (!hasVarmintInCart && profile.cash >= 72) {
      recommendations.push({
        priority: 3,
        title: '🐦 Consider: Varmint Rifle',
        desc: 'Required for shooting small game (birds, rabbits) for perfect pelts. Essential for Trader role later. Only $72.',
        action: 'Buy after Bolt Action',
        type: 'info',
      });
    }
  }

  // ═══ ANALYSIS RULES ═══

  // Rule 1: Budget Overrun Detection
  if (cartTotals.cash > profile.cash) {
    metrics.bottleneck = 'CASH';
    metrics.efficiency -= 30;
    recommendations.push({
      priority: 1,
      title: 'Cash Deficit',
      desc: `Your cart requires $${cartTotals.cash.toFixed(2)} but you only have $${profile.cash.toFixed(2)}. You're $${(cartTotals.cash - profile.cash).toFixed(2)} short.`,
      action: 'Remove items or earn more cash via Trader/Moonshiner deliveries',
      type: 'critical',
    });
  }

  if (cartTotals.gold > profile.gold) {
    metrics.bottleneck = metrics.bottleneck === 'CASH' ? 'CASH + GOLD' : 'GOLD';
    metrics.efficiency -= 30;
    recommendations.push({
      priority: 1,
      title: 'Gold Deficit',
      desc: `Your cart requires ${cartTotals.gold.toFixed(2)} GB but you only have ${profile.gold.toFixed(2)} GB. You're ${(cartTotals.gold - profile.gold).toFixed(2)} GB short.`,
      action: 'Complete Daily Challenges or Bounty Hunter missions for gold',
      type: 'critical',
    });
  }

  // Rule 2: Reserve Depletion Warning
  const cashAfter = profile.cash - cartTotals.cash;
  const goldAfter = profile.gold - cartTotals.gold;

  if (cashAfter >= 0 && cashAfter < THRESHOLDS.CASH_RESERVE_MIN && cartTotals.cash > 0) {
    metrics.efficiency -= 10;
    recommendations.push({
      priority: 2,
      title: 'Low Cash Reserve',
      desc: `After purchase, you'll have only $${cashAfter.toFixed(2)} remaining. Consider keeping $${THRESHOLDS.CASH_RESERVE_MIN}+ for fast travel and supplies.`,
      action: 'Consider removing lower-priority items',
      type: 'warning',
    });
  }

  if (goldAfter >= 0 && goldAfter < THRESHOLDS.GOLD_RESERVE_MIN && cartTotals.gold > 0) {
    metrics.efficiency -= 10;
    recommendations.push({
      priority: 2,
      title: 'Low Gold Reserve',
      desc: `After purchase, you'll have only ${goldAfter.toFixed(2)} GB remaining. Gold is hard to earn - keep a reserve for limited-time items.`,
      action: 'Prioritize cash purchases over gold when possible',
      type: 'warning',
    });
  }

  // Rule 3: Locked Items in Cart
  const lockedItems = cartItems.filter(item => item.rank > profile.rank);
  if (lockedItems.length > 0) {
    metrics.efficiency -= 15;
    recommendations.push({
      priority: 1,
      title: 'Rank-Locked Items',
      desc: `${lockedItems.length} item(s) in your cart require higher rank: ${lockedItems.map(i => `${i.name} (Rank ${i.rank})`).join(', ')}`,
      action: `Reach Rank ${Math.max(...lockedItems.map(i => i.rank))} to unlock all cart items`,
      type: 'critical',
    });
  }

  // Rule 4: Gold vs Cash Optimization
  const goldPurchasableWithCash = cartItems.filter(item => 
    item.gold > 0 && item.price > 0 && profile.cash >= item.price
  );
  if (goldPurchasableWithCash.length > 0 && profile.gold < profile.cash / 25) {
    recommendations.push({
      priority: 3,
      title: 'Gold Conservation Opportunity',
      desc: `${goldPurchasableWithCash.length} item(s) can be bought with cash instead of gold. Since your gold reserves are low relative to cash, consider using cash.`,
      action: 'Review dual-currency items in cart',
      type: 'info',
    });
  }

  // Rule 5: Role Progression Check
  const roles = profile.roles || {};
  const underleveledRoles = Object.entries(roles)
    .filter(([, xp]) => xp < 1000) // Less than level 5 equivalent
    .map(([name]) => name);
  
  if (underleveledRoles.length >= 3 && cart.length > 0) {
    recommendations.push({
      priority: 4,
      title: 'Role Progression Opportunity',
      desc: `You have ${underleveledRoles.length} underleveled roles. Consider investing in role tokens/equipment instead of cosmetics.`,
      action: 'Focus on Bounty Hunter for gold, Trader for cash',
      type: 'info',
    });
  }

  // Rule 6: Empty Cart Check
  if (cart.length === 0) {
    metrics.bottleneck = 'IDLE';
    recommendations.push({
      priority: 5,
      title: 'No Active Plan',
      desc: 'Your purchase plan is empty. Browse the catalog to start planning your next acquisition.',
      type: 'info',
    });
  }

  // Rule 7: High-Value Item Detection
  const highValueItems = cartItems.filter(item => 
    (item.gold >= 15) || (item.price >= 500)
  );
  if (highValueItems.length > 1) {
    recommendations.push({
      priority: 3,
      title: 'Multiple High-Value Items',
      desc: `You're planning to buy ${highValueItems.length} expensive items at once. Consider spacing out major purchases to maintain reserves.`,
      action: 'Prioritize by urgency or gameplay impact',
      type: 'warning',
    });
  }

  // Rule 8: Efficiency Score Calculation
  if (cart.length > 0 && recommendations.filter(r => r.type === 'critical').length === 0) {
    // Bonus for staying within budget with reserves
    if (cashAfter >= THRESHOLDS.CASH_RESERVE_MIN) metrics.efficiency += 5;
    if (goldAfter >= THRESHOLDS.GOLD_RESERVE_MIN) metrics.efficiency += 5;
  }

  // Clamp efficiency
  metrics.efficiency = Math.max(0, Math.min(100, metrics.efficiency));

  // Sort recommendations by priority
  recommendations.sort((a, b) => a.priority - b.priority);

  return {
    metrics,
    recommendations,
    cartTotals,
    remaining: { cash: cashAfter, gold: goldAfter },
    summary: generateSummary(metrics, recommendations),
  };
}

/**
 * Generate a human-readable summary
 */
function generateSummary(metrics, recommendations) {
  const criticalCount = recommendations.filter(r => r.type === 'critical').length;
  const warningCount = recommendations.filter(r => r.type === 'warning').length;

  if (criticalCount > 0) {
    return `${criticalCount} critical issue(s) detected. Review before purchasing.`;
  } else if (warningCount > 0) {
    return `Plan is viable with ${warningCount} optimization(s) available.`;
  } else if (recommendations.length === 0) {
    return 'Optimal efficiency achieved. All systems nominal.';
  } else {
    return `${recommendations.length} suggestion(s) for improvement.`;
  }
}

/**
 * Quick affordability check for a single item
 */
export function canAffordItem(profile, item) {
  return profile.cash >= (item.price || 0) && 
         profile.gold >= (item.gold || 0) &&
         profile.rank >= (item.rank || 0);
}

/**
 * Calculate time to afford an item based on average earnings
 */
export function estimateTimeToAfford(profile, item, earningsPerHour = { cash: 200, gold: 0.5 }) {
  const cashNeeded = Math.max(0, (item.price || 0) - profile.cash);
  const goldNeeded = Math.max(0, (item.gold || 0) - profile.gold);
  
  const hoursForCash = cashNeeded / earningsPerHour.cash;
  const hoursForGold = goldNeeded / earningsPerHour.gold;
  
  return Math.max(hoursForCash, hoursForGold);
}
