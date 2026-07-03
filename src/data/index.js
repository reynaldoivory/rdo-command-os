// =========================================================================
// DATA MODULE INDEX - BARREL EXPORTS
// Consolidated data structure - Last updated: 2025-01-11
// =========================================================================

// Geography & Fast Travel
export {
  FAST_TRAVEL_LOCATIONS,
} from './geography';

export {
  FAST_TRAVEL_PRICES,
  FAST_TRAVEL_PROMO,
  calcDistance,
  calcFastTravelCost,
  generateFastTravelMatrix,
  getCurrentFastTravelCost,
} from './fastTravel';

// Bonuses, Events, and Collections
export {
  XP_BONUSES,
  COLLECTOR_SETS,
  COLLECTOR_TOTAL_VALUE,
  ROLE_PAYOUTS,
  RDO_UPDATE_INFO,
} from './bonuses';

// Progression Tables and Role Data
export {
  RANK_XP_TABLE,
  ROLE_XP_TABLE,
  ROLES,
  PROGRESSION_WEIGHTS,
  HUNTING_VALUES,
  getLevelFromXP,
  getXPProgress,
} from './progression';

// Catalog Items
export {
  CATALOG,
  getCatalogByType,
  getCatalogByCategory,
  getCatalogByPriority,
  getEssentialItems,
  getCatalogByRole,
  getAffordableItems,
  calculateCartTotal,
  getCategoriesForType,
} from './catalog';

// UI Configuration
export {
  UI_CONFIG,
} from './ui-config';

// Schemas and Validators
export {
  SCHEMA_VERSION,
  CATEGORY,
  SUBCATEGORY,
  SUBCATEGORY_KEYWORDS,
  defaultWardrobeItem,
  defaultCoreItem,
  normalizePrice,
  clampVariants,
  detectSubCategory,
  generateItemId,
  calculateCompletionCost,
  validateWardrobeItem,
} from './schemas';

// Visual Topology (Metro Map)
export {
  NODES,
  LINKS,
  THEME,
  TIMING,
} from './topology';

// Encyclopedia (Legendary Animals, Events, Timers)
export {
  SPECIES_COOLDOWN_HOURS,
  MOONSHINE_BATCH_MINUTES,
  TRADER_COOLDOWN_MINUTES,
  LEGENDARY_ANIMALS,
  FREE_ROAM_EVENTS,
  RESET_TIMES,
  getUniqueSpecies,
  groupBySpecies,
  getTimeUntilDailyReset,
  getTimeUntilWeeklyReset,
  formatCountdown,
} from './encyclopedia';
