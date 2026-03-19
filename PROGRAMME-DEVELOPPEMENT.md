# PROGRAMME DE DÉVELOPPEMENT — Eventy Life

> **Date** : 18 mars 2026
> **Source** : Comparaison draw.io v53 (1 798 diagrammes) vs Site existant (135 pages)
> **Objectif** : Passer de 2% à 100% d'implémentation en phases maîtrisées

---

## ÉTAT DES LIEUX — CE QUI EXISTE

### Frontend (135 pages) — ~75% des UI spécifiées
| Portail | Pages codées | Pages draw.io | Couverture UI |
|---------|-------------|---------------|---------------|
| Public | 25 | 25 | ~100% |
| Client | 23 | 29 | ~79% |
| Pro | 47 | 55 | ~85% |
| Admin | 27 | 38 | ~71% |
| Auth | 11 | 11 | 100% |
| Checkout | 5 | 5 | 100% |

### Backend (31 modules, 41 controllers) — ~2% des features spécifiées
- Schema Prisma : 102 modèles, 109 enums ✅
- Controllers : 41 fichiers ✅ (mais services souvent vides/mocks)
- Tests : 3 300+ (unitaires + E2E) ✅
- Sécurité baseline : Helmet, CORS, JWT, Throttler ✅
- **MAIS** : La logique métier réelle est quasi absente (~2%)

---

## CE QUI A ÉTÉ OUBLIÉ / MANQUE

### 🔴 Pages Frontend manquantes (~20 pages)

#### Admin (11 pages manquantes)
| # | Page | Route | Criticité |
|---|------|-------|-----------|
| A1 | Validation Pro | `/admin/validation-pro` | P0 |
| A2 | Équipes internes | `/admin/equipes` | P1 |
| A3 | Fournisseurs | `/admin/fournisseurs` | P1 |
| A4 | Finance avancée (PayoutBatch, TVA, Ledger) | `/admin/finance/*` | ✅ **FAIT** (Cowork-1) |
| A5 | Restauration | `/admin/restauration` | P1 |
| A6 | Intégrations | `/admin/integrations` | P2 |
| A7 | Feature Flags | `/admin/feature-flags` | P1 |
| A8 | Leads Marketing | `/admin/marketing/leads` | ✅ **FAIT** (Cowork-1) |
| A9 | Gestion HRA | `/admin/hra` | P1 |
| A10 | Communications Hub | `/admin/communications` | P1 |
| A11 | Planning 18 mois | `/admin/planning` | P2 |

#### Pro (8 pages manquantes)
| # | Page | Route | Criticité |
|---|------|-------|-----------|
| P1 | Paiements Pro | `/pro/paiements` | P0 |
| P2 | Notifications Centre | `/pro/notifications` | P1 |
| P3 | Magasin / Point de vente | `/pro/magasin` | P1 |
| P4 | Annuaire indépendants | `/pro/annuaire` | P2 |
| P5 | Hub CE/Association | `/pro/association` | P2 |
| P6 | Wallet Pro / Jetons | `/pro/wallet` | P1 |
| P7 | Leads Inbox | `/pro/marketing/leads` | ✅ **FAIT** (Cowork-1) |
| P8 | Restauration avancée | `/pro/voyages/[id]/restauration` | P1 (PARTIEL) |

#### Client (6 pages manquantes)
| # | Page | Route | Criticité |
|---|------|-------|-----------|
| C1 | Favoris / Wishlist | `/client/favoris` | P1 |
| C2 | Credit Wallet avancé | `/client/wallet` | P1 (PARTIEL) |
| C3 | Préférences notifications | `/client/notifications/preferences` | ✅ **FAIT** (Cowork-1) |
| C4 | Urgence / Assistance | `/client/urgence` | P0 |
| C5 | Préférences marketing | `/client/preferences-marketing` | P2 |
| C6 | Pourboire / Merci voyage | `/client/pourboire` | P2 |

### 🔴 Features backend NON codées (~1 650 diagrammes = 95% des specs)

