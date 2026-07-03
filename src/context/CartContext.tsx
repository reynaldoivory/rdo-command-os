// FILE: src/context/CartContext.tsx
// Cart Context - Shopping cart state and operations

import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { CartTotals } from "../types/rdo.types";
import { CATALOG } from "../data/catalog";
import { usePersistentState } from "../hooks/usePersistentState";
import { useProfileState } from "./ProfileStateContext";

export interface CartContextValue {
    cart: string[];
    cartTotals: CartTotals;
    remaining: { cash: number; gold: number };
    setCart: React.Dispatch<React.SetStateAction<string[]>>;
    addToCart: (itemId: string) => void;
    removeFromCart: (itemId: string) => void;
    toggleCartItem: (itemId: string) => void;
    clearCart: () => void;
}

const CartCtx = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { profile, profileId } = useProfileState();

    const [cart, setCart] = usePersistentState(`cart_${profileId}`, []);

    const cartTotals = useMemo<CartTotals>(
        () =>
            cart.reduce(
                (acc: CartTotals, id: string) => {
                    const item = CATALOG.find((i: any) => i.id === id);
                    return item
                        ? { cash: acc.cash + item.price, gold: acc.gold + item.gold }
                        : acc;
                },
                { cash: 0, gold: 0 }
            ),
        [cart]
    );

    const remaining = useMemo(
        () => ({
            cash: profile.cash - cartTotals.cash,
            gold: profile.gold - cartTotals.gold,
        }),
        [profile.cash, profile.gold, cartTotals]
    );

    const addToCart = useCallback(
        (itemId: string) => {
            setCart((prev: string[]) =>
                prev.includes(itemId) ? prev : [...prev, itemId]
            );
        },
        [setCart]
    );

    const removeFromCart = useCallback(
        (itemId: string) => {
            setCart((prev: string[]) => prev.filter((id: string) => id !== itemId));
        },
        [setCart]
    );

    const toggleCartItem = useCallback(
        (itemId: string) => {
            setCart((prev: string[]) =>
                prev.includes(itemId)
                    ? prev.filter((id: string) => id !== itemId)
                    : [...prev, itemId]
            );
        },
        [setCart]
    );

    const clearCart = useCallback(() => {
        setCart([]);
    }, [setCart]);

    const value = useMemo<CartContextValue>(
        () => ({
            cart,
            cartTotals,
            remaining,
            setCart,
            addToCart,
            removeFromCart,
            toggleCartItem,
            clearCart,
        }),
        [cart, cartTotals, remaining, setCart, addToCart, removeFromCart, toggleCartItem, clearCart]
    );

    return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCartContext(): CartContextValue {
    const ctx = useContext(CartCtx);
    if (ctx === undefined) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return ctx;
}
