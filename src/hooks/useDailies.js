// FILE: src/hooks/useDailies.js
// ═══════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGES ORACLE
// Fetches daily challenges from RDO.GG API with 1-hour cache
// Provides challenge data for EfficiencyEngine integration
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'rdo_dailies_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
const API_URL = 'https://api.rdo.gg/challenges/daily';

// Fallback data when API is unavailable (structure matches API response)
const FALLBACK_DAILIES = {
    date: new Date().toISOString().split('T')[0],
    categories: {
        general: [
            { id: 'gen_1', title: 'Complete 2 Free Roam Events', xp: 0.2, gold: 0.2 },
            { id: 'gen_2', title: 'Donate $20 to Camp', xp: 0.2, gold: 0.2 },
            { id: 'gen_3', title: 'Kill 5 Players in Free Roam', xp: 0.2, gold: 0.2 },
        ],
        bountyHunter: [
            { id: 'bh_1', title: 'Complete 2 Bounties', xp: 0.2, gold: 0.2 },
            { id: 'bh_2', title: 'Bring in 2 Bounties Alive', xp: 0.2, gold: 0.2 },
        ],
        trader: [
            { id: 'tr_1', title: 'Donate 20 Carcasses to Cripps', xp: 0.2, gold: 0.2 },
            { id: 'tr_2', title: 'Complete a Resupply Mission', xp: 0.2, gold: 0.2 },
        ],
        collector: [
            { id: 'col_1', title: 'Sell 3 Collectibles to Madam Nazar', xp: 0.2, gold: 0.2 },
            { id: 'col_2', title: 'Find 3 Tarot Cards', xp: 0.2, gold: 0.2 },
        ],
        moonshiner: [
            { id: 'ms_1', title: 'Complete a Bootlegger Mission', xp: 0.2, gold: 0.2 },
            { id: 'ms_2', title: 'Sell Moonshine', xp: 0.2, gold: 0.2 },
        ],
        naturalist: [
            { id: 'nat_1', title: 'Sample 5 Animals', xp: 0.2, gold: 0.2 },
            { id: 'nat_2', title: 'Sell Samples to Harriet', xp: 0.2, gold: 0.2 },
        ],
    },
    streak: {
        multiplier: 1.0,
        day: 0,
    },
    isFallback: true,
};

// Category metadata for UI
export const DAILY_CATEGORIES = {
    general: { name: 'General', color: 'text-gray-400', bg: 'bg-gray-500/20', icon: 'Star' },
    bountyHunter: { name: 'Bounty Hunter', color: 'text-red-400', bg: 'bg-red-500/20', icon: 'Target' },
    trader: { name: 'Trader', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: 'Package' },
    collector: { name: 'Collector', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: 'Search' },
    moonshiner: { name: 'Moonshiner', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: 'Wine' },
    naturalist: { name: 'Naturalist', color: 'text-green-400', bg: 'bg-green-500/20', icon: 'Leaf' },
};

// Streak multiplier tiers
export const STREAK_TIERS = [
    { day: 0, multiplier: 1.0, label: 'No Streak' },
    { day: 7, multiplier: 1.5, label: 'Week 1' },
    { day: 14, multiplier: 2.0, label: 'Week 2' },
    { day: 21, multiplier: 2.5, label: 'Week 3+' },
];

/**
 * Get cached dailies if still valid
 */
function getCachedDailies() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Check if cache is still valid
        if (age < CACHE_TTL) {
            return data;
        }

        // Check if it's still the same day (dailies reset at 06:00 UTC)
        const now = new Date();
        const cachedDate = new Date(timestamp);
        const resetHour = 6;

        // Calculate if we've crossed the 06:00 UTC boundary
        const nowUTC = now.getUTCHours();
        const cachedUTC = cachedDate.getUTCHours();

        if (now.toDateString() === cachedDate.toDateString() &&
            !(cachedUTC < resetHour && nowUTC >= resetHour)) {
            return data;
        }
    } catch {
        // Invalid cache
    }
    return null;
}

/**
 * Cache dailies data
 */
function cacheDailies(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch {
        // localStorage full or unavailable
    }
}

/**
 * Fetch dailies from API with fallback
 */
async function fetchDailies() {
    try {
        const response = await fetch(API_URL, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000), // 5s timeout
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        // Normalize API response to our expected structure
        const normalized = {
            date: data.date || new Date().toISOString().split('T')[0],
            categories: {},
            streak: data.streak || { multiplier: 1.0, day: 0 },
            isFallback: false,
        };

        // Map API categories to our structure
        // API format may vary - adapt as needed
        if (data.challenges) {
            for (const [category, challenges] of Object.entries(data.challenges)) {
                normalized.categories[category] = challenges.map((c, i) => ({
                    id: c.id || `${category}_${i}`,
                    title: c.title || c.name || c.description,
                    xp: c.xp || 0.2,
                    gold: c.gold || 0.2,
                }));
            }
        } else {
            // Use data directly if already in expected format
            normalized.categories = data.categories || FALLBACK_DAILIES.categories;
        }

        return normalized;
    } catch (error) {
        console.warn('[Dailies] API fetch failed, using fallback:', error.message);
        return { ...FALLBACK_DAILIES, isFallback: true };
    }
}

