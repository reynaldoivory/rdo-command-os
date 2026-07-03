// FILE: src/components/widgets/SessionAnalytics.jsx
// Session Analytics Dashboard - Tracks earnings, progression, and efficiency
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Coins, BarChart3, Play, Square } from 'lucide-react';
import { useProfile } from '../../context';
import { useSessionTracker } from '../../hooks/useSessionTracker';
import {
  calculateHourlyEarnings,
  calculateRoleVelocity,
  calculateEfficiency,
  formatSessionDuration,
  calculateTrends
} from '../../logic/sessionAnalytics';
import { ROLES } from '../../data/rdo-data';

export const SessionAnalytics = () => {
  const { profile, profileId } = useProfile();
  const { currentSession, sessions, startSession, endSession, isActive } = useSessionTracker(profileId, profile);

  // Calculate current session metrics
  const currentMetrics = useMemo(() => {
    if (!currentSession) return null;

    const hourlyEarnings = calculateHourlyEarnings(currentSession);
    const roleVelocity = calculateRoleVelocity(currentSession);
    const efficiency = calculateEfficiency(currentSession);
    const duration = formatSessionDuration(currentSession);

    return {
      hourlyEarnings,
      roleVelocity,
      efficiency,
      duration,
      earnings: currentSession.earnings || { cash: 0, gold: 0 },
      xpGains: currentSession.xpGains || { total: 0, roles: {} }
    };
  }, [currentSession]);

  // Calculate historical trends
  const trends = useMemo(() => calculateTrends(sessions), [sessions]);

  const getTrendIcon = () => {
    if (trends.trendDirection === 'up') return TrendingUp;
    if (trends.trendDirection === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trends.trendDirection === 'up') return 'text-green-400';
    if (trends.trendDirection === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const TrendIcon = getTrendIcon();
  const trendColor = getTrendColor();

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#D4AF37]" />
            <h3 className="font-bold text-white text-sm">SESSION ANALYTICS</h3>
          </div>
          {isActive ? (
            <button
              onClick={endSession}
              className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30 transition-colors"
            >
              <Square size={12} />
              End Session
            </button>
          ) : (
            <button
              onClick={startSession}
              className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30 transition-colors"
            >
              <Play size={12} />
              Start Session
            </button>
          )}
        </div>
      </div>

      {/* Current Session */}
      {currentMetrics && (
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-rdo-paper">ACTIVE SESSION</h4>
            <span className="text-xs text-gray-500 font-mono">{currentMetrics.duration}</span>
          </div>

          {/* Earnings */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-black/30 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <DollarSign size={12} className="text-green-400" />
                <span className="text-xs text-gray-400">Cash/Hr</span>
              </div>
              <div className="text-lg font-bold text-green-400">
                ${currentMetrics.hourlyEarnings.cash.toFixed(0)}
              </div>
            </div>
            <div className="bg-black/30 rounded p-2">
              <div className="flex items-center gap-1 mb-1">
                <Coins size={12} className="text-yellow-400" />
                <span className="text-xs text-gray-400">Gold/Hr</span>
              </div>
              <div className="text-lg font-bold text-yellow-400">
                {currentMetrics.hourlyEarnings.gold.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-400">Earned This Session:</span>
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-bold">${currentMetrics.earnings.cash.toFixed(2)}</span>
              <span className="text-yellow-400 font-bold">{currentMetrics.earnings.gold.toFixed(2)} GB</span>
            </div>
          </div>

          {/* Role Velocity */}
          {Object.keys(currentMetrics.roleVelocity).length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-xs text-gray-400 mb-2">Role Progression (XP/Hr):</div>
              <div className="space-y-1">
                {Object.entries(currentMetrics.roleVelocity).map(([roleKey, xpPerHour]) => {
                  const role = ROLES[roleKey];
                  if (!role || xpPerHour <= 0) return null;
                  return (
                    <div key={roleKey} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">{role.name}:</span>
                      <span className="text-blue-400 font-mono">{xpPerHour.toFixed(0)} XP/hr</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historical Trends */}
      {sessions.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-rdo-paper">HISTORICAL TRENDS</h4>
            <div className="flex items-center gap-1">
              <TrendIcon size={14} className={trendColor} />
              <span className={`text-xs font-bold ${trendColor} uppercase`}>
                {trends.trendDirection}
              </span>
            </div>
          </div>

          {/* Average Rates */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-black/30 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Avg Cash/Hr</div>
              <div className="text-sm font-bold text-green-400">
                ${trends.averageCashPerHour.toFixed(0)}
              </div>
            </div>
            <div className="bg-black/30 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Avg Gold/Hr</div>
              <div className="text-sm font-bold text-yellow-400">
                {trends.averageGoldPerHour.toFixed(2)}
              </div>
            </div>
            <div className="bg-black/30 rounded p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Avg XP/Hr</div>
              <div className="text-sm font-bold text-blue-400">
                {trends.averageXpPerHour.toFixed(0)}
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="flex items-center justify-between text-xs mb-3 pt-3 border-t border-white/5">
            <span className="text-gray-400">Total Sessions: <span className="text-white font-bold">{trends.totalSessions}</span></span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Lifetime:</span>
              <span className="text-green-400 font-bold">${trends.totalEarnings.cash.toFixed(0)}</span>
              <span className="text-yellow-400 font-bold">{trends.totalEarnings.gold.toFixed(1)} GB</span>
            </div>
          </div>

          {/* Best Session */}
          {trends.bestSession && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-xs text-gray-400 mb-2">Best Session:</div>
              <div className="bg-[#D4AF37]/10 rounded p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">
                    {formatSessionDuration(trends.bestSession)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-bold">
                      ${(trends.bestSession.earnings?.cash || 0).toFixed(0)}
                    </span>
                    <span className="text-yellow-400 font-bold">
                      {(trends.bestSession.earnings?.gold || 0).toFixed(2)} GB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isActive && sessions.length === 0 && (
        <div className="p-6 text-center">
          <BarChart3 size={32} className="mx-auto mb-2 text-gray-600 opacity-50" />
          <p className="text-sm text-gray-500 mb-1">No session data yet</p>
          <p className="text-xs text-gray-600">Start a session to begin tracking analytics</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2 bg-white/5 border-t border-white/5">
        <p className="text-[9px] text-gray-600 text-center">
          Analytics update automatically • Sessions persist across app restarts
        </p>
      </div>
    </div>
  );
};
