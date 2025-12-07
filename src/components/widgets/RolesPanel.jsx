import React from 'react';
import { RoleCard } from './RoleCard';
import { useProfile } from '../../context';
import { ROLES } from '../../data/rdo-data';

export const RolesPanel = () => {
    const { profile, updateRole } = useProfile();
    return (
        <div className="grid grid-cols-1 gap-3">
            {Object.entries(ROLES).map(([k, v]) => (
                <RoleCard key={k} roleKey={k} role={v} xp={profile.roles[k]} onXPChange={updateRole} />
            ))}
        </div>
    );
};
