// FILE: src/logic/sessionAnalytics.js
// Pure functions for calculating session analytics metrics

/**
 * Calculate hourly earnings rate
 * @param {Object} session - Session object with earnings and time
 * @returns {{cash: number, gold: number}} - Earnings per hour
 */
export function calculateHourlyEarnings(session) {
  if (!session || !session.startTime) {
    return { cash: 0, gold: 0 };
  }

  const endTime = session.endTime || Date.now();
  const durationMs = endTime - session.startTime;
  const durationHours = durationMs / (1000 * 60 * 60);

  if (durationHours <= 0) {
    return { cash: 0, gold: 0 };
  }

  const earnings = session.earnings || { cash: 0, gold: 0 };
  
  return {
    cash: earnings.cash / durationHours,
    gold: earnings.gold / durationHours
  };
}

/**
 * Calculate role progression velocity (XP per hour)
 * @param {Object} session - Session object with xpGains and time
 * @returns {Object} - XP/hr per role
 */
export function calculateRoleVelocity(session) {
  if (!session || !session.startTime) {
    return {};
  }

  const endTime = session.endTime || Date.now();
  const durationMs = endTime - session.startTime;
  const durationHours = durationMs / (1000 * 60 * 60);

  if (durationHours <= 0) {
    return {};
  }

  const xpGains = session.xpGains?.roles || {};
  const velocities = {};

  Object.entries(xpGains).forEach(([roleKey, xp]) => {
    velocities[roleKey] = xp / durationHours;
  });

  return velocities;
}

/**
 * Calculate efficiency metrics
 * @param {Object} session - Session object
 * @returns {Object} - Efficiency metrics
 */
export function calculateEfficiency(session) {
  if (!session || !session.startTime) {
    return {
      cashPerMinute: 0,
      goldPerMinute: 0,
      xpPerMinute: 0,
      totalValue: 0 // Cash + (Gold * 25) assuming 1GB = $25
    };
  }

  const endTime = session.endTime || Date.now();
  const durationMs = endTime - session.startTime;
  const durationMinutes = durationMs / (1000 * 60);

  if (durationMinutes <= 0) {
    return {
      cashPerMinute: 0,
      goldPerMinute: 0,
      xpPerMinute: 0,
      totalValue: 0
    };
  }

  const earnings = session.earnings || { cash: 0, gold: 0 };
  const xpGains = session.xpGains?.total || 0;

  // Convert gold to cash equivalent (1GB = $25)
  const totalValue = earnings.cash + (earnings.gold * 25);

  return {
    cashPerMinute: earnings.cash / durationMinutes,
    goldPerMinute: earnings.gold / durationMinutes,
    xpPerMinute: xpGains / durationMinutes,
    totalValue
  };
}

/**
 * Calculate session duration in human-readable format
 * @param {Object} session - Session object
 * @returns {string} - Formatted duration (e.g., "2h 15m")
 */
export function formatSessionDuration(session) {
  if (!session || !session.startTime) {
    return '0m';
  }

  const endTime = session.endTime || Date.now();
  const durationMs = endTime - session.startTime;
  const durationMinutes = Math.floor(durationMs / (1000 * 60));
  
  if (durationMinutes < 60) {
    return `${durationMinutes}m`;
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

/**
 * Calculate historical trends across multiple sessions
 * @param {Array} sessions - Array of session objects
 * @returns {Object} - Trend data
 */
export function calculateTrends(sessions) {
  if (!sessions || sessions.length === 0) {
    return {
      averageCashPerHour: 0,
      averageGoldPerHour: 0,
      averageXpPerHour: 0,
      totalSessions: 0,
      totalEarnings: { cash: 0, gold: 0 },
      bestSession: null,
      trendDirection: 'stable' // 'up', 'down', 'stable'
    };
  }

  const validSessions = sessions.filter(s => s.endTime && s.startTime);
  
  if (validSessions.length === 0) {
    return {
      averageCashPerHour: 0,
      averageGoldPerHour: 0,
      averageXpPerHour: 0,
      totalSessions: validSessions.length,
      totalEarnings: { cash: 0, gold: 0 },
      bestSession: null,
      trendDirection: 'stable'
    };
  }

  // Calculate averages
  const hourlyRates = validSessions.map(s => calculateHourlyEarnings(s));
  const averageCashPerHour = hourlyRates.reduce((sum, r) => sum + r.cash, 0) / hourlyRates.length;
  const averageGoldPerHour = hourlyRates.reduce((sum, r) => sum + r.gold, 0) / hourlyRates.length;

  const xpRates = validSessions.map(s => {
    const durationHours = (s.endTime - s.startTime) / (1000 * 60 * 60);
    return durationHours > 0 ? (s.xpGains?.total || 0) / durationHours : 0;
  });
  const averageXpPerHour = xpRates.reduce((sum, r) => sum + r, 0) / xpRates.length;

  // Total earnings
  const totalEarnings = validSessions.reduce((acc, s) => ({
    cash: acc.cash + (s.earnings?.cash || 0),
    gold: acc.gold + (s.earnings?.gold || 0)
  }), { cash: 0, gold: 0 });

  // Find best session (highest total value)
  const bestSession = validSessions.reduce((best, current) => {
    const currentValue = (current.earnings?.cash || 0) + ((current.earnings?.gold || 0) * 25);
    const bestValue = best ? ((best.earnings?.cash || 0) + ((best.earnings?.gold || 0) * 25)) : 0;
    return currentValue > bestValue ? current : best;
  }, null);

  // Calculate trend direction (compare recent 3 vs previous 3)
  let trendDirection = 'stable';
  if (validSessions.length >= 6) {
    const recent = validSessions.slice(0, 3);
    const previous = validSessions.slice(3, 6);
    
    const recentAvg = recent.reduce((sum, s) => {
      const value = (s.earnings?.cash || 0) + ((s.earnings?.gold || 0) * 25);
      const hours = (s.endTime - s.startTime) / (1000 * 60 * 60);
      return sum + (hours > 0 ? value / hours : 0);
    }, 0) / recent.length;

    const previousAvg = previous.reduce((sum, s) => {
      const value = (s.earnings?.cash || 0) + ((s.earnings?.gold || 0) * 25);
      const hours = (s.endTime - s.startTime) / (1000 * 60 * 60);
      return sum + (hours > 0 ? value / hours : 0);
    }, 0) / previous.length;

    const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;
    if (changePercent > 10) trendDirection = 'up';
    else if (changePercent < -10) trendDirection = 'down';
  }

  return {
    averageCashPerHour,
    averageGoldPerHour,
    averageXpPerHour,
    totalSessions: validSessions.length,
    totalEarnings,
    bestSession,
    trendDirection
  };
}
