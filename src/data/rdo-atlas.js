// FILE: src/data/rdo-atlas.js
// Geospatial Database: Points of Interest across the RDO Map
// Coordinate System: X[-120, 120], Y[-100, 100] - Center (0,0) is Flatneck Station

export const POINTS_OF_INTEREST = [
    // ═══════════════════════════════════════════════════════════════════════════
    // LEGENDARY BOUNTIES (Gold Farming)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'bounty_etta',
        name: 'Etta Doyle',
        type: 'bounty',
        x: 50, y: -50,
        region: 'Saint Denis',
        desc: 'Hide in tunnel, wait 4 minutes. Most efficient solo bounty.',
        yield: '0.32 GB',
        tier: 'meta'
    },
    {
        id: 'bounty_red_ben',
        name: 'Red Ben Clempson',
        type: 'bounty',
        x: -95, y: -55,
        region: 'Tumbleweed',
        desc: 'Train heist. Bring explosives or shotgun.',
        yield: '0.48 GB',
        tier: 'efficient'
    },
    {
        id: 'bounty_yukon',
        name: 'Yukon Nik',
        type: 'bounty',
        x: -15, y: 55,
        region: 'Colter',
        desc: 'Cold weather. Easy wagon escort.',
        yield: '0.40 GB',
        tier: 'efficient'
    },
    {
        id: 'bounty_barbarella',
        name: 'Barbarella Alcazar',
        type: 'bounty',
        x: -90, y: -50,
        region: 'Thieves Landing',
        desc: 'Island assault. Good for posse.',
        yield: '0.44 GB',
        tier: 'standard'
    },
    {
        id: 'bounty_cecil',
        name: 'Cecil C. Tucker',
        type: 'bounty',
        x: 25, y: -25,
        region: 'Rhodes',
        desc: 'Mansion infiltration. Stealth optional.',
        yield: '0.36 GB',
        tier: 'standard'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // HUNTING SPOTS (Cash Farming - Trader)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'hunt_panther',
        name: 'Panther Spawn',
        type: 'hunt',
        x: 35, y: -70,
        region: 'Old Harry Fen',
        desc: 'Best predator pelt. Dangerous. 1-2 spawns per session.',
        yield: '$14.00',
        tier: 'meta'
    },
    {
        id: 'hunt_cougar_plains',
        name: 'Cougar Spawn (Plains)',
        type: 'hunt',
        x: -35, y: -35,
        region: 'Great Plains',
        desc: 'Reliable spawn near the windmill. Night time.',
        yield: '$13.50',
        tier: 'meta'
    },
    {
        id: 'hunt_cougar_rio',
        name: 'Cougar Spawn (Rio)',
        type: 'hunt',
        x: -85, y: -65,
        region: 'Gaptooth Ridge',
        desc: 'Alternate cougar. Less reliable than Plains.',
        yield: '$13.50',
        tier: 'efficient'
    },
    {
        id: 'hunt_gator',
        name: 'Gator Farm',
        type: 'hunt',
        x: 55, y: -55,
        region: 'Bayou Nwa',
        desc: 'Infinite gators. Use varmint for small, bolt for large.',
        yield: '$6.50',
        tier: 'standard'
    },
    {
        id: 'hunt_bison',
        name: 'Bison Herd',
        type: 'hunt',
        x: -25, y: -30,
        region: 'Great Plains',
        desc: 'Large herds. Excellent for Trader materials.',
        yield: '$32.00 (3★)',
        tier: 'efficient'
    },
    {
        id: 'hunt_elk',
        name: 'Elk Territory',
        type: 'hunt',
        x: 0, y: 50,
        region: 'Ambarino',
        desc: 'Bull elk near Cumberland Forest.',
        yield: '$19.50',
        tier: 'efficient'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // MOONSHINE SHACK LOCATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'shack_bayou',
        name: 'Moonshine Shack (Bayou)',
        type: 'shack',
        x: 45, y: -45,
        region: 'Bayou Nwa',
        desc: 'META. Flattest delivery routes. No hills.',
        yield: 'Passive',
        tier: 'meta'
    },
    {
        id: 'shack_tall',
        name: 'Moonshine Shack (Tall Trees)',
        type: 'shack',
        x: -50, y: -25,
        region: 'Tall Trees',
        desc: 'Second best. Some hills on routes.',
        yield: 'Passive',
        tier: 'efficient'
    },
    {
        id: 'shack_grizzlies',
        name: 'Moonshine Shack (Grizzlies)',
        type: 'shack',
        x: 10, y: 40,
        region: 'Grizzlies',
        desc: 'Avoid. Treacherous mountain routes.',
        yield: 'Passive',
        tier: 'avoid'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // TRADER CAMP LOCATIONS (Meta Spots)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'camp_gaptooth',
        name: 'Camp Site (Gaptooth)',
        type: 'camp',
        x: -90, y: -60,
        region: 'New Austin',
        desc: 'Cougars and deer. Flat terrain.',
        yield: 'Trader',
        tier: 'meta'
    },
    {
        id: 'camp_heartlands',
        name: 'Camp Site (Heartlands)',
        type: 'camp',
        x: 15, y: -5,
        region: 'New Hanover',
        desc: 'Central location. Good variety of game.',
        yield: 'Trader',
        tier: 'efficient'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SHOPS & SERVICES
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'fence_emerald',
        name: 'Fence (Emerald)',
        type: 'shop',
        x: 15, y: -10,
        region: 'Emerald Ranch',
        desc: 'Sell stolen goods, wagons, jewelry.',
        yield: 'Cash',
        tier: 'utility'
    },
    {
        id: 'fence_rhodes',
        name: 'Fence (Rhodes)',
        type: 'shop',
        x: 28, y: -32,
        region: 'Rhodes',
        desc: 'Alternate fence location.',
        yield: 'Cash',
        tier: 'utility'
    },
    {
        id: 'fence_thieves',
        name: 'Fence (Thieves Landing)',
        type: 'shop',
        x: -75, y: -45,
        region: 'Thieves Landing',
        desc: 'Remote fence. Less traffic.',
        yield: 'Cash',
        tier: 'utility'
    },
    {
        id: 'madam_nazar',
        name: 'Madam Nazar (Dynamic)',
        type: 'shop',
        x: 0, y: 0,
        region: 'Roaming',
        desc: 'Location changes daily. Check jeanropke map.',
        yield: 'Collector',
        tier: 'utility'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // COLLECTOR HOTSPOTS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'collect_lemoyne',
        name: 'Collector Route (Lemoyne)',
        type: 'collect',
        x: 40, y: -40,
        region: 'Lemoyne',
        desc: 'Flat terrain. High density of dig sites.',
        yield: '$200-400/run',
        tier: 'meta'
    },
    {
        id: 'collect_new_austin',
        name: 'Collector Route (New Austin)',
        type: 'collect',
        x: -80, y: -55,
        region: 'New Austin',
        desc: 'Wide open. Fast horse riding.',
        yield: '$200-400/run',
        tier: 'efficient'
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DAILY CHALLENGE HOTSPOTS
    // ═══════════════════════════════════════════════════════════════════════════
    {
        id: 'herb_ginseng',
        name: 'Ginseng Farm',
        type: 'herb',
        x: -55, y: -20,
        region: 'Big Valley',
        desc: 'Dense ginseng spawns for dailies.',
        yield: 'Daily',
        tier: 'utility'
    },
    {
        id: 'herb_yarrow',
        name: 'Yarrow Fields',
        type: 'herb',
        x: -30, y: -40,
        region: 'Great Plains',
        desc: 'Prairie yarrow for crafting/dailies.',
        yield: 'Daily',
        tier: 'utility'
    },
];

