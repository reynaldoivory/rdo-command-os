// FILE: src/components/Chronometer.jsx
// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EVENT CHRONOMETER
// The heartbeat of RDO COMMAND OS.25 - Proactive event alerting system
// Lives in header, updates every minute, screams at user for God Tier events
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertCircle, Zap, Target, Search, Package, Leaf, Swords, Trophy, ChevronDown } from 'lucide-react';
import { getNextEvent, getUpcomingEvents, getCurrentActiveEvent, VALUE_TIERS } from '../../utils/schedule-logic';

// Icon map for event types
const TYPE_ICONS = {
    bounty: Target,
    collector: Search,
    trader: Package,
    naturalist: Leaf,
    pvp: Swords,
    challenge: Trophy,
};

/**
 * Chronometer - Header widget showing next Free Roam Event
 * Features:
 * - 60-second tick cycle
 * - Visual urgency escalation (color, pulse, bounce)
 * - Audio alert stub for God Tier events < 10 mins
 * - Expandable upcoming events list
 */
export const Chronometer = () => {
    const [event, setEvent] = useState(() => getNextEvent());
    const [activeEvent, setActiveEvent] = useState(() => getCurrentActiveEvent());
    const [alertTriggered, setAlertTriggered] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Tick function - called every 60 seconds
    const tick = useCallback(() => {
        const next = getNextEvent();
        const active = getCurrentActiveEvent();
        setEvent(next);
        setActiveEvent(active);

        // God Tier Alert Logic
        if (next.value === 'god_tier' && next.minsRemaining <= 10 && !alertTriggered) {
            // Audio trigger (stub - integrate with SoundEngine when available)
            try {
                // Attempt browser notification if permitted
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('RDO COMMAND', {
                        body: `${next.name} in ${next.minsRemaining} minutes!`,
                        icon: '/favicon.ico',
                        tag: 'rdo-event-alert'
                    });
                }
            } catch {
                // Notifications not available
            }
            setAlertTriggered(true);
        }

        // Reset trigger after event passes
        if (next.minsRemaining > 10) {
            setAlertTriggered(false);
        }
    }, [alertTriggered]);

    useEffect(() => {
        // Initial tick - deferred to avoid setState in effect warning
        const initialTimeout = setTimeout(() => {
            tick();
        }, 0);

        // Tick every 60 seconds
        const timer = setInterval(tick, 60000);

        // Request notification permission on mount
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(timer);
        };
    }, [tick]);

    // Load upcoming events when expanded
    useEffect(() => {
        if (expanded) {
            // Defer to avoid setState in effect warning
            setTimeout(() => {
                setUpcomingEvents(getUpcomingEvents(5));
            }, 0);
        }
    }, [expanded, event]);

    // Visual styling based on urgency and value
    const isUrgent = event.minsRemaining <= 10;
    const isGodTier = event.value === 'god_tier';
    const isHigh = event.value === 'high';

    const TypeIcon = TYPE_ICONS[event.type] || Clock;

    // Determine styling
    let containerClass = 'border-white/10';
    let textClass = 'text-gray-400';
    let iconClass = '';
    let glowClass = '';

    if (activeEvent) {
        // Currently active event - show green "LIVE" indicator
        containerClass = 'border-green-500 bg-green-500/10';
        textClass = 'text-green-400';
    } else if (isGodTier) {
        containerClass = isUrgent
            ? 'border-amber-500 animate-pulse bg-amber-500/10'
            : 'border-amber-500/50';
        textClass = 'text-amber-500';
        iconClass = isUrgent ? 'animate-bounce' : '';
        glowClass = isUrgent ? 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' : '';
    } else if (isHigh) {
        containerClass = isUrgent ? 'border-green-500' : 'border-green-500/50';
        textClass = 'text-green-400';
    } else if (isUrgent) {
        containerClass = 'border-blue-500';
        textClass = 'text-blue-400';
    }

    return (
        <div className="relative">
            {/* Main Chronometer Display */}
            <button
                onClick={() => setExpanded(!expanded)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border bg-[#0a0a0a] ${containerClass} ${glowClass} transition-all hover:bg-[#111] cursor-pointer`}
            >
                {/* Event Type Icon + Name */}
                <div className={`flex items-center gap-2 ${textClass} font-bold text-sm`}>
                    {activeEvent ? (
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-green-400 font-mono">LIVE</span>
                        </div>
                    ) : (
                        <TypeIcon size={16} className={iconClass} />
                    )}
                    <span className="uppercase tracking-wider max-w-[120px] truncate">
                        {activeEvent ? activeEvent.name : event.name}
                    </span>
                </div>

                {/* Divider */}
                <div className="h-4 w-px bg-white/10" />

                {/* Countdown */}
                <div className="font-mono text-xl font-black text-white leading-none">
                    {activeEvent ? (
                        <span className="text-green-400">{activeEvent.minsLeft}</span>
                    ) : (
                        event.minsRemaining
                    )}
                    <span className="text-[10px] text-gray-500 ml-0.5">m</span>
                </div>

                {/* Label */}
                <div className="text-[9px] text-gray-600 font-mono uppercase tracking-widest text-right leading-tight">
                    {activeEvent ? 'Left' : 'Until'}<br />
                    {activeEvent ? 'Active' : 'Event'}
                </div>

                {/* Expand Indicator */}
                <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expanded Upcoming Events Panel */}
            {expanded && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-white/5 bg-white/5">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                            Upcoming Events (UTC)
                        </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {upcomingEvents.map((evt, idx) => {
                            const EvtIcon = TYPE_ICONS[evt.type] || Clock;
                            const tier = VALUE_TIERS[evt.value];
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-3 px-3 py-2 border-b border-white/5 last:border-0 ${evt.value === 'god_tier' ? 'bg-amber-500/5' : ''
                                        }`}
                                >
                                    <EvtIcon size={14} className={evt.typeConfig.color} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white truncate">{evt.name}</div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 font-mono">
                                                {evt.eventTimeUTC}
                                            </span>
                                            <span className={`text-[9px] font-bold ${tier.color}`}>
                                                {tier.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono text-sm text-gray-400">
                                            {evt.minsRemaining}m
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="px-3 py-2 border-t border-white/5 bg-white/5">
                        <span className="text-[9px] text-gray-600">
                            Events repeat every 45 min • God Tier = Don't miss
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
