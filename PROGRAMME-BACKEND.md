# PROGRAMME BACKEND — Eventy Life

> **Cowork dédié** : BACKEND uniquement
> **Date** : 18 mars 2026
> **Objectif** : Implémenter toute la logique métier, module par module
> **Règle** : 1 session = 1 module. On teste, on valide, on passe au suivant.

---

## ÉTAT DU BACKEND ACTUEL

| Élément | Quantité | Statut |
|---------|----------|--------|
| Modules NestJS | 31 | ✅ Structure OK |
| Modèles Prisma | 120 | ✅ Schema complet |
| Enums Prisma | 125 | ✅ |
| Controllers | 41 | ✅ Endpoints déclarés |
| Services (lignes) | ~28 000 | ⚠️ Code existe mais logique partielle |
| Tests unitaires | 128 fichiers | ✅ 98 719 lignes |
| Tests E2E | 39 fichiers | ✅ 25 678 lignes |
| Schema Prisma | 3 486 lignes | ✅ |

### Verdict
Le squelette est complet. Les services ont du code réel (pas des mocks vides), mais la logique métier est partielle (~30-40% sur la plupart des modules). Il manque surtout les parcours complets, les edge cases, et l'intégration entre modules.

---

## PLAN PAR LOT — ORDRE D'EXÉCUTION

### ══════════════════════════════════════
### LOT 0 — INFRA & PRISMA (Jour 1)
### ══════════════════════════════════════

**But** : S'assurer que la DB tourne, les migrations passent, le seed fonctionne.

| # | Tâche | Fichiers | Validation |
|---|-------|----------|------------|
| 0.1 | Vérifier `prisma validate` | `prisma/schema.prisma` | ✅ 0 erreurs |
| 0.2 | Créer migration initiale | `prisma/migrations/` | `npx prisma migrate dev` |
| 0.3 | Seed réaliste (5 users, 3 pros, 2 voyages, 10 réservations) | `prisma/seed.ts` | `npx prisma db seed` |
| 0.4 | Vérifier les index (performance) | `schema.prisma` @@index | Pas de full scan |
| 0.5 | Docker PostgreSQL + .env.example | `docker-compose.yml` | `docker compose up db` |

**Dépendance** : RIEN. C'est le point de départ.

---

### ══════════════════════════════════════
### LOT 1 — AUTH & RBAC (Jour 2-3)
### ══════════════════════════════════════

**But** : Auth complète, 2FA, refresh rotatif, RBAC 3 niveaux.

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 1.1 | Register + Login complet | `auth/` | ✅ 819 lignes, Argon2id | Vérifier email flow end-to-end |
| 1.2 | Refresh token rotatif | `auth/` | ✅ Partiel | Rotation + révocation famille |
| 1.3 | 2FA TOTP (QR code) | `auth/` | ❌ | Toute l'implémentation |
| 1.4 | RBAC matrice (CLIENT/PRO/ADMIN + capabilities) | `admin/rbac/` | ✅ 205 lignes | Tester tous les guards |
| 1.5 | Rate limiting par endpoint | `auth/` | ⚠️ Throttler global | Granulaire par route |
| 1.6 | Session management (liste, révocation) | `auth/` | ❌ | Page admin sessions |
| 1.7 | IP allowlist admin | `auth/` | ❌ | Guard + config |

**Tests** : Login → Token → Refresh → 2FA → RBAC guard → Rate limit
**Validation** : `npm run test -- auth` + E2E login flow

---

### ══════════════════════════════════════
### LOT 2 — USERS & PROFILS (Jour 4)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 2.1 | CRUD utilisateur complet | `users/` | ✅ 330 lignes | Edge cases, soft delete |
| 2.2 | Upload avatar (S3 presigned) | `uploads/` | ✅ 515 lignes | Tester flux réel |
| 2.3 | Préférences notifications | `users/` | ❌ | Model + endpoints |
| 2.4 | Préférences marketing (opt-in/out) | `users/` | ❌ | RGPD-compliant |

**Dépendance** : LOT 1 (Auth)

---

### ══════════════════════════════════════
### LOT 3 — ONBOARDING PRO (Jour 5-6)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 3.1 | Inscription Pro 5 types (AE, SARL, Asso, CE, Auto) | `pro/onboarding/` | ✅ 554 lignes | Validation SIRET API, docs upload |
| 3.2 | Workflow validation admin | `admin/` | ⚠️ Partiel | Workflow complet approve/reject/ask_more |
| 3.3 | Documents Pro obligatoires | `documents/` | ⚠️ Partiel | Check liste obligatoire par type |
| 3.4 | Email bienvenue Pro | `email/` | ⚠️ Template existe | Tester envoi réel |
| 3.5 | Formation Pro (contenu statique) | Frontend | ✅ Page existe | Connecter au backend progress |

