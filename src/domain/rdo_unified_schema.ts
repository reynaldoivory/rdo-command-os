/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RDO UNIFIED SCHEMA - THE KNOWLEDGE LAYER CONTRACT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines all types for the RDO knowledge layer (compendium).
 * Every piece of static game data must conform to these shapes.
 * 
 * Key principle: VersionedValue<T> wraps all domain data with confidence,
 * sources, and verification dates. This enables crowd-sourced truth-seeking
 * while maintaining data integrity.
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIDENCE & SOURCE TRACKING
// ═══════════════════════════════════════════════════════════════════════════

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type DataSource = 
  | 'GAME_TEST'           // Verified in-game by trusted tester
  | 'REDDIT'              // Reddit discussion thread
  | 'WIKI'                // Red Dead Wiki
  | 'YOUTUBE'             // YouTube guide / testing video
  | 'JEANROPKE_MAP'       // Jeanropke RDO map data
  | 'FRONTIER_ALGORITHM'  // Our original analysis
  | 'COMMUNITY_TESTED'    // Community consensus from multiple sources
  | 'CALCULATED';         // Derived from other verified values

export interface SourceRef {
  type: DataSource;
  date: string;           // ISO 8601: "2025-12-03"
  url?: string;
  verified_by?: string;   // Username or reference
  notes?: string;
}

/**
 * Wraps any numeric or structured value with metadata.
 * This enables filtering by confidence and tracking data provenance.
 * 
 * @example
 * const bounty_cash: VersionedValue<number> = {
 *   value: 30,
 *   confidence: 'HIGH',
 *   sources: [{ type: 'GAME_TEST', date: '2025-11-20', verified_by: 'TestPlayer' }],
 *   last_verified: '2025-11-20',
 *   patch_version: '1.40'
 * }
 */
export interface VersionedValue<T> {
  value: T;
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;          // ISO 8601
  patch_version?: string;         // Last RDO patch this was verified on
  deprecation_warning?: string;   // If this value is no longer accurate
}

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMIC FORMULAS
// ═══════════════════════════════════════════════════════════════════════════

export type EconomicSystem = 
  | 'bounty_hunter'
  | 'trader'
  | 'moonshiner'
  | 'collector'
  | 'naturalist'
  | 'fast_travel'
  | 'catalog';

export interface FormulaVariable {
  name: string;
  type: 'number' | 'string' | 'boolean';
  description: string;
  allowed_values?: (string | number)[];
  examples?: (string | number)[];
}

export interface FormulaExample {
  description: string;
  input: Record<string, any>;
  expected_output: number | Record<string, any>;
  calculation_steps?: string[];
}

export interface EconomicFormula {
  id: string;                           // e.g., "bounty_payout_cash"
  system: EconomicSystem;
  name: string;                         // "Bounty Payout (Cash)"
  formula: string;                      // Symbolic: "P = B × M_tier × M_status × M_time"
  description?: string;
  variables: FormulaVariable[];
  optimal_parameters?: Record<string, any>;
  examples: FormulaExample[];
  confidence: Confidence;
  sources: SourceRef[];
  patch_version: string;
  last_verified: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CATALOG ITEMS (Weapons, Horses, Ability Cards, etc.)
// ═══════════════════════════════════════════════════════════════════════════

export type ItemCategory = 
  | 'weapon'
  | 'horse'
  | 'ability_card'
  | 'role_item'
  | 'consumable'
  | 'clothing'
  | 'saddle'
  | 'trinket';

export type ItemShop = 
  | 'gunsmith'
  | 'stable'
  | 'fence'
  | 'general_store'
  | 'tailor'
  | 'madam_nazar'
  | 'role_vendor'
  | 'catalog';

export interface ItemPrice {
  cash?: VersionedValue<number>;
  gold?: VersionedValue<number>;
  rank_required?: VersionedValue<number>;
  role_rank_required?: { role: string; rank: VersionedValue<number> };
}

export interface RDOItem {
  id: string;                           // e.g., "w_mauser_pistol"
  name: string;
  category: ItemCategory;
  shop: ItemShop;
  
  // Pricing
  price: ItemPrice;
  
  // Metadata
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  description?: string;
  type?: string;                        // "Sidearm", "Rifle", "Ability Card", etc.
  
  // Weapon/Horse specific
  stats?: Record<string, number>;       // e.g., { accuracy: 7, damage: 8, reload: 7 }
  
  // Confidence & sources
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
  patch_version: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMALS (Hunting/Naturalist)
// ═══════════════════════════════════════════════════════════════════════════

export interface Material {
  name: string;
  cash_value: VersionedValue<number>;
  yield_probability: VersionedValue<number>;    // 0.0-1.0
  perfect_quality_bonus?: VersionedValue<number>;
  hunting_method?: 'rifle' | 'shotgun' | 'sniper' | 'revolver' | 'headshot';
  knife_loot?: boolean;
}

export interface SpawnLocation {
  region: string;
  latitude: VersionedValue<number>;
  longitude: VersionedValue<number>;
  time_of_day?: ('dawn' | 'day' | 'dusk' | 'night')[];
  weather?: string[];
  frequency: 'rare' | 'uncommon' | 'common';
}

export interface Animal {
  id: string;                           // e.g., "animal_cougar"
  name: string;
  species: string;                      // "Felidae", "Cervidae", etc.
  size: 'small' | 'medium' | 'large';
  
  // Combat
  ai_rating: VersionedValue<number>;    // 1-10 difficulty
  health: VersionedValue<number>;
  stamina?: VersionedValue<number>;
  
  // Loot
  materials: Material[];
  average_profit_per_kill: VersionedValue<number>;
  average_hunt_time_minutes: VersionedValue<number>;
  
