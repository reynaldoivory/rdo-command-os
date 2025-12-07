// FILE: src/components/OutlawAlmanac.jsx
import React, { useState } from 'react';
import { BookOpen, Coins, DollarSign, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { META_STRATS, STRAT_CATEGORIES } from '../../data/meta-strats';

/**
 * Outlaw's Almanac - Curated meta strategies panel
 * Displays community-verified farming methods and optimizations
 */
export const OutlawAlmanac = () => {
  const [activeTab, setActiveTab] = useState('GOLD_FARMING');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { key: 'GOLD_FARMING', icon: Coins, label: 'Gold' },
    { key: 'CASH_FARMING', icon: DollarSign, label: 'Cash' },
    { key: 'QUALITY_OF_LIFE', icon: Sparkles, label: 'QoL' },
  ];

  const currentCategory = STRAT_CATEGORIES[activeTab];
  const strategies = META_STRATS[activeTab] || [];

  return (
    <div className="bg-[#121212] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex justify-between items-center p-4 hover:bg-white/5 transition-colors"
      >
        <h3 className="text-white font-bold flex items-center gap-2">
          <BookOpen size={16} className="text-amber-400" />
          Outlaw's Almanac
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{strategies.length} strats</span>
          {isCollapsed ? <ChevronDown size={16} className="text-gray-500"/> : <ChevronUp size={16} className="text-gray-500"/>}
        </div>
      </button>

      {!isCollapsed && (
        <>
          {/* Category Tabs */}
          <div className="flex border-t border-b border-white/5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const catConfig = STRAT_CATEGORIES[tab.key];
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 px-2 text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    isActive 
                      ? `${catConfig.bg} ${catConfig.color} border-b-2 ${catConfig.border.replace('border-', 'border-b-')}`
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Strategy Cards */}
          <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {strategies.map(strat => (
              <div 
                key={strat.id} 
                className={`${currentCategory.bg} border ${currentCategory.border} rounded-lg p-3 hover:brightness-110 transition-all group`}
              >
                <div className={`font-bold ${currentCategory.color} text-sm mb-1 group-hover:underline`}>
                  {strat.title}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {strat.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[10px] ${currentCategory.bg} ${currentCategory.color} px-1.5 py-0.5 rounded border ${currentCategory.border} font-mono font-bold`}>
                    {strat.yield}
                  </span>
                  {strat.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 text-gray-500 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-white/5 text-[10px] text-gray-600 text-center">
            Source: Jean Ropke, r/RedDeadOnline, Community Discord
          </div>
        </>
      )}
    </div>
  );
};

export default OutlawAlmanac;
