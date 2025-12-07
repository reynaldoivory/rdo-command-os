// FILE: src/components/RoleCard.jsx
// Individual role progression display with Level + XP input
import React, { useState } from 'react';
import { getLevelFromXP, getXPProgress, getXPFromLevel } from '../../utils/rdo-logic';

export const RoleCard = React.memo(({ roleKey, role, xp, onXPChange }) => {
  const Icon = role.icon;
  const level = getLevelFromXP(xp, true, role.maxLevel);
  const progress = getXPProgress(xp, true, role.maxLevel);
  const [editMode, setEditMode] = useState('level'); // 'level' or 'xp'

  // Handle level input - converts level to equivalent XP
  const handleLevelChange = (newLevel) => {
    const clampedLevel = Math.max(1, Math.min(role.maxLevel, newLevel));
    const newXP = getXPFromLevel(clampedLevel, true);
    onXPChange(roleKey, newXP);
  };

  return (
    <div
      data-testid={`role-card-${roleKey}`}
      className={`relative bg-gradient-to-br from-[#0a0a0a] to-[#111] rounded-xl p-4 border border-rdo-gold shadow-rdo hover:border-rdo-gold transition-all group`}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-rdo-gold/20 to-transparent rounded-bl-full" />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${role.bg} shadow-lg shadow-black/50`}>
            <Icon className="text-white" size={16} />
          </div>
          <div>
            <div className="text-sm font-western text-rdo-gold font-bold">{role.name}</div>
            <div className="text-[10px] text-gray-500 uppercase">{role.desc}</div>
          </div>
        </div>
        {/* Editable Level Display */}
        <input
          type="number"
          min={1}
          max={role.maxLevel}
          value={level}
          onChange={(e) => handleLevelChange(Number.parseInt(e.target.value, 10) || 1)}
          className={`text-2xl font-black font-mono ${role.color} bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/20 rounded px-2 w-16 text-right focus:outline-none focus:ring-2 focus:ring-${role.color.split('-')[1]}-500 transition-all cursor-pointer`}
          title={`Click to edit ${role.name} level (1-${role.maxLevel})`}
        />
      </div>

      {/* Toggle between Level and XP edit modes */}
      <div className="bg-black/40 rounded p-2 border border-white/5 mb-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode('level')}
              className={`uppercase ${editMode === 'level' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
              Level
            </button>
            <span className="text-gray-700">|</span>
            <button
              onClick={() => setEditMode('xp')}
              className={`uppercase ${editMode === 'xp' ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
            >
              XP
            </button>
          </div>
          <span>NEXT: {progress.needed.toLocaleString()}</span>
        </div>
        {editMode === 'level' ? (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={role.maxLevel}
              value={level}
              onChange={(e) => handleLevelChange(Number.parseInt(e.target.value, 10))}
              className={`flex-1 h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-current ${role.color}`}
            />
            <span className={`font-mono font-bold ${role.color} w-8 text-right`}>{level}</span>
          </div>
        ) : (
          <input
            type="number"
            value={xp}
            onChange={(e) => onXPChange(roleKey, Number.parseInt(e.target.value, 10) || 0)}
            className={`w-full bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 rounded px-2 py-1 font-mono font-bold ${role.color} focus:outline-none focus:ring-2 focus:ring-${role.color.split('-')[1]}-500 transition-all`}
            placeholder="Enter XP value"
            title="Enter exact XP value for this role"
          />
        )}
      </div>

      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rdo-gold to-rdo-rust transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
});