/**
 * useDailies - Hook to access daily challenges
 * @returns {Object} { dailies, loading, error, refresh, completedIds, toggleComplete }
 */
export function useDailies() {
    const [dailies, setDailies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track completed challenges in localStorage
    const [completedIds, setCompletedIds] = useState(() => {
        try {
            const stored = localStorage.getItem('rdo_dailies_completed');
            if (stored) {
                const { ids, date } = JSON.parse(stored);
                // Reset if it's a new day
                const today = new Date().toISOString().split('T')[0];
                if (date === today) return ids;
            }
        } catch { }
        return [];
    });

    // Persist completed state
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('rdo_dailies_completed', JSON.stringify({
            ids: completedIds,
            date: today,
        }));
    }, [completedIds]);

    // Load dailies
    const loadDailies = useCallback(async (force = false) => {
        setLoading(true);
        setError(null);

        try {
            // Check cache first unless forced refresh
            if (!force) {
                const cached = getCachedDailies();
                if (cached) {
                    setDailies(cached);
                    setLoading(false);
                    return;
                }
            }

            // Fetch fresh data
            const data = await fetchDailies();
            cacheDailies(data);
            setDailies(data);
        } catch (err) {
            setError(err.message);
            // Use fallback on error
            setDailies(FALLBACK_DAILIES);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadDailies();
    }, [loadDailies]);

    // Toggle challenge completion
    const toggleComplete = useCallback((challengeId) => {
        setCompletedIds(prev =>
            prev.includes(challengeId)
                ? prev.filter(id => id !== challengeId)
                : [...prev, challengeId]
        );
    }, []);

    // Calculate completion stats
    const stats = dailies ? (() => {
        let total = 0;
        let completed = 0;
        let goldPotential = 0;

        for (const challenges of Object.values(dailies.categories)) {
            for (const c of challenges) {
                total++;
                goldPotential += c.gold;
                if (completedIds.includes(c.id)) completed++;
            }
        }

        return {
            total,
            completed,
            remaining: total - completed,
            progress: total > 0 ? (completed / total) * 100 : 0,
            goldPotential,
            goldEarned: completedIds.reduce((sum, id) => {
                for (const challenges of Object.values(dailies.categories)) {
                    const found = challenges.find(c => c.id === id);
                    if (found) return sum + found.gold;
                }
                return sum;
            }, 0),
        };
    })() : null;

    return {
        dailies,
        loading,
        error,
        refresh: () => loadDailies(true),
        completedIds,
        toggleComplete,
        stats,
        DAILY_CATEGORIES,
    };
}

/**
 * Extract keywords from daily challenges for cross-referencing
 * Used by HuntingTerminal to highlight relevant animals
 */
export function extractDailyKeywords(dailies) {
    if (!dailies) return [];

    const keywords = [];
    const patterns = [
        // Animals
        /kill (\d+) (bears?|deer|wolves?|cougars?|alligators?|boars?|bison|elk|rabbits?)/i,
        /hunt (\d+) (bears?|deer|wolves?|cougars?|alligators?|boars?|bison|elk)/i,
        /skin (\d+) (bears?|deer|wolves?|cougars?|alligators?|boars?|bison|elk)/i,
        /sample (\d+) (bears?|deer|wolves?|cougars?|alligators?|boars?|bison|elk)/i,
        // Fish
        /catch (\d+) (fish|bass|trout|salmon|catfish)/i,
        // Locations
        /in (tumbleweed|valentine|rhodes|saint denis|blackwater|annesburg)/i,
        // Activities
        /(bounties?|bounty hunter)/i,
        /(trader|cripps|goods)/i,
        /(collector|collectibles?|tarot|coins?|arrowheads?)/i,
        /(moonshine|bootlegger)/i,
        /(naturalist|harriet|samples?)/i,
    ];

    for (const challenges of Object.values(dailies.categories)) {
        for (const challenge of challenges) {
            for (const pattern of patterns) {
                const match = challenge.title.match(pattern);
                if (match) {
                    // Extract the keyword (usually capture group 2 for animals, 1 for others)
                    const keyword = (match[2] || match[1]).toLowerCase().replace(/s$/, '');
                    if (!keywords.includes(keyword)) {
                        keywords.push(keyword);
                    }
                }
            }
        }
    }

    return keywords;
}
