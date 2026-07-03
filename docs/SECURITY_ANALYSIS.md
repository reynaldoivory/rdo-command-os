# Security Analysis: RDO Command OS → GTA Online Companion

**Date:** December 16, 2025  
**Context:** Architecture review for GTA Online companion app  
**Status:** Critical vulnerabilities identified, mitigation strategies provided

---

## Executive Summary

This codebase demonstrates **production-grade React architecture** with several **legitimate security concerns** that must be addressed before adapting to a GTA Online companion. The vulnerabilities are **real and exploitable** in a client-side React application.

**Risk Level:** 🟡 **MEDIUM-HIGH** (Client-side only, but data integrity and XSS risks present)

---

## 🔴 Critical Vulnerabilities Identified

### 1. PanelsRegistry Injection (CWE-79: XSS)

**Location:** `src/components/PanelsRegistry.jsx:64`  
**Code:**
```javascript
const Component = PanelsRegistry[sectionId];
if (!Component) return null;
return <Component />;
```

**Attack Vector:**
- If `sectionId` comes from user-controlled input (URL params, localStorage, profile names)
- Attacker could inject: `sectionId = "__proto__"` or `sectionId = "constructor"`
- Could potentially access prototype chain or execute arbitrary code

**Current Protection:** ⚠️ **NONE** - Static registry only, but `registerPanel()` allows runtime registration

**Mitigation:**
```javascript
// ✅ SECURE: Whitelist validation
const ALLOWED_PANELS = new Set([
  'mission', 'wallet', 'roles', 'travel', 'timer', 
  'dailies', 'almanac', 'wardrobe', 'command', 'specials',
  'search', 'efficiency', 'hunting', 'compendium', 'catalog',
  'filters', 'cart', 'analytics'
]);

const renderSection = useCallback((sectionId, column, index, total) => {
  // Validate against whitelist
  if (!ALLOWED_PANELS.has(sectionId)) {
    console.warn(`[Security] Invalid panel ID: ${sectionId}`);
    return null;
  }
  
  const Component = PanelsRegistry[sectionId];
  if (!Component || typeof Component !== 'function') {
    return null;
  }
  
  return (
    <DraggableSection key={sectionId} id={sectionId} ...>
      <React.Suspense fallback={<WidgetSkeleton />}>
        <Component />
      </React.Suspense>
    </DraggableSection>
  );
}, [moveSection, isEditingLayout]);
```

---

### 2. LocalStorage Poisoning (CWE-502: Deserialization)

**Location:** `src/App.jsx:165-170`, `src/hooks/useLayoutConfig.js:42-44`

**Attack Vector:**
```javascript
// In handleCloneProfile
const currentData = localStorage.getItem(STORAGE_KEYS.PROFILE(currentProfileId));
// ... no validation ...
localStorage.setItem(STORAGE_KEYS.PROFILE(newId), currentData);
```

**Risks:**
1. **XSS via Serialized State:** If profile data contains malicious strings that get rendered
2. **Prototype Pollution:** If JSON contains `__proto__` keys
3. **DoS via Storage Overflow:** Injecting massive strings to exhaust localStorage quota
4. **Cross-Profile Contamination:** Cloning a poisoned profile spreads the payload

**Current Protection:** ⚠️ **PARTIAL** - `usePersistentState` has try/catch but no schema validation

**Mitigation:**
```javascript
// ✅ SECURE: Schema validation before storage
import { z } from 'zod'; // Or use Joi/Yup

const ProfileSchema = z.object({
  rank: z.number().int().min(1).max(999),
  xp: z.number().min(0),
  cash: z.number().min(0).max(999999),
  gold: z.number().min(0).max(1000),
  capitale: z.number().int().min(0).max(100),
  location: z.string().max(50),
  roles: z.object({
    bountyHunter: z.number().int().min(0).max(30),
    trader: z.number().int().min(0).max(30),
    // ... etc
  })
});

function handleCloneProfile(newId) {
  // Validate profile ID
  if (!/^[a-zA-Z0-9_-]+$/.test(newId) || newId.length > 50) {
    throw new Error('Invalid profile ID');
  }
  
  const currentData = localStorage.getItem(STORAGE_KEYS.PROFILE(currentProfileId));
  if (!currentData) return;
  
  try {
    const parsed = JSON.parse(currentData);
    
    // Validate schema
    const validated = ProfileSchema.parse(parsed);
    
    // Sanitize (remove any extra keys)
    const sanitized = ProfileSchema.parse(validated);
    
    localStorage.setItem(
      STORAGE_KEYS.PROFILE(newId), 
      JSON.stringify(sanitized)
    );
  } catch (error) {
    console.error('[Security] Invalid profile data:', error);
    // Don't clone corrupted data
    return;
  }
}
```

---

### 3. Layout Config Injection (CWE-400: Resource Exhaustion)

**Location:** `src/hooks/useLayoutConfig.js:42-54`

