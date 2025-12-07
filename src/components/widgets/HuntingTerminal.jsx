/**
 * HuntingTerminal - Interactive hunting guide and loadout auditor
 * 
 * Features:
 * - Animal selection with size class filters
 * - Kill methodology display (weapon/ammo requirements)
 * - Material yield and economy data
 * - Spawn location data
 * - Loadout audit against user inventory
 * - "Mark Hotspot" for TravelMap integration
 * 
 * @module components/HuntingTerminal
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useHuntingDB } from '../../hooks/useHuntingDB';
import { useDailies, extractDailyKeywords } from '../../hooks/useDailies';
import { WagonCalculator } from './WagonCalculator';
import { Target, MapPin, AlertTriangle, Check, ChevronDown, ChevronUp, Search, Truck, Calendar, Zap } from 'lucide-react';

const SIZE_CLASSES = ['all', 'SMALL', 'MODERATE', 'MEDIUM', 'LARGE', 'MASSIVE'];

const SIZE_COLORS = {
    SMALL: 'text-green-400',
    MODERATE: 'text-blue-400',
    MEDIUM: 'text-yellow-400',
    LARGE: 'text-orange-400',
    MASSIVE: 'text-red-400'
};

/**
 * @param {Object} props
 * @param {string[]} [props.userWeapons] - Array of weapon IDs user owns
 * @param {Object} [props.profile] - User profile with roles for value calculation
 * @param {Function} [props.onLocate] - Callback when user wants to mark spawn on map
 */