**Tests** : Inscription Pro → Upload docs → Admin valide → Pro actif
**Validation** : `npm run test -- pro/onboarding`

---

### ══════════════════════════════════════
### LOT 4 — CRÉATION VOYAGE (Jour 7-9)
### ══════════════════════════════════════

**C'est le cœur du produit.**

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 4.1 | Wizard création 4 étapes (info, transport, hébergement, tarifs) | `travels/` | ✅ 703 lignes | Parcours complet avec validation |
| 4.2 | Travel Lifecycle (DRAFT→PUBLISHED→BOOKING→CONFIRMED→COMPLETED) | `travels/` | ✅ 897 lignes | State machine complète |
| 4.3 | Pricing Engine (perPerson, chambre, extras, assurance) | `checkout/pricing.service.ts` | ✅ 201 lignes | Calcul complet selon specs |
| 4.4 | Transport config (bus stops, itinéraire, capacité) | `transport/` | ✅ 511 lignes | Allotement, fill optimizer |
| 4.5 | HRA setup (hôtels, restos, activités liés au voyage) | `hra/` | ✅ 981 lignes | Lien voyage ↔ HRA complet |
| 4.6 | Publication + mise en ligne | `travels/` | ⚠️ | Vérifications pré-publication |
| 4.7 | Duplication de voyage | `travels/` | ❌ | Deep clone |

**Dépendance** : LOT 1 + LOT 3
**Tests** : Créer voyage brouillon → Ajouter transport → HRA → Pricing → Publier
**Validation** : `npm run test -- travels` + `npm run test -- transport`

---

### ══════════════════════════════════════
### LOT 5 — BOOKING & CHECKOUT (Jour 10-12)
### ══════════════════════════════════════

**Le flux d'argent.**

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 5.1 | Réservation lifecycle (PENDING→CONFIRMED→COMPLETED/CANCELLED) | `bookings/` | ✅ 606 lignes | State machine complète |
| 5.2 | Checkout 3 étapes (infos, paiement, confirmation) | `checkout/` | ✅ 1818 lignes | Vérifier flux Stripe end-to-end |
| 5.3 | Stripe webhooks complets | `payments/` | ⚠️ Partiel | 6 événements manquants |
| 5.4 | Split payment (plusieurs payeurs) | `checkout/split-pay.service.ts` | ✅ 385 lignes | Tester edge cases |
| 5.5 | Hold 24h (option sans paiement) | `bookings/` | ❌ | Timer + expiration auto |
| 5.6 | Rooming attribution | `rooming/` | ✅ 401 lignes | Calcul auto + edge cases |
| 5.7 | Confirmation email + PDF facture | `email/` + `documents/` | ⚠️ | Flux complet |
| 5.8 | Idempotency sur tout le flux | `checkout/` | ⚠️ | Vérifier chaque étape |

**Dépendance** : LOT 4 (Voyage publié nécessaire)
**Tests** : Réserver → Payer → Webhook → Confirmation → Email + PDF
**Invariants** :
- `pricingParts = occupancyCount` (JAMAIS capacity)
- `perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC`
- Money = centimes Int
- Idempotency sur tout

---

### ══════════════════════════════════════
### LOT 6 — FINANCE & TVA (Jour 13-15)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 6.1 | Calcul TVA marge (CA_TTC − coûts_TTC) × 20/120 | `finance/` | ✅ 747 lignes | Vérifier formule exacte |
| 6.2 | Ledger (journal comptable) | `finance/` | ❌ | Modèle + écritures auto |
| 6.3 | PayoutBatch Pro (calcul commission, virement) | `finance/` | ❌ | Tout à créer |
| 6.4 | Export comptable (FEC, CSV cabinet) | `exports/` | ✅ 417 lignes | Format FEC exact |
| 6.5 | Factures Pro (PDF) | `documents/` | ⚠️ | Template + génération |
| 6.6 | Dashboard finance admin | Endpoint | ⚠️ | Agrégats complets |
| 6.7 | Credit Wallet + Avoirs | `finance/` | ❌ | Modèle + flux |

**Dépendance** : LOT 5 (besoin de paiements pour calculer)
**Invariant 6** : TVA_marge = (CA_TTC − coûts_TTC) × 20/120 — TESTER avec 10 scénarios

