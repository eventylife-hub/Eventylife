# SPRINT 2 — Chips Filtres Catalogue (draw.io manquants)

> **Durée estimée** : 1h
> **Scope** : Page catalogue `/voyages` — système de chips filtres
> **Pré-requis** : Sprint 1 terminé

## Contexte

Le draw.io définit 7 chips de filtrage rapide. Le site n'en a que 2 (Bus, Avion) + prix/durée.

**Chips draw.io manquants** :
- 🗺️ **Autour de vous** (géolocalisation GPS → tri par proximité)
- 📍 **Région** (Île-de-France, PACA, Bretagne, Alsace, etc.)
- 📅 **Date** (mois de départ)
- 🎨 **Thème** (Gastronomie, Culture, Nature, Aventure, Détente, Sport)
- ✨ **Expérience** (INSOLITE, LOCAL, EXCLUSIF, NATURE, FAMILLE, etc.)

## Fichiers à modifier

### 1. `frontend/app/(public)/voyages/voyages-client.tsx`

#### A. Ajouter les états de filtre

Après les états existants (vers ligne 131), ajouter :

```tsx
const [regionFilter, setRegionFilter] = useState<string>('');
const [themeFilter, setThemeFilter] = useState<string>('');
const [experienceFilter, setExperienceFilter] = useState<string>('');
const [monthFilter, setMonthFilter] = useState<string>('');
const [sortByProximity, setSortByProximity] = useState(false);
const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
```

#### B. Ajouter la géolocalisation (lazy, au clic)

```tsx
const requestGeolocation = useCallback(() => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setSortByProximity(true);
    },
    () => {
      // Silencieux si refusé — pas de message d'erreur intrusif
      logger.info('[Voyages] Géolocalisation refusée par l\'utilisateur');
    },
    { timeout: 5000, maximumAge: 300000 }
  );
}, []);
```

#### C. Constantes pour les filtres

```tsx
const REGIONS = [
  { label: 'Île-de-France', value: 'idf' },
  { label: 'PACA', value: 'paca' },
  { label: 'Bretagne', value: 'bretagne' },
  { label: 'Alsace', value: 'alsace' },
  { label: 'Auvergne-Rhône-Alpes', value: 'ara' },
  { label: 'Occitanie', value: 'occitanie' },
  { label: 'Nouvelle-Aquitaine', value: 'naq' },
  { label: 'Normandie', value: 'normandie' },
];

const THEMES = [
  { label: '🍷 Gastronomie', value: 'gastronomie' },
  { label: '🏛️ Culture', value: 'culture' },
  { label: '🌿 Nature', value: 'nature' },
  { label: '🏔️ Aventure', value: 'aventure' },
  { label: '🧘 Détente', value: 'detente' },
  { label: '⚽ Sport', value: 'sport' },
];

const EXPERIENCES = [
  { label: '✨ Insolite', value: 'INSOLITE' },
  { label: '🏠 Local', value: 'LOCAL' },
  { label: '👑 Exclusif', value: 'EXCLUSIF' },
  { label: '🌿 Nature', value: 'NATURE' },
  { label: '👨‍👩‍👧 Famille', value: 'FAMILLE' },
  { label: '🎉 Festif', value: 'FESTIF' },
];

const MONTHS = [
  { label: 'Avr.', value: '4' },
  { label: 'Mai', value: '5' },
  { label: 'Juin', value: '6' },
  { label: 'Juil.', value: '7' },
  { label: 'Août', value: '8' },
  { label: 'Sep.', value: '9' },
  { label: 'Oct.', value: '10' },
  { label: 'Nov.', value: '11' },
  { label: 'Déc.', value: '12' },
];
```

#### D. Remplacer la section ChipGroup existante

Remplacer le ChipGroup actuel (lignes ~276-308) par une version multi-lignes avec toutes les catégories :

