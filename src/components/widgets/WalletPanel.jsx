import { useState } from 'react';
import { User, Star, Zap, DollarSign, Coins, Award, Edit2, Check, X } from 'lucide-react';
import { useProfile } from '../../context';

export const WalletPanel = () => {
    const { profile, setProfile, level } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        rank: level,
        xp: profile.xp,
        cash: profile.cash,
        gold: profile.gold,
        tokens: profile.tokens ?? 0
    });

    const handleEdit = () => {
        setEditValues({
            rank: level,
            xp: profile.xp,
            cash: profile.cash,
            gold: profile.gold,
            tokens: profile.tokens ?? 0
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        const newLevel = Math.max(1, Math.min(100, Number.parseInt(editValues.rank, 10) || 1));
        setProfile({
            ...profile,
            rank: newLevel,
            xp: Number.parseInt(editValues.xp, 10) || 0,
            cash: Number.parseFloat(editValues.cash) || 0,
            gold: Number.parseFloat(editValues.gold) || 0,
            tokens: Number.parseInt(editValues.tokens, 10) || 0
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                    <User size={18} className="text-[#D4AF37]" /> Wallet State
                </h2>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg text-sm font-bold transition-colors"
                        title="Edit wallet values"
                    >
                        <Edit2 size={14} /> Edit
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm font-bold transition-colors"
                            title="Save changes"
                        >
                            <Check size={14} /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-bold transition-colors"
                            title="Cancel editing"
                        >
                            <X size={14} /> Cancel
                        </button>
                    </div>
                )}
            </div>
            <div className="space-y-4">
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[#D4AF37]"><Star size={16} /> Rank</div>
                    <input 
                        data-testid="wallet-rank-input" 
                        type="number" 
                        min={1} 
                        max={100} 
                        value={isEditing ? editValues.rank : level}
                        disabled={!isEditing}
                        onChange={e => setEditValues({ ...editValues, rank: e.target.value })}
                        className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded px-2 text-[#D4AF37] ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-purple-400"><Zap size={16} /> XP</div>
                    <input 
                        data-testid="wallet-xp-input" 
                        type="number" 
                        min={0} 
                        value={isEditing ? editValues.xp : profile.xp}
                        disabled={!isEditing}
                        onChange={e => setEditValues({ ...editValues, xp: e.target.value })}
                        className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded px-2 text-purple-400 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-blue-400"><Award size={16} /> Tokens</div>
                    <input 
                        data-testid="wallet-tokens-input" 
                        type="number" 
                        min={0} 
                        value={isEditing ? editValues.tokens : (profile.tokens ?? 0)}
                        disabled={!isEditing}
                        onChange={e => setEditValues({ ...editValues, tokens: e.target.value })}
                        className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 text-blue-400 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-yellow-400"><Coins size={16} /> Gold</div>
                    <input 
                        data-testid="wallet-gold-input" 
                        type="number" 
                        value={isEditing ? editValues.gold : profile.gold}
                        disabled={!isEditing}
                        onChange={e => setEditValues({ ...editValues, gold: e.target.value })}
                        className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 rounded px-2 text-yellow-400 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    />
                </div>
                <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white"><DollarSign size={16} /> Cash</div>
                    <input 
                        data-testid="wallet-cash-input" 
                        type="number" 
                        value={isEditing ? editValues.cash : profile.cash}
                        disabled={!isEditing}
                        onChange={e => setEditValues({ ...editValues, cash: e.target.value })}
                        className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-white/50 rounded px-2 text-white ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    />
                </div>
            </div>
            {isEditing && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Enter your in-game values to sync your profile
                </p>
            )}
        </div>
    );
};
