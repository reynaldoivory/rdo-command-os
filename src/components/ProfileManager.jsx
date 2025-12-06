// FILE: src/components/ProfileManager.jsx
// Multi-Tenancy Profile System - Switch between character saves
import React, { useState } from 'react';
import { Users, Plus, RotateCcw, Copy } from 'lucide-react';

export const ProfileManager = ({ currentProfileId, setProfileId, onReset, onClone }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  
  // Get list of profiles from localStorage
  const getSavedProfiles = () => {
    const profiles = Object.keys(localStorage)
      .filter(k => k.startsWith('rdo_os_profile_'))
      .map(k => k.replace('rdo_os_profile_', ''));
    return profiles.length > 0 ? profiles : ['Main'];
  };

  const profiles = getSavedProfiles();

  const handleCreate = (clone = false) => {
    const name = newProfileName.trim();
    if (name && !profiles.includes(name)) {
      if (clone && onClone) {
        onClone(name);
      } else {
        setProfileId(name);
      }
      setNewProfileName('');
      setIsExpanded(false);
    }
  };

  const handleDelete = (id) => {
    if (id === currentProfileId) return; // Can't delete active profile
    if (window.confirm(`Delete profile "${id}"? This cannot be undone.`)) {
      localStorage.removeItem(`rdo_os_profile_${id}`);
      localStorage.removeItem(`rdo_os_cart_${id}`);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-3 py-1.5 rounded-lg hover:border-[#D4AF37] transition-all"
      >
        <Users size={14} className="text-[#D4AF37]" />
        <span className="text-xs font-bold font-mono uppercase text-gray-300">
          PROFILE: <span className="text-white">{currentProfileId}</span>
        </span>
      </button>

      {/* Dropdown Menu */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsExpanded(false)}
          />
          
          <div className="absolute top-full left-0 mt-2 w-72 bg-[#0a0a0a] border border-white/20 rounded-xl shadow-2xl p-4 z-50 animate-fade-in-up">
            <h4 className="text-[#D4AF37] font-western text-sm mb-3 flex items-center gap-2">
              <Users size={14} /> SELECT IDENTITY
            </h4>
            
            {/* List Existing Profiles */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {profiles.map(id => (
                <div
                  key={id}
                  className={`w-full text-left text-xs font-mono py-2 px-3 rounded flex justify-between items-center cursor-pointer ${
                    currentProfileId === id 
                      ? 'bg-[#D4AF37] text-black font-bold' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => { 
                    if (currentProfileId !== id) {
                      setProfileId(id); 
                      setIsExpanded(false); 
                    }
                  }}
                >
                  <span>{id}</span>
                  <div className="flex items-center gap-2">
                    {currentProfileId === id && (
                      <span className="text-[8px] bg-black/20 px-1.5 py-0.5 rounded">ACTIVE</span>
                    )}
                    {currentProfileId !== id && profiles.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(id); }}
                        className="text-red-400 hover:text-red-300 p-0.5"
                        title="Delete profile"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Create New */}
            <div className="border-t border-white/10 pt-3 mb-3">
              <label className="text-[10px] text-gray-500 uppercase mb-1 block">Create New Profile</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Profile name..." 
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate(false)}
                  className="bg-black/50 border border-white/10 rounded px-2 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-[#D4AF37]"
                  maxLength={20}
                />
                <button 
                  onClick={() => handleCreate(false)} 
                  className="bg-green-600/20 text-green-400 p-1.5 rounded hover:bg-green-600/40 transition-colors"
                  title="Create blank profile"
                >
                  <Plus size={14}/>
                </button>
                <button 
                  onClick={() => handleCreate(true)} 
                  className="bg-blue-600/20 text-blue-400 p-1.5 rounded hover:bg-blue-600/40 transition-colors"
                  title="Clone current profile"
                >
                  <Copy size={14}/>
                </button>
              </div>
              <p className="text-[9px] text-gray-600 mt-1">
                <Plus size={9} className="inline"/> = Fresh Spawn | <Copy size={9} className="inline"/> = Clone Current
              </p>
            </div>

            {/* Danger Zone: Reset */}
            <button 
              onClick={() => {
                if (window.confirm(`WARNING: This will wipe "${currentProfileId}" to ZERO.\n\nRank 1, $0 Cash, 0 Gold, No Roles.\n\nAre you sure?`)) {
                  onReset();
                  setIsExpanded(false);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-bold py-2 rounded hover:bg-red-900/40 transition-colors"
            >
              <RotateCcw size={12} /> FACTORY RESET "{currentProfileId}"
            </button>
          </div>
        </>
      )}
    </div>
  );
};
