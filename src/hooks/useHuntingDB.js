/**
 * useHuntingDB - Fetch hook for animals-online.json
 * 
 * Provides:
 * - animals array with full hunting metadata
 * - definitions (sizeClasses) for UI rendering
 * - validateLoadout(animal, userWeapons) for loadout auditing
 * - loading/error states
 * 
 * @module hooks/useHuntingDB
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

const ANIMALS_URL = '/data/animals-online.json';

/**
 * @typedef {Object} Animal
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} sizeClass - SMALL | MODERATE | MEDIUM | LARGE | MASSIVE
 * @property {Object} perfectKill - Weapon/ammo requirements for 3-star pelt
 * @property {Object} spawn - Location, time, conditions
 * @property {Object} economy - Carcass value, pelt value, material yield
 * @property {string[]} tags - Searchable tags
 */

/**
 * @typedef {Object} LoadoutAudit
 * @property {boolean} hasWeapon - User owns required weapon
 * @property {boolean} hasAmmo - User owns required ammo type
 * @property {boolean} ready - Both weapon and ammo available
 * @property {string} weapon - Required weapon name
 * @property {string} ammo - Required ammo type
 * @property {string[]} missing - List of missing items
 */

export function useHuntingDB() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchAnimals() {
            try {
                const response = await fetch(ANIMALS_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch animals: ${response.status}`);
                }
                const json = await response.json();

                if (!cancelled) {
                    setData(json);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        }

        fetchAnimals();
        return () => { cancelled = true; };
    }, []);

    // Memoized animals array
    const animals = useMemo(() => data?.animals ?? [], [data]);

    // Memoized definitions (sizeClasses)
    const definitions = useMemo(() => data?.definitions ?? {}, [data]);

    // Size class lookup helper
    const getSizeClass = useCallback((sizeClassKey) => {
        return definitions.sizeClasses?.[sizeClassKey] ?? null;
    }, [definitions]);

    /**
     * Validate user loadout against animal requirements
     * Uses new v2 schema: perfectKill.allowedWeaponIds array
     * @param {Animal} animal - Target animal
     * @param {string[]} userWeapons - Array of weapon IDs user owns (from CATALOG)
     * @returns {LoadoutAudit}
     */
    const validateLoadout = useCallback((animal, userWeapons = []) => {
        if (!animal?.perfectKill) {
            return {
                hasWeapon: false,
                hasAmmo: false,
                ready: false,
                weaponClass: 'Unknown',
                ammoNotes: 'Unknown',
                missing: ['Unknown requirements']
            };
        }

        const { allowedWeaponIds = [], requiredWeaponClass, ammoNotes } = animal.perfectKill;
        const missing = [];

        // Check if user has ANY of the allowed weapons
        const hasWeapon = allowedWeaponIds.some(wid => userWeapons.includes(wid));

        // Ammo check - simplified, assumes user has ammo if they have weapon
        const hasAmmo = hasWeapon;

        if (!hasWeapon) {
            missing.push(requiredWeaponClass || 'Required weapon');
        }

        return {
            hasWeapon,
            hasAmmo,
            ready: hasWeapon && hasAmmo,
            weaponClass: requiredWeaponClass,
            ammoNotes: ammoNotes || '',
            allowedWeaponIds,
            missing
        };
    }, []);

    /**
     * Filter animals by size class
     * @param {string} sizeClass - SMALL | MODERATE | MEDIUM | LARGE | MASSIVE | 'all'
     * @returns {Animal[]}
     */
    const filterBySize = useCallback((sizeClass) => {
        if (sizeClass === 'all') return animals;
        return animals.filter(a => a.sizeClass === sizeClass);
    }, [animals]);

    /**
     * Search animals by name or tags
     * @param {string} query - Search string
     * @returns {Animal[]}
     */
    const search = useCallback((query) => {
        if (!query?.trim()) return animals;
        const q = query.toLowerCase();
        return animals.filter(a =>
            a.name.toLowerCase().includes(q) ||
            a.tags?.some(t => t.toLowerCase().includes(q))
        );
    }, [animals]);

    /**
     * Get animal by ID
     * @param {string} id - Animal ID
     * @returns {Animal|null}
     */
    const getById = useCallback((id) => {
        return animals.find(a => a.id === id) ?? null;
    }, [animals]);

    /**
     * Calculate optimal value for an animal based on user roles
     * Trader Materials (if role owned) > Butcher Cash
     * @param {Animal} animal - Target animal
     * @param {Object} userRoles - User's role XP values (from profile.roles)
     * @returns {{type: string, value: number, label: string, color: string}}
     */
    const getOptimalValue = useCallback((animal, userRoles = {}) => {
        if (!animal?.economy) {
            return { type: 'UNKNOWN', value: 0, label: '???', color: 'text-gray-500' };
        }

        const hasTrader = (userRoles?.trader ?? 0) > 0;
        const traderCarcass = animal.economy.trader?.materialsPerfectCarcass ?? 0;
        const traderPelt = animal.economy.trader?.materialsPerfectPelt ?? 0;
        const butcherCarcass = animal.economy.butcher?.perfectCarcassValueCash ?? 0;

        // Priority: Trader Carcass > Trader Pelt > Butcher Cash
        if (hasTrader && traderCarcass > 0) {
            return {
                type: 'TRADER',
                value: traderCarcass,
                label: 'Materials',
                color: 'text-amber-500'
            };
        }

        if (hasTrader && traderPelt > 0) {
            return {
                type: 'TRADER_PELT',
                value: traderPelt,
                label: 'Pelt Materials',
                color: 'text-amber-400'
            };
        }

        return {
            type: 'BUTCHER',
            value: butcherCarcass,
            label: 'Cash',
            color: 'text-green-400'
        };
    }, []);

    /**
     * Check if animal can be stored as carcass on horse/wagon
     * MASSIVE animals cannot be carried - skin only
     * @param {Animal} animal
     * @returns {boolean}
     */
    const canCarryCarcass = useCallback((animal) => {
        if (!animal) return false;
        // MASSIVE animals cannot be carried whole
        if (animal.sizeClass === 'MASSIVE') return false;
        // Check if carcass has value (some animals are skin-only)
        return (animal.economy?.trader?.materialsPerfectCarcass ?? 0) > 0;
    }, []);

    return {
        // Data
        animals,
        definitions,
        meta: data?.meta ?? null,

        // State
        loading,
        error,

        // Helpers
        getSizeClass,
        validateLoadout,
        filterBySize,
        search,
        getById,
        getOptimalValue,
        canCarryCarcass
    };
}
