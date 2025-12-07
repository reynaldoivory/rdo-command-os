/**
 * ═══════════════════════════════════════════════════════════════════════════
 * useWardrobe - Wardrobe Data Management Hook
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ARCHITECTURE:
 * - Static catalog data: Fetched from /data/wardrobe.json (read-only)
 * - User ownership data: Persisted in localStorage per-profile
 * - Hydration: Merges catalog items with user's variant counts
 * 
 * Uses the Unified Data Contract (src/data/schemas.js) for validation.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import { clampVariants, calculateCompletionCost } from '../data/schemas';

/**
 * @param {string} profileId - Current profile identifier for scoped persistence
 * @returns {{ items, status, updateCount, completionCost, stats }}
 */
export function useWardrobe(profileId = 'Main') {
    // Static catalog from JSON (read-only)
    const [catalog, setCatalog] = useState([]);
    const [status, setStatus] = useState('idle'); // idle | loading | ready | error

    // User's ownership counts persisted per-profile
    const [userCounts, setUserCounts] = usePersistentState(
        `wardrobe_counts_${profileId}`,
        {}
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // LOAD STATIC CATALOG
    // ═══════════════════════════════════════════════════════════════════════════

    useEffect(() => {
        let cancelled = false;

        const loadCatalog = async () => {
            setStatus('loading');

            try {
                const res = await fetch('/data/wardrobe.json');
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }

                const json = await res.json();

                if (cancelled) return;

                // Handle both array root and { items: [] } wrapper
                const items = Array.isArray(json) ? json : (json.items || []);
                setCatalog(items);
                setStatus('ready');

            } catch (error) {
                if (cancelled) return;
                console.warn('[useWardrobe] Catalog load failed:', error.message);
                setCatalog([]);
                setStatus('error');
            }
        };

        loadCatalog();

        return () => { cancelled = true; };
    }, []); // Only load once on mount

    // ═══════════════════════════════════════════════════════════════════════════
    // HYDRATE CATALOG WITH USER DATA
    // ═══════════════════════════════════════════════════════════════════════════

    const items = useMemo(() => {
        return catalog.map(item => {
            // Get user's owned count for this item
            const userOwned = userCounts[item.id] || 0;

            // Use schema helper to validate and clamp the count
            const { variantsOwned, variantsTotal } = clampVariants(
                userOwned,
                item.variantsTotal
            );

            return {
                ...item,
                variantsOwned,
                variantsTotal,
            };
        });
    }, [catalog, userCounts]);

    // ═══════════════════════════════════════════════════════════════════════════
    // UPDATE HANDLER (Uses Schema Validator)
    // ═══════════════════════════════════════════════════════════════════════════

    const updateCount = useCallback((itemId, delta) => {
        setUserCounts(prev => {
            const current = prev[itemId] || 0;
            const targetItem = catalog.find(i => i.id === itemId);

            if (!targetItem) {
                console.warn(`[useWardrobe] Item not found: ${itemId}`);
                return prev;
            }

            // Calculate new count with schema validation
            const rawNext = current + delta;
            const { variantsOwned } = clampVariants(rawNext, targetItem.variantsTotal);

            return { ...prev, [itemId]: variantsOwned };
        });
    }, [catalog, setUserCounts]);

    // ═══════════════════════════════════════════════════════════════════════════
    // COMPUTED STATS
    // ═══════════════════════════════════════════════════════════════════════════

    const completionCost = useMemo(() => {
        return calculateCompletionCost(items);
    }, [items]);

    const stats = useMemo(() => {
        const total = items.length;
        const complete = items.filter(i => i.variantsOwned >= i.variantsTotal).length;
        const totalVariants = items.reduce((sum, i) => sum + (i.variantsTotal || 0), 0);
        const ownedVariants = items.reduce((sum, i) => sum + (i.variantsOwned || 0), 0);
        const progressPercent = totalVariants > 0
            ? Math.round((ownedVariants / totalVariants) * 100)
            : 0;

        return { total, complete, totalVariants, ownedVariants, progressPercent };
    }, [items]);

    // ═══════════════════════════════════════════════════════════════════════════
    // RETURN VALUE
    // ═══════════════════════════════════════════════════════════════════════════

    return {
        items,
        status,
        updateCount,
        completionCost,
        stats,
    };
}

export default useWardrobe;
