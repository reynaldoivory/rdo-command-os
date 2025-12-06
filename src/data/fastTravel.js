// =========================================================================
// FAST TRAVEL SYSTEM - LOCATIONS & PRICING
// Source: In-game measurements, community verification
// =========================================================================

// All fast travel destinations with coordinates for distance calculation
export const FAST_TRAVEL_LOCATIONS = {
  // Main Towns
  valentine: { name: 'Valentine', x: -280, y: 800, region: 'heartlands' },
  rhodes: { name: 'Rhodes', x: 1230, y: 1750, region: 'lemoyne' },
  strawberry: { name: 'Strawberry', x: -1780, y: 1190, region: 'bigValley' },
  blackwater: { name: 'Blackwater', x: -820, y: 2230, region: 'greatPlains' },
  saintDenis: { name: 'Saint Denis', x: 2520, y: 2120, region: 'lemoyne' },
  tumbleweed: { name: 'Tumbleweed', x: -5450, y: 2650, region: 'newAustin' },
  annesburg: { name: 'Annesburg', x: 2900, y: 150, region: 'roanoke' },
  vanHorn: { name: 'Van Horn', x: 2980, y: 750, region: 'roanoke' },
  armadillo: { name: 'Armadillo', x: -3720, y: 2520, region: 'newAustin' },
  
  // Wilderness Fast Travel Posts
  colter: { name: 'Colter', x: -1350, y: -1200, region: 'ambarino' },
  wapiti: { name: 'Wapiti', x: 530, y: -800, region: 'ambarino' },
  emeraldRanch: { name: 'Emerald Ranch', x: 1450, y: 800, region: 'heartlands' },
  macFarlanes: { name: "MacFarlane's Ranch", x: -2380, y: 2700, region: 'newAustin' },
  manzanita: { name: 'Manzanita Post', x: -1950, y: 1850, region: 'tallTrees' },
  lagras: { name: 'Lagras', x: 2150, y: 1550, region: 'lemoyne' },
};

// Base pricing tiers for fast travel (distance-based)
export const FAST_TRAVEL_PRICES = {
  veryClose: { maxDistance: 500, cost: 1.00 },     // Same region, nearby
  close: { maxDistance: 1500, cost: 2.00 },        // Same region, far
  medium: { maxDistance: 3000, cost: 4.00 },       // Adjacent region
  far: { maxDistance: 5000, cost: 8.00 },          // Cross-map
  veryFar: { maxDistance: Infinity, cost: 12.00 }, // New Austin from Ambarino
};

// Current promotional pricing (update during events)
export const FAST_TRAVEL_PROMO = {
  active: true, // December 2025 event
  discount: 1.0, // 100% off = FREE
  source: 'December 2025 Holiday Event (Dec 2 - Jan 6)',
};

/**
 * Calculate Euclidean distance between two locations
 * @param {string} from - Location key
 * @param {string} to - Location key
 * @returns {number} Distance in game units
 */
export function calcDistance(from, to) {
  const locA = FAST_TRAVEL_LOCATIONS[from];
  const locB = FAST_TRAVEL_LOCATIONS[to];
  if (!locA || !locB) return 0;
  return Math.sqrt(
    Math.pow(locB.x - locA.x, 2) + Math.pow(locB.y - locA.y, 2)
  );
}

/**
 * Calculate fast travel cost based on distance
 * @param {number} distance - Distance in game units
 * @returns {number} Cost in RDO$
 */
export function calcFastTravelCost(distance) {
  for (const tier of Object.values(FAST_TRAVEL_PRICES)) {
    if (distance <= tier.maxDistance) {
      return tier.cost;
    }
  }
  return FAST_TRAVEL_PRICES.veryFar.cost;
}

/**
 * Get current fast travel cost (accounting for promotions)
 * @param {string} from - Origin location key
 * @param {string} to - Destination location key
 * @returns {{ baseCost: number, finalCost: number, distance: number, promo: boolean }}
 */
export function getCurrentFastTravelCost(from, to) {
  const distance = calcDistance(from, to);
  const baseCost = calcFastTravelCost(distance);
  const finalCost = FAST_TRAVEL_PROMO.active 
    ? baseCost * (1 - FAST_TRAVEL_PROMO.discount)
    : baseCost;
  
  return {
    distance: Math.round(distance),
    baseCost,
    finalCost,
    promo: FAST_TRAVEL_PROMO.active,
  };
}

/**
 * Generate matrix of all fast travel costs
 * @returns {Object} Matrix of location -> location -> cost data
 */
export function generateFastTravelMatrix() {
  const locations = Object.keys(FAST_TRAVEL_LOCATIONS);
  const matrix = {};
  
  for (const from of locations) {
    matrix[from] = {};
    for (const to of locations) {
      if (from !== to) {
        matrix[from][to] = getCurrentFastTravelCost(from, to);
      }
    }
  }
  
  return matrix;
}
