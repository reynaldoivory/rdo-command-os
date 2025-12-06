// =========================================================================
// DATA MODULE INDEX - BARREL EXPORTS
// =========================================================================

// Fast Travel System
export {
  FAST_TRAVEL_LOCATIONS,
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
} from './catalog-items';
