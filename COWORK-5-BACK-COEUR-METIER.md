# COWORK BACKEND SESSION 2 — CŒUR MÉTIER

> **Scope** : LOT 4 + LOT 5 + LOT 6 + LOT 7
> **Durée estimée** : ~18-23h Cowork
> **Dépendance** : Session 1 DOIT être terminée (Auth + RBAC + Prisma migrate)
> **C'est le cœur du produit : créer un voyage, réserver, payer, facturer.**

---

## CONTEXTE

Tu es le développeur backend d'Eventy Life. Cette session = le flux d'argent complet.

**LIRE EN PREMIER** :
1. `AME-EVENTY.md` — L'âme du produit
2. `PROGRAMME-BACKEND.md` — LOTs 4 à 7
3. `backend/prisma/schema.prisma` — modèles Travel, BookingGroup, RoomBooking, PaymentContribution, etc.
4. `VERIFICATION-FINALE.md` — les invariants financiers

**Stack** : NestJS 10 · Prisma 5 · PostgreSQL 15 · Stripe · TypeScript strict

---

## LOT 4 — CRÉATION VOYAGE (~5-6h)

### Objectif
Un Pro peut créer un voyage complet en 4 étapes et le publier.

### Ce qui existe (2 185 lignes travels + 887 lignes transport)
- `travels.service.ts` (703 lignes) + `travel-lifecycle.service.ts` (897 lignes)
- `transport.service.ts` (511 lignes)
- `rooming.service.ts` (401 lignes)
- `hra.service.ts` (981 lignes)

### Tâches

**4.1 — Wizard création 4 étapes**

*Étape 1 : Infos générales*
- Titre, description, dates départ/retour, ville départ, destination
- Photo couverture (upload S3)
- Type voyage (enum TravelType)
- Seuil minimum voyageurs (minParticipants)
→ Endpoint : `POST /pro/travels` (crée un DRAFT)

*Étape 2 : Transport*
- Type transport (BUS, AVION, TRAIN, COVOITURAGE)
- Si BUS : arrêts (BusStop) avec ville, horaire, coordonnées GPS
- Capacité véhicule
- Prix transport inclus ou séparé
→ Endpoint : `PUT /pro/travels/:id/transport`

*Étape 3 : Hébergement + HRA*
- Sélectionner hôtel(s) → HotelBlock avec nb chambres, types, prix nuit
- Ajouter restaurants (optionnel)
- Ajouter activités (optionnel)
→ Endpoint : `PUT /pro/travels/:id/accommodation`

*Étape 4 : Tarification*
- Prix par personne TTC
- Options payantes (extras)
- Assurance (Pack Sérénité = INCLUS par défaut)
- Calcul automatique : coûts, marge, TVA marge
→ Endpoint : `PUT /pro/travels/:id/pricing`

**4.2 — Travel Lifecycle State Machine**
```
DRAFT → PENDING_REVIEW → PUBLISHED → BOOKING_OPEN → DEPARTURE_CONFIRMED → IN_PROGRESS → COMPLETED
                ↓                         ↓
         CHANGES_REQUESTED          CANCELLED (NoGo)
```
Chaque transition → validation métier + notification.
Seul ADMIN peut passer PENDING_REVIEW → PUBLISHED.

**4.3 — Pricing Engine**
Fichier : `checkout/pricing.service.ts` (201 lignes existantes)
Compléter avec :
- `computeTravelPrice(travelId, roomType, occupancyCount, options[])` → PricingResult
- PricingResult = { perPersonTTC, roomTotalTTC, extras[], assurance, totalTTC }
- **INVARIANT 1** : `pricingParts = occupancyCount` (JAMAIS capacity)
- **INVARIANT 2** : `perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC`
- **INVARIANT 3** : Money = centimes Int

**4.4 — Vérifications pré-publication**
Avant de publier, vérifier :
- [ ] Au moins 1 transport configuré
- [ ] Au moins 1 hébergement
- [ ] Prix défini et > 0
- [ ] Dates cohérentes (départ < retour)
- [ ] Photo couverture uploadée
- [ ] Description > 50 caractères

**4.5 — Duplication de voyage**
- `POST /pro/travels/:id/duplicate`
- Deep clone : transport, HRA, pricing, arrêts
- Reset status → DRAFT
- Nouveaux IDs partout

### Diagrammes draw.io
- `04_CréationVoyage_2Phases_V15`
- `108-110` (Phase1 Approval Notifications)
- `137_SOT_GatesPublish_FicheComplete_V63`

### Validation LOT 4
- [ ] Créer voyage DRAFT → 4 étapes → PENDING_REVIEW
- [ ] Admin publie → PUBLISHED
- [ ] Pricing calcul correct (tester 3 scénarios)
- [ ] Duplication → nouveau voyage DRAFT
- [ ] `npm run test -- travels` → OK

