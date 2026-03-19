# PLAN PHASE 2 — Sprints jusqu'au 19 mars 13h

> Règle : **max 2-3 fichiers par sprint**, TypeScript check entre chaque sprint.
> Objectif : routes API manquantes + hooks métier Phase 2

---

## État des lieux (18 mars 23h)

| Domaine | Pages | API routes | Hooks | Manque |
|---------|-------|-----------|-------|--------|
| Notifications | 4 pages (client/pro/admin/prefs) | 3 routes (list, send, templates) | useNotificationsWebSocket ✅ | Hook useNotifications, routes mark-read/preferences/[id] |
| Onboarding Pro | 1 page (667L) | 1 route (status) | ❌ | Hook useOnboarding, routes steps/complete/documents |
| Support | 3 pages (client/pro/admin) | 1 route (tickets) | ❌ | Hook useSupport, routes [id]/reply/close |
| Groupes | 5 pages (list/create/join/detail/invite) | 1 route (groups) | ❌ | Hook useGroups, routes [id]/invite/join/leave |
| Wallet | 2 pages (client/pro) | 1 route (wallet) | ❌ | Hook useWallet, routes transactions/withdraw |
| Assurance | 1 page + composant | 2 routes (assurance, mine) | ❌ | Hook useInsurance, routes subscribe/claim |
| HRA Hub | 2 pages (admin hra + restauration) | 0 routes ❌ | ❌ | API complète : meals/dietary/planning |
| RGPD | Cookie banner + page cookies | 0 routes API ❌ | useCookieConsent ✅ | API consent/data-export/data-delete/preferences |

**Total : 75 routes existantes → cible ~95 routes**

---

## Planning Sprint par Sprint

### 🕐 Mercredi 18 mars — 23h → minuit

#### Sprint 2.1 — Notifications API (3 fichiers)
- `app/api/notifications/[id]/route.ts` — GET notif by ID, PATCH mark-read
- `app/api/notifications/mark-all-read/route.ts` — POST mark all read
- `app/api/notifications/preferences/route.ts` — GET/PUT notification preferences

---

### 🕐 Jeudi 19 mars — 0h → 2h

#### Sprint 2.2 — Onboarding Pro API (3 fichiers)
- `app/api/pro/onboarding/steps/route.ts` — GET all steps, POST complete step
- `app/api/pro/onboarding/documents/route.ts` — POST upload doc, GET docs list
- `app/api/pro/onboarding/complete/route.ts` — POST finalize onboarding

#### Sprint 2.3 — Support Tickets API (3 fichiers)
- `app/api/support/tickets/[id]/route.ts` — GET ticket detail, PATCH update
- `app/api/support/tickets/[id]/reply/route.ts` — POST reply to ticket
- `app/api/support/tickets/[id]/close/route.ts` — POST close ticket

---

### 🕐 Jeudi 19 mars — 2h → 5h

#### Sprint 2.4 — Groupes Client API (3 fichiers)
- `app/api/client/groups/[id]/route.ts` — GET group detail, PATCH update, DELETE
- `app/api/client/groups/[id]/invite/route.ts` — POST invite member
- `app/api/client/groups/[id]/members/route.ts` — GET members, POST join, DELETE leave

#### Sprint 2.5 — Wallet + Assurance API (3 fichiers)
- `app/api/client/wallet/transactions/route.ts` — GET transactions history
- `app/api/client/assurance/subscribe/route.ts` — POST souscrire assurance
- `app/api/client/assurance/claim/route.ts` — POST déclarer sinistre

---

### 🕐 Jeudi 19 mars — 5h → 8h

#### Sprint 2.6 — HRA Hub API (3 fichiers)
- `app/api/admin/hra/meals/route.ts` — GET/POST meals planning
- `app/api/admin/hra/dietary/route.ts` — GET/POST dietary requirements
- `app/api/pro/voyages/[id]/restauration/route.ts` — GET/POST meal plan par voyage

#### Sprint 2.7 — RGPD API (3 fichiers)
- `app/api/rgpd/consent/route.ts` — GET/PUT consent preferences
- `app/api/rgpd/data-export/route.ts` — POST request data export
- `app/api/rgpd/data-delete/route.ts` — POST request account deletion

---

### 🕐 Jeudi 19 mars — 8h → 11h

#### Sprint 2.8 — Hooks métier (3 fichiers)
- `lib/hooks/use-notifications.ts` — CRUD notifications + mark-read + preferences
- `lib/hooks/use-groups.ts` — CRUD groupes + invite/join/leave
- `lib/hooks/use-support.ts` — CRUD tickets + reply + close

#### Sprint 2.9 — Hooks métier suite (3 fichiers)
- `lib/hooks/use-onboarding.ts` — Steps + complete + documents
- `lib/hooks/use-wallet.ts` — Balance + transactions + withdraw
- `lib/hooks/use-insurance.ts` — Subscribe + claim + status

---

### 🕐 Jeudi 19 mars — 11h → 13h

#### Sprint 2.10 — TypeScript check + corrections
- `npx tsc --noEmit` → fix toutes les erreurs
- Mise à jour `lib/hooks/index.ts` avec nouveaux exports
- Mise à jour `PROGRESS.md` avec bilan Phase 2

---

## Résumé

| Sprint | Horaire | Fichiers | Domaine |
|--------|---------|----------|---------|
| 2.1 | 23h-00h | 3 | Notifications API |
| 2.2 | 0h-1h | 3 | Onboarding Pro API |
| 2.3 | 1h-2h | 3 | Support Tickets API |
| 2.4 | 2h-3h30 | 3 | Groupes Client API |
| 2.5 | 3h30-5h | 3 | Wallet + Assurance API |
| 2.6 | 5h-6h30 | 3 | HRA Hub API |
| 2.7 | 6h30-8h | 3 | RGPD API |
| 2.8 | 8h-9h30 | 3 | Hooks batch 1 |
| 2.9 | 9h30-11h | 3 | Hooks batch 2 |
| 2.10 | 11h-13h | 3 | TS check + clean |

**Total : 30 fichiers · 10 sprints · ~20 nouvelles routes API · 6 hooks métier**

---

## Règles anti-crash

1. **Max 3 fichiers par sprint** — jamais plus
2. **TypeScript check après chaque sprint** — `npx tsc --noEmit`
3. **Pause 30s entre sprints** — laisser respirer le système
4. **Si erreur TS** → fix immédiat avant sprint suivant
5. **Proxy pattern identique** — tryProxyOrDemo pour toutes les routes
6. **Pas de dépendances inter-sprints** — chaque sprint est autonome
