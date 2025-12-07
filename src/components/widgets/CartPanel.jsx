import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useProfile } from '../../context';

export const CartPanel = () => {
    const { cart, remaining } = useProfile();
    return (
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ShoppingCart size={18} className="text-blue-400" /> Purchase Plan
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">{cart.length} items selected</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Remaining Budget</div>
                    <div className={`text-2xl font-mono font-bold ${remaining.cash < 0 ? 'text-red-500' : 'text-green-400'}`}>${remaining.cash.toFixed(2)}</div>
                    <div className={`text-sm font-mono font-bold ${remaining.gold < 0 ? 'text-red-500' : 'text-yellow-400'}`}>{remaining.gold.toFixed(2)} GB</div>
                </div>
            </div>
        </div>
    );
};