---

## LOT 5 — BOOKING & CHECKOUT & STRIPE (~6-8h)

### Objectif
Un client peut réserver, payer via Stripe, et recevoir sa confirmation.

### Ce qui existe (3 896 lignes checkout + 791 lignes bookings + 1 683 lignes payments)
- `checkout.service.ts` (1 818 lignes)
- `split-pay.service.ts` (385 lignes)
- `pricing.service.ts` (201 lignes)
- `bookings.service.ts` (606 lignes)
- `payments.service.ts` (550 lignes)
- `stripe.service.ts` (251 lignes)

### Tâches

**5.1 — Checkout 5 étapes**

*Start* : `POST /checkout/init`
- Vérifier que le voyage est BOOKING_OPEN
- Vérifier places disponibles
- Créer BookingGroup (status PENDING)
- Retourner checkoutSessionId

*Step 1 — Infos voyageurs* : `POST /checkout/:id/passengers`
- Noms, prénoms, dates naissance, numéros passeport (optionnel)
- Créer les RoomBooking avec occupancyCount

*Step 2 — Options* : `POST /checkout/:id/options`
- Assurance (Pack Sérénité inclus, upgrade optionnel)
- Extras (repas spéciaux, bagages, etc.)
- Recalculer le total

*Step 3 — Paiement* : `POST /checkout/:id/create-payment`
- Créer Stripe Checkout Session
- Line items = détail voyage + options
- Success URL + Cancel URL
- Idempotency key : `checkout-{bookingGroupId}-{timestamp}`

*Confirmation* : `GET /checkout/:id/confirmation`
- Après webhook Stripe → BookingGroup CONFIRMED
- Retourner le détail complet

**5.2 — Stripe Webhooks complets**
Fichier : `payments/webhook.controller.ts`
Événements à gérer :
```
checkout.session.completed → BookingGroup CONFIRMED + email confirmation
checkout.session.expired → BookingGroup CANCELLED + libérer places
payment_intent.succeeded → PaymentContribution SUCCEEDED
payment_intent.payment_failed → PaymentContribution FAILED + email
charge.refunded → PaymentContribution REFUNDED + avoir
charge.dispute.created → ALERTE ADMIN URGENTE
```
**INVARIANT 4** : Idempotency sur TOUS les webhooks (vérifier event.id déjà traité)

**5.3 — Split Payment**
- Plusieurs payeurs pour 1 BookingGroup
- Chaque payeur crée sa propre Stripe session
- BookingGroup = CONFIRMED seulement quand TOUS ont payé
- Endpoint : `POST /checkout/:id/split-pay/invite`

**5.4 — Hold 24h**
- Option de réserver sans payer pendant 24h
- Timer d'expiration → cron job
- Si expire → libérer les places
- Endpoint : `POST /checkout/:id/hold`

**5.5 — Rooming attribution**
- Après CONFIRMED : attribuer les chambres
- Auto-attribution basée sur occupancy + type chambre
- Pro peut override manuellement
- Endpoint : `PUT /pro/travels/:id/rooming/:roomBookingId/assign`

**5.6 — Confirmation email + PDF facture**
- Déclencher après webhook `checkout.session.completed`
- Générer PDF facture (module documents)
- Envoyer email avec PDF attaché

### Diagrammes draw.io
- `DEV_002_Checkout_Tunnel_5_Etapes_Complet`
- `DEV_015_Stripe_Webhooks_Complets`
- `117-119` (RoomBooking SplitPay)
- `39-44` (BookingLifecycle)

### Validation LOT 5
- [ ] Checkout complet : init → passengers → options → paiement → confirmation
- [ ] Webhook checkout.session.completed → BookingGroup CONFIRMED
- [ ] Webhook checkout.session.expired → BookingGroup CANCELLED
- [ ] Split pay : 2 payeurs → chacun paie → booking confirmé
- [ ] Hold 24h : créer → attendre → expiration auto
- [ ] Email + PDF envoyés après confirmation
- [ ] `npm run test -- checkout bookings payments` → OK

---

## LOT 6 — FINANCE & TVA (~4-5h)

### Objectif
TVA marge, journal comptable, paiements Pro, exports cabinet.

### Ce qui existe (1 115 lignes finance + 537 lignes exports)
- `finance.service.ts` (747 lignes) — calcul TVA marge basique ✅
- `exports.service.ts` (417 lignes)

### Tâches

**6.1 — TVA marge (vérifier et compléter)**
Formule : `TVA_marge = (CA_TTC − coûts_TTC) × 20/120`
- CA_TTC = Σ roomTotalTTC des RoomBooking CONFIRMED
- coûts_TTC = Σ TravelActivityCost + transport + hôtel
- **INVARIANT 6** — Tester avec 10 scénarios chiffrés

