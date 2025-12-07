// FILE: src/components/TravelMap.jsx
// ═══════════════════════════════════════════════════════════════════════════
// TRAVEL LOGISTICS CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════
//
// ARCHITECTURE: Logic Controller (State Machine + Cost Engine)
// - Owns selection state (origin, destination)
// - Calculates travel cost using GAME coordinates (rdo-data.js)
// - Calculates route path using VISUAL topology (topology.js via graph-logic.js)
// - Passes visual state to MapBoard for rendering
//
// This separation means:
// - Visual layout can change without affecting cost calculations
// - Cost formula can change without affecting the Metro Map appearance
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import { Navigation, DollarSign, RotateCcw, ArrowRight, Loader, ChevronDown, MapPin } from 'lucide-react';
import { MapBoard } from './MapBoard';
import { FAST_TRAVEL_LOCATIONS } from '../../data/rdo-data';
import { TIMING } from '../../data/topology';
import { calcDistance } from '../../utils/rdo-logic';
import { findShortestPath, pathToEdges } from '../../utils/graph-logic';

export const TravelMap = ({ currentLocation, currentCash, onTravel }) => {
    // ─────────────────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────────────────

    const [origin, setOrigin] = useState(currentLocation || 'valentine');
    const [destination, setDestination] = useState(null);
    const [cost, setCost] = useState(0);

    // Visual state for MapBoard
    const [routeEdges, setRouteEdges] = useState([]);
    const [routePath, setRoutePath] = useState([]);

    // Animation lock
    const [isTraveling, setIsTraveling] = useState(false);

    // Dropdown state
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // SORTED LOCATIONS BY DISTANCE
    // ─────────────────────────────────────────────────────────────────────────
    // Computes all locations sorted by distance from current origin

    const sortedLocations = useMemo(() => {
        const originLoc = FAST_TRAVEL_LOCATIONS[origin];
        if (!originLoc) return [];

        return Object.entries(FAST_TRAVEL_LOCATIONS)
            .filter(([id]) => id !== origin) // Exclude current location
            .map(([id, loc]) => {
                const distance = calcDistance(originLoc, loc);
                const cost = Math.min(10, Math.max(1, Math.ceil(distance / 10)));
                return { id, ...loc, distance, cost };
            })
            .sort((a, b) => a.distance - b.distance); // Closest first
    }, [origin]);

    // ─────────────────────────────────────────────────────────────────────────
    // SYNC WITH PARENT
    // ─────────────────────────────────────────────────────────────────────────
    // When profile switches or user travels elsewhere, update origin

    useEffect(() => {
        if (currentLocation && !isTraveling) {
            setOrigin(currentLocation);
        }
    }, [currentLocation, isTraveling]);

    // ─────────────────────────────────────────────────────────────────────────
    // SELECTION STATE MACHINE
    // ─────────────────────────────────────────────────────────────────────────
    // Handles click flow: No Origin → Set Origin → Set Destination → Reset

    const handleNodeSelect = (nodeId) => {
        // Lock during travel animation
        if (isTraveling) return;

        // Close dropdown when interacting with map
        setIsDropdownOpen(false);

        if (!origin) {
            // Case 1: No origin selected → set origin
            setOrigin(nodeId);
        } else if (!destination && nodeId !== origin) {
            // Case 2: Has origin, clicking different node → set destination
            setDestination(nodeId);
        } else if (nodeId === origin) {
            // Case 3: Clicking origin again → reset all
            resetRoute();
        } else {
            // Case 4: Has destination, clicking new node → change destination
            setDestination(nodeId);
        }
    };

    const resetRoute = () => {
        setOrigin(currentLocation || 'valentine');
        setDestination(null);
        setRouteEdges([]);
        setRoutePath([]);
        setCost(0);
        setIsDropdownOpen(false);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // COST + ROUTE ENGINE
    // ─────────────────────────────────────────────────────────────────────────
    // Runs when origin or destination changes
    // - Cost uses GAME coordinates (actual distance)
    // - Route uses VISUAL topology (metro map layout)

    useEffect(() => {
        if (origin && destination) {
            // 1. Calculate Cost (Game Logic - uses actual RDO coordinates)
            const startLoc = FAST_TRAVEL_LOCATIONS[origin];
            const endLoc = FAST_TRAVEL_LOCATIONS[destination];

            if (startLoc && endLoc) {
                const dist = calcDistance(startLoc, endLoc);
                // RDO formula: ~$1 per 10 units, capped at $10
                const calculatedCost = Math.min(10, Math.max(1, Math.ceil(dist / 10)));
                setCost(calculatedCost);
            }

            // 2. Calculate Route (Visual Logic - uses topology graph)
            const path = findShortestPath(origin, destination);
            setRoutePath(path);
            setRouteEdges(pathToEdges(path));
        } else {
            // Clear when no complete route
            setCost(0);
            setRouteEdges([]);
            setRoutePath([]);
        }
    }, [origin, destination]);

    // ─────────────────────────────────────────────────────────────────────────
    // TRAVEL EXECUTION
    // ─────────────────────────────────────────────────────────────────────────
    // Triggers animation, waits for completion, then updates parent state

    const handleConfirm = () => {
        if (!onTravel || !origin || !destination) return;
        if (currentCash < cost) return; // Insufficient funds

        // 1. Lock UI and start animation
        setIsTraveling(true);

        // 2. Wait for animation to complete (synced with CSS)
        setTimeout(() => {
            // 3. Execute travel (parent updates balance + location)
            onTravel(destination, cost);

            // 4. Update local state
            setOrigin(destination);
            setDestination(null);
            setRouteEdges([]);
            setRoutePath([]);
            setCost(0);
            setIsTraveling(false);
        }, TIMING.TRAVEL_DURATION_MS);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // DERIVED VALUES
    // ─────────────────────────────────────────────────────────────────────────

    const originName = FAST_TRAVEL_LOCATIONS[origin]?.name || 'SELECT ORIGIN';
    const destName = FAST_TRAVEL_LOCATIONS[destination]?.name || 'SELECT DEST';
    const canAfford = currentCash >= cost;
    const hasRoute = origin && destination;

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div
            data-testid="travel-map"
            className="card-rdo p-4 rounded-xl mb-6 flex flex-col"
        >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h3 className="text-[#D4AF37] font-western text-xl flex items-center gap-2">
                    {isTraveling ? (
                        <Loader size={20} className="animate-spin" />
                    ) : (
                        <Navigation size={20} />
                    )}
                    {isTraveling ? 'TRAIN IN TRANSIT...' : 'Travel Logistics'}
                </h3>

                {/* Route Display */}
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={origin ? 'text-emerald-400' : 'text-gray-600'}>
                        {originName}
                    </span>
                    <ArrowRight size={12} className="text-gray-600" />
                    <span className={destination ? 'text-red-400' : 'text-gray-600'}>
                        {destName}
                    </span>
                </div>
            </div>

            {/* DESTINATION DROPDOWN - Sorted by Distance */}
            <div className="mb-4 relative">
                <button
                    onClick={() => !isTraveling && setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isTraveling}
                    className={`
                        w-full flex items-center justify-between gap-2 px-4 py-3
                        bg-black/40 border border-white/10 rounded-lg
                        hover:border-[#D4AF37]/40 transition-all
                        ${isTraveling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#D4AF37]" />
                        <span className="text-sm font-mono text-gray-400">Quick Select:</span>
                        <span className="text-sm font-western text-white">
                            {destination ? destName : 'Choose Destination...'}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown List */}
                {isDropdownOpen && !isTraveling && (
                    <div className="absolute z-20 w-full mt-1 bg-stone-900 border border-white/20 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                        <div className="px-3 py-2 border-b border-white/10 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                            Sorted: Closest → Furthest from {originName}
                        </div>
                        {sortedLocations.map((loc, idx) => (
                            <button
                                key={loc.id}
                                onClick={() => {
                                    setDestination(loc.id);
                                    setIsDropdownOpen(false);
                                }}
                                className={`
                                    w-full flex items-center justify-between px-4 py-2.5
                                    hover:bg-[#D4AF37]/10 transition-colors border-b border-white/5
                                    ${destination === loc.id ? 'bg-[#D4AF37]/20' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-gray-600 w-4">
                                        {idx + 1}.
                                    </span>
                                    <div className="text-left">
                                        <div className="text-sm font-western text-white">{loc.name}</div>
                                        <div className="text-[10px] text-gray-500">{loc.region}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <div className="text-[10px] text-gray-500 font-mono">
                                        {loc.distance.toFixed(0)} mi
                                    </div>
                                    <div className={`text-sm font-mono font-bold ${currentCash >= loc.cost ? 'text-emerald-400' : 'text-red-400'}`}>
                                        ${loc.cost.toFixed(2)}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* METRO MAP BOARD */}
            <MapBoard
                originId={origin}
                destinationId={destination}
                activeRouteEdges={routeEdges}
                routePath={routePath}
                isTraveling={isTraveling}
                onSelectNode={handleNodeSelect}
            />

            {/* FOOTER CONTROLS */}
            <div
                className={`
          flex justify-between items-center mt-4 h-10 transition-opacity
          ${isTraveling ? 'opacity-50 pointer-events-none' : ''}
        `}
            >
                {/* Status Text */}
                <div className="text-xs text-gray-500 font-mono">
                    {hasRoute
                        ? `ROUTE LOCKED: ${routePath.length - 1} HOPS`
                        : origin
                            ? 'SELECT DESTINATION...'
                            : 'SELECT STARTING POINT...'
                    }
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    {/* Reset Button */}
                    {(origin || destination) && (
                        <button
                            onClick={resetRoute}
                            className="text-gray-500 hover:text-white transition-colors p-2"
                            title="Reset Route"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}

                    {/* Travel Confirmation */}
                    {hasRoute && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Fare Display */}
                            <div className="text-xl font-mono font-bold text-white flex items-center gap-1 bg-black/40 px-3 py-1 rounded border border-white/10">
                                <span className="text-gray-500 text-[10px] mr-1 uppercase tracking-widest">
                                    Fare
                                </span>
                                <DollarSign
                                    size={16}
                                    className={canAfford ? 'text-emerald-500' : 'text-red-500'}
                                />
                                <span className={canAfford ? '' : 'text-red-400'}>
                                    {cost.toFixed(2)}
                                </span>
                            </div>

                            {/* Travel Button */}
                            <button
                                onClick={handleConfirm}
                                disabled={!canAfford}
                                className={`
                  px-6 py-2 rounded font-bold font-western tracking-widest 
                  transition-all duration-200
                  ${canAfford
                                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-black hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }
                `}
                            >
                                {canAfford ? 'TRAVEL NOW' : 'INSUFFICIENT'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Balance Indicator */}
            <div className="mt-2 text-right text-[10px] font-mono text-gray-600">
                Balance: <span className={currentCash < 10 ? 'text-red-400' : 'text-gray-400'}>
                    ${currentCash?.toFixed(2) || '0.00'}
                </span>
            </div>
        </div>
    );
};
