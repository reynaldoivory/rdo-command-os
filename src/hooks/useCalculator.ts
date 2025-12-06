/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SAFE CALCULATOR HOOK - Graceful Error Handling
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Wraps simulator function calls in try/catch to prevent component crashes.
 * If validation fails, the error is displayed locally instead of crashing.
 */

import { useState, useCallback } from 'react';

export interface CalculationState<T> {
  result: T | null;
  error: string | null;
  isCalculating: boolean;
}

/**
 * Hook for safe calculator calls with local error handling
 * 
 * @example
 * const { result, error, calculate } = useCalculator(calculateBountyPayout);
 * 
 * const handleCalculate = () => {
 *   calculate({ tier: 2, alive: true, targetCount: 1, minutesElapsed: 12 });
 * };
 * 
 * if (error) return <div className="text-red-400">{error}</div>;
 * if (result) return <div>{result.cash}</div>;
 */
export function useCalculator<T extends any[], R>(
  calculatorFn: (...args: T) => R
): CalculationState<R> & { calculate: (...args: T) => void } {
  const [state, setState] = useState<CalculationState<R>>({
    result: null,
    error: null,
    isCalculating: false,
  });

  const calculate = useCallback(
    (...args: T) => {
      setState({ result: null, error: null, isCalculating: true });

      try {
        // === CRITICAL FIX: Catch validation errors locally ===
        const result = calculatorFn(...args);
        setState({
          result,
          error: null,
          isCalculating: false,
        });
      } catch (err) {
        // Don't crash the component - show error message instead
        const errorMessage = err instanceof Error ? err.message : 'Unknown calculation error';
        
        console.warn('⚠️ Calculator validation error:', errorMessage);
        
        setState({
          result: null,
          error: errorMessage,
          isCalculating: false,
        });
      }
    },
    [calculatorFn]
  );

  return {
    ...state,
    calculate,
  };
}

/**
 * Hook for safe async calculator calls (future use)
 * Similar to useCalculator but handles async calculators
 */
export function useAsyncCalculator<T extends any[], R>(
  calculatorFn: (...args: T) => Promise<R>
): CalculationState<R> & { calculate: (...args: T) => Promise<void> } {
  const [state, setState] = useState<CalculationState<R>>({
    result: null,
    error: null,
    isCalculating: false,
  });

  const calculate = useCallback(
    async (...args: T) => {
      setState({ result: null, error: null, isCalculating: true });

      try {
        const result = await calculatorFn(...args);
        setState({
          result,
          error: null,
          isCalculating: false,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown calculation error';
        console.warn('⚠️ Async calculator error:', errorMessage);
        setState({
          result: null,
          error: errorMessage,
          isCalculating: false,
        });
      }
    },
    [calculatorFn]
  );

  return {
    ...state,
    calculate,
  };
}
