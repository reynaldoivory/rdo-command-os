// FILE: src/context/ProfileContext.jsx
// ═══════════════════════════════════════════════════════════════════════════
// PROFILE CONTEXT - Stage 2 State Management
// Eliminates prop drilling for profile, cart, and catalog state
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useMemo, useState } from 'react';
import { analyzeProfile } from '../logic/nextBestAction';
import { explainAnalysis } from '../logic/nextBestAction';
import { CATALOG, UI_CONFIG } from '../data/rdo-data';
import { usePersistentState } from '../hooks/usePersistentState';
import { migrateProfile } from '../utils/migrations';
import { getLevelFromXP } from '../utils/rdo-logic';

// Fresh Spawn Default State
const DEFAULT_PROFILE = {
    rank: 1,
    xp: 0,
    cash: 0,
    gold: 0,
    tokens: 0,
    location: 'valentine',
    roles: {
        bountyHunter: 0,
        trader: 0,
        collector: 0,
        moonshiner: 0,
        naturalist: 0
    }
};

// Context with undefined default (forces provider usage)
const ProfileContext = createContext(undefined);

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

    // Cart operations
    const addToCart = (itemId) => {
        setCart(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(id => id !== itemId));
    };

    const toggleCartItem = (itemId) => {
        setCart(prev => prev.includes(itemId)
            ? prev.filter(id => id !== itemId)
            : [...prev, itemId]
        );
    };

    const clearCart = () => setCart([]);

    // Profile operations
    const updateProfile = (updates) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const updateRole = (roleKey, xp) => {
        setProfile(prev => ({
            ...prev,
            roles: { ...prev.roles, [roleKey]: xp }
        }));
    };

    const travel = (destinationKey, cost) => {
        setProfile(prev => ({
            ...prev,
            location: destinationKey,
            cash: prev.cash - cost
        }));
    };

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
        UI_CONFIG
        ,
        // UI state
        filter,
        setFilter,

        // Engine outputs
        nextBestAction,
        analysisDiagnostics,
    }), [profile, cart, profileId, level, cartTotals, remaining, filter, wagonLoadPercent]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

/**
 * useProfile - Hook to access profile context
 * @throws Error if used outside ProfileProvider
 */
export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}

/**
 * useCart - Convenience hook for cart-only access
 */
export function useCart() {
    const { cart, cartTotals, remaining, addToCart, removeFromCart, toggleCartItem, clearCart } = useProfile();
    return { cart, cartTotals, remaining, addToCart, removeFromCart, toggleCartItem, clearCart };
}

/**
 * useWallet - Convenience hook for wallet-only access
 */
export function useWallet() {
    const { profile, level, updateProfile, setProfile } = useProfile();
    return {
        cash: profile.cash,
        gold: profile.gold,
        tokens: profile.tokens,
        xp: profile.xp,
        rank: profile.rank,
        level,
        updateProfile,
        setProfile
    };
}
