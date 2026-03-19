# SPRINT 7 — Page Détail : Carte Interactive, Activités, Assurance, Annulation

> **Durée estimée** : 1h30
> **Scope** : Page détail `/voyages/[slug]` — UX enrichie
> **Pré-requis** : Sprint 6 terminé

## Contexte (draw.io éléments partiels)

- **Item 27** : Carte interactive ramassage (actuellement emoji 🗺️)
- **Item 28** : Photos arrêts de ramassage
- **Item 29** : Message "Pourquoi j'ai créé ce voyage" (creatorWhyMessage)
- **Item 30** : Badge confiance accompagnateur ("X voyages accompagnés")
- **Item 31** : Détails activités (description, durée, point de RDV, "quoi apporter", photo)
- **Item 32** : Photo ambiance bar + note créateur
- **Item 33** : Icônes allergènes restaurant + photo
- **Item 34** : Sélecteur type de chambre (actuellement codé en dur "chambre double")
- **Item 35** : Toggle assurance (option activable/désactivable interactif)
- **Item 36** : Politique annulation visuelle (timeline J-60/J-30/J-15/J-7)
- **Item 37** : Boutons partage WhatsApp/Facebook individuels
- **Item 38** : Gating PREANNOUNCE vs BOOKABLE
- **Item 39** : Toggle programmeEnabled
- **Item 40** : Lien IPID assurance
- **Item 41** : CTA "Être rappelé" dans section équipe

## Fichiers à créer

### 1. `frontend/components/travel-detail/PickupMap.tsx` (NOUVEAU)

Carte interactive des arrêts de ramassage avec Leaflet (OpenStreetMap) :

```
Fonctionnalités :
- Carte Leaflet (react-leaflet) avec marqueurs pour chaque arrêt
- Marqueurs personnalisés avec numéro d'ordre
- Popup au clic : nom de l'arrêt, heure, adresse, photo (si disponible)
- Itinéraire tracé entre les arrêts (polyline)
- Bouton "Voir l'itinéraire complet" → Google Maps
- Fallback si pas de coordonnées : liste simple des arrêts
- Dépendance : npm install react-leaflet leaflet
- Note : import dynamique (next/dynamic) car Leaflet nécessite window
```

### 2. `frontend/components/travel-detail/ActivityDetails.tsx` (NOUVEAU)

Détails enrichis des activités du programme :

```
Fonctionnalités :
- Pour chaque activité du programme :
  - Photo de l'activité
  - Description complète
  - Durée estimée
  - Point de rendez-vous
  - "Quoi apporter" (liste)
  - Niveau de difficulté (facile/moyen/difficile)
- Accordéon expansible pour les détails
```

### 3. `frontend/components/travel-detail/RoomTypeSelector.tsx` (NOUVEAU)

Sélecteur de type de chambre interactif :

```
Fonctionnalités :
- Charge les RoomType depuis le travel (via API)
- Pour chaque type : label, capacité, prix, places disponibles
- Radio button avec carte visuelle
- Badge "Dernières places" si < 5 disponibles
- Le prix dans la sidebar se met à jour selon le choix
- Types : Simple, Double, Triple, Familiale, Suite
- Props : roomTypes[], selectedRoomTypeId, onSelect
```

### 4. `frontend/components/travel-detail/InsuranceToggle.tsx` (NOUVEAU)

Toggle assurance interactif :

```
Fonctionnalités :
- Switch On/Off visuellement clair
- Texte : "Assurance annulation & interruption"
- Prix de l'option affiché (+XX€ / personne)
- Lien vers IPID (Information Product Insurance Document) - PDF
- Au toggle, le prix total dans la sidebar se met à jour
- Inclus par défaut dans le Pack Sérénité (mais peut être décliné)
- Message : "Inclus dans votre Pack Sérénité — vous pouvez le décliner si vous avez déjà une assurance"
```

### 5. `frontend/components/travel-detail/CancellationTimeline.tsx` (NOUVEAU)

Timeline visuelle de la politique d'annulation :

