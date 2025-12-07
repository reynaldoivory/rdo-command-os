// FILE: src/utils/schedule-logic.js
// ═══════════════════════════════════════════════════════════════════════════
// FREE ROAM EVENT SCHEDULE ALGORITHM
// The "Golden Rotation" - immutable mathematical cycle of RDO events
// Events occur every 45 minutes starting at 00:00 UTC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Master Event Rotation Array
 * Offsets are in UTC minutes from midnight (00:00 = 0, 00:45 = 45, etc.)
 * The cycle is ~12 hours (16 events × 45 min = 720 min = 12 hours)
 * 
 * Value tiers:
 * - god_tier: Drop everything and participate (Trade Route, Salvage, Condor Egg)
 * - high: Worth doing if nearby
 * - medium: Decent XP/rewards
 * - low: Skip unless bored or daily requires it
 */
const EVENT_ROTATION = [
    { offset: 0, name: 'Manhunt', type: 'bounty', value: 'medium' },
    { offset: 45, name: 'Salvage', type: 'collector', value: 'god_tier' }, // 1000XP + collectibles
    { offset: 90, name: 'Day of Reckoning', type: 'bounty', value: 'medium' },
    { offset: 135, name: 'Trade Route', type: 'trader', value: 'god_tier' }, // 18 free goods
    { offset: 180, name: 'Condor Egg', type: 'collector', value: 'god_tier' }, // $1000 egg
    { offset: 225, name: 'Protect Legendary', type: 'naturalist', value: 'high' },
    { offset: 270, name: 'Railroad Baron', type: 'pvp', value: 'low' }, // PvP chaos
    { offset: 315, name: 'Wild Animal Kills', type: 'challenge', value: 'low' },
    { offset: 360, name: 'Fishing Challenge', type: 'challenge', value: 'low' },
    { offset: 405, name: "Fool's Gold", type: 'pvp', value: 'medium' },
    { offset: 450, name: 'Master Archer', type: 'challenge', value: 'medium' },
    { offset: 495, name: 'Cold Dead Hands', type: 'pvp', value: 'low' },
    { offset: 540, name: 'Dispatch Rider', type: 'bounty', value: 'medium' },
    { offset: 585, name: 'Salvage', type: 'collector', value: 'god_tier' },
    { offset: 630, name: 'King of the Castle', type: 'pvp', value: 'low' },
    { offset: 675, name: 'Trade Route', type: 'trader', value: 'god_tier' },
];

// Event type metadata for UI styling
export const EVENT_TYPES = {
    bounty: { color: 'text-red-400', bg: 'bg-red-500/20', icon: 'Target' },
    collector: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: 'Search' },
    trader: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: 'Package' },
    naturalist: { color: 'text-green-400', bg: 'bg-green-500/20', icon: 'Leaf' },
    pvp: { color: 'text-purple-400', bg: 'bg-purple-500/20', icon: 'Swords' },
    challenge: { color: 'text-blue-400', bg: 'bg-blue-500/20', icon: 'Trophy' },
};

// Value tier styling
export const VALUE_TIERS = {
    god_tier: { label: 'GOD TIER', color: 'text-amber-500', glow: true, priority: 1 },
    high: { label: 'HIGH', color: 'text-green-400', glow: false, priority: 2 },
    medium: { label: 'MEDIUM', color: 'text-blue-400', glow: false, priority: 3 },
    low: { label: 'LOW', color: 'text-gray-500', glow: false, priority: 4 },
};

/**
 * Calculate the next Free Roam Event
 * @returns {Object} Event info with name, type, value, minsRemaining, timestamp
 */
export function getNextEvent() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMins = now.getUTCMinutes();
    const currentTotalMins = (utcHours * 60) + utcMins;

    // RDO events occur exactly every 45 minutes
    const interval = 45;
    const nextEventSlot = Math.ceil((currentTotalMins + 1) / interval) * interval;
    const minsRemaining = nextEventSlot - currentTotalMins;

    // Map infinite time to finite rotation via modulo
    const rotationIndex = Math.floor(nextEventSlot / interval) % EVENT_ROTATION.length;
    const targetEvent = EVENT_ROTATION[rotationIndex];

    // Calculate actual UTC time of event
    const eventHour = Math.floor(nextEventSlot / 60) % 24;
    const eventMin = nextEventSlot % 60;
    const eventTimeUTC = `${eventHour.toString().padStart(2, '0')}:${eventMin.toString().padStart(2, '0')}`;

    return {
        name: targetEvent.name,
        type: targetEvent.type,
        value: targetEvent.value,
        minsRemaining,
        timestamp: nextEventSlot,
        eventTimeUTC,
        typeConfig: EVENT_TYPES[targetEvent.type],
        valueConfig: VALUE_TIERS[targetEvent.value],
    };
}

/**
 * Get upcoming events (next N events in rotation)
 * @param {number} count - Number of events to return
 * @returns {Array} Array of event objects
 */
export function getUpcomingEvents(count = 5) {
    const events = [];
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMins = now.getUTCMinutes();
    const currentTotalMins = (utcHours * 60) + utcMins;
    const interval = 45;

    for (let i = 0; i < count; i++) {
        const slotOffset = Math.ceil((currentTotalMins + 1) / interval) + i;
        const eventSlot = slotOffset * interval;
        const rotationIndex = slotOffset % EVENT_ROTATION.length;
        const targetEvent = EVENT_ROTATION[rotationIndex];

        const minsFromNow = eventSlot - currentTotalMins;
        const eventHour = Math.floor(eventSlot / 60) % 24;
        const eventMin = eventSlot % 60;

        events.push({
            name: targetEvent.name,
            type: targetEvent.type,
            value: targetEvent.value,
            minsRemaining: minsFromNow,
            eventTimeUTC: `${eventHour.toString().padStart(2, '0')}:${eventMin.toString().padStart(2, '0')}`,
            typeConfig: EVENT_TYPES[targetEvent.type],
            valueConfig: VALUE_TIERS[targetEvent.value],
        });
    }

    return events;
}

/**
 * Check if current time is within event window (first 15 mins)
 * @returns {Object|null} Current active event or null
 */
export function getCurrentActiveEvent() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMins = now.getUTCMinutes();
    const currentTotalMins = (utcHours * 60) + utcMins;
    const interval = 45;

    // Find the most recent event slot
    const currentSlot = Math.floor(currentTotalMins / interval) * interval;
    const minsSinceStart = currentTotalMins - currentSlot;

    // Events are "active" for first 15 minutes
    if (minsSinceStart <= 15) {
        const rotationIndex = Math.floor(currentSlot / interval) % EVENT_ROTATION.length;
        const activeEvent = EVENT_ROTATION[rotationIndex];
        return {
            name: activeEvent.name,
            type: activeEvent.type,
            value: activeEvent.value,
            minsActive: minsSinceStart,
            minsLeft: 15 - minsSinceStart,
            typeConfig: EVENT_TYPES[activeEvent.type],
            valueConfig: VALUE_TIERS[activeEvent.value],
        };
    }

    return null;
}
