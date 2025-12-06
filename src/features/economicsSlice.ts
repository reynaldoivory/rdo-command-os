/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ECONOMICS SLICE - Calculated Economic Data Cache
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Caches calculated values: Profit Projections, Optimal Routes, etc.
 * This is expensive calculations that we want to memoize across renders.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalculatedProfit {
  activity: string;          // bounty, trader, moonshiner, collector, naturalist
  base_profit: number;
  bonuses_applied: number;
  total_profit: number;
  time_required: number;     // Seconds
  profit_per_hour: number;
  metadata?: Record<string, any>;
}

export interface OptimalRoute {
  activity: string;
  steps: Array<{
    description: string;
    duration: number;
    reward: number;
  }>;
  total_duration: number;
  total_reward: number;
  efficiency: number;        // Reward per hour
}

interface EconomicsState {
  calculated_profits: Record<string, CalculatedProfit>;
  optimal_routes: Record<string, OptimalRoute>;
  role_rankings: Array<{
    role: string;
    profit_per_hour: number;
    recent_average: number;
  }>;
  last_calculated: string | null;
}

const initialState: EconomicsState = {
  calculated_profits: {},
  optimal_routes: {},
  role_rankings: [],
  last_calculated: null,
};

export const economicsSlice = createSlice({
  name: 'economics',
  initialState,
  reducers: {
    /**
     * Update calculated profit for an activity
     */
    updateProfit: (
      state,
      action: PayloadAction<{ key: string; profit: CalculatedProfit }>
    ) => {
      state.calculated_profits[action.payload.key] = action.payload.profit;
      state.last_calculated = new Date().toISOString();
    },

    /**
     * Update multiple profits at once
     */
    updateProfits: (state, action: PayloadAction<Record<string, CalculatedProfit>>) => {
      state.calculated_profits = { ...state.calculated_profits, ...action.payload };
      state.last_calculated = new Date().toISOString();
    },

    /**
     * Update optimal route calculation
     */
    updateRoute: (
      state,
      action: PayloadAction<{ key: string; route: OptimalRoute }>
    ) => {
      state.optimal_routes[action.payload.key] = action.payload.route;
      state.last_calculated = new Date().toISOString();
    },

    /**
     * Update all routes
     */
    updateRoutes: (state, action: PayloadAction<Record<string, OptimalRoute>>) => {
      state.optimal_routes = { ...state.optimal_routes, ...action.payload };
      state.last_calculated = new Date().toISOString();
    },

    /**
     * Update role rankings (sorted by efficiency)
     */
    updateRoleRankings: (
      state,
      action: PayloadAction<
        Array<{
          role: string;
          profit_per_hour: number;
          recent_average: number;
        }>
      >
    ) => {
      state.role_rankings = action.payload;
      state.last_calculated = new Date().toISOString();
    },

    /**
     * Clear all calculations (useful for recalculation)
     */
    clearCalculations: (state) => {
      state.calculated_profits = {};
      state.optimal_routes = {};
      state.role_rankings = [];
    },
  },
});

export const economicsActions = economicsSlice.actions;
export default economicsSlice.reducer;