```
Fonctionnalités :
- Timeline horizontale avec 4 jalons : J-60, J-30, J-15, J-7
- Chaque jalon : icône, date, pourcentage remboursé, couleur
  - J-60+ : 100% remboursé → Vert
  - J-60 à J-30 : 75% remboursé → Jaune-vert
  - J-30 à J-15 : 50% remboursé → Orange
  - J-15 à J-7 : 25% remboursé → Rouge-orange
  - < J-7 : Non remboursable → Rouge
- Indicateur "Vous êtes ici" basé sur la date de départ
- Animation au reveal
```

### 6. `frontend/components/travel-detail/CreatorMessage.tsx` (NOUVEAU)

Message "Pourquoi j'ai créé ce voyage" :

```
Fonctionnalités :
- Carte avec fond doux (crème/beige)
- Avatar du créateur + nom
- Guillemets stylisés
- Texte du message (creatorWhyMessage)
- Badge "X voyages accompagnés"
- CTA : "Message" et "Être rappelé" (pas juste Message/Appeler)
```

### 7. Modifier `voyage-detail-client.tsx`

Remplacer les sections placeholder par les vrais composants :

```
Modifications :
1. Remplacer emoji 🗺️ par <PickupMap stops={travel.stops} />
2. Remplacer "chambre double" codé en dur par <RoomTypeSelector />
3. Remplacer texte assurance statique par <InsuranceToggle />
4. Remplacer texte politique annulation par <CancellationTimeline departureDate={travel.departureDate} />
5. Ajouter <CreatorMessage /> dans section accompagnateur
6. Ajouter gating conditionnel : if (travel.status === 'PREANNOUNCE') → afficher PreannounceForm au lieu du bouton réserver
7. Ajouter vérification travel.programEnabled → masquer programme si false
```

### 8. Backend : Enrichir le endpoint GET /travels/:slug

Ajouter dans la réponse :

```typescript
// Champs à inclure dans le select :
creatorWhyMessage: true,
videoUrl: true,
hostVideoUrl: true,
faqJson: true,
experienceTags: true,
isFeatured: true,
isConfirmed: true,
// + include roomTypes
roomTypes: { orderBy: { sortOrder: 'asc' } },
// + include reviews count
_count: { select: { reviews: true, waitlistEntries: true, preReservations: true } },
```

## Dépendances npm à installer

```bash
cd frontend
npm install react-leaflet leaflet
npm install -D @types/leaflet
```

## Vérification

1. `npx tsc --noEmit`
2. La carte de ramassage s'affiche avec les marqueurs
3. Le sélecteur de chambre met à jour le prix dans la sidebar
4. Le toggle assurance fonctionne et affiche le lien IPID
5. La timeline d'annulation s'affiche avec les jalons colorés
6. Le message créateur s'affiche avec le badge voyages

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Bloc "Pourquoi ce voyage est unique" (NOUVEAU composant)
Créer `frontend/components/travel-detail/UniqueBlock.tsx` :

```tsx
interface UniqueBlockProps {
  uniquePlaceDescription?: string;
  uniqueWhyNotElsewhere?: string;
}

// Affiché UNIQUEMENT si au moins 1 des 2 champs est rempli
// Carte avec fond gradient léger (crème → beige)
// Titre : "Pourquoi ce voyage est unique"
// 2 sous-sections :
//   🌍 "Ce lieu" → uniquePlaceDescription
//   ⭐ "Pourquoi c'est introuvable ailleurs" → uniqueWhyNotElsewhere
// Position dans la page : APRÈS le programme, AVANT l'hébergement
```

### C2. CTA sticky mobile (NOUVEAU composant)
Créer `frontend/components/travel-detail/StickyMobileCTA.tsx` :

```tsx
// Barre fixe en bas de l'écran (mobile only, md:hidden)
// Contenu :
//   - Prix "À partir de XX€" (gauche)
//   - Bouton "Réserver" OU "Liste d'attente" OU "Être notifié" (droite)
// Conditionnel :
//   - PREANNOUNCE → "Être notifié"
//   - BOOKABLE + places dispo → "Réserver"
//   - BOOKABLE + complet → "Liste d'attente"
// Z-index: 40, bg-white, border-t, shadow-lg
// Disparaît quand le hero CTA est visible (IntersectionObserver)
```

