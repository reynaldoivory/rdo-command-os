// FILE: src/components/EfficiencyEngine.jsx
import React, { useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { analyzeEfficiency } from '../engine/DecisionTree';
import { useSpecials } from '../hooks/useSpecials';
import { useProfile } from '../context';

/**
 * EfficiencyEngine - Real-time analysis panel for purchase planning
 * Surfaces bottlenecks, warnings, and optimization opportunities
 * Now integrates with weekly specials for discount recommendations
 */
export const EfficiencyEngine = () => {
  // Fetch weekly specials for discount integration
  const { specials, lastFetched, error: specialsError } = useSpecials();
  const { profile, cart, CATALOG } = useProfile();

  const analysis = useMemo(
    () => analyzeEfficiency(profile, CATALOG, cart, specials),
    [profile, CATALOG, cart, specials]
  );

  // Specials freshness checks
  const validUntil = specials?.meta?.validUntil ? new Date(specials.meta.validUntil) : null;
  const lastUpdate = specials?.meta?.lastUpdated ? new Date(specials.meta.lastUpdated) : null;
  const lastFetchedTs = lastFetched instanceof Date ? lastFetched : null;
  const now = Date.now();
  const isExpired = validUntil ? validUntil.getTime() < now : false;
  const isStaleFetch = lastFetchedTs ? (now - lastFetchedTs.getTime()) > 24 * 60 * 60 * 1000 : false;
  const specialsSource = specials?.meta?.source || 'Unknown';

  // Icon and color mapping for recommendation types
  const typeConfig = {
    critical: {
      icon: AlertCircle,
      bg: 'bg-red-900/20',
      border: 'border-red-500/50',
      accent: 'border-l-red-500',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-900/20',
      border: 'border-amber-500/30',
      accent: 'border-l-amber-500',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-900/10',
      border: 'border-blue-500/20',
      accent: 'border-l-blue-500',
      text: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
  };

  // Bottleneck color
  const bottleneckColor = {
    'NONE': 'text-green-400',
    'IDLE': 'text-gray-500',
    'CASH': 'text-red-400',
    'GOLD': 'text-yellow-400',
    'CASH + GOLD': 'text-red-500',
  };

  const efficiencyColor = (() => {
    const val = analysis.metrics.efficiency;
    if (val >= 80) return 'text-green-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-red-400';
  })();

  const efficiencyBar = (() => {
    const val = analysis.metrics.efficiency;
    if (val >= 80) return 'bg-gradient-to-r from-green-600 to-green-400';
    if (val >= 50) return 'bg-gradient-to-r from-amber-600 to-amber-400';
    return 'bg-gradient-to-r from-red-600 to-red-400';
  })();

  return (
    <div className="card-rdo rounded-xl p-6 mb-6 relative overflow-hidden">
      {/* Subtle shimmer effect for premium feel */}
      <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <h3 className="text-[#D4AF37] font-western text-lg flex items-center gap-2">
          <TrendingUp size={18} className="text-[#D4AF37]" />
          Operational Efficiency
        </h3>
        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest block">BOTTLENECK</span>
          <div className={`font-bold font-mono text-sm ${bottleneckColor[analysis.metrics.bottleneck] || 'text-gray-400'}`}>
            {analysis.metrics.bottleneck}
          </div>
        </div>
      </div>

      {/* Specials freshness / blockers */}
      {(isExpired || isStaleFetch || specialsError) && (
        <div className="relative z-10 mb-4 p-3 rounded-lg border border-amber-500/30 bg-amber-900/20 text-xs text-amber-200 flex items-start gap-2">
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-amber-400" />
          <div>
            <div className="font-bold text-amber-300">Live data warning</div>
            <div>
              {isExpired ? 'Specials data is past validUntil; values may be outdated. ' : ''}
              {isStaleFetch ? 'Local cache is older than 24h; refresh recommended. ' : ''}
              {specialsError ? `Feed error: ${specialsError}` : ''}
            </div>
            <div className="text-[10px] text-amber-200/70">
              Source: {specialsSource} • Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Unknown'}
            </div>
          </div>
        </div>
      )}

      {/* Cart blockers */}
      {(analysis.remaining.cash < 0 || analysis.remaining.gold < 0) && (
        <div className="relative z-10 mb-3 p-3 rounded-lg border border-red-500/40 bg-red-900/20 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-red-300" />
          <div>
            <div className="font-bold text-red-200">Checkout blocked</div>
            {analysis.remaining.cash < 0 && (
              <div>Cash shortfall: ${Math.abs(analysis.remaining.cash).toFixed(2)}.</div>
            )}
            {analysis.remaining.gold < 0 && (
              <div>Gold shortfall: {Math.abs(analysis.remaining.gold).toFixed(2)} GB.</div>
            )}
          </div>
        </div>
      )}

      {/* Efficiency Score Bar */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">System Efficiency</span>
          <span className={`font-mono font-bold text-sm ${efficiencyColor}`}>
            {analysis.metrics.efficiency}%
          </span>
        </div>
        <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full transition-all duration-500 ${efficiencyBar}`}
            style={{ width: `${analysis.metrics.efficiency}%` }}
          />
        </div>
      </div>

      {/* Quick Stats */}
      {cart.length > 0 && (
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Cash Utilization</div>
            <div className="font-mono font-bold text-green-400">
              {analysis.metrics.cashUtilization.toFixed(0)}%
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-3 border border-white/5">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Gold Utilization</div>
            <div className="font-mono font-bold text-yellow-400">
              {analysis.metrics.goldUtilization.toFixed(0)}%
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="relative z-10 space-y-3">
        {analysis.recommendations.length > 0 ? (
          analysis.recommendations.slice(0, 3).map((rec, idx) => {
            const config = typeConfig[rec.type] || typeConfig.info;
            const Icon = config.icon;
            const recKey = rec.id || `${rec.title}-${idx}`;

            return (
              <div
                key={recKey}
                className={`${config.bg} border-l-2 ${config.accent} pl-3 py-2 rounded-r-lg animate-fade-in-up`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`flex items-center gap-2 ${config.text} font-bold text-sm`}>
                  <Icon size={14} /> {rec.title}
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{rec.desc}</p>
                {rec.action && (
                  <div className={`mt-2 text-[10px] inline-block ${config.badge} px-2 py-1 rounded border`}>
                    RECOMMENDED: {rec.action}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex items-center gap-3 text-green-400 bg-green-900/10 p-4 rounded-lg border border-green-500/20">
            <CheckCircle size={24} className="flex-shrink-0" />
            <div>
              <div className="font-bold text-sm">Systems Nominal</div>
              <div className="text-xs text-green-300/70 mt-0.5">
                Your purchasing plan is mathematically optimal.
              </div>
            </div>
          </div>
        )}

        {/* Show more indicator */}
        {analysis.recommendations.length > 3 && (
          <div className="text-center text-xs text-gray-500 pt-2">
            +{analysis.recommendations.length - 3} more suggestion(s)
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="relative z-10 mt-4 pt-3 border-t border-white/5">
        <p className="text-xs text-gray-500 italic">{analysis.summary}</p>
      </div>
    </div>
  );
};

export default EfficiencyEngine;