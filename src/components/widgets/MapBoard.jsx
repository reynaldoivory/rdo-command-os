// FILE: src/components/MapBoard.jsx
// ═══════════════════════════════════════════════════════════════════════════
// METRO MAP RENDERING ENGINE
// ═══════════════════════════════════════════════════════════════════════════
//
// PURE VISUAL COMPONENT - No game logic, no state machine.
// Renders an SVG "Metro Map" based on topology data.
// Highlights nodes and edges based on props from the Logic Controller.
//
// PROPS:
// - originId: Current player location (green highlight)
// - destinationId: Selected destination (red highlight)
// - activeRouteEdges: Array of {from, to} edges to highlight in gold
// - routePath: Ordered node IDs for animation path
// - isTraveling: Whether travel animation is in progress
// - onSelectNode: Callback when user clicks a node
// ═══════════════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { NODES, LINKS, THEME, TIMING } from '../../data/topology';

export const MapBoard = ({
    originId,
    destinationId,
    activeRouteEdges = [],
    routePath = [],
    isTraveling = false,
    onSelectNode,
}) => {

    // ─────────────────────────────────────────────────────────────────────────
    // MEMOIZED LOOKUPS
    // ─────────────────────────────────────────────────────────────────────────

    // O(1) node coordinate lookup
    const nodeMap = useMemo(() =>
        NODES.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}),
        []);

    // Bidirectional edge lookup for route highlighting
    // Normalizes A→B and B→A to the same key
    const activeSet = useMemo(() => {
        const set = new Set();
        activeRouteEdges.forEach(edge => {
            set.add(`${edge.from}-${edge.to}`);
            set.add(`${edge.to}-${edge.from}`);
        });
        return set;
    }, [activeRouteEdges]);

    // Generate SVG path string for travel animation
    // Format: "M x0 y0 L x1 y1 L x2 y2..."
    const motionPath = useMemo(() => {
        if (routePath.length < 2) return '';

        return routePath.map((nodeId, index) => {
            const node = nodeMap[nodeId];
            if (!node) return '';
            return `${index === 0 ? 'M' : 'L'} ${node.x} ${node.y}`;
        }).join(' ');
    }, [routePath, nodeMap]);

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div
            className={`
        relative w-full aspect-[16/9] bg-[#080808] rounded-xl 
        border border-white/10 overflow-hidden shadow-2xl 
        select-none transition-opacity
        ${isTraveling ? 'pointer-events-none opacity-90' : ''}
      `}
        >
            {/* A. TACTICAL GRID BACKGROUND */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(${THEME.gridColor} 1px, transparent 1px), 
            linear-gradient(90deg, ${THEME.gridColor} 1px, transparent 1px)
          `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* B. SVG LAYER */}
            <svg
                viewBox={THEME.viewBox}
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
            >
                <defs>
                    {/* Glow filter for active nodes */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Travel animation keyframes */}
                    <style>
                        {`
              @keyframes travel {
                0% { offset-distance: 0%; }
                100% { offset-distance: 100%; }
              }
              .train-token {
                offset-path: path('${motionPath}');
                animation: travel ${TIMING.TRAVEL_DURATION_CSS} ease-in-out forwards;
              }
            `}
                    </style>
                </defs>

                {/* LAYER 1: TRACK CONNECTIONS */}
                {LINKS.map((link) => {
                    const start = nodeMap[link.from];
                    const end = nodeMap[link.to];
                    if (!start || !end) return null;

                    const isActive = activeSet.has(`${link.from}-${link.to}`);

                    return (
                        <g key={`${link.from}-${link.to}`}>
                            {/* Base Rail */}
                            <line
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke={isActive ? THEME.railActive : THEME.railColor}
                                strokeWidth={isActive ? THEME.railWidthActive : THEME.railWidthStandard}
                                strokeLinecap="round"
                                opacity={isActive ? 1.0 : 0.5}
                            />
                            {/* Track Ties (railroad aesthetic) */}
                            <line
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke="#000"
                                strokeWidth="2"
                                strokeDasharray="4 8"
                                opacity="0.3"
                            />
                        </g>
                    );
                })}

                {/* LAYER 2: STATION NODES */}
                {NODES.map((node) => {
                    const isOrigin = node.id === originId;
                    const isDest = node.id === destinationId;
                    const isActive = isOrigin || isDest;

                    // Visual state
                    let fillColor = THEME.nodeInactive;
                    let strokeColor = '#333';
                    let radius = THEME.nodeRadius;
                    let textColor = THEME.textDefault;
                    let fontWeight = 'normal';

                    if (isOrigin) {
                        fillColor = THEME.nodeOrigin;
                        strokeColor = '#fff';
                        radius = THEME.nodeActiveRadius;
                        textColor = THEME.nodeOrigin;
                        fontWeight = 'bold';
                    } else if (isDest) {
                        fillColor = THEME.nodeDest;
                        strokeColor = '#fff';
                        radius = THEME.nodeActiveRadius;
                        textColor = THEME.nodeDest;
                        fontWeight = 'bold';
                    }

                    return (
                        <g
                            key={node.id}
                            onClick={() => onSelectNode?.(node.id)}
                            className="cursor-pointer transition-all duration-300 hover:opacity-80"
                        >
                            {/* Invisible hitbox for easier clicking */}
                            <circle cx={node.x} cy={node.y} r={20} fill="transparent" />

                            {/* Visible node */}
                            <circle
                                cx={node.x} cy={node.y}
                                r={radius}
                                fill={fillColor}
                                stroke={strokeColor}
                                strokeWidth={isActive ? 2 : 1}
                                filter={isActive ? 'url(#glow)' : ''}
                            />

                            {/* Station label */}
                            <text
                                x={node.x}
                                y={node.y + 25}
                                textAnchor="middle"
                                fill={textColor}
                                fontSize="11"
                                fontFamily="monospace"
                                fontWeight={fontWeight}
                                className="pointer-events-none"
                            >
                                {node.name}
                            </text>

                            {/* "YOU" indicator for origin */}
                            {isOrigin && (
                                <text
                                    x={node.x}
                                    y={node.y - 18}
                                    textAnchor="middle"
                                    fill={THEME.nodeOrigin}
                                    fontSize="9"
                                    fontFamily="monospace"
                                    fontWeight="bold"
                                    className="pointer-events-none"
                                >
                                    YOU
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* LAYER 3: TRAVEL ANIMATION TOKEN */}
                {isTraveling && motionPath && (
                    <circle
                        r="8"
                        fill="#fff"
                        stroke="#D4AF37"
                        strokeWidth="4"
                        className="train-token"
                        filter="url(#glow)"
                    />
                )}
            </svg>

            {/* C. VIGNETTE OVERLAY */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
    );
};
