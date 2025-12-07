import React, { useMemo } from 'react';
import { useProfile } from '../../context';
import { Lock, ShoppingCart, Package } from 'lucide-react';

export const CatalogGrid = () => {
    const { CATALOG, cart, toggleCartItem, filter, UI_CONFIG, profile } = useProfile();
    const processedCatalog = useMemo(() => {
        return CATALOG.map(item => ({
            ...item,
            unlocked: profile.rank >= item.rank,
            affordable: (profile.cash >= item.price) && (profile.gold >= item.gold),
            inCart: cart.includes(item.id)
        })).filter(item => filter === 'all' || item.type === filter)
            .sort((a, b) => UI_CONFIG.priorities[a.priority].order - UI_CONFIG.priorities[b.priority].order);
    }, [CATALOG, cart, filter, UI_CONFIG, profile]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {processedCatalog.map(item => {
                const config = UI_CONFIG.priorities[item.priority];
                return (
                    <div key={item.id} data-testid={`catalog-item-${item.id}`} className={`p-4 rounded-xl border transition-all ${item.inCart ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#121212] border-white/5 hover:border-white/20'}`}>
                        <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>{config.label}</span>
                                            {!item.unlocked && <span className="text-xs text-red-500 flex items-center gap-1"><Lock size={10} /> Rank {item.rank}</span>}
                                        </div>
                                        <div className="font-bold text-white mt-1 truncate">{item.name}</div>
                                    </div>
                                    <button data-testid={`add-to-cart-${item.id}`} onClick={() => toggleCartItem(item.id)} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${item.inCart ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-gray-400 hover:text-white'}`}>
                                        {item.inCart ? <ShoppingCart size={18} /> : <Package size={18} />}
                                    </button>
                                </div>
                                <div className="flex gap-3 text-sm font-mono font-bold">
                                    {item.price > 0 && <span className={item.price > profile.cash ? 'text-red-500' : 'text-green-400'}>${item.price}</span>}
                                    {item.gold > 0 && <span className={item.gold > profile.gold ? 'text-red-500' : 'text-yellow-400'}>{item.gold} GB</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
