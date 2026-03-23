# SUIVI BUGS SITE — Eventy Life

> **Date** : 2026-03-23
> **Auteur** : Session Cowork — Audit navigation complète
> **Site** : https://www.eventylife.fr
> **Projet Vercel** : `eventy-frontend` (prj_h8YuqFLKkzqhIaiDISTid3j49DRo)

---

## Résumé de l'audit

Navigation complète des 4 portails :
- **Public** : Accueil, Voyages, Comment ça marche, Avis, Contact ✅
- **Client** : Connexion, Dashboard, Réservations, Groupes ✅
- **Pro** : Connexion, Dashboard, Voyages ✅
- **Admin** : Connexion, Dashboard, Finance ✅

---

## BUGS CORRIGÉS (2026-03-23)

### ✅ FIX-001 — BOM dans .env.production
- **Fichier** : `frontend/.env.production`
- **Bug** : Caractère BOM (Byte Order Mark `EF BB BF`) en début de fichier
- **Impact** : Certains parseurs ne lisent pas correctement `NEXT_PUBLIC_API_URL`, ce qui peut causer un fallback vers localhost
- **Fix** : BOM supprimé

### ✅ FIX-002 — request.json() sans try-catch (6 routes API)
- **Impact** : Un body JSON malformé cause un crash 500 au lieu d'un 400 propre
- **Routes corrigées** :
  - `app/api/admin/reviews/moderate/route.ts` (PATCH)
  - `app/api/admin/transport/itinerary/route.ts` (POST)
  - `app/api/reviews/[id]/route.ts` (PATCH)
  - `app/api/client/messagerie/conversations/route.ts` (POST)
  - `app/api/client/favorites/collections/route.ts` (POST)
  - `app/api/pro/marketing/shortlinks/route.ts` (POST)
- **Fix** : Ajout try-catch autour de `request.json()` → retourne 400 avec message clair

---

## BUGS RESTANTS À CORRIGER

### 🔴 CRITIQUE

#### BUG-003 — `ignoreBuildErrors: true` dans next.config.js
- **Fichier** : `frontend/next.config.js` ligne 10
- **Impact** : Les erreurs TypeScript sont ignorées au build. ~165+ erreurs de types masquées en production. Des bugs runtime peuvent apparaître sans être détectés.
- **Action** : Passer `ignoreBuildErrors: false` et corriger les erreurs TS une par une.
- **Effort** : 🔴 Gros chantier (~2-4h)

### 🟡 IMPORTANT

#### BUG-004 — Localhost fallback dans config.ts
- **Fichier** : `frontend/lib/config.ts` ligne 16
- **Code** : `export const API_URL_SERVER = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';`
- **Impact** : En SSR, si `NEXT_PUBLIC_API_URL` est absent, le serveur tente de fetch localhost:4000 → timeout 5s sur chaque page avec metadata dynamique
- **Action** : Remplacer le fallback par une URL vide ou le SITE_URL + `/api`
- **Effort** : 🟢 5 min

#### BUG-005 — Données "0" sur la page Avis publique
- **URL** : https://www.eventylife.fr/avis
- **Impact** : Affiche "0/5 Note moyenne", "0+ Avis vérifiés", "0% 5 étoiles" mais "98% Recommandent" → incohérent
- **Action** : Soit masquer la section stats quand il n'y a pas d'avis, soit mettre des données de démo cohérentes
- **Effort** : 🟢 15 min

#### BUG-006 — Section "Voyages en vedette" fantôme sur /voyages
- **URL** : https://www.eventylife.fr/voyages
- **Impact** : Section très estompée/invisible entre le header et "Autour de vous". Ressemble à un skeleton loader bloqué ou des données vides avec opacité réduite.
- **Action** : Investiguer le composant qui rend cette section et soit la masquer quand pas de données "vedette", soit la peupler avec des données démo
- **Effort** : 🟡 30 min

