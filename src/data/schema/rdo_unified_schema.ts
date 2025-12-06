/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RDO UNIFIED SCHEMA - THE CONTRACT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines all TypeScript interfaces for the RDO Simulator.
 * It acts as "The Contract" - all data must conform to these shapes.
 * When adding new systems (Naturalist, Poker, etc.), add new interfaces here first.
 */

// ═══════════════════════════════════════════════════════════════════════════
// DATA QUALITY & SOURCE TRACKING
// ═══════════════════════════════════════════════════════════════════════════

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DataSource = 'GAME_TEST' | 'REDDIT' | 'WIKI' | 'YOUTUBE' | 'COMMUNITY_TESTED' | 'CALCULATED';

export interface DataQuality {
  confidence: ConfidenceLevel;
  sources: Array<{
    type: DataSource;
    date: string;
    verified_by?: string;
    url?: string;
    notes?: string;
  }>;
  last_verified: string;
  patch_version?: string;
  deprecation_warning?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLAYER CHARACTER STATE
// ═══════════════════════════════════════════════════════════════════════════

export interface PlayerCharacter {
  character_id: string;
  rank: number;                          // 1-500
  cash: number;
  gold_bars: number;
  honor_level: number;                   // -8 to +8
  health_level: number;                  // 1-5
  stamina_level: number;                 // 1-5
  dead_eye_level: number;                // 1-5
  
  // Role Ranks (0-20 each)
  trader_rank: number;
  moonshiner_rank: number;
  bounty_hunter_rank: number;
  collector_rank: number;
  naturalist_rank: number;
  
  // Role States
  trader_goods: number;                  // 0-100
  trader_wagon_size: 'small' | 'medium' | 'large';
  moonshiner_shack_level: number;        // 1-3
  moonshiner_current_batch: 'weak' | 'average' | 'strong' | null;
  moonshiner_batch_progress: number;     // 0-100
  
  // Session State
  in_posse: boolean;
  roles_owned: string[];
  current_location: string;
  camp_location: string;
  last_update: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CATALOG ITEMS (The Master Truth)
// ═══════════════════════════════════════════════════════════════════════════

export type ItemCategory = 'weapon' | 'horse' | 'clothing' | 'consumable' | 'tool' | 'upgrade' | 'vehicle';
export type ItemShop = 'gunsmith' | 'stable' | 'tailor' | 'fence' | 'general' | 'nazar' | 'role_vendor' | 'harriet';

export interface CatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  shop: ItemShop;
  
  // Pricing (multi-currency)
  price: number;                         // Cash
  gold_cost?: number;                    // Gold bars (optional)
  tokens?: number;                       // Role tokens (optional)
  
  // Unlock Requirements
  rank_required: number;
  role?: string;                         // If role-specific
  role_rank_required?: number;
  
  // Item Details
  description: string;
  type?: string;                         // e.g., "Sidearm", "Horse Breed"
  rarity?: string;                       // Common, Uncommon, Rare, Legendary
  stats?: Record<string, number>;        // e.g., { accuracy: 8, damage: 9 }
  
  // Data Quality
  data_quality: DataQuality;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMALS & HUNTING
// ═══════════════════════════════════════════════════════════════════════════

export interface AnimalSpawn {
  region: string;
  latitude: number;
  longitude: number;
  time_of_day: 'dawn' | 'day' | 'dusk' | 'night' | 'all';
  weather: string[];                     // Clear, rainy, snowy, etc.
  frequency: 'common' | 'uncommon' | 'rare';
}

export interface AnimalMaterial {
  name: string;
  value: number;                         // Cash value
  yield_probability: number;             // 0-1
  hunting_method: 'rifle' | 'sniper' | 'shotgun' | 'pistol' | 'knife' | 'melee' | 'poison' | 'trap';
  quality_tiers: {
    poor: number;
    good: number;
    perfect: number;
  };
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'massive';
  ai_rating: number;                     // 1-10 difficulty
  health: number;
  stamina: number;
  
  // Hunting Economics
  materials: AnimalMaterial[];
  average_hunt_time: number;             // Seconds
  average_profit: number;                // Cash per hunt
  
  // Spawning
  spawns: AnimalSpawn[];
  
  // Naturalist Integration
  can_study: boolean;
  sample_value: number;                  // Gold bars from Harriet
  sedative_ammo_type: 'rifle' | 'pistol';
  
