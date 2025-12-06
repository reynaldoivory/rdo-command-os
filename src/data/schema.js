/**
 * ==============================================================================
 * RDO UNIFIED SCHEMA v3.0
 * Complete TypeScript/JSDoc interface definitions for the entire system
 * ==============================================================================
 *
 * This schema represents the canonical data structure for:
 * - Catalog items (weapons, horses, consumables)
 * - Animals (predators, herbivores, legendary)
 * - Economic formulas (reverse-engineered from game)
 * - Geographic data (fast travel, regions, spawns)
 * - Role progression (unlock chains, prerequisites)
 * - Data quality (confidence tiers, sources, versioning)
 *
 * All interfaces include JSDoc examples for clarity.
 */

// ==============================================================================
// 1. DATA QUALITY INTERFACES
// ==============================================================================

/**
 * @typedef {Object} DataSource
 * @property {'GAME_TEST'|'REDDIT'|'WIKI'|'YOUTUBE'|'COMMUNITY_TESTED'} type
 * @property {string} date ISO 8601 date (YYYY-MM-DD)
 * @property {string} [verified_by] Player or researcher who verified
 * @property {string} [url] Link to source
 * @property {string} [notes] Additional context
 *
 * @example
 * {
 *   type: 'GAME_TEST',
 *   date: '2025-11-20',
 *   verified_by: 'Professional1994',
 *   notes: 'Confirmed in-game using multiple test runs'
 * }
 */

/**
 * @typedef {'HIGH'|'MEDIUM'|'LOW'} ConfidenceLevel
 * HIGH: Verified by multiple independent sources, in-game tested
 * MEDIUM: Verified by one source, community consensus
 * LOW: Estimated, anecdotal, awaiting confirmation
 */

/**
 * @typedef {Object} DataQuality
 * @property {ConfidenceLevel} confidence
 * @property {DataSource[]} sources
 * @property {string} last_verified ISO 8601 date when last confirmed
 * @property {string} [patch_version] RDO patch version this is valid for
 * @property {string} [deprecation_warning] If null, data is current
 *
 * @example
 * {
 *   confidence: 'HIGH',
 *   sources: [
 *     { type: 'GAME_TEST', date: '2025-11-20', verified_by: 'Professional1994' },
 *     { type: 'REDDIT', date: '2025-11-19', url: 'reddit.com/...' }
 *   ],
 *   last_verified: '2025-11-20',
 *   patch_version: '1.29.0'
 * }
 */

// ==============================================================================
// 2. CATALOG ITEM INTERFACES
// ==============================================================================

/**
 * @typedef {Object} RDOItem
 * @property {string} id Unique identifier (snake_case)
 * @property {string} name Display name
 * @property {string} [description] Detailed description
 * @property {'weapon'|'horse'|'tack'|'clothing'|'consumable'|'tool'|'upgrade'|'vehicle'} type
 * @property {'gunsmith'|'stable'|'tailor'|'fence'|'general'|'nazar'|'roles'|'harriet'} shop Which vendor sells it
 *
 * @property {number} price Cash price (0 if gold-only)
 * @property {number} gold_cost Gold bar cost (0 if cash-only)
 * @property {number} [tokens] Role tokens required (0 if not applicable)
 * @property {number} rank_required Minimum character rank to purchase
 * @property {string} [role_required] If role-gated (e.g., 'trader', 'collector')
 * @property {number} [role_rank_required] Minimum role level required
 *
 * @property {number} meta_score 1-10 ranking of usefulness
 * @property {string} meta_reason Why this item is valued
 * @property {string} [opportunity_cost] What else could you buy instead?
 * @property {Object} [hidden_stats] Non-visible game properties
 * @property {string[]} [unlocks] What this item enables
 *
 * @property {DataQuality} data_quality
 *
 * @example
 * {
 *   id: 'w_navy',
 *   name: 'Navy Revolver',
 *   type: 'weapon',
 *   shop: 'gunsmith',
 *   price: 275.00,
 *   gold_cost: 0,
 *   rank_required: 1,
 *   meta_score: 9,
 *   meta_reason: 'Highest DPS sidearm, best for PvP',
 *   opportunity_cost: 'Schofield Revolver ($192) for slower but more accurate shots',
 *   hidden_stats: {
 *     bloom_shrink_rate: 0.12,
 *     recoil_bloom: 0.08
 *   },
 *   unlocks: ['dual_wield_capability'],
 *   data_quality: { confidence: 'HIGH', sources: [...], last_verified: '2025-11-20' }
 * }
 */

