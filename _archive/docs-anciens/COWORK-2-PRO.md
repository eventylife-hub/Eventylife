# COWORK 2 — Portail PRO
> Mis à jour : 18 mars 2026

## 🎯 Objectif
Compléter toutes les pages et features du portail Pro d'Eventy.

---

## 📊 Avancement Global : 47 pages existantes + 2 nouvelles = 49 pages

### ✅ Pages EXISTANTES (fonctionnelles)
| # | Page | Route | Statut |
|---|------|-------|--------|
| 1 | Dashboard | `/pro/dashboard` | ✅ OK |
| 2 | Mes Voyages | `/pro/voyages` | ✅ OK |
| 3 | Voyage Détail | `/pro/voyages/[id]` | ✅ OK |
| 4 | Création Voyage | `/pro/voyages/nouveau` | ✅ OK |
| 5 | Revenus | `/pro/revenus` | ✅ OK |
| 6 | Relevé Revenus | `/pro/revenus/releve` | ✅ OK |
| 7 | Marketing Hub | `/pro/marketing` | ✅ OK |
| 8 | Marketing Détail | `/pro/marketing/[id]` | ✅ OK |
| 9 | Marketing Créer | `/pro/marketing/creer` | ✅ OK |
| 10 | Profil | `/pro/profil` | ✅ OK |
| 11 | Compte | `/pro/compte` | ✅ OK |
| 12 | Documents | `/pro/documents` | ✅ OK |
| 13 | Formation | `/pro/formation` | ✅ OK |
| 14 | Support | `/pro/support` | ✅ OK |
| 15 | Support Ticket | `/pro/support/[id]` | ✅ OK |
| 16 | Vendre | `/pro/vendre` | ✅ OK |
| 17 | Page Publique | `/p/[proSlug]` | ✅ OK |
| 18 | Messagerie | `/pro/messagerie` | ✅ OK |
| 19 | Finance | `/pro/finance` | ✅ OK |
| 20 | Réservations | `/pro/reservations` | ✅ OK |
| 21 | Arrêts (bus) | `/pro/arrets` | ✅ OK |
| 22 | Onboarding | `/pro/onboarding` | ✅ OK |
| 23 | Paramètres | `/pro/parametres` | ✅ OK |
| 24 | Inscription | `/pro/inscription` | ✅ OK |
| 25 | Login | `/pro/login` | ✅ OK |
| 26 | Forgot Password | `/pro/forgot-password` | ✅ OK |

### 🆕 Pages CRÉÉES ce 18 mars 2026
| # | Page | Route | Statut | Notes |
|---|------|-------|--------|-------|
| 27 | Paiements | `/pro/paiements` | ✅ CRÉÉE | Stats, filtres, historique détaillé, commissions |
| 28 | Notifications | `/pro/notifications` | ✅ CRÉÉE | Centre notifs, types, mark-as-read, badges |

### ❌ Pages RESTANTES à créer
| # | Page | Route | Priorité | Heures estimées |
|---|------|-------|----------|----------------|
| 29 | Magasin | `/pro/magasin` | P1 | ~8h |
| 30 | Annuaire | `/pro/annuaire` | P1 | ~5h |
| 31 | Association CE/Asso | `/pro/association` | P2 | ~6h |
| 32 | Wallet / Jetons | `/pro/wallet` | P1 | ~6h |
| 33 | Leads Inbox | `/pro/marketing/leads` | P1 | ~4h |

### ⚡ Features à AMÉLIORER sur pages existantes
| Page | Feature manquante | Priorité | Heures |
|------|-------------------|----------|--------|
| Voyages | Restauration avancée `/pro/voyages/[id]/restauration` | P1 | ~6h |
| Onboarding | 5 types de Pro (auto-entrepreneur, SASU, etc.) | P0 | ~12h |
| Création Voyage | Phase 2 complète (hébergement, activités) | P0 | ~15h |
| Marketing | Leads inbox avec badges, batch mark-as-read | P1 | ~4h |
| Revenus | Cotisations + Marketing Fund | P1 | ~8h |

---

## 🔧 À faire dans COWORK 2

### Session suivante (priorité P0)
1. [ ] Pro Magasin — dashboard, profil point de vente, QR
2. [ ] Pro Wallet / Jetons — multi-tier, tokens
3. [ ] Pro Annuaire — listing, follow, invitations

### Sessions ultérieures
4. [ ] Leads Inbox marketing
5. [ ] Association CE/Asso
6. [ ] Améliorer Onboarding 5 types
7. [ ] Améliorer Création Voyage Phase 2
8. [ ] Tests E2E pages Pro

---

## 📁 Fichiers modifiés/créés
```
frontend/app/(pro)/pro/paiements/page.tsx        ← NOUVEAU
frontend/app/(pro)/pro/notifications/page.tsx     ← NOUVEAU
```
