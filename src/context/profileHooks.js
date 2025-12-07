// FILE: src/context/profileHooks.js
// Profile-related hooks that use ProfileContext

import { useContext } from 'react';
import { ProfileContext } from './profileContextInstance';

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

