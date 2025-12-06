// FILE: src/components/MissionTimer.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Mission Timer with RDO Gold Payout Calculator
 * Teaches the 12-minute rule for optimal gold farming
 */
export const MissionTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // RDO Gold Payout Tiers (Community Verified)
  // Source: https://www.reddit.com/r/RedDeadOnline/comments/e4mwj9/
  const getPayout = (sec) => {
    const min = sec / 60;
    if (min < 3) return { gold: 0.08, status: 'POOR', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (min < 6) return { gold: 0.16, status: 'LOW', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (min < 9) return { gold: 0.24, status: 'GOOD', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (min < 12) return { gold: 0.32, status: 'OPTIMAL', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (min < 15) return { gold: 0.36, status: 'DIMINISHING', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { gold: 0.48, status: 'INEFFICIENT', color: 'text-gray-400', bg: 'bg-gray-500/20' };
  };

  const payout = getPayout(seconds);
  const isOptimal = payout.status === 'OPTIMAL';
  const progressToOptimal = Math.min(100, (seconds / 720) * 100); // 720 sec = 12 min

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
      isOptimal 
        ? 'bg-gradient-to-br from-green-900/30 to-green-950/20 border-green-500/50 shadow-lg shadow-green-500/10' 
        : 'bg-[#121212] border-white/10'
    }`}>
      {/* Header - Always Visible */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors"
      >
        <h4 className="text-white font-bold flex items-center gap-2">
          <Clock size={16} className={isActive ? 'text-green-400 animate-pulse' : 'text-gray-400'}/> 
          Mission Timer
        </h4>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="text-lg font-mono font-bold text-[#D4AF37]">
              {formatTime(seconds)}
            </span>
          )}
          {isCollapsed ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronUp size={16} className="text-gray-500"/>}
        </div>
      </button>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center mb-3">
            <span className={`text-xs font-bold px-2 py-1 rounded ${payout.bg} ${payout.color}`}>
              {payout.status}
            </span>
            <span className="text-xs text-gray-500">
              Target: <span className="text-green-400 font-mono">12:00</span>
            </span>
          </div>

          {/* Main Timer Display */}
          <div className={`text-5xl font-mono font-black text-center mb-3 transition-colors ${payout.color}`}>
            {formatTime(seconds)}
          </div>

          {/* Progress Bar to Optimal */}
          <div className="h-2 bg-black/50 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full transition-all duration-1000 ${isOptimal ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500'}`}
              style={{ width: `${progressToOptimal}%` }}
            />
          </div>

          {/* Gold Estimate */}
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-400">Estimated Payout:</span>
            <span className="text-[#D4AF37] font-bold font-mono">{payout.gold.toFixed(2)} GB</span>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsActive(!isActive)} 
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isActive 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
              }`}
            >
              {isActive ? <><Pause size={14}/> PAUSE</> : <><Play size={14}/> START</>}
            </button>
            <button 
              onClick={reset} 
              className="px-4 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={16}/>
            </button>
          </div>

          {/* Optimal Alert */}
          {isOptimal && (
            <div className="mt-3 p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs text-center animate-pulse flex items-center justify-center gap-2">
              <AlertCircle size={12}/> 
              TURN IN NOW FOR MAX EFFICIENCY
            </div>
          )}

          {/* Educational Tip */}
          <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-gray-500">
            <span className="text-gray-400">💡 Tip:</span> Gold payouts scale with time but plateau at 12 minutes. 
            Turning in faster = more missions/hour = more total gold.
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionTimer;