  // Location
  spawns: SpawnLocation[];
  
  // Naturalist
  can_study: boolean;
  study_sample_value?: VersionedValue<number>;
  sedative_ammo_type?: 'rifle' | 'revolver' | 'repeater';
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
  patch_version: string;
}

export interface LegendaryAnimal extends Animal {
  is_legendary: true;
  pelt_value: VersionedValue<number>;
  pelt_yields: { poor: number; good: number; perfect: number };
  unique_location: SpawnLocation;
  respawn_time_hours?: VersionedValue<number>;
}

// ═══════════════════════════════════════════════════════════════════════════
// FAST TRAVEL NETWORK
// ═══════════════════════════════════════════════════════════════════════════

export interface FastTravelNode {
  id: string;                           // e.g., "fast_travel_valentine"
  name: string;
  latitude: VersionedValue<number>;
  longitude: VersionedValue<number>;
  region: string;
  cost_cash: VersionedValue<number>;
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
}

export interface FastTravelRoute {
  id: string;
  from_node_id: string;
  to_node_id: string;
  distance_miles: VersionedValue<number>;
  travel_time_seconds: VersionedValue<number>;
  cost_cash: VersionedValue<number>;
  
  // Asymmetry flag: some routes may cost differently in reverse
  asymmetric?: boolean;
  reverse_cost_cash?: VersionedValue<number>;
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTORS & CYCLES
// ═══════════════════════════════════════════════════════════════════════════

export interface CollectorItem {
  id: string;                           // Unique per cycle
  collection_set: string;               // "tarot_cards", "coins", "flowers", etc.
  cycle: VersionedValue<number>;        // 1-3 for most sets
  name: string;
  description?: string;
  
  // Location
  latitude: VersionedValue<number>;
  longitude: VersionedValue<number>;
  region: string;
  
  // Finder method
  finder_type?: 'digging' | 'searching' | 'talking' | 'looting';
  requires_metal_detector?: boolean;
  
  // Payout
  cash_value: VersionedValue<number>;
  
  // Integration with Jeanropke map
  jeanropke_id?: string;
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
  patch_version: string;
}

export interface CollectorSet {
  id: string;                           // "tarot_cards"
  name: string;
  description?: string;
  item_count: VersionedValue<number>;
  cycle_count: VersionedValue<number>;  // How many "rotations" exist
  bonus_cash_per_set: VersionedValue<number>;
  bonus_xp_per_set?: VersionedValue<number>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLES & PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

export type RoleType = 'trader' | 'moonshiner' | 'bounty_hunter' | 'collector' | 'naturalist';

export interface RoleUnlock {
  role: RoleType;
  unlock_cost_gold: VersionedValue<number>;
  player_rank_required: VersionedValue<number>;
  description?: string;
}

export interface RankBenefit {
  rank: VersionedValue<number>;         // 1-20
  name: string;
  description?: string;
  income_multiplier?: VersionedValue<number>;
  unlocks?: string[];
}

export interface Role {
  id: RoleType;
  name: string;
  mentor_npc?: string;                  // "Cripps", "Sadie", etc.
  unlock_cost_gold: VersionedValue<number>;
  player_rank_required: VersionedValue<number>;
  max_rank: VersionedValue<number>;
  rank_benefits: RankBenefit[];
  
  // Economics
  average_income_per_hour?: VersionedValue<number>;
  optimal_session_length_hours?: VersionedValue<number>;
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOGRAPHIC REGIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface Region {
  id: string;                           // "west_elizabeth"
  name: string;
  center_latitude: VersionedValue<number>;
  center_longitude: VersionedValue<number>;
  
  // Properties
  is_pvp_safe?: boolean;
  free_roam_event_likelihood?: VersionedValue<number>;
  
  // Common animals
  dominant_animals?: string[];          // Animal IDs
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS & BONUSES
// ═══════════════════════════════════════════════════════════════════════════

export interface EconomicBonus {
  id: string;                           // "double_bounty_week_12"
  name: string;
  description?: string;
  
  // Type of bonus
  activity: EconomicSystem | 'all';
  multiplier: VersionedValue<number>;   // 1.5 = 50% bonus
  
  // Timing
  start_date: string;                   // ISO 8601
  end_date?: string;
  is_active: boolean;
  
  // Metadata
  confidence: Confidence;
  sources: SourceRef[];
  last_verified: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT: RDO COMPENDIUM
// ═══════════════════════════════════════════════════════════════════════════

export interface CompendiumMetadata {
  version: string;                      // "3.0.0"
  last_updated: string;                 // ISO 8601
  game_version: string;                 // RDO patch version: "1.40"
  maintainers?: string[];               // GitHub usernames
}

export interface DataQualitySummary {
  total_entries: number;
  high_confidence_entries: number;
  medium_confidence_entries: number;
  low_confidence_entries: number;
  last_verification_date: string;
  missing_high_priority_fields?: string[];
}

export interface RDOCompendium extends CompendiumMetadata {
  // Core data
  items: Record<string, RDOItem>;       // Indexed by ID
  animals: Record<string, Animal | LegendaryAnimal>;
  roles: Record<RoleType, Role>;
  
  // Economics
  formulas: Record<string, EconomicFormula>;
  bonuses: EconomicBonus[];
  
  // Geography
  regions: Record<string, Region>;
  fast_travel_nodes: Record<string, FastTravelNode>;
  fast_travel_routes: FastTravelRoute[];
  
  // Collectors
  collector_sets: Record<string, CollectorSet>;
  collector_items: Record<string, CollectorItem>;
  
  // Metadata
  data_quality_summary: DataQualitySummary;
}

export default RDOCompendium;
