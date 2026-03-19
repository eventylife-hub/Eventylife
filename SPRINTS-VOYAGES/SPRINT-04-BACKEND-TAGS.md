# SPRINT 4 — Backend : Tags Expérience, Thèmes, Filtres Avancés

> **Durée estimée** : 1h
> **Scope** : Backend NestJS — module travels + Prisma schema
> **Pré-requis** : Sprints 1-3 terminés (frontend prêt à consommer)

## Contexte

Le frontend a des filtres de thèmes et expérience qui filtrent en mode "fallback" sur le titre.
Ce sprint ajoute les vrais champs au schéma Prisma et les endpoints API pour filtrage avancé.

## Fichiers à modifier

### 1. `backend/prisma/schema.prisma` — Ajouter les champs au model Travel

Après le champ `exclusionsJson` (ligne ~1319), ajouter :

```prisma
  // --- Champs ajoutés Sprint 4 draw.io ---
  theme             String?   @db.VarChar(50)    // gastronomie, culture, nature, aventure, detente, sport
  experienceTags    String[]                      // INSOLITE, LOCAL, EXCLUSIF, NATURE, FAMILLE, FESTIF
  region            String?   @db.VarChar(50)    // idf, paca, bretagne, alsace, ara, occitanie, naq, normandie
  isFeatured        Boolean   @default(false)     // Coup de cœur Eventy
  isConfirmed       Boolean   @default(false)     // Départ confirmé (>= seuil minimum)
  departureLat      Float?                        // Latitude point de départ (pour tri proximité)
  departureLng      Float?                        // Longitude point de départ
  videoUrl          String?                       // URL vidéo YouTube (nocookie)
  hostVideoUrl      String?                       // Vidéo intro indépendant
  faqJson           String?   @db.Text            // FAQ du voyage JSON
  creatorWhyMessage String?   @db.Text            // "Pourquoi j'ai créé ce voyage"
```

Puis ajouter un index :

```prisma
  @@index([theme])
  @@index([region])
  @@index([isFeatured])
```

### 2. `backend/src/modules/travels/travels.controller.ts` — Endpoint filtres avancés

Ajouter le endpoint `GET /travels` avec query params enrichis :

```typescript
// Ajouter les query params au endpoint existant GET /travels :
@Get()
async findAll(
  @Query('status') status?: TravelStatus,
  @Query('sort') sort?: string,           // popular, price-asc, price-desc, date, proximity
  @Query('limit') limit?: number,
  @Query('offset') offset?: number,
  @Query('theme') theme?: string,          // NOUVEAU
  @Query('experience') experience?: string, // NOUVEAU — tag unique ou comma-separated
  @Query('region') region?: string,         // NOUVEAU
  @Query('month') month?: number,           // NOUVEAU — numéro du mois (1-12)
  @Query('transport') transport?: string,   // EXISTANT — BUS, AVION, MIXTE
  @Query('minPrice') minPrice?: number,     // EXISTANT — centimes
  @Query('maxPrice') maxPrice?: number,     // EXISTANT — centimes
  @Query('lat') lat?: number,              // NOUVEAU — tri proximité
  @Query('lng') lng?: number,              // NOUVEAU — tri proximité
  @Query('featured') featured?: boolean,    // NOUVEAU — coups de cœur uniquement
) {
  return this.travelsService.findAll({
    status: status || 'PUBLISHED',
    sort, limit: limit || 20, offset: offset || 0,
    theme, experience, region, month, transport,
    minPrice, maxPrice, lat, lng, featured,
  });
}
```

### 3. `backend/src/modules/travels/travels.service.ts` — Logique de filtrage

Ajouter la méthode de filtrage dans le service :

