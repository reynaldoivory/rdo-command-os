/**
 * ═══════════════════════════════════════════════════════════════════════════
 * WardrobeTracker - Completionist Fashion Ledger
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Implements the "Volume, not Specifics" pattern for cosmetic item tracking.
 * Uses the Unified Data Contract (src/data/schemas.js) for data validation.
 * 
 * ARCHITECTURE:
 * - Self-contained: Uses useWardrobe hook internally
 * - Profile-scoped: Accepts profileId prop for per-profile persistence
 * - Schema-compliant: Uses camelCase field names from contract
 */

import React, { useState, useMemo } from 'react';
import { Shirt, Plus, Minus, Check, ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react';
import { useWardrobe } from '../../hooks/useWardrobe';
import { SUBCATEGORY } from '../../data/schemas';

// ═══════════════════════════════════════════════════════════════════════════
// SUBCATEGORY FILTER OPTIONS (Derived from Schema)
// ═══════════════════════════════════════════════════════════════════════════

const FILTER_OPTIONS = [
    { id: 'all', label: 'All Items' },
    { id: SUBCATEGORY.HAT, label: 'Hats' },
    { id: SUBCATEGORY.COAT, label: 'Coats' },
    { id: SUBCATEGORY.VEST, label: 'Vests' },
    { id: SUBCATEGORY.SHIRT, label: 'Shirts' },
    { id: SUBCATEGORY.PANTS, label: 'Pants' },
    { id: SUBCATEGORY.BOOTS, label: 'Boots' },
    { id: SUBCATEGORY.GLOVES, label: 'Gloves' },
    { id: SUBCATEGORY.BANDANA, label: 'Bandanas' },
    { id: SUBCATEGORY.BELT, label: 'Belts' },
    { id: SUBCATEGORY.MISC, label: 'Misc' },
];

// ═══════════════════════════════════════════════════════════════════════════
// WARDROBE ITEM CARD
// ═══════════════════════════════════════════════════════════════════════════

const WardrobeItem = React.memo(({ item, onUpdate }) => {
    // Schema-compliant field access (camelCase)
    const { variantsOwned, variantsTotal, unitCost } = item;
    const remaining = variantsTotal - variantsOwned;
    const isComplete = remaining === 0;
    const progress = variantsTotal > 0 ? (variantsOwned / variantsTotal) * 100 : 0;

    // Calculate cost to finish using unitCost object
    const cashCost = (unitCost?.cash || 0) * remaining;
    const goldCost = (unitCost?.gold || 0) * remaining;
    const hasGoldCost = goldCost > 0;

    return (
        <div
            className={`p-3 rounded-lg border transition-all duration-200 ${isComplete
                    ? 'bg-green-900/20 border-green-500/40'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
        >
            {/* Header: Name + Price */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 min-w-0">
                    {isComplete && <Check size={12} className="text-green-400 flex-shrink-0" />}
                    <span className={`font-bold text-sm truncate ${isComplete ? 'text-green-300' : 'text-gray-200'}`}>
                        {item.name}
                    </span>
                </div>
                <div className="text-xs font-mono flex-shrink-0 ml-2">
                    {hasGoldCost
                        ? <span className="text-[#D4AF37]">{unitCost.gold} G</span>
                        : <span className="text-[#85BB65]">${unitCost?.cash || 0}</span>
                    }
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-black/50 rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-[#D4AF37]'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Counter Controls */}
            <div className="flex items-center justify-between bg-black/50 rounded px-2 py-1.5">
                <button
                    onClick={() => onUpdate(item.id, -1)}
                    className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={variantsOwned <= 0}
                    aria-label="Decrease count"
                >
                    <Minus size={14} />
                </button>

                <span className={`text-sm font-mono font-bold ${isComplete ? 'text-green-400' : 'text-white'}`}>
                    {variantsOwned} / {variantsTotal}
                </span>

                <button
                    onClick={() => onUpdate(item.id, 1)}
                    className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={isComplete}
                    aria-label="Increase count"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Remaining Cost */}
            {!isComplete && (
                <div className="mt-2 text-[10px] text-gray-500 text-right uppercase tracking-wider">
                    To finish:
                    <span className={hasGoldCost ? 'text-[#D4AF37] ml-1' : 'text-[#85BB65] ml-1'}>
                        {hasGoldCost ? `${goldCost} G` : `$${cashCost.toFixed(0)}`}
                    </span>
                </div>
            )}
        </div>
    );
});

WardrobeItem.displayName = 'WardrobeItem';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const WardrobeTracker = ({ profileId = 'Main' }) => {
    // Use the wardrobe hook for data management
    const { items, status, updateCount, completionCost, stats } = useWardrobe(profileId);

    // Local UI state
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [subCategoryFilter, setSubCategoryFilter] = useState('all');

    // Filter items by search and subcategory
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = subCategoryFilter === 'all' || item.subCategory === subCategoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchQuery, subCategoryFilter]);

    // Loading state
    if (status === 'loading') {
        return (
            <div className="card-rdo p-4 rounded-xl">
                <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 size={24} className="animate-spin mr-2" />
                    <span>Loading wardrobe...</span>
                </div>
            </div>
        );
    }

    // Empty state
    if (status === 'ready' && items.length === 0) {
        return (
            <div className="card-rdo p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#D4AF37] font-western text-xl flex items-center gap-2">
                        <Shirt size={20} /> Fashion Ledger
                    </h3>
                </div>
                <div className="text-center py-8 text-gray-500">
                    <Shirt size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No wardrobe data loaded.</p>
                    <p className="text-xs mt-1 text-gray-600">
                        Run <code className="text-[#D4AF37]">node scripts/ingest-catalog.js</code> to import items.
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (status === 'error') {
        return (
            <div className="card-rdo p-4 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#D4AF37] font-western text-xl flex items-center gap-2">
                        <Shirt size={20} /> Fashion Ledger
                    </h3>
                </div>
                <div className="text-center py-8 text-red-400">
                    <p className="text-sm">Failed to load wardrobe catalog.</p>
                    <p className="text-xs mt-1 text-gray-600">
                        Check that <code className="text-[#D4AF37]">public/data/wardrobe.json</code> exists.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-rdo p-4 rounded-xl">
            {/* Header */}
            <div
                className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-[#D4AF37] font-western text-xl flex items-center gap-2">
                    <Shirt size={20} /> Fashion Ledger
                </h3>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                        {stats.completed}/{stats.total} Complete
                    </span>
                    {isExpanded
                        ? <ChevronUp size={16} className="text-gray-500" />
                        : <ChevronDown size={16} className="text-gray-500" />
                    }
                </div>
            </div>

            {isExpanded && (
                <>
                    {/* Completion Cost Summary */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Cash to Complete</div>
                            <div className="text-xl font-mono text-[#85BB65]">
                                ${completionCost.cash.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Gold to Complete</div>
                            <div className="text-xl font-mono text-[#D4AF37]">
                                {completionCost.gold.toFixed(1)} G
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>COLLECTION PROGRESS</span>
                            <span className="font-mono">
                                {stats.ownedVariants}/{stats.totalVariants} variants ({stats.progressPercent}%)
                            </span>
                        </div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-500"
                                style={{ width: `${stats.progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#D4AF37]/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <select
                            value={subCategoryFilter}
                            onChange={e => setSubCategoryFilter(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#D4AF37]/50 focus:outline-none transition-colors cursor-pointer"
                        >
                            {FILTER_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                        {filteredItems.map(item => (
                            <WardrobeItem
                                key={item.id}
                                item={item}
                                onUpdate={updateCount}
                            />
                        ))}
                    </div>

                    {filteredItems.length === 0 && items.length > 0 && (
                        <div className="text-center py-6 text-gray-500 text-sm">
                            No items match your search.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WardrobeTracker;
