/**
 * WagonCalculator - Hunting Wagon Load Simulator
 * 
 * Visual representation of the 5-slot Hunting Wagon with:
 * - Dropdown selectors for each slot (sorted: highest value first)
 * - Total material value calculation
 * - Efficiency bar vs theoretical max
 * - Load Optimal button
 * - Inefficiency warnings
 * 
 * @module components/WagonCalculator
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Truck, X, AlertTriangle, Check, Zap, ChevronDown, Trash2 } from 'lucide-react';

// CONFIG: 5 slots, baseline calculated dynamically from top 5 animals
const MAX_CAPACITY = 5;

/**
 * @param {Object} props
 * @param {boolean} [props.hasTrader] - Whether user has Trader role
 */
export const WagonCalculator = ({ hasTrader = true }) => {
    // State: 5 slots, each can hold an animal ID or null
    const [slots, setSlots] = useState([null, null, null, null, null]);
    const [animals, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch animals data
    useEffect(() => {
        fetch('/data/animals-online.json')
            .then(res => res.json())
            .then(data => {
                // Filter to wagon-carriable animals (LARGE/MASSIVE that have trader value)
                const carriable = (data.animals || [])
                    .filter(a => {
                        const size = a.sizeClass?.toUpperCase();
                        const hasMaterials = a.economy?.trader?.materialsPerfectCarcass > 0;
                        return ['LARGE', 'MASSIVE'].includes(size) && hasMaterials;
                    })
                    .map(a => ({
                        id: a.id,
                        name: a.name,
                        materials: a.economy?.trader?.materialsPerfectCarcass || 0,
                        butcherCash: a.economy?.butcher?.perfectCarcassValueCash || 0,
                        sizeClass: a.sizeClass
                    }))
                    .sort((a, b) => b.materials - a.materials); // Highest value first
                setAnimals(carriable);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load animals data:', err);
                setIsLoading(false);
            });
    }, []);

    // Calculate theoretical maximum (top 5)
    const theoreticalMax = useMemo(() => {
        return animals.slice(0, 5).reduce((sum, a) => sum + a.materials, 0);
    }, [animals]);

    // Calculate current loadout totals
    const loadoutStats = useMemo(() => {
        const filledSlots = slots.filter(id => id !== null);
        const totalMaterials = filledSlots.reduce((sum, id) => {
            const animal = animals.find(a => a.id === id);
            return sum + (animal?.materials || 0);
        }, 0);
        const totalCash = filledSlots.reduce((sum, id) => {
            const animal = animals.find(a => a.id === id);
            return sum + (animal?.butcherCash || 0);
        }, 0);
        const efficiency = theoreticalMax > 0 ? (totalMaterials / theoreticalMax) * 100 : 0;

        return {
            totalMaterials,
            totalCash,
            efficiency: Math.min(100, efficiency),
            slotsUsed: filledSlots.length
        };
    }, [slots, animals, theoreticalMax]);

    // Handlers
    const handleSlotChange = (slotIndex, animalId) => {
        const newSlots = [...slots];
        newSlots[slotIndex] = animalId === '' ? null : animalId;
        setSlots(newSlots);
    };

    const loadOptimal = () => {
        const topFive = animals.slice(0, 5).map(a => a.id);
        // Pad with nulls if fewer than 5 animals
        while (topFive.length < 5) topFive.push(null);
        setSlots(topFive);
    };

    const clearAll = () => {
        setSlots([null, null, null, null, null]);
    };

    // Efficiency styling
    const getEfficiencyColor = () => {
        if (loadoutStats.efficiency >= 80) return 'bg-green-500';
        if (loadoutStats.efficiency >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getEfficiencyText = () => {
        if (loadoutStats.efficiency >= 90) return 'OPTIMAL';
        if (loadoutStats.efficiency >= 70) return 'GOOD';
        if (loadoutStats.efficiency >= 50) return 'FAIR';
        return 'POOR';
    };

    const isFull = loadoutStats.slotsUsed >= MAX_CAPACITY;

    if (isLoading) {
        return (
            <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl p-4 animate-pulse">
                <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-gray-800 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-xl p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-western text-lg flex items-center gap-2">
                    <Truck size={18} className="text-[#D4AF37]" />
                    Wagon Calculator
                    <span className="text-xs text-gray-500 font-mono">({loadoutStats.slotsUsed}/{MAX_CAPACITY})</span>
                </h3>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                        {hasTrader ? 'Materials' : 'Cash Value'}
                    </div>
                    <div className={`text-2xl font-mono font-bold ${hasTrader ? 'text-amber-500' : 'text-green-400'}`}>
                        {hasTrader
                            ? loadoutStats.totalMaterials.toFixed(2)
                            : `$${loadoutStats.totalCash.toFixed(2)}`}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={loadOptimal}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#D4AF37] hover:bg-amber-600 text-black font-bold text-xs rounded transition-colors"
                >
                    <Zap size={14} />
                    LOAD OPTIMAL
                </button>
                <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs rounded transition-colors flex items-center gap-1"
                >
                    <Trash2 size={12} />
                    Clear
                </button>
            </div>

            {/* Efficiency Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>LOAD EFFICIENCY</span>
                    <span className="flex items-center gap-1">
                        <span className={`font-bold ${loadoutStats.efficiency >= 70 ? 'text-green-400' : loadoutStats.efficiency >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getEfficiencyText()}
                        </span>
                        <span>({loadoutStats.efficiency.toFixed(0)}%)</span>
                    </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${getEfficiencyColor()}`}
                        style={{ width: `${loadoutStats.efficiency}%` }}
                    />
                </div>
                <div className="text-[9px] text-gray-600 mt-1">
                    Max potential: {theoreticalMax.toFixed(2)} materials (Top 5 carcasses)
                </div>
            </div>

            {/* Slot Dropdowns */}
            <div className="space-y-2 mb-4">
                {slots.map((selectedId, idx) => {
                    const selectedAnimal = selectedId ? animals.find(a => a.id === selectedId) : null;

                    return (
                        <div key={idx} className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                            <div className="text-gray-600 font-mono text-xs w-8">
                                #{idx + 1}
                            </div>

                            <div className="flex-1 relative">
                                <select
                                    value={selectedId || ''}
                                    onChange={(e) => handleSlotChange(idx, e.target.value)}
                                    className="w-full bg-gray-900 text-white text-sm px-3 py-2 rounded border border-white/10 focus:border-[#D4AF37] focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">-- Empty Slot --</option>
                                    {animals.map(animal => (
                                        <option key={animal.id} value={animal.id}>
                                            {animal.name} ({animal.materials.toFixed(1)} mat)
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>

                            {selectedAnimal && (
                                <div className={`text-sm font-mono font-bold w-16 text-right ${hasTrader ? 'text-amber-500' : 'text-green-400'}`}>
                                    {hasTrader ? selectedAnimal.materials.toFixed(1) : `$${selectedAnimal.butcherCash.toFixed(0)}`}
                                </div>
                            )}

                            {selectedAnimal && (
                                <button
                                    onClick={() => handleSlotChange(idx, '')}
                                    className="p-1 text-red-500 hover:text-red-400 transition-colors"
                                    title="Clear slot"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Status Messages */}
            {isFull && loadoutStats.efficiency >= 80 && (
                <div className="bg-green-900/20 border border-green-500/30 p-2 rounded flex items-center gap-2 text-xs text-green-300">
                    <Check size={12} />
                    <span>OPTIMAL HAUL. Ready for delivery to Cripps.</span>
                </div>
            )}

            {isFull && loadoutStats.efficiency < 50 && (
                <div className="bg-red-900/20 border border-red-500/30 p-2 rounded flex items-center gap-2 text-xs text-red-300">
                    <AlertTriangle size={12} />
                    <span>INEFFICIENT HAUL. Consider higher-value carcasses.</span>
                </div>
            )}

            {!hasTrader && loadoutStats.slotsUsed > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-2 rounded flex items-center gap-2 text-xs text-yellow-300 mt-2">
                    <AlertTriangle size={12} />
                    <span>TRADER ROLE REQUIRED. Without Trader, sell to Butcher for reduced cash value.</span>
                </div>
            )}

            {/* Theoretical Maximum Reference */}
            {animals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                        Theoretical Max (Top 5)
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                        {animals.slice(0, 5).map((animal, idx) => (
                            <div key={animal.id} className="text-center bg-black/30 rounded p-1">
                                <div className="text-[9px] text-gray-600">#{idx + 1}</div>
                                <div className="text-[10px] text-gray-300 truncate">{animal.name.split(' ')[0]}</div>
                                <div className="text-xs text-amber-500 font-mono">{animal.materials.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WagonCalculator;
