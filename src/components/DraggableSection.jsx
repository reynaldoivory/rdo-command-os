// FILE: src/components/DraggableSection.jsx
// ═══════════════════════════════════════════════════════════════════════════
// DRAGGABLE SECTION WRAPPER
// Enables drag-to-reorder for dashboard components
// Uses native HTML5 drag & drop for zero dependencies
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

// Human-readable labels for each section ID
const SECTION_LABELS = {
    mission: 'MISSION CONTROL',
    command: 'COMMAND CENTER',
    wallet: 'WALLET',
    roles: 'ROLES',
    travel: 'TRAVEL',
    timer: 'TIMER',
    dailies: 'DAILIES',
    almanac: 'ALMANAC',
    wardrobe: 'WARDROBE',
    specials: 'SPECIALS',
    search: 'SEARCH',
    efficiency: 'EFFICIENCY',
    hunting: 'HUNTING',
    compendium: 'COMPENDIUM',
    cart: 'CART',
    filters: 'FILTERS',
    catalog: 'CATALOG'
};

/**
 * DraggableSection - Wraps a component to make it reorderable
 * @param {string} id - Unique section identifier
 * @param {string} column - Which column this section is in ('left' or 'right')
 * @param {number} index - Current position in list
 * @param {number} total - Total items in list
 * @param {function} onMove - Callback(fromColumn, fromIndex, toColumn, toIndex)
 * @param {boolean} editMode - Whether drag handles are visible
 * @param {React.ReactNode} children - Section content
 */
export const DraggableSection = ({
    id,
    column,
    index,
    total,
    onMove,
    editMode = false,
    children
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ id, column, index }));
        e.dataTransfer.effectAllowed = 'move';
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            // Support cross-column drops
            if (data.column !== column || data.index !== index) {
                onMove(data.column, data.index, column, index);
            }
        } catch {
            // Invalid drag data
        }
    };

    const moveUp = () => {
        if (index > 0) onMove(column, index, column, index - 1);
    };

    const moveDown = () => {
        if (index < total - 1) onMove(column, index, column, index + 1);
    };

    return (
        <div
            draggable={editMode}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={editMode ? handleDragOver : undefined}
            onDragLeave={handleDragLeave}
            onDrop={editMode ? handleDrop : undefined}
            className={`relative transition-all duration-200 ${isDragging ? 'opacity-50 scale-[0.98]' : ''
                } ${isDragOver ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#050505]' : ''
                }`}
        >
            {/* Drag Handle - Only visible in edit mode */}
            {editMode && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={moveUp}
                        disabled={index === 0}
                        className="p-1 bg-[#1a1a1a] rounded hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronUp size={12} className="text-gray-400" />
                    </button>
                    <div
                        className="p-1 bg-[#1a1a1a] rounded cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                    >
                        <GripVertical size={12} className="text-[#D4AF37]" />
                    </div>
                    <button
                        onClick={moveDown}
                        disabled={index === total - 1}
                        className="p-1 bg-[#1a1a1a] rounded hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronDown size={12} className="text-gray-400" />
                    </button>
                </div>
            )}

            {/* Edit Mode Label Badge */}
            {editMode && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold tracking-wider rounded shadow-lg">
                        {SECTION_LABELS[id] || id.toUpperCase()}
                    </div>
                </div>
            )}

            {children}
        </div>
    );
};

/**
 * LayoutEditToggle - Button to toggle edit mode
 */
export const LayoutEditToggle = ({ isEditing, onToggle, onReset }) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onToggle}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isEditing
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/10'
                    }`}
            >
                {isEditing ? '✓ Done' : '⚙ Edit Layout'}
            </button>
            {isEditing && (
                <button
                    onClick={onReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-500/30"
                >
                    Reset
                </button>
            )}
        </div>
    );
};
