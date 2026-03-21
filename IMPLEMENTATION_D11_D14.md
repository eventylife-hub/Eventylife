# Implémentation D11 + D14 — Relance Paniers + TVA Audit Trail

Date: 2026-03-20
Session: Backend D11+D14

---

## D11 — Relance Paniers Abandonnés (Checkout Module)

### Services Modifiés
- **`backend/src/modules/checkout/abandoned-cart.service.ts`** (complet)
  - Ajout interface `AbandonedCartStats` avec niveaux de relance détaillés
  - Modification `sendAbandonedCartReminder()` → retourne numéro de niveau (1/2/3 ou 0)
  - Stratégie 3 niveaux avec timestamps granulaires:
    - **Reminder Level 1** (après 1h): "Votre réservation vous attend !"
    - **Reminder Level 2** (après 24h): "Dernière chance — vos places ne sont pas garanties"
    - **Reminder Level 3** (après 72h): "Nous gardons votre place encore 24h"
  - Tracking: métadata avec `reminder1_sent_at`, `reminder2_sent_at`, `reminder3_sent_at`
  - Amélioration `getAbandonedCartStats()` → stats détaillées:
    - `reminded_level1`, `reminded_level2`, `reminded_level3`
    - `recoveredValue`, `abandonedValue`
  - Nouvellr méthode `cleanupExpiredCarts(days)` → suppression paniers EXPIRED > 30j

### Controllers Modifiés
- **`backend/src/modules/checkout/checkout-advanced.controller.ts`**
  - **GET `/checkout/abandoned/stats`** → Stats paniers abandonnés (D11)
  - **POST `/checkout/abandoned/remind/:bookingGroupId`** → Force relance manuelle

### Cron Jobs Ajoutés
- **`backend/src/modules/cron/cron.service.ts`**
  - **`handleAbandonedCartReminders()`** (*/30 * * * *) → Tous les 30 min
    - Détecte paniers >= 1h
    - Envoie relances échelonnées (L1/L2/L3)
    - Logs détaillés par niveau
  - **`handleExpiredCartCleanup()`** (0 3 1 * *) → 1er du mois à 3h
    - Nettoie paniers EXPIRED > 30 jours
    - Suppression hard delete (cascades gérées par Prisma)

### Module Changes
- **`backend/src/modules/cron/cron.module.ts`**
  - Import `CheckoutModule` pour injection `AbandonedCartService`

---

## D14 — TVA Audit Trail & Rapports (Finance Module)

### Services Modifiés
- **`backend/src/modules/finance/tva-audit-trail.service.ts`** (complet)
  - Nouvelle méthode `getTvaReport(period, date, includeDetail)`:
    - Agrégation TVA par période (monthly: YYYY-MM, quarterly: YYYY-QN)
    - Retourne: `total_collected`, `total_deducted`, `net_tva`, `nb_operations`
    - Optionnel: détail par voyage
    - Logique triggers:
      - **COLLECTION**: BOOKING_CREATED, PAYMENT_RECEIVED
      - **DEDUCTION**: BOOKING_CANCELED, REFUND_ISSUED
      - **NEUTRE**: COST_UPDATED, PRICE_CHANGED, MANUAL_ADJUSTMENT, NOGO_DECISION
  - Private helper `parsePeriodDate()` → Parse YYYY-MM ou YYYY-QN
  - Nouvelle méthode `exportTvaAuditTrailCSV(start, end)`:
    - Export CSV global audit trail (pas limité au voyage)
    - 13 colonnes: Date, Travel ID/Title, Trigger, Revenue/Costs/Margin/TVA, Previous/Delta, Reason, User ID, Booking Group ID
    - Montants en euros (centimes / 100)

### Controllers Modifiés
- **`backend/src/modules/finance/finance-advanced.controller.ts`**
  - **GET `/finance/tva/report`** → Rapport TVA par période (D14)
    - Query: `period` (monthly|quarterly), `date` (YYYY-MM or YYYY-QN), `includeDetail` (bool)
    - Retourne: agrégation + optionnel détail par voyage
  - **GET `/finance/tva/audit-trail`** → Audit trail complet (D14)
    - Query: `start`, `end` (YYYY-MM-DD), `cursor`, `limit`
    - Retourne: liste TvaAuditEntry avec pagination
  - **GET `/finance/tva/export-csv`** → Export CSV audit trail (D14)
    - Query: `start`, `end`
    - Download: `tva-audit-trail-{start}_{end}.csv`

---

## Invariants Respectés

### D11
- ✅ Montants en centimes Int (abandonedValue, recoveredValue)
- ✅ Timestamps granulaires (reminder1/2/3_sent_at)
- ✅ Logger (pas console.log)
- ✅ Prisma pour toutes requêtes
- ✅ Cron avec @Cron decorator + JobRun tracking

### D14
- ✅ TVA marge = (CA_TTC - Coûts_TTC) × 20/120
- ✅ Montants en centimes Int
- ✅ Audit trail complet avec triggers
- ✅ Export CSV conforme compta
- ✅ Pagination pour audit trail global

---

## Endpoints Résumé

### Checkout (D11)
```
GET  /checkout/abandoned/stats               → Stats paniers abandonnés
POST /checkout/abandoned/remind/:bookingGroupId → Force relance manuelle
```

### Finance (D14)
```
GET  /finance/tva/report?period=monthly&date=2026-03&includeDetail=true
GET  /finance/tva/audit-trail?start=2026-01-01&end=2026-03-31&limit=100
GET  /finance/tva/export-csv?start=2026-01-01&end=2026-03-31          [CSV download]
```

### Cron Jobs
```
Cron: */30 * * * *        → handleAbandonedCartReminders
Cron: 0 3 1 * *           → handleExpiredCartCleanup
```

---

## Tests Recommandés

### D11
1. Créer BookingGroup en status PENDING_PAYMENT
2. Attendre 1h (ou tester avec modification createdAt)
3. Vérifier GET `/checkout/abandoned/stats` → reminder_level1 incrémenté
4. POST `/checkout/abandoned/remind` → force relance
5. Vérifier métadata `reminder1_sent_at`
6. Attendre 24h → L2 envoyé, attendre 72h → L3 envoyé
7. Vérifier cleanup après 30j

### D14
1. Créer booking confirmé → BOOKING_CREATED audit entry
2. GET `/finance/tva/report?period=monthly&date=2026-03` → total_collected > 0
3. Annuler booking → BOOKING_CANCELED audit entry
4. GET `/finance/tva/report?period=monthly&date=2026-03` → total_deducted > 0, net_tva = collected - deducted
5. GET `/finance/tva/audit-trail?start=2026-01-01&end=2026-03-31` → liste complète
6. GET `/finance/tva/export-csv?start=2026-01-01&end=2026-03-31` → download CSV

---

## Fichiers Modifiés

```
backend/src/modules/checkout/abandoned-cart.service.ts          ✅ Complet
backend/src/modules/checkout/checkout-advanced.controller.ts   ✅ Complet
backend/src/modules/cron/cron.service.ts                      ✅ Complet (2 jobs ajoutés)
backend/src/modules/cron/cron.module.ts                       ✅ Import CheckoutModule
backend/src/modules/finance/tva-audit-trail.service.ts        ✅ Complet (getTvaReport, exportTvaAuditTrailCSV)
backend/src/modules/finance/finance-advanced.controller.ts    ✅ Complet (3 endpoints ajoutés)
```

---

## Notes d'Implémentation

- **Circular dependencies**: Évité en important CheckoutModule au niveau cron.module
- **BookingGroupStatus**: Modèle utilise valeurs comme PENDING_PAYMENT, HELD, EXPIRED (non INITIATED, PASSENGERS_FILLED)
- **Email service**: Existant, compatible avec relance (EmailService.sendAbandonedCartReminder)
- **TVA triggers**: Enum TvaAuditTrigger couvre tous les cas (BOOKING_CREATED, PAYMENT_RECEIVED, BOOKING_CANCELED, REFUND_ISSUED, COST_UPDATED, PRICE_CHANGED, MANUAL_ADJUSTMENT, NOGO_DECISION)
- **Montants**: Tous en centimes Int, conversions en euros pour export (/ 100)

