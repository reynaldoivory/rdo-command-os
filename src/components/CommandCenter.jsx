// FILE: src/components/CommandCenter.jsx
// ═══════════════════════════════════════════════════════════════════════════
// COMMAND CENTER - Primary "Best Next Action" Display
// Consumes analyzeProfile() output and renders as actionable directive
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import {
    Truck, Target, Map, Beaker, TrendingUp, Crown, Star, Compass,
    AlertTriangle, Shield, ArrowRight, Calendar, Crosshair
} from 'lucide-react';
import { analyzeProfile } from '../logic/nextBestAction';

// ═══════════════════════════════════════════════════════════════════════════
// 1. ICON REGISTRY (Maps Logic Strings to React Components)
// ═══════════════════════════════════════════════════════════════════════════
const ICON_MAP = {
    Truck: Truck,
    Target: Target,
    Map: Map,
    Flask: Beaker,  // Flask not in lucide-react, use Beaker
    TrendingUp: TrendingUp,
    Crown: Crown,
    Star: Star,
    Compass: Compass,
    Calendar: Calendar,
    Crosshair: Crosshair
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. STYLE REGISTRY (Maps Priority Strings to Tailwind Classes)
// ═══════════════════════════════════════════════════════════════════════════
const PRIORITY_STYLES = {
    critical: {
        border: 'border-red-500',
        bg: 'from-red-950/40 to-black',
        badge: 'bg-red-500/20 text-red-400 border-red-500/50',
        iconParams: { color: 'text-red-500', animate: 'animate-bounce' },
        label: 'CRITICAL'
    },
    high: {
        border: 'border-amber-500',
        bg: 'from-amber-950/40 to-black',
        badge: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
        iconParams: { color: 'text-amber-500', animate: 'animate-pulse' },
        label: 'RECOMMENDED'
    },
    medium: {
        border: 'border-blue-500',
        bg: 'from-blue-950/40 to-black',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        iconParams: { color: 'text-blue-400', animate: '' },
        label: 'OPPORTUNITY'
    },
    low: {
        border: 'border-gray-700',
        bg: 'from-gray-900/40 to-black',
        badge: 'bg-gray-800 text-gray-400 border-gray-700',
        iconParams: { color: 'text-gray-500', animate: '' },
        label: 'OPTIONAL'
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export const CommandCenter = () => {
    const { profile, nextBestAction } = useProfile();
    const analysis = nextBestAction;

    // Loading state
    if (!analysis) {
        return (
            <div className="h-32 bg-[#0a0a0a] animate-pulse rounded-xl mb-6 border border-white/5" />
        );
    }

    const { phase, priority, primaryAction, secondaryAction, constraints } = analysis;

    // Resolve styles - default to 'medium' if logic returns unknown string
    const styles = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;

    // Resolve icon component
    const IconComponent = ICON_MAP[primaryAction.icon] || AlertTriangle;

    return (
        <div
            className={`relative overflow-hidden rounded-xl border-l-4 ${styles.border} bg-gradient-to-r ${styles.bg} shadow-2xl mb-6 group transition-all duration-500`}
            data-testid="command-center"
        >
            {/* Background Texture */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <div className="relative z-10 p-5 flex flex-col md:flex-row justify-between items-start gap-4">

                {/* LEFT: THE DIRECTIVE */}
                <div className="flex-1 min-w-0">
                    {/* Metadata Row */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span
                            className={`text-[10px] uppercase tracking-widest font-black ${phase.color} border border-white/10 px-2 py-0.5 rounded bg-black/40`}
                        >
                            {phase.name}
                        </span>
                        {constraints.map(c => (
                            <span
                                key={c}
                                className="text-[9px] bg-black/60 text-gray-300 border border-white/10 px-2 py-0.5 rounded flex items-center gap-1 font-mono"
                            >
                                <Shield size={10} className="text-red-400" /> {c}
                            </span>
                        ))}
                    </div>

                    {/* Headline Action */}
                    <div className="flex items-start gap-4">
                        <div
                            className={`mt-1 p-3 rounded-xl bg-black/40 border border-white/5 shadow-inner ${styles.iconParams.color} ${styles.iconParams.animate}`}
                        >
                            <IconComponent size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md tracking-tight">
                                {primaryAction.text}
                            </h2>
                            {/* Subtext - tactical guidance */}
                            {primaryAction.subtext && (
                                <p className="text-sm text-gray-400 mt-1 font-mono">
                                    {primaryAction.subtext}
                                </p>
                            )}
                            {/* Secondary Guidance */}
                            {secondaryAction && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 border-l-2 border-white/10 pl-3">
                                    <ArrowRight size={12} />
                                    <span>{secondaryAction.text}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: THE IMPACT */}
                <div className="flex flex-col items-end min-w-[120px] md:min-w-[140px] md:pl-4 md:border-l border-white/5">
                    <div
                        className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-2 py-1 rounded border ${styles.badge}`}
                    >
                        {styles.label}
                    </div>

                    {primaryAction.impact && (
                        <>
                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 font-mono">
                                {primaryAction.impact}
                            </div>
                            <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-1">
                                Projected Yield
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};