**Attack Vector:**
```javascript
const stored = localStorage.getItem(STORAGE_KEY);
const parsed = JSON.parse(stored); // No size limit!
```

**Risks:**
1. **Array Overflow:** Injecting `left: Array(1000000).fill('mission')` causes memory exhaustion
2. **Circular References:** Malformed JSON could cause infinite loops
3. **Invalid Panel IDs:** Layout config with non-existent panel IDs causes render failures

**Current Protection:** ⚠️ **PARTIAL** - Has structure validation but no size limits

**Mitigation:**
```javascript
const MAX_SECTIONS_PER_COLUMN = 20; // Reasonable limit
const MAX_CONFIG_SIZE = 1024; // 1KB max

const [config, setConfig] = useState(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultConfig;
    
    // Size check
    if (stored.length > MAX_CONFIG_SIZE) {
      console.warn('[Security] Layout config too large, using defaults');
      return defaultConfig;
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate structure
    if (!parsed.left || !parsed.right) return defaultConfig;
    if (!Array.isArray(parsed.left) || !Array.isArray(parsed.right)) {
      return defaultConfig;
    }
    
    // Size limits
    if (parsed.left.length > MAX_SECTIONS_PER_COLUMN || 
        parsed.right.length > MAX_SECTIONS_PER_COLUMN) {
      console.warn('[Security] Too many sections, truncating');
      parsed.left = parsed.left.slice(0, MAX_SECTIONS_PER_COLUMN);
      parsed.right = parsed.right.slice(0, MAX_SECTIONS_PER_COLUMN);
    }
    
    // Validate panel IDs against whitelist
    const validLeft = parsed.left.filter(id => ALLOWED_PANELS.has(id));
    const validRight = parsed.right.filter(id => ALLOWED_PANELS.has(id));
    
    return { left: validLeft, right: validRight };
  } catch {
    return defaultConfig;
  }
});
```

---

### 4. Profile ID Injection (CWE-20: Input Validation)

**Location:** `src/App.jsx:149, 156-159`

**Attack Vector:**
```javascript
const [currentProfileId, setCurrentProfileId] = useState(() => 
  localStorage.getItem(STORAGE_KEYS.ACTIVE_SLOT) || 'Main'
);

const handleSwitchProfile = (id) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SLOT, id); // No validation!
  setCurrentProfileId(id);
};
```

**Risks:**
1. **Path Traversal:** `id = "../../../evil"` could escape storage keys
2. **Key Collision:** `id = "rdo_os_profile_Main"` could overwrite other data
3. **XSS in Key:** If profile ID is rendered in UI without escaping

**Mitigation:**
```javascript
// ✅ SECURE: Validate profile IDs
const PROFILE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_PROFILE_ID_LENGTH = 50;

function validateProfileId(id) {
  if (typeof id !== 'string') return false;
  if (id.length === 0 || id.length > MAX_PROFILE_ID_LENGTH) return false;
  if (!PROFILE_ID_PATTERN.test(id)) return false;
  // Reserved keywords
  if (['__proto__', 'constructor', 'prototype'].includes(id.toLowerCase())) {
    return false;
  }
  return true;
}

const handleSwitchProfile = (id) => {
  if (!validateProfileId(id)) {
    console.error('[Security] Invalid profile ID:', id);
    return;
  }
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SLOT, id);
  setCurrentProfileId(id);
};
```

---

### 5. Error Boundary Information Leakage (CWE-209: Information Exposure)

**Location:** `src/App.jsx:197`

**Attack Vector:**
```javascript
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

**Risks:**
- If ErrorBoundary shows stack traces or error messages in production
- Could leak file paths, component names, or internal state
- Malicious components could throw errors with sensitive data

**Mitigation:**
```javascript
// ✅ SECURE: Sanitized error boundary
class SecureErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to monitoring service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, errorInfo);
    // Don't expose details to user
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded">
          <h2 className="text-red-400 font-bold">System Error</h2>
          <p className="text-gray-400 text-sm">
            A component failed to load. Please refresh the page.
          </p>
          {/* Don't show error.message or stack trace */}
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 🟡 Medium Risk Issues

### 6. Suspense Fallback Exposure

**Current:** Generic `WidgetSkeleton` - safe ✅  
**Risk:** If LLM generates components that throw during render, fallback is safe

### 7. Global Error Logging

**Current:** Logs to console - acceptable for dev ✅  
**Risk:** In production, should use structured logging service

**Mitigation:**
```javascript
function useGlobalErrorLogging() {
  useEffect(() => {
    const handleError = (e) => {
      if (import.meta.env.PROD) {
        // Send to monitoring service (Sentry, LogRocket, etc.)
        // window.Sentry?.captureException(e.error);
      } else {
        console.error('[WindowError]', e.error || e.message);
      }
    };
    // ... rest
  }, []);
}
```

---

## ✅ Security Best Practices Already Implemented

