// FILE: src/utils/graph-logic.js
// ═══════════════════════════════════════════════════════════════════════════
// GRAPH PATHFINDING ENGINE
// ═══════════════════════════════════════════════════════════════════════════
//
// Implements BFS (Breadth-First Search) for unweighted shortest path.
// BFS is optimal here because all edges have equal "cost" (1 hop).
//
// ARCHITECTURE:
// - Imports LINKS from topology.js (visual graph structure)
// - Returns path data that TravelMap passes to MapBoard for highlighting
// ═══════════════════════════════════════════════════════════════════════════

import { LINKS } from '../data/topology';

// ─────────────────────────────────────────────────────────────────────────────
// ADJACENCY LIST BUILDER
// ─────────────────────────────────────────────────────────────────────────────
// Converts the LINKS edge array into a lookup table for O(1) neighbor access.
// Built as undirected: A→B and B→A are both valid traversals.

const buildAdjacencyList = () => {
    const adj = {};

    for (const { from, to } of LINKS) {
        if (!adj[from]) adj[from] = [];
        if (!adj[to]) adj[to] = [];

        // Undirected: add both directions
        adj[from].push(to);
        adj[to].push(from);
    }

    return adj;
};

// Cache the adjacency list (LINKS is static)
let cachedAdjacency = null;
const getAdjacency = () => {
    if (!cachedAdjacency) cachedAdjacency = buildAdjacencyList();
    return cachedAdjacency;
};

// ─────────────────────────────────────────────────────────────────────────────
// SHORTEST PATH (BFS)
// ─────────────────────────────────────────────────────────────────────────────
// Finds the path with minimum hops between two nodes.
//
// @param {string} start - Origin node ID (e.g., 'valentine')
// @param {string} end   - Destination node ID (e.g., 'saintdenis')
// @returns {string[]}   - Ordered array of node IDs, or empty if no path

export function findShortestPath(start, end) {
    // Edge cases
    if (!start || !end) return [];
    if (start === end) return [start];

    const adj = getAdjacency();

    // Validate nodes exist in graph
    if (!adj[start] || !adj[end]) {
        console.warn(`[graph-logic] Unknown node: ${!adj[start] ? start : end}`);
        return [];
    }

    // BFS state
    const queue = [start];
    const visited = new Set([start]);
    const predecessors = {}; // { child: parent } for path reconstruction

    while (queue.length > 0) {
        const current = queue.shift();

        // Found destination - reconstruct path
        if (current === end) {
            const path = [];
            let step = end;

            while (step !== undefined) {
                path.unshift(step);
                step = predecessors[step];
            }

            return path;
        }

        // Explore neighbors
        for (const neighbor of adj[current] || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                predecessors[neighbor] = current;
                queue.push(neighbor);
            }
        }
    }

    // No path found (disconnected graph)
    return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH TO EDGES CONVERTER
// ─────────────────────────────────────────────────────────────────────────────
// Transforms a node path into edge pairs for MapBoard's activeRouteEdges prop.
//
// @param {string[]} path - Array of node IDs in order
// @returns {Array<{from: string, to: string}>} - Edge objects

export function pathToEdges(path) {
    const edges = [];

    for (let i = 0; i < path.length - 1; i++) {
        edges.push({
            from: path[i],
            to: path[i + 1],
        });
    }

    return edges;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all nodes connected to a given node (1 hop)
 * @param {string} nodeId - Node to check
 * @returns {string[]} - Array of neighbor node IDs
 */
export function getNeighbors(nodeId) {
    const adj = getAdjacency();
    return adj[nodeId] || [];
}

/**
 * Check if two nodes are directly connected
 * @param {string} nodeA - First node
 * @param {string} nodeB - Second node
 * @returns {boolean}
 */
export function areConnected(nodeA, nodeB) {
    const adj = getAdjacency();
    return adj[nodeA]?.includes(nodeB) ?? false;
}
