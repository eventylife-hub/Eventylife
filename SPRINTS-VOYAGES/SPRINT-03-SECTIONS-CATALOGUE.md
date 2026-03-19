# SPRINT 3 — Sections Thématiques Catalogue + Badges Cartes + Pagination

> **Durée estimée** : 1h30
> **Scope** : Page catalogue + TravelCard
> **Pré-requis** : Sprint 1 et 2 terminés

## Contexte (draw.io manquants)

- **Item 6** : 6 sections catalogue thématiques ("Lieux insolites", "Introuvable ailleurs", "Tous les âges", "Immersion locale", "Mer & Soleil", "Montagne & Nature")
- **Item 7** : Badge "Départ confirmé" sur les TravelCards
- **Item 8** : Badge "Coup de cœur Eventy" (gold) sur les cartes
- **Item 10** : Pagination / Lazy loading
- **Item 11** : Vue carte (map view toggle)

## Fichiers à créer

### 1. `frontend/components/catalogue/ThematicSection.tsx` (NOUVEAU)

Composant réutilisable pour une section thématique avec titre, description et carrousel horizontal :

```tsx
'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TravelCard } from '@/components/TravelCard';

interface ThematicSectionProps {
  title: string;
  subtitle: string;
  emoji: string;
  travels: Travel[]; // Même interface que voyages-client
  bgColor?: string;
}

export function ThematicSection({ title, subtitle, emoji, travels, bgColor }: ThematicSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340; // largeur carte + gap
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (travels.length === 0) return null;

  return (
    <section className="py-8" style={{ background: bgColor || 'transparent' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0A1628] flex items-center gap-2">
            <span className="text-2xl">{emoji}</span> {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 rounded-full border hover:bg-gray-50" aria-label="Précédent">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full border hover:bg-gray-50" aria-label="Suivant">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {travels.map((voyage) => (
          <div key={voyage.id} className="flex-shrink-0 w-[300px] snap-start">
            <TravelCard
              id={voyage.id}
              title={voyage.title}
              destination={voyage.destination}
              startDate={voyage.startDate}
              endDate={voyage.endDate}
              priceInCents={voyage.price}
              imageUrl={voyage.image !== '✈️' ? voyage.image : undefined}
              rating={voyage.rating}
              reviewCount={voyage.reviews}
              capacity={voyage.capacity}
              currentBookings={voyage.currentBookings}
              slug={voyage.slug}
              transportType={voyage.transportType}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 2. Modifier `frontend/components/TravelCard.tsx`

Ajouter les props et badges suivants :

```tsx
// Nouvelles props à ajouter à l'interface :
isConfirmed?: boolean;       // Badge "Départ confirmé" vert
isFavorite?: boolean;        // Badge "Coup de cœur Eventy" gold
experienceTags?: string[];   // Tags d'expérience (INSOLITE, LOCAL, etc.)
isAlmostFull?: boolean;      // Calculé si > 85% rempli
```

**Badges à ajouter dans le rendu de la carte** (après l'image, overlay en haut à droite) :

```tsx
{/* Badges overlay */}
<div className="absolute top-3 right-3 flex flex-col gap-1.5">
  {isConfirmed && (
    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
      ✓ Départ confirmé
    </span>
  )}
  {isFavorite && (
    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#D4A853] text-white shadow-sm">
      ★ Coup de cœur
    </span>
  )}
</div>

{/* Tags expérience — en bas de la carte */}
{experienceTags && experienceTags.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-2">
    {experienceTags.slice(0, 3).map(tag => (
      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600">
        {tag}
      </span>
    ))}
  </div>
)}
```

### 3. Modifier `frontend/app/(public)/voyages/voyages-client.tsx`

#### A. Ajouter les sections thématiques AVANT la grille principale

```tsx
import { ThematicSection } from '@/components/catalogue/ThematicSection';
```

Après les chips et avant la grille (vers ligne 420), ajouter les sections dynamiques :

```tsx
{/* Sections thématiques — draw.io */}
{state === 'data' && travels.length > 6 && (
  <div className="space-y-4">
    <ThematicSection
      emoji="✨" title="Lieux insolites" subtitle="Des expériences uniques qu'on ne trouve nulle part ailleurs"
      travels={filteredTravels.filter(t => t.rating >= 4.8).slice(0, 6)}
    />
    <ThematicSection
      emoji="👨‍👩‍👧" title="Tous les âges" subtitle="Des voyages pensés pour les familles et les groupes mixtes"
      travels={filteredTravels.filter(t => t.daysCount <= 5).slice(0, 6)}
    />
    <ThematicSection
      emoji="🌊" title="Mer & Soleil" subtitle="Cap au sud pour du soleil garanti"
      travels={filteredTravels.filter(t =>
        t.destination.toLowerCase().match(/corse|azur|santorin|croatie|grèce|tunisie|espagne|portugal|italie/)
      ).slice(0, 6)}
    />
  </div>
)}
```

#### B. Ajouter la pagination / lazy loading

Remplacer la grille statique par un système de pagination curseur :

```tsx
const [displayCount, setDisplayCount] = useState(12);

