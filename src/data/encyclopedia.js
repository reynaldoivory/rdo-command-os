/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RDO COMMAND - Encyclopedia Data Module
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Contains game mechanics data that the game itself hides from players:
 * - Legendary Animal species and cooldowns
 * - Free Roam Event rotation schedule
 * - Daily/Weekly reset timers
 * - Hidden game rules
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. COOLDOWN CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Legendary animals have a 72-hour REAL-TIME cooldown per SPECIES.
 * Killing the Golden Spirit Bear locks ALL bears for 72 hours.
 */
export const SPECIES_COOLDOWN_HOURS = 72;

/**
 * Moonshine batch timer (48 minutes for Strong Moonshine)
 */
export const MOONSHINE_BATCH_MINUTES = 48;

/**
 * Trader delivery cooldown after completing a sale
 */
export const TRADER_COOLDOWN_MINUTES = 10;

// ═══════════════════════════════════════════════════════════════════════════
// 2. LEGENDARY ANIMALS DATABASE
// ═══════════════════════════════════════════════════════════════════════════

export const LEGENDARY_ANIMALS = [
    // ── BEARS ──
    {
        id: 'la_bear_golden',
        name: 'Golden Spirit Bear',
        species: 'BEAR',
        location: 'Big Valley (Aurora Basin)',
        time: 'Day',
        weather: 'Any',
        value: 62.50,
        materials: 60,
        coords: { x: 280, y: 250 },
        nodeId: 'strawberry',
        notes: 'Spawns near the river. Very aggressive. Use Sedative for samples.'
    },
    {
        id: 'la_bear_ridge',
        name: 'Ridgeback Spirit Bear',
        species: 'BEAR',
        location: 'Tall Trees (Manzanita Post)',
        time: 'Day',
        weather: 'Clear',
        value: 62.50,
        materials: 60,
        coords: { x: 280, y: 350 },
        nodeId: 'strawberry',
        notes: 'Clear weather required. Check near Manzanita Post.'
    },
    {
        id: 'la_bear_owiza',
        name: 'Owiza Bear',
        species: 'BEAR',
        location: 'Dakota River (Valentine)',
        time: 'Night',
        weather: 'Rain',
        value: 58.00,
        materials: 55,
        coords: { x: 500, y: 250 },
        nodeId: 'valentine',
        notes: 'Night + Rain required. Check during thunderstorms.'
    },

    // ── CATS (PANTHERS/COUGARS) ──
    {
        id: 'la_cat_ghost',
        name: 'Ghost Panther',
        species: 'CAT',
        location: 'Bluewater Marsh',
        time: 'Night',
        weather: 'Rain',
        value: 50.00,
        materials: 48,
        coords: { x: 800, y: 450 },
        nodeId: 'saintdenis',
        notes: 'Very rare spawn. Night + Rain. Will ambush from behind.'
    },
    {
        id: 'la_cat_night',
        name: 'Nightwalker Panther',
        species: 'CAT',
        location: 'Bolger Glade (South of Rhodes)',
        time: 'Night',
        weather: 'Fog',
        value: 55.00,
        materials: 52,
        coords: { x: 600, y: 420 },
        nodeId: 'rhodes',
        notes: 'Fog required. Check between 2-4 AM game time.'
    },
    {
        id: 'la_cat_iza',
        name: 'Iwakta Panther',
        species: 'CAT',
        location: 'Braithwaite Manor Woods',
        time: 'Day',
        weather: 'Rain',
        value: 52.00,
        materials: 50,
        coords: { x: 650, y: 450 },
        nodeId: 'rhodes',
        notes: 'One of few daytime legendary cats. Rain required.'
    },
    {
        id: 'la_cat_ota',
        name: 'Ota Fox',
        species: 'CAT',
        location: 'Cholla Springs',
        time: 'Night',
        weather: 'Clear',
        value: 40.00,
        materials: 38,
        coords: { x: 100, y: 450 },
        nodeId: 'tumbleweed',
        notes: 'Desert spawn. Night + Clear weather.'
    },

    // ── GATORS ──
    {
        id: 'la_gator_sun',
        name: 'Sun Gator',
        species: 'GATOR',
        location: 'Lagras Swamp',
        time: 'Morning',
        weather: 'Fog',
        value: 40.00,
        materials: 38,
        coords: { x: 850, y: 480 },
        nodeId: 'saintdenis',
        notes: 'Fog in the morning. Check the small islands.'
    },
    {
        id: 'la_gator_teca',
        name: 'Teca Gator',
        species: 'GATOR',
        location: 'Lannahechee River',
        time: 'Night',
        weather: 'Storm',
        value: 42.00,
        materials: 40,
        coords: { x: 800, y: 500 },
        nodeId: 'saintdenis',
        notes: 'Thunderstorm required. Spawns in the river.'
    },

    // ── BISON ──
    {
        id: 'la_bison_tat',
        name: 'Tatanka Bison',
        species: 'BISON',
        location: 'Heartlands Overflow',
        time: 'Day',
        weather: 'Rain',
        value: 45.00,
        materials: 42,
        coords: { x: 550, y: 280 },
        nodeId: 'valentine',
        notes: 'Rain required. Large spawn area - check the entire Heartlands.'
    },
    {
        id: 'la_bison_win',
        name: 'Winyan Bison',
        species: 'BISON',
        location: 'Lake Isabella',
        time: 'Night',
        weather: 'Snow',
        value: 45.00,
        materials: 42,
        coords: { x: 200, y: 80 },
        nodeId: 'colter',
        notes: 'Snow required. Female bison (no horns). Check north of the lake.'
    },

    // ── WOLVES ──
    {
        id: 'la_wolf_marble',
        name: 'Marble Fox',
        species: 'WOLF',
        location: 'Colter (Grizzlies West)',
        time: 'Night',
        weather: 'Snow',
        value: 38.00,
        materials: 35,
        coords: { x: 250, y: 60 },
        nodeId: 'colter',
        notes: 'Snow + Night. Arctic coloring makes it hard to spot.'
    },
    {
        id: 'la_wolf_onyx',
        name: 'Onyx Wolf',
        species: 'WOLF',
        location: 'Wapiti',
        time: 'Night',
        weather: 'Clear',
        value: 40.00,
        materials: 38,
        coords: { x: 500, y: 60 },
        nodeId: 'wapiti',
        notes: 'Clear night. Black coloring. Pack will spawn with it.'
    },

    // ── ELK/MOOSE ──
    {
        id: 'la_elk_katata',
        name: 'Katata Elk',
        species: 'ELK',
        location: 'Cumberland Forest',
        time: 'Morning',
        weather: 'Fog',
        value: 32.00,
        materials: 30,
        coords: { x: 600, y: 200 },
        nodeId: 'valentine',
        notes: 'Fog required. Check the forest east of Valentine.'
    },
    {
        id: 'la_moose_knight',
        name: 'Knight Moose',
        species: 'MOOSE',
        location: "O'Creagh's Run",
        time: 'Morning',
        weather: 'Any',
        value: 50.00,
        materials: 48,
        coords: { x: 550, y: 150 },
        nodeId: 'wapiti',
        notes: 'Very rare. Check the lake shore at dawn.'
    },

    // ── BOAR ──
    {
        id: 'la_boar_waka',
        name: 'Wakpa Boar',
        species: 'BOAR',
        location: 'Scarlett Meadows',
        time: 'Day',
        weather: 'Clear',
        value: 28.00,
        materials: 25,
        coords: { x: 550, y: 400 },
        nodeId: 'rhodes',
        notes: 'Clear weather. Check the fields south of Dewberry Creek.'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// 3. FREE ROAM EVENT SCHEDULE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Free Roam Events run on a ~45 minute cycle.
 * The exact schedule varies by day, but this is the general rotation.
 */
export const FREE_ROAM_EVENTS = [
    {
        id: 'fre_trade_route',
        name: 'Trade Route',
        type: 'trader',
        benefit: '+18 Goods',
        description: 'Defend a train carrying trade goods. Completion adds materials directly to your camp.',
        duration: 10,
        recommended: true
    },
    {
        id: 'fre_salvage',
        name: 'Salvage',
        type: 'collector',
        benefit: 'Collectibles',
        description: 'Race to collect salvage crates. Good for finding random collectibles.',
        duration: 10,
        recommended: true
    },
    {
        id: 'fre_condor_egg',
        name: 'Condor Egg',
        type: 'collector',
        benefit: '$1000 Egg',
        description: 'Find the golden condor egg before other players. Winner gets $1000 item.',
        duration: 10,
        recommended: true
    },
    {
        id: 'fre_protect_legendary',
        name: 'Protect Legendary Animal',
        type: 'naturalist',
        benefit: 'Samples + XP',
        description: 'Protect a legendary animal from poachers. Good Naturalist XP.',
        duration: 10,
        recommended: false
    },
    {
        id: 'fre_manhunt',
        name: 'Manhunt',
        type: 'bounty',
        benefit: 'Gold + XP',
        description: 'Hunt down an NPC target before other players. PvE race.',
        duration: 10,
        recommended: false
    },
    {
        id: 'fre_dispatch_rider',
        name: 'Dispatch Rider',
        type: 'general',
        benefit: 'Gold + XP',
        description: 'Deliver a message while being hunted by other players. PvP element.',
        duration: 10,
        recommended: false
    },
    {
        id: 'fre_king_of_castle',
        name: 'King of the Castle',
        type: 'pvp',
        benefit: 'Gold + XP',
        description: 'Capture and hold a location. Pure PvP.',
        duration: 10,
        recommended: false
    },
    {
        id: 'fre_fishing_challenge',
        name: 'Fishing Challenge',
        type: 'general',
        benefit: 'Cash + XP',
        description: 'Catch the most fish in the time limit.',
        duration: 10,
        recommended: false
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// 4. DAILY/WEEKLY RESET TIMES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All times are in UTC
 */
export const RESET_TIMES = {
    daily: { hour: 6, minute: 0 },  // 6:00 AM UTC
    weekly: { day: 2, hour: 6, minute: 0 },  // Tuesday 6:00 AM UTC
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all unique species from the legendary database
 */
export function getUniqueSpecies() {
    const species = new Set(LEGENDARY_ANIMALS.map(a => a.species));
    return Array.from(species);
}

/**
 * Group legendary animals by species
 */
export function groupBySpecies() {
    return LEGENDARY_ANIMALS.reduce((acc, animal) => {
        if (!acc[animal.species]) acc[animal.species] = [];
        acc[animal.species].push(animal);
        return acc;
    }, {});
}

/**
 * Calculate time until next daily reset
 */
export function getTimeUntilDailyReset() {
    const now = new Date();
    const reset = new Date(now);
    reset.setUTCHours(RESET_TIMES.daily.hour, RESET_TIMES.daily.minute, 0, 0);

    if (reset <= now) {
        reset.setUTCDate(reset.getUTCDate() + 1);
    }

    return reset.getTime() - now.getTime();
}

/**
 * Calculate time until next weekly reset (Tuesday)
 */
export function getTimeUntilWeeklyReset() {
    const now = new Date();
    const reset = new Date(now);
    reset.setUTCHours(RESET_TIMES.weekly.hour, RESET_TIMES.weekly.minute, 0, 0);

    const daysUntilTuesday = (RESET_TIMES.weekly.day - now.getUTCDay() + 7) % 7;
    reset.setUTCDate(reset.getUTCDate() + (daysUntilTuesday || 7));

    if (reset <= now) {
        reset.setUTCDate(reset.getUTCDate() + 7);
    }

    return reset.getTime() - now.getTime();
}

/**
 * Format milliseconds to human-readable countdown
 */
export function formatCountdown(ms) {
    if (ms <= 0) return 'NOW';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    }

    return `${hours}h ${minutes}m`;
}
