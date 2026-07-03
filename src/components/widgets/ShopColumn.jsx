import React, { useMemo, useState } from 'react';
import { ItemImage } from '../common/ItemImage';
import { useProfile } from '../../context';
import { FiltersPanel } from '../FiltersPanel';
import { ShoppingCart, Package, Lock, Percent, AlertTriangle } from 'lucide-react';
import { useSpecials, getDiscountForItem, getTimeUntilExpiry } from '../../hooks/useSpecials';

export const ShopColumn = () => {
    const { profile, cart, toggleCartItem, CATALOG, UI_CONFIG, filter, setFilter } = useProfile();
    const { specials } = useSpecials();
    const [readyOnly, setReadyOnly] = useState(false);
    const expiringSoon = (() => {
        if (!specials?.meta?.validUntil) return { soon: false, remaining: null };
        const remaining = getTimeUntilExpiry(specials);
        if (!remaining || remaining === 'Expired') return { soon: false, remaining };
        const soon = remaining.includes('h') && !remaining.includes('d');
        return { soon, remaining };
    })();

    const processedCatalog = useMemo(() => {
        const priorityOrder = (p) => UI_CONFIG.priorities[p]?.order ?? 99;
        const scoreItem = (item, unlocked, affordable, discount) => {
            let score = 100 - priorityOrder(item.priority) * 10;
            if (unlocked) score += 15; else score -= 25;
            if (affordable) score += 20;
            if (discount) score += 25;
            if (item.gold > profile.gold) score -= 10;
            if (item.price > profile.cash) score -= 5;
            return score;
        };

        return CATALOG.map(item => {
            const unlocked = profile.rank >= item.rank;
            const affordable = (profile.cash >= item.price) && (profile.gold >= item.gold);
            const discount = getDiscountForItem(specials, item.id);
            const inCart = cart.includes(item.id);
            const shortCash = Math.max(0, item.price - profile.cash);
            const shortGold = Math.max(0, item.gold - profile.gold);

            return {
                ...item,
                unlocked,
                affordable,
                inCart,
                discount,
                shortCash,
                shortGold,
                score: scoreItem(item, unlocked, affordable, discount)
            };
        })
            .filter(item => (filter === 'all' || item.type === filter) && (!readyOnly || (item.unlocked && item.affordable)))
            .sort((a, b) => b.score - a.score || priorityOrder(a.priority) - priorityOrder(b.priority));
    }, [CATALOG, cart, filter, readyOnly, UI_CONFIG, profile.cash, profile.gold, profile.rank, specials]);

    return (
        <div>
            <div className="mb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <FiltersPanel filter={filter} setFilter={setFilter} />
                    {expiringSoon.soon && (
                        <span className="text-[10px] px-2 py-1 rounded bg-red-900/30 text-red-200 border border-red-500/40 uppercase tracking-wide">
                            Specials expiring soon{expiringSoon.remaining ? ` (${expiringSoon.remaining})` : ''}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={() => setFilter('collector')}
                        className="text-[10px] px-2 py-1 rounded border border-violet-400/50 text-violet-200 hover:bg-violet-900/30 transition"
                    >
                        Collector items
                    </button>
                    <label className="text-xs text-gray-400 flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="accent-[#D4AF37]"
                            checked={readyOnly}
                            onChange={(e) => setReadyOnly(e.target.checked)}
                        />
                        <span>Ready to buy (unlocked & affordable)</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {processedCatalog.map(item => {
                    const config = UI_CONFIG.priorities[item.priority];
                    return (
                        <div key={item.id} data-testid={`catalog-item-${item.id}`}
                            className={`p-4 rounded-xl border transition-all ${item.inCart ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#121212] border-white/5 hover:border-white/20'}`}>
                            <div className="flex gap-3">
                                <ItemImage src={item.image} alt={item.name} size={64} className="rounded-lg flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs px-2 py-0.5 rounded ${config.bg} ${config.color} border ${config.border}`}>{config.label}</span>
                                                {!item.unlocked && <span className="text-xs text-red-500 flex items-center gap-1"><Lock size={10} /> Rank {item.rank}</span>}
                                                {item.discount && (
                                                    <span className="text-[10px] text-amber-300 bg-amber-900/30 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Percent size={10} /> {item.discount.percentOff || 'Sale'}
                                                    </span>
                                                )}
                                                {item.shortCash > 0 || item.shortGold > 0 ? (
                                                    <span className="text-[10px] text-red-300 bg-red-900/30 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <AlertTriangle size={10} /> Need {item.shortCash > 0 ? `$${item.shortCash.toFixed(0)}` : ''} {item.shortGold > 0 ? `${item.shortGold.toFixed(1)} GB` : ''}
                                                        <span className="text-[10px] text-red-200/80">Earn via bounties/dailies</span>
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="font-bold text-white mt-1 truncate">{item.name}</div>
                                        </div>
                                        <button data-testid={`add-to-cart-${item.id}`} onClick={() => toggleCartItem(item.id)} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${item.inCart ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>
                                            {item.inCart ? <ShoppingCart size={18} /> : <Package size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.desc}</p>
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

            {/* CartPanel is a separate registered panel; do not render it here */}
        </div>
    );
};
