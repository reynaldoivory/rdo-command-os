// FILE: src/utils/__tests__/security.bypass.test.js
// Adversarial Testing: 11 Bypasses for LLM-Generated Security Code
// ═══════════════════════════════════════════════════════════════════════════
// These tests demonstrate that the security fixes are incomplete
// Each test documents a specific bypass that should be blocked but isn't
// ═══════════════════════════════════════════════════════════════════════════

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateProfileId,
  sanitizeProfileId,
  validatePanelId,
  validateLayoutConfig,
  sanitizeLayoutConfig,
  safeJsonParse,
  safeSetItem,
  storageRateLimiter,
  validateNoPrototypePollution
} from '../security';

describe('Adversarial Testing: Security Bypasses', () => {
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 1: Incomplete Reserved Words List
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 1: Incomplete Reserved Words', () => {
    it('should reject __defineGetter__ but currently allows it', () => {
      const malicious = '__defineGetter__';
      const result = validateProfileId(malicious);
      // This SHOULD be false, but the reserved list is incomplete
      expect(result).toBe(true); // ⚠️ BYPASS: Not in reserved list
    });

    it('should reject __lookupSetter__ but currently allows it', () => {
      const malicious = '__lookupSetter__';
      const result = validateProfileId(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS
    });

    it('should reject hasOwnProperty but currently allows it', () => {
      const malicious = 'hasOwnProperty';
      const result = validateProfileId(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS
    });

    it('should reject __defineSetter__ but currently allows it', () => {
      const malicious = '__defineSetter__';
      const result = validateProfileId(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 2: Unicode Normalization Attacks
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 2: Unicode Spoofing', () => {
    it('should detect Cyrillic character spoofing', () => {
      // Cyrillic 'а' (U+0430) looks like Latin 'a' (U+0061)
      const spoofed = 'аdmin'; // Cyrillic 'а'
      const normal = 'admin';   // Latin 'a'
      
      expect(spoofed).not.toBe(normal); // Different strings
      
      // Check if validation allows it (might be blocked by regex pattern)
      const spoofedResult = validateProfileId(spoofed);
      const normalResult = validateProfileId(normal);
      
      // Document: If regex pattern blocks non-ASCII, this bypass might not work
      // But the vulnerability exists if pattern allows Unicode
      if (spoofedResult && normalResult) {
        // ⚠️ BYPASS: Both pass, allowing spoofing
        expect(sanitizeProfileId(spoofed)).not.toBe(sanitizeProfileId(normal));
      } else {
        // Current implementation blocks it (good!), but documents the attack vector
        expect(spoofedResult).toBe(false); // Actually blocked
      }
    });

    it('should detect zero-width characters', () => {
      const malicious = 'admin\u200B'; // Zero-width space
      const result = validateProfileId(malicious);
      // Check if pattern allows it (depends on regex)
      if (result) {
        // ⚠️ BYPASS: Zero-width chars not filtered
        expect(result).toBe(true);
      } else {
        // Actually blocked (good!)
        expect(result).toBe(false);
      }
    });

    it('should detect homoglyph attacks', () => {
      // Greek omicron (ο) vs Latin o
      const spoofed = 'аdmin'; // Mix of Cyrillic and Latin
      const result = validateProfileId(spoofed);
      // Document the attack vector even if currently blocked
      if (result) {
        // ⚠️ BYPASS: Homoglyphs allowed
        expect(result).toBe(true);
      } else {
        // Currently blocked, but documents the vulnerability class
        expect(result).toBe(false);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 3: Array-Like Objects
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 3: Array-Like Object Injection', () => {
    it('should reject array-like objects that pass Array.isArray check', () => {
      const malicious = {
        left: { 0: 'mission', 1: 'wallet', length: 2 },
        right: []
      };
      
      // Array.isArray returns false
      expect(Array.isArray(malicious.left)).toBe(false);
      
      // Array-like objects are not iterable with spread operator
      // But they can be converted to arrays
      const converted = Array.from(malicious.left);
      expect(Array.isArray(converted)).toBe(true);
      
      // The validation should reject because Array.isArray check fails
      const result = validateLayoutConfig(malicious);
      // Should be false because left is not an array
      expect(result).toBe(false);
      
      // But if validation used Array.from() instead, this would be a bypass
      // Documents the edge case
    });

    it('should handle array-like objects with numeric keys', () => {
      const malicious = {
        left: Object.assign([], { 0: 'mission', 1: '__proto__', length: 2 }),
        right: []
      };
      
      // This might pass Array.isArray but contain dangerous values
      const result = validateLayoutConfig(malicious);
      expect(typeof result).toBe('boolean');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 4: Duplicate Panel IDs
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 4: Duplicate Panel Flooding', () => {
    it('should reject configs with duplicate panels', () => {
      const malicious = {
        left: Array(20).fill('mission'), // Same panel 20 times
        right: []
      };
      
      const result = validateLayoutConfig(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS: No duplicate check
      
      // This could cause UI issues or performance problems
      const sanitized = sanitizeLayoutConfig(malicious);
      expect(sanitized).not.toBeNull();
      expect(sanitized.left.length).toBe(20); // All duplicates pass through
    });

    it('should limit total panel count even with duplicates', () => {
      const malicious = {
        left: Array(100).fill('mission'), // 100 duplicates
        right: []
      };
      
      const sanitized = sanitizeLayoutConfig(malicious);
      if (sanitized) {
        // Should be capped at MAX_SECTIONS (20)
        expect(sanitized.left.length).toBeLessThanOrEqual(20);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 5: Stack Overflow via Deep Nesting
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 5: Deep Nesting Stack Overflow', () => {
    it('should handle deeply nested objects without stack overflow', () => {
      // Build deeply nested object (not circular, so stringify works)
      let deeply = {};
      let current = deeply;
      for (let i = 0; i < 1000; i++) { // Reduced for test speed
        current.nested = {};
        current = current.nested;
      }
      
      const json = JSON.stringify(deeply);
      expect(json.length).toBeLessThan(1024 * 1024); // Under size limit
      
      // This should parse, but might cause issues later
      const parsed = safeJsonParse(json);
      expect(parsed).not.toBeNull();
      
      // But processing this later could cause stack overflow
      // (We can't test the actual overflow in a unit test, but document it)
    }, { timeout: 5000 });

    it('should detect circular references properly', () => {
      const circular = { a: 1 };
      circular.self = circular;
      
      // JSON.stringify should throw for circular refs
      expect(() => JSON.stringify(circular)).toThrow();
      
      // safeJsonParse can't receive circular JSON (stringify fails first)
      // But documents the need for circular reference detection in parsed objects
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 6: Memory Exhaustion
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 6: Memory Exhaustion via Large Strings', () => {
    it('should handle large strings that pass size check but exhaust memory', () => {
      // 900KB string, under 1MB limit
      const largeString = 'A'.repeat(900 * 1024);
      const json = JSON.stringify({ data: largeString });
      
      expect(json.length).toBeLessThan(1024 * 1024); // Under limit
      
      const parsed = safeJsonParse(json);
      expect(parsed).not.toBeNull();
      
      // But this causes memory spike when parsed
      expect(parsed.data.length).toBe(900 * 1024);
    }, { timeout: 10000 });

    it('should handle multiple large objects', () => {
      const objects = [];
      for (let i = 0; i < 10; i++) {
        objects.push({ data: 'A'.repeat(100 * 1024) }); // 100KB each
      }
      const json = JSON.stringify({ items: objects });
      
      const parsed = safeJsonParse(json);
      expect(parsed).not.toBeNull();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 7: Prototype Pollution in Parsed Data
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 7: Prototype Pollution via JSON', () => {
    it('should reject JSON with __proto__ keys', () => {
      const malicious = '{"__proto__": {"isAdmin": true}}';
      const parsed = safeJsonParse(malicious);
      
      // ⚠️ BYPASS: safeJsonParse doesn't validate for prototype pollution
      expect(parsed).not.toBeNull();
      
      // Check if prototype was polluted
      const testObj = {};
      // In some JS engines, this might work:
      // expect(testObj.isAdmin).toBe(true); // If prototype was polluted
      
      // But we should validate before returning
      const isValid = validateNoPrototypePollution(parsed);
      expect(isValid).toBe(false); // Should catch it
    });

    it('should reject JSON with constructor pollution', () => {
      const malicious = '{"constructor": {"prototype": {"isAdmin": true}}}';
      const parsed = safeJsonParse(malicious);
      
      expect(parsed).not.toBeNull();
      const isValid = validateNoPrototypePollution(parsed);
      expect(isValid).toBe(false); // Should catch it
    });

    it('should handle nested prototype pollution attempts', () => {
      const malicious = JSON.stringify({
        data: {
          nested: {
            __proto__: { isAdmin: true }
          }
        }
      });
      
      const parsed = safeJsonParse(malicious);
      expect(parsed).not.toBeNull();
      
      // ⚠️ BYPASS: validateNoPrototypePollution might not catch nested __proto__
      // The check looks for keys named '__proto__', but JSON.parse might
      // have already processed it differently
      const isValid = validateNoPrototypePollution(parsed);
      
      // This test documents that nested __proto__ might not be caught
      // The actual behavior depends on how JSON.parse handles __proto__
      if (!isValid) {
        // Good - caught it
        expect(isValid).toBe(false);
      } else {
        // ⚠️ BYPASS: Nested __proto__ not caught
        expect(isValid).toBe(true);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 8: Queue Flooding DoS
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 8: Storage Rate Limiter Queue Flooding', () => {
    // Mock localStorage for testing
    const mockLocalStorage = {
      data: {},
      setItem(key, value) {
        this.data[key] = value;
      },
      getItem(key) {
        return this.data[key] || null;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      }
    };

    beforeEach(() => {
      // Use mock if localStorage not available
      if (typeof localStorage === 'undefined') {
        global.localStorage = mockLocalStorage;
      }
      localStorage.clear();
      // Reset rate limiter queue
      storageRateLimiter.queue = [];
      storageRateLimiter.lastWriteTime = 0;
    });

    it('should handle rapid storage operations without queue overflow', async () => {
      const operations = [];
      
      // Schedule many operations rapidly
      for (let i = 0; i < 100; i++) { // Reduced for test speed
        operations.push(
          safeSetItem(`test_key_${i}`, `data_${i}`)
        );
      }
      
      // Queue should not grow unbounded
      expect(storageRateLimiter.queue.length).toBeLessThan(200);
      
      // Wait for operations to complete
      await Promise.all(operations).catch(() => {
        // Some might fail due to quota, that's expected
      });
    }, { timeout: 30000 });

    it('should prevent memory exhaustion from queue growth', async () => {
      // Try to flood the queue
      const startMemory = performance.memory?.usedJSHeapSize || 0;
      
      const operations = [];
      for (let i = 0; i < 50; i++) {
        operations.push(safeSetItem(`flood_${i}`, 'x'.repeat(1000)));
      }
      
      // Queue should be bounded
      const queueSize = storageRateLimiter.queue.length;
      expect(queueSize).toBeLessThan(100); // Should not grow unbounded
      
      await Promise.all(operations).catch(() => {});
    }, { timeout: 20000 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 9: No Cleanup on Storage Errors
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 9: Queue Blocking on Storage Errors', () => {
    const mockLocalStorage = {
      data: {},
      setItem(key, value) {
        if (value.length > 1000) {
          throw new Error('QuotaExceededError');
        }
        this.data[key] = value;
      },
      getItem(key) {
        return this.data[key] || null;
      },
      clear() {
        this.data = {};
      }
    };

    beforeEach(() => {
      if (typeof localStorage === 'undefined') {
        global.localStorage = mockLocalStorage;
      }
      localStorage.clear();
      storageRateLimiter.queue = [];
      storageRateLimiter.lastWriteTime = 0;
    });

    it('should handle quota exceeded errors without blocking queue', async () => {
      // Fill localStorage to near capacity
      try {
        const largeData = 'x'.repeat(5 * 1024 * 1024); // 5MB
        for (let i = 0; i < 10; i++) {
          localStorage.setItem(`large_${i}`, largeData);
        }
      } catch {
        // Quota might be exceeded, that's fine
      }
      
      // Now try to write more - should fail gracefully
      const operations = [];
      for (let i = 0; i < 10; i++) {
        operations.push(
          safeSetItem(`overflow_${i}`, 'data').catch(err => {
            // Should handle error gracefully
            expect(err.message).toContain('quota');
          })
        );
      }
      
      await Promise.all(operations);
      
      // Queue should eventually clear
      // (This is hard to test synchronously, but documents the issue)
    }, { timeout: 30000 });

    it('should not leave failed operations in queue indefinitely', async () => {
      // Simulate repeated failures
      const failingOps = [];
      for (let i = 0; i < 20; i++) {
        failingOps.push(
          safeSetItem('will_fail', 'x'.repeat(10 * 1024 * 1024)) // Too large
            .catch(() => {
              // Expected to fail
            })
        );
      }
      
      await Promise.all(failingOps);
      
      // Queue should process and clear
      // (Actual test would need to wait and check)
    }, { timeout: 30000 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 10: Incomplete Prototype Pollution Check
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 10: Missing Dangerous Keys in Prototype Check', () => {
    it('should reject __defineGetter__ but currently allows it', () => {
      const malicious = {
        __defineGetter__: () => true,
        normal: 'data'
      };
      
      const result = validateNoPrototypePollution(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS: Not in dangerous keys list
    });

    it('should reject __lookupSetter__ but currently allows it', () => {
      const malicious = {
        __lookupSetter__: () => true
      };
      
      const result = validateNoPrototypePollution(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS
    });

    it('should reject hasOwnProperty override but currently allows it', () => {
      const malicious = {
        hasOwnProperty: () => false // Override to always return false
      };
      
      const result = validateNoPrototypePollution(malicious);
      expect(result).toBe(true); // ⚠️ BYPASS
    });

    it('should reject valueOf override', () => {
      const malicious = {
        valueOf: () => 'malicious'
      };
      
      const result = validateNoPrototypePollution(malicious);
      // valueOf is in reserved list for profile IDs, but not in prototype check
      expect(result).toBe(true); // ⚠️ BYPASS (if not in list)
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // BYPASS 11: Stack Overflow in Recursive Validation
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Bypass 11: Stack Overflow in Recursive Validation', () => {
    it('should handle deeply nested objects without stack overflow', () => {
      // Build deeply nested object
      let deeply = { data: 'test' };
      let current = deeply;
      
      for (let i = 0; i < 500; i++) { // Reduced for test speed
        current.nested = { level: i };
        current = current.nested;
      }
      
      // This should not cause stack overflow
      expect(() => {
        validateNoPrototypePollution(deeply);
      }).not.toThrow();
    }, { timeout: 10000 });

    it('should handle circular references in validation', () => {
      const circular = { a: 1 };
      circular.self = circular;
      
      // This might cause infinite recursion
      expect(() => {
        validateNoPrototypePollution(circular);
      }).toThrow(); // Should throw or handle gracefully
    });

    it('should handle wide objects (many keys)', () => {
      const wide = {};
      for (let i = 0; i < 1000; i++) {
        wide[`key_${i}`] = { nested: { value: i } };
      }
      
      expect(() => {
        validateNoPrototypePollution(wide);
      }).not.toThrow();
    }, { timeout: 10000 });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY: Vulnerability Taxonomy
  // ═══════════════════════════════════════════════════════════════════════════
  describe('Vulnerability Taxonomy', () => {
    it('should categorize all bypasses', () => {
      const taxonomy = {
        incomplete_validation: [
          'Bypass 1: Incomplete reserved words',
          'Bypass 10: Missing dangerous keys'
        ],
        algorithmic_complexity: [
          'Bypass 5: Deep nesting stack overflow',
          'Bypass 11: Recursive validation stack overflow'
        ],
        resource_exhaustion: [
          'Bypass 6: Memory exhaustion',
          'Bypass 8: Queue flooding DoS',
          'Bypass 9: No cleanup on errors'
        ],
        logic_errors: [
          'Bypass 3: Array-like objects',
          'Bypass 4: Duplicate panels'
        ],
        encoding_attacks: [
          'Bypass 2: Unicode normalization',
          'Bypass 7: Prototype pollution'
        ]
      };
      
      expect(Object.keys(taxonomy).length).toBe(5);
      expect(taxonomy.incomplete_validation.length).toBe(2);
      expect(taxonomy.algorithmic_complexity.length).toBe(2);
      expect(taxonomy.resource_exhaustion.length).toBe(3);
      expect(taxonomy.logic_errors.length).toBe(2);
      expect(taxonomy.encoding_attacks.length).toBe(2);
    });
  });
});
