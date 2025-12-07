// FILE: src/components/CommandSearch.jsx
// ═══════════════════════════════════════════════════════════════════════════
// NATURAL LANGUAGE SEARCH INTERFACE
// Lightweight NLU-powered search bar for catalog queries
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, Zap, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { CATALOG } from '../data/rdo-data';
import { getNLUEngine } from '../utils/nlu-engine';

// Example queries to show users
const EXAMPLE_QUERIES = [
    'How do I get the holiday repeater?',
    'What is the best horse?',
    'Price of the metal detector',
    'Rank for Carcano rifle',
    'Tell me about Paint It Black',
];

export const CommandSearch = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const inputRef = useRef(null);

    // Initialize NLU engine with catalog
    const engine = useMemo(() => getNLUEngine(CATALOG), []);

    // Process query
    const handleSearch = useCallback(() => {
        if (!query.trim()) {
            setResult(null);
            return;
        }
        const response = engine.process(query);
        setResult(response);
        setIsExpanded(true);
    }, [query, engine]);

    // Handle enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        } else if (e.key === 'Escape') {
            setIsExpanded(false);
            setQuery('');
            setResult(null);
        }
    };

    // Auto-search on query change (debounced feel)
    useEffect(() => {
        if (query.length >= 3) {
            const timeout = setTimeout(handleSearch, 300);
            return () => clearTimeout(timeout);
        } else if (query.length === 0) {
            // Defer to avoid setState in effect warning
            setTimeout(() => {
                setResult(null);
            }, 0);
        }
    }, [query, handleSearch]);

    // Use example query
    const handleExampleClick = (example) => {
        setQuery(example);
        setShowExamples(false);
        inputRef.current?.focus();
    };

    // Clear search
    const clearSearch = () => {
        setQuery('');
        setResult(null);
        setIsExpanded(false);
        inputRef.current?.focus();
    };

    // Render markdown-lite response (bold only)
    const renderResponse = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <p key={i} className="mb-1">
                {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                })}
            </p>
        ));
    };

    return (
        <div className="relative mb-6">
            {/* Search Bar */}
            <div className={`
        bg-[#121212] border rounded-xl transition-all duration-300
        ${isExpanded ? 'border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'border-white/10 hover:border-white/20'}
      `}>
                {/* Input Row */}
                <div className="flex items-center gap-3 p-4">
                    <Sparkles size={20} className="text-[#D4AF37] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowExamples(true)}
                        onBlur={() => setTimeout(() => setShowExamples(false), 200)}
                        placeholder="Ask about any item... (e.g., 'how do I get the holiday repeater?')"
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
                    />
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button
                        onClick={handleSearch}
                        disabled={!query.trim()}
                        className={`
              px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${query.trim()
                                ? 'bg-[#D4AF37] text-black hover:bg-amber-500'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed'}
            `}
                    >
                        <Search size={16} />
                    </button>
                </div>

                {/* Example Queries Dropdown */}
                {showExamples && !result && (
                    <div className="border-t border-white/5 p-3">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <HelpCircle size={10} /> Try asking...
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_QUERIES.map((example, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleExampleClick(example)}
                                    className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Panel */}
                {result && isExpanded && (
                    <div className="border-t border-white/10 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Intent Badge */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded font-mono uppercase">
                                {result.intent}
                            </span>
                            <span className="text-[10px] text-gray-600">
                                Entity: "{result.entity}"
                            </span>
                        </div>

                        {/* Response Text */}
                        <div className="text-sm text-gray-300 leading-relaxed mb-4">
                            {renderResponse(result.response)}
                        </div>

                        {/* Matched Items */}
                        {result.matches.length > 0 && (
                            <div className="space-y-2">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                                    {result.matches.length === 1 ? 'Best Match' : 'Related Items'}
                                </div>
                                {result.matches.slice(0, 3).map((match) => (
                                    <div
                                        key={match.item.id}
                                        className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                        w-8 h-8 rounded flex items-center justify-center text-xs font-bold
                        ${match.confidence >= 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
                      `}>
                                                {match.confidence}%
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{match.item.name}</div>
                                                <div className="text-xs text-gray-500">{match.item.category} • {match.item.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-mono">
                                                {match.item.price > 0 && <span className="text-green-400">${match.item.price}</span>}
                                                {match.item.gold > 0 && <span className="text-yellow-400 ml-2">{match.item.gold}G</span>}
                                            </div>
                                            <div className="text-[10px] text-gray-600">Rank {match.item.rank}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Collapse Button */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="mt-4 text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <ChevronRight size={12} className="rotate-90" /> Collapse
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
