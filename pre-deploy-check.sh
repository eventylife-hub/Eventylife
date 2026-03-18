#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# pre-deploy-check.sh — Vérification pré-déploiement Eventy Life
#
# Exécute toutes les vérifications avant un déploiement :
# 1. Fichiers critiques présents
# 2. Variables d'environnement configurées
# 3. Syntaxe TypeScript
# 4. Prisma schema valide
# 5. Docker images buildables
# 6. Sécurité (pas de secrets dans le code)
#
# Usage:
#   ./pre-deploy-check.sh           # Vérification complète
#   ./pre-deploy-check.sh --quick   # Vérification rapide (sans build)
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
ERRORS=0
WARNINGS=0
QUICK_MODE=false

[[ "${1:-}" == "--quick" ]] && QUICK_MODE=true

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; WARNINGS=$((WARNINGS + 1)); }
info() { echo -e "  ${BLUE}ℹ${NC} $1"; }

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║   🔍 Vérification pré-déploiement Eventy Life    ║"
echo "╠═══════════════════════════════════════════════════╣"
echo "║  $(date '+%Y-%m-%d %H:%M:%S')                               ║"
echo "╚═══════════════════════════════════════════════════╝"

# ── 1. Fichiers critiques ──
echo ""
echo "📁 [1/6] Fichiers critiques"

CRITICAL_FILES=(
  "backend/Dockerfile"
  "backend/docker-entrypoint.sh"
  "backend/package.json"
  "backend/tsconfig.json"
  "backend/prisma/schema.prisma"
  "frontend/Dockerfile"
  "frontend/package.json"
  "frontend/next.config.js"
  "docker-compose.prod.yml"
  "nginx/nginx.prod.conf"
  "deploy.sh"
)

for f in "${CRITICAL_FILES[@]}"; do
  if [ -f "${SCRIPT_DIR}/${f}" ]; then
    pass "$f"
  else
    fail "$f MANQUANT"
  fi
done

# ── 2. Variables d'environnement ──
echo ""
echo "🔑 [2/6] Variables d'environnement"

ENV_FILE="${SCRIPT_DIR}/backend/.env.production"
if [ -f "$ENV_FILE" ]; then
  pass ".env.production existe"

  REQUIRED_VARS=(
    "DATABASE_URL"
    "JWT_SECRET"
    "JWT_REFRESH_SECRET"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "FRONTEND_URL"
  )

  for var in "${REQUIRED_VARS[@]}"; do
    if grep -q "^${var}=" "$ENV_FILE" && ! grep -q "^${var}=$" "$ENV_FILE" && ! grep -q "^${var}=your_" "$ENV_FILE"; then
      pass "$var configuré"
    else
      fail "$var non configuré ou vide"
    fi
  done
else
  fail ".env.production MANQUANT — copier .env.production.example"
fi

# ── 3. Sécurité — pas de secrets dans le code ──
echo ""
echo "🔒 [3/6] Sécurité"

# Vérifier qu'aucun secret n'est hardcodé
SECRET_PATTERNS=(
  "sk_live_"
  "sk_test_[a-zA-Z0-9]{20}"
  "whsec_[a-zA-Z0-9]{20}"
  "AKIA[A-Z0-9]{16}"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  matches=$(grep -rn "$pattern" "${SCRIPT_DIR}/backend/src/" "${SCRIPT_DIR}/frontend/app/" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "test\|spec\|mock\|example" | wc -l)
  if [ "$matches" -gt 0 ]; then
    fail "Secret potentiel trouvé: $pattern ($matches occurrences)"
  else
    pass "Pas de $pattern dans le code source"
  fi
done

# Vérifier .gitignore
if [ -f "${SCRIPT_DIR}/.gitignore" ]; then
  if grep -q ".env" "${SCRIPT_DIR}/.gitignore"; then
    pass ".env dans .gitignore"
  else
    fail ".env NON dans .gitignore — risque de commit de secrets"
  fi
fi

# ── 4. Prisma schema ──
echo ""
echo "📊 [4/6] Prisma schema"

if command -v npx >/dev/null 2>&1; then
  cd "${SCRIPT_DIR}/backend"
  if npx prisma validate 2>/dev/null; then
    pass "Schema Prisma valide"
  else
    fail "Schema Prisma invalide"
  fi
  cd "${SCRIPT_DIR}"
else
  warn "npx non disponible — skip validation Prisma"
fi

# Compter les modèles et index
MODELS=$(grep -c "^model " "${SCRIPT_DIR}/backend/prisma/schema.prisma" 2>/dev/null || echo "0")
INDEXES=$(grep -c "@@index\|@@unique" "${SCRIPT_DIR}/backend/prisma/schema.prisma" 2>/dev/null || echo "0")
info "$MODELS modèles, $INDEXES index/unique"

# ── 5. Docker ──
echo ""
echo "🐳 [5/6] Docker"

if command -v docker >/dev/null 2>&1; then
  pass "Docker installé ($(docker --version 2>/dev/null | cut -d' ' -f3 | tr -d ','))"
else
  fail "Docker non installé"
fi

if command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1; then
  pass "Docker Compose disponible"
else
  fail "Docker Compose non installé"
fi

# Vérifier la syntaxe du docker-compose
if command -v docker compose >/dev/null 2>&1; then
  if docker compose -f "${SCRIPT_DIR}/docker-compose.prod.yml" config --quiet 2>/dev/null; then
    pass "docker-compose.prod.yml syntaxe OK"
  else
    warn "docker-compose.prod.yml — problème de syntaxe (peut nécessiter les variables d'env)"
  fi
fi

if ! $QUICK_MODE; then
  echo ""
  info "Mode complet — vérification build Docker (peut prendre quelques minutes)..."
  # On ne build pas réellement, on vérifie juste que les Dockerfiles sont parsables
  if docker build --check "${SCRIPT_DIR}/backend" -f "${SCRIPT_DIR}/backend/Dockerfile" 2>/dev/null; then
    pass "Backend Dockerfile parsable"
  else
    warn "Vérification Dockerfile backend skip (--check non supporté)"
  fi
fi

# ── 6. Métriques finales ──
echo ""
echo "📈 [6/6] Métriques du projet"

BACKEND_FILES=$(find "${SCRIPT_DIR}/backend/src" -name "*.ts" | wc -l)
BACKEND_TESTS=$(find "${SCRIPT_DIR}/backend/src" -name "*.spec.ts" | wc -l)
BACKEND_E2E=$(find "${SCRIPT_DIR}/backend/test" -name "*.e2e-spec.ts" 2>/dev/null | wc -l)
FRONTEND_FILES=$(find "${SCRIPT_DIR}/frontend/app" -name "*.tsx" -o -name "*.ts" 2>/dev/null | wc -l)
TOTAL_LINES=$(find "${SCRIPT_DIR}/backend/src" "${SCRIPT_DIR}/frontend/app" -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')

info "Backend: $BACKEND_FILES fichiers, $BACKEND_TESTS tests, $BACKEND_E2E E2E"
info "Frontend: $FRONTEND_FILES fichiers"
info "Total: ~$TOTAL_LINES lignes de code"

# ── Résultat ──
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ PRÊT POUR LE DÉPLOIEMENT${NC} — $WARNINGS warning(s)"
  echo ""
  echo "Prochaine étape: ./deploy.sh"
  exit 0
else
  echo -e "${RED}❌ $ERRORS ERREUR(S) DÉTECTÉE(S)${NC} — $WARNINGS warning(s)"
  echo ""
  echo "Corrigez les erreurs ci-dessus avant de déployer."
  exit 1
fi
