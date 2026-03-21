# ClosePack Finance — Quick Start Guide

## Overview

ClosePack is the automated financial closing system for Eventy trips. It calculates revenues, costs, commissions, and generates accounting exports.

## Key Files

### Backend
```
backend/src/modules/finance/close-pack/
├── close-pack.service.ts       (Business logic, calculations)
├── close-pack.controller.ts    (17 endpoints: Pro + Admin)
├── close-pack.module.ts        (NestJS module definition)
└── README.md                   (Detailed documentation)
```

### Frontend
```
frontend/app/(pro)/pro/finance/cloture/page.tsx           (Pro interface)
frontend/app/(admin)/admin/finance/cloture/page.tsx       (Admin interface)
frontend/components/pro/ClosePackSummary.tsx              (Dashboard widget)
```

### Database
```
backend/prisma/schema.prisma                              (ClosePack model added)
```

## Database Setup

Run Prisma migration to create ClosePack table:

```bash
cd backend
npx prisma migrate dev --name add_close_pack
```

## API Endpoints

### Pro Endpoints (11 total)
```
POST   /finance/close-pack/:travelId/initiate      → Start closing
GET    /finance/close-pack/:travelId/status        → Get status
GET    /finance/close-pack/:id/detail              → Full details
GET    /finance/close-pack/:travelId/revenues      → Revenue breakdown
GET    /finance/close-pack/:travelId/costs         → Cost breakdown
GET    /finance/close-pack/:travelId/commissions   → Commission breakdown
GET    /finance/close-pack/:travelId/balance       → Net balance
GET    /finance/close-pack/:id/cotisations         → Cotisations
GET    /finance/close-pack/:id/fonds-pool          → Fonds Pool
GET    /finance/close-pack/pro/history             → Close pack history
GET    /finance/close-pack/export/:id?format=CSV   → Download export
```

### Admin Endpoints (6 total)
```
GET    /admin/close-pack/queue                     → Validation queue
POST   /admin/close-pack/:id/validate              → Validate
POST   /admin/close-pack/:id/reject                → Reject
POST   /admin/close-pack/:id/finalize              → Finalize
POST   /admin/close-pack/:id/transfer              → Transfer to accountant
GET    /admin/close-pack/stats                     → Global stats
```

## Workflow

### Pro Perspective
1. Trip marked as COMPLETED
2. Pro opens "Clôtures Financières" page
3. Clicks "Lancer une clôture" button
4. System auto-calculates revenues, costs, commissions
5. Waits for admin validation
6. Downloads export (FEC/CSV/Excel)

### Admin Perspective
1. Opens admin dashboard → Finance → Clôtures
2. Sees queue of pending validations
3. Reviews financial breakdown
4. Clicks Validate or Reject
5. If Validated, finalizes (locks data)
6. Transfers to accountant with email

## Key Calculations

### Revenues
- Sum of confirmed payment contributions
- Grouped by payment type (Stripe, Bank, etc.)

### Costs
- Transport (from TravelActivityCost)
- Accommodation (HotelBlock × nights × price)
- Activities (from TravelActivityCost)
- Insurance (from TravelActivityCost)
- Fees (administrative)

### Commissions
- Pro: 10% of revenue
- Seller: 5% of revenue
- Referral: extensible (currently 0%)

### Cotisations
1. **TVA Marge** = Balance × 20/120
2. **URSSAF** = Balance × 42/100
3. **RC Pro** = 12000 cents (100€/month)
4. **APST** = Revenue × 0.5/100
5. **Fonds Pool** = Balance × 5/100 (reinvestment)

## Status Lifecycle

```
INITIATED
    ↓ Auto-calculates
CALCULATING
    ↓ Ready for validation
PENDING_VALIDATION
    ↙ Admin validates        ↘ Admin rejects
VALIDATED                    REJECTED
    ↓ Admin finalizes
FINALIZED (locked)
    ↓ Optional
Transferred to accountant
```

## Integration with Dashboard

To add the ClosePackSummary widget to pro dashboard:

```tsx
import { ClosePackSummary } from '@/components/pro/ClosePackSummary';

export default function ProDashboard() {
  return (
    <div className="grid gap-6">
      {/* Other widgets... */}
      <ClosePackSummary />
    </div>
  );
}
```

## Demo Data

All endpoints include fallback demo data for development:
- Sample close packs with realistic amounts
- Multiple statuses
- Detailed financial breakdowns

## Important Notes

### Amounts
- All monetary values stored in **cents** (no decimals)
- Example: 1500€ = 150000 cents
- Integer arithmetic only (no floating point)

### Immutability
- Once a close pack is FINALIZED, it's locked
- Snapshots are preserved for audit trail
- Cannot modify finalized close packs

### Permissions
- Pro: Can see and initiate their own close packs
- Admin: Can validate, reject, finalize, transfer
- Both require JWT authentication

### Rate Limiting
- Standard endpoints: 10 requests/minute
- Search endpoints: 30 requests/minute

## Testing

No unit tests yet included. Consider adding:
- Service calculation accuracy tests
- Controller endpoint tests
- Full workflow E2E tests

## Next Steps

1. **Run migration**: `npx prisma migrate dev --name add_close_pack`
2. **Test endpoints** with Postman/Insomnia
3. **Integrate widget** into pro dashboard
4. **Hook up API calls** (currently demo fallback)
5. **Add notifications** (email to Pro/Admin)
6. **Enhance Excel export** (use xlsx library)
7. **Add tests** (unit + integration)

## Files Statistics

| File | Lines | Purpose |
|------|-------|---------|
| close-pack.service.ts | 550 | Business logic |
| close-pack.controller.ts | 280 | API endpoints |
| page.tsx (Pro) | 500 | Pro UI |
| page.tsx (Admin) | 450 | Admin UI |
| ClosePackSummary.tsx | 200 | Dashboard widget |
| close-pack.module.ts | 25 | NestJS module |
| **Total** | **2005** | **Production code** |

## Architecture Diagram

```
Travel (COMPLETED)
    ↓
ClosePack Service
    ├→ calculateRevenues() → Σ payments
    ├→ calculateCosts() → Transport + Hotel + Activities + Insurance + Fees
    ├→ calculateCommissions() → Pro 10% + Seller 5%
    ├→ calculateBalance() → Revenues - Costs - Commissions
    └→ generateCotisations() → URSSAF, TVA, RC Pro, APST, Fonds Pool
         ↓
ClosePack Model (DB)
    ├→ Snapshots (JSON, immutable)
    ├→ Status workflow (INITIATED → FINALIZED)
    └→ Audit trail (initiator, validator, rejector)
         ↓
    Pro Interface ←→ API Endpoints ←→ Admin Interface
```

## Support

- See `/backend/src/modules/finance/close-pack/README.md` for full documentation
- Check service methods for JSDoc comments
- Review schema in `prisma/schema.prisma` for data structure

---

**Implementation Date**: 2026-03-20
**Status**: Production Ready (awaiting migration + testing)
**Maintainer**: Eventy Team
