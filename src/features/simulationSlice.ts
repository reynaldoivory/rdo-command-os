/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SIMULATION SLICE - Player State Management
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Handles all player character state: Cash, Gold, Rank, Role Ranks, etc.
 * This is the STATE part of "State > Logic > Data"
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PlayerCharacter, SimulationAdjustments } from '../data/schema/rdo_unified_schema';

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

const initialState: PlayerCharacter = {
  character_id: 'demo_character',
  rank: 25,
  cash: 5000.00,
  gold_bars: 50.00,
  honor_level: 0,
  health_level: 5,
  stamina_level: 5,
  dead_eye_level: 5,
  
  // Role Ranks
  trader_rank: 10,
  moonshiner_rank: 15,
  bounty_hunter_rank: 12,
  collector_rank: 0,
  naturalist_rank: 0,
  
  // Role States
  trader_goods: 75,
  trader_wagon_size: 'large',
  moonshiner_shack_level: 3,
  moonshiner_current_batch: null,
  moonshiner_batch_progress: 0,
  
  // Session
  in_posse: false,
  roles_owned: ['trader', 'moonshiner', 'bounty_hunter'],
  current_location: 'emerald_station',
  camp_location: 'heartlands_camp',
  last_update: Date.now(),
};

// ═══════════════════════════════════════════════════════════════════════════
// SLICE DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    // ═════════════════════════════════════════════════════════════════════
    // CASH MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update cash (add or subtract, clamped to 0+)
     * @param amount - Positive to add, negative to subtract
     * 
     * @example
     * dispatch(updatePlayerCash(500))    // Add $500
     * dispatch(updatePlayerCash(-100))   // Subtract $100
     */
    updatePlayerCash: (state, action: PayloadAction<number>) => {
      state.cash = Math.max(0, state.cash + action.payload);
      state.last_update = Date.now();
    },

    /**
     * Set cash to exact amount
     * @example
     * dispatch(setPlayerCash(1000)) // Set to exactly $1,000
     */
    setPlayerCash: (state, action: PayloadAction<number>) => {
      state.cash = Math.max(0, action.payload);
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // GOLD MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update gold bars (add or subtract, clamped to 0+)
     * @example
     * dispatch(updatePlayerGold(5))     // Add 5 gold bars
     * dispatch(updatePlayerGold(-2))    // Subtract 2 gold bars
     */
    updatePlayerGold: (state, action: PayloadAction<number>) => {
      state.gold_bars = Math.max(0, state.gold_bars + action.payload);
      state.last_update = Date.now();
    },

    /**
     * Set gold to exact amount
     * @example
     * dispatch(setPlayerGold(25)) // Set to exactly 25 gold bars
     */
    setPlayerGold: (state, action: PayloadAction<number>) => {
      state.gold_bars = Math.max(0, action.payload);
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // RANK MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update player rank (clamped to 1-500)
     * @example
     * dispatch(updatePlayerRank(5)) // Gain 5 ranks
     */
    updatePlayerRank: (state, action: PayloadAction<number>) => {
      state.rank = Math.min(500, Math.max(1, state.rank + action.payload));
      state.last_update = Date.now();
    },

    /**
     * Set rank to exact level
     */
    setPlayerRank: (state, action: PayloadAction<number>) => {
      state.rank = Math.min(500, Math.max(1, action.payload));
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // ROLE RANK MANAGEMENT
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update a specific role rank (clamped to 0-20)
     * @example
     * dispatch(updateRoleRank({ role: 'trader', rank: 15 }))
     */
    updateRoleRank: (
      state,
      action: PayloadAction<{ role: string; rank: number }>
    ) => {
      const { role, rank } = action.payload;
      const key = `${role}_rank` as keyof PlayerCharacter;
      (state[key] as number) = Math.min(20, Math.max(0, rank));
      state.last_update = Date.now();
    },

    /**
     * Add to a role rank
     * @example
     * dispatch(incrementRoleRank({ role: 'bounty_hunter', amount: 2 }))
     */
    incrementRoleRank: (
      state,
      action: PayloadAction<{ role: string; amount: number }>
    ) => {
      const { role, amount } = action.payload;
      const key = `${role}_rank` as keyof PlayerCharacter;
      const current = (state[key] as number) || 0;
      (state[key] as number) = Math.min(20, Math.max(0, current + amount));
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // TRADER STATE
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update trader goods fill level (0-100)
     * @example
     * dispatch(updateTraderGoods(50)) // Set to 50% full
     */
    updateTraderGoods: (state, action: PayloadAction<number>) => {
      state.trader_goods = Math.max(0, Math.min(100, action.payload));
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // MOONSHINER STATE
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update moonshiner batch production
     * @example
     * dispatch(updateMoonshinerBatch({ 
     *   quality: 'strong', 
     *   progress: 50 
     * }))
     */
    updateMoonshinerBatch: (
      state,
      action: PayloadAction<{
        quality: 'weak' | 'average' | 'strong' | null;
        progress: number;
      }>
    ) => {
      const { quality, progress } = action.payload;
      state.moonshiner_current_batch = quality;
      state.moonshiner_batch_progress = Math.max(0, Math.min(100, progress));
      state.last_update = Date.now();
    },

    /**
     * Set moonshiner shack level (1-3)
     */
    setMoonshinerShackLevel: (state, action: PayloadAction<number>) => {
      state.moonshiner_shack_level = Math.min(3, Math.max(1, action.payload));
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // COMPOUND UPDATES
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Bulk update player state
     * @example
     * dispatch(setPlayerState({ 
     *   cash: 2000, 
     *   gold_bars: 100,
     *   rank: 50
     * }))
     */
    setPlayerState: (state, action: PayloadAction<Partial<PlayerCharacter>>) => {
      return { ...state, ...action.payload, last_update: Date.now() };
    },

    /**
     * Reset to initial state (useful for starting new simulation)
     */
    resetSimulation: () => initialState,

    /**
     * Restore saved state from localStorage/export
     */
    restoreSimulation: (state, action: PayloadAction<PlayerCharacter>) => {
      return action.payload;
    },

    // ═════════════════════════════════════════════════════════════════════
    // HONOR & ABILITY LEVELS
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update honor level (-8 to +8)
     */
    updateHonor: (state, action: PayloadAction<number>) => {
      state.honor_level = Math.min(8, Math.max(-8, state.honor_level + action.payload));
      state.last_update = Date.now();
    },

    /**
     * Update health/stamina/dead eye level (1-5)
     */
    updateAbilityLevel: (
      state,
      action: PayloadAction<{ ability: 'health' | 'stamina' | 'dead_eye'; level: number }>
    ) => {
      const { ability, level } = action.payload;
      const key = `${ability}_level` as keyof PlayerCharacter;
      (state[key] as number) = Math.min(5, Math.max(1, level));
      state.last_update = Date.now();
    },

    // ═════════════════════════════════════════════════════════════════════
    // LOCATION & POSSE
    // ═════════════════════════════════════════════════════════════════════

    /**
     * Update current location
     * @example
     * dispatch(setCurrentLocation('valentine'))
     */
    setCurrentLocation: (state, action: PayloadAction<string>) => {
      state.current_location = action.payload;
      state.last_update = Date.now();
    },

    /**
     * Toggle posse status
     */
    togglePosse: (state, action: PayloadAction<boolean>) => {
      state.in_posse = action.payload;
      state.last_update = Date.now();
    },

    /**
     * Update roles owned
     */
    setRolesOwned: (state, action: PayloadAction<string[]>) => {
      state.roles_owned = action.payload;
      state.last_update = Date.now();
    },
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const simulationActions = simulationSlice.actions;
export default simulationSlice.reducer;