#### P0 — CRITIQUE (blocage lancement)
| # | Feature | Catégorie | Diagrammes |
|---|---------|-----------|------------|
| F01 | TVA sur marge + Compta + Exports cabinet | Finance | 54-56, 69-71, 709-711 |
| F02 | PayoutBatch (paiements Pro/Indés) | Finance | 402-410 |
| F03 | Transport complet (bus+avion+allotement) | Transport | 72-77, 715-735 |
| F04 | Manifest + Exports transport | Transport | 499, 511 |
| F05 | Lifecycle réservation complet | Booking | 39-44, 250-257 |
| F06 | Rooming complet (chambres, règles, calcul) | Booking | 571-573, 131-135 |
| F07 | Système notifications complet | Notifications | 45-47 |
| F08 | Système documents (PDF, signatures, RGPD) | Documents | 48-50, 258-269 |
| F09 | RBAC complet (matrice, 3 niveaux) | Sécurité | 521-525 |
| F10 | RGPD complet (DSAR, rétention, CMP) | Legal | 231-236 |
| F11 | Compliance EU/FR (77 points) | Legal | 803-806 |
| F12 | Sécurité baseline (2FA, IP allowlist) | Sécurité | T-075, T-076 |
| F13 | Onboarding Pro 5 types + Validation | Pro | 20-24, 26-32 |
| F14 | Pricing engine complet | Pricing | 90-92, 701, 712-714 |
| F15 | Création Voyage Phase 1 + Phase 2 | Voyage | 84-86, 108-110, 178-182 |

#### P1 — IMPORTANT (post-lancement immédiat)
| # | Feature | Catégorie | Diagrammes |
|---|---------|-----------|------------|
| F16 | Cotisations Indés + Marketing Fund | Finance | 751-756 |
| F17 | Credit Wallet + Avoirs | Finance | 237-251 |
| F18 | Fill Optimizer + Capacity Booster | Transport | 966-968 |
| F19 | NoGo + Waitlist + Hold 24h | Booking | 207-212 |
| F20 | Hub HRA complet | HRA | 63-68, 638-657 |
| F21 | Marketing Hub (QR, shortlinks, leads) | Marketing | 440-476 |
| F22 | Communication Hub (inbox, SLA, escalade) | Notifications | PATCH_COMMS |
| F23 | Support complet (tickets, incidents, litiges) | Support | 57-59, 603-607 |
| F24 | Feature Flags + Break-glass + 4-eyes | Sécurité | 283-296 |
| F25 | Travel Groups complet (social, smart invite) | Groupes | V300-V323 |
| F26 | Gestion fournisseurs | Fournisseurs | 66-68, 613-619 |
| F27 | Assurance (packs, pricing, dossiers) | Assurance | 700-701, 766-767 |
| F28 | Email automation + Templates 14 | Emails | 194-198 |

#### P2 — ÉVOLUTION (M6+)
| # | Feature | Catégorie |
|---|---------|-----------|
| F29 | Hotel Portal + Onboarding hôtel | HRA |
| F30 | Video Studio IA | Marketing |
| F31 | Supplies Shop + Print Orders | Marketing |
| F32 | Runbook J0 + Incidents terrain | Terrain |
| F33 | SEO slugs + Viral share + UGC | SEO |

### 🔴 Autres éléments manquants (non dans le fichier Excel)
| # | Élément | Détail | Criticité |
|---|---------|--------|-----------|
| X1 | Stripe webhooks complets | Seulement partiel actuellement | P0 |
| X2 | Email templates (0/14 codés) | Templates Resend/Brevo | P0 |
| X3 | Tests E2E Playwright specs | 0% codés selon specs draw.io | P1 |
| X4 | Seed data réaliste | Pour demo + tests | P1 |
| X5 | Monitoring Sentry intégration | Config + error boundaries | P1 |
| X6 | CI/CD pipeline complet | Build + test + deploy auto | P1 |
| X7 | S3 presigned URLs | Upload fichiers réel | P0 |
| X8 | Cron jobs métier | Rappels, expirations, nettoyage | P1 |
| X9 | Rate limiting granulaire | Par endpoint selon specs | P1 |
| X10 | Migration DB production | Scripts + rollback | P0 |