```typescript
async findAll(params: FindAllTravelsParams) {
  const where: Prisma.TravelWhereInput = {
    status: params.status as TravelStatus,
  };

  // Filtre thème
  if (params.theme) {
    where.theme = params.theme;
  }

  // Filtre expérience (peut être comma-separated)
  if (params.experience) {
    const tags = params.experience.split(',');
    where.experienceTags = { hasSome: tags };
  }

  // Filtre région
  if (params.region) {
    where.region = params.region;
  }

  // Filtre mois de départ
  if (params.month) {
    const year = new Date().getFullYear();
    const startOfMonth = new Date(year, params.month - 1, 1);
    const endOfMonth = new Date(year, params.month, 0, 23, 59, 59);
    where.departureDate = { gte: startOfMonth, lte: endOfMonth };
  }

  // Filtre transport
  if (params.transport) {
    where.transportMode = params.transport;
  }

  // Filtre prix
  if (params.minPrice || params.maxPrice) {
    where.pricePerPersonTTC = {};
    if (params.minPrice) where.pricePerPersonTTC.gte = params.minPrice;
    if (params.maxPrice) where.pricePerPersonTTC.lte = params.maxPrice;
  }

  // Filtre featured
  if (params.featured) {
    where.isFeatured = true;
  }

  // Ordre
  let orderBy: Prisma.TravelOrderByWithRelationInput = { departureDate: 'asc' };
  if (params.sort === 'popular') orderBy = { bookingGroups: { _count: 'desc' } };
  else if (params.sort === 'price-asc') orderBy = { pricePerPersonTTC: 'asc' };
  else if (params.sort === 'price-desc') orderBy = { pricePerPersonTTC: 'desc' };
  else if (params.sort === 'date') orderBy = { departureDate: 'asc' };

  const [data, total] = await Promise.all([
    this.prisma.travel.findMany({
      where,
      orderBy,
      take: params.limit,
      skip: params.offset,
      include: {
        proProfile: { select: { displayName: true, avatarUrl: true } },
        _count: { select: { bookingGroups: true, reviews: true } },
      },
    }),
    this.prisma.travel.count({ where }),
  ]);

  // Si tri proximité demandé et coordonnées fournies
  if (params.sort === 'proximity' && params.lat && params.lng) {
    data.sort((a, b) => {
      const distA = this.haversine(params.lat!, params.lng!, a.departureLat || 48.8566, a.departureLng || 2.3522);
      const distB = this.haversine(params.lat!, params.lng!, b.departureLat || 48.8566, b.departureLng || 2.3522);
      return distA - distB;
    });
  }

  return { data, total, limit: params.limit, offset: params.offset };
}

// Formule Haversine pour distance en km
private haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

### 4. Ajouter le endpoint search-suggestions (pour DestinationSearchBar)

```typescript
@Get('search-suggestions')
async searchSuggestions(@Query('q') q: string, @Query('limit') limit?: number) {
  if (!q || q.length < 2) return { data: [] };

  const results = await this.prisma.travel.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { destinationCity: { contains: q, mode: 'insensitive' } },
        { destinationCountry: { contains: q, mode: 'insensitive' } },
        { departureCity: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: limit || 5,
    select: {
      id: true, title: true, slug: true,
      destinationCity: true, destinationCountry: true,
      departureDate: true, pricePerPersonTTC: true,
      capacity: true, transportMode: true,
      _count: { select: { bookingGroups: true } },
    },
  });

  return {
    data: results.map(r => ({
      id: r.id,
      title: r.title,
      destination: `${r.destinationCity}, ${r.destinationCountry}`,
      slug: r.slug,
      departureDate: r.departureDate.toISOString(),
      priceInCents: r.pricePerPersonTTC,
      availableSpots: r.capacity - (r._count?.bookingGroups || 0),
      transportType: r.transportMode || 'BUS',
    })),
  };
}
```

### 5. Migration Prisma

```bash
cd backend
npx prisma migrate dev --name add-travel-tags-themes-regions
npx prisma generate
```

## Vérification

1. `npx prisma validate` — Schema valide
2. `npm run build` — Backend compile
3. `npm run test` — Tests existants ne cassent pas
4. Tester `GET /travels?theme=nature&month=7` retourne les bons résultats
5. Tester `GET /travels/search-suggestions?q=prov` retourne des suggestions

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Champs Prisma manquants
Ajouter ces champs au model Travel (après les champs Sprint 4 existants) :

```prisma
  // --- Champs ajoutés Audit V2 ---
  tripVideoType     String?   @db.VarChar(30)    // CREATOR_TESTIMONY, INDE_TESTIMONY, PROMO, DRONE
  tripVideoCaption  String?   @db.VarChar(120)   // Légende vidéo (max 120 chars)
  uniquePlaceDescription  String?  @db.Text       // "Pourquoi ce lieu est unique"
  uniqueWhyNotElsewhere   String?  @db.Text       // "Pourquoi on ne le trouve pas ailleurs"
  enableTestimonials      Boolean  @default(false) // Activer les témoignages manuels
  testimonials            Json?                    // [{author, text, date}] — admin modéré
  minPaxToGo              Int?     @default(30)    // Seuil minimum No-Go
  decisionDeadlineAt      DateTime?                // Date limite décision Go/No-Go
  barPublicMessage        String?  @db.Text        // Message public bar/restaurant
  barPhoto                String?                   // Photo bar
  barGoogleMapsUrl        String?                   // Lien Google Maps bar
  restoPublicMessage      String?  @db.Text        // Message public restaurant
  thingsToDoAround        Json?                    // [{name, description, type}] par arrêt
```

### C2. Enum TripVideoType
Ajouter dans la section enums de schema.prisma :

```prisma
enum TripVideoType {
  CREATOR_TESTIMONY
  INDE_TESTIMONY
  PROMO
  DRONE
}
```

Et modifier le champ :
```prisma
  tripVideoType     TripVideoType?
```

### C3. Endpoint search-suggestions : ajouter experienceTags dans la réponse

```typescript
// Dans le select du search-suggestions, ajouter :
experienceTags: true,
isFeatured: true,
isConfirmed: true,
theme: true,
region: true,
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Item 4 → ✅ Tous les 7 chips fonctionnels avec backend
- Item 5 → ✅ Système tags expérience complet (10 tags)
- Item 13 → ✅ Tri proximité via Haversine
- Champs vidéo enrichis → ✅
- Champs unicité voyage → ✅
- Témoignages manuels (schema) → ✅
- No-Go seuil (schema) → ✅
