// FILE: src/utils/security.js
// Security utilities for input validation and sanitization
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validates profile IDs to prevent injection attacks
 * @param {string} id - Profile identifier
 * @returns {boolean} True if valid, false otherwise
 */
export function validateProfileId(id) {
  if (typeof id !== 'string') return false;
  if (id.length === 0 || id.length > 50) return false;
  
  // Only allow alphanumeric, underscore, and hyphen
  const PROFILE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
  if (!PROFILE_ID_PATTERN.test(id)) return false;
  
  // Block prototype pollution attempts
  const reserved = ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf'];
  if (reserved.includes(id.toLowerCase())) return false;
  
  return true;
}

/**
 * Sanitizes a profile ID, returning a safe version or null
 * @param {string} id - Raw profile identifier
 * @returns {string|null} Sanitized ID or null if invalid
 */
export function sanitizeProfileId(id) {
  if (!validateProfileId(id)) return null;
  return id.trim();
}

/**
 * Whitelist of allowed panel IDs
 * Prevents component injection attacks
 */
export const ALLOWED_PANELS = new Set([
  'mission',
  'wallet',
  'roles',
  'travel',
  'timer',
  'dailies',
  'almanac',
  'wardrobe',
  'command',
  'specials',
  'search',
  'efficiency',
  'hunting',
  'compendium',
  'catalog',
  'filters',
  'cart',
  'analytics',
  'diagnostics' // Dev only, but included for completeness
]);

/**
 * Validates panel ID against whitelist
 * @param {string} panelId - Panel identifier
 * @returns {boolean} True if allowed
 */
export function validatePanelId(panelId) {
  return typeof panelId === 'string' && ALLOWED_PANELS.has(panelId);
}

/**
 * Validates layout configuration structure
 * @param {any} config - Layout config object
 * @returns {boolean} True if valid
 */
export function validateLayoutConfig(config) {
  if (!config || typeof config !== 'object') return false;
  if (!Array.isArray(config.left) || !Array.isArray(config.right)) return false;
  
  const MAX_SECTIONS = 20;
  if (config.left.length > MAX_SECTIONS || config.right.length > MAX_SECTIONS) {
    return false;
  }
  
  // Validate all panel IDs
  const allPanels = [...config.left, ...config.right];
  return allPanels.every(id => validatePanelId(id));
}

/**
 * Sanitizes layout configuration
 * @param {any} config - Raw layout config
 * @returns {object|null} Sanitized config or null if invalid
 */
export function sanitizeLayoutConfig(config) {
  if (!validateLayoutConfig(config)) return null;
  
  const MAX_SECTIONS = 20;
  return {
    left: config.left
      .filter(id => validatePanelId(id))
      .slice(0, MAX_SECTIONS),
    right: config.right
      .filter(id => validatePanelId(id))
      .slice(0, MAX_SECTIONS)
  };
}

/**
 * Validates JSON string size before parsing
 * @param {string} jsonString - JSON string to validate
 * @param {number} maxSize - Maximum size in bytes (default: 1MB)
 * @returns {boolean} True if size is acceptable
 */
export function validateJsonSize(jsonString, maxSize = 1024 * 1024) {
  if (typeof jsonString !== 'string') return false;
  return jsonString.length <= maxSize;
}

/**
 * Safe JSON parse with size and structure validation
 * @param {string} jsonString - JSON string to parse
 * @param {number} maxSize - Maximum size in bytes
 * @returns {any|null} Parsed object or null if invalid
 */
export function safeJsonParse(jsonString, maxSize = 1024 * 1024) {
  if (!validateJsonSize(jsonString, maxSize)) {
    console.warn('[Security] JSON string exceeds size limit');
    return null;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    // Check for circular references (basic check)
    JSON.stringify(parsed);
    return parsed;
  } catch (error) {
    console.warn('[Security] JSON parse failed:', error);
    return null;
  }
}

/**
 * Rate limiter for storage operations
 * Prevents DoS via rapid storage writes
 */
class StorageRateLimiter {
  constructor(intervalMs = 100) {
    this.intervalMs = intervalMs;
    this.lastWriteTime = 0;
    this.queue = [];
  }
  
  /**
   * Schedule a storage write
   * @param {Function} writeFn - Function to execute
   * @returns {Promise} Resolves when write completes
   */
  async schedule(writeFn) {
    return new Promise((resolve) => {
      this.queue.push({ writeFn, resolve });
      this.processQueue();
    });
  }
  
  async processQueue() {
    const now = Date.now();
    const timeSinceLastWrite = now - this.lastWriteTime;
    
    if (timeSinceLastWrite < this.intervalMs) {
      // Wait before next write
      setTimeout(() => this.processQueue(), this.intervalMs - timeSinceLastWrite);
      return;
    }
    
    if (this.queue.length === 0) return;
    
    const { writeFn, resolve } = this.queue.shift();
    this.lastWriteTime = Date.now();
    
    try {
      await writeFn();
      resolve();
    } catch (error) {
      console.error('[Security] Storage write failed:', error);
      resolve(); // Resolve anyway to prevent queue blocking
    }
    
    // Process next item
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }
}

// Singleton instance
export const storageRateLimiter = new StorageRateLimiter(100);

/**
 * Safe localStorage.setItem with rate limiting and validation
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @param {number} maxSize - Maximum value size in bytes
 */
export async function safeSetItem(key, value, maxSize = 1024 * 1024) {
  // Validate key
  if (typeof key !== 'string' || key.length === 0 || key.length > 100) {
    throw new Error('Invalid storage key');
  }
  
  // Validate value size
  if (typeof value !== 'string' || value.length > maxSize) {
    throw new Error('Storage value exceeds size limit');
  }
  
  // Rate-limited write
  await storageRateLimiter.schedule(() => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Handle quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.error('[Security] Storage quota exceeded');
        throw new Error('Storage quota exceeded');
      }
      throw error;
    }
  });
}

/**
 * Sanitizes error messages for user display
 * Prevents information leakage
 * @param {Error} error - Error object
 * @param {boolean} isProduction - Whether in production mode
 * @returns {string} Sanitized error message
 */
export function sanitizeErrorMessage(error, isProduction = false) {
  if (!error) return 'An unknown error occurred';
  
  if (isProduction) {
    // In production, show generic message
    return 'A system error occurred. Please refresh the page.';
  }
  
  // In development, show more details but still sanitize
  const message = error.message || String(error);
  
  // Remove file paths
  const sanitized = message
    .replace(/\/[^\s]+\.(js|jsx|ts|tsx)/g, '[file]')
    .replace(/at\s+[^\s]+\s+\([^)]+\)/g, 'at [location]')
    .substring(0, 200); // Limit length
  
  return sanitized;
}

/**
 * Validates that an object doesn't contain prototype pollution keys
 * @param {any} obj - Object to validate
 * @returns {boolean} True if safe
 */
export function validateNoPrototypePollution(obj) {
  if (obj === null || typeof obj !== 'object') return true;
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  function checkObject(o) {
    if (Array.isArray(o)) {
      return o.every(item => validateNoPrototypePollution(item));
    }
    
    if (o === null || typeof o !== 'object') return true;
    
    for (const key in o) {
      if (dangerousKeys.includes(key)) {
        return false;
      }
      if (!validateNoPrototypePollution(o[key])) {
        return false;
      }
    }
    
    return true;
  }
  
  return checkObject(obj);
}
