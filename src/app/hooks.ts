/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPED REDUX HOOKS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Pre-typed useDispatch and useSelector hooks for consistency across the app.
 * Use these instead of importing from 'react-redux' directly.
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Use this hook instead of plain useDispatch.
 * It provides type-safe dispatch with all actions available.
 * 
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(simulationActions.updatePlayerCash(1000));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Use this hook instead of plain useSelector.
 * It provides type-safe state selection with full RootState typing.
 * 
 * @example
 * const cash = useAppSelector((state) => state.simulation.cash);
 * const items = useAppSelector((state) => state.compendium.items);
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Convenience hook for getting the full simulation state
 * 
 * @example
 * const sim = useSimulationState();
 * console.log(sim.cash, sim.gold_bars, sim.rank);
 */
export const useSimulationState = () =>
  useAppSelector((state) => state.simulation);

/**
 * Convenience hook for getting the full compendium state
 * 
 * @example
 * const compendium = useCompendiumState();
 * console.log(compendium.items['w_mauser']);
 */
export const useCompendiumState = () =>
  useAppSelector((state) => state.compendium);

/**
 * Convenience hook for getting environment state (time, weather, bonuses)
 * 
 * @example
 * const env = useEnvironmentState();
 * console.log(env.time_of_day, env.active_bonuses);
 */
export const useEnvironmentState = () =>
  useAppSelector((state) => state.environment);

/**
 * Convenience hook for getting economics cache state
 * 
 * @example
 * const econ = useEconomicsState();
 * console.log(econ.calculated_profits);
 */
export const useEconomicsState = () =>
  useAppSelector((state) => state.economics);