/**
 * @typedef {Object} HorseData
 * @extends RDOItem
 * @property {number} speed 1-10 rating
 * @property {number} health 1-10 rating
 * @property {number} stamina 1-10 rating
 * @property {number} acceleration 1-10 rating
 * @property {string} [breed] Horse breed classification
 * @property {boolean} is_legendary True for epilogue legendary horses
 *
 * @example
 * {
 *   id: 'h_arabian_black',
 *   name: 'Black Arabian',
 *   type: 'horse',
 *   price: 0,
 *   gold_cost: 42,
 *   rank_required: 70,
 *   meta_score: 10,
 *   speed: 9,
 *   health: 9,
 *   stamina: 9,
 *   acceleration: 9,
 *   breed: 'Arabian',
 *   meta_reason: 'Elite handling + max stats, but 42 GB is prohibitive for new players'
 * }
 */

/**
 * @typedef {Object} WeaponData
 * @extends RDOItem
 * @property {'sidearm'|'longarm'|'melee'} weapon_class
 * @property {number} damage 1-100 visible rating
 * @property {number} range 1-100 visible rating
 * @property {number} accuracy 1-100 visible rating
 * @property {number} fire_rate 1-100 visible rating
 * @property {Object} hidden_stats
 * @property {number} hidden_stats.bloom_shrink_rate Affects consecutive shot accuracy
 * @property {number} hidden_stats.recoil_bloom Initial recoil spread
 * @property {number} hidden_stats.reload_frames Frames to reload (governs DPS)
 *
 * @example
 * {
 *   id: 'w_carcano',
 *   name: 'Carcano Rifle',
 *   type: 'weapon',
 *   weapon_class: 'longarm',
 *   price: 456.00,
 *   rank_required: 50,
 *   damage: 92,
 *   range: 99,
 *   accuracy: 95,
 *   fire_rate: 20,
 *   hidden_stats: {
 *     bloom_shrink_rate: 0.08,
 *     recoil_bloom: 0.05,
 *     reload_frames: 120
 *   },
 *   meta_score: 10,
 *   meta_reason: 'Meta sniper for PvP and legendary animals'
 * }
 */

// ==============================================================================
// 3. ANIMAL INTERFACES
// ==============================================================================

/**
 * @typedef {Object} AnimalSpawn
 * @property {number} latitude Map coordinate
 * @property {number} longitude Map coordinate
 * @property {string} region_id Reference to region
 * @property {number} spawn_probability 0.0-1.0 (e.g., 0.85 = 85% chance)
 * @property {string} [time_window] e.g., '10 PM - 5 AM' if time-restricted
 * @property {string} [season] 'spring'|'summer'|'fall'|'winter' if season-dependent
 * @property {string} [weather] 'rain'|'clear'|'snow' if weather-dependent
 *
 * @example
 * {
 *   latitude: -32.4,
 *   longitude: 78.2,
 *   region_id: 'west_elizabeth',
 *   spawn_probability: 0.85,
 *   season: 'any'
 * }
 */

/**
 * @typedef {Object} Animal
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {'predator'|'herbivore'|'small_game'|'legendary'} category
 * @property {string} species Scientific or common classification
 *
 * @property {Object} hunting_data
 * @property {number} hunting_data.perfect_pelt_value Cash from selling perfect pelt to butcher
 * @property {number} hunting_data.perfect_pelt_count How many parts make a perfect pelt
 * @property {number} hunting_data.material_value_base Cripps donation value (base)
 * @property {number} hunting_data.material_value_with_efficiency Cripps donation value (Rank 11 perk)
 * @property {number} hunting_data.estimated_hunt_minutes Time to find and kill
 * @property {string} hunting_data.recommended_weapon Best weapon type
 * @property {string} hunting_data.best_approach 'headshot'|'poison'|'rifle'|'other'
 *
 * @property {AnimalSpawn[]} spawn_locations
 *
 * @property {Object} naturalist_data (if legendary)
 * @property {number} naturalist_data.study_phases How many times to study
 * @property {number} naturalist_data.material_value Legendary material bomb value
 * @property {boolean} naturalist_data.requires_sedate_or_kill
 *
 * @property {DataQuality} data_quality
 *
 * @example
 * {
 *   id: 'cougar',
 *   name: 'Cougar',
 *   category: 'predator',
 *   species: 'Felis concolor',
 *   hunting_data: {
 *     perfect_pelt_value: 5.00,
 *     material_value_base: 13.50,
 *     material_value_with_efficiency: 16.88,
 *     estimated_hunt_minutes: 15,
 *     recommended_weapon: 'Rifle (Bolt Action or better)',
 *     best_approach: 'headshot'
 *   },
 *   spawn_locations: [
 *     { latitude: -32.4, longitude: 78.2, region_id: 'west_elizabeth', spawn_probability: 0.85 }
 *   ],
 *   data_quality: { confidence: 'HIGH', ... }
 * }
 */

