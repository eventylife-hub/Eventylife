# Étapes d'intégration - Phases 12 & 13

## Step 1: Enregistrer les modules Backend

### Dans `backend/src/modules/pro/pro.module.ts`

Ajouter l'import :
```typescript
import { TravelActivitiesModule } from './travel-activities/travel-activities.module';
```

Ajouter au tableau `imports`:
```typescript
@Module({
  imports: [PrismaModule, ProMessagerieModule, NotificationsModule, RunbookModule, TravelActivitiesModule],
  // ...
})
```

### Dans `backend/src/modules/checkout/checkout.module.ts` (créer si nécessaire)

```typescript
import { Module } from '@nestjs/common';
import { CrossSellModule } from './cross-sell/cross-sell.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CrossSellModule],
  exports: [CrossSellModule],
})
export class CheckoutModule {}
```

### Dans `backend/src/modules/hra/hra.module.ts`

Ajouter l'import:
```typescript
import { ReferralModule } from './referral/referral.module';
```

Ajouter au tableau `imports`:
```typescript
@Module({
  imports: [PrismaModule, ReferralModule],
  // ...
})
```

### Dans `backend/src/app.module.ts`

Vérifier que ProModule, CheckoutModule, HraModule sont importés au niveau principal.

---

## Step 2: Vérifier les imports Prisma

Les fichiers services utilisent:
- `PrismaService` ✅
- Modèles: `Travel`, `TravelActivityCost`, `BookingGroup`, `HotelPartner`, `RestaurantPartner` ✅

**Aucune migration Prisma requise** - Le modèle `TravelActivityCost` existe déjà.

---

## Step 3: Test Backend

```bash
cd backend

# Tests unitaires
npm run test -- travel-activities.service.spec.ts
npm run test -- cross-sell.service.spec.ts
npm run test -- referral.service.spec.ts

# Tous les tests
npm run test

# Build
npm run build
```

---

## Step 4: Frontend - Vérifier les dépendances

Tous les composants utilisent :
- ✅ `lucide-react` (icônes)
- ✅ `@/lib/api-client` (requêtes API)
- ✅ `@/lib/utils` (formatPrice, formatDate)
- ✅ `@/components/ui/toast-notification` (notifications)
- ✅ `next/navigation` (routing)

**Aucune installation de dépendance requise.**

---

## Step 5: Frontend - Test Build

```bash
cd frontend

# Build
npm run build

# Vérifier les routes
# - /pro/voyages/[id]/activites ✅
# - /client/voyage/[id]/activites ✅
# - /checkout/activites ✅
# - /admin/ventes ✅
# - /admin/ventes/activites ✅
```

---

## Step 6: Routes Navigation

### Pro Portal - Ajouter lien dans sidebar/menu

Dans `/frontend/app/(pro)/pro/layout.tsx`, ajouter à la navigation:
```typescript
{
  icon: Sparkles,
  label: 'Activités',
  href: `/pro/voyages/${travelId}/activites`,
}
```

### Client Portal - Ajouter lien dans voyage detail

Dans `/frontend/app/(client)/client/voyage/[id]/page.tsx`, ajouter tab:
```typescript
<Link href={`/client/voyage/${travelId}/activites`}>
  Activités
</Link>
```

### Admin - Ajouter lien dans sidebar

Dans `/frontend/app/(admin)/admin/layout.tsx`, ajouter:
```typescript
{
  label: 'Ventes',
  href: '/admin/ventes',
  children: [
    { label: 'Overview', href: '/admin/ventes' },
    { label: 'Activités', href: '/admin/ventes/activites' },
  ],
}
```

---

## Step 7: API Endpoints Verification

### Pro Endpoints
- `GET /pro/travels/:id/available-activities` ✅
- `POST /pro/travels/:id/activities/book` ✅
- `GET /pro/travels/:id/activities` ✅
- `GET /pro/revenues/activities` ✅

### Checkout Endpoints
- `GET /checkout/:bookingId/suggested-activities` ✅
- `POST /checkout/:bookingId/add-activity` ✅

