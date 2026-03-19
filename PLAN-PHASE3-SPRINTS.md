# PLAN PHASE 3 — Sprints Messagerie, Reviews, Favoris, Marketing, Transport, Paiements

> Règle : **max 3 fichiers par sprint**, TypeScript check entre chaque sprint.
> Objectif : routes API manquantes + hooks métier Phase 3

---

## État des lieux (18 mars — post Phase 2)

| Domaine | Pages existantes | API routes | Hooks | Manque |
|---------|-----------------|-----------|-------|--------|
| Messagerie | 2 pages (client/pro) | 1 route (conversations) | ❌ | Routes [id]/messages/send, hook useMessaging |
| Reviews | 1 page (mes-avis) | 1 route (mine) | ❌ | Routes create/[id]/moderate, hook useReviews |
| Favoris | 1 page (favoris) | 0 routes ❌ | ❌ | API complète : list/toggle/collections |
| Marketing | 1 page (préférences) | 0 routes spécifiques ❌ | ❌ | Routes preferences/unsubscribe/segments |
| Transport détaillé | 1 page (admin transport) | 1 route (bus-stops) | ❌ | Routes itinerary/stops/drivers |
| Paiements avancés | 1 page (paiements) | 0 routes installments ❌ | ❌ | Routes installments/gift-cards/refund-request |

**Total : ~95 routes existantes → cible ~113 routes**

---

## Planning Sprint par Sprint

### Sprint 3.1 — Messagerie API (3 fichiers)
- `app/api/pro/messagerie/conversations/[id]/route.ts` — GET conversation detail, DELETE archive
- `app/api/pro/messagerie/conversations/[id]/messages/route.ts` — GET messages list, POST send message
- `app/api/client/messagerie/conversations/route.ts` — GET mes conversations, POST new conversation

### Sprint 3.2 — Reviews API (3 fichiers)
- `app/api/reviews/create/route.ts` — POST créer un avis
- `app/api/reviews/[id]/route.ts` — GET avis detail, PATCH update, DELETE supprimer
- `app/api/admin/reviews/moderate/route.ts` — GET avis à modérer, PATCH approve/reject

### Sprint 3.3 — Favoris API (3 fichiers)
- `app/api/client/favorites/route.ts` — GET liste favoris
- `app/api/client/favorites/toggle/route.ts` — POST ajouter/retirer favori
- `app/api/client/favorites/collections/route.ts` — GET/POST collections de favoris

### Sprint 3.4 — Marketing Preferences API (3 fichiers)
- `app/api/client/marketing/preferences/route.ts` — GET/PUT préférences marketing
- `app/api/client/marketing/unsubscribe/route.ts` — POST désinscription newsletter
- `app/api/admin/marketing/segments/route.ts` — GET/POST segments marketing

### Sprint 3.5 — Transport détaillé API (3 fichiers)
- `app/api/admin/transport/itinerary/route.ts` — GET/POST itinéraire détaillé
- `app/api/admin/transport/stops/route.ts` — GET/POST/DELETE arrêts bus
- `app/api/admin/transport/drivers/route.ts` — GET/POST chauffeurs

### Sprint 3.6 — Paiements avancés API (3 fichiers)
- `app/api/client/payments/installments/route.ts` — GET/POST plan échelonné
- `app/api/client/payments/gift-cards/route.ts` — GET/POST cartes cadeau
- `app/api/client/payments/refund-request/route.ts` — POST demande remboursement

### Sprint 3.7 — Hooks métier batch 1 (3 fichiers)
- `lib/hooks/use-messaging.ts` — Conversations + messages + send
- `lib/hooks/use-reviews.ts` — CRUD avis + modération
- `lib/hooks/use-favorites.ts` — Favoris + toggle + collections

### Sprint 3.8 — Hooks métier batch 2 (3 fichiers)
- `lib/hooks/use-marketing.ts` — Préférences + unsubscribe
- `lib/hooks/use-transport.ts` — Itinerary + stops + drivers
- `lib/hooks/use-installments.ts` — Plans échelonnés + gift cards

### Sprint 3.9 — TypeScript check + corrections
- `npx tsc --noEmit` → fix toutes les erreurs
- Mise à jour `lib/hooks/index.ts` avec nouveaux exports
- Mise à jour `PROGRESS.md` avec bilan Phase 3

---

## Résumé

| Sprint | Fichiers | Domaine |
|--------|----------|---------|
| 3.1 | 3 | Messagerie API |
| 3.2 | 3 | Reviews API |
| 3.3 | 3 | Favoris API |
| 3.4 | 3 | Marketing Preferences API |
| 3.5 | 3 | Transport détaillé API |
| 3.6 | 3 | Paiements avancés API |
| 3.7 | 3 | Hooks batch 1 |
| 3.8 | 3 | Hooks batch 2 |
| 3.9 | 1 | TS check + clean |

**Total : 25 fichiers · 9 sprints · ~18 nouvelles routes API · 6 hooks métier**

---

## Règles anti-crash

1. **Max 3 fichiers par sprint** — jamais plus
2. **TypeScript check après chaque sprint** — `npx tsc --noEmit`
3. **Si erreur TS** → fix immédiat avant sprint suivant
4. **Proxy pattern identique** — tryProxyOrDemo pour toutes les routes
5. **Pas de dépendances inter-sprints** — chaque sprint est autonome
