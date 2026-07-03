// FILE: src/data/geography.js
// =========================================================================
// GEOGRAPHY DATA - Fast Travel Locations & Map Coordinates
// =========================================================================
// Contains actual game world coordinates for fast travel cost calculations.
// For VISUAL metro map coordinates, see topology.js

/**
 * Fast travel locations with actual game map coordinates
 * Used for distance-based cost calculations
 *
 * CRITICAL: The keys in this object must match 'id' values in topology.js NODES
 */
export const FAST_TRAVEL_LOCATIONS = {
  valentine: { name: 'Valentine', region: 'New Hanover', x: 0, y: 0 },
  saintdenis: { name: 'Saint Denis', region: 'Lemoyne', x: 50, y: -50 },
  blackwater: { name: 'Blackwater', region: 'West Elizabeth', x: -40, y: -40 },
  rhodes: { name: 'Rhodes', region: 'Lemoyne', x: 30, y: -30 },
  tumbleweed: { name: 'Tumbleweed', region: 'New Austin', x: -100, y: -60 },
  strawberry: { name: 'Strawberry', region: 'West Elizabeth', x: -60, y: 10 },
  vanhorn: { name: 'Van Horn', region: 'New Hanover', x: 60, y: 20 },
  annesburg: { name: 'Annesburg', region: 'New Hanover', x: 60, y: 40 },
  colter: { name: 'Colter', region: 'Ambarino', x: -20, y: 60 },
  wapiti: { name: 'Wapiti', region: 'Ambarino', x: 10, y: 55 },
  macfarlane: { name: 'MacFarlanes Ranch', region: 'New Austin', x: -60, y: -30 },
};