```tsx
{/* Filtres rapides — Chips draw.io complet */}
<div className="space-y-3">
  {/* Ligne 1 : Transport + durée + proximité */}
  <ChipGroup label="Type :">
    <Chip label="Tous" selected={!transportFilter && !durationFilter} onClick={() => { setTransportFilter(''); setDurationFilter(''); setMaxPrice(null); setMinPrice(null); }} color="terra" />
    <Chip label="🚌 Bus" selected={transportFilter === 'BUS'} onClick={() => setTransportFilter('BUS')} color="terra" />
    <Chip label="✈️ Avion" selected={transportFilter === 'AVION'} onClick={() => setTransportFilter('AVION')} color="terra" />
    <Chip label="⚡ Week-end" selected={durationFilter === 'short'} onClick={() => setDurationFilter(durationFilter === 'short' ? '' : 'short')} color="terra" />
    <Chip label="📅 1 semaine" selected={durationFilter === 'week'} onClick={() => setDurationFilter(durationFilter === 'week' ? '' : 'week')} color="terra" />
    <Chip label="🗺️ Autour de moi" selected={sortByProximity} onClick={requestGeolocation} color="ocean" />
  </ChipGroup>

  {/* Ligne 2 : Thèmes */}
  <ChipGroup label="Thème :">
    {THEMES.map(t => (
      <Chip key={t.value} label={t.label} selected={themeFilter === t.value} onClick={() => setThemeFilter(themeFilter === t.value ? '' : t.value)} color="gold" />
    ))}
  </ChipGroup>

  {/* Ligne 3 : Mois de départ (scrollable) */}
  <ChipGroup label="Départ :">
    {MONTHS.map(m => (
      <Chip key={m.value} label={m.label} selected={monthFilter === m.value} onClick={() => setMonthFilter(monthFilter === m.value ? '' : m.value)} color="violet" />
    ))}
  </ChipGroup>
</div>
```

#### E. Mettre à jour le useEffect de filtrage

Dans le `useEffect` de filtrage (vers ligne 167), ajouter les nouveaux filtres :

```tsx
// Après les filtres existants, ajouter :
if (monthFilter) {
  result = result.filter(t => {
    const month = new Date(t.startDate).getMonth() + 1;
    return month.toString() === monthFilter;
  });
}
// Note : themeFilter et experienceFilter nécessitent des champs backend
// Pour l'instant, on les prépare mais ils filtrent sur le titre/destination en fallback
if (themeFilter) {
  result = result.filter(t =>
    t.title.toLowerCase().includes(themeFilter.toLowerCase()) ||
    t.destination.toLowerCase().includes(themeFilter.toLowerCase())
  );
}
```

### 2. `frontend/components/ui/chip.tsx` (si nécessaire)

Vérifier que le composant `Chip` accepte la prop `color` avec les valeurs `"terra"`, `"ocean"`, `"gold"`, `"violet"`. Si non, ajouter le support.

## Vérification

1. `npx tsc --noEmit` — Pas d'erreur TypeScript
2. Les chips s'affichent sur 3 lignes
3. Cliquer "Autour de moi" déclenche la demande de géolocalisation
4. Filtrer par mois fonctionne
5. Les filtres actifs apparaissent dans la barre de filtre active

## Résultat attendu

Page `/voyages` avec :
- 3 lignes de chips filtres (transport/durée/proximité, thèmes, mois)
- Géolocalisation paresseuse au clic
- Filtre par mois fonctionnel
- Thèmes préparés (filtrage textuel en attendant le backend Sprint 4)

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Tags expérience : 10 tags au lieu de 6
Les specs prévoient **10 tags**, pas 6. Remplacer la constante `EXPERIENCES` par :

```tsx
const EXPERIENCES = [
  { label: '✨ Insolite', value: 'INSOLITE' },
  { label: '📍 Local', value: 'LOCAL' },
  { label: '⭐ Exclusif Eventy', value: 'EXCLUSIF_EVENTY' },
  { label: '🌿 Nature sauvage', value: 'NATURE_SAUVAGE' },
  { label: '👨‍👩‍👧 Famille', value: 'FAMILLE' },
  { label: '☕ Senior friendly', value: 'SENIOR_FRIENDLY' },
  { label: '⚡ Jeunes adultes', value: 'JEUNES_ADULTES' },
  { label: '♿ Accessible PMR', value: 'ACCESSIBLE_PMR' },
  { label: '📅 Weekend', value: 'WEEKEND' },
  { label: '❤️ Immersion', value: 'IMMERSION' },
];
```