**6.2 — Ledger (journal comptable)**
Nouveau modèle ou utiliser `FinancialEntry` si existant.
- Chaque opération financière = 1 écriture
- Types : REVENUE, COST, TAX, PAYOUT, REFUND, CREDIT
- Double entrée : débit + crédit
- Immutable (jamais de UPDATE, seulement des INSERT)

**6.3 — PayoutBatch (paiements Pro)**
- Calculer la commission Eventy (% configurable)
- Créer un batch de virements Pro
- Stripe Connect Transfer ou virement manuel
- Statut : PENDING → PROCESSING → COMPLETED / FAILED
- Endpoint admin : `POST /admin/finance/payouts/batch`

**6.4 — Export comptable FEC**
- Format FEC (Fichier des Écritures Comptables) pour le cabinet
- CSV avec colonnes normalisées
- Filtre par période
- Endpoint : `GET /admin/exports/fec?from=&to=`

**6.5 — Credit Wallet + Avoirs**
- Crédit suite à annulation → CreditVoucher
- Wallet client avec solde
- Utilisation lors du checkout (déduire du total)
- Expiration des crédits (configurable, défaut 12 mois)

**6.6 — Dashboard finance admin**
Agrégats : CA total, CA mois, marge, TVA collectée, payouts en attente, top 5 voyages.

### Diagrammes draw.io
- `DEV_016_Formules_Finance_Exemples_Chiffrés`
- `54-56` (Compta Exports Cabinet)
- `237-251` (Credit NoGo Cancel)

### Validation LOT 6
- [ ] TVA marge correcte sur 10 scénarios
- [ ] Ledger : chaque paiement crée une écriture
- [ ] PayoutBatch : calcul commission + batch créé
- [ ] Export FEC : CSV valide avec les bonnes colonnes
- [ ] Credit : créer → utiliser au checkout → solde mis à jour
- [ ] `npm run test -- finance exports` → OK

---

## LOT 7 — ANNULATIONS & POST-SALE (~3-4h)

### Objectif
Annulations avec barème, remboursements Stripe, NoGo, waitlist.

### Ce qui existe (1 005 lignes cancellation + 1 223 lignes post-sale + 624 lignes reviews)

### Tâches

**7.1 — Barème d'annulation**
- J-30+ : remboursement 100% - frais dossier 50€
- J-15 à J-30 : remboursement 70%
- J-7 à J-15 : remboursement 50%
- J-3 à J-7 : remboursement 25%
- J-3 : 0% (pas de remboursement)
Configurable par voyage (Pro peut ajuster).

**7.2 — Remboursement Stripe**
- Partial refund (montant calculé selon barème)
- Stripe refund API via `stripe.service.ts`
- Créer CreditVoucher si remboursement en avoir
- Choix client : remboursement carte OU avoir

**7.3 — NoGo voyage**
- Si nb réservations < minParticipants à J-15
- Déclencher NoGo : voyage annulé
- Rembourser TOUS les clients à 100%
- Notifier Pro + clients
- Endpoint admin : `POST /admin/travels/:id/nogo`

**7.4 — Waitlist**
- Si voyage complet → proposer waitlist
- Auto-confirmation si place libérée (annulation)
- Notification au client en waitlist
- Expiration waitlist à J-3

**7.5 — Post-sale**
- Après COMPLETED : demander avis aux voyageurs (cron J+2)
- Système de pourboire (tips au Pro/guide)
- UGC : upload photos de voyage

**7.6 — Reviews modération**
- Client note le voyage (1-5 étoiles + commentaire)
- Modération admin avant publication
- Pro peut répondre aux avis

### Validation LOT 7
- [ ] Annulation J-20 → remboursement 70%
- [ ] Annulation J-5 → remboursement 25%
- [ ] NoGo → tous remboursés 100% + notifiés
- [ ] Waitlist → place libérée → auto-confirmé
- [ ] Avis posté → modération admin → publié
- [ ] `npm run test -- cancellation post-sale reviews` → OK

---

## INVARIANTS FINANCIERS (RAPPEL)

```
1. pricingParts = occupancyCount (JAMAIS capacity)
2. perPersonTTC × occupancyCount + roundingRemainder == roomTotalTTC
3. Money = centimes Int (JAMAIS Float)
4. Idempotency sur tout (webhooks, paiements)
5. Lock post-paiement (chambre/occupation/assurance verrouillés)
6. TVA marge = (CA_TTC − coûts_TTC) × 20/120
7. Paiement reçu ≠ annulé par hold expiré
8. TravelGroupMember JOINED ≠ place consommée
```

## FIN DE SESSION

1. `npx tsc --noEmit` → 0 erreurs
2. `npm run test` → tous les tests passent
3. Mettre à jour `PROGRESS.md`
4. Le flux complet doit fonctionner : créer voyage → publier → réserver → payer → facture → annuler

---

*Session Backend 2/3 — Cœur métier*
