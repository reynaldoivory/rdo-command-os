/**
 * useGameTimers - Legendary animal cooldown tracking
 * 
 * Implements the 72-hour real-time cooldown system for legendary animals.
 * Cooldowns apply per-SPECIES (not individual animals).
 * 
 * Example: Killing Golden Spirit Bear starts 72hr cooldown for ALL bears
 *          (Ridgeback Spirit Bear, Owiza Bear also blocked)
 * 
 * @module hooks/useGameTimers
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SPECIES_COOLDOWN_HOURS, LEGENDARY_ANIMALS, RESET_TIMES } from '../data/encyclopedia';

const STORAGE_KEY = 'rdo_legendary_kills';
const TICK_INTERVAL = 60000; // 1 minute

/**
 * @typedef {Object} CooldownStatus
 * @property {boolean} available - Can hunt this species
 * @property {number} remainingMs - Milliseconds until available
 * @property {string} remainingFormatted - Human readable countdown (HH:MM)
 * @property {number|null} killedAt - Timestamp of last kill
 * @property {string|null} killedAnimal - Name of animal that triggered cooldown
 */

/**
 * @typedef {Object} KillRecord
 * @property {number} timestamp - Unix timestamp of kill
 * @property {string} animalId - ID of killed legendary
 * @property {string} animalName - Name for display
 */

/**
 * Load kill records from localStorage
 * @returns {Object<string, KillRecord>} Species -> KillRecord map
 */
function loadKillRecords() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Save kill records to localStorage
 * @param {Object<string, KillRecord>} records
 */
function saveKillRecords(records) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
        // localStorage quota exceeded or unavailable
    }
}

/**
 * Calculate remaining cooldown milliseconds
 * @param {number} killedAt - Kill timestamp
 * @returns {number} Remaining ms (0 if expired)
 */
function calculateRemaining(killedAt) {
    if (!killedAt) return 0;
    const cooldownMs = SPECIES_COOLDOWN_HOURS * 60 * 60 * 1000;
    const elapsed = Date.now() - killedAt;
    return Math.max(0, cooldownMs - elapsed);
}

/**
 * Format milliseconds to HH:MM string
 * @param {number} ms
 * @returns {string}
 */
function formatRemaining(ms) {
    if (ms <= 0) return '00:00';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function useGameTimers() {
    const [killRecords, setKillRecords] = useState(loadKillRecords);
    const [tick, setTick] = useState(0); // Force re-render every minute

    // Tick timer for countdown updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, TICK_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // Persist kill records when they change
    useEffect(() => {
        saveKillRecords(killRecords);
    }, [killRecords]);

    /**
     * Register a legendary kill - starts species cooldown
     * @param {string} animalId - ID from LEGENDARY_ANIMALS
     */
    const registerKill = useCallback((animalId) => {
        const animal = LEGENDARY_ANIMALS.find(a => a.id === animalId);
        if (!animal) {
            console.warn(`Unknown legendary animal: ${animalId}`);
            return;
        }

        setKillRecords(prev => ({
            ...prev,
            [animal.species]: {
                timestamp: Date.now(),
                animalId: animal.id,
                animalName: animal.name
            }
        }));
    }, []);

    /**
     * Clear a species cooldown (for testing or correction)
     * @param {string} species - Species key (BEAR, CAT, etc.)
     */
    const clearCooldown = useCallback((species) => {
        setKillRecords(prev => {
            const next = { ...prev };
            delete next[species];
            return next;
        });
    }, []);

    /**
     * Get cooldown status for a species
     * @param {string} species - Species key
     * @returns {CooldownStatus}
     */
    const getStatus = useCallback((species) => {
        const record = killRecords[species];
        const remainingMs = record ? calculateRemaining(record.timestamp) : 0;

        return {
            available: remainingMs === 0,
            remainingMs,
            remainingFormatted: formatRemaining(remainingMs),
            killedAt: record?.timestamp ?? null,
            killedAnimal: record?.animalName ?? null
        };
    }, [killRecords, tick]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Get all species with their current status
     * @returns {Object<string, CooldownStatus>}
     */
    const allStatuses = useMemo(() => {
        const species = [...new Set(LEGENDARY_ANIMALS.map(a => a.species))];
        const result = {};
        for (const s of species) {
            result[s] = getStatus(s);
        }
        return result;
    }, [getStatus]);

    /**
     * Get time until next daily reset
     * @returns {{hours: number, minutes: number, formatted: string}}
     */
    const getTimeUntilDailyReset = useCallback(() => {
        const now = new Date();
        const reset = new Date(now);
        reset.setUTCHours(RESET_TIMES.daily.hour, RESET_TIMES.daily.minute, 0, 0);

        if (reset <= now) {
            reset.setUTCDate(reset.getUTCDate() + 1);
        }

        const diffMs = reset - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return {
            hours,
            minutes,
            formatted: `${hours}h ${minutes}m`
        };
    }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Get time until next weekly reset (Tuesday 6 AM UTC)
     * @returns {{days: number, hours: number, formatted: string}}
     */
    const getTimeUntilWeeklyReset = useCallback(() => {
        const now = new Date();
        const reset = new Date(now);

        // Find next Tuesday
        const daysUntilTuesday = (RESET_TIMES.weekly.day - now.getUTCDay() + 7) % 7 || 7;
        reset.setUTCDate(now.getUTCDate() + daysUntilTuesday);
        reset.setUTCHours(RESET_TIMES.weekly.hour, RESET_TIMES.weekly.minute, 0, 0);

        // If it's Tuesday but past reset time, go to next week
        if (daysUntilTuesday === 0 && now >= reset) {
            reset.setUTCDate(reset.getUTCDate() + 7);
        }

        const diffMs = reset - now;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return {
            days,
            hours,
            formatted: `${days}d ${hours}h`
        };
    }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        // Actions
        registerKill,
        clearCooldown,

        // Status queries
        getStatus,
        allStatuses,

        // Game timers
        getTimeUntilDailyReset,
        getTimeUntilWeeklyReset,

        // Raw data (for debugging)
        killRecords
    };
}
