// FILE: src/components/FastTravelCalc.jsx
// Fast travel cost calculator between RDO locations
import React, { useState } from 'react';
import { Train } from 'lucide-react';
import { FAST_TRAVEL_LOCATIONS } from '../../data/rdo-data';
import { calcFastTravelCost } from '../../utils/rdo-logic';

export const FastTravelCalc = () => {
  const [from, setFrom] = useState('valentine');
  const [to, setTo] = useState('saintdenis');
  
  const cost = calcFastTravelCost(
    FAST_TRAVEL_LOCATIONS[from], 
    FAST_TRAVEL_LOCATIONS[to]
  );

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-western text-lg flex items-center gap-2 mb-4">
        <Train className="text-teal-400" size={18}/> Fast Travel Calc
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <select 
          value={from} 
          onChange={(e) => setFrom(e.target.value)} 
          className="bg-[#1a1a1a] border border-white/10 rounded p-2 text-sm text-gray-300 outline-none"
        >
          {Object.entries(FAST_TRAVEL_LOCATIONS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
        <select 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
          className="bg-[#1a1a1a] border border-white/10 rounded p-2 text-sm text-gray-300 outline-none"
        >
          {Object.entries(FAST_TRAVEL_LOCATIONS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <span className="text-gray-400 text-sm">Estimated Cost</span>
        <span className="text-xl font-mono font-bold text-white">${cost}</span>
      </div>
    </div>
  );
};
