# INSTRUCTIONS COWORK — Partage de tâches (19 mars 2026)

> **MODE PARTAGE** : Chaque session Cowork pioche dans la liste ci-dessous.
> Quand tu prends une tâche, inscris ton nom de session et la date à côté.
> Lis **AME-EVENTY.md** en premier, toujours.

---

## ÉTAT DU PROJET (post-audit draw.io v53)

| Domaine | Complétion | Détail |
|---------|-----------|--------|
| **Frontend** | 90% | 165 pages, 203 API calls connectées, 0 erreurs TS |
| **Backend** | 78% | 31 modules, logique métier réelle — Transport Quotes = gap majeur |
| **Sprint Voyages** | 99% | 77/78 tâches terminées |
| **Sessions COWORK 1-8** | ✅ | Toutes terminées |
| **Audit draw.io** | ✅ | 1 798 pages auditées, écarts identifiés ci-dessous |

---

## TÂCHES DISPONIBLES — BACKEND P0 (CRITIQUE)

| Tâche | Module | État | Détail | Pris par | Date |
|-------|--------|------|--------|----------|------|
| **Transport Quotes workflow complet** | Transport | 0% logique | Créer devis, envoi auto prestataires, comparaison, validation, snapshot immutable | | |
| Compléter HRA Hub (hôtels, restaus, activités) | HRA | 65% | CRUD complet + search + disponibilités | | |
| Finir les 4 templates email manquants (10/14 → 14/14) | Email | 88% | Templates booking-confirm, trip-reminder, review-request, cancellation-refund | | |
| Prisma migration script production (up/down/rollback) | DB | 0% | Script migration + rollback + vérification intégrité | | |

---

## TÂCHES DISPONIBLES — BACKEND P1 (IMPORTANT)

| Tâche | Module | État | Détail | Pris par | Date |
|-------|--------|------|--------|----------|------|
| **Multi-bus / multi-segment transport** | Transport | 0% | Plusieurs bus par voyage, segments route différents | | |
| **Waitlist automation** (backend + triggers) | Bookings | 0% | File d'attente auto quand complet, notification place dispo | | |
| **PREANNOUNCE gating** | Bookings | 0% | Bloquer réservation avant date annonce officielle | | |
| **Relance paniers abandonnés** | Checkout | 0% | Cron + email auto pour paniers non finalisés | | |
| **Export comptable FEC** | Finance | 0% | Format Fichier des Écritures Comptables obligatoire | | |
| **Rapprochement bancaire auto** | Finance | 0% | Matching paiements Stripe vs écritures comptables | | |
| **TVA audit trail** | Finance | 0% | Historique complet modifications calculs TVA marge | | |
| **Runbook J0** (checklist jour départ) | Pro | 0% | Checklist automatisée pré-départ pour organisateur | | |
| **Duplicate Season** (cloner voyage) | Pro | 0% | Dupliquer un voyage pour saison suivante | | |
| **Safety Sheets** (fiches sécurité) | Pro | 0% | Fiches sécurité par destination, téléchargeables | | |
| **Quality Gate** (validation pré-publication) | Pro | 0% | Checklist qualité avant mise en ligne voyage | | |
| Compléter module SEO (slugs dynamiques, JSON-LD) | SEO | 60% | Slugs auto, structured data, sitemap | | |
| Compléter module Restauration (meal management) | Restauration | 70% | Gestion repas complète, allergies, menus | | |
| Compléter module Client (edge cases, workflows) | Client | 65% | Favoris, historique, edge cases | | |
| Compléter module Groups (social entity, smart invite) | Groups | 75% | Entité sociale, invitation intelligente | | |
| Compléter module Cancellation (edge cases remboursement) | Cancellation | 78% | Remboursements partiels, frais variables | | |
| Cron jobs métier (rappels, expirations, nettoyage) | Cron | 70% | Reminders, expiry, cleanup auto | | |
| CI/CD pipeline GitHub Actions (build → test → deploy) | DevOps | 0% | Pipeline complète staging + production | | |

---

## TÂCHES DISPONIBLES — BACKEND P2 (PEUT ATTENDRE)

| Tâche | Module | État | Détail | Pris par | Date |
|-------|--------|------|--------|----------|------|
| Compléter module Post-sale (post-trip services) | Post-sale | 70% | Avis, réclamations, fidélisation | | |
| Charter editor transport | Transport | 0% | Éditeur charte transport (draw.io spec) | | |
| Google Maps integration stops | Transport | 0% | Carte interactive au lieu de texte | | |
| Vehicle/driver management backend | Transport | 0% | CRUD véhicules + chauffeurs | | |
| Flight management automation | Transport | 30% | Soft-freeze auto, gestion vols | | |
| Dashboard transport admin (5 KPI tiles) | Transport | 20% | Stats avancées spécifiées draw.io | | |
| Ledger analytics (graphes CA) | Finance | 0% | Évolution chiffre d'affaires temps réel | | |
| Performance optimization (caching, query optim) | Infra | Baseline | Redis cache, query optimization | | |
| Portail Hôtelier | Pro+HRA | 0% | Nouveau portail partenaire hôtels | | |
| Portail Restaurateur | Pro+HRA | 0% | Nouveau portail partenaire restos | | |
| Bibliothèque parcours | Content | 0% | Templates de parcours/itinéraires | | |
| Purge Simulation | Admin | 0% | Utilitaire nettoyage données | | |