---

## PROGRAMME DE DÉVELOPPEMENT EN PHASES

### ═══════════════════════════════════════════
### PHASE 1 — FONDATIONS (Semaines 1-4)
### "Rien ne marche sans ça"
### ═══════════════════════════════════════════

**Objectif** : Rendre le backend fonctionnel pour le MVP. Sans Phase 1, impossible de lancer.

#### BACKEND — Phase 1 (priorité absolue)

| Sem. | Tâche | Fichiers impactés | Dépend de |
|------|-------|-------------------|-----------|
| S1 | **Prisma migrate + seed réaliste** | `prisma/migrations/`, `prisma/seed.ts` | — |
| S1 | **Auth complète** : 2FA TOTP, refresh rotatif, Argon2id | `auth/`, `users/` | — |
| S1 | **RBAC matrice 3 niveaux** (CLIENT, PRO, ADMIN + capabilities) | `auth/guards/`, `auth/rbac/` | Auth |
| S2 | **Création Voyage Phase 1** : wizard 4 étapes, validation, brouillon | `travels/`, `pro/travels/` | Auth+RBAC |
| S2 | **Pricing Engine** : estimation, calcul TTC, lock pre-paiement | `pricing/` (nouveau), `travels/` | Voyage |
| S2 | **Transport basique** : bus stops, itinéraires, capacité | `transport/` | Voyage |
| S3 | **Booking lifecycle** : réservation → confirmation → annulation | `bookings/`, `cancellation/` | Pricing |
| S3 | **Checkout + Stripe** : sessions, webhooks complets, idempotency | `checkout/`, `payments/` | Booking |
| S3 | **Rooming basique** : attribution chambres, calcul par occupancy | `rooming/` | Booking |
| S4 | **TVA marge** : calcul, export, ledger | `finance/` | Stripe |
| S4 | **PayoutBatch** : paiement Pro/Indés automatisé | `finance/payout/` (nouveau) | TVA |
| S4 | **Documents PDF** : factures, confirmations, signatures | `documents/` | Finance |

#### FRONTEND — Phase 1

| Sem. | Tâche | Pages impactées |
|------|-------|-----------------|
| S1 | **Connecter Auth réelle** : login/register → API, tokens, refresh | Toutes pages auth |
| S1 | **Admin — Validation Pro** : page CRUD validation partenaires | `/admin/validation-pro` (NOUVEAU) |
| S2 | **Pro — Création Voyage** : connecter wizard → API réelle | `/pro/voyages/nouveau` |
| S2 | **Client — Checkout réel** : connecter steps → Stripe | `/checkout/*` |
| S3 | **Client — Réservations** : données réelles, statuts, actions | `/client/reservations/*` |
| S3 | **Pro — Paiements** : page dédiée paiements Pro | `/pro/paiements` (NOUVEAU) |
| S4 | **Admin — Finance avancée** : PayoutBatch, TVA, Ledger | `/admin/finance/*` (ENRICHIR) |
| S4 | **Client — Urgence** : page assistance avec géolocalisation | `/client/urgence` (NOUVEAU) |

#### AUTRES — Phase 1

| Sem. | Tâche | Détail |
|------|-------|--------|
| S1 | **Stripe webhooks** : checkout.session.completed, payment_intent.* | 6 événements critiques |
| S1 | **S3 setup** : presigned URLs upload | Documents, photos |
| S2 | **Email : 4 templates critiques** | Confirmation résa, facture, bienvenue Pro, reset mdp |
| S3 | **Migration DB script** | Up/down/rollback avec vérification |
| S4 | **Tests E2E** : parcours critique | Inscription → Résa → Paiement → Confirmation |

**Livrable Phase 1** : Un utilisateur peut s'inscrire, réserver un voyage, payer, et recevoir sa confirmation. Un Pro peut créer un voyage et être payé.

---

