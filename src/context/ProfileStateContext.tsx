// FILE: src/context/ProfileStateContext.tsx
// Profile State Context - Core profile data and mutations

import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { RDOProfile } from "../types/rdo.types";
import { usePersistentState } from "../hooks/usePersistentState";
import { migrateProfile } from "../utils/migrations";
import { getLevelFromXP } from "../utils/rdo-logic";
import { DEFAULT_PROFILE } from "./profileConstants";

export interface ProfileStateContextValue {
    profile: RDOProfile;
    profileId: string;
    level: number;
    setProfile: React.Dispatch<React.SetStateAction<RDOProfile>>;
    updateProfile: (updates: Partial<RDOProfile>) => void;
    updateRole: (roleKey: string, xp: number) => void;
    travel: (destinationKey: string, cost: number) => void;
}

const ProfileStateCtx = createContext<ProfileStateContextValue | undefined>(undefined);

export function ProfileStateProvider({
    profileId,
    children,
}: {
    profileId: string;
    children: React.ReactNode;
}) {
    const [profile, setProfile] = usePersistentState(
        `profile_${profileId}`,
        DEFAULT_PROFILE,
        migrateProfile
    );

    const level = getLevelFromXP(profile.xp);

    const updateProfile = useCallback(
        (updates: Partial<RDOProfile>) => {
            setProfile((prev: RDOProfile) => ({ ...prev, ...updates }));
        },
        [setProfile]
    );

    const updateRole = useCallback(
        (roleKey: string, xp: number) => {
            setProfile((prev: RDOProfile) => ({
                ...prev,
                roles: { ...prev.roles, [roleKey]: xp },
            }));
        },
        [setProfile]
    );

    const travel = useCallback(
        (destinationKey: string, cost: number) => {
            setProfile((prev: RDOProfile) => ({
                ...prev,
                location: destinationKey,
                cash: prev.cash - cost,
            }));
        },
        [setProfile]
    );

    const value = useMemo<ProfileStateContextValue>(
        () => ({
            profile,
            profileId,
            level,
            setProfile,
            updateProfile,
            updateRole,
            travel,
        }),
        [profile, profileId, level, setProfile, updateProfile, updateRole, travel]
    );

    return (
        <ProfileStateCtx.Provider value={value}>
            {children}
        </ProfileStateCtx.Provider>
    );
}

export function useProfileState(): ProfileStateContextValue {
    const ctx = useContext(ProfileStateCtx);
    if (ctx === undefined) {
        throw new Error("useProfileState must be used within a ProfileStateProvider");
    }
    return ctx;
}
