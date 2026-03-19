# SPRINT 8 — SEO JSON-LD, Meta OG, Vue Carte, Vérification Finale

> **Durée estimée** : 1h
> **Scope** : SEO structuré + vue carte catalogue + vérification globale
> **Pré-requis** : Sprints 1-7 terminés

## Contexte (draw.io manquants restants)

- **Item 11** : Vue carte (map view toggle) sur le catalogue
- **Item 12** : SEO JSON-LD + Meta OG dans la page listing (PARTIELLEMENT fait — enrichir)
- **Item 23** : JSON-LD (TravelAction + Event schema) sur page détail
- **Item 24** : Meta OG (titre, description, image, prix) sur page détail

## Fichiers à modifier

### 1. SEO Page Détail — `frontend/app/(public)/voyages/[slug]/page.tsx`

Enrichir le metadata dynamique et JSON-LD :

```typescript
// generateMetadata() — Ajouter les champs OG complets :
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const travel = await fetchTravel(params.slug);
  if (!travel) return { title: 'Voyage non trouvé' };

  return {
    title: `${travel.title} — Voyage de groupe | Eventy Life`,
    description: travel.summary || travel.description?.slice(0, 155),
    keywords: [travel.destinationCity, travel.theme, 'voyage de groupe', 'accompagné'].filter(Boolean),
    openGraph: {
      title: travel.title,
      description: travel.summary || travel.description?.slice(0, 155) || '',
      url: `https://www.eventylife.fr/voyages/${travel.slug}`,
      siteName: 'Eventy Life',
      locale: 'fr_FR',
      type: 'website',
      images: travel.coverImageUrl ? [{
        url: travel.coverImageUrl,
        width: 1200, height: 630,
        alt: travel.title,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: travel.title,
      description: travel.summary || '',
      images: travel.coverImageUrl ? [travel.coverImageUrl] : [],
    },
    alternates: {
      canonical: `https://www.eventylife.fr/voyages/${travel.slug}`,
    },
  };
}
```

**JSON-LD TravelAction + Event** :

```typescript
const travelSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: travel.title,
  description: travel.summary,
  url: `https://www.eventylife.fr/voyages/${travel.slug}`,
  image: travel.coverImageUrl,
  touristType: 'Voyage de groupe accompagné',
  itinerary: {
    '@type': 'ItemList',
    itemListElement: travel.stops?.map((stop: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: { '@type': 'Place', name: stop.name, address: stop.address },
    })),
  },
  offers: {
    '@type': 'Offer',
    price: (travel.pricePerPersonTTC / 100).toFixed(2),
    priceCurrency: 'EUR',
    availability: travel.currentBookings >= travel.capacity
      ? 'https://schema.org/SoldOut'
      : 'https://schema.org/InStock',
    validFrom: travel.salesOpenAt,
    url: `https://www.eventylife.fr/voyages/${travel.slug}`,
  },
  provider: {
    '@type': 'TravelAgency',
    name: 'Eventy Life',
    url: 'https://www.eventylife.fr',
    logo: 'https://www.eventylife.fr/logo.svg',
  },
  startDate: travel.departureDate,
  endDate: travel.returnDate,
};

// FAQPage schema (si FAQ présent)
const faqSchema = travel.faq && travel.faq.length > 0 ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: travel.faq.map((item: any) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
} : null;
```

### 2. SEO Page Catalogue — `frontend/app/(public)/voyages/page.tsx`

Le JSON-LD statique existant (lignes 39-100) doit devenir DYNAMIQUE :
- Charger la liste des voyages côté serveur
- Générer l'ItemList à partir des vraies données
- Pas de données hardcodées

```typescript
// Remplacer la constante statique par un fetch serveur :
async function getPublishedTravels() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels?status=PUBLISHED&limit=50`, {
      next: { revalidate: 3600 }, // Cache 1h
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function VoyagesPage() {
  const travels = await getPublishedTravels();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Voyages de groupe Eventy Life',
    url: 'https://www.eventylife.fr/voyages',
    numberOfItems: travels.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: travels.map((t: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'TouristTrip',
        name: t.title,
        description: t.summary || t.description?.slice(0, 155),
        url: `https://www.eventylife.fr/voyages/${t.slug}`,
        image: t.coverImageUrl,
        offers: {
          '@type': 'Offer',
          price: (t.pricePerPersonTTC / 100).toFixed(2),
          priceCurrency: 'EUR',
        },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <VoyagesPageClient />
    </>
  );
}
```

### 3. Vue Carte Catalogue — `frontend/components/catalogue/MapViewToggle.tsx` (NOUVEAU)

Toggle entre vue liste et vue carte :

```
Fonctionnalités :
- Bouton toggle : "📋 Liste" / "🗺️ Carte"
- Vue carte : Leaflet avec marqueurs pour chaque voyage
- Popup au clic : mini-card avec titre, prix, image thumbnail, lien
- Clustering si > 20 marqueurs
- Responsive : en mode mobile, carte plein largeur sous les filtres
- Dépendance : react-leaflet (déjà installé Sprint 7)
```

### 4. Modifier `voyages-client.tsx` — Intégrer le toggle

```tsx
import { MapViewToggle } from '@/components/catalogue/MapViewToggle';

// State
const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