### C3. Accessibilité ramassage enrichie
Dans `PickupMap.tsx`, enrichir les popups des arrêts :

```tsx
interface PickupStop {
  name: string;
  address: string;
  lat: number;
  lng: number;
  photo?: string;
  time?: string;
  // AJOUTS V2 :
  accessibilityTags?: string[]; // ['parking', 'abri', 'eclairage', 'pmr']
  thingsToDoAround?: { name: string; description: string; type: string }[];
}

// Dans le popup Leaflet, ajouter :
{stop.accessibilityTags && (
  <div className="flex gap-1 mt-1">
    {stop.accessibilityTags.includes('parking') && <span title="Parking">🅿️</span>}
    {stop.accessibilityTags.includes('abri') && <span title="Abri">🏠</span>}
    {stop.accessibilityTags.includes('eclairage') && <span title="Éclairage">💡</span>}
    {stop.accessibilityTags.includes('pmr') && <span title="Accessible PMR">♿</span>}
  </div>
)}
{stop.thingsToDoAround?.length > 0 && (
  <div className="mt-2 text-xs">
    <p className="font-medium">À faire autour :</p>
    {stop.thingsToDoAround.map(t => <p key={t.name}>• {t.name}</p>)}
  </div>
)}
```

### C4. Amenities HRA pictos (NOUVEAU composant)
Créer `frontend/components/travel-detail/AccommodationAmenities.tsx` :

```tsx
// Affiche les amenities de l'hébergement sous forme de pictos
// Props : amenities (string[])
// Pictos : wifi, piscine, spa, parking, restaurant, bar, climatisation, coffre, vue_mer, jardin
// Position : dans la section hébergement, sous le nom de l'hôtel
// Grid 2 colonnes mobile, 4 colonnes desktop
// Chaque amenity = icône + label
```

### C5. Restaurant/Bar détail (NOUVEAU composant)
Créer `frontend/components/travel-detail/RestaurantBarDetail.tsx` :

```tsx
interface RestaurantBarDetailProps {
  barPublicMessage?: string;
  barPhoto?: string;
  barGoogleMapsUrl?: string;
  restoPublicMessage?: string;
  mealIncluded?: boolean;
}

// Affiché dans la section hébergement/restauration
// Si barPhoto → image + message + lien Google Maps
// Si restoPublicMessage → texte info repas
// Si mealIncluded → badge "Repas inclus"
```

### C6. Activités : 6 champs complets
Vérifier que `ActivityDetails.tsx` intègre bien les 6 champs specs :

```tsx
interface ActivityItem {
  title: string;
  photo?: string;          // ✅ photo de l'activité
  description: string;     // ✅ description complète
  duration?: string;       // ✅ durée estimée (ex: "2h30")
  meetingPoint?: string;   // ✅ point de RDV
  whatToBring?: string[];  // ✅ liste "quoi apporter"
  level?: 'facile' | 'moyen' | 'difficile'; // ✅ niveau difficulté
}

// Afficher un badge couleur pour le niveau :
// facile → vert, moyen → orange, difficile → rouge
```

### C7. Intégration des nouveaux composants dans voyage-detail-client.tsx

```
Ajouts dans le JSX :
1. UniqueBlock → APRÈS programme, AVANT hébergement
2. AccommodationAmenities → Dans section hébergement
3. RestaurantBarDetail → Dans section hébergement/restauration
4. StickyMobileCTA → En dehors du layout principal (position fixed)
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Items 27-41 → ✅ Implémenté (Sprint 7)
- Bloc unicité voyage → ✅
- CTA sticky mobile → ✅
- Accessibilité ramassage enrichie → ✅
- Amenities HRA → ✅
- Restaurant/Bar détail → ✅
- Activités 6 champs → ✅