### C2. Ajouter chip Région (ligne JSX manquante)
Ajouter une 4ème ligne de chips pour les régions :

```tsx
{/* Ligne 4 : Régions */}
<ChipGroup label="Région :">
  {REGIONS.map(r => (
    <Chip key={r.value} label={r.label} selected={regionFilter === r.value}
      onClick={() => setRegionFilter(regionFilter === r.value ? '' : r.value)} color="ocean" />
  ))}
</ChipGroup>
```

### C3. Ajouter slider BUDGET (range prix)
Après les chips, ajouter un range slider prix min/max :

```tsx
const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 500000]); // centimes

{/* Slider budget */}
<div className="flex items-center gap-4 mt-3">
  <span className="text-sm text-gray-500">Budget :</span>
  <input type="range" min={0} max={500000} step={5000}
    value={budgetRange[0]} onChange={e => setBudgetRange([+e.target.value, budgetRange[1]])} />
  <span className="text-sm">{(budgetRange[0]/100).toFixed(0)}€ — {(budgetRange[1]/100).toFixed(0)}€</span>
  <input type="range" min={0} max={500000} step={5000}
    value={budgetRange[1]} onChange={e => setBudgetRange([budgetRange[0], +e.target.value])} />
</div>
```

### C4. Slider rayon géolocalisation (0-500km, défaut 100km)
Quand "Autour de moi" est activé, afficher un slider rayon :

```tsx
const [geoRadius, setGeoRadius] = useState(100); // km

{sortByProximity && (
  <div className="flex items-center gap-3 mt-2">
    <span className="text-sm">Rayon :</span>
    <input type="range" min={10} max={500} step={10} value={geoRadius}
      onChange={e => setGeoRadius(+e.target.value)} className="flex-1" />
    <span className="text-sm font-medium">{geoRadius} km</span>
  </div>
)}
```

### C5. Filtres persistants dans URL
Synchroniser les filtres avec `searchParams` (Next.js) :

```tsx
import { useSearchParams, useRouter } from 'next/navigation';

// Au montage : lire les filtres depuis l'URL
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('theme')) setThemeFilter(params.get('theme')!);
  if (params.get('region')) setRegionFilter(params.get('region')!);
  if (params.get('month')) setMonthFilter(params.get('month')!);
  if (params.get('exp')) setExperienceFilter(params.get('exp')!);
}, []);

// À chaque changement de filtre : mettre à jour l'URL
useEffect(() => {
  const params = new URLSearchParams();
  if (themeFilter) params.set('theme', themeFilter);
  if (regionFilter) params.set('region', regionFilter);
  if (monthFilter) params.set('month', monthFilter);
  if (experienceFilter) params.set('exp', experienceFilter);
  window.history.replaceState({}, '', `?${params.toString()}`);
}, [themeFilter, regionFilter, monthFilter, experienceFilter]);
```

### C6. Bouton Reset filtres
Ajouter un bouton pour tout effacer :

```tsx
const hasActiveFilters = transportFilter || themeFilter || regionFilter || monthFilter || experienceFilter || sortByProximity;

{hasActiveFilters && (
  <button onClick={() => {
    setTransportFilter(''); setThemeFilter(''); setRegionFilter('');
    setMonthFilter(''); setExperienceFilter(''); setSortByProximity(false);
    setDurationFilter(''); setBudgetRange([0, 500000]);
  }} className="text-sm text-[#C75B39] underline">
    Réinitialiser les filtres
  </button>
)}
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Item 4 → Statut : ✅ 7/7 chips + sliders implémentés (Sprint 2)
- Item 13 → Statut : ✅ Tri proximité avec rayon configurable
- Filtres URL persistants ✅
