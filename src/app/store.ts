/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REDUX STORE CONFIGURATION - THE SWITCHBOARD
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file merges all slices (simulation, compendium, environment) into one
 * centralized state tree. It acts as the "switchboard" for the entire app.
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Import slices (we'll create these next)
import simulationReducer from '../features/simulationSlice.ts';
import compendiumReducer from '../features/compendiumSlice.ts';
import environmentReducer from '../features/environmentSlice.ts';
import economicsReducer from '../features/economicsSlice.ts';

// ═══════════════════════════════════════════════════════════════════════════
// ROOT REDUCER - Combines all system reducers
// ═══════════════════════════════════════════════════════════════════════════

const rootReducer = combineReducers({
  // Player Simulation State (Cash, Gold, Rank, etc.)
  simulation: simulationReducer,
  
  // The Compendium (Static Data - Items, Animals, Formulas)
  compendium: compendiumReducer,
  
  // Environment State (Time of Day, Weather, Active Bonuses)
  environment: environmentReducer,
  
  // Economics Calculators (Cached Economic Data)
  economics: economicsReducer,
});

// ═══════════════════════════════════════════════════════════════════════════
// STORE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optimize for large JSON data from compendium
    }),
});

// ═══════════════════════════════════════════════════════════════════════════
// TYPE EXPORTS (For use throughout the app)
// ═══════════════════════════════════════════════════════════════════════════

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ═══════════════════════════════════════════════════════════════════════════
// STORE PERSISTENCE (LocalStorage)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Save a portion of state to localStorage
 * Usage: saveStateToStorage('simulation', store.getState().simulation)
 */
export const saveStateToStorage = (key: string, state: any) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(`rdo_sim_${key}`, serialized);
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

/**
 * Load state from localStorage
 * Usage: const saved = loadStateFromStorage('simulation')
 */
export const loadStateFromStorage = (key: string) => {
  try {
    const serialized = localStorage.getItem(`rdo_sim_${key}`);
    return serialized ? JSON.parse(serialized) : null;
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Clear all stored state
 */
export const clearAllStorage = () => {
  ['simulation', 'environment', 'economics'].forEach((key) => {
    try {
      localStorage.removeItem(`rdo_sim_${key}`);
    } catch (error) {
      console.error(`Failed to clear ${key}:`, error);
    }
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default store;
