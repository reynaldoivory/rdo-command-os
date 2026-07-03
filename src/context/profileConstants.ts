// FILE: src/context/profileConstants.ts
// Profile-related constants and default values

import type { RDOProfile } from "../types/rdo.types";

// Fresh Spawn Default State
export const DEFAULT_PROFILE: RDOProfile = {
    rank: 1,
    xp: 0,
    cash: 0,
    gold: 0,
    tokens: 0,
    location: "valentine",
    roles: {
        bountyHunter: 0,
        trader: 0,
        collector: 0,
        moonshiner: 0,
        naturalist: 0,
    },
};
