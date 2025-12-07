// FILE: src/components/MissionControl.jsx
// ═══════════════════════════════════════════════════════════════════════════
// MISSION CONTROL - The Brain of RDO COMMAND OS.25
// "What should I do next?" answered in real-time
// Analyzes: Wallet, Roles, Dailies, Events, Cart → Outputs prioritized action
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import {
    Zap, Target, Package, Search, Leaf, Coins, DollarSign,
    Clock, Calendar, ChevronRight, AlertCircle, Star, TrendingUp
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useDailies, extractDailyKeywords } from '../../hooks/useDailies';
import { getNextEvent, getCurrentActiveEvent } from '../../utils/schedule-logic';
import { ROLES } from '../../data/rdo-data';
import { getLevelFromXP } from '../../utils/rdo-logic';

// Action type metadata
const ACTION_TYPES = {
    event: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'FREE ROAM EVENT' },
    daily: { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'DAILY CHALLENGE' },
    role: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'ROLE PROGRESSION' },
    gold: { icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'GOLD FARMING' },
    cash: { icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20', label: 'CASH FARMING' },
    unlock: { icon: Target, color: 'text-red-400', bg: 'bg-red-500/20', label: 'UNLOCK PRIORITY' },
};

// Role icons for recommendations
const ROLE_ICONS = {
    bountyHunter: Target,
    trader: Package,
    collector: Search,
    moonshiner: Coins,
    naturalist: Leaf,
};

/**
 * Analyze current game state and return prioritized actions
 */