---

### ══════════════════════════════════════
### LOT 7 — ANNULATIONS & POST-SALE (Jour 16-17)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 7.1 | Annulation avec barème (J-30, J-15, J-7, J-3) | `cancellation/` | ✅ 752 lignes | Vérifier barèmes specs |
| 7.2 | Remboursement Stripe | `payments/` | ⚠️ | Partial refund + avoir |
| 7.3 | NoGo voyage (seuil minimum) | `travels/` | ❌ | Logique NoGo + notifs |
| 7.4 | Waitlist | `bookings/` | ❌ | File d'attente + auto-confirm |
| 7.5 | Post-sale (avis, pourboire, UGC) | `post-sale/` | ✅ 979 lignes | Connecter au flux |
| 7.6 | Reviews moderation | `reviews/` | ✅ 450 lignes | Workflow admin |

**Dépendance** : LOT 5 + LOT 6

---

### ══════════════════════════════════════
### LOT 8 — NOTIFICATIONS & EMAILS (Jour 18-19)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 8.1 | Système notifications (email + push + in-app) | `notifications/` | ✅ 899 lignes | Canaux complets |
| 8.2 | 14 templates emails (Resend/Brevo) | `email/` | ✅ 1725 lignes templates | Tester rendu + envoi |
| 8.3 | Préférences utilisateur (opt-in/out par canal) | `notifications/` | ❌ | Modèle + endpoint |
| 8.4 | Outbox pattern (garantie livraison) | `email/` | ⚠️ Modèle existe | Implémenter queue |
| 8.5 | Cron rappels (paiement, départ J-7, J-1) | `cron/` | ✅ 1204 lignes | Vérifier tous les crons |

**Dépendance** : LOT 5 (besoin de réservations pour notifier)

---

### ══════════════════════════════════════
### LOT 9 — DOCUMENTS & LEGAL (Jour 20-21)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 9.1 | Génération PDF (facture, confirmation, contrat) | `documents/` | ✅ 892 lignes | Templates finaux |
| 9.2 | Signature électronique Pro | `documents/` | ⚠️ | Intégration API |
| 9.3 | RGPD DSAR (droit accès, suppression) | `legal/` | ✅ 673 + 563 lignes | Tester parcours complet |
| 9.4 | Rétention données auto (purge) | `legal/` | ❌ | Cron + politique |
| 9.5 | CGV versioning | `legal/` | ⚠️ | Acceptation versionnée |
| 9.6 | Export RGPD utilisateur (JSON/ZIP) | `legal/` | ⚠️ | Format complet |

**Dépendance** : LOT 1 (Auth/RBAC)

---

### ══════════════════════════════════════
### LOT 10 — SUPPORT & COMMUNICATION (Jour 22-23)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 10.1 | Tickets support (création, assignation, SLA) | `support/` | ✅ 241 lignes | Workflow complet |
| 10.2 | Messagerie Pro ↔ Client | ❌ | | Tout à créer |
| 10.3 | Escalade auto (SLA dépassé) | `support/` | ❌ | Timer + notif admin |
| 10.4 | FAQ dynamique | `public/` | ❌ | CRUD + recherche |

---

### ══════════════════════════════════════
### LOT 11 — MARKETING & GROUPES (Jour 24-25)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 11.1 | Campagnes marketing Pro | `marketing/` | ✅ 872 lignes | Parcours complet |
| 11.2 | QR codes + shortlinks | `marketing/` | ❌ | Génération + tracking |
| 11.3 | Leads capture + inbox | `marketing/` | ❌ | Modèle + flux |
| 11.4 | Travel Groups social | `groups/` | ✅ 944 lignes | Smart invite, partage |
| 11.5 | SEO (JSON-LD, sitemap auto) | `seo/` | ✅ 295 lignes | Enrichir |

---

### ══════════════════════════════════════
### LOT 12 — ADMIN AVANCÉ (Jour 26-28)
### ══════════════════════════════════════

| # | Tâche | Module | Ce qui existe | Ce qui manque |
|---|-------|--------|---------------|---------------|
| 12.1 | Dashboard admin (KPIs temps réel) | `admin/` | ✅ 1128 lignes | Agrégats complets |
| 12.2 | Feature Flags + Break-glass | `admin/` | ❌ | Tout à créer |
| 12.3 | Audit log complet | `admin/audit/` | ✅ 287 lignes | Enrichir |
| 12.4 | Exports admin (CSV, Excel, PDF) | `exports/` | ✅ 417 lignes | Tous les formats |
| 12.5 | Monitoring + alertes | `health/` | ✅ 309 lignes | Métriques métier |

