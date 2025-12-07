import React from 'react';
import { useProfile } from '../../context/ProfileContext';
import { getXPFromLevel } from '../../utils/rdo-logic';
import { User, DollarSign, Coins, Star } from 'lucide-react';

const InputRow = ({ icon, label, color, value, onChange, type }) => (
    <div className="bg-black/30 p-3 rounded-lg border border-white/5 flex justify-between items-center">
        <div className={`flex items-center gap-2 ${color}`}>{icon} {label}</div>
        <input
            type={type} value={value} onChange={onChange}
            className={`bg-transparent text-right font-mono font-bold text-xl w-32 focus:outline-none ${color}`}
        />
    </div>
);

export const WalletWidget = () => {
    const { profile, setProfile, level } = useProfile();

    return (
        <div className="bg-[#121212] border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                <User size={18} className="text-[#D4AF37]" /> Wallet State
            </h2>
            <div className="space-y-4">
                <InputRow
                    icon={<Star size={16} />} label="Rank" color="text-[#D4AF37]"
                    value={level} type="number"
                    onChange={e => {
                        const newLevel = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1));
                        setProfile({ ...profile, rank: newLevel, xp: getXPFromLevel(newLevel) });
                    }}
                />
                <InputRow
                    icon={<DollarSign size={16} />} label="Cash" color="text-green-400"
                    value={profile.cash} type="number"
                    onChange={e => setProfile({ ...profile, cash: parseFloat(e.target.value) || 0 })}
                />
                <InputRow
                    icon={<Coins size={16} />} label="Gold" color="text-yellow-400"
                    value={profile.gold} type="number"
                    onChange={e => setProfile({ ...profile, gold: parseFloat(e.target.value) || 0 })}
                />
            </div>
        </div>
    );
};
