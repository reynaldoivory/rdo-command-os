/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SYSTEM LOADER HOOK - Bootstrap the Entire Application
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is the "Adapter" that bridges static JSON files into Redux State.
 * It runs once on app startup and initializes all systems.
 * 
 * To add a new system (e.g., Naturalist):
 * 1. Create naturalist-data.json in data/static/
 * 2. Import it here
 * 3. Dispatch action to load it into compendium slice
 * 4. Wrap your App component with <Suspense fallback={<Loading />}>
 */

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { compendiumActions } from '../features/compendiumSlice';
import { environmentActions } from '../features/environmentSlice';
import { loadStateFromStorage, saveStateToStorage } from '../app/store';
import { simulationActions } from '../features/simulationSlice';
import type { RDOCompendium } from '../data/schema/rdo_unified_schema';
import { FALLBACK_ITEMS } from '../domain/fallbackData';

// Import static data files
import compendiumData from '../data/static/compendium.json';

export interface SystemLoaderStatus {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  progress: {
    compendium: boolean;
    environment: boolean;
    simulation: boolean;
    storage: boolean;
  };
}

/**
 * Hook that initializes the entire RDO OS on app startup
 * 
 * @returns {SystemLoaderStatus} Current loading status
 * 
 * @example
 * function App() {
 *   const { isReady, isLoading, error } = useSystemLoader();
 *   
 *   if (isLoading) return <LoadingScreen />;
 *   if (error) return <ErrorScreen error={error} />;
 *   if (!isReady) return <BootScreen />;
 *   
 *   return <MainApp />;
 * }
 */
export const useSystemLoader = (): SystemLoaderStatus => {
  const dispatch = useAppDispatch();
  const compendiumLoaded = useAppSelector((state) => state.compendium.data !== null);

  const [status, setStatus] = useState<SystemLoaderStatus>({
    isReady: false,
    isLoading: true,
    error: null,
    progress: {
      compendium: false,
      environment: false,
      simulation: false,
      storage: false,
    },
  });

  // ═══════════════════════════════════════════════════════════════════════
  // LOAD COMPENDIUM
  // ═══════════════════════════════════════════════════════════════════════

  const loadCompendium = useCallback(async () => {
    try {
      console.log('🔄 RDO OS: Loading Compendium...');
      dispatch(compendiumActions.setLoading());

      // Load the compendium JSON
      const loadedCompendium = compendiumData as RDOCompendium;

      dispatch(compendiumActions.loadCompendiumSuccess(loadedCompendium));
      console.log('✅ Compendium loaded');

      setStatus((s) => ({
        ...s,
        progress: { ...s.progress, compendium: true },
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to load compendium:', errorMsg);
      console.warn('⚠️ CRITICAL: Using fallback data to prevent app crash');
      
      // === CRITICAL FIX: Load fallback data instead of crashing ===
      const fallbackCompendium: RDOCompendium = {
        items: FALLBACK_ITEMS,
        animals: [],
        legendary_animals: [],
        formulas: [],
        fast_travel_routes: [],
        regions: [],
        roles: [],
        collector_sets: [],
      };
      
      dispatch(compendiumActions.loadCompendiumSuccess(fallbackCompendium));
      
      setStatus((s) => ({
        ...s,
        error: `Using fallback data: ${errorMsg}`,
        progress: { ...s.progress, compendium: true }, // Mark as complete despite error
      }));
    }
  }, [dispatch]);

  // ═══════════════════════════════════════════════════════════════════════
  // LOAD ENVIRONMENT
  // ═══════════════════════════════════════════════════════════════════════

  const loadEnvironment = useCallback(() => {
    try {
      console.log('🔄 RDO OS: Loading Environment...');

      // Set current date
      dispatch(
        environmentActions.setCurrentDate(
          new Date().toISOString().split('T')[0]
        )
      );

      // TODO: Fetch bonuses from external source (API, JSON, etc.)
      // For now, initialize with empty bonuses
      dispatch(environmentActions.setActiveBonuses([]));

      console.log('✅ Environment loaded');

      setStatus((s) => ({
        ...s,
        progress: { ...s.progress, environment: true },
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to load environment:', errorMsg);
      setStatus((s) => ({
        ...s,
        error: errorMsg,
      }));
    }
  }, [dispatch]);

  // ═══════════════════════════════════════════════════════════════════════
  // LOAD SIMULATION STATE (From localStorage)
  // ═══════════════════════════════════════════════════════════════════════

  const loadSimulation = useCallback(() => {
    try {
      console.log('🔄 RDO OS: Loading Simulation State...');

      const savedState = loadStateFromStorage('simulation');

      if (savedState) {
        console.log('📂 Restoring saved simulation state');
        dispatch(simulationActions.restoreSimulation(savedState));
      } else {
        console.log('🆕 Starting new simulation (no saved state)');
      }

      setStatus((s) => ({
        ...s,
        progress: { ...s.progress, simulation: true },
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to load simulation:', errorMsg);
      // Don't fail on simulation load error - start fresh
      setStatus((s) => ({
        ...s,
        progress: { ...s.progress, simulation: true },
      }));
    }
  }, [dispatch]);

  // ═══════════════════════════════════════════════════════════════════════
  // BOOT SEQUENCE
  // ═══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const bootSystem = async () => {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🎮 RDO CHARACTER OS v3.0 - BOOT SEQUENCE');
      console.log('═══════════════════════════════════════════════════════════');

      try {
        // 1. Load the Compendium (all static data)
        await loadCompendium();

        // 2. Load Environment (bonuses, time, weather)
        loadEnvironment();

        // 3. Load Simulation (player state from storage)
        loadSimulation();

        // 4. All systems online
        console.log('✅ RDO OS: Systems Online');
        console.log('═══════════════════════════════════════════════════════════');

        setStatus((s) => ({
          ...s,
          isReady: true,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ RDO OS: Boot sequence failed', errorMsg);
        setStatus((s) => ({
          ...s,
          isLoading: false,
          error: errorMsg,
        }));
      }
    };

    bootSystem();
  }, [loadCompendium, loadEnvironment, loadSimulation]);

  return status;
};

/**
 * Hook to save current state to localStorage
 * Call this whenever user makes changes they want to persist
 * 
 * @example
 * const saveState = useSaveState();
 * 
 * useEffect(() => {
 *   saveState();
 * }, [sim, saveState]);
 */
export const useSaveState = () => {
  const dispatch = useAppDispatch();
  const sim = useAppSelector((state) => state.simulation);
  const env = useAppSelector((state) => state.environment);
  const econ = useAppSelector((state) => state.economics);

  return useCallback(() => {
    saveStateToStorage('simulation', sim);
    saveStateToStorage('environment', env);
    saveStateToStorage('economics', econ);
    console.log('💾 State saved to localStorage');
  }, [sim, env, econ]);
};