// Dans le JSX, après les filtres et avant la grille :
<div className="flex items-center justify-between mb-4">
  <p className="text-sm text-gray-500">{filteredTravels.length} voyage(s)</p>
  <div className="flex gap-2">
    <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'list' ? 'bg-[#C75B39] text-white' : 'bg-gray-100'}`}>
      📋 Liste
    </button>
    <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-lg text-sm ${viewMode === 'map' ? 'bg-[#C75B39] text-white' : 'bg-gray-100'}`}>
      🗺️ Carte
    </button>
  </div>
</div>

{viewMode === 'map' ? (
  <MapViewToggle travels={filteredTravels} />
) : (
  // Grille existante
)}
```

## Vérification FINALE (tous les sprints)

### Checklist SEO
- [ ] Page catalogue : JSON-LD ItemList dynamique
- [ ] Page catalogue : Breadcrumb JSON-LD
- [ ] Page détail : JSON-LD TouristTrip
- [ ] Page détail : JSON-LD FAQPage (si FAQ)
- [ ] Page détail : Meta OG complètes (titre, desc, image, prix)
- [ ] Page détail : opengraph-image.tsx génère une image OG

### Checklist Fonctionnelle
- [ ] Catalogue : Barre recherche autocomplete fonctionne
- [ ] Catalogue : 3 voyages en vedette affichés
- [ ] Catalogue : Bandeau confiance en bas
- [ ] Catalogue : Chips filtres complets (transport, thème, mois, proximité)
- [ ] Catalogue : Sections thématiques avec carrousel
- [ ] Catalogue : Badges "Départ confirmé" et "Coup de cœur" sur cartes
- [ ] Catalogue : Pagination "Voir plus"
- [ ] Catalogue : Toggle liste/carte
- [ ] Détail : Galerie photos + lightbox
- [ ] Détail : Vidéo YouTube RGPD 2-click
- [ ] Détail : Vidéo accompagnateur
- [ ] Détail : Carte ramassage interactive
- [ ] Détail : Sélecteur type chambre
- [ ] Détail : Toggle assurance + lien IPID
- [ ] Détail : Timeline annulation visuelle
- [ ] Détail : Message créateur + badge
- [ ] Détail : Formulaire préannonce / Waitlist
- [ ] Détail : Section avis
- [ ] Détail : FAQ accordéon
- [ ] Détail : Voyages similaires
- [ ] Détail : QR code + partage réseaux sociaux
- [ ] Détail : Compteur intéressés

### Vérification technique
```bash
cd frontend && npx tsc --noEmit
cd backend && npx prisma validate && npm run build
npm run test
```

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Pages SEO `/depart/[ville]` (EXISTANTES mais à enrichir)
Les pages `/depart/[ville]` existent déjà (5 fichiers). Vérifier et enrichir :

```
- page.tsx → Meta dynamiques par ville
- JSON-LD ItemList des voyages depuis cette ville
- H1 : "Voyages de groupe au départ de {ville}"
- Filtres pré-appliqués : departureCity = ville
- Breadcrumb : Accueil > Villes de départ > {ville}
```

### C2. UTM tracking auto sur liens partagés
Dans `TravelShareQR.tsx`, ajouter des UTM à tous les liens partagés :

```tsx
const shareUrl = (source: string) => {
  const base = `https://www.eventylife.fr/voyages/${slug}`;
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: 'social',
    utm_campaign: `voyage-${slug}`,
  });
  return `${base}?${params.toString()}`;
};

// WhatsApp : shareUrl('whatsapp')
// Facebook : shareUrl('facebook')
// Email : shareUrl('email')
// Copier : shareUrl('link')
```

### C3. Sitemap dynamique voyages
Créer `frontend/app/sitemap.ts` (ou enrichir si existant) :

```tsx
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels?status=PUBLISHED&limit=1000`);
  const { data } = await res.json();

  const travelUrls = data.map((t: any) => ({
    url: `https://www.eventylife.fr/voyages/${t.slug}`,
    lastModified: t.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: 'https://www.eventylife.fr', lastModified: new Date(), priority: 1 },
    { url: 'https://www.eventylife.fr/voyages', lastModified: new Date(), priority: 0.9 },
    ...travelUrls,
  ];
}
```

### C4. JSON-LD TravelAction en complément de TouristTrip
Les specs mentionnent TravelAction + Event. Ajouter en plus du TouristTrip :

```typescript
const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: travel.title,
  startDate: travel.departureDate,
  endDate: travel.returnDate,
  location: {
    '@type': 'Place',
    name: travel.destinationCity,
    address: `${travel.destinationCity}, ${travel.destinationCountry}`,
  },
  organizer: {
    '@type': 'Organization',
    name: 'Eventy Life',
    url: 'https://www.eventylife.fr',
  },
  offers: travelSchema.offers,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
};

// Ajouter les deux scripts JSON-LD :
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(travelSchema) }} />
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
{faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- TOUS les items → ✅ Implémenté
- Pages /depart/[ville] enrichies → ✅
- UTM tracking → ✅
- Sitemap dynamique → ✅
- JSON-LD Event + TravelAction → ✅
- Marquer le rapport comme COMPLET
- Mettre à jour `SPRINTS-VOYAGES/README.md` — Tous les sprints cochés ✅