/**
 * @typedef {Object} LegendaryAnimal
 * @extends Animal
 * @property {number} material_bomb_value Cripps donation value (e.g., 62.50)
 * @property {string} pelt_rarity 'common'|'rare'|'legendary'
 * @property {number} naturalist_study_reward XP from studying
 * @property {number} naturalist_study_phases Phases to complete study
 * @property {string} specific_spawn_condition e.g., "Only appears during specific mission" or "Random spawn"
 * @property {string} cooldown_period e.g., "48-minute cooldown after capture"
 *
 * @example
 * {
 *   id: 'golden_spirit_bear',
 *   name: 'Golden Spirit Bear',
 *   category: 'legendary',
 *   material_bomb_value: 62.50,
 *   pelt_rarity: 'legendary',
 *   naturalist_study_phases: 3,
 *   specific_spawn_condition: 'Random spawn in Big Valley/Tall Trees'
 * }
 */

// ==============================================================================
// 4. ECONOMIC FORMULA INTERFACES
// ==============================================================================

/**
 * @typedef {Object} EconomicFormula
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {string} role Which role uses this formula ('bounty_hunter', 'trader', etc.)
 * @property {string} formula Mathematical formula (e.g., "P = B × M_tier × M_status × M_time")
 * @property {Object.<string, Object>} variables Map of variable definitions
 * @property {Object[]} examples Concrete calculation examples
 * @property {number} [efficiency_rating] Profit per hour this formula generates
 * @property {DataQuality} data_quality
 *
 * @example
 * {
 *   id: 'bounty_cash_payout',
 *   name: 'Bounty Hunter Cash Payout',
 *   role: 'bounty_hunter',
 *   formula: 'P = B × M_tier × M_status × M_time × M_count',
 *   variables: {
 *     B: { description: 'Base Cash', standard_value: 30.00 },
 *     M_tier: { description: 'Tier Multiplier', values: { '1_star': 1.0, '2_star': 1.25, '3_star': 1.5 } },
 *     M_status: { description: 'Status (Alive=1.0, Dead=0.5)' },
 *     M_time: { description: 'Time-based multiplier', note: 'Increases with mission duration' },
 *     M_count: { description: 'Target count', values: { '1': 1.0, '2': 1.67, '4+': 2.0 } }
 *   },
 *   examples: [
 *     {
 *       description: '3-star bounty, alive, 12 minutes',
 *       inputs: { B: 30, tier: 1.5, status: 1.0, time: 12, count: 1 },
 *       output: 78.75,
 *       calculation_steps: [
 *         'Base: $30.00',
 *         'Tier 3: 30 × 1.5 = $45.00',
 *         'Alive bonus: 45 × 1.0 = $45.00',
 *         'Time (12 min): 45 × 1.75 = $78.75'
 *       ]
 *     }
 *   ],
 *   data_quality: { confidence: 'HIGH', ... }
 * }
 */

/**
 * @typedef {Object} GoldPayoutFunction
 * @property {number} minutes_elapsed
 * @property {number} gold_earned
 * @property {number} rate_gold_per_minute
 * @property {string} [note] Context note (e.g., "Peak efficiency point")
 *
 * @example
 * { minutes_elapsed: 12, gold_earned: 0.32, rate: 0.026, note: 'Peak efficiency (12-min meta)' }
 */

// ==============================================================================
// 5. GEOGRAPHIC INTERFACES
// ==============================================================================

