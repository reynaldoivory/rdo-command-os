import { useState } from 'react';
import { useProfile } from '../../context';
import { getXPFromLevel } from '../../utils/rdo-logic';
import { User, DollarSign, Coins, Star, Edit2, Check, X, Award } from 'lucide-react';

const InputRow = ({ icon, label, value, onChange, type, disabled }) => (
    <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-rdo-tan">{icon} {label}</div>
        <input
            type={type} 
            value={value} 
            onChange={onChange}
            disabled={disabled}
            className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded px-2 text-rdo-paper ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
    </div>
);

export const WalletWidget = () => {
    const { profile, setProfile, level } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        rank: level,
        tokens: profile.tokens ?? 0,
        gold: profile.gold,
        cash: profile.cash
    });

    const handleEdit = () => {
        setEditValues({
            rank: level,
            tokens: profile.tokens ?? 0,
            gold: profile.gold,
            cash: profile.cash
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        const newLevel = Math.max(1, Math.min(1000, Number.parseInt(editValues.rank, 10) || 1));
        setProfile({
            ...profile,
            rank: newLevel,
            xp: getXPFromLevel(newLevel),
            tokens: Number.parseInt(editValues.tokens, 10) || 0,
            gold: Number.parseFloat(editValues.gold) || 0,
            cash: Number.parseFloat(editValues.cash) || 0
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="bg-[#121212] border-2 border-rdo-gold shadow-rdo-gold rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-western text-rdo-gold flex items-center gap-2">
                    <User size={18} className="text-rdo-gold" /> Wallet State
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
                <InputRow
                    icon={<Star size={16} />} 
                    label="Rank" 
                    value={isEditing ? editValues.rank : level} 
                    type="number"
                    disabled={!isEditing}
                    onChange={e => setEditValues({ ...editValues, rank: e.target.value })}
                />
                <InputRow
                    icon={<Award size={16} />} 
                    label="Tokens" 
                    value={isEditing ? editValues.tokens : (profile.tokens ?? 0)} 
                    type="number"
                    disabled={!isEditing}
                    onChange={e => setEditValues({ ...editValues, tokens: e.target.value })}
                />
                <InputRow
                    icon={<Coins size={16} />} 
                    label="Gold" 
                    value={isEditing ? editValues.gold : profile.gold} 
                    type="number"
                    disabled={!isEditing}
                    onChange={e => setEditValues({ ...editValues, gold: e.target.value })}
                />
                <InputRow
                    icon={<DollarSign size={16} />} 
                    label="Cash" 
                    value={isEditing ? editValues.cash : profile.cash} 
                    type="number"
                    disabled={!isEditing}
                    onChange={e => setEditValues({ ...editValues, cash: e.target.value })}
                />
            </div>
            {isEditing && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Enter your in-game values to sync your profile
                </p>
            )}
        </div>
    );
};
