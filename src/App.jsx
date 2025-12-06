// FILE: src/App.jsx
// RDO COMMAND OS.25 - The Infinite Horizon
import React, { useState, useMemo } from 'react';
import { 
  User, DollarSign, Coins, Star, Lock, Unlock, ShoppingCart, TrendingUp, 
  Search, ChevronDown, Target, Award, Package, Sparkles, Zap, Train 
} from 'lucide-react';
import './index.css';

import { 
  CATALOG, RANK_XP_TABLE, ROLE_XP_TABLE, ROLES, 
  FAST_TRAVEL_LOCATIONS, UI_CONFIG 
} from './data/rdo-data';

import { usePersistentState } from './hooks/usePersistentState';
import { migrateProfile } from './utils/migrations';
import { MissionTimer } from './components/MissionTimer';
import { OutlawAlmanac } from './components/OutlawAlmanac';
import { EfficiencyEngine } from './components/EfficiencyEngine';

// --- LOGIC HELPERS ---
const getLevelFromXP = (xp, isRole = false, maxLevel = 100) => {
  const table = isRole ? ROLE_XP_TABLE : RANK_XP_TABLE;
  let level = 1;
  for (let i = 1; i < Math.min(table.length, maxLevel + 1); i++) {
    if (xp >= table[i]) level = i; else break;
  }
  return Math.min(level, maxLevel);
};

const getXPProgress = (xp, isRole = false, maxLevel = 100) => {
  const table = isRole ? ROLE_XP_TABLE : RANK_XP_TABLE;
  const level = getLevelFromXP(xp, isRole, maxLevel);
  if (level >= maxLevel || level >= table.length - 1) return { current: 0, needed: 0, percent: 100 };
  
  const currentLevelXP = table[level];
  const nextLevelXP = table[level + 1];
  const xpIntoLevel = xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  
  return {
    current: xpIntoLevel,
    needed: xpNeeded,
    percent: Math.min(100, (xpIntoLevel / xpNeeded) * 100)
  };
};

const calcDistance = (locA, locB) => Math.sqrt(Math.pow(locB.x - locA.x, 2) + Math.pow(locB.y - locA.y, 2));

// --- SUB-COMPONENTS ---

