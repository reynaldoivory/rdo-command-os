/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENVIRONMENT SLICE - Game World State
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Tracks environment conditions: Time of Day, Weather, Active Bonuses, Events
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EconomicBonus } from '../data/schema/rdo_unified_schema';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';
export type WeatherType = 'clear' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';

interface EnvironmentState {
  time_of_day: TimeOfDay;
  weather: WeatherType;
  active_bonuses: EconomicBonus[];
  current_date: string;
  game_speed_multiplier: number;  // 1.0 = normal, 0.5 = double speed
  server_maintenance: boolean;
}

const initialState: EnvironmentState = {
  time_of_day: 'day',
  weather: 'clear',
  active_bonuses: [],
  current_date: new Date().toISOString().split('T')[0],
  game_speed_multiplier: 1.0,
  server_maintenance: false,
};

export const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    /**
     * Update time of day
     */
    setTimeOfDay: (state, action: PayloadAction<TimeOfDay>) => {
      state.time_of_day = action.payload;
    },

    /**
     * Update weather
     */
    setWeather: (state, action: PayloadAction<WeatherType>) => {
      state.weather = action.payload;
    },

    /**
     * Set active economic bonuses
     */
    setActiveBonuses: (state, action: PayloadAction<EconomicBonus[]>) => {
      state.active_bonuses = action.payload;
    },

    /**
     * Add a bonus
     */
    addBonus: (state, action: PayloadAction<EconomicBonus>) => {
      state.active_bonuses.push(action.payload);
    },

    /**
     * Remove a bonus by ID
     */
    removeBonus: (state, action: PayloadAction<string>) => {
      state.active_bonuses = state.active_bonuses.filter(
        (b) => b.id !== action.payload
      );
    },

    /**
     * Update current date
     */
    setCurrentDate: (state, action: PayloadAction<string>) => {
      state.current_date = action.payload;
    },

    /**
     * Set game speed multiplier (for simulation)
     */
    setGameSpeedMultiplier: (state, action: PayloadAction<number>) => {
      state.game_speed_multiplier = Math.max(0.1, action.payload);
    },

    /**
     * Set server maintenance flag
     */
    setServerMaintenance: (state, action: PayloadAction<boolean>) => {
      state.server_maintenance = action.payload;
    },
  },
});

export const environmentActions = environmentSlice.actions;
export default environmentSlice.reducer;