### HRA Endpoints
- `POST /hra/hotel-partners/:id/referral-link` ✅
- `POST /hra/restaurant-partners/:id/referral-link` ✅
- `GET /hra/referrals/stats` ✅

---

## Step 8: Deployment

### Vercel (Frontend)

```bash
cd frontend
npm run build
vercel deploy
```

### Render/Heroku (Backend)

```bash
cd backend
npm run build
# Deploy (selon votre setup)
```

---

## Step 9: E2E Testing

### Test flow client:
1. Aller à `/client/voyage/{travelId}/activites`
2. Voir activités disponibles
3. Cliquer sur une activité → expansion
4. Ajouter au panier
5. Vérifier toast notification

### Test flow pro:
1. Aller à `/pro/voyages/{travelId}/activites`
2. Sélectionner une activité
3. Remplir formulaire (participants, date)
4. Cliquer "Réserver"
5. Vérifier dans "Mes activités réservées"
6. Voir commission calculée (2%)

### Test flow checkout:
1. Aller à `/checkout/activites?bookingId={id}`
2. Voir activités suggérées
3. Ajouter activités au panier
4. Vérifier récapitulatif et prix

### Test flow admin:
1. `/admin/ventes` - voir stats par canal
2. `/admin/ventes/activites` - voir marketplace stats

---

## Step 10: Data Seeding (Optionnel)

Pour tester avec de vraies données (non démo):

```bash
# Créer un seed script seed.ts
npx prisma db seed

# Seed example:
const travel = await prisma.travel.create({
  data: {
    title: "Voyage Paris",
    destinationCity: "Paris",
    proProfileId: "...",
    // ...
  },
});

const activity = await prisma.travelActivityCost.create({
  data: {
    travelId: travel.id,
    activityId: "act_001",
    title: "Visite Louvre",
    costAmountHT: 50000,
    // ...
  },
});
```

---

## Checklist Final

- [ ] Modules Backend enregistrés
- [ ] Pas de migration Prisma requise (TravelActivityCost existe)
- [ ] `npm run test` passe 100%
- [ ] Backend `npm run build` sans erreur
- [ ] Frontend `npm run build` sans erreur
- [ ] Routes ajoutées à la navigation
- [ ] E2E testing complet
- [ ] Déployé en prod (Vercel + Backend)
- [ ] Tests manuels sur prod

---

## Fichiers Créés (Résumé)

### Backend (12 files)
```
/backend/src/modules/pro/travel-activities/
  ├── travel-activities.service.ts
  ├── travel-activities.controller.ts
  ├── travel-activities.service.spec.ts
  └── travel-activities.module.ts

/backend/src/modules/checkout/cross-sell/
  ├── cross-sell.service.ts
  ├── cross-sell.controller.ts
  ├── cross-sell.service.spec.ts
  └── cross-sell.module.ts

/backend/src/modules/hra/referral/
  ├── referral.service.ts
  ├── referral.controller.ts
  ├── referral.service.spec.ts
  └── referral.module.ts
```

### Frontend (11 files)
```
/frontend/app/(pro)/pro/voyages/[id]/activites/
  ├── page.tsx
  └── loading.tsx

/frontend/app/(client)/client/voyage/[id]/activites/
  ├── page.tsx
  └── loading.tsx

/frontend/components/pro/
  └── ShareActivityButton.tsx

/frontend/app/(checkout)/checkout/activites/
  ├── page.tsx
  └── loading.tsx

/frontend/app/(admin)/admin/ventes/
  ├── page.tsx
  ├── loading.tsx
  └── activites/
      ├── page.tsx
      └── loading.tsx
```

---

## Support

Pour toute question sur l'implémentation:
1. Consulter `PHASE-12-13-IMPLEMENTATION.md`
2. Vérifier les tests (.spec.ts)
3. Exécuter `npm run test` et `npm run build`

**Status**: ✅ Ready for Integration
