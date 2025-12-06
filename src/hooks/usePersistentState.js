import { useState, useEffect, useCallback } from 'react';

// Configuration
const STORAGE_PREFIX = 'rdo_os_';
const CURRENT_VERSION = 1;

/**
 * Enterprise-grade persistence hook.
 * Handles serialization, version migration, and cross-tab sync.
 * 
 * @param {string} key - Unique identifier for the data
 * @param {any} initialValue - Default data if nothing is stored
 * @param {function} migrationFn - Optional function to migrate old data to new schema
 */
export function usePersistentState(key, initialValue, migrationFn = null) {
  const prefixedKey = `${STORAGE_PREFIX}${key}`;

  // 1. LAZY INITIALIZATION (Performance Optimization)
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(prefixedKey);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);

      // 2. SCHEMA VERSIONING & MIGRATION
      if (parsed._version !== CURRENT_VERSION) {
        console.warn(`[RDO OS] Migrating ${key} from v${parsed._version} to v${CURRENT_VERSION}`);
        
        const migratedData = migrationFn 
          ? migrationFn(parsed.data, initialValue) 
          : { ...initialValue, ...parsed.data };
          
        return migratedData;
      }

      return parsed.data;
    } catch (error) {
      console.error(`[RDO OS] Storage corruption for key "${key}":`, error);
      return initialValue;
    }
  });

  // 3. SETTER WRAPPER
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      
      setState(valueToStore);

      if (typeof window !== 'undefined') {
        const payload = {
          _version: CURRENT_VERSION,
          _timestamp: Date.now(),
          data: valueToStore
        };
        window.localStorage.setItem(prefixedKey, JSON.stringify(payload));
        
        // Dispatch event for cross-tab sync
        window.dispatchEvent(new Event('rdo_storage_update'));
      }
    } catch (error) {
      console.error(`[RDO OS] Failed to save state for "${key}":`, error);
    }
  }, [key, prefixedKey, state]);

  // 4. CROSS-TAB SYNCHRONIZATION
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only react to actual storage events from other tabs
      if (e.key === prefixedKey) {
        try {
          const item = window.localStorage.getItem(prefixedKey);
          if (item) {
            const parsed = JSON.parse(item);
            setState(parsed.data);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [prefixedKey]);

  return [state, setValue];
}

/**
 * Clear all RDO OS data from storage (for testing/reset)
 */
export function clearAllStorage() {
  if (typeof window === 'undefined') return;
  
  Object.keys(window.localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => window.localStorage.removeItem(key));
    
  console.log('[RDO OS] All storage cleared');
}