### ═══════════════════════════════════════════
### PHASE 2 — OPÉRATIONNEL (Semaines 5-10)
### "L'accompagnement et les détails"
### ═══════════════════════════════════════════

**Objectif** : Toutes les features nécessaires pour opérer au quotidien.

#### BACKEND — Phase 2

| Sem. | Tâche | Module |
|------|-------|--------|
| S5 | **Notifications système** : templates, canaux (email+push+in-app), préférences | `notifications/` |
| S5 | **Onboarding Pro 5 types** : SIRET, docs, validation multi-étapes | `pro/onboarding/` |
| S6 | **Création Voyage Phase 2** : transport avancé, allotement, HRA | `travels/` |
| S6 | **Support tickets** : création, assignation, SLA, escalade | `support/` |
| S7 | **Groupes complets** : social entity, smart invite, partage | `groups/` |
| S7 | **HRA Hub** : listing hôtels-restos-activités, validation | `hra/` |
| S8 | **NoGo + Waitlist + Hold 24h** | `bookings/` |
| S8 | **Credit Wallet + Avoirs** | `finance/wallet/` (nouveau) |
| S9 | **Assurance** : packs, souscription, dossiers sinistres | `insurance/` |
| S9 | **RGPD complet** : DSAR, rétention auto, CMP, consentements | `legal/` |
| S10 | **Cotisations Indés + Marketing Fund** | `finance/` |
| S10 | **Feature Flags + Break-glass** | `admin/feature-flags/` (nouveau) |

#### FRONTEND — Phase 2

| Sem. | Tâche | Pages |
|------|-------|-------|
| S5 | **Client — Favoris** | `/client/favoris` (NOUVEAU) |
| S5 | **Client — Préférences notifications** | `/client/notifications/preferences` (NOUVEAU) |
| S6 | **Pro — Notifications centre** | `/pro/notifications` (NOUVEAU) |
| S6 | **Pro — Wallet / Jetons** | `/pro/wallet` (NOUVEAU) |
| S7 | **Admin — Équipes** | `/admin/equipes` (NOUVEAU) |
| S7 | **Admin — Fournisseurs** | `/admin/fournisseurs` (NOUVEAU) |
| S8 | **Admin — HRA** | `/admin/hra` (NOUVEAU) |
| S8 | **Admin — Communications Hub** | `/admin/communications` (NOUVEAU) |
| S9 | **Admin — Feature Flags** | `/admin/feature-flags` (NOUVEAU) |
| S9 | **Pro — Magasin** | `/pro/magasin` (NOUVEAU) |
| S10 | **Admin — Restauration** | `/admin/restauration` (NOUVEAU) |
| S10 | **Client — Credit Wallet avancé** | `/client/wallet` (ENRICHIR) |

#### AUTRES — Phase 2

| Sem. | Tâche |
|------|-------|
| S5 | **Email : 10 templates restants** (rappels, annulation, post-voyage, etc.) |
| S6 | **Sentry monitoring** : intégration complète + error boundaries |
| S7 | **CI/CD pipeline** : GitHub Actions → build → test → deploy staging |
| S8 | **Cron jobs** : rappels paiement, expiration holds, nettoyage sessions |
| S9 | **Tests E2E** : parcours Pro complet + parcours Admin |
| S10 | **Compliance EU/FR** : checklist 77 points |

**Livrable Phase 2** : Plateforme opérationnelle avec gestion Pro, support, notifications, wallet, et conformité RGPD.

---

### ═══════════════════════════════════════════
### PHASE 3 — CROISSANCE (Semaines 11-16)
### "Scale et différenciation"
### ═══════════════════════════════════════════

**Objectif** : Features avancées pour la croissance et la différenciation.

#### BACKEND — Phase 3