/**
 * @typedef {Object} FastTravelNode
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {number} latitude Map coordinate
 * @property {number} longitude Map coordinate
 * @property {string} [region_id] Which region this node serves
 * @property {boolean} is_player_camp True if player's main camp
 * @property {boolean} is_wilderness_camp True if temporary camp
 * @property {boolean} unlockable True if requires unlock (e.g., Fast Travel Post)
 * @property {number} [unlock_cost] If unlockable
 *
 * @example
 * {
 *   id: 'valentine',
 *   name: 'Valentine',
 *   latitude: 44.5,
 *   longitude: -73.2,
 *   region_id: 'the_heartlands',
 *   is_player_camp: false,
 *   unlockable: false
 * }
 */

/**
 * @typedef {Object} FastTravelRoute
 * @property {string} origin_id From node
 * @property {string} destination_id To node
 * @property {number} distance_miles Euclidean distance
 * @property {number} cost_standard Standard fast travel cost
 * @property {number} [cost_wilderness_camp_exploit] Cost using wilderness camp trick ($1 typically)
 * @property {number} savings Difference if using exploit
 * @property {string} [note] Any special information
 *
 * @example
 * {
 *   origin_id: 'valentine',
 *   destination_id: 'annesburg',
 *   distance_miles: 145.65,
 *   cost_standard: 12.00,
 *   cost_wilderness_camp_exploit: 3.00,
 *   savings: 9.00,
 *   note: 'Capped at $12 max despite distance'
 * }
 */

/**
 * @typedef {Object} Region
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {string} biome 'forest'|'grassland'|'desert'|'swamp'|'mountains'|'urban'
 * @property {string[]} animal_ids Animals found in this region
 * @property {string[]} fast_travel_node_ids Nearby fast travel posts
 * @property {number} danger_level 1-10 (NPC encounters, bandits)
 * @property {string} optimal_for Description of best activities
 * @property {number} average_profit_per_hour Estimated income for typical hunting
 *
 * @example
 * {
 *   id: 'west_elizabeth',
 *   name: 'West Elizabeth',
 *   biome: 'forest',
 *   animal_ids: ['cougar', 'puma', 'elk', 'boar'],
 *   fast_travel_node_ids: ['valentine', 'strawberry'],
 *   danger_level: 6,
 *   optimal_for: 'Hunting (predators, top-tier pelts)',
 *   average_profit_per_hour: 187.50
 * }
 */

// ==============================================================================
// 6. ROLE & PROGRESSION INTERFACES
// ==============================================================================

/**
 * @typedef {Object} Role
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {number} unlock_rank Character rank required
 * @property {number} unlock_cost_cash Cash cost to unlock
 * @property {number} unlock_cost_gold Gold cost to unlock
 * @property {string[]} [prerequisites] Other roles required first
 * @property {number} max_rank Maximum role level
 * @property {string} description Role summary
 * @property {Object} rewards_per_rank What you get per level
 * @property {string[]} abilities Unlocked abilities
 * @property {string[]} tools Starter tools
 * @property {string} playstyle 'active'|'passive'|'hybrid'
 * @property {number} estimated_profit_per_hour Average income
 *
 * @example
 * {
 *   id: 'trader',
 *   name: 'Trader',
 *   unlock_rank: 5,
 *   unlock_cost_cash: 0,
 *   unlock_cost_gold: 15,
 *   prerequisites: [],
 *   max_rank: 20,
 *   description: 'Hunt animals and donate materials to produce and sell goods',
 *   playstyle: 'passive',
 *   estimated_profit_per_hour: 187.50
 * }
 */

/**
 * @typedef {Object} PrerequisiteChain
 * @property {string} target_item_id The item you want to unlock
 * @property {Object[]} requirements What you need
 * @property {number} total_hours_to_unlock Estimated time
 * @property {string[]} recommended_activities Activities to complete it
 *
 * @example
 * {
 *   target_item_id: 'moonshiner_license',
 *   requirements: [
 *     { type: 'character_rank', current: 5, needed: 5 },
 *     { type: 'gold', current: 5, needed: 25 },
 *     { type: 'role_unlock', role: 'trader', current: false, needed: true },
 *     { type: 'role_rank', role: 'trader', current: 0, needed: 5 }
 *   ],
 *   total_hours_to_unlock: 8,
 *   recommended_activities: ['Bounty hunts for gold', 'Collect for cash']
 * }
 */

// ==============================================================================
// 7. SIMULATION & STATS INTERFACES
// ==============================================================================

