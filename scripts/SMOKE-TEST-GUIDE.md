# Eventy Frontend Smoke Test - Complete Guide

## Overview

The frontend smoke test script (`frontend-smoke-test.sh`) provides comprehensive automated testing of the Eventy Next.js frontend. It validates the complete deployment pipeline from build through production.

## What Gets Tested

### 1. Build Phase (npm run build)
Verifies that the Next.js production build completes successfully. This includes:
- TypeScript compilation
- Static generation of pages
- Bundle optimization
- Asset processing

### 2. Server Startup
Tests that the production server starts correctly and becomes responsive to HTTP requests.

### 3. Public Routes (15 total tests)
All customer-facing pages return HTTP 200:
- Homepage (`/`)
- Trips listing (`/voyages`)
- Help and info pages (FAQ, About, Blog, How it Works, Partners, Legal pages)
- Authentication pages (Login, Signup)
- Static assets (sitemap, robots, manifest)

### 4. Protected Routes (4 tests)
Verifies authentication is properly enforced:
- `/admin` → 307 redirect to `/connexion`
- `/pro` → 307 redirect to `/connexion`
- `/client` → 307 redirect to `/connexion`
- `/checkout/start` → 307 redirect to `/connexion`

### 5. API Health Check
Tests the health endpoint if available.

## Installation

The script is already created at:
```
/sessions/beautiful-sleepy-edison/mnt/eventisite/scripts/frontend-smoke-test.sh
```

No installation needed - it's ready to use.

## Usage

### Quick Start
```bash
cd /sessions/beautiful-sleepy-edison/mnt/eventisite
./scripts/frontend-smoke-test.sh
```

### With Custom Port
```bash
SERVER_PORT=3001 ./scripts/frontend-smoke-test.sh
```

### In Docker
```bash
docker run --rm -v $(pwd):/app -w /app/frontend \
  node:18 bash /app/scripts/frontend-smoke-test.sh
```

### In CI/CD Pipeline
```yaml
# Example GitHub Actions
- name: Run Frontend Smoke Tests
  run: bash ./scripts/frontend-smoke-test.sh
```

## Output and Logging

### Console Output
The script provides color-coded output:
- `[INFO]` - Blue informational messages
- `[PASS]` - Green successful tests
- `[FAIL]` - Red failed tests

### Log Files
Generated during test execution:
- `/tmp/frontend-build.log` - Build output
- `/tmp/frontend-server.log` - Server runtime logs

### Summary Report
After all tests complete:
```
╔════════════════════════════════════════════════════════════════╗
║ TEST SUMMARY
╚════════════════════════════════════════════════════════════════╝

Total Tests:  25
Passed:       ✓ 25
Failed:       ✗ 0

✓ All tests passed!
```

## Exit Codes

- `0` - All tests passed (success)
- `1` - One or more tests failed (failure)

Use in scripts/CI:
```bash
./scripts/frontend-smoke-test.sh
if [ $? -eq 0 ]; then
  echo "Frontend is ready for deployment"
else
  echo "Frontend tests failed - fix before deploying"
  exit 1
fi
```

## Troubleshooting

### Test Fails: "npm run build"
**Issue**: Build failed to complete

**Solutions**:
1. Check `/tmp/frontend-build.log` for build errors
2. Verify dependencies: `npm install`
3. Check Node.js version compatibility
4. Review `frontend/tsconfig.json` for config issues
5. Check for missing environment variables in `.env.local`

### Test Fails: Server doesn't start
**Issue**: Server startup timeout after 30 seconds

**Solutions**:
1. Check `/tmp/frontend-server.log` for startup errors
2. Verify port 3000 is not in use: `lsof -i :3000`
3. Increase START_TIMEOUT in script if needed
4. Check system resources (disk space, memory)

### Test Fails: Public routes return 404
**Issue**: Routes exist but return HTTP 404

**Solutions**:
1. Verify pages exist: `ls -la app/(public)/*/page.tsx`
2. Check for routing configuration issues
3. Review Next.js middleware configuration
4. Check for 404 error handlers

### Test Fails: Protected routes don't redirect
**Issue**: Protected routes should return 307 redirect, but don't

**Solutions**:
1. Verify authentication middleware is active
2. Check middleware configuration in `middleware.ts`
3. Verify redirect destination in middleware
4. Check Next.js version compatibility