// Dans le rendu, afficher seulement displayCount voyages :
{filteredTravels.slice(0, displayCount).map(voyage => ...)}

// Bouton "Voir plus" en bas :
{displayCount < filteredTravels.length && (
  <div className="text-center mt-8">
    <button
      onClick={() => setDisplayCount(prev => prev + 12)}
      className="px-8 py-3 rounded-xl border-2 border-[#C75B39] text-[#C75B39] font-semibold hover:bg-[#C75B39] hover:text-white transition-all"
    >
      Voir plus de voyages ({filteredTravels.length - displayCount} restants)
    </button>
  </div>
)}
```

## Vérification

1. `npx tsc --noEmit`
2. Les sections thématiques s'affichent avec carrousel horizontal
3. Les badges "Départ confirmé" et "Coup de cœur" apparaissent sur les cartes
4. Le bouton "Voir plus" fonctionne et charge 12 voyages de plus
5. Scroll horizontal fluide sur mobile

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Sections thématiques : aligner sur les specs
Remplacer les sections non conformes. Les specs prévoient exactement :

```tsx
{/* ① Autour de chez vous — priorité GPS (si géoloc active) */}
<ThematicSection
  emoji="📍" title="Autour de chez vous" subtitle="Les voyages au départ de votre région"
  travels={sortByProximity ? filteredTravels.slice(0, 6) : []}
/>

{/* ② Lieux insolites */}
<ThematicSection
  emoji="✨" title="Lieux insolites" subtitle="Des expériences uniques qu'on ne trouve nulle part ailleurs"
  travels={filteredTravels.filter(t => t.experienceTags?.includes('INSOLITE')).slice(0, 6)}
/>

{/* ③ Introuvable ailleurs */}
<ThematicSection
  emoji="⭐" title="Introuvable ailleurs" subtitle="Exclusivités Eventy — créés par nos indépendants passionnés"
  travels={filteredTravels.filter(t => t.experienceTags?.includes('EXCLUSIF_EVENTY')).slice(0, 6)}
/>

{/* ④ Pour tous les âges (sous-sections FAMILLE / SENIOR / JEUNES) */}
<ThematicSection
  emoji="👨‍👩‍👧" title="Pour tous les âges" subtitle="Des voyages pensés pour les familles et les groupes mixtes"
  travels={filteredTravels.filter(t =>
    t.experienceTags?.some(tag => ['FAMILLE', 'SENIOR_FRIENDLY', 'JEUNES_ADULTES'].includes(tag))
  ).slice(0, 6)}
/>

{/* ⑤ Courts séjours & weekends */}
<ThematicSection
  emoji="📅" title="Courts séjours & weekends" subtitle="Partez le temps d'un week-end prolongé"
  travels={filteredTravels.filter(t => t.experienceTags?.includes('WEEKEND') || t.daysCount <= 3).slice(0, 6)}
/>

{/* ⑥ Immersion locale */}
<ThematicSection
  emoji="❤️" title="Immersion locale" subtitle="Vivez comme un habitant, pas comme un touriste"
  travels={filteredTravels.filter(t =>
    t.experienceTags?.some(tag => ['IMMERSION', 'LOCAL'].includes(tag))
  ).slice(0, 6)}
/>
```

> **SUPPRIMER** les sections "Mer & Soleil" et "Montagne & Nature" (pas dans les specs).

### C2. Tags cartes : max 2 + "+N" (pas max 3)
Dans TravelCard.tsx, modifier l'affichage des tags :

```tsx
{experienceTags && experienceTags.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-2">
    {experienceTags.slice(0, 2).map(tag => (
      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600">
        {tag}
      </span>
    ))}
    {experienceTags.length > 2 && (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
        +{experienceTags.length - 2}
      </span>
    )}
  </div>
)}
```

### C3. Ajouter toggle Wishlist/Favoris sur TravelCard
Chaque carte doit avoir un cœur cliquable :

```tsx
// Nouvelle prop TravelCard :
isFavorited?: boolean;
onToggleFavorite?: (id: string) => void;

// Dans le rendu, overlay top-left :
<button
  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(id); }}
  className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur shadow-sm hover:bg-white transition-all"
  aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
>
  <Heart className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
</button>
```

Ajouter l'état dans `voyages-client.tsx` :

```tsx
const [favorites, setFavorites] = useState<Set<string>>(new Set());
const toggleFavorite = (id: string) => {
  setFavorites(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  // TODO Sprint futur : POST /api/client/favorites/:id
};
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Items 6, 7, 8, 10 → ✅ Implémenté (Sprint 3)
- Item 11 (vue carte) → Reporté Sprint 8
- Item 5 (tags expérience complet) → Sprint 4 backend
- Wishlist/Favoris toggle → ✅ Sprint 3 (côté client, backend futur)