/**
 * @typedef {Object} PlayerStats
 * @property {number} rank Character level (1-100+)
 * @property {number} xp Current XP in rank
 * @property {number} xp_to_next_rank XP needed for next level
 * @property {number} cash Available RDO$
 * @property {number} gold Available Gold Bars
 * @property {number} tokens Available Role Tokens
 * @property {Object.<string, number>} role_ranks { trader: 5, collector: 10, ... }
 * @property {Object.<string, number>} role_xp { trader: 500, ... }
 * @property {string[]} owned_items Item IDs player has purchased
 * @property {number} playtime_hours Total hours played
 *
 * @example
 * {
 *   rank: 47,
 *   xp: 3279,
 *   xp_to_next_rank: 2000,
 *   cash: 1466.00,
 *   gold: 9.20,
 *   tokens: 25,
 *   role_ranks: { trader: 20, collector: 4, bounty_hunter: 7, moonshiner: 4 },
 *   owned_items: ['w_navy', 'w_bolt', 'h_mustang_buck'],
 *   playtime_hours: 250
 * }
 */

/**
 * @typedef {Object} SimulationState
 * @property {PlayerStats} base_stats Actual character stats
 * @property {Object} sim_adjustments What player is testing
 * @property {number} sim_adjustments.cash_bonus Added cash
 * @property {number} sim_adjustments.gold_bonus Added gold
 * @property {number} sim_adjustments.rank_boost Simulated ranks gained
 * @property {string[]} projected_purchases Items player is considering
 * @property {Object} projected_costs Totals for projected purchases
 * @property {boolean} is_affordable Can afford everything?
 *
 * @example
 * {
 *   base_stats: { rank: 47, cash: 1466.00, ... },
 *   sim_adjustments: { cash_bonus: 500, gold_bonus: 10 },
 *   projected_purchases: ['metal_detector', 'binoculars'],
 *   projected_costs: { cash: 1150, gold: 2 },
 *   is_affordable: true
 * }
 */

// ==============================================================================
// 8. COLLECTION INTERFACES
// ==============================================================================

/**
 * @typedef {Object} CollectorSet
 * @property {string} id Unique identifier
 * @property {string} name Display name
 * @property {number} total_items How many items in complete set
 * @property {number} completion_value Cash for selling complete set
 * @property {number} completion_xp XP for completing set
 * @property {number} cycle_count How many cycles (6 typical)
 * @property {string} [tool_required] e.g., 'metal_detector' if needed
 * @property {Object[]} locations All item locations by cycle
 * @property {DataQuality} data_quality
 *
 * @example
 * {
 *   id: 'tarot_cards',
 *   name: 'Tarot Cards',
 *   total_items: 14,
 *   completion_value: 240.50,
 *   completion_xp: 1500,
 *   cycle_count: 6,
 *   tool_required: null,
 *   locations: [
 *     { set_name: 'tarot_cards', item_id: 't1', name: 'The Fool', cycle: 1, latitude: ..., longitude: ... }
 *   ]
 * }
 */

// ==============================================================================
// SUMMARY: USAGE GUIDELINES
// ==============================================================================

/**
 * How to use these schemas:
 *
 * 1. VALIDATION:
 *    - Use JSDoc types to validate objects at runtime
 *    - Example: const item = validateItem(data) using instanceof or custom validator
 *
 * 2. REDUX STATE:
 *    - Each interface maps to a slice: catalogSlice, animalSlice, etc.
 *    - State structure mirrors schema: state.catalog.items[id], state.animals.all[id]
 *
 * 3. DATA FILES:
 *    - JSON files contain arrays of these objects
 *    - Example: /src/data/catalog/weapons.json contains WeaponData[]
 *
 * 4. SELECTORS:
 *    - Create memoized selectors to query these objects
 *    - Example: selectItemsByShop(state, shopId) returns RDOItem[]
 *
 * 5. FORMULAS:
 *    - EconomicFormula objects are documents, not code
 *    - Separate calculator functions implement the math
 *    - Example: calculateBountyCash(formula, inputs) uses formula fields
 *
 * 6. CONFIDENCE TIERS:
 *    - EVERY object has DataQuality with confidence level
 *    - Filter UI by confidence: "Show only HIGH confidence data"
 *    - Track: Last verified date, sources, warnings
 *
 * 7. GEOGRAPHIC DATA:
 *    - Coordinates are Euclidean (distance-based), not lat/long
 *    - Used for fast travel cost matrix and animal spawns
 *    - Route optimization uses TSP (Traveling Salesman Problem)
 */

export const SCHEMA_VERSION = '3.0.0';
export const SCHEMA_LAST_UPDATED = '2025-12-03';