---

## TÂCHES DISPONIBLES — FRONTEND

| Tâche | Pages concernées | Priorité | Pris par | Date |
|-------|-----------------|----------|----------|------|
| Tests E2E Playwright (3 portails) | Toutes | P0 | | |
| **30+ pages admin manquantes** (archives, audit timeline, finance planner, ops monitoring) | /admin/* | P1 | | |
| Tâche 4.8 Sprint Voyages (migration Prisma) | Voyages | P0 | | |
| Pages Waitlist UI | /client/bookings | P1 | | |
| Pages Dynamic room pricing UI | /pro/voyages | P1 | | |
| Audit accessibilité WCAG 2.1 AA + corrections | Toutes | P1 | | |
| Audit performance Lighthouse + optimisation | Toutes | P1 | | |
| Mettre à jour pages HRA quand backend terminé | /admin/hra, /pro/hra | P1 | | |
| Mettre à jour pages Restauration quand backend terminé | /admin/restauration | P1 | | |
| Polish micro-interactions (animations, transitions) | UI globale | P2 | | |

---

## TÂCHES DISPONIBLES — DÉPLOIEMENT

| Tâche | Détail | Priorité | Pris par | Date |
|-------|--------|----------|----------|------|
| Setup environnement production (DB, cache, CDN, monitoring) | Infra | P0 | | |
| Go-live checklist (sécurité, compliance, backups) | Ops | P0 | | |
| Deployment dry-run (simulation production complète) | Ops | P1 | | |
| Tests de charge k6 (scénarios réalistes) | Perf | P1 | | |
| Tests sécurité OWASP top 10 | Sécu | P1 | | |

---

## RÈGLES POUR LES COWORK

1. **Lis AME-EVENTY.md en premier** — c'est l'âme du projet
2. **Prends une tâche** — inscris ton nom de session et la date dans le tableau
3. **Une tâche à la fois** — termine avant d'en prendre une autre
4. **Commite régulièrement** — petit commits clairs
5. **Mets à jour PROGRESS.md** — note ce que tu as fait
6. **Signale les blocages** — si tu es bloqué, note-le dans le tableau
7. **Réfère-toi au draw.io** — `eventy_v53_COMPLET_PRET_CODAGE.drawio` pour les specs détaillées

---

## DOCUMENTS DE RÉFÉRENCE

| Document | Rôle |
|----------|------|
| `AME-EVENTY.md` | Manifeste fondateur — **LIRE EN PREMIER** |
| `PROGRAMME-DEVELOPPEMENT.md` | État réel du projet + plan final |
| `MEGA-AUDIT-19-MARS-2026.md` | Audit complet drawio vs code |
| `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` | Écarts détaillés catalogue/détail |
| `ROADMAP-PRODUIT.md` | Priorisation features |
| `pdg-eventy/ETAT-COWORK-FRONT.md` | Mémoire sessions frontend |
| `pdg-eventy/DASHBOARD-PDG.md` | Dashboard PDG central |

---

## HISTORIQUE — Sessions terminées

| Session | Scope | Résultat |
|---------|-------|----------|
| COWORK-1-ADMIN | Portail Admin (39 pages) | ✅ |
| COWORK-2-PRO | Portail Pro (50 pages) | ✅ |
| COWORK-3-CLIENT | Portail Client + Public (53 pages) | ✅ |
| COWORK-4-BACK-FONDATIONS | Infra + Auth + Users + Onboarding | ✅ |
| COWORK-5-BACK-COEUR-METIER | Voyage + Booking + Finance | ✅ |
| COWORK-6-BACK-OPERATIONS | Notifs + Docs + Support + Sécu | ✅ |
| COWORK-7-ECARTS-DRAWIO | 77/78 tâches Sprint Voyages | ✅ |
| COWORK-8-FEATURES-AVANCEES | Quality Gate, Runbook, Safety Sheets | ✅ |
| COWORK-9-AUDIT | Audit draw.io v53 complet (7 agents) | ✅ |

**Bilan** : 165 pages, 31 modules, 113 modèles Prisma, 0 erreur TS, 3 300+ tests.

---

*Mis à jour le 19 mars 2026 — Post-audit draw.io v53 complet*
