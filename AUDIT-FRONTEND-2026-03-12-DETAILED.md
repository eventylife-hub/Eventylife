EVENTY FRONTEND TECHNICAL AUDIT - March 12, 2026
================================================

METHODOLOGY:
- Scanned entire frontend codebase (914 useState/useEffect hooks, 513 try/catch blocks)
- Analyzed 62 process.env references, console logging, TypeScript strictness
- Reviewed error boundaries, accessibility, security patterns, and performance

FINDINGS BY SEVERITY:

=== CRITICAL ===

1. HARDCODED LOCALHOST FALLBACKS (Production Risk)
   Files:
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/lib/config.ts:12
     API_URL_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/lib/constants.ts:250
     BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/lib/api.ts:54
     const baseUrl = API_CONFIG.BASE_URL ?? 'http://localhost:4000/api';
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/hooks/use-notifications-websocket.ts:25
     WebSocket fallback: 'ws://localhost:4000'
   Impact: Production API calls will fail if env vars not set, exposing local URLs
   Risk: Lost revenue, service downtime, exposed backend URLs

2. XSS VULNERABILITY - dangerouslySetInnerHTML (Requires Verification)
   File: /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/(public)/blog/[slug]/page.tsx:234
   Code: dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
   Analysis: formatContent includes escapeHtml (lines 137-143), but NO sanitization library (DOMPurify)
   Risk: If formatContent is ever bypassed or data comes from untrusted source → XSS
   Note: escapeHtml is custom implementation - verify completeness

=== HIGH ===

3. ANY TYPE USAGE - Weak TypeScript
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/e2e/fixtures.ts:129,153,177 (3 occurrences)
     Any types in Playwright fixtures disable type safety
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/playwright.config.ts:38
     Any type in config
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/__tests__/components/LazySection.test.tsx:24
     Any type in test mocks
   Impact: Reduced IDE support, silent type errors, refactoring risks
   
4. TODO/FIXME COMMENTS - Missing Features
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/newsletter-cta.tsx:46
     TODO: brancher API newsletter (Brevo/Resend) - NOT CONNECTED
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/lib/demo-data.ts:8
     TODO: Supprimer ce fichier à la connexion de l'API réelle - DEMO DATA PRESENT
   Impact: Newsletter signup doesn't work, demo data may be in production

5. UNSAFE ARRAY ACCESS - No Bounds Checking
   Multiple files with patterns like:
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/(admin)/admin/rooming/page.tsx:91
     setSelectedTrip(data.trips[0].id) - No check if trips array is empty
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/(pro)/pro/vendre/page.tsx:81
     setSelectedTrip(tripsData[0].id) - No null check
   Risk: Runtime crash if API returns empty array

=== MEDIUM ===

6. MISSING SENTRY INITIALIZATION CHECK
   Files: /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/error.tsx,
           /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/error-boundary/SentryErrorBoundary.tsx
   Issue: Sentry.captureException() calls without null/initialization checks
   Impact: If NEXT_PUBLIC_SENTRY_DSN missing, errors silently fail to report

7. UNHANDLED PROMISE REJECTIONS
   Pattern in multiple files: response.json().catch(() => null)
   Files:
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/(pro)/pro/voyages/nouveau/page.tsx:148
   - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/app/(pro)/pro/voyages/[id]/edit/page.tsx:221
   Issue: JSON parsing failures silently return null without logging
   Impact: Difficult to debug API issues, hidden network errors

8. WINDOW/DOCUMENT ACCESS NOT GUARDED
   ~197 references to window/document without typeof checks in some files
   Risk: Hydration mismatches, SSR errors, unclear which are server-safe

=== LOW ===

9. LOGGING IN PRODUCTION
   File: /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/lib/logger.ts
   Issue: console.log/warn/error calls throughout (lines 29, 39, 57, 67)
   Note: logger.ts exists - verify all app code uses it and dev-only logging disabled

10. MISSING ENVIRONMENT VALIDATION
    No validation that required env vars (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_PUBLIC_KEY) are set
    Impact: Silent failures, unclear runtime errors

11. MISSING IMAGE COMPONENTS
    Regular <img> tags used instead of Next.js <Image>
    Files:
    - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/BookingCard.tsx:72
    - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/groups/member-list.tsx:66
    - /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/uploads/file-preview.tsx:56
    Impact: No auto-optimization, larger bundle, slower page loads

12. DANSEROUS JSON.STRINGIFY IN SCHEMA
    File: /sessions/trusting-adoring-faraday/mnt/eventisite/frontend/components/seo/json-ld.tsx (multiple lines)
    Pattern: dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    Note: This is safe (no untrusted data), but anti-pattern for JSON

=== POSITIVE FINDINGS ===

✓ Error boundaries properly implemented and used:
  - PortalErrorBoundary in all 3 portals (admin, client, pro)
  - Custom SentryErrorBoundary for Sentry integration
  - Portal-specific error handling

✓ Security patterns:
  - CSRF token handling implemented (getCsrfToken function)
  - credentials: 'include' for auth cookies
  - 401 auto-refresh logic in api.ts
  - escapeHtml custom implementation in blog

✓ TypeScript strictness:
  - 95% proper typing (only 5 any types in tests/config)
  - Strong type safety in API layer

✓ Accessibility:
  - No <img> tags found without alt attributes (checked all instances)
  - Good HTML semantic structure

✓ Testing:
  - 3 300+ tests passing
  - Playwright e2e tests configured
  - Jest unit tests setup

RECOMMENDATIONS - PRIORITY ORDER:

P0 (Before Production):
1. Add environment validation - warn/error if NEXT_PUBLIC_API_URL missing
2. Verify formatContent sanitization - add DOMPurify library
3. Add null checks on array[0] access patterns
4. Move demo-data.ts off system or gate behind env var

P1 (High Value):
5. Replace all <img> with Next.js Image component
6. Add Sentry initialization guard: if (Sentry) { }
7. Remove any unused process.env fallbacks (verify WebSocket URL)
8. Add env var validation on app startup

P2 (Code Quality):
9. Replace custom escapeHtml with DOMPurify for consistency
10. Replace any remaining `any` types in e2e tests with proper typing
11. Handle JSON.parse errors consistently (log errors)
12. Verify logger.ts is used everywhere, disable console in prod

DEPLOYMENT CHECKLIST ITEMS:
- [ ] All NEXT_PUBLIC_* env vars documented and in production .env
- [ ] Sentry DSN configured and tested
- [ ] Newsletter API integrated (Brevo/Resend)
- [ ] Demo data removed or gated
- [ ] Production localhost fallbacks verified removed
- [ ] WebSocket URL points to production
