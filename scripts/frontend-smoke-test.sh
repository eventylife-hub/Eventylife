#!/bin/bash

################################################################################
# Eventy Frontend Smoke Test Script
# Comprehensive test suite for Next.js frontend
# Tests build, server startup, public routes, protected routes, and health
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_PASSED=0
TESTS_FAILED=0
TEST_TOTAL=0

# Configuration
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_PORT=${SERVER_PORT:-3000}
SERVER_URL="http://localhost:${SERVER_PORT}"
BUILD_TIMEOUT=300 # 5 minutes
START_TIMEOUT=30  # 30 seconds
REQUEST_TIMEOUT=5 # 5 seconds
SERVER_PID=""

################################################################################
# Utility Functions
################################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[PASS]${NC} $1"
  ((TESTS_PASSED++))
}

log_error() {
  echo -e "${RED}[FAIL]${NC} $1"
  ((TESTS_FAILED++))
}

log_header() {
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║${NC} $1"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

# Cleanup on exit
cleanup() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    log_info "Killing Next.js server (PID: $SERVER_PID)..."
    kill "$SERVER_PID" 2>/dev/null || true
    sleep 2
    kill -9 "$SERVER_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

# Wait for server to be ready
wait_for_server() {
  local elapsed=0
  log_info "Waiting for server to be ready on $SERVER_URL..."
  
  while [ $elapsed -lt $START_TIMEOUT ]; do
    if curl -s -m "$REQUEST_TIMEOUT" "$SERVER_URL/" > /dev/null 2>&1; then
      log_success "Server is ready!"
      return 0
    fi
    sleep 1
    ((elapsed++))
  done
  
  log_error "Server failed to start within ${START_TIMEOUT}s"
  return 1
}

# Test a single URL
test_url() {
  local url="$1"
  local expected_status="$2"
  local description="$3"
  
  ((TEST_TOTAL++))
  
  local response
  local http_code
  
  response=$(curl -s -w "\n%{http_code}" -m "$REQUEST_TIMEOUT" "$SERVER_URL$url" 2>/dev/null)
  http_code=$(echo "$response" | tail -n1)
  
  if [ "$http_code" = "$expected_status" ]; then
    log_success "$description → HTTP $http_code"
    return 0
  else
    log_error "$description → HTTP $http_code (expected $expected_status)"
    return 1
  fi
}

################################################################################
# Main Test Flow
################################################################################

main() {
  log_header "EVENTY FRONTEND SMOKE TEST"
  
  cd "$FRONTEND_DIR"
  log_info "Working directory: $FRONTEND_DIR"
  
  # ============================================================================
  # Phase 1: Build Check
  # ============================================================================
  
  log_header "PHASE 1: BUILD CHECK"
  
  if [ -f "package.json" ]; then
    log_success "package.json found"
    ((TEST_TOTAL++))
  else
    log_error "package.json not found"
    ((TEST_TOTAL++))
    exit 1
  fi
  
  log_info "Building Next.js application (timeout: ${BUILD_TIMEOUT}s)..."
  
  if timeout "$BUILD_TIMEOUT" npm run build > /tmp/frontend-build.log 2>&1; then
    log_success "npm run build completed successfully"
    ((TEST_TOTAL++))
  else
    log_error "npm run build failed"
    ((TEST_TOTAL++))
    echo "Build log:"
    tail -50 /tmp/frontend-build.log
    exit 1
  fi
  
  # ============================================================================
  # Phase 2: Server Startup
  # ============================================================================
  
  log_header "PHASE 2: SERVER STARTUP"
  
  log_info "Starting Next.js server on port $SERVER_PORT..."
  npm start > /tmp/frontend-server.log 2>&1 &
  SERVER_PID=$!
  log_info "Server started with PID: $SERVER_PID"
  ((TEST_TOTAL++))
  
  if wait_for_server; then
    log_success "Server startup successful"
    ((TEST_TOTAL++))
  else
    log_error "Server failed to become ready"
    ((TEST_TOTAL++))
    echo "Server log:"
    tail -50 /tmp/frontend-server.log
    exit 1
  fi
  
  # ============================================================================
  # Phase 3: Public Routes (Expected: 200 OK)
  # ============================================================================
  
  log_header "PHASE 3: PUBLIC ROUTES (200 OK)"
  
  declare -a PUBLIC_ROUTES=(
    "/"
    "/voyages"
    "/faq"
    "/contact"
    "/a-propos"
    "/blog"
    "/comment-ca-marche"
    "/partenaires"
    "/mentions-legales"
    "/cgv"
  )
  
  for route in "${PUBLIC_ROUTES[@]}"; do
    test_url "$route" "200" "GET $route"
  done
  
  # ============================================================================
  # Phase 4: Static Assets (Expected: 200 OK)
  # ============================================================================
  
  log_header "PHASE 4: STATIC ASSETS (200 OK)"
  
  declare -a STATIC_ROUTES=(
    "/sitemap.xml"
    "/robots.txt"
    "/manifest.json"
  )
  
  for route in "${STATIC_ROUTES[@]}"; do
    test_url "$route" "200" "GET $route (static asset)"
  done
  
  # ============================================================================
  # Phase 5: Authentication Routes (Expected: 200 OK)
  # ============================================================================
  
  log_header "PHASE 5: AUTHENTICATION ROUTES (200 OK)"
  
  test_url "/connexion" "200" "GET /connexion (login page)"
  test_url "/inscription" "200" "GET /inscription (signup page)"
  
  # ============================================================================
  # Phase 6: Protected Routes (Expected: 307 Redirect)
  # ============================================================================
  
  log_header "PHASE 6: PROTECTED ROUTES (307 REDIRECT TO /connexion)"
  
  declare -a PROTECTED_ROUTES=(
    "/admin"
    "/pro"
    "/client"
    "/checkout/start"
  )
  
  for route in "${PROTECTED_ROUTES[@]}"; do
    test_url "$route" "307" "GET $route (should redirect)"
  done
  
  # ============================================================================
  # Phase 7: API Health Endpoint
  # ============================================================================
  
  log_header "PHASE 7: API HEALTH ENDPOINT"
  
  # Try to test /api/health if it exists
  response=$(curl -s -w "\n%{http_code}" -m "$REQUEST_TIMEOUT" "$SERVER_URL/api/health" 2>/dev/null || echo "")
  if [ -n "$response" ]; then
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" = "200" ]; then
      log_success "GET /api/health → HTTP $http_code"
      ((TEST_TOTAL++))
    else
      log_error "GET /api/health → HTTP $http_code"
      ((TEST_TOTAL++))
    fi
  else
    log_info "Health endpoint not available (skipped)"
  fi
  
  # ============================================================================
  # Summary
  # ============================================================================
  
  log_header "TEST SUMMARY"
  
  echo "Total Tests:  $TEST_TOTAL"
  echo -e "Passed:       ${GREEN}$TESTS_PASSED${NC}"
  echo -e "Failed:       ${RED}$TESTS_FAILED${NC}"
  
  if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    return 0
  else
    echo ""
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    return 1
  fi
}

# Run main
main
exit_code=$?

# Print server logs for debugging if any test failed
if [ $exit_code -ne 0 ]; then
  log_header "SERVER LOGS (Last 50 lines)"
  tail -50 /tmp/frontend-server.log
fi

exit $exit_code
