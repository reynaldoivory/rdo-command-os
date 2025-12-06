// FILE: src/utils/migrations.js
// Migration strategies for different data types.
// Each function takes (savedData, defaultData) and returns merged data.

/**
 * Deep merge migration for profile data.
 * Ensures new fields are added while preserving user's existing values.
 * Critical for nested objects like 'roles' that may gain new keys over time.
 * 
 * @param {Object} savedData - User's data from localStorage
 * @param {Object} defaultData - Current app's default schema
 * @returns {Object} - Safely merged profile
 */
export const migrateProfile = (savedData, defaultData) => {
  // 1. Start with the NEW data structure (has all current fields)
  const cleanState = { ...defaultData };
  
  // 2. Overlay the SAVED data on top (preserves user's cash/gold/xp)
  const merged = { ...cleanState, ...savedData };

  // 3. Deep merge nested 'roles' object specifically
  // This ensures if we add 'mercenary' but user only had 'trader', the app doesn't break
  if (defaultData.roles) {
    merged.roles = {
      ...cleanState.roles,        // All NEW roles from defaultData (e.g., mercenary: 0)
      ...(savedData.roles || {})  // User's EXISTING role XP preserved (e.g., trader: 1200)
    };
  }

  // 4. Future: Deep merge 'inventory', 'settings', etc. as they're added
  // if (defaultData.inventory) {
  //   merged.inventory = { ...cleanState.inventory, ...(savedData.inventory || {}) };
  // }

  return merged;
};

/**
 * Migration for settings object (future use)
 * Example: theme, notifications, language preferences
 */
export const migrateSettings = (savedData, defaultData) => {
  return { ...defaultData, ...savedData };
};

/**
 * Migration for inventory/owned items (future use)
 * Handles arrays of owned item IDs with validation
 */
export const migrateInventory = (savedData, defaultData) => {
  // If savedData is not an array, return default
  if (!Array.isArray(savedData)) return defaultData;
  
  // Filter out any IDs that no longer exist in catalog (cleanup)
  // This would require passing CATALOG, so keep simple for now
  return savedData;
};
