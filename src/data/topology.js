// FILE: src/data/topology.js
// ═══════════════════════════════════════════════════════════════════════════
// VECTOR TOPOLOGY SYSTEM - Visual Data Model
// ═══════════════════════════════════════════════════════════════════════════
//
// ARCHITECTURE SEPARATION:
// - This file: Visual/Metro Map coordinates (abstract 1000x600 SVG grid)
// - rdo-data.js: Game coordinates (actual RDO map coords for cost calculation)
//
// The 'id' values in NODES must EXACTLY match keys in FAST_TRAVEL_LOCATIONS.
// This ID string is the coupling point between visual and logical layers.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1. THEME CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// Centralized styling constants for the Metro Map aesthetic.
// Adjust colors here for theming without touching component code.

export const THEME = {
    // Canvas
    viewBox: '0 0 1000 600',
    gridColor: '#333333',

    // Track Styling
    railColor: '#4b5563',      // Gray-600 (inactive)
    railActive: '#D4AF37',     // Gold (highlighted route)
    railWidthStandard: 6,
    railWidthActive: 8,

    // Node Styling
    nodeInactive: '#1f2937',   // Gray-800
    nodeOrigin: '#10b981',     // Emerald-500 (player location)
    nodeDest: '#ef4444',       // Red-500 (destination)
    nodeRadius: 6,
    nodeActiveRadius: 10,

    // Text Styling
    textDefault: '#6b7280',    // Gray-500
    textActive: '#f3f4f6',     // Gray-100
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. TIMING CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for animation duration.
// CSS and JS both reference these to prevent drift.

export const TIMING = {
    TRAVEL_DURATION_MS: 2000,
    TRAVEL_DURATION_CSS: '2s',
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. VISUAL NODE COORDINATES
// ─────────────────────────────────────────────────────────────────────────────
// Abstract positions on a 1000x600 SVG canvas.
// These DO NOT reflect actual game coordinates - they're optimized for
// a clean "Metro Map" aesthetic with proper spacing and readability.
//
// CRITICAL: The 'id' field must match keys in src/data/rdo-data.js

export const NODES = [
    // ── New Austin (Southwest) ──
    { id: 'tumbleweed', name: 'TUMBLEWEED', x: 50, y: 500 },
    { id: 'macfarlane', name: 'MACFARLANE', x: 200, y: 450 },

    // ── West Elizabeth (Central-West) ──
    { id: 'blackwater', name: 'BLACKWATER', x: 350, y: 400 },
    { id: 'strawberry', name: 'STRAWBERRY', x: 280, y: 250 },

    // ── Ambarino (North) ──
    { id: 'colter', name: 'COLTER', x: 250, y: 60 },
    { id: 'wapiti', name: 'WAPITI', x: 500, y: 60 },

    // ── New Hanover (Central-East) ──
    { id: 'valentine', name: 'VALENTINE', x: 500, y: 250 },
    { id: 'annesburg', name: 'ANNESBURG', x: 850, y: 100 },
    { id: 'vanhorn', name: 'VAN HORN', x: 900, y: 250 },

    // ── Lemoyne (Southeast) ──
    { id: 'rhodes', name: 'RHODES', x: 600, y: 420 },
    { id: 'saintdenis', name: 'SAINT DENIS', x: 850, y: 500 },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. TRACK CONNECTIONS (Edges)
// ─────────────────────────────────────────────────────────────────────────────
// Defines which nodes are visually connected by "railroad tracks".
// This is an undirected graph - both directions are valid.
// The pathfinding algorithm uses this to determine valid routes.

export const LINKS = [
    // ── West Line (New Austin → West Elizabeth) ──
    { from: 'tumbleweed', to: 'macfarlane' },
    { from: 'macfarlane', to: 'blackwater' },

    // ── Mountain Line (West Elizabeth → Ambarino) ──
    { from: 'blackwater', to: 'strawberry' },
    { from: 'strawberry', to: 'colter' },
    { from: 'strawberry', to: 'valentine' },    // Central Cut

    // ── North Line (Ambarino traverse) ──
    { from: 'colter', to: 'wapiti' },
    { from: 'wapiti', to: 'annesburg' },
    { from: 'wapiti', to: 'valentine' },        // Wapiti direct

    // ── East Line (New Hanover → Lemoyne coast) ──
    { from: 'annesburg', to: 'vanhorn' },
    { from: 'vanhorn', to: 'saintdenis' },
    { from: 'valentine', to: 'vanhorn' },       // Valentine direct to coast

    // ── South Line (Lemoyne loop) ──
    { from: 'saintdenis', to: 'rhodes' },
    { from: 'rhodes', to: 'blackwater' },       // Cross-region connector
    { from: 'rhodes', to: 'valentine' },        // Central connector
];