| Sem. | Tâche |
|------|-------|
| S11 | **Marketing Hub** : QR codes, shortlinks, leads, campagnes |
| S11 | **Email automation** : séquences, triggers, analytics |
| S12 | **Fill Optimizer** : optimisation remplissage bus, suggestions |
| S12 | **Manifest + Exports transport** : PDF manifest, exports réglementaires |
| S13 | **Communication Hub** : inbox unifiée, SLA, escalade auto |
| S13 | **Gestion fournisseurs** : contrats, devis, paiements |
| S14 | **Travel Groups avancé** : social entity, smart invite, partage viral |
| S14 | **Pourboire / Merci voyage** : tips post-séjour |
| S15 | **Rate limiting granulaire** par endpoint |
| S15 | **SEO avancé** : slugs dynamiques, JSON-LD enrichi |
| S16 | **Tests charge** : k6 scénarios réalistes, benchmarks |

#### FRONTEND — Phase 3

| Sem. | Tâche | Pages |
|------|-------|-------|
| S11 | **Admin — Leads Marketing** | `/admin/marketing/leads` (NOUVEAU) |
| S11 | **Pro — Leads Inbox** | `/pro/marketing/leads` (NOUVEAU) |
| S12 | **Admin — Planning 18 mois** | `/admin/planning` (NOUVEAU) |
| S12 | **Pro — Annuaire indépendants** | `/pro/annuaire` (NOUVEAU) |
| S13 | **Admin — Intégrations** | `/admin/integrations` (NOUVEAU) |
| S13 | **Client — Préférences marketing** | `/client/preferences-marketing` (NOUVEAU) |
| S14 | **Client — Pourboire** | `/client/pourboire` (NOUVEAU) |
| S14 | **Pro — Hub CE/Association** | `/pro/association` (NOUVEAU) |
| S15 | **Pro — Restauration avancée** | `/pro/voyages/[id]/restauration` (ENRICHIR) |
| S16 | **Tests E2E complets** : tous parcours utilisateurs |

---

### ═══════════════════════════════════════════
### PHASE 4 — POLISH (Semaines 17-20)
### "Production-ready"
### ═══════════════════════════════════════════

| Sem. | Tâche |
|------|-------|
| S17 | Hotel Portal + Onboarding hôtel |
| S17 | Supplies Shop + Print Orders |
| S18 | Video Studio IA (prototype) |
| S18 | Runbook J0 + Incidents terrain |
| S19 | SEO slugs + Viral share + UGC |
| S19 | Performance audit + optimisation |
| S20 | Tests charge production + Dry run |
| S20 | Documentation finale + formation |

---

## RÉSUMÉ CHIFFRÉ

| Métrique | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|----------|---------|---------|---------|---------|-------|
| Semaines | 4 | 6 | 6 | 4 | **20** |
| Nouvelles pages Frontend | 4 | 12 | 9 | 3 | **28** |
| Pages enrichies | 6 | 2 | 1 | 0 | **9** |
| Features Backend P0 | 15 | 0 | 0 | 0 | **15** |
| Features Backend P1 | 0 | 12 | 8 | 0 | **20** |
| Features Backend P2 | 0 | 0 | 0 | 5 | **5** |
| Email templates | 4 | 10 | 0 | 0 | **14** |
| Tests E2E parcours | 1 | 2 | 1 | 1 | **5** |

---

## DÉPENDANCES CRITIQUES

```
Auth + RBAC ──→ Tout le reste
       │
       ├──→ Voyage (Création) ──→ Pricing ──→ Booking ──→ Checkout/Stripe
       │                                        │
       │                                        ├──→ Rooming
       │                                        └──→ Documents (PDF)
       │
       ├──→ Onboarding Pro ──→ Validation Admin ──→ PayoutBatch
       │
       ├──→ Finance (TVA marge) ──→ Exports comptables
       │
       └──→ Notifications ──→ Emails ──→ Support
```

---

## RÈGLE D'EXÉCUTION

> **On fait ça en plusieurs étapes.** Chaque session = 1 tâche précise.
> Pas de big bang. On avance bloc par bloc, on teste, on valide, on passe au suivant.
>
> **Prochaine étape recommandée** : Phase 1, Semaine 1, Tâche 1 → Prisma migrate + seed réaliste

---

*Document généré le 18 mars 2026 — Source : COMPARAISON_DRAWIO_VS_SITE.xlsx + analyse du code existant*
