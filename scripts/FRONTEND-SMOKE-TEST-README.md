# Frontend Smoke Test Script

Comprehensive smoke test script for Eventy Next.js frontend.

## What It Tests

### Phase 1: Build Check
- Verifies `package.json` exists
- Runs `npm run build` (Next.js production build)

### Phase 2: Server Startup
- Starts the server with `npm start`
- Waits for server readiness (default port 3000)

### Phase 3: Public Routes (HTTP 200)
Tests all critical public-facing pages:
- `/` (homepage)
- `/voyages` (trips listing)
- `/faq` (FAQ)
- `/contact` (contact form)
- `/a-propos` (about)
- `/blog` (blog)
- `/comment-ca-marche` (how it works)
- `/partenaires` (partners)
- `/mentions-legales` (legal)
- `/cgv` (terms & conditions)

### Phase 4: Static Assets (HTTP 200)
- `/sitemap.xml` (sitemap)
- `/robots.txt` (robots file)
- `/manifest.json` (PWA manifest)

### Phase 5: Authentication Routes (HTTP 200)
- `/connexion` (login page)
- `/inscription` (signup page)

### Phase 6: Protected Routes (HTTP 307 Redirect)
Verifies that unauthenticated access redirects to `/connexion`:
- `/admin` (admin portal)
- `/pro` (pro portal)
- `/client` (client portal)
- `/checkout/start` (checkout)

### Phase 7: API Health
- Attempts to check `/api/health` endpoint (if available)

## Usage

### Basic Usage
```bash
./scripts/frontend-smoke-test.sh
```

### With Custom Port
```bash
SERVER_PORT=3001 ./scripts/frontend-smoke-test.sh
```

### In CI/CD Pipeline
```bash
cd /path/to/frontend
bash ../../scripts/frontend-smoke-test.sh
```

## Output

The script provides:
- Color-coded output (green for pass, red for fail)
- Per-test status messages
- Detailed summary with pass/fail counts
- Server logs on failure for debugging
- Exit code 0 on success, 1 on failure

### Example Output
```
╔════════════════════════════════════════════════════════════════╗
║ EVENTY FRONTEND SMOKE TEST
╚════════════════════════════════════════════════════════════════╝

[INFO] Working directory: /path/to/frontend
[PASS] package.json found
[INFO] Building Next.js application (timeout: 300s)...
[PASS] npm run build completed successfully
...
╔════════════════════════════════════════════════════════════════╗
║ TEST SUMMARY
╚════════════════════════════════════════════════════════════════╝

Total Tests:  25
Passed:       ✓ 25
Failed:       ✗ 0

✓ All tests passed!
```

## Configuration

Environment variables:
- `SERVER_PORT` - HTTP port for the server (default: 3000)

Timeouts (hardcoded, edit script to change):
- `BUILD_TIMEOUT` - Build timeout: 300s (5 minutes)
- `START_TIMEOUT` - Server startup timeout: 30s
- `REQUEST_TIMEOUT` - HTTP request timeout: 5s

## Debugging

If a test fails:
1. Check the colored output for which test failed and why
2. Review the server logs printed at the end
3. Check `/tmp/frontend-build.log` for build errors
4. Check `/tmp/frontend-server.log` for runtime errors

## Dependencies

- `bash` (4.0+)
- `npm` (for build and start)
- `curl` (for HTTP requests)
- `timeout` (GNU coreutils)

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed

