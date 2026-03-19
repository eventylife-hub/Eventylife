# PROGRAMME FRONTEND — Eventy Life

> **Cowork dédié** : FRONTEND uniquement
> **Date** : 18 mars 2026
> **Objectif** : Connecter les 135 pages existantes à l'API backend réelle, créer les ~20 pages manquantes

---

## ÉTAT DU FRONTEND

| Élément | Quantité | Statut |
|---------|----------|--------|
| Pages totales | 135 | ✅ UI codée |
| Composants | 144 | ✅ |
| Hooks custom | ~30 | ✅ |
| Portail Public | 25 pages | ✅ UI complète |
| Portail Client | 23 pages | ⚠️ 6 manquantes |
| Portail Pro | 47 pages | ⚠️ 8 manquantes |
| Portail Admin | 27 pages | ⚠️ 11 manquantes |
| Auth | 11 pages | ✅ |
| Checkout | 5 pages | ✅ |

### Problème principal
Toutes les pages affichent des **données mockées en dur**. Aucune page ne consomme l'API backend réelle.

---

## PLAN PAR LOT — ORDRE D'EXÉCUTION

### ══════════════════════════════════════
### LOT F0 — INFRA FRONTEND (Jour 1-2)
### ══════════════════════════════════════

| # | Tâche | Fichiers | Détail |
|---|-------|----------|--------|
| F0.1 | Configurer `NEXT_PUBLIC_API_URL` | `.env.local` | Variable d'environnement backend |
| F0.2 | Créer client API centralisé (fetch + interceptors) | `lib/api-client.ts` | Auth headers, refresh token, error handling |
| F0.3 | Créer hook `useAuth` avec context | `hooks/useAuth.tsx` | Login, logout, register, refresh, user state |
| F0.4 | Créer hook `useApi` générique | `hooks/useApi.ts` | GET/POST/PUT/DELETE avec loading/error |
| F0.5 | Middleware auth Next.js | `middleware.ts` | Redirect non-connecté → login |
| F0.6 | Error Boundary global | `app/error.tsx` | Catch erreurs, affichage propre |
| F0.7 | Zustand stores (auth, notifications, cart) | `stores/` | State management global |

---

### ══════════════════════════════════════
### LOT F1 — AUTH RÉELLE (Jour 3)
### ══════════════════════════════════════

| # | Page | Route | Tâche |
|---|------|-------|-------|
| F1.1 | Connexion | `/connexion` | Connecter formulaire → `POST /auth/login` |
| F1.2 | Inscription | `/inscription` | Connecter → `POST /auth/register` |
| F1.3 | Mot de passe oublié | `/mot-de-passe-oublie` | → `POST /auth/forgot-password` |
| F1.4 | Réinitialiser | `/reinitialiser-mot-de-passe` | → `POST /auth/reset-password` |
| F1.5 | Vérification email | `/verification-email` | → `POST /auth/verify-email` |
| F1.6 | Login Pro | `/pro/login` | → `POST /auth/login` avec redirect Pro |
| F1.7 | Login Admin | `/admin-login` | → `POST /auth/login` avec guard ADMIN |
| F1.8 | Refresh token | Hook global | Auto-refresh avant expiration |

---

### ══════════════════════════════════════
### LOT F2 — PORTAIL CLIENT (Jour 4-7)
### ══════════════════════════════════════

#### Pages existantes à connecter
| # | Page | Route | API à connecter |
|---|------|-------|-----------------|
| F2.1 | Dashboard client | `/client/dashboard` | `GET /client/dashboard` |
| F2.2 | Mes réservations | `/client/reservations` | `GET /client/bookings` |
| F2.3 | Détail réservation | `/client/reservations/[id]` | `GET /client/bookings/:id` |
| F2.4 | Profil | `/client/profil` | `GET/PUT /client/profile` |
| F2.5 | Paiements | `/client/paiements` | `GET /client/payments` |
| F2.6 | Documents | `/client/documents` | `GET /client/documents` |
| F2.7 | Groupes | `/client/groupes` | `GET /client/groups` |
| F2.8 | Support | `/client/support` | `POST /support/tickets` |
| F2.9 | Notifications | `/client/notifications` | `GET /client/notifications` |
| F2.10 | Wallet | `/client/wallet` | `GET /client/wallet` |
| F2.11 | Avis | `/client/avis` | `GET/POST /client/reviews` |
| F2.12 | Assurance | `/client/assurance` | `GET /client/insurance` |

#### Pages à CRÉER
| # | Page | Route | API |
|---|------|-------|-----|
| F2.13 | **Favoris** | `/client/favoris` | `GET /client/favorites` |
| F2.14 | **Urgence** | `/client/urgence` | `GET /client/emergency` |
| F2.15 | **Préférences notifs** | `/client/notifications/preferences` | `PUT /client/notification-prefs` |
| F2.16 | **Préférences marketing** | `/client/preferences-marketing` | `PUT /client/marketing-prefs` |
| F2.17 | **Pourboire** | `/client/pourboire` | `POST /client/tips` |
| F2.18 | **Credit Wallet enrichi** | `/client/wallet` | Enrichir page existante |

---

### ══════════════════════════════════════
### LOT F3 — CHECKOUT (Jour 8-9)
### ══════════════════════════════════════

| # | Page | Route | API |
|---|------|-------|-----|
| F3.1 | Start | `/checkout/start` | `POST /checkout/init` |
| F3.2 | Step 1 (infos voyageurs) | `/checkout/step-1` | `POST /checkout/passengers` |
| F3.3 | Step 2 (options/assurance) | `/checkout/step-2` | `POST /checkout/options` |
| F3.4 | Step 3 (paiement Stripe) | `/checkout/step-3` | `POST /checkout/create-session` → Stripe |
| F3.5 | Confirmation | `/checkout/confirmation` | `GET /checkout/:id/confirmation` |

**Critique** : Intégrer Stripe Elements ou Redirect, gérer les webhooks côté client.

---

### ══════════════════════════════════════
### LOT F4 — PORTAIL PRO (Jour 10-14)
### ══════════════════════════════════════

#### Pages existantes à connecter
| # | Page | Route | API |
|---|------|-------|-----|
| F4.1 | Dashboard Pro | `/pro/dashboard` | `GET /pro/dashboard` |
| F4.2 | Mes voyages | `/pro/voyages` | `GET /pro/travels` |
| F4.3 | Créer voyage | `/pro/voyages/nouveau` | `POST /pro/travels` (wizard) |
| F4.4 | Détail voyage | `/pro/voyages/[id]` | `GET /pro/travels/:id` |
| F4.5 | Réservations voyage | `/pro/voyages/[id]/reservations` | `GET /pro/travels/:id/bookings` |
| F4.6 | Finance voyage | `/pro/voyages/[id]/finance` | `GET /pro/travels/:id/finance` |
| F4.7 | Transport voyage | `/pro/voyages/[id]/transport` | `GET /pro/travels/:id/transport` |
| F4.8 | Rooming | `/pro/voyages/[id]/rooming` | `GET /pro/travels/:id/rooming` |
| F4.9 | Revenus Pro | `/pro/revenus` | `GET /pro/revenues` |
| F4.10 | Marketing | `/pro/marketing` | `GET /pro/marketing/campaigns` |
| F4.11 | Messagerie | `/pro/messagerie` | `GET /pro/messages` |
| F4.12 | Onboarding | `/pro/onboarding` | `POST /pro/onboarding` |
| F4.13 | Compte/Profil | `/pro/compte` | `GET/PUT /pro/profile` |
| F4.14 | Paramètres | `/pro/parametres` | `GET/PUT /pro/settings` |

#### Pages à CRÉER
| # | Page | Route | API |
|---|------|-------|-----|
| F4.15 | **Paiements Pro** | `/pro/paiements` | `GET /pro/payouts` |
| F4.16 | **Notifications** | `/pro/notifications` | `GET /pro/notifications` |
| F4.17 | **Magasin** | `/pro/magasin` | `GET /pro/shop` |
| F4.18 | **Annuaire indés** | `/pro/annuaire` | `GET /pro/directory` |
| F4.19 | **Hub CE/Asso** | `/pro/association` | `GET /pro/associations` |
| F4.20 | **Wallet Pro** | `/pro/wallet` | `GET /pro/wallet` |
| F4.21 | **Leads inbox** | `/pro/marketing/leads` | `GET /pro/leads` |
| F4.22 | **Restauration enrichie** | `/pro/voyages/[id]/restauration` | Enrichir |

---

### ══════════════════════════════════════
### LOT F5 — PORTAIL ADMIN (Jour 15-19)
### ══════════════════════════════════════

#### Pages existantes à connecter
| # | Page | Route | API |
|---|------|-------|-----|
| F5.1 | Dashboard | `/admin/dashboard` | `GET /admin/dashboard` |
| F5.2 | Voyages | `/admin/voyages` | `GET /admin/travels` |
| F5.3 | Réservations | `/admin/bookings` | `GET /admin/bookings` |
| F5.4 | Finance | `/admin/finance` | `GET /admin/finance` |
| F5.5 | Utilisateurs | `/admin/utilisateurs` | `GET /admin/users` |
| F5.6 | Pros | `/admin/pros` | `GET /admin/pros` |
| F5.7 | Transport | `/admin/transport` | `GET /admin/transport` |
| F5.8 | Support | `/admin/support` | `GET /admin/support/tickets` |
| F5.9 | Marketing | `/admin/marketing` | `GET /admin/marketing` |
| F5.10 | Monitoring | `/admin/monitoring` | `GET /admin/health` |

