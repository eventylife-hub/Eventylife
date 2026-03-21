#!/bin/bash
# Script pour pusher le frontend vers GitHub
# Exécuter depuis le dossier eventisite/

set -e

echo "=== Push Eventy Frontend vers GitHub ==="

# Aller dans le dossier frontend
cd "$(dirname "$0")/frontend"

# Supprimer le lock file s'il existe
rm -f .git/index.lock
echo "✓ Lock file nettoyé"

# Appliquer le bundle (le commit est déjà prêt)
git bundle verify ../frontend-update.bundle
git pull ../frontend-update.bundle master
echo "✓ Commit appliqué"

# Pusher vers GitHub
git push origin master
echo "✓ Pushé vers GitHub !"
echo ""
echo "Vercel va automatiquement déclencher un nouveau build."
echo "Vérifie sur https://vercel.com/dashboard"