  // Data Quality
  data_quality: DataQuality;
}

export interface LegendaryAnimal extends Animal {
  is_legendary: true;
  location_fixed: { latitude: number; longitude: number };
  spawn_condition?: string;              // e.g., "After killing 3 regular Cougars"
  challenge_reward: number;              // Cash reward for killing
}

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMIC FORMULAS (The Rules)
// ═══════════════════════════════════════════════════════════════════════════

export interface EconomicFormula {
  id: string;
  name: string;
  description: string;
  formula_text: string;                  // Human-readable formula
  implementation: string;                // JavaScript function as string (or use function reference)
  variables: Record<string, string>;     // Variable descriptions
  examples: Array<{
    inputs: Record<string, number>;
    output: number;
    description: string;
  }>;
  data_quality: DataQuality;
}

// Specific Formula Interfaces (extend as needed)

export interface BountyPayoutFormula extends EconomicFormula {
  base_amount: number;
  multipliers: {
    tier: number;                        // 1.0, 1.25, 1.5 based on bounty tier
    status: number;                      // 1.0 (alive) or 0.5 (dead)
    time: number;                        // Dynamic, based on time held
    count: number;                       // 1.0, 1.67, 2.0 for multiple targets
  };
}

export interface TraderPayoutFormula extends EconomicFormula {
  materials_required: number;
  supplies_required: number;
  production_time: number;               // Seconds
  cash_per_good: number;
  supplies_bonus: number;                // Added cash from supplies
}

export interface MoonshinerPayoutFormula extends EconomicFormula {
  batch_cost: number;                    // Cash cost of mash
  production_time: number;               // Seconds
  quality_multipliers: {
    weak: number;
    average: number;
    strong: number;
  };
  batch_size: number;                    // Bottles per batch
}

export interface CollectorPayoutFormula extends EconomicFormula {
  set_completion_bonus: number;
  item_value: number;
  cycle_length: number;                  // Days before items respawn
}

// ═══════════════════════════════════════════════════════════════════════════
// GEOGRAPHIC SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

export interface FastTravelNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  location_type: 'camp' | 'town' | 'station' | 'hideout';
  region: string;
}

export interface FastTravelRoute {
  from_node: string;
  to_node: string;
  distance_miles: number;
  cost_cash: number;
  cost_gold?: number;
  travel_time: number;                   // Seconds
  is_exploit?: boolean;                  // True if (e.g., Wilderness Camp $1 exploit)
}

export interface Region {
  id: string;
  name: string;
  center_lat: number;
  center_lon: number;
  boundaries: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  dominant_animals: string[];            // Animal IDs
  fast_travel_nodes: string[];           // Node IDs
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLES & PROGRESSION
// ═══════════════════════════════════════════════════════════════════════════

export interface RoleUnlock {
  gold_cost: number;
  player_rank_required: number;
  description: string;
}

export interface RoleRankBenefit {
  rank: number;
  name: string;
  description: string;
  unlocks?: string[];                    // Item IDs or feature names
}

export interface Role {
  id: string;
  name: string;
  npc_mentor: string;
  unlock_cost: RoleUnlock;
  rank_benefits: RoleRankBenefit[];
  max_rank: number;
  description: string;
  icon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATION & AFFORDABILITY
// ═══════════════════════════════════════════════════════════════════════════

export interface SimulationAdjustments {
  cash_bonus: number;
  gold_bonus: number;
  rank_boost: number;
  time_multiplier: number;               // 1.0 = normal, 0.5 = double speed, 2.0 = half speed
}

export interface SimulationState extends PlayerCharacter {
  adjustments: SimulationAdjustments;
  projected_purchases: string[];         // Item IDs
  is_simulation_mode: boolean;
}

export interface AffordabilityResult {
  can_afford: boolean;
  reasons?: string[];
  deficit?: {
    cash?: number;
    gold?: number;
    tokens?: number;
  };
}

export interface RoleGatingResult {
  unlocked: boolean;
  missing_requirements?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTION & COLLECTORS
// ═══════════════════════════════════════════════════════════════════════════

export interface CollectorSet {
  id: string;
  name: string;
  category: string;
  items: string[];                       // Item IDs
  completion_bonus: number;
  cycle: number;                         // Which 7-day cycle (1-6)
  set_number: number;                    // For sequential displays
}

export interface CollectorCompletionStatus {
  set_id: string;
  found_items: string[];
  completion_percentage: number;
  total_earned: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMIC BONUS SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════

export interface EconomicBonus {
  id: string;
  name: string;
  description: string;
  bonus_type: 'cash_multiplier' | 'gold_multiplier' | 'role_xp' | 'activity_bonus';
  multiplier: number;
  start_date: string;
  end_date: string;
  affected_activities: string[];
  data_quality: DataQuality;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPENDIUM (The Master Collection)
// ═══════════════════════════════════════════════════════════════════════════

export interface RDOCompendium {
  version: string;
  last_updated: string;
  game_version: string;                  // RDO patch version
  
  // Core Systems
  items: Record<string, CatalogItem>;    // Indexed by ID
  animals: Record<string, Animal | LegendaryAnimal>;
  
  // Economics
  formulas: Record<string, EconomicFormula>;
  bonuses: EconomicBonus[];
  
  // Geography
  regions: Record<string, Region>;
  fast_travel_nodes: Record<string, FastTravelNode>;
  fast_travel_routes: FastTravelRoute[];
  
  // Roles & Progression
  roles: Record<string, Role>;
  
  // Collectors
  collector_sets: CollectorSet[];
  
  // Metadata
  data_quality_summary: {
    high_confidence_items: number;
    medium_confidence_items: number;
    low_confidence_items: number;
    last_verification_date: string;
  };
}