// POI Type Configuration (for UI icons and colors)
export const POI_TYPES = {
    bounty: { label: 'Bounty', icon: 'Crosshair', color: 'text-red-500', bg: 'bg-red-500' },
    hunt: { label: 'Hunting', icon: 'Target', color: 'text-amber-500', bg: 'bg-amber-500' },
    shack: { label: 'Moonshine', icon: 'Wine', color: 'text-cyan-400', bg: 'bg-cyan-500' },
    camp: { label: 'Camp', icon: 'Tent', color: 'text-green-500', bg: 'bg-green-500' },
    shop: { label: 'Shop', icon: 'Store', color: 'text-violet-400', bg: 'bg-violet-500' },
    collect: { label: 'Collector', icon: 'Search', color: 'text-yellow-400', bg: 'bg-yellow-500' },
    herb: { label: 'Herbs', icon: 'Leaf', color: 'text-emerald-400', bg: 'bg-emerald-500' },
};

// Tier Configuration
export const POI_TIERS = {
    meta: { label: 'META', color: 'text-[#D4AF37]', border: 'border-[#D4AF37]' },
    efficient: { label: 'Efficient', color: 'text-green-400', border: 'border-green-500' },
    standard: { label: 'Standard', color: 'text-gray-400', border: 'border-white/20' },
    utility: { label: 'Utility', color: 'text-blue-400', border: 'border-blue-500' },
    avoid: { label: 'Avoid', color: 'text-red-400', border: 'border-red-500' },
};