1. **Error Boundaries** - Prevents white screen of death ✅
2. **Suspense Boundaries** - Graceful loading states ✅
3. **Storage Key Constants** - Centralized, reduces typos ✅
4. **Versioned Storage** - Migration support in `usePersistentState` ✅
5. **Try/Catch Blocks** - JSON parsing is wrapped ✅

---

## 🛡️ Recommended Security Hardening for GTA Online Companion

### 1. Content Security Policy (CSP)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

### 2. Input Sanitization Library

Install and use:
```bash
npm install dompurify zod
```

```javascript
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Sanitize any user input before rendering
const sanitized = DOMPurify.sanitize(userInput);

// Validate all data structures
const schema = z.object({ /* ... */ });
const validated = schema.parse(unsafeData);
```

### 3. Rate Limiting for Storage Operations

```javascript
// Prevent storage DoS
let lastStorageTime = 0;
const STORAGE_RATE_LIMIT_MS = 100;

function rateLimitedSetItem(key, value) {
  const now = Date.now();
  if (now - lastStorageTime < STORAGE_RATE_LIMIT_MS) {
    return; // Skip if too frequent
  }
  lastStorageTime = now;
  localStorage.setItem(key, value);
}
```

### 4. Profile Data Encryption (Optional)

For sensitive data (if storing real game credentials):
```javascript
// Use Web Crypto API for client-side encryption
async function encryptProfileData(data) {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  // ... encryption logic
}
```

---

## 📊 Risk Assessment Matrix

| Vulnerability | Severity | Exploitability | Impact | Priority |
|--------------|----------|----------------|--------|----------|
| PanelsRegistry Injection | High | Medium | XSS, Code Execution | P0 |
| LocalStorage Poisoning | High | High | Data Corruption, XSS | P0 |
| Layout Config Injection | Medium | Low | DoS | P1 |
| Profile ID Injection | Medium | Medium | Data Loss | P1 |
| Error Leakage | Low | Low | Info Disclosure | P2 |

**P0 = Fix immediately**  
**P1 = Fix before production**  
**P2 = Fix in next iteration**

---

## 🎯 GTA Online Companion Specific Considerations

### Additional Attack Surfaces

1. **Mission Data Injection:** If importing mission data from external sources
2. **Heist Calculator Input:** User-entered values in calculators
3. **Weapon/Vehicle Data:** If allowing custom entries
4. **Social Features:** If adding friend lists or sharing (future)

### Recommended Architecture Changes

1. **Strict Type Validation:** Use TypeScript or Zod schemas for all data
2. **Sandboxed Widgets:** Run user-generated widgets in iframe isolation
3. **Read-Only Mode:** Option to disable all mutations for "view-only" profiles
4. **Audit Logging:** Track all profile mutations for debugging

---

## 🔬 Testing Recommendations

### 1. Fuzzing Tests

```javascript
// Test profile ID validation
const maliciousIds = [
  '__proto__',
  'constructor',
  '../../../etc/passwd',
  '<script>alert(1)</script>',
  Array(1000).fill('a').join(''), // Too long
  null,
  undefined,
  {},
  []
];

maliciousIds.forEach(id => {
  expect(() => validateProfileId(id)).toThrow();
});
```

### 2. Storage Overflow Tests

```javascript
// Test localStorage limits
const hugeString = 'x'.repeat(10 * 1024 * 1024); // 10MB
expect(() => {
  localStorage.setItem('test', hugeString);
}).toThrow();
```

### 3. Component Injection Tests

```javascript
// Test PanelsRegistry whitelist
const maliciousPanels = ['__proto__', 'constructor', 'eval'];
maliciousPanels.forEach(panel => {
  expect(ALLOWED_PANELS.has(panel)).toBe(false);
});
```

---

## 📝 Implementation Checklist

- [ ] Add `ALLOWED_PANELS` whitelist to `PanelsRegistry.jsx`
- [ ] Implement `validateProfileId()` function
- [ ] Add schema validation to `handleCloneProfile()`
- [ ] Add size limits to `useLayoutConfig()`
- [ ] Sanitize error messages in `ErrorBoundary`
- [ ] Add CSP headers to `index.html`
- [ ] Install and configure `zod` for validation
- [ ] Add rate limiting to storage operations
- [ ] Write security tests
- [ ] Document security model in README

---

## 🎓 Academic Research Angle (If Applicable)

If this is for security research, consider:

1. **LLM Code Generation Security:** Measure how often Cursor/Claude generates vulnerable patterns
2. **Adversarial Prompt Engineering:** Test which prompts cause insecure code generation
3. **Component Injection Taxonomy:** Classify different injection attack vectors in React
4. **Client-Side Security Models:** Compare security approaches across companion apps

**Ethical Note:** If researching LLM vulnerabilities, ensure:
- Responsible disclosure to AI vendors
- No production exploitation
- Academic IRB approval if human subjects involved

---

## 📚 References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/escape-hatches)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CWE Database](https://cwe.mitre.org/)

---

**Next Steps:** Implement P0 fixes, then proceed with GTA Online companion adaptation.
