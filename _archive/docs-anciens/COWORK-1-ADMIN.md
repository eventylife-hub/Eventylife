# COWORK 1 — Portail ADMIN
> Mis à jour : 18 mars 2026

## 🎯 Objectif
Compléter toutes les pages et features du portail Admin d'Eventy.

---

## 📊 Avancement Global : 27 pages existantes + 7 nouvelles = 34 pages

### ✅ Pages EXISTANTES (fonctionnelles)
| # | Page | Route | Statut |
|---|------|-------|--------|
| 1 | Tableau de bord | `/admin` | ✅ OK |
| 2 | Finance Snapshot | `/admin/finance` | ✅ OK (basique — voir améliorations) |
| 3 | Ops Voyages | `/admin/voyages` | ✅ OK |
| 4 | Transport | `/admin/transport` | ✅ OK |
| 5 | Rooming | `/admin/rooming` | ✅ OK |
| 6 | Validation Pro | `/admin/pros` | ✅ OK |
| 7 | Documents | `/admin/documents` | ✅ OK |
| 8 | Support | `/admin/support` | ✅ OK |
| 9 | Marketing | `/admin/marketing` | ✅ OK |
| 10 | Réservations | `/admin/bookings` | ✅ OK |
| 11 | Annulations | `/admin/annulations` | ✅ OK |
| 12 | Utilisateurs | `/admin/utilisateurs` | ✅ OK |
| 13 | Audit Log | `/admin/audit` | ✅ OK |
| 14 | Paramètres | `/admin/parametres` | ✅ OK (inclut feature flags) |
| 15 | Monitoring | `/admin/monitoring` | ✅ OK |
| 16 | Exports | `/admin/exports` | ✅ OK |
| 17 | Alertes | `/admin/alertes` | ✅ OK |
| 18 | Notifications | `/admin/notifications` | ✅ OK |

### 🆕 Pages CRÉÉES ce 18 mars 2026
| # | Page | Route | Statut | Notes |
|---|------|-------|--------|-------|
| 19 | Équipes | `/admin/equipes` | ✅ CRÉÉE | Gestion membres, services, permissions |
| 20 | Fournisseurs | `/admin/fournisseurs` | ✅ CRÉÉE | CRUD, contrats, paiements, rating |
| 21 | Restauration | `/admin/restauration` | ✅ CRÉÉE | Déclarations, litiges, stats |
| 22 | Communications Hub | `/admin/communications` | ✅ CRÉÉE | Inbox, templates, SLA |
| 23 | Planning 18M | `/admin/planning` | ✅ CRÉÉE | Timeline Gantt + liste, multi-services |

### ❌ Pages RESTANTES à créer
| # | Page | Route | Priorité | Heures estimées |
|---|------|-------|----------|----------------|
| 24 | Intégrations | `/admin/integrations` | P2 | ~4h |
| 25 | HRA Hub | `/admin/hra` | P1 | ~6h |
| 26 | Leads Marketing | `/admin/marketing/leads` | P1 | ~4h |

### ⚡ Features à AMÉLIORER sur pages existantes
| Page | Feature manquante | Priorité | Heures |
|------|-------------------|----------|--------|
| Finance | PayoutBatch — interface batch paiements | P0 | ~8h |
| Finance | LedgerInspector — vérification comptable | P0 | ~6h |
| Finance | TVA marge — calcul et exports | P0 | ~8h |
| Finance | Exports compta (cabinet) | P0 | ~4h |
| Paramètres | Feature Flags avancé (4-eyes, break-glass) | P1 | ~6h |

---

## 🔧 À faire dans COWORK 1

### Session suivante (priorité P0)
1. [ ] Ajouter les nouvelles pages dans la sidebar admin (`layout.tsx`)
2. [ ] Finance avancé — sous-pages PayoutBatch + TVA marge
3. [ ] Admin Intégrations

### Sessions ultérieures
4. [ ] HRA Hub complet
5. [ ] Leads Marketing sous-page
6. [ ] Feature Flags avancé dans Paramètres
7. [ ] Tests unitaires pages admin
8. [ ] États responsive mobile polish

---

## 📁 Fichiers modifiés/créés
```
frontend/app/(admin)/admin/equipes/page.tsx          ← NOUVEAU
frontend/app/(admin)/admin/fournisseurs/page.tsx      ← NOUVEAU
frontend/app/(admin)/admin/restauration/page.tsx      ← NOUVEAU
frontend/app/(admin)/admin/communications/page.tsx    ← NOUVEAU
frontend/app/(admin)/admin/planning/page.tsx          ← NOUVEAU
```
