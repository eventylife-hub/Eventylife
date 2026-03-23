# Vérification Croisée API Backend ↔ Frontend
*Date : 2026-03-23 — Sprint de vérification complète*

---

## Résumé exécutif

| Métrique | Valeur |
|---|---|
| Contrôleurs backend | 74 |
| Décorateurs HTTP backend | 858 |
| Appels API frontend (apiClient) | 135 uniques |
| Bugs corrigés (mauvaises routes) | 7 |
| Routes ajoutées au backend | 9 |
| Routes orphelines backend (sans frontend) | ~650+ (modules avancés non exposés en UI) |
| Appels orphelins frontend (sans backend) | ~15 |

---

## Sprint 1 — Contrôleurs backend (74 au total)

| Module | Contrôleur | Base path |
|---|---|---|
| Activities | activity-catalog | `@Controller()` |
| Activities | activity-providers | `activity-providers` |
| Activities | activity-stripe | `@Controller()` |
| Admin | admin | `admin` |
| Auth | auth | `auth` |
| Bookings | bookings | `bookings` |
| Bookings | preannounce-gating | — |
| Bookings | waitlist | `waitlist` |
| Cancellation | cancellation | `cancellations` |
| Checkout | admin-checkout | `admin` |
| Checkout | checkout-advanced | `checkout` |
| Checkout | checkout | `checkout` |
| Checkout | cross-sell | — |
| Client | client | `client` |
| Documents | admin-documents | `admin/documents` |
| Documents | documents | `documents` |
| Exports | exports | `admin/exports` |
| Finance | close-pack | `finance/close-pack` |
| Finance | finance-advanced | `finance` |
| Finance | finance | `finance` |
| Groups | groups | `groups` |
| Health | health | `health` |
| HRA | hra | `hra` |
| HRA | referral | `hra` |
| Insurance | insurance | `insurance` |
| Legal | dsar | `legal/dsar` |
| Legal | legal | `legal` |
| Local Resources | local-resources | `local-resources` |
| Marketing | marketing | `marketing` |
| Missions | missions | `missions` |
| Notebook | notebook | — |
| Notifications | notifications | `notifications` |
| Payments | payments | `payments` |
| Payments | webhook | — |
| Post-sale | post-sale | `post-sale` |
| Pro | assisted-booking | `pro/assisted-booking` |
| Pro | bus-stops | `pro/bus-stops` |
| Pro | formation | `pro` (training/*) |
| Pro | pro-messagerie | `pro/messagerie` |
| Pro | onboarding | `pro/onboarding` |
| Pro | packages | `pro/packages` |
| Pro | payment-links | `pro/payment-links` |
| Pro | pro-advanced | `pro` |
| Pro | pro | `pro` |
| Pro | public-quick-sell | `public/r` |
| Pro | quick-sell-enhanced | `pro/quick-sell` |
| Pro | quick-sell | `pro/quick-sell` |
| Pro | quotes | `pro/quotes` |
| Pro | pro-revenues | `pro/revenues` |
| Pro | runbook | `pro/runbook` |
| Pro | sales-dashboard | `pro/sales-dashboard` |
| Pro | social-share | — |
| Pro | travel-activities | — |
| Pro | pro-travels | `pro/travels` + `pro/travels/:travelId/flights` |
| Pro | viral-growth | `pro/viral-growth` |
| Pro | widget | `public/embed` + `pro/widget` |
| Public | public | `public` |
| Restauration | restauration | `restauration` |
| Reviews | reviews | `reviews` |
| Rooming | rooming | `rooming` |
| SEO | seo | `seo` |
| Sponsors | sponsors | `sponsors` |
| Support | support | `support` |
| Transport | charter-finance | — |
| Transport | flight-allotment | — |
| Transport | route-packs | `transport` |
| Transport | seat-management | `transport/seats` |
| Transport | transport-advanced | `transport` |
| Transport | transport-pricing | `transport/pricing` |
| Transport | transport-quotes | `transport` |
| Transport | transport-status | `transport/status` |
| Transport | transport | `transport` |
| Travels | travel-lifecycle | `travels` |
| Travels | travels | `travels` |
| Uploads | uploads | `uploads` |
| Users | users | `users` |

---

## Sprint 2 — Appels API frontend (135 uniques)

Les appels passent par `apiClient` (lib/api-client.ts) ou directement via `fetch`.
- Client-side : `baseUrl = ''` → Next.js proxy `/api/*` → backend
- Server-side : `baseUrl = NEXT_PUBLIC_API_URL`

Routes `/api/pro/*` → passent par le proxy Next.js (next.config.js rewrite)

---

## Sprint 3 — Comparaison croisée

### ✅ Modules bien couverts
- **auth** : login, register, forgot-password, verify-email, 2fa, change-password → ✅
- **bookings** : list, detail, cancel, rooming → ✅
- **checkout** : participants, rooms → ✅
- **cancellations** : refund, process → ✅
- **documents** : approve, reject, upload → ✅
- **finance/close-pack** : admin queue, stats, validate, finalize, reject, transfer → ✅
- **groups** : join, invite, leave, messages → ✅
- **notifications** : mark-all-read, send, templates → ✅
- **post-sale** : send-bilan, archive → ✅
- **pro/travels** : CRUD, duplicate, flights, team → ✅
- **pro/payment-links** : CRUD → ✅
- **pro/route-packs** : CRUD, export, duplicate, share, approve → ✅
- **pro/onboarding** : steps, complete → ✅
- **pro/viral-growth** : metrics, leaderboard → ✅
- **pro/packages** : calculate, surcharges, marketing → ✅
- **pro/assisted-bookings** : list, create → ✅
- **pro/widget** : config → ✅
- **reviews** : mine, pro stats → ✅
- **rooming** : hotel-blocks → ✅
- **support** : tickets, messages → ✅
- **transport** : config, status/report → ✅
- **admin** : users, travels, documents, cancellations, feature-flags, settings, teams, finance, exports, missions, sponsors, route-packs → ✅

---

## Sprint 4 — Routes orphelines

### 🔴 Appels frontend SANS route backend correspondante

| Frontend appelle | Backend a | Statut |
|---|---|---|
| `GET /client/voyages/:id` | `GET /client/bookings/:id` | **CORRIGÉ** |
| `GET /public/pro/:slug` | `GET /public/pros/:slug` | **CORRIGÉ** |
| `GET /public/pro/:slug/upcoming-trips` | `GET /public/pros/:slug/upcoming-trips` | **CORRIGÉ + ROUTE AJOUTÉE** |
| `GET /pro/trips` | `GET /pro/quick-sell/trips` | **CORRIGÉ** |
| `GET /pro/voyages/:id` | `GET /pro/travels/:id` | **CORRIGÉ** |
| `POST /pro/voyages/:id/clone` | `POST /pro/travels/:id/duplicate` | **CORRIGÉ** |
| `PATCH /admin/local-resources/:id/verify` | `PATCH /admin/travels/:travelId/local-resources/:id/verify` | **CORRIGÉ + ROUTE AJOUTÉE** |
| `DELETE /admin/local-resources/:id` | Inexistant | **ROUTE AJOUTÉE** |
| `GET /admin/local-resources` | Inexistant | **ROUTE AJOUTÉE** |
| `GET /admin/local-resources/stats` | Inexistant | **ROUTE AJOUTÉE** |
| `POST /client/travels/:id/emergency` | Inexistant | **ROUTE AJOUTÉE** |
| `POST /client/travels/:id/emergency-alert` | Inexistant | **ROUTE AJOUTÉE** |
| `POST /admin/system/lockdown` | Inexistant | **ROUTE AJOUTÉE** |
| `GET /admin/forfaits/overview` | Inexistant (forfaits = pro/packages) | ⚠️ À documenter |
| `GET /admin/forfaits/stats` | Inexistant | ⚠️ À documenter |
| `GET /admin/emails/dead-letter/*` | `GET /admin/monitoring/emails` | ⚠️ Chemin différent |
| `POST /admin/emails/dead-letter/:id/retry` | Inexistant | ⚠️ À ajouter |
| `/api/pro/activites/*` (9 fichiers) | `/activity-providers/*` | ⚠️ Proxy Next.js → chemin différent |

### 🟡 Routes backend SANS appel frontend (backend plus riche que le frontend)

Ces routes existent côté backend mais ne sont pas appelées par le frontend actuel :
- Toutes les routes avancées de transport (charter, flight-allotment, seat-management)
- Routes de gestion des révisions admin avancées
- Routes viral-growth détaillées
- Routes SEO (gérées côté serveur)
- Routes de widget public (/public/embed)
- Routes de run-book pro
- Routes missions pro
- Formation avancée (themes/:slug, videos/:id)

---

## Sprint 5 — Vérification des DTOs critiques

### AUTH
| Champ frontend | DTO backend | Compatibilité |
|---|---|---|
| `POST /auth/login` : `{ email, password }` | LoginDto : `email, password` | ✅ |
| `POST /auth/register` : `{ email, password, firstName, lastName }` | RegisterDto : idem | ✅ |
| `POST /auth/forgot-password` : `{ email }` | ForgotPasswordDto : `email` | ✅ |
| `POST /auth/verify-email` : `{ token }` | VerifyEmailDto : `token` | ✅ |
| `POST /auth/reset-password` : `{ token, password }` | ResetPasswordDto : idem | ✅ |
| `POST /auth/change-password` : `{ currentPassword, newPassword }` | ChangePasswordDto : idem | ✅ |

### CHECKOUT
| Champ frontend | Route backend | Compatibilité |
|---|---|---|
| `POST /checkout/:id/participants` | `POST /checkout/:bookingGroupId/participants` | ✅ |
| `POST /checkout/:id/rooms` | `POST /checkout/:bookingGroupId/rooms` | ✅ |

### BOOKINGS
| Appel frontend | Route backend | Compatibilité |
|---|---|---|
| `POST /client/bookings/:id/cancel` | `POST /client/bookings/:id/cancel` | ✅ |
| `POST /client/bookings/:id/rooming` | `POST /client/bookings/:id/rooming` | ✅ |

---

## Sprint 6 — Actions correctives réalisées

### ✅ Corrections frontend (mauvaises routes)

1. **`/client/voyages/:id` → `/client/bookings/:id`**
   - Fichier : `frontend/app/(client)/client/voyage/[id]/page.tsx:64`

2. **`/public/pro/:slug` → `/public/pros/:slug`**
   - Fichier : `frontend/app/(public)/pro/[slug]/page.tsx:296`

3. **`/public/pro/:slug/upcoming-trips` → `/public/pros/:slug/upcoming-trips`**
   - Fichier : `frontend/app/(public)/pro/[slug]/page.tsx:304`

4. **`/pro/trips` → `/pro/quick-sell/trips`** (2 fichiers)
   - `frontend/app/(pro)/pro/vendre/lien-paiement/page.tsx:152`
   - `frontend/app/(pro)/pro/vendre/reservation-assistee/page.tsx:227`

5. **`/pro/voyages/:id` → `/pro/travels/:id`**
   - Fichier : `frontend/app/(pro)/pro/voyages/[id]/clone-season/page.tsx:116`

6. **`/pro/voyages/:id/clone` → `/pro/travels/:id/duplicate`**
   - Fichier : `frontend/app/(pro)/pro/voyages/[id]/clone-season/page.tsx:151`

### ✅ Routes ajoutées au backend

7. **`GET /public/pros/:slug/upcoming-trips`**
   - `backend/src/modules/public/public.controller.ts`
   - `backend/src/modules/public/public.service.ts` — méthode `getProUpcomingTrips()`

8. **`GET /admin/local-resources`** — liste globale admin
9. **`GET /admin/local-resources/stats`** — statistiques globales
10. **`PATCH /admin/local-resources/:id/verify`** — vérification sans travelId
11. **`DELETE /admin/local-resources/:id`** — suppression sans travelId
    - `backend/src/modules/local-resources/local-resources.controller.ts`
    - `backend/src/modules/local-resources/local-resources.service.ts` — méthodes `findAllAdmin()`, `findAdminStats()`

12. **`POST /client/travels/:travelId/emergency`**
13. **`POST /client/travels/:travelId/emergency-alert`**
    - `backend/src/modules/client/client.controller.ts`
    - `backend/src/modules/client/client.service.ts` — méthode `triggerEmergency()`

14. **`POST /admin/system/lockdown`**
    - `backend/src/modules/admin/admin.controller.ts`

### ⚠️ Points restants à traiter (backlog)

1. **`/admin/forfaits/overview` et `/admin/forfaits/stats`** — L'UI admin des forfaits appelle ces routes mais elles n'existent pas. Clarifier si "forfaits" = `/pro/packages` et aligner les chemins.

2. **`/admin/emails/dead-letter/*`** — L'UI emails-queue utilise ces routes. Le backend a `/admin/monitoring/emails`. Soit renommer le endpoint backend, soit créer des routes aliases.

3. **`/api/pro/activites/*`** (9 pages du portail activités) — Ces appels passent par le proxy Next.js et pointent vers `/pro/activites/*` sur le backend. Le backend a `/activity-providers/*`. Options :
   - Ajouter un contrôleur `@Controller('pro/activites')` avec aliases
   - Ou créer des routes Next.js locales qui proxient vers `/activity-providers/*`

---

## Architecture API

```
Frontend (Next.js)
├── apiClient.get('/xxx') → fetch('/xxx') → DIRECT (pas de proxy)
│   └── Intercepté par apiClient.baseUrl (vide côté client, URL backend côté serveur)
│   └── En prod client-side → fetch('http://localhost:3000/xxx') → 404 si pas de rewrite
│   └── SAUF si NEXT_PUBLIC_API_URL = 'https://api.eventylife.fr' → fetch('/xxx') → problème
│
├── apiClient.get('/api/xxx') → fetch('/api/xxx') → PROXY Next.js
│   └── next.config.js rewrite: /api/:path* → ${NEXT_PUBLIC_API_URL}/:path*
│   └── → https://api.eventylife.fr/xxx (strip /api/ prefix)
│
└── Routes locales app/api/*/route.ts → données mock (dev sans backend)
```

**Note importante** : `apiClient` sur client-side a `baseUrl = ''`. Donc tous les appels sans `/api/` préfixe font des requêtes relatives (`/client/bookings`) qui passent par Next.js middleware, puis par les rewrites si NEXT_PUBLIC_API_URL est défini. En production, ils sont réécrits vers `${NEXT_PUBLIC_API_URL}/client/bookings` → `https://api.eventylife.fr/client/bookings`.
