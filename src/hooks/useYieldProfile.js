import { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';

export function useYieldProfile() {
    const { profile } = useProfile();

    // Example simple heuristic: if gold low => BOUNTY_GRIND, else TRADER_ACTIVE
    return useMemo(() => {
        if (!profile) return 'BASELINE';
        if (profile.gold < 6) return 'BOUNTY_GRIND';
        if (profile.cash > 500) return 'TRADER_ACTIVE';
        return 'BASELINE';
    }, [profile]);
}