#### Pages à CRÉER
| # | Page | Route | API |
|---|------|-------|-----|
| F5.11 | **Validation Pro** | `/admin/validation-pro` | `GET/PUT /admin/pro-validation` |
| F5.12 | **Équipes** | `/admin/equipes` | `GET /admin/teams` |
| F5.13 | **Fournisseurs** | `/admin/fournisseurs` | `GET /admin/suppliers` |
| F5.14 | **Finance avancée** | `/admin/finance/payouts` | `GET /admin/payouts` |
| F5.15 | **Restauration** | `/admin/restauration` | `GET /admin/meals` |
| F5.16 | **Intégrations** | `/admin/integrations` | `GET /admin/integrations` |
| F5.17 | **Feature Flags** | `/admin/feature-flags` | `GET /admin/features` |
| F5.18 | **Leads Marketing** | `/admin/marketing/leads` | `GET /admin/leads` |
| F5.19 | **HRA** | `/admin/hra` | `GET /admin/hra` |
| F5.20 | **Communications** | `/admin/communications` | `GET /admin/communications` |
| F5.21 | **Planning** | `/admin/planning` | `GET /admin/planning` |

---

### ══════════════════════════════════════
### LOT F6 — PUBLIC + SEO (Jour 20-21)
### ══════════════════════════════════════

| # | Page | Route | Tâche |
|---|------|-------|-------|
| F6.1 | Homepage | `/` | Connecter voyages réels, SEO meta |
| F6.2 | Catalogue | `/voyages` | `GET /public/travels` + filtres |
| F6.3 | Détail voyage | `/voyages/[slug]` | `GET /public/travels/:slug` + JSON-LD |
| F6.4 | Page Pro publique | `/p/[proSlug]` | `GET /public/pros/:slug` |
| F6.5 | FAQ | `/faq` | Contenu dynamique |
| F6.6 | Blog | `/blog` | SSG si contenu statique |
| F6.7 | Contact | `/contact` | Formulaire → `POST /public/contact` |

---

### ══════════════════════════════════════
### LOT F7 — POLISH & TESTS (Jour 22-25)
### ══════════════════════════════════════

| # | Tâche |
|---|-------|
| F7.1 | Tests E2E Playwright : parcours client complet |
| F7.2 | Tests E2E : parcours Pro complet |
| F7.3 | Tests E2E : parcours Admin |
| F7.4 | Responsive mobile (draw.io DEV_020) |
| F7.5 | Accessibilité WCAG 2.1 AA (draw.io DEV_003) |
| F7.6 | Bundle size optimization (draw.io T-113) |
| F7.7 | SSR/SSG/ISR correctement configurés (draw.io T-110) |
| F7.8 | Images optimisées Next/Image (draw.io T-112) |
| F7.9 | Sentry error boundaries |
| F7.10 | Loading states + skeleton screens partout |

---

## RÉSUMÉ

| Lot | Jours | Pages connectées | Pages créées |
|-----|-------|-----------------|--------------|
| F0 Infra | 2 | 0 | 0 |
| F1 Auth | 1 | 8 | 0 |
| F2 Client | 4 | 12 | 6 |
| F3 Checkout | 2 | 5 | 0 |
| F4 Pro | 5 | 14 | 8 |
| F5 Admin | 5 | 10 | 11 |
| F6 Public | 2 | 7 | 0 |
| F7 Polish | 4 | 0 | 0 |
| **Total** | **25** | **56** | **25** |

---

## ÉLÉMENTS DU DRAW.IO VÉRIFIÉS

Ces diagrammes draw.io sont les specs à suivre pour chaque lot :

| Lot | Diagrammes draw.io correspondants |
|-----|----------------------------------|
| F0 | DEV_000 (Env Setup), DEV_001 (Project Structure) |
| F1 | DEV_010 (Auth Flow JWT Refresh 2FA), 96-98 (EmailVerify ResetPw) |
| F2 | CLIENT_HOME → CLIENT_LEGAL (12 diagrammes client), DEV_008 |
| F3 | DEV_002 (Checkout 5 étapes), 117-119 (RoomBooking SplitPay) |
| F4 | DEV_009 (Onboarding 5 types), PRO pages, 111-116 (Annuaire, Équipes) |
| F5 | Admin pages draw.io, DEV_019 (Admin Dashboard UI), 285 (Feature Flags) |
| F6 | 10/12 (PagePro Public), DEV_020 (Mobile Responsive) |
| F7 | DEV_003 (WCAG), DEV_021 (Testing), T-110→T-118 (perf/monitoring) |

---

*Généré le 18 mars 2026 — Cowork Frontend uniquement*
