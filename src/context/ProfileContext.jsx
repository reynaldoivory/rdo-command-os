// FILE: src/context/ProfileContext.jsx
// ═══════════════════════════════════════════════════════════════════════════
// PROFILE CONTEXT - Stage 2 State Management
// Eliminates prop drilling for profile, cart, and catalog state
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo, useState, useCallback } from 'react';
import { analyzeProfile, explainAnalysis } from '../logic/nextBestAction';
import { CATALOG, UI_CONFIG } from '../data/rdo-data';
import { usePersistentState } from '../hooks/usePersistentState';
import { migrateProfile } from '../utils/migrations';
import { getLevelFromXP } from '../utils/rdo-logic';
import { DEFAULT_PROFILE } from './profileConstants';
import { ProfileContext } from './profileContextInstance';

/**
 * ProfileProvider - Wraps Dashboard to provide global state access
 * @param {string} profileId - Current profile slot identifier
 * @param {React.ReactNode} children - Dashboard content
 */
export function ProfileProvider({ profileId, children }) {
    // Core persistent state
    const [profile, setProfile] = usePersistentState(
        `profile_${profileId}`,
        DEFAULT_PROFILE,
        migrateProfile
    );
    const [cart, setCart] = usePersistentState(`cart_${profileId}`, []);
    // Local UI state that used to live in Dashboard
    const [filter, setFilter] = useState('all');

    // Debug: log load for diagnostics
    // console.log('[ProfileProvider] mount', profileId);

    // Derived values
    const level = getLevelFromXP(profile.xp);

    const cartTotals = useMemo(() => cart.reduce((acc, id) => {
        const item = CATALOG.find(i => i.id === id);
        return item ? { cash: acc.cash + item.price, gold: acc.gold + item.gold } : acc;
    }, { cash: 0, gold: 0 }), [cart]);

    const remaining = useMemo(() => ({
        cash: profile.cash - cartTotals.cash,
        gold: profile.gold - cartTotals.gold
    }), [profile.cash, profile.gold, cartTotals]);

    // Wagon state canonicalization
    const wagonLoadPercent = profile.traderState?.goodsPercent ?? 0;

    // Engine outputs (canonical source of truth)
    const nextBestAction = useMemo(() => analyzeProfile(profile, { load: wagonLoadPercent }), [profile, wagonLoadPercent]);
    const analysisDiagnostics = useMemo(() => explainAnalysis(profile, { load: wagonLoadPercent }), [profile, wagonLoadPercent]);

    // Cart operations - memoized with useCallback for stable references
    const addToCart = useCallback((itemId) => {
        setCart(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
    }, [setCart]);

    const removeFromCart = useCallback((itemId) => {
        setCart(prev => prev.filter(id => id !== itemId));
    }, [setCart]);

    const toggleCartItem = useCallback((itemId) => {
        setCart(prev => prev.includes(itemId)
            ? prev.filter(id => id !== itemId)
            : [...prev, itemId]
        );
    }, [setCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, [setCart]);

    // Profile operations - memoized with useCallback for stable references
    const updateProfile = useCallback((updates) => {
        setProfile(prev => ({ ...prev, ...updates }));
    }, [setProfile]);

    const updateRole = useCallback((roleKey, xp) => {
        setProfile(prev => ({
            ...prev,
            roles: { ...prev.roles, [roleKey]: xp }
        }));
    }, [setProfile]);

    const travel = useCallback((destinationKey, cost) => {
        setProfile(prev => ({
            ...prev,
            location: destinationKey,
            cash: prev.cash - cost
        }));
    }, [setProfile]);

    // Context value - memoized to prevent unnecessary re-renders
    const value = useMemo(() => ({
        // State
        profile,
        cart,
        profileId,

        // Derived
        level,
        cartTotals,
        remaining,

        // Profile actions
        setProfile,
        updateProfile,
        updateRole,
        travel,

        // Cart actions
        setCart,
        addToCart,
        removeFromCart,
        toggleCartItem,
        clearCart,

        // Static data references
        CATALOG,
        UI_CONFIG,

        // UI state
        filter,
        setFilter,

        // Engine outputs
        nextBestAction,
        analysisDiagnostics,
    }), [
        profile,
        cart,
        profileId,
        level,
        cartTotals,
        remaining,
        filter,
        setProfile,
        updateProfile,
        updateRole,
        travel,
        setCart,
        addToCart,
        removeFromCart,
        toggleCartItem,
        clearCart,
        setFilter,
        nextBestAction,
        analysisDiagnostics
    ]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

