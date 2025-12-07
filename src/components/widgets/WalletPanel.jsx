import React from 'react';
import { User, Star, Zap, DollarSign, Coins, Award } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { getXPFromLevel } from '../../utils/rdo-logic';

export const WalletPanel = () => {
    const { profile, setProfile, level } = useProfile();

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                <User size={18} className="text-[#D4AF37]" /> Wallet State
            </h2>
            <div className="space-y-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#D4AF37]"><Star size={16} /> Rank</div>
                    <input data-testid="wallet-rank-input" type="number" min={1} max={100} value={level}
                        onChange={e => { const newLevel = Math.max(1, Math.min(100, parseInt(e.target.value) || 1)); setProfile({ ...profile, xp: getXPFromLevel(newLevel) }); }}
                        className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none text-[#D4AF37]" />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-purple-400"><Zap size={16} /> XP</div>
                    <input data-testid="wallet-xp-input" type="number" min={0} value={profile.xp}
                        onChange={e => setProfile({ ...profile, xp: parseInt(e.target.value) || 0 })}
                        className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none text-purple-400" />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-green-400"><DollarSign size={16} /> Cash</div>
                    <input data-testid="wallet-cash-input" type="number" value={profile.cash}
                        onChange={e => setProfile({ ...profile, cash: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none text-green-400" />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-yellow-400"><Coins size={16} /> Gold</div>
                    <input data-testid="wallet-gold-input" type="number" value={profile.gold}
                        onChange={e => setProfile({ ...profile, gold: parseFloat(e.target.value) || 0 })}
                        className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none text-yellow-400" />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-cyan-400"><Award size={16} /> Tokens</div>
                    <input data-testid="wallet-tokens-input" type="number" min={0} value={profile.tokens ?? 0}
                        onChange={e => setProfile({ ...profile, tokens: parseInt(e.target.value) || 0 })}
                        className="bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none text-cyan-400" />
                </div>
            </div>
        </div>
    );
};
