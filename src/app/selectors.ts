/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPENDIUM SELECTORS - Derived State
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * These selectors extract and derive state from the compendium reducer.
 * Use these in components instead of directly accessing state.
 */

import { RootState } from '../app/store';

/**
 * Get the loading status of the compendium
 * @example
 * const status = useAppSelector(selectCompendiumStatus);
 * if (status === 'loading') return <LoadingScreen />;
 */
export const selectCompendiumStatus = (state: RootState) => {
  if (!state.compendium.data) {
    if (state.compendium.error) return 'error';
    if (state.compendium.loading) return 'loading';
    return 'idle';
  }
  return 'ready';
};

/**
 * Get the error message if compendium failed to load
 */
export const selectCompendiumError = (state: RootState) => state.compendium.error;

/**
 * Check if compendium is currently loading
 */
export const selectCompendiumIsLoading = (state: RootState) => state.compendium.loading;

/**
 * Get all catalog items
 */
export const selectAllItems = (state: RootState) => state.compendium.data?.items || [];

/**
 * Get all animals
 */
export const selectAllAnimals = (state: RootState) => state.compendium.data?.animals || [];

/**
 * Get a specific item by ID
 */
export const selectItemById = (id: string) => (state: RootState) =>
  state.compendium.data?.items.find((item) => item.id === id);
