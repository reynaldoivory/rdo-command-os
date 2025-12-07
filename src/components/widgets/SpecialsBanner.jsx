// FILE: src/components/SpecialsBanner.jsx
// ═══════════════════════════════════════════════════════════════════════════
// WEEKLY SPECIALS BANNER
// Displays current Rockstar Newswire bonuses and discounts
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
    Sparkles, ChevronDown, ChevronUp, RefreshCw, Clock,
    Gift, Percent, Star, Zap, Package, Target, Wine, Leaf, Compass,
    AlertCircle, Loader, Bell
} from 'lucide-react';
import { useSpecials, getTimeUntilExpiry, useNewSpecials } from '../../hooks/useSpecials';

// Role icon mapping
const ROLE_ICONS = {
    trader: Package,
    bountyHunter: Target,
    collector: Compass,
    moonshiner: Wine,
    naturalist: Leaf
};

// Role colors
const ROLE_COLORS = {
    trader: 'text-amber-500 bg-amber-500/20',
    bountyHunter: 'text-red-400 bg-red-500/20',
    collector: 'text-violet-400 bg-violet-500/20',
    moonshiner: 'text-cyan-400 bg-cyan-500/20',
    naturalist: 'text-emerald-400 bg-emerald-500/20'
};

export const SpecialsBanner = () => {
    const { specials, loading, error, refresh, lastFetched } = useSpecials();
    const { newItems, markAllSeen, hasNewItems } = useNewSpecials(specials);
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-mark seen when user expands the banner
    const handleExpand = () => {
        const willExpand = !isExpanded;
        setIsExpanded(willExpand);
        if (willExpand && hasNewItems) {
            // Mark all as seen after a short delay (user has seen them)
            setTimeout(() => markAllSeen(), 2000);
        }
    };

    // Loading state
    if (loading && !specials) {
        return (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-gray-500">
                    <Loader size={16} className="animate-spin" />
                    <span className="text-sm">Loading weekly specials...</span>
                </div>
            </div>
        );
    }

    // Error state (no data at all)
    if (!specials) {
        return (
            <div className="bg-[#121212] border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle size={16} />
                    <span className="text-sm">Unable to load specials: {error}</span>
                </div>
            </div>
        );
    }

    const timeRemaining = getTimeUntilExpiry(specials);
    const hasBonuses = specials.bonuses?.length > 0;
    const hasDiscounts = specials.discounts?.length > 0;
    const hasFreeItems = specials.freeItems?.length > 0;
    const hasLimitedTime = specials.limitedTime?.length > 0;

    return (
        <div className="bg-gradient-to-r from-[#1a1a0a] to-[#121212] border border-[#D4AF37]/30 rounded-xl overflow-hidden mb-6">
            {/* Header - Always Visible */}
            <button
                onClick={handleExpand}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 bg-[#D4AF37]/20 rounded-lg relative ${hasNewItems ? 'animate-pulse' : ''}`}>
                        <Sparkles size={20} className="text-[#D4AF37]" />
                        {hasNewItems && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                        )}
                    </div>
                    <div className="text-left">
                        <div className="text-[#D4AF37] font-western text-lg flex items-center gap-2">
                            {specials.weeklyTheme?.title || 'Weekly Specials'}
                            {hasNewItems && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded-full font-bold animate-pulse">
                                    NEW
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                            {timeRemaining && (
                                <>
                                    <Clock size={10} />
                                    <span>{timeRemaining}</span>
                                </>
                            )}
                            {hasBonuses && (
                                <span className="text-emerald-400">• {specials.bonuses.length} Bonuses</span>
                            )}
                            {hasDiscounts && (
                                <span className="text-amber-400">• {specials.discounts.length} Discounts</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Quick Bonus Pills */}
                    <div className="hidden sm:flex gap-2">
                        {specials.bonuses?.slice(0, 2).map((bonus) => {
                            const RoleIcon = ROLE_ICONS[bonus.role] || Zap;
                            const colors = ROLE_COLORS[bonus.role] || 'text-gray-400 bg-gray-500/20';
                            return (
                                <div
                                    key={bonus.id}
                                    className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${colors}`}
                                >
                                    <RoleIcon size={12} />
                                    {bonus.multiplier}X
                                </div>
                            );
                        })}
                    </div>

                    {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-white/10 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">

                    {/* Bonuses Section */}
                    {hasBonuses && (
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Zap size={10} /> Bonus Payouts
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {specials.bonuses.map((bonus) => {
                                    const RoleIcon = ROLE_ICONS[bonus.role] || Zap;
                                    const colors = ROLE_COLORS[bonus.role] || 'text-white bg-white/10';
                                    const isNew = newItems.has(bonus.id);
                                    return (
                                        <div
                                            key={bonus.id}
                                            className={`p-3 bg-black/30 rounded-lg border transition-all ${isNew
                                                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 animate-pulse'
                                                    : 'border-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`p-1.5 rounded ${colors.split(' ')[1]}`}>
                                                    <RoleIcon size={14} className={colors.split(' ')[0]} />
                                                </div>
                                                <span className="text-white font-bold text-sm">{bonus.label}</span>
                                                {isNew && <Bell size={12} className="text-[#D4AF37]" />}
                                            </div>
                                            <p className="text-xs text-gray-500">{bonus.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Discounts Section */}
                    {hasDiscounts && (
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Percent size={10} /> Discounts
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {specials.discounts.map((discount) => {
                                    const isNew = newItems.has(discount.id);
                                    return (
                                        <div
                                            key={discount.id}
                                            className={`p-3 bg-black/30 rounded-lg border flex justify-between items-center transition-all ${isNew
                                                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 animate-pulse'
                                                    : 'border-white/5'
                                                }`}
                                        >
                                            <div>
                                                <div className="text-white font-medium text-sm flex items-center gap-1">
                                                    {discount.name}
                                                    {isNew && <Bell size={10} className="text-[#D4AF37]" />}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-gray-500 line-through">${discount.originalPrice}</span>
                                                    <span className="text-green-400 ml-2 font-bold">${discount.salePrice}</span>
                                                </div>
                                            </div>
                                            <div className="text-amber-400 font-bold text-lg">
                                                -{discount.percentOff}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Free Items */}
                    {hasFreeItems && (
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Gift size={10} /> Free Items
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {specials.freeItems.map((item) => {
                                    const isNew = newItems.has(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`px-3 py-2 bg-emerald-500/10 border rounded-lg transition-all ${isNew
                                                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 animate-pulse'
                                                    : 'border-emerald-500/30'
                                                }`}
                                        >
                                            <div className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                                                {item.name}
                                                {isNew && <Bell size={10} className="text-[#D4AF37]" />}
                                            </div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Limited Time Items */}
                    {hasLimitedTime && (
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <Star size={10} /> Limited Time
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {specials.limitedTime.map((item) => {
                                    const isNew = newItems.has(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className={`px-3 py-2 bg-purple-500/10 border rounded-lg transition-all ${isNew
                                                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 animate-pulse'
                                                    : 'border-purple-500/30'
                                                }`}
                                        >
                                            <div className="text-purple-400 font-medium text-sm flex items-center gap-1">
                                                {item.name}
                                                {isNew && <Bell size={10} className="text-[#D4AF37]" />}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.price} {item.currency === 'gold' ? 'Gold' : 'Cash'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Prime Gaming */}
                    {specials.primeGaming?.active && (
                        <div className="p-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
                            <div className="text-purple-400 font-bold text-sm mb-1">Prime Gaming Rewards</div>
                            <div className="flex flex-wrap gap-2">
                                {specials.primeGaming.rewards.map((reward, i) => (
                                    <span key={i} className="text-xs text-gray-300 px-2 py-1 bg-black/30 rounded">
                                        {reward}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <div className="text-[10px] text-gray-600">
                            Source: {specials.meta?.source} • Updated: {specials.meta?.lastUpdated ? new Date(specials.meta.lastUpdated).toLocaleDateString() : 'Unknown'}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                refresh();
                            }}
                            disabled={loading}
                            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
