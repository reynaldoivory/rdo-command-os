// FILE: src/utils/nlu-engine.js
// ═══════════════════════════════════════════════════════════════════════════
// NATURAL LANGUAGE UNDERSTANDING ENGINE
// Lightweight intent classification + fuzzy entity extraction
// No LLM required - deterministic pattern matching
// ═══════════════════════════════════════════════════════════════════════════

import Fuse from 'fuse.js';

// ─────────────────────────────────────────────────────────────────────────────
// INTENT PATTERNS
// Each intent has trigger patterns (regex) and a response template
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_PATTERNS = [
    {
        intent: 'SPECIALS',
        patterns: [
            /(?:what(?:'s| is)|show|current|this week)/i,
            /(?:on sale|discounts?|bonuses?|specials?)/i,
            /(?:weekly|newswire|rockstar)/i,
            /(?:2x|3x|double|triple)/i,
        ],
        responseTemplate: () =>
            `Check the **Weekly Specials** banner at the top of the page for current bonuses, discounts, and limited-time items. This data updates automatically from Rockstar Newswire.`,
        isSpecial: true // Flag to indicate this doesn't need item lookup
    },
    {
        intent: 'ACQUISITION',
        patterns: [
            /how (?:do (?:i|you)|can i|to) (?:get|obtain|unlock|buy|acquire|find)/i,
            /where (?:do i|can i|to) (?:get|buy|find)/i,
            /(?:unlock|get|obtain|acquire) .+/i,
        ],
        responseTemplate: (item) =>
            `**${item.name}**\n${item.acquisition || `Available at ${item.shop || 'General Store'} for ${item.price > 0 ? `$${item.price}` : ''}${item.gold > 0 ? ` ${item.gold} Gold` : ''}. Requires Rank ${item.rank}.`}`
    },
    {
        intent: 'PRICE',
        patterns: [
            /(?:how much|what) (?:does|is) .+ (?:cost|price)/i,
            /(?:price|cost) (?:of|for)/i,
            /how (?:much|many) (?:gold|cash|\$|dollars)/i,
        ],
        responseTemplate: (item) =>
            `**${item.name}** costs ${item.price > 0 ? `$${item.price}` : ''}${item.price > 0 && item.gold > 0 ? ' + ' : ''}${item.gold > 0 ? `${item.gold} Gold` : ''}`
    },
    {
        intent: 'STATS',
        patterns: [
            /(?:what|how) (?:are|is) .+ (?:stats|damage|accuracy)/i,
            /(?:stats|damage|dps|accuracy) (?:of|for|on)/i,
            /is .+ (?:good|bad|worth|meta)/i,
        ],
        responseTemplate: (item) =>
            `**${item.name}**\n${item.desc}\nCategory: ${item.category || item.type} | Priority: ${item.priority}`
    },
    {
        intent: 'RANK',
        patterns: [
            /(?:what|which) rank (?:do i need|is required|for|to)/i,
            /rank (?:requirement|needed|for)/i,
            /when (?:do i|can i) unlock/i,
        ],
        responseTemplate: (item) =>
            `**${item.name}** unlocks at **Rank ${item.rank}**`
    },
    {
        intent: 'COMPARE',
        patterns: [
            /(?:compare|vs|versus|or|better)/i,
            /(?:which|what) is better/i,
            /should i (?:get|buy|use)/i,
        ],
        responseTemplate: (item) =>
            `**${item.name}**\n${item.desc}\nPrice: ${item.price > 0 ? `$${item.price}` : ''}${item.gold > 0 ? ` ${item.gold}G` : ''} | Rank ${item.rank} | ${item.priority}`
    },
    {
        intent: 'INFO',
        patterns: [
            /(?:what|tell me|info|about|describe)/i,
            /^[a-z\s]+$/i, // Fallback: just the item name
        ],
        responseTemplate: (item) =>
            `**${item.name}**\n${item.desc}\n\n💰 ${item.price > 0 ? `$${item.price}` : 'Free'}${item.gold > 0 ? ` + ${item.gold} Gold` : ''}\n🎖️ Rank ${item.rank} | 📦 ${item.type}`
    }
];

// ─────────────────────────────────────────────────────────────────────────────
// NLU ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class NLUEngine {
    constructor(catalog) {
        this.catalog = catalog;

        // Build search index with weighted fields
        this.fuse = new Fuse(catalog, {
            keys: [
                { name: 'name', weight: 0.5 },
                { name: 'aliases', weight: 0.4 },
                { name: 'category', weight: 0.1 },
            ],
            threshold: 0.4, // 0 = exact, 1 = match anything
            includeScore: true,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }

    /**
     * Classify intent from user query
     * @param {string} query - User's natural language input
     * @returns {{ intent: string, patterns: RegExp[], responseTemplate: Function }}
     */
    classifyIntent(query) {
        for (const intentDef of INTENT_PATTERNS) {
            for (const pattern of intentDef.patterns) {
                if (pattern.test(query)) {
                    return intentDef;
                }
            }
        }
        // Default fallback
        return INTENT_PATTERNS[INTENT_PATTERNS.length - 1];
    }

    /**
     * Extract entity (item name) from query
     * @param {string} query - User's natural language input
     * @returns {string} - Cleaned entity string
     */
    extractEntity(query) {
        // Remove common intent phrases to isolate the entity
        const cleaners = [
            /^(?:how|what|where|when|which|can|do|does|is|are|i|you|to|the|a|an)\s+/gi,
            /\s+(?:get|buy|find|unlock|obtain|acquire|cost|price|stats|good|bad|worth)\s*/gi,
            /[?!.,]/g,
        ];

        let entity = query;
        for (const cleaner of cleaners) {
            entity = entity.replace(cleaner, ' ');
        }

        return entity.trim().toLowerCase();
    }

    /**
     * Fuzzy search for matching items
     * @param {string} entity - Extracted entity string
     * @param {number} limit - Max results to return
     * @returns {Array} - Matched items with scores
     */
    searchItems(entity, limit = 5) {
        if (!entity || entity.length < 2) return [];

        const results = this.fuse.search(entity, { limit });
        return results.map(r => ({
            item: r.item,
            score: 1 - r.score, // Convert to confidence (higher = better)
            confidence: Math.round((1 - r.score) * 100)
        }));
    }

    /**
     * Process a complete query and return structured response
     * @param {string} query - User's natural language input
     * @returns {{ intent: string, entity: string, matches: Array, response: string }}
     */
    process(query) {
        if (!query || query.trim().length < 2) {
            return {
                intent: null,
                entity: null,
                matches: [],
                response: 'Please enter a search query (e.g., "how do I get the Navy Revolver?")'
            };
        }

        // 1. Classify intent
        const intentDef = this.classifyIntent(query);

        // 2. Extract entity
        const entity = this.extractEntity(query);

        // 3. Fuzzy search
        const matches = this.searchItems(entity);

        // 4. Generate response
        let response;
        if (matches.length === 0) {
            response = `No items found matching "${entity}". Try being more specific or check the spelling.`;
        } else if (matches[0].confidence >= 70) {
            // High confidence - return direct answer
            response = intentDef.responseTemplate(matches[0].item);
        } else {
            // Lower confidence - return suggestions
            response = `Did you mean one of these?\n${matches.slice(0, 3).map(m =>
                `• **${m.item.name}** (${m.confidence}% match)`
            ).join('\n')}`;
        }

        return {
            intent: intentDef.intent,
            entity,
            matches,
            response
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLETON FACTORY
// ─────────────────────────────────────────────────────────────────────────────

let engineInstance = null;

/**
 * Get or create the NLU engine singleton
 * @param {Array} catalog - CATALOG data from rdo-data.js
 * @returns {NLUEngine}
 */
export function getNLUEngine(catalog) {
    if (!engineInstance) {
        engineInstance = new NLUEngine(catalog);
    }
    return engineInstance;
}