export const HuntingTerminal = ({ userWeapons = [], profile = {}, onLocate }) => {
    const { animals, loading, error, validateLoadout, getOptimalValue, canCarryCarcass } = useHuntingDB();
    const { dailies } = useDailies();

    const [isExpanded, setIsExpanded] = useState(true);
    const [sizeFilter, setSizeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [showWagonCalc, setShowWagonCalc] = useState(false);
    const [quickHuntActive, setQuickHuntActive] = useState(false);

    // Check if user has Trader role
    const hasTrader = (profile?.roles?.trader ?? 0) > 0;

    // Extract daily keywords for priority highlighting
    const dailyKeywords = useMemo(() => extractDailyKeywords(dailies), [dailies]);

    // Check if an animal matches today's dailies
    const isDailyPriority = useCallback((animal) => {
        if (!dailyKeywords.length) return false;
        const animalName = animal.name.toLowerCase();
        const animalTags = animal.tags?.map(t => t.toLowerCase()) || [];

        return dailyKeywords.some(keyword =>
            animalName.includes(keyword) ||
            animalTags.some(tag => tag.includes(keyword))
        );
    }, [dailyKeywords]);

    // Get all daily priority animals
    const dailyPriorityAnimals = useMemo(() => {
        return animals.filter(isDailyPriority);
    }, [animals, isDailyPriority]);

    // Quick Hunt: Auto-select first daily priority animal
    const startQuickHunt = useCallback(() => {
        if (dailyPriorityAnimals.length > 0) {
            setSelectedAnimal(dailyPriorityAnimals[0]);
            setQuickHuntActive(true);
            setIsExpanded(true);
        }
    }, [dailyPriorityAnimals]);

    // Filter animals by size and search, with daily priorities first
    const filteredAnimals = useMemo(() => {
        let result = animals;

        if (sizeFilter !== 'all') {
            result = result.filter(a => a.sizeClass === sizeFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.tags?.some(t => t.toLowerCase().includes(q))
            );
        }

        // Sort daily priorities to top
        return result.sort((a, b) => {
            const aDaily = isDailyPriority(a);
            const bDaily = isDailyPriority(b);
            if (aDaily && !bDaily) return -1;
            if (!aDaily && bDaily) return 1;
            return 0;
        });
    }, [animals, sizeFilter, searchQuery, isDailyPriority]);

    // Get loadout status for selected animal
    const loadoutStatus = useMemo(() => {
        if (!selectedAnimal) return null;
        return validateLoadout(selectedAnimal, userWeapons);
    }, [selectedAnimal, userWeapons, validateLoadout]);

    // Get economy value for selected animal
    const selectedValue = useMemo(() => {
        if (!selectedAnimal) return null;
        return getOptimalValue(selectedAnimal, profile?.roles);
    }, [selectedAnimal, profile?.roles, getOptimalValue]);

    const handleLocate = useCallback(() => {
        if (selectedAnimal?.spawns?.hotspots?.length > 0 && onLocate) {
            onLocate({
                animalId: selectedAnimal.id,
                animalName: selectedAnimal.name,
                hotspots: selectedAnimal.spawns.hotspots
            });
        }
    }, [selectedAnimal, onLocate]);

    if (loading) {
        return (
            <div className="card-rdo animate-pulse">
                <div className="h-6 bg-stone-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-stone-700 rounded w-2/3"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card-rdo border-red-800">
                <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle size={18} />
                    <span>Failed to load hunting database: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card-rdo">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-3">
                    <Target className="text-red-400" size={20} />
                    <h3 className="font-western text-lg text-glow-gold">HUNTING TERMINAL</h3>
                    <span className="text-xs text-stone-500">({animals.length} species)</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="text-stone-500 group-hover:text-stone-300" size={18} />
                ) : (
                    <ChevronDown className="text-stone-500 group-hover:text-stone-300" size={18} />
                )}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {/* Search + Filters */}
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search animals..."
                                className="w-full pl-10 pr-4 py-2 bg-stone-900 border border-stone-700 rounded text-stone-200 placeholder-stone-500 focus:border-amber-600 focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {SIZE_CLASSES.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSizeFilter(size)}
                                    className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${sizeFilter === size
                                        ? 'bg-amber-600 text-black'
                                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                                        }`}
                                >
                                    {size === 'all' ? 'ALL' : size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Daily Priority Banner + Quick Hunt */}
                    {dailyKeywords.length > 0 && (
                        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Calendar size={14} className="text-amber-400 flex-shrink-0" />
                                <span className="text-xs text-amber-400 font-medium">Today's Targets:</span>
                                <span className="text-xs text-amber-300 truncate">
                                    {dailyKeywords.slice(0, 3).join(', ')}{dailyKeywords.length > 3 ? '...' : ''}
                                </span>
                            </div>
                            {dailyPriorityAnimals.length > 0 && (
                                <button
                                    onClick={startQuickHunt}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all flex-shrink-0 ${quickHuntActive
                                        ? 'bg-green-600 text-white'
                                        : 'bg-amber-500 text-black hover:bg-amber-400'
                                        }`}
                                >
                                    <Zap size={12} />
                                    {quickHuntActive ? 'HUNTING' : 'QUICK HUNT'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Animal List */}
                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-700">
                        <div className="grid grid-cols-2 gap-2">
                            {filteredAnimals.map(animal => {
                                const isDaily = isDailyPriority(animal);
                                return (
                                    <button
                                        key={animal.id}
                                        onClick={() => setSelectedAnimal(animal)}
                                        className={`text-left px-3 py-2 rounded border transition-all relative ${selectedAnimal?.id === animal.id
                                            ? 'bg-stone-800 border-amber-600'
                                            : isDaily
                                                ? 'bg-amber-900/20 border-amber-600/50 hover:border-amber-500'
                                                : 'bg-stone-900 border-stone-700 hover:border-stone-600'
                                            }`}
                                    >
                                        {isDaily && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                                                <Zap size={10} className="text-black" />
                                            </div>
                                        )}
                                        <div className="font-medium text-stone-200 text-sm">{animal.name}</div>
                                        <div className={`text-xs ${SIZE_COLORS[animal.sizeClass] || 'text-stone-500'}`}>
                                            {animal.sizeClass}
                                            {isDaily && <span className="ml-2 text-amber-400">• DAILY</span>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {filteredAnimals.length === 0 && (
                            <div className="text-center text-stone-500 py-4">No animals match filter</div>
                        )}
                    </div>

                    {/* Selected Animal Details */}
                    {selectedAnimal && (
                        <div className={`mt-4 p-4 rounded border space-y-4 ${quickHuntActive && isDailyPriority(selectedAnimal)
                                ? 'bg-amber-900/20 border-amber-600'
                                : 'bg-stone-900 border-stone-700'
                            }`}>
                            {/* Quick Hunt Header */}
                            {quickHuntActive && isDailyPriority(selectedAnimal) && (
                                <div className="flex items-center justify-between pb-3 border-b border-amber-600/30">
                                    <div className="flex items-center gap-2">
                                        <Zap size={16} className="text-amber-400" />
                                        <span className="text-amber-400 font-bold text-sm">QUICK HUNT ACTIVE</span>
                                    </div>
                                    <button
                                        onClick={() => setQuickHuntActive(false)}
                                        className="text-xs text-stone-400 hover:text-white"
                                    >
                                        Exit
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <h4 className="font-western text-lg text-amber-400">{selectedAnimal.name}</h4>
                                <span className={`text-xs font-mono px-2 py-1 rounded ${SIZE_COLORS[selectedAnimal.sizeClass]} bg-stone-800`}>
                                    {selectedAnimal.sizeClass}
                                </span>
                            </div>

                            {/* Kill Methodology */}
                            <div className="space-y-2">
                                <h5 className="text-xs uppercase text-stone-500 tracking-wider">Kill Methodology</h5>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-500">Weapon:</span>
                                        <span className="text-stone-200 capitalize">{selectedAnimal.perfectKill?.requiredWeaponClass}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-500">Ammo:</span>
                                        <span className="text-stone-200">{selectedAnimal.perfectKill?.ammoNotes?.split('.')[0] || 'Standard'}</span>
                                    </div>
                                </div>
                                {selectedAnimal.perfectKill?.ammoNotes && (
                                    <div className="text-xs text-yellow-400 italic">{selectedAnimal.perfectKill.ammoNotes}</div>
                                )}
                            </div>

                            {/* Loadout Audit */}
                            {loadoutStatus && (
                                <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded ${loadoutStatus.ready
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-red-900/30 text-red-400'
                                    }`}>
                                    {loadoutStatus.ready ? (
                                        <>
                                            <Check size={16} />
                                            <span>Loadout Ready</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle size={16} />
                                            <span>Missing: {loadoutStatus.missing.join(', ')}</span>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Economy */}
                            <div className="space-y-2">
                                <h5 className="text-xs uppercase text-stone-500 tracking-wider">Economy</h5>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-center p-2 bg-stone-800 rounded">
                                        <div className="text-green-400 font-mono">${selectedAnimal.economy?.butcher?.perfectCarcassValueCash?.toFixed(2) || '0.00'}</div>
                                        <div className="text-xs text-stone-500">Butcher (Carcass)</div>
                                    </div>
                                    <div className="text-center p-2 bg-stone-800 rounded">
                                        <div className="text-amber-500 font-mono">{selectedAnimal.economy?.trader?.materialsPerfectCarcass?.toFixed(2) || '0.00'}</div>
                                        <div className="text-xs text-stone-500">Trader (Materials)</div>
                                    </div>
                                </div>
                                {selectedValue && (
                                    <div className={`text-center p-2 bg-stone-800/50 rounded border border-stone-700`}>
                                        <div className="text-xs text-stone-500 mb-1">OPTIMAL VALUE</div>
                                        <div className={`text-lg font-mono font-bold ${selectedValue.color}`}>
                                            {selectedValue.type === 'BUTCHER' ? '$' : ''}{selectedValue.value.toFixed(2)}
                                            <span className="text-xs text-stone-500 ml-1">{selectedValue.label}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Spawn Info */}
                            <div className="space-y-2">
                                <h5 className="text-xs uppercase text-stone-500 tracking-wider">Spawn</h5>
                                <div className="text-sm space-y-1">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={14} className="text-stone-500 mt-0.5" />
                                        <span className="text-stone-300">{selectedAnimal.spawns?.regions?.join(', ') || 'Various'}</span>
                                    </div>
                                    {selectedAnimal.spawns?.timeOfDay && selectedAnimal.spawns.timeOfDay !== 'any' && (
                                        <div className="text-xs text-stone-400">Time: {selectedAnimal.spawns.timeOfDay}</div>
                                    )}
                                    {selectedAnimal.spawns?.weather && selectedAnimal.spawns.weather !== 'any' && (
                                        <div className="text-xs text-stone-400">Weather: {selectedAnimal.spawns.weather}</div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {onLocate && selectedAnimal.spawns?.hotspots?.length > 0 && (
                                    <button
                                        onClick={handleLocate}
                                        className={`flex-1 py-2 font-medium rounded transition-colors flex items-center justify-center gap-2 text-xs ${quickHuntActive && isDailyPriority(selectedAnimal)
                                                ? 'bg-green-600 hover:bg-green-500 text-white'
                                                : 'bg-amber-600 hover:bg-amber-500 text-black'
                                            }`}
                                    >
                                        <MapPin size={14} />
                                        {quickHuntActive && isDailyPriority(selectedAnimal) ? 'GO TO SPAWN' : 'MARK HOTSPOT'}
                                    </button>
                                )}
                                {quickHuntActive && dailyPriorityAnimals.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const currentIdx = dailyPriorityAnimals.findIndex(a => a.id === selectedAnimal?.id);
                                            const nextIdx = (currentIdx + 1) % dailyPriorityAnimals.length;
                                            setSelectedAnimal(dailyPriorityAnimals[nextIdx]);
                                        }}
                                        className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 font-medium rounded transition-colors flex items-center justify-center gap-2 text-xs"
                                    >
                                        NEXT TARGET
                                    </button>
                                )}
                            </div>

                            {/* Quick Hunt Checklist */}
                            {quickHuntActive && isDailyPriority(selectedAnimal) && (
                                <div className="mt-2 p-3 bg-black/30 rounded border border-amber-600/20 space-y-2">
                                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Hunt Checklist</div>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-2">
                                            {loadoutStatus?.ready ? (
                                                <Check size={12} className="text-green-400" />
                                            ) : (
                                                <AlertTriangle size={12} className="text-red-400" />
                                            )}
                                            <span className={loadoutStatus?.ready ? 'text-green-400' : 'text-red-400'}>
                                                {loadoutStatus?.ready ? 'Loadout ready' : `Need: ${loadoutStatus?.missing?.join(', ')}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedAnimal.sizeClass !== 'MASSIVE' ? (
                                                <Check size={12} className="text-green-400" />
                                            ) : (
                                                <AlertTriangle size={12} className="text-yellow-400" />
                                            )}
                                            <span className={selectedAnimal.sizeClass !== 'MASSIVE' ? 'text-green-400' : 'text-yellow-400'}>
                                                {selectedAnimal.sizeClass !== 'MASSIVE' ? 'Can carry carcass' : 'Skin only (MASSIVE)'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasTrader ? (
                                                <Check size={12} className="text-green-400" />
                                            ) : (
                                                <AlertTriangle size={12} className="text-yellow-400" />
                                            )}
                                            <span className={hasTrader ? 'text-green-400' : 'text-yellow-400'}>
                                                {hasTrader ? 'Trader role unlocked' : 'Consider Trader role for max value'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Size Warning for MASSIVE */}
                            {selectedAnimal.sizeClass === 'MASSIVE' && (
                                <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-700/30 p-2 rounded flex items-center gap-2">
                                    <AlertTriangle size={12} />
                                    <span>MASSIVE - Cannot carry carcass. Skin only.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Wagon Calculator Toggle */}
                    <div className="mt-4">
                        <button
                            onClick={() => setShowWagonCalc(!showWagonCalc)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-lg text-amber-400 font-bold text-sm transition-colors"
                        >
                            <Truck size={16} />
                            {showWagonCalc ? 'HIDE WAGON CALCULATOR' : 'OPEN WAGON CALCULATOR'}
                        </button>
                        {showWagonCalc && (
                            <div className="mt-4">
                                <WagonCalculator hasTrader={hasTrader} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HuntingTerminal;