#### BUG-007 — STRIPE_WEBHOOK_SECRET potentiellement absent
- **Fichier** : `app/api/webhooks/stripe/route.ts` ligne 219
- **Impact** : Si non configuré, les webhooks Stripe sont acceptés sans vérification de signature → faille de sécurité
- **Action** : Vérifier que la variable est configurée dans Vercel. Ajouter un early-return avec 500 si absente.
- **Effort** : 🟢 10 min

#### BUG-008 — CRON_SECRET potentiellement absent
- **Fichier** : `app/api/cron/expire-holds/route.ts`
- **Impact** : Les cron jobs pourraient s'exécuter sans authentification
- **Action** : Ajouter validation stricte de CRON_SECRET
- **Effort** : 🟢 10 min

### 🟢 MINEUR

#### BUG-009 — Dynamic imports sans error boundary
- **Fichiers** : Multiples pages admin/pro avec `dynamic(() => import(...))`
- **Impact** : Si un composant dynamique échoue à charger (réseau lent), la page plante sans fallback UI
- **Action** : Ajouter `loading` et `ssr: false` ou des error boundaries
- **Effort** : 🟡 45 min

#### BUG-010 — WebSocket fallback localhost en dev SSR
- **Fichier** : `frontend/hooks/use-notifications-websocket.ts` ligne 32
- **Impact** : Mineur — en prod, retourne `''` et désactive le WS (correct). Le fallback localhost ne s'active qu'en dev.
- **Action** : Aucune action urgente, mais nettoyer le code pour clarté
- **Effort** : 🟢 5 min

---

## PAGES TESTÉES — RÉSULTATS

| Page | URL | Statut | Notes |
|------|-----|--------|-------|
| Accueil | `/` | ✅ OK | Design sunset premium, stats, cards voyages |
| Nos voyages | `/voyages` | ⚠️ | Section "Vedette" fantôme (BUG-006) |
| Comment ça marche | `/comment-ca-marche` | ✅ OK | 3 étapes, bien rendu |
| Avis | `/avis` | ⚠️ | Stats à 0 incohérentes (BUG-005) |
| Contact | `/contact` | ✅ OK | Formulaire + infos |
| Connexion client | `/connexion` | ✅ OK | Login démo fonctionne |
| Dashboard client | `/client` | ✅ OK | Marie M., stats, activité |
| Réservations | `/client/reservations` | ✅ OK | Filtres, état vide correct |
| Groupes | `/client/groupes` | ✅ OK | Affiche données démo |
| Connexion Pro | `/pro/login` | ✅ OK | Login démo fonctionne |
| Dashboard Pro | `/pro` | ✅ OK | Mode démo visible, onboarding |
| Mes voyages Pro | `/pro/voyages` | ✅ OK | Onglets, état vide correct |
| Admin login | `/admin-login` | ✅ OK | Design sécurisé |
| Dashboard Admin | `/admin` | ✅ OK | Bonjour David, KPIs |
| Finance Admin | `/admin/finance` | ✅ OK | 12 actions rapides |

---

## COMPTES DÉMO

| Portail | Email | Mot de passe | Rôle |
|---------|-------|--------------|------|
| Client | `client@eventylife.fr` | `Client123!Secure` | CLIENT |
| Pro | `pro@eventylife.fr` | `Pro123!Secure` | PRO |
| Admin | `admin@eventylife.fr` | `Admin123!Secure` | ADMIN |
| Admin (David) | `eventylife@gmail.com` | `Eventy2026` | ADMIN |

---

## PROCHAINES PRIORITÉS

1. **BUG-003** — Désactiver `ignoreBuildErrors` et corriger les erreurs TS (le plus critique)
2. **BUG-004** — Corriger le fallback localhost
3. **BUG-005** — Corriger la page Avis (données démo cohérentes)
4. **BUG-006** — Corriger la section Vedette fantôme
5. **BUG-007/008** — Sécuriser les webhooks et cron
6. **BUG-009** — Error boundaries pour les imports dynamiques
