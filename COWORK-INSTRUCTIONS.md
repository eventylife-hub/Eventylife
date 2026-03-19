# INSTRUCTIONS COWORK — Partage de tâches (19 mars 2026)

> **MODE PARTAGE** : Chaque session Cowork pioche dans la liste ci-dessous.
> Quand tu prends une tâche, inscris ton nom de session et la date à côté.
> Lis **AME-EVENTY.md** en premier, toujours.

---

## ÉTAT DU PROJET

| Domaine | Complétion | Détail |
|---------|-----------|--------|
| **Frontend** | 90% | 165 pages, 203 API calls connectées, 0 erreurs TS |
| **Backend** | 82% | 31 modules avec logique métier réelle, 3 300+ tests |
| **Sprint Voyages** | 99% | 77/78 tâches terminées |
| **Sessions COWORK 1-8** | ✅ | Toutes terminées |

---

## TÂCHES DISPONIBLES — BACKEND

Chaque Cowork prend une ou plusieurs tâches et inscrit son nom.

| Tâche | Module | État actuel | Priorité | Pris par | Date |
|-------|--------|------------|----------|----------|------|
| Compléter HRA Hub (hôtels, restaus, activités) | HRA | 65% | P0 | | |
| Compléter module SEO (slugs dynamiques, JSON-LD) | SEO | 60% | P1 | | |
| Compléter module Restauration (meal management) | Restauration | 70% | P1 | | |
| Compléter module Client (edge cases, workflows) | Client | 65% | P1 | | |
| Compléter module Post-sale (post-trip services) | Post-sale | 70% | P2 | | |
| Finir les 4 templates email manquants (10/14 → 14/14) | Email | 88% | P0 | | |
| Cron jobs métier (rappels, expirations, nettoyage) | Cron | 70% | P1 | | |
| Compléter module Groups (social entity, smart invite) | Groups | 75% | P1 | | |
| Compléter module Cancellation (edge cases remboursement) | Cancellation | 78% | P1 | | |
| Prisma migration script production (up/down/rollback) | DB | 0% | P0 | | |
| CI/CD pipeline GitHub Actions (build → test → deploy) | DevOps | 0% | P1 | | |
| Performance optimization (caching, query optim) | Infra | Baseline | P2 | | |

---

## TÂCHES DISPONIBLES — NOUVELLES FEATURES

| Tâche | Description | Priorité | Pris par | Date |
|-------|------------|----------|----------|------|
| Portail Hôtelier | Nouveau portail partenaire hôtels | P2 | | |
| Portail Restaurateur | Nouveau portail partenaire restos | P2 | | |
| Bibliothèque parcours | Templates de parcours/itinéraires | P2 | | |
| Transport Quote Auto | Système de devis transport auto | P2 | | |
| Purge Simulation | Utilitaire nettoyage données | P2 | | |

---

## TÂCHES DISPONIBLES — FRONTEND

| Tâche | Pages concernées | Priorité | Pris par | Date |
|-------|-----------------|----------|----------|------|
| Tests E2E Playwright (3 portails) | Toutes | P0 | | |
| Audit accessibilité WCAG 2.1 AA + corrections | Toutes | P1 | | |
| Audit performance Lighthouse + optimisation | Toutes | P1 | | |
| Polish micro-interactions (animations, transitions) | UI globale | P2 | | |
| Tâche 4.8 Sprint Voyages (migration Prisma) | Voyages | P0 | | |
| Mettre à jour pages HRA quand backend terminé | /admin/hra, /pro/hra | P1 | | |
| Mettre à jour pages Restauration quand backend terminé | /admin/restauration | P1 | | |

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

**Bilan** : 165 pages, 31 modules, 113 modèles Prisma, 0 erreur TS, 3 300+ tests.

---

*Mis à jour le 19 mars 2026 — Mode partage Cowork*
