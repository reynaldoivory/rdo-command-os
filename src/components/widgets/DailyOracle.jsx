// FILE: src/components/DailyOracle.jsx
// ═══════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGES ORACLE
// Interactive checklist of today's daily challenges with completion tracking
// Integrates with EfficiencyEngine recommendations
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
    Calendar, RefreshCw, Check, Circle, ChevronDown, ChevronRight,
    Star, Target, Package, Search, Leaf, AlertCircle, Coins
} from 'lucide-react';
import { useDailies, DAILY_CATEGORIES } from '../../hooks/useDailies';

// Icon map for categories
const CATEGORY_ICONS = {
    general: Star,
    bountyHunter: Target,
    trader: Package,
    collector: Search,
    moonshiner: Coins, // Wine not in lucide, use Coins
    naturalist: Leaf,
};

/**
 * DailyOracle - Daily challenges checklist widget
 */
export const DailyOracle = () => {
    const { dailies, loading, error, refresh, completedIds, toggleComplete, stats } = useDailies();
    const [expandedCategories, setExpandedCategories] = useState(['general']);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    if (loading && !dailies) {
        return (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <RefreshCw size={16} className="animate-spin" />
                    <span className="text-sm">Loading daily challenges...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#1a1a1a] to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-[#D4AF37]" />
                        <div>
                            <h3 className="text-white font-bold text-sm">Daily Challenges</h3>
                            <p className="text-[10px] text-gray-500 font-mono">
                                Resets 06:00 UTC • {dailies?.isFallback ? 'OFFLINE' : 'LIVE'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Progress Ring */}
                        {stats && (
                            <div className="relative w-10 h-10">
                                <svg className="w-10 h-10 -rotate-90">
                                    <circle
                                        cx="20" cy="20" r="16"
                                        className="stroke-white/10 fill-none"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="20" cy="20" r="16"
                                        className="stroke-[#D4AF37] fill-none"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${stats.progress} 100`}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">
                                    {stats.completed}/{stats.total}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                            title="Refresh dailies"
                        >
                            <RefreshCw size={14} className={`text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Gold Summary */}
                {stats && (
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1">
                            <Coins size={12} className="text-yellow-400" />
                            <span className="text-xs text-gray-400">Earned:</span>
                            <span className="text-xs font-mono font-bold text-yellow-400">
                                {stats.goldEarned.toFixed(1)} GB
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">Potential:</span>
                            <span className="text-xs font-mono text-gray-400">
                                {stats.goldPotential.toFixed(1)} GB
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
                    <AlertCircle size={12} className="text-red-400" />
                    <span className="text-xs text-red-400">Using cached data</span>
                </div>
            )}

            {/* Categories */}
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {dailies && Object.entries(dailies.categories).map(([categoryKey, challenges]) => {
                    const category = DAILY_CATEGORIES[categoryKey] || {
                        name: categoryKey,
                        color: 'text-gray-400',
                        bg: 'bg-gray-500/20'
                    };
                    const CategoryIcon = CATEGORY_ICONS[categoryKey] || Star;
                    const isExpanded = expandedCategories.includes(categoryKey);
                    const completedCount = challenges.filter(c => completedIds.includes(c.id)).length;
                    const allComplete = completedCount === challenges.length;

                    return (
                        <div key={categoryKey} className="border-b border-white/5 last:border-0">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(categoryKey)}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${allComplete ? 'opacity-60' : ''
                                    }`}
                            >
                                {isExpanded ? (
                                    <ChevronDown size={14} className="text-gray-500" />
                                ) : (
                                    <ChevronRight size={14} className="text-gray-500" />
                                )}
                                <CategoryIcon size={14} className={category.color} />
                                <span className={`text-sm font-medium ${category.color}`}>
                                    {category.name}
                                </span>
                                <span className="ml-auto text-xs font-mono text-gray-500">
                                    {completedCount}/{challenges.length}
                                </span>
                                {allComplete && (
                                    <Check size={14} className="text-green-400" />
                                )}
                            </button>

                            {/* Challenges List */}
                            {isExpanded && (
                                <div className="pb-2">
                                    {challenges.map(challenge => {
                                        const isComplete = completedIds.includes(challenge.id);
                                        return (
                                            <button
                                                key={challenge.id}
                                                onClick={() => toggleComplete(challenge.id)}
                                                className={`w-full px-4 py-2 pl-12 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${isComplete ? 'opacity-50' : ''
                                                    }`}
                                            >
                                                {isComplete ? (
                                                    <Check size={14} className="text-green-400 flex-shrink-0" />
                                                ) : (
                                                    <Circle size={14} className="text-gray-600 flex-shrink-0" />
                                                )}
                                                <span className={`text-xs flex-1 ${isComplete ? 'line-through text-gray-500' : 'text-gray-300'
                                                    }`}>
                                                    {challenge.title}
                                                </span>
                                                <span className="text-[10px] font-mono text-yellow-400/60">
                                                    +{challenge.gold} GB
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer Tip */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5">
                <p className="text-[9px] text-gray-600 text-center">
                    Complete all 9 categories for 11+ Gold Bars/day • Streak multiplier at 21+ days
                </p>
            </div>
        </div>
    );
};
