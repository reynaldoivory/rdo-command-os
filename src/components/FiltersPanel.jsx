import React from 'react';
import { useProfile } from '../context/ProfileContext';

export const FiltersPanel = () => {
    const { UI_CONFIG, filter, setFilter } = useProfile();
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>ALL ITEMS</button>
            {Object.entries(UI_CONFIG.types).map(([k, v]) => (
                <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === k ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>{v.label}</button>
            ))}
        </div>
    );
};
