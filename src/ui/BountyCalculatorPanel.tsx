/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOUNTY CALCULATOR EXAMPLE - UX Integration of Safe Calculations
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component demonstrates how to use the useCalculator hook to handle
 * validation errors gracefully without crashing the entire app.
 * 
 * Copy this pattern for other calculators (trader, moonshiner, etc.)
 */

import React, { useState } from 'react';
import { calculateBountyPayout } from '../simulator/bountyHunter';
import { useCalculator } from '../hooks/useCalculator';

export const BountyCalculatorPanel: React.FC = () => {
  // === User input state ===
  const [tier, setTier] = useState<1 | 2 | 3>(2);
  const [alive, setAlive] = useState(true);
  const [targetCount, setTargetCount] = useState<1 | 2 | 3>(1);
  const [minutesElapsed, setMinutesElapsed] = useState(12);

  // === Safe calculator with local error handling ===
  const { result, error, calculate } = useCalculator(calculateBountyPayout);

  // Handle calculate button click
  const handleCalculate = () => {
    calculate({
      tier,
      alive,
      targetCount,
      minutesElapsed,
    });
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-lg p-6 max-w-md">
      <h2 className="text-[#D4AF37] font-serif font-bold text-xl mb-6">
        Bounty Calculator
      </h2>

      {/* Input Controls */}
      <div className="space-y-4 mb-6">
        {/* Tier Selector */}
        <div>
          <label className="text-xs text-gray-500 uppercase mb-2 block">
            Bounty Tier
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setTier(t as 1 | 2 | 3)}
                className={`flex-1 py-2 rounded text-sm font-bold transition-all ${
                  tier === t
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {'$'.repeat(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Alive Status */}
        <div>
          <label className="text-xs text-gray-500 uppercase mb-2 block">
            Capture Status
          </label>
          <button
            onClick={() => setAlive(!alive)}
            className={`w-full py-2 rounded text-sm font-bold transition-all ${
              alive
                ? 'bg-green-900/30 text-green-400 border border-green-500'
                : 'bg-red-900/30 text-red-400 border border-red-500'
            }`}
          >
            {alive ? '✓ ALIVE BONUS' : '☠ KILLED'}
          </button>
        </div>

        {/* Target Count */}
        <div>
          <label className="text-xs text-gray-500 uppercase mb-2 block">
            Target Count: {targetCount}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            value={targetCount}
            onChange={(e) => setTargetCount(parseInt(e.target.value) as 1 | 2 | 3)}
            className="w-full accent-[#D4AF37]"
          />
        </div>

        {/* Minutes Elapsed */}
        <div>
          <label className="text-xs text-gray-500 uppercase mb-2 block">
            Time: {minutesElapsed} minutes
          </label>
          <input
            type="range"
            min="0"
            max="60"
            value={minutesElapsed}
            onChange={(e) => setMinutesElapsed(parseInt(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
        </div>
      </div>

      {/* === FIX 2: Display validation errors locally (no crash) === */}
      {error && (
        <div className="mb-6 p-3 bg-red-900/20 border border-red-500/50 rounded">
          <div className="text-red-400 text-sm">
            <strong>⚠️ Validation Error:</strong> {error}
          </div>
          <div className="text-red-300 text-xs mt-1">
            Check your inputs and try again
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        className="w-full py-3 bg-[#D4AF37] text-black rounded font-bold hover:bg-[#B8941F] transition-all mb-6"
      >
        Calculate Payout
      </button>

      {/* Results Display */}
      {result && !error && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Cash:</span>
            <span className="text-[#F5DEB3] font-bold">${result.cash.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gold:</span>
            <span className="text-[#D4AF37] font-bold">{result.gold.toFixed(2)} GB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">XP:</span>
            <span className="text-green-400 font-bold">{result.xp}</span>
          </div>
          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Cash/Hour:</span>
              <span className="text-[#F5DEB3] font-bold">
                ${result.cash_per_hour.toFixed(2)}/h
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Gold/Hour:</span>
              <span className="text-[#D4AF37] font-bold">
                {result.gold_per_hour.toFixed(2)} GB/h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
