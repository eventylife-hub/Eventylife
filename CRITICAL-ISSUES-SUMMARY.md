# Critical Frontend Issues - Action Required

**Scan Date:** March 12, 2026  
**Status:** 3 CRITICAL, 5 HIGH, 4 MEDIUM issues found

---

## CRITICAL - FIX BEFORE PRODUCTION

### 1. Hardcoded Localhost Fallbacks
**Risk Level:** CRITICAL - Service Failure  
**Files to Fix:**
- `lib/config.ts:12` - API_URL_SERVER fallback
- `lib/constants.ts:250` - BASE_URL fallback  
- `lib/api.ts:54` - baseUrl fallback
- `hooks/use-notifications-websocket.ts:25` - WebSocket fallback

**Action:** Remove `|| 'http://localhost:4000/api'` fallbacks. Add startup validation to error if env not set.

---

### 2. XSS Risk in Blog Content
**Risk Level:** CRITICAL - Security  
**File:** `app/(public)/blog/[slug]/page.tsx:234`  
**Code:** `dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}`

**Issue:** Uses custom `escapeHtml()` (lines 137-143) without DOMPurify library. Vulnerable if data source changes.

**Action:** Either:
- Add DOMPurify: `npm install dompurify` and use `DOMPurify.sanitize()`
- Document that article.content is pre-sanitized on backend
- Add unit test for escapeHtml edge cases

---

### 3. Missing Production Configuration
**Risk Level:** CRITICAL - Deployment Failure  
**Issue:** No verification that required env vars are set at startup

**Action:** Create `lib/validate-env.ts`:
```typescript
export function validateEnv() {
  const required = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_STRIPE_PUBLIC_KEY'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}
```

Call in `app/layout.tsx` during app initialization.

---

## HIGH PRIORITY - Fix This Week

### 4. Unsafe Array Access (Runtime Crashes)
**Files:**
- `app/(admin)/admin/rooming/page.tsx:91` - `data.trips[0].id`
- `app/(pro)/pro/vendre/page.tsx:81` - `tripsData[0].id`

**Action:** Add checks:
```typescript
// Before:
setSelectedTrip(data.trips[0].id)

// After:
if (data?.trips?.length > 0) {
  setSelectedTrip(data.trips[0].id)
}
```

### 5. TODO Comments in Live Code
**Files:**
- `components/newsletter-cta.tsx:46` - Newsletter API not connected
- `lib/demo-data.ts:8` - Demo data file present

**Action:** Either complete these features or remove from production build. Gate behind `process.env.NEXT_PUBLIC_DEMO_MODE`.

---

## MEDIUM PRIORITY - Fix in Next Sprint

### 6. Sentry Not Guarded
**Files:** `app/error.tsx`, `components/error-boundary/SentryErrorBoundary.tsx`

**Action:** Wrap calls:
```typescript
if (typeof window !== 'undefined' && Sentry) {
  Sentry.captureException(error)
}
```

### 7. Silent Promise Failures
**Files:** Multiple `.catch(() => null)` patterns without logging

**Action:** Replace with proper error logging:
```typescript
.catch((e) => {
  logger.error('JSON parse failed:', e);
  return null;
})
```

---

## Quick Command to Find Issues

```bash
# Find localhost fallbacks
grep -rn "localhost:4000" frontend/lib/ frontend/hooks/ --include="*.ts" --include="*.tsx"

# Find unsafe array access
grep -rn "\[0\]" frontend/app/ --include="*.tsx" | grep -v "priceRange\|split" | head -20

# Find dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" frontend/ --include="*.tsx"
```

---

## Testing Checklist
- [ ] Test API call fails gracefully if NEXT_PUBLIC_API_URL not set
- [ ] Blog page loads without XSS errors
- [ ] Rooming page works with empty trips array
- [ ] Sentry errors captured in production
- [ ] All env vars documented in .env.example