### Test Fails: Server hangs or is unresponsive
**Issue**: Server doesn't respond to HTTP requests

**Solutions**:
1. Check `/tmp/frontend-server.log` for errors
2. Verify database connection if needed
3. Check API dependencies
4. Increase START_TIMEOUT if system is slow

## Performance Considerations

### Timeouts
- **Build**: 300 seconds (5 minutes) - for slow systems
- **Startup**: 30 seconds - for server readiness
- **HTTP Requests**: 5 seconds per request

To increase timeouts, edit the script:
```bash
BUILD_TIMEOUT=600     # 10 minutes
START_TIMEOUT=60      # 60 seconds
REQUEST_TIMEOUT=10    # 10 seconds
```

### Disk Space
The script generates:
- Build artifacts in `.next/` (typically 50-200 MB)
- Build log at `/tmp/frontend-build.log` (1-10 MB)
- Server log at `/tmp/frontend-server.log` (1-5 MB)

### Memory
Requires approximately:
- 500 MB for Node.js process
- 200 MB for build artifacts
- 100 MB for testing overhead

Total: ~800 MB minimum

## Integration

### Pre-Deployment
Run before every production deployment:
```bash
# In deploy script
./scripts/frontend-smoke-test.sh || {
  echo "Smoke tests failed - aborting deployment"
  exit 1
}
```

### Post-Deployment
Verify production deployment:
```bash
SERVER_PORT=3000 ./scripts/frontend-smoke-test.sh
```

### Monitoring
Add to cron for periodic checks:
```bash
0 */4 * * * cd /app && ./scripts/frontend-smoke-test.sh >> /var/log/frontend-smoke-test.log 2>&1
```

## Advanced Configuration

### Environment Variables
```bash
SERVER_PORT=8080 ./scripts/frontend-smoke-test.sh
```

### Custom Timeouts
Edit the script variables:
```bash
BUILD_TIMEOUT=600
START_TIMEOUT=60
REQUEST_TIMEOUT=10
```

### Debugging
Enable bash debug mode:
```bash
bash -x ./scripts/frontend-smoke-test.sh
```

## Script Architecture

### Main Components

**Logging Functions**
- `log_info()` - Information messages
- `log_success()` - Test passed (increments counter)
- `log_error()` - Test failed (increments counter)
- `log_header()` - Section header with visual border

**Test Functions**
- `test_url()` - HTTP request + status validation
- `wait_for_server()` - Server readiness polling

**Utilities**
- `cleanup()` - Server shutdown (trap on EXIT)
- `main()` - Test orchestration

### Test Flow
```
main()
  ├── Phase 1: Build Check
  │   ├── Verify package.json
  │   └── npm run build
  ├── Phase 2: Server Startup
  │   ├── npm start (background)
  │   └── wait_for_server()
  ├── Phase 3: Public Routes
  │   ├── test_url() × 10
  ├── Phase 4: Static Assets
  │   ├── test_url() × 3
  ├── Phase 5: Auth Routes
  │   ├── test_url() × 2
  ├── Phase 6: Protected Routes
  │   ├── test_url() × 4
  ├── Phase 7: Health Check
  │   ├── test_url() × 1
  └── Summary
      ├── Print counters
      └── Exit with code 0 or 1
```

## Example Integration

### GitHub Actions Workflow
```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
        working-directory: ./frontend
      
      - name: Run smoke tests
        run: bash ./scripts/frontend-smoke-test.sh
        working-directory: ./
```

### GitLab CI
```yaml
smoke_test:
  image: node:18
  script:
    - cd frontend && npm install
    - cd .. && bash ./scripts/frontend-smoke-test.sh
  artifacts:
    logs:
      - /tmp/frontend-build.log
      - /tmp/frontend-server.log
```

## Related Documentation

- `FRONTEND-SMOKE-TEST-README.md` - Quick reference
- `../../frontend/ARCHITECTURE_OVERVIEW.md` - Frontend architecture
- `../../PROGRESS.md` - Project progress tracking

## Support

For issues:
1. Review the Troubleshooting section above
2. Check log files (`/tmp/frontend-*.log`)
3. Run with `bash -x` for detailed debugging
4. Review ARCHITECTURE_OVERVIEW.md for routing details

