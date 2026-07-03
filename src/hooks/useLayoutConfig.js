// FILE: src/hooks/useLayoutConfig.js
// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT CONFIGURATION HOOK
// Persists user's preferred component order to localStorage
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { validateLayoutConfig, sanitizeLayoutConfig, safeJsonParse, safeSetItem } from '../utils/security';

const STORAGE_KEY = 'rdo_layout_config';
const MAX_CONFIG_SIZE = 1024; // 1KB max

// Default section order
const DEFAULT_LEFT_SECTIONS = [
    'mission',
    'wallet',
    'roles',
    'travel',
    'timer',
    'dailies',
    'almanac',
    'wardrobe'
];

const DEFAULT_RIGHT_SECTIONS = [
    'command',
    'specials',
    'search',
    'efficiency',
    'hunting',
    'compendium',
    'cart',
    'filters',
    'catalog'
];

/**
 * Hook to manage draggable layout configuration
 * @returns {{ leftSections, rightSections, moveSection, resetLayout }}
 */
export function useLayoutConfig() {
    const [config, setConfig] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                return { left: DEFAULT_LEFT_SECTIONS, right: DEFAULT_RIGHT_SECTIONS };
            }
            
            // Security: Validate size and parse safely
            const parsed = safeJsonParse(stored, MAX_CONFIG_SIZE);
            if (!parsed) {
                console.warn('[Security] Invalid layout config, using defaults');
                return { left: DEFAULT_LEFT_SECTIONS, right: DEFAULT_RIGHT_SECTIONS };
            }
            
            // Security: Validate and sanitize structure
            const sanitized = sanitizeLayoutConfig(parsed);
            if (sanitized) {
                return sanitized;
            }
            
            // Fallback to defaults if validation fails
            console.warn('[Security] Layout config failed validation, using defaults');
            return { left: DEFAULT_LEFT_SECTIONS, right: DEFAULT_RIGHT_SECTIONS };
        } catch (error) {
            console.error('[Security] Error loading layout config:', error);
            return { left: DEFAULT_LEFT_SECTIONS, right: DEFAULT_RIGHT_SECTIONS };
        }
    });

    /**
     * Move a section within its column or across columns
     * @param {string} fromColumn - Source column ('left' or 'right')
     * @param {number} fromIndex - Current index in source column
     * @param {string} toColumn - Target column ('left' or 'right')
     * @param {number} toIndex - Target index in destination column
     */
    const moveSection = useCallback((fromColumn, fromIndex, toColumn, toIndex) => {
        setConfig(prev => {
            // Same column move
            if (fromColumn === toColumn) {
                const sections = [...prev[fromColumn]];
                const [removed] = sections.splice(fromIndex, 1);
                sections.splice(toIndex, 0, removed);
                const newConfig = { ...prev, [fromColumn]: sections };
                // Security: Validate before saving
                const sanitized = sanitizeLayoutConfig(newConfig);
                if (sanitized) {
                    safeSetItem(STORAGE_KEY, JSON.stringify(sanitized));
                    return sanitized;
                }
                return prev; // Don't update if validation fails
            }

            // Cross-column move
            const fromSections = [...prev[fromColumn]];
            const toSections = [...prev[toColumn]];
            const [removed] = fromSections.splice(fromIndex, 1);
            toSections.splice(toIndex, 0, removed);

            const newConfig = {
                ...prev,
                [fromColumn]: fromSections,
                [toColumn]: toSections
            };
            // Security: Validate before saving
            const sanitized = sanitizeLayoutConfig(newConfig);
            if (sanitized) {
                safeSetItem(STORAGE_KEY, JSON.stringify(sanitized));
                return sanitized;
            }
            return prev; // Don't update if validation fails
        });
    }, []);

    /**
     * Reset to default layout
     */
    const resetLayout = useCallback(() => {
        const defaultConfig = { left: DEFAULT_LEFT_SECTIONS, right: DEFAULT_RIGHT_SECTIONS };
        // Security: Validate defaults before saving
        const sanitized = sanitizeLayoutConfig(defaultConfig);
        if (sanitized) {
            safeSetItem(STORAGE_KEY, JSON.stringify(sanitized));
            setConfig(sanitized);
        }
    }, []);

    /**
     * Toggle section visibility (future feature)
     */
    const toggleSection = useCallback((column, sectionId) => {
        setConfig(prev => {
            const sections = prev[column];
            const exists = sections.includes(sectionId);

            const newSections = exists
                ? sections.filter(s => s !== sectionId)
                : [...sections, sectionId];

            const newConfig = { ...prev, [column]: newSections };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
            return newConfig;
        });
    }, []);

    return {
        leftSections: config.left,
        rightSections: config.right,
        moveSection,
        resetLayout,
        toggleSection
    };
}

// Section metadata for UI
export const SECTION_META = {
    wallet: { label: 'Wallet State', icon: 'User' },
    roles: { label: 'Role Progression', icon: 'Award' },
    travel: { label: 'Travel Map', icon: 'Map' },
    timer: { label: 'Mission Timer', icon: 'Clock' },
    almanac: { label: 'Outlaw Almanac', icon: 'Book' },
    wardrobe: { label: 'Wardrobe Tracker', icon: 'Shirt' },
    specials: { label: 'Weekly Specials', icon: 'Sparkles' },
    search: { label: 'Command Search', icon: 'Search' },
    efficiency: { label: 'Efficiency Engine', icon: 'TrendingUp' },
    hunting: { label: 'Hunting Terminal', icon: 'Crosshair' },
    compendium: { label: 'Compendium', icon: 'BookOpen' },
    cart: { label: 'Purchase Plan', icon: 'ShoppingCart' },
    filters: { label: 'Catalog Filters', icon: 'Filter' },
    catalog: { label: 'Item Catalog', icon: 'Package' }
};