const RoleCard = React.memo(({ roleKey, role, xp, onXPChange }) => {
  const Icon = role.icon;
  const level = getLevelFromXP(xp, true, role.maxLevel);
  const progress = getXPProgress(xp, true, role.maxLevel);
  const isMaxed = level >= role.maxLevel;

  return (
    <div className={`relative bg-gradient-to-br from-[#0a0a0a] to-[#111] rounded-xl p-4 border ${isMaxed ? 'border-' + role.color.split('-')[1] + '-500/50' : 'border-white/10'} hover:border-white/30 transition-all group`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${role.bg} shadow-lg shadow-black/50`}>
            <Icon className="text-white" size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-200">{role.name}</div>
            <div className="text-[10px] text-gray-500 uppercase">{role.desc}</div>
          </div>
        </div>
        <div className={`text-2xl font-black font-mono ${role.color}`}>{level}</div>
      </div>
      
      <div className="bg-black/40 rounded p-2 border border-white/5 mb-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>XP INPUT</span>
            <span>NEXT: {progress.needed.toLocaleString()}</span>
        </div>
        <input 
          type="number" value={xp} onChange={(e) => onXPChange(roleKey, parseInt(e.target.value) || 0)}
          className={`w-full bg-transparent font-mono font-bold ${role.color} focus:outline-none`}
        />
      </div>

      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div className={`h-full ${role.bg} transition-all duration-500`} style={{ width: `${progress.percent}%` }} />
      </div>
    </div>
  );
});

const FastTravelCalc = () => {
  const [from, setFrom] = useState('valentine');
  const [to, setTo] = useState('saintdenis');
  const cost = Math.ceil(calcDistance(FAST_TRAVEL_LOCATIONS[from], FAST_TRAVEL_LOCATIONS[to]) / 10);

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
      <h3 className="text-white font-western text-lg flex items-center gap-2 mb-4"><Train className="text-teal-400" size={18}/> Fast Travel Calc</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded p-2 text-sm text-gray-300 outline-none">
            {Object.entries(FAST_TRAVEL_LOCATIONS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="bg-[#1a1a1a] border border-white/10 rounded p-2 text-sm text-gray-300 outline-none">
            {Object.entries(FAST_TRAVEL_LOCATIONS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </div>
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <span className="text-gray-400 text-sm">Estimated Cost</span>
        <span className="text-xl font-mono font-bold text-white">${cost}</span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function App() {
  // Default profile schema - source of truth for all fields
  const DEFAULT_PROFILE = {
    rank: 47, xp: 136800, cash: 1444, gold: 9.5,
    roles: { bountyHunter: 0, trader: 0, collector: 0, moonshiner: 0, naturalist: 0 }
  };

  // PERSISTENT STATE - Survives page refresh!
  // Uses deep merge migration to safely add new fields in future versions
  const [profile, setProfile] = usePersistentState('profile', DEFAULT_PROFILE, migrateProfile);
  const [cart, setCart] = usePersistentState('cart', []);
  
  // UI state (doesn't need persistence)
  const [filter, setFilter] = useState('all');

  // Stats Logic
  const level = getLevelFromXP(profile.xp);
  const cartTotals = useMemo(() => cart.reduce((acc, id) => {
    const item = CATALOG.find(i => i.id === id);
    return item ? { cash: acc.cash + item.price, gold: acc.gold + item.gold } : acc;
  }, { cash: 0, gold: 0 }), [cart]);
  
  const remaining = { cash: profile.cash - cartTotals.cash, gold: profile.gold - cartTotals.gold };

  // Catalog Processing (God Tier Memoization)
  const processedCatalog = useMemo(() => {
    return CATALOG.map(item => ({
      ...item,
      unlocked: profile.rank >= item.rank,
      affordable: (profile.cash >= item.price) && (profile.gold >= item.gold),
      inCart: cart.includes(item.id)
    })).filter(item => filter === 'all' || item.type === filter)
      .sort((a,b) => UI_CONFIG.priorities[a.priority].order - UI_CONFIG.priorities[b.priority].order);
  }, [profile.rank, profile.cash, profile.gold, cart, filter]);

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans p-4 lg:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-[#D4AF37]/20 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-600 tracking-tighter">
            RDO COMMAND <span className="text-gray-600 font-light text-xl">OS.25</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Workflow Optimization & Economy Simulator</p>
        </div>
        <div className="text-right">
           <div className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">Rank {level}</div>
           <div className="text-2xl font-mono text-[#D4AF37] font-bold">{profile.xp.toLocaleString()} XP</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile & Stats (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Resources Input */}
          <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2"><User size={18} className="text-[#D4AF37]"/> Wallet State</h2>
            <div className="space-y-4">
               <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-400"><DollarSign size={16}/> Cash</div>
                  <input type="number" value={profile.cash} onChange={e => setProfile({...profile, cash: parseFloat(e.target.value)||0})} className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none"/>
               </div>
               <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-yellow-400"><Coins size={16}/> Gold</div>
                  <input type="number" value={profile.gold} onChange={e => setProfile({...profile, gold: parseFloat(e.target.value)||0})} className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none"/>
               </div>
            </div>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-1 gap-3">
             {Object.entries(ROLES).map(([k,v]) => (
                <RoleCard key={k} roleKey={k} role={v} xp={profile.roles[k]} onXPChange={(k, val) => setProfile(p => ({...p, roles: {...p.roles, [k]: val}}))} />
             ))}
          </div>

          <FastTravelCalc />

          {/* Mission Timer - Gold Optimization Tool */}
          <MissionTimer />

          {/* Strategy Guide - Meta Strats */}
          <OutlawAlmanac />
        </div>

        {/* RIGHT COLUMN: Shop & Plan (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* Efficiency Analysis Engine */}
           <EfficiencyEngine profile={profile} catalog={CATALOG} cart={cart} />

           {/* Cart Summary */}
           <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                 <div>
                    <h3 className="text-white font-bold flex items-center gap-2"><ShoppingCart size={18} className="text-blue-400"/> Purchase Plan</h3>
                    <div className="text-xs text-gray-500 mt-1">{cart.length} items selected</div>
                 </div>
                 <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Remaining Budget</div>
                    <div className={`text-2xl font-mono font-bold ${remaining.cash < 0 ? 'text-red-500' : 'text-green-400'}`}>${remaining.cash.toFixed(2)}</div>
                    <div className={`text-sm font-mono font-bold ${remaining.gold < 0 ? 'text-red-500' : 'text-yellow-400'}`}>{remaining.gold.toFixed(2)} GB</div>
                 </div>
              </div>
           </div>

           {/* Catalog Filter */}
           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>ALL ITEMS</button>
              {Object.entries(UI_CONFIG.types).map(([k,v]) => (
                 <button key={k} onClick={() => setFilter(k)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === k ? 'bg-[#D4AF37] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>{v.label}</button>
              ))}
           </div>

           {/* Catalog Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {processedCatalog.map(item => {
                 const config = UI_CONFIG.priorities[item.priority];
                 return (
                    <div key={item.id} className={`p-4 rounded-xl border transition-all ${item.inCart ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#121212] border-white/5 hover:border-white/20'}`}>
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>{config.label}</span>
                                {!item.unlocked && <span className="text-xs text-red-500 flex items-center gap-1"><Lock size={10}/> Rank {item.rank}</span>}
                             </div>
                             <div className="font-bold text-white mt-1">{item.name}</div>
                          </div>
                          <button onClick={() => setCart(p => p.includes(item.id) ? p.filter(x => x !== item.id) : [...p, item.id])} className={`p-2 rounded-lg transition-colors ${item.inCart ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                             {item.inCart ? <ShoppingCart size={18}/> : <Package size={18}/>}
                          </button>
                       </div>
                       <p className="text-xs text-gray-500 mb-3 h-8 line-clamp-2">{item.desc}</p>
                       <div className="flex gap-3 text-sm font-mono font-bold pt-3 border-t border-white/5">
                          {item.price > 0 && <span className={item.price > profile.cash ? 'text-red-500' : 'text-green-400'}>${item.price}</span>}
                          {item.gold > 0 && <span className={item.gold > profile.gold ? 'text-red-500' : 'text-yellow-400'}>{item.gold} GB</span>}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </main>
    </div>
  );
}
