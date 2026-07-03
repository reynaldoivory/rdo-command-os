import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { useProfile } from '../../context';

export const CartPanel = () => {
    const { cart, remaining, cartTotals, checkoutCart } = useProfile();
    const [status, setStatus] = useState(null); // { type: 'success'|'error', message: string }

    const handleCheckout = () => {
        const result = checkoutCart();
        if (result.ok) {
            setStatus({ type: 'success', message: `Purchased ${cart.length} item(s)` });
        } else {
            const reason = result.reason === 'INSUFFICIENT_FUNDS'
                ? 'Not enough cash or gold to checkout.'
                : 'Unable to checkout.';
            setStatus({ type: 'error', message: reason });
        }
        // Clear transient status after a few seconds
        setTimeout(() => setStatus(null), 3000);
    };

    const canAfford = remaining.cash >= 0 && remaining.gold >= 0 && cart.length > 0;

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

            <div className="relative z-10 mt-4 grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div className="p-3 bg-black/20 rounded border border-white/5">
                    <div className="uppercase tracking-widest text-[10px] text-gray-500">Cart Total</div>
                    <div className="font-mono text-white">${cartTotals.cash.toFixed(2)} | {cartTotals.gold.toFixed(2)} GB</div>
                </div>
                <div className="p-3 bg-black/20 rounded border border-white/5">
                    <div className="uppercase tracking-widest text-[10px] text-gray-500">After Checkout</div>
                    <div className={`font-mono ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.max(remaining.cash, 0).toFixed(2)} | {Math.max(remaining.gold, 0).toFixed(2)} GB
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
                <button
                    onClick={handleCheckout}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition ${
                        canAfford
                            ? 'bg-[#D4AF37] text-black hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    <ShoppingCart size={16} />
                    Checkout
                </button>

                {status && (
                    <div className={`text-xs flex items-center gap-2 ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {status.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};
