/**
 * Compendium - Legendary Animal Tracker with Cooldown System
 * 
 * Features:
 * - Groups legendary animals by species
 * - 72-hour cooldown tracking (per-species)
 * - Visual countdown timers
 * - Kill logging with timestamps
 * - Daily/Weekly reset timers
 * - Event schedule display
 * 
 * @module components/Compendium
 */

import React, { useState, useMemo } from 'react';
import { useGameTimers } from '../../hooks/useGameTimers';
import { LEGENDARY_ANIMALS, FREE_ROAM_EVENTS } from '../../data/encyclopedia';
import {
    Clock,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Crown,
    Calendar,
    AlertCircle
} from 'lucide-react';

const SPECIES_ICONS = {
    BEAR: '🐻',
    CAT: '🐆',
    GATOR: '🐊',
    BISON: '🦬'
};

const SPECIES_COLORS = {
    BEAR: 'border-amber-600',
    CAT: 'border-purple-600',
    GATOR: 'border-green-600',
    BISON: 'border-orange-600'
};

/**
 * Individual species group with cooldown status
 */
const SpeciesGroup = ({ species, animals, status, onLogKill }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`border-l-4 ${SPECIES_COLORS[species] || 'border-stone-600'} bg-stone-900 rounded-r`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{SPECIES_ICONS[species] || '🦌'}</span>
                    <div>
                        <div className="font-western text-stone-200">{species}</div>
                        <div className="text-xs text-stone-500">{animals.length} legendaries</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    {status.available ? (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                            <Check size={14} />
                            AVAILABLE
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-red-400 text-sm font-mono">
                            <Clock size={14} />
                            {status.remainingFormatted}
                        </span>
                    )}

                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                    {/* Cooldown Info */}
                    {!status.available && status.killedAnimal && (
                        <div className="text-xs text-stone-500 px-2 py-1 bg-stone-800 rounded">
                            Last kill: {status.killedAnimal} ({new Date(status.killedAt).toLocaleDateString()})
                        </div>
                    )}

                    {/* Animal List */}
                    <div className="space-y-1">
                        {animals.map(animal => (
                            <div
                                key={animal.id}
                                className="flex items-center justify-between p-2 bg-stone-800 rounded text-sm"
                            >
                                <div>
                                    <div className="text-stone-200">{animal.name}</div>
                                    <div className="text-xs text-stone-500">{animal.location}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400 font-mono text-xs">${animal.value}</span>
                                    <button
                                        onClick={() => onLogKill(animal.id)}
                                        disabled={!status.available}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${status.available
                                            ? 'bg-red-600 hover:bg-red-500 text-white'
                                            : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                                            }`}
                                    >
                                        LOG
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Spawn Conditions */}
                    {animals[0]?.time && (
                        <div className="text-xs text-stone-400 mt-2">
                            <span className="text-stone-500">Active:</span> {animals[0].time}
                            {animals[0].weather && ` | Weather: ${animals[0].weather}`}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/**
 * Event Schedule Panel
 */
const EventSchedule = ({ events }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-stone-700 rounded">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 flex items-center justify-between text-left bg-stone-800"
            >
                <div className="flex items-center gap-2">
                    <Calendar className="text-blue-400" size={18} />
                    <span className="font-western text-stone-200">FREE ROAM EVENTS</span>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
                <div className="p-3 space-y-2">
                    {events.map((event, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-stone-900 rounded text-sm"
                        >
                            <div>
                                <div className="text-stone-200">{event.name}</div>
                                <div className="text-xs text-stone-500">{event.type}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-green-400 text-xs">{event.benefit}</div>
                                <div className="text-xs text-stone-500">{event.duration}min</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Main Compendium Component
 */
export const Compendium = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const {
        registerKill,
        allStatuses,
        getTimeUntilDailyReset,
        getTimeUntilWeeklyReset
    } = useGameTimers();

    // Group legendaries by species
    const speciesGroups = useMemo(() => {
        const groups = {};
        for (const animal of LEGENDARY_ANIMALS) {
            if (!groups[animal.species]) {
                groups[animal.species] = [];
            }
            groups[animal.species].push(animal);
        }
        return groups;
    }, []);

    const dailyReset = getTimeUntilDailyReset();
    const weeklyReset = getTimeUntilWeeklyReset();

    // Count available species
    const availableCount = Object.values(allStatuses).filter(s => s.available).length;
    const totalSpecies = Object.keys(allStatuses).length;

    return (
        <div className="card-rdo">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-3">
                    <Crown className="text-amber-400" size={20} />
                    <h3 className="font-western text-lg text-glow-gold">COMPENDIUM</h3>
                    <span className="text-xs text-stone-500">
                        ({availableCount}/{totalSpecies} species available)
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="text-stone-500 group-hover:text-stone-300" size={18} />
                ) : (
                    <ChevronDown className="text-stone-500 group-hover:text-stone-300" size={18} />
                )}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* Reset Timers */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-stone-900 rounded border border-stone-700 text-center">
                            <div className="text-xs text-stone-500 uppercase">Daily Reset</div>
                            <div className="text-lg font-mono text-amber-400">{dailyReset.formatted}</div>
                        </div>
                        <div className="p-2 bg-stone-900 rounded border border-stone-700 text-center">
                            <div className="text-xs text-stone-500 uppercase">Weekly Reset</div>
                            <div className="text-lg font-mono text-blue-400">{weeklyReset.formatted}</div>
                        </div>
                    </div>

                    {/* Cooldown Info Banner */}
                    <div className="flex items-start gap-2 p-2 bg-stone-800 rounded text-xs text-stone-400">
                        <AlertCircle size={14} className="mt-0.5 text-amber-400" />
                        <span>
                            Legendary animals share a <strong className="text-amber-400">72-hour cooldown</strong> per species.
                            Killing one blocks all others of the same species.
                        </span>
                    </div>

                    {/* Species Groups */}
                    <div className="space-y-2">
                        {Object.entries(speciesGroups).map(([species, animals]) => (
                            <SpeciesGroup
                                key={species}
                                species={species}
                                animals={animals}
                                status={allStatuses[species] || { available: true, remainingFormatted: '00:00' }}
                                onLogKill={registerKill}
                            />
                        ))}
                    </div>

                    {/* Event Schedule */}
                    <EventSchedule events={FREE_ROAM_EVENTS} />
                </div>
            )}
        </div>
    );
};

export default Compendium;
