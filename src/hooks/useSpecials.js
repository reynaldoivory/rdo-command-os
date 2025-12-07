// FILE: src/hooks/useSpecials.js
// ═══════════════════════════════════════════════════════════════════════════
// REMOTE SPECIALS FEED HOOK
// Fetches weekly bonuses/discounts with 24-hour localStorage cache
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';

// Cache configuration
const CACHE_KEY = 'rdo_specials_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Default fallback data (used when fetch fails and no cache exists)
const FALLBACK_SPECIALS = {
    meta: {
        version: 0,
        lastUpdated: null,
        validUntil: null,
        source: 'Fallback'
    },
    weeklyTheme: {
        title: 'Check Back Later',
        description: 'Weekly specials data unavailable',
        icon: 'alert'
    },
    bonuses: [],
    discounts: [],
    freeItems: [],
    limitedTime: [],
    podiumVehicle: null,
    primeGaming: { active: false, rewards: [] }
};

/**
 * Hook to fetch and cache weekly specials data
 * @param {string} feedUrl - URL to fetch specials JSON from
 * @returns {{ specials: object, loading: boolean, error: string|null, refresh: () => void, lastFetched: Date|null }}
 */
export function useSpecials(feedUrl = '/data/current_specials.json') {
    const [specials, setSpecials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    /**
     * Check if cached data is still valid
     */
    const getCachedData = useCallback(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;

            // Check if cache is still fresh
            if (age < CACHE_DURATION_MS) {
                return { data, timestamp: new Date(timestamp) };
            }

            // Cache expired
            return null;
        } catch {
            // Invalid cache, clear it
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    }, []);

    /**
     * Save data to cache
     */
    const setCachedData = useCallback((data) => {
        try {
            const cacheEntry = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
        } catch {
            // localStorage full or unavailable, continue without caching
            console.warn('Unable to cache specials data');
        }
    }, []);

    /**
     * Fetch fresh data from remote
     */
    const fetchSpecials = useCallback(async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        // Check cache first (unless forcing refresh)
        if (!forceRefresh) {
            const cached = getCachedData();
            if (cached) {
                setSpecials(cached.data);
                setLastFetched(cached.timestamp);
                setLoading(false);
                return;
            }
        }

        // Fetch from remote
        try {
            const response = await fetch(feedUrl, {
                cache: forceRefresh ? 'no-cache' : 'default'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Validate structure
            if (!data.meta || !data.bonuses) {
                throw new Error('Invalid specials data structure');
            }

            // Check if data is still valid (not expired)
            if (data.meta.validUntil) {
                const validUntil = new Date(data.meta.validUntil);
                if (validUntil < new Date()) {
                    console.warn('Specials data has expired, may be outdated');
                }
            }

            // Cache and set
            setCachedData(data);
            setSpecials(data);
            setLastFetched(new Date());
        } catch (err) {
            console.error('Failed to fetch specials:', err);
            setError(err.message);

            // Try to use stale cache
            const staleCache = getCachedData();
            if (staleCache) {
                setSpecials(staleCache.data);
                setLastFetched(staleCache.timestamp);
            } else {
                // Last resort: use fallback
                setSpecials(FALLBACK_SPECIALS);
            }
        } finally {
            setLoading(false);
        }
    }, [feedUrl, getCachedData, setCachedData]);

    /**
     * Force refresh (bypass cache)
     */
    const refresh = useCallback(() => {
        fetchSpecials(true);
    }, [fetchSpecials]);

    // Initial fetch on mount
    useEffect(() => {
        fetchSpecials();
    }, [fetchSpecials]);

    return {
        specials,
        loading,
        error,
        refresh,
        lastFetched
    };
}

/**
 * Helper: Check if a bonus applies to a specific role
 */
export function getBonusesForRole(specials, roleKey) {
    if (!specials?.bonuses) return [];
    return specials.bonuses.filter(b => b.role === roleKey);
}

/**
 * Helper: Check if an item is currently discounted
 */
export function getDiscountForItem(specials, itemId) {
    if (!specials?.discounts) return null;
    return specials.discounts.find(d => d.itemId === itemId);
}

/**
 * Helper: Get human-readable time until specials expire
 */
export function getTimeUntilExpiry(specials) {
    if (!specials?.meta?.validUntil) return null;

    const validUntil = new Date(specials.meta.validUntil);
    const now = new Date();
    const diffMs = validUntil - now;

    if (diffMs <= 0) return 'Expired';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
}

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL DIFF SYSTEM
// Tracks which specials the user has seen before
// ═══════════════════════════════════════════════════════════════════════════

const SEEN_KEY = 'rdo_specials_seen';

/**
 * Extract all item IDs from a specials object
 */
function extractItemIds(specials) {
    if (!specials) return [];
    const ids = [];
    specials.bonuses?.forEach(b => ids.push(b.id));
    specials.discounts?.forEach(d => ids.push(d.id));
    specials.freeItems?.forEach(f => ids.push(f.id));
    specials.limitedTime?.forEach(l => ids.push(l.id));
    return ids;
}

/**
 * Get set of previously seen item IDs
 */
function getSeenItems() {
    try {
        const stored = localStorage.getItem(SEEN_KEY);
        return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
        return new Set();
    }
}

/**
 * Mark items as seen
 */
function markItemsAsSeen(ids) {
    try {
        const existing = getSeenItems();
        ids.forEach(id => existing.add(id));
        localStorage.setItem(SEEN_KEY, JSON.stringify([...existing]));
    } catch {
        // localStorage unavailable
    }
}

/**
 * Hook to track new/unseen specials
 * @param {object} specials - The specials data object
 * @returns {{ newItems: Set<string>, markAllSeen: () => void, hasNewItems: boolean }}
 */
export function useNewSpecials(specials) {
    const [newItems, setNewItems] = useState(new Set());

    useEffect(() => {
        if (!specials) return;

        const currentIds = extractItemIds(specials);
        const seenIds = getSeenItems();

        // Find items that haven't been seen
        const unseen = new Set(currentIds.filter(id => !seenIds.has(id)));
        setNewItems(unseen);
    }, [specials]);

    const markAllSeen = useCallback(() => {
        if (!specials) return;
        const currentIds = extractItemIds(specials);
        markItemsAsSeen(currentIds);
        setNewItems(new Set());
    }, [specials]);

    return {
        newItems,
        markAllSeen,
        hasNewItems: newItems.size > 0
    };
}
