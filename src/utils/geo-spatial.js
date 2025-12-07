// FILE: src/utils/geo-spatial.js
// Geospatial Intelligence Engine for RDO Navigation
// Provides proximity calculations, nearest-post lookup, and route optimization

import { FAST_TRAVEL_LOCATIONS } from '../data/rdo-data';
import { calcDistance } from './rdo-logic';

/**
 * Find the nearest Fast Travel post to any coordinate on the map
 * @param {number} targetX - X coordinate of target
 * @param {number} targetY - Y coordinate of target
 * @returns {{ id: string, name: string, distance: number, cost: number, ...location }}
 */
export const findNearestPost = (targetX, targetY) => {
    let nearest = null;
    let minDist = Infinity;

    Object.entries(FAST_TRAVEL_LOCATIONS).forEach(([key, loc]) => {
        const dist = calcDistance({ x: targetX, y: targetY }, loc);
        if (dist < minDist) {
            minDist = dist;
            nearest = {
                id: key,
                ...loc,
                distance: Math.round(dist * 10) / 10,
                cost: Math.max(1, Math.ceil(dist / 10)) // Minimum $1
            };
        }
    });

    return nearest;
};

/**
 * Get all Fast Travel posts sorted by distance from user's current location
 * @param {string} userLocKey - Key of user's current location in FAST_TRAVEL_LOCATIONS
 * @returns {Array<{ id: string, name: string, distance: number, cost: number }>}
 */
export const getProximityList = (userLocKey) => {
    const userCoords = FAST_TRAVEL_LOCATIONS[userLocKey];

    if (!userCoords) {
        console.warn(`Unknown location key: ${userLocKey}`);
        return [];
    }

    const list = Object.entries(FAST_TRAVEL_LOCATIONS).map(([key, loc]) => {
        const distance = calcDistance(userCoords, loc);
        return {
            id: key,
            name: loc.name,
            region: loc.region,
            distance: Math.round(distance * 10) / 10,
            cost: key === userLocKey ? 0 : Math.max(1, Math.ceil(distance / 10))
        };
    });

    // Sort by distance (ascending)
    return list.sort((a, b) => a.distance - b.distance);
};

/**
 * Calculate travel cost between two Fast Travel locations
 * @param {string} fromKey - Origin location key
 * @param {string} toKey - Destination location key
 * @returns {number} - Cost in dollars
 */
export const getTravelCost = (fromKey, toKey) => {
    if (fromKey === toKey) return 0;

    const from = FAST_TRAVEL_LOCATIONS[fromKey];
    const to = FAST_TRAVEL_LOCATIONS[toKey];

    if (!from || !to) return 0;

    const distance = calcDistance(from, to);
    return Math.max(1, Math.ceil(distance / 10));
};

/**
 * Get the nearest Fast Travel post to a POI, plus the cost from user's current location
 * @param {string} userLocKey - User's current Fast Travel location
 * @param {{ x: number, y: number }} poi - Point of Interest coordinates
 * @returns {{ nearestPost: object, travelCost: number, walkDistance: number }}
 */
export const getPOIRoute = (userLocKey, poi) => {
    const userCoords = FAST_TRAVEL_LOCATIONS[userLocKey];
    const nearestPost = findNearestPost(poi.x, poi.y);

    if (!userCoords || !nearestPost) {
        return { nearestPost: null, travelCost: 0, walkDistance: 0 };
    }

    // Cost from user to the nearest post to the POI
    const travelCost = getTravelCost(userLocKey, nearestPost.id);

    // Distance from the post to the actual POI (walking/riding distance)
    const walkDistance = calcDistance(
        FAST_TRAVEL_LOCATIONS[nearestPost.id],
        { x: poi.x, y: poi.y }
    );

    return {
        nearestPost,
        travelCost,
        walkDistance: Math.round(walkDistance * 10) / 10,
        estimatedRideTime: Math.ceil(walkDistance / 20) // ~20 units per minute on horseback
    };
};

/**
 * Estimate ride time between two points (no fast travel)
 * @param {string} fromKey - Origin location key
 * @param {string} toKey - Destination location key  
 * @returns {{ distance: number, minutes: number, savings: number }}
 */
export const estimateRideTime = (fromKey, toKey) => {
    const from = FAST_TRAVEL_LOCATIONS[fromKey];
    const to = FAST_TRAVEL_LOCATIONS[toKey];

    if (!from || !to) return { distance: 0, minutes: 0, savings: 0 };

    const distance = calcDistance(from, to);
    const minutes = Math.ceil(distance / 15); // Horseback ~15 units per minute
    const fastTravelCost = getTravelCost(fromKey, toKey);

    return {
        distance: Math.round(distance * 10) / 10,
        minutes,
        savings: fastTravelCost // Money saved by riding instead
    };
};

/**
 * Get closest and furthest locations from current position
 * @param {string} userLocKey - User's current location
 * @returns {{ closest: Array, furthest: Array }}
 */
export const getExtremeLocations = (userLocKey) => {
    const proximity = getProximityList(userLocKey);

    // Exclude current location
    const others = proximity.filter(loc => loc.id !== userLocKey);

    return {
        closest: others.slice(0, 3),
        furthest: others.slice(-3).reverse()
    };
};