---

### ══════════════════════════════════════
### LOT 13 — SÉCURITÉ & HARDENING (Jour 29-30)
### ══════════════════════════════════════

| # | Tâche | Détail |
|---|-------|--------|
| 13.1 | Audit sécurité complet | OWASP Top 10 check |
| 13.2 | Rate limiting granulaire | Par endpoint, par rôle |
| 13.3 | CSP headers | Content-Security-Policy strict |
| 13.4 | Input sanitization | Tous les DTOs |
| 13.5 | SQL injection prevention | Prisma paramétré (déjà OK) |
| 13.6 | CORS production | Domaines whitelistés |
| 13.7 | Secrets rotation plan | Env vars, JWT keys |
| 13.8 | Tests de pénétration (checklist) | 77 points compliance EU/FR |

---

## RÉSUMÉ CALENDRIER

| Lot | Jours | Module principal | Dépendance |
|-----|-------|-----------------|------------|
| LOT 0 | J1 | Infra + Prisma | — |
| LOT 1 | J2-3 | Auth + RBAC | LOT 0 |
| LOT 2 | J4 | Users + Profils | LOT 1 |
| LOT 3 | J5-6 | Onboarding Pro | LOT 1 |
| LOT 4 | J7-9 | Création Voyage | LOT 1+3 |
| LOT 5 | J10-12 | Booking + Checkout + Stripe | LOT 4 |
| LOT 6 | J13-15 | Finance + TVA | LOT 5 |
| LOT 7 | J16-17 | Annulations + Post-sale | LOT 5+6 |
| LOT 8 | J18-19 | Notifications + Emails | LOT 5 |
| LOT 9 | J20-21 | Documents + Legal | LOT 1 |
| LOT 10 | J22-23 | Support + Communication | LOT 1 |
| LOT 11 | J24-25 | Marketing + Groupes | LOT 4 |
| LOT 12 | J26-28 | Admin avancé | LOT 6 |
| LOT 13 | J29-30 | Sécurité + Hardening | TOUT |

**Total** : ~30 jours de sessions Cowork

---

## SPECS DRAW.IO À SUIVRE PAR LOT

| LOT | Diagrammes draw.io |
|-----|-------------------|
| LOT 0 | DEV_000 (Env Setup DotEnv), DEV_001 (Project Structure), DEV_014 (Seed Data), DEV_011 (Prisma Enums) |
| LOT 1 | DEV_010 (Auth JWT Refresh 2FA), DEV_006 (RBAC Matrice Endpoint) |
| LOT 4 | 04 (CréationVoyage 2Phases), 108-110 (Phase1 Approval) |
| LOT 5 | DEV_002 (Checkout 5 Étapes), DEV_015 (Stripe Webhooks), 117-119 (RoomBooking SplitPay) |
| LOT 6 | DEV_016 (Formules Finance Exemples Chiffrés), 54-56 (Compta Exports Cabinet) |
| LOT 8 | DEV_005 (Email Templates 14), DEV_013 (Cron Jobs 9 Details) |
| LOT 12 | DEV_004 (Admin Paramètres Centralisé), DEV_019 (Admin Dashboard UI), DEV_012 (Error Codes API) |
| LOT 13 | DEV_017 (API Endpoints Complets), DEV_018 (Go Live Checklist), DEV_021 (Testing Strategy) |
| TOUS | DEV_007 (Design System — pour validation des réponses API) |

---

## RÈGLES DE CHAQUE SESSION

```
1. Consulter ce fichier → identifier le LOT en cours
2. Consulter les specs draw.io correspondantes (fichiers Knowledge 00-09)
3. Coder le module
4. Tester : npm run test -- [module]
5. Valider : npx prisma validate && npm run build
6. Mettre à jour PROGRESS.md avec ce qui a été fait
7. Passer au LOT suivant
```

## INVARIANTS À VÉRIFIER À CHAQUE SESSION

1. `pricingParts = occupancyCount` (JAMAIS capacity)
2. `perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC`
3. Money = centimes Int (JAMAIS Float)
4. Idempotency sur tout (webhooks, uploads, opérations financières)
5. Lock post-paiement (chambre/occupation/assurance verrouillés)
6. TVA marge = (CA_TTC − coûts_TTC) × 20/120
7. Paiement reçu ≠ annulé par hold expiré
8. TravelGroupMember JOINED ≠ place consommée

---

*Généré le 18 mars 2026 — Cowork Backend uniquement*