function analyzeOptimalActions(profile, dailies, nextEvent, activeEvent) {
    const actions = [];
    const level = getLevelFromXP(profile.xp);

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 1: Active God-Tier Event (DROP EVERYTHING)
    // ═══════════════════════════════════════════════════════════════════════
    if (activeEvent && activeEvent.value === 'god_tier') {
        actions.push({
            priority: 0,
            type: 'event',
            title: `JOIN ${activeEvent.name.toUpperCase()} NOW`,
            description: `${activeEvent.minsLeft} minutes left! This is a God-Tier event.`,
            urgency: 'critical',
            reward: activeEvent.type === 'trader' ? '18 free goods' : '~$1000 value',
            action: 'Open Free Roam menu → Events'
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 2: Upcoming God-Tier Event (< 10 mins)
    // ═══════════════════════════════════════════════════════════════════════
    if (nextEvent.value === 'god_tier' && nextEvent.minsRemaining <= 10 && !activeEvent) {
        actions.push({
            priority: 1,
            type: 'event',
            title: `PREPARE FOR ${nextEvent.name.toUpperCase()}`,
            description: `Starts in ${nextEvent.minsRemaining} minutes. Position yourself now.`,
            urgency: 'high',
            reward: nextEvent.type === 'trader' ? '18 free goods' : '~$1000 value',
            action: 'Clear inventory, fast travel to central location'
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 3: Role Unlock (No roles = get Bounty Hunter first)
    // ═══════════════════════════════════════════════════════════════════════
    const roleXPs = Object.values(profile.roles);
    const hasAnyRole = roleXPs.some(xp => xp > 0);
    const totalGold = profile.gold;

    if (!hasAnyRole) {
        if (totalGold >= 15) {
            actions.push({
                priority: 2,
                type: 'unlock',
                title: 'UNLOCK BOUNTY HUNTER ROLE',
                description: 'Your first role. Unlocks gold-earning missions.',
                urgency: 'high',
                reward: 'Unlock gold payouts + progression',
                action: 'Visit Rhodes Bounty Board'
            });
        } else {
            actions.push({
                priority: 2,
                type: 'gold',
                title: 'FARM GOLD FOR FIRST ROLE',
                description: `Need 15 Gold Bars for Bounty Hunter. You have ${totalGold.toFixed(2)}.`,
                urgency: 'high',
                reward: '15 GB needed',
                action: 'Complete Stranger Missions, wait for 12-min mark'
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 4: Daily Challenges (streak maintenance)
    // ═══════════════════════════════════════════════════════════════════════
    if (dailies && !dailies.isFallback) {
        const keywords = extractDailyKeywords(dailies);
        const easyDailies = [];

        // Find "easy" dailies based on keywords
        for (const [category, challenges] of Object.entries(dailies.categories)) {
            for (const challenge of challenges) {
                const title = challenge.title.toLowerCase();
                // Easy patterns: "visit", "cook", "eat", "pet", "collect"
                if (title.includes('visit') || title.includes('cook') ||
                    title.includes('eat') || title.includes('pet') ||
                    title.includes('collect 1') || title.includes('pick')) {
                    easyDailies.push({ ...challenge, category });
                }
            }
        }

        if (easyDailies.length > 0) {
            actions.push({
                priority: 3,
                type: 'daily',
                title: 'COMPLETE EASY DAILY',
                description: easyDailies[0].title,
                urgency: 'medium',
                reward: `+${easyDailies[0].gold} GB (streak bonus)`,
                action: 'Quick completion to maintain streak'
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 5: Role Progression (level up underleveled roles)
    // ═══════════════════════════════════════════════════════════════════════
    const roleEntries = Object.entries(profile.roles);
    const unlockedRoles = roleEntries.filter(([_, xp]) => xp > 0);

    if (unlockedRoles.length > 0) {
        // Find lowest level role for focus
        const lowestRole = unlockedRoles.reduce((lowest, [key, xp]) => {
            const roleLevel = Math.floor(xp / 1000); // Rough level calc
            if (!lowest || roleLevel < lowest.level) {
                return { key, level: roleLevel, xp };
            }
            return lowest;
        }, null);

        if (lowestRole && lowestRole.level < 20) {
            const RoleIcon = ROLE_ICONS[lowestRole.key] || Star;
            const roleName = ROLES[lowestRole.key]?.name || lowestRole.key;

            actions.push({
                priority: 4,
                type: 'role',
                title: `LEVEL ${roleName.toUpperCase()}`,
                description: `Currently level ${lowestRole.level}. Focus here for fastest unlock progression.`,
                urgency: 'low',
                reward: 'Role unlocks + passive bonuses',
                action: `Do ${roleName} activities`
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 6: Cash Farming (if low on cash)
    // ═══════════════════════════════════════════════════════════════════════
    if (profile.cash < 500) {
        const hasTrader = profile.roles.trader > 0;
        const hasCollector = profile.roles.collector > 0;

        if (hasCollector) {
            actions.push({
                priority: 5,
                type: 'cash',
                title: 'COLLECTOR RUN',
                description: 'Use Jean Ropke map for collection sets.',
                urgency: 'low',
                reward: '$300-500/hour',
                action: 'jeanropke.github.io/RDR2CollectorsMap'
            });
        } else if (hasTrader) {
            actions.push({
                priority: 5,
                type: 'cash',
                title: 'TRADER DELIVERY',
                description: 'Fill materials and do a long-distance sale.',
                urgency: 'low',
                reward: '$625 per full wagon',
                action: 'Hunt → Fill Cripps → Sell Long Distance'
            });
        } else {
            actions.push({
                priority: 5,
                type: 'cash',
                title: 'HUNT FOR BUTCHER',
                description: 'Hunt deer/elk near Valentine, sell to butcher.',
                urgency: 'low',
                reward: '$50-100/trip',
                action: 'Use Varmint Rifle for small game'
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRIORITY 7: Upcoming Event (general awareness)
    // ═══════════════════════════════════════════════════════════════════════
    if (nextEvent && !actions.find(a => a.type === 'event')) {
        const isWorth = nextEvent.value !== 'low';
        if (isWorth) {
            actions.push({
                priority: 6,
                type: 'event',
                title: `${nextEvent.name.toUpperCase()} IN ${nextEvent.minsRemaining}M`,
                description: `${nextEvent.value.toUpperCase()} value event coming up.`,
                urgency: 'low',
                reward: 'XP + rewards',
                action: 'Plan around this timing'
            });
        }
    }

    // Sort by priority
    return actions.sort((a, b) => a.priority - b.priority);
}

/**
 * MissionControl - The "What should I do?" panel
 */
export const MissionControl = () => {
    const { profile } = useProfile();
    const { dailies } = useDailies();

    const nextEvent = useMemo(() => getNextEvent(), []);
    const activeEvent = useMemo(() => getCurrentActiveEvent(), []);

    const actions = useMemo(() =>
        analyzeOptimalActions(profile, dailies, nextEvent, activeEvent),
        [profile, dailies, nextEvent, activeEvent]
    );

    const primaryAction = actions[0];
    const secondaryActions = actions.slice(1, 4);

    if (!primaryAction) {
        return (
            <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
                <div className="text-center text-gray-500">
                    <Zap size={24} className="mx-auto mb-2 opacity-50" />
                    <p>No recommendations available</p>
                    <p className="text-xs mt-1">Input your wallet state to get started</p>
                </div>
            </div>
        );
    }

    const PrimaryIcon = ACTION_TYPES[primaryAction.type]?.icon || Zap;
    const primaryConfig = ACTION_TYPES[primaryAction.type];

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-b border-white/5">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#D4AF37]" />
                    <h3 className="font-bold text-white text-sm">MISSION CONTROL</h3>
                    <span className="text-[10px] text-gray-500 font-mono ml-auto">NEXT ACTION</span>
                </div>
            </div>

            {/* Primary Action */}
            <div className={`p-4 ${primaryAction.urgency === 'critical' ? 'bg-red-500/10 animate-pulse' : primaryAction.urgency === 'high' ? 'bg-amber-500/10' : ''}`}>
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${primaryConfig.bg}`}>
                        <PrimaryIcon size={20} className={primaryConfig.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold ${primaryConfig.color} uppercase tracking-wider`}>
                                {primaryConfig.label}
                            </span>
                            {primaryAction.urgency === 'critical' && (
                                <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                                    NOW
                                </span>
                            )}
                            {primaryAction.urgency === 'high' && (
                                <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold">
                                    URGENT
                                </span>
                            )}
                        </div>
                        <h4 className="text-white font-bold text-lg leading-tight">{primaryAction.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{primaryAction.description}</p>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1 text-xs">
                                <Coins size={12} className="text-yellow-400" />
                                <span className="text-yellow-400 font-medium">{primaryAction.reward}</span>
                            </div>
                        </div>

                        <div className="mt-3 p-2 bg-black/30 rounded border border-white/5">
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <ChevronRight size={12} className="text-[#D4AF37]" />
                                <span>{primaryAction.action}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Actions */}
            {secondaryActions.length > 0 && (
                <div className="border-t border-white/5">
                    <div className="px-4 py-2 bg-white/5">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                            QUEUE ({secondaryActions.length})
                        </span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {secondaryActions.map((action, idx) => {
                            const config = ACTION_TYPES[action.type];
                            const Icon = config?.icon || Zap;
                            return (
                                <div key={idx} className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
                                    <Icon size={14} className={config?.color || 'text-gray-400'} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white truncate">{action.title}</div>
                                        <div className="text-xs text-gray-500 truncate">{action.description}</div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">{action.reward}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5">
                <p className="text-[9px] text-gray-600 text-center">
                    Recommendations update automatically • Based on your current wallet + roles
                </p>
            </div>
        </div>
    );
};
