/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPENDIUM SLICE - Static Data Management (The Truth)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Holds all static game data: Items, Animals, Formulas, Roles, Regions.
 * This is the "Source of Truth" that never changes during a session.
 * Data is loaded once at app startup from JSON files.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  RDOCompendium,
  CatalogItem,
  Animal,
  LegendaryAnimal,
  EconomicFormula,
  FastTravelNode,
  FastTravelRoute,
  Region,
  Role,
  CollectorSet,
  EconomicBonus,
} from '../data/schema/rdo_unified_schema';

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

const initialState: {
  data: RDOCompendium | null;
  loading: boolean;
  error: string | null;
  lastLoaded: string | null;
} = {
  data: null,
  loading: false,
  error: null,
  lastLoaded: null,
};

// ═══════════════════════════════════════════════════════════════════════════
// SLICE DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export const compendiumSlice = createSlice({
  name: 'compendium',
  initialState,
  reducers: {
    // ═════════════════════════════════════════════════════════════════════
    // LOAD OPERATIONS
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Initiate data load (show loading state)
     */
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    /**
     * Complete data load with full compendium
     * @example
     * dispatch(loadCompendiumSuccess(compendiumJSON))
     */
    loadCompendiumSuccess: (state, action: PayloadAction<RDOCompendium>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
      state.lastLoaded = new Date().toISOString();
    },

    /**
     * Handle load error
     */
    loadCompendiumError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.data = null;
    },

    // ═════════════════════════════════════════════════════════════════════
    // PARTIAL UPDATES (For hot-reloading during development)
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update a single item in catalog
     */
    updateItem: (state, action: PayloadAction<CatalogItem>) => {
      if (!state.data) return;
      state.data.items[action.payload.id] = action.payload;
    },

    /**
     * Update multiple items
     */
    updateItems: (state, action: PayloadAction<CatalogItem[]>) => {
      if (!state.data) return;
      action.payload.forEach((item) => {
        state.data!.items[item.id] = item;
      });
    },

    /**
     * Update an animal
     */
    updateAnimal: (state, action: PayloadAction<Animal | LegendaryAnimal>) => {
      if (!state.data) return;
      state.data.animals[action.payload.id] = action.payload;
    },

    /**
     * Update multiple animals
     */
    updateAnimals: (state, action: PayloadAction<(Animal | LegendaryAnimal)[]>) => {
      if (!state.data) return;
      action.payload.forEach((animal) => {
        state.data!.animals[animal.id] = animal;
      });
    },

    /**
     * Update a formula
     */
    updateFormula: (state, action: PayloadAction<EconomicFormula>) => {
      if (!state.data) return;
      state.data.formulas[action.payload.id] = action.payload;
    },

    /**
     * Update a region
     */
    updateRegion: (state, action: PayloadAction<Region>) => {
      if (!state.data) return;
      state.data.regions[action.payload.id] = action.payload;
    },

    /**
     * Update a role
     */
    updateRole: (state, action: PayloadAction<Role>) => {
      if (!state.data) return;
      state.data.roles[action.payload.id] = action.payload;
    },

    /**
     * Update fast travel network
     */
    updateFastTravelNetwork: (
      state,
      action: PayloadAction<{
        nodes: Record<string, FastTravelNode>;
        routes: FastTravelRoute[];
      }>
    ) => {
      if (!state.data) return;
      state.data.fast_travel_nodes = action.payload.nodes;
      state.data.fast_travel_routes = action.payload.routes;
    },

    /**
     * Update collector sets
     */
    updateCollectorSets: (state, action: PayloadAction<CollectorSet[]>) => {
      if (!state.data) return;
      state.data.collector_sets = action.payload;
    },

    /**
     * Update active economic bonuses
     */
    updateEconomicBonuses: (state, action: PayloadAction<EconomicBonus[]>) => {
      if (!state.data) return;
      state.data.bonuses = action.payload;
    },

    /**
     * Update data quality summary (useful for UI)
     */
    updateDataQualitySummary: (
      state,
      action: PayloadAction<{
        high_confidence_items: number;
        medium_confidence_items: number;
        low_confidence_items: number;
        last_verification_date: string;
      }>
    ) => {
      if (!state.data) return;
      state.data.data_quality_summary = action.payload;
    },

    // ═════════════════════════════════════════════════════════════════════
    // BULK OPERATIONS
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Clear all data (useful for logout or reset)
     */
    clearCompendium: (state) => {
      state.data = null;
      state.error = null;
      state.lastLoaded = null;
    },

    /**
     * Merge new data with existing data (for incremental updates)
     */
    mergeCompendium: (state, action: PayloadAction<Partial<RDOCompendium>>) => {
      if (!state.data) {
        state.data = {
          version: '3.0',
          last_updated: new Date().toISOString(),
          game_version: 'unknown',
          items: {},
          animals: {},
          formulas: {},
          bonuses: [],
          regions: {},
          fast_travel_nodes: {},
          fast_travel_routes: [],
          roles: {},
          collector_sets: [],
          data_quality_summary: {
            high_confidence_items: 0,
            medium_confidence_items: 0,
            low_confidence_items: 0,
            last_verification_date: new Date().toISOString(),
          },
          ...action.payload,
        };
      } else {
        // Merge dictionaries
        if (action.payload.items) {
          state.data.items = { ...state.data.items, ...action.payload.items };
        }
        if (action.payload.animals) {
          state.data.animals = { ...state.data.animals, ...action.payload.animals };
        }
        if (action.payload.formulas) {
          state.data.formulas = { ...state.data.formulas, ...action.payload.formulas };
        }
        if (action.payload.regions) {
          state.data.regions = { ...state.data.regions, ...action.payload.regions };
        }
        if (action.payload.roles) {
          state.data.roles = { ...state.data.roles, ...action.payload.roles };
        }
        if (action.payload.fast_travel_nodes) {
          state.data.fast_travel_nodes = {
            ...state.data.fast_travel_nodes,
            ...action.payload.fast_travel_nodes,
          };
        }
        // Replace arrays
        if (action.payload.fast_travel_routes) {
          state.data.fast_travel_routes = action.payload.fast_travel_routes;
        }
        if (action.payload.bonuses) {
          state.data.bonuses = action.payload.bonuses;
        }
        if (action.payload.collector_sets) {
          state.data.collector_sets = action.payload.collector_sets;
        }
        // Update metadata
        if (action.payload.last_updated) {
          state.data.last_updated = action.payload.last_updated;
        }
      }
    },
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// HELPER SELECTORS (Can also be in a separate selectors.ts file)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Quick selector to check if data is loaded
 * Usage: useAppSelector(selectCompendiumLoaded)
 */
export const selectCompendiumLoaded = (state: any) => {
  return state.compendium.data !== null && !state.compendium.loading;
};

/**
 * Quick selector to get all items
 */
export const selectAllItems = (state: any) => {
  return state.compendium.data?.items || {};
};

/**
 * Quick selector to get all animals
 */
export const selectAllAnimals = (state: any) => {
  return state.compendium.data?.animals || {};
};

/**
 * Quick selector to get all formulas
 */
export const selectAllFormulas = (state: any) => {
  return state.compendium.data?.formulas || {};
};

/**
 * Quick selector to get all roles
 */
export const selectAllRoles = (state: any) => {
  return state.compendium.data?.roles || {};
};

/**
 * Quick selector to get fast travel nodes
 */
export const selectFastTravelNodes = (state: any) => {
  return state.compendium.data?.fast_travel_nodes || {};
};

/**
 * Quick selector to get collector sets
 */
export const selectCollectorSets = (state: any) => {
  return state.compendium.data?.collector_sets || [];
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

export const compendiumActions = compendiumSlice.actions;
export default compendiumSlice.reducer;
