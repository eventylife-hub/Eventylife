# SPRINT 5 — Page Détail : Vidéos, Galerie Photos, Lightbox

> **Durée estimée** : 1h30
> **Scope** : Page détail `/voyages/[slug]` — médias visuels
> **Pré-requis** : Sprint 4 terminé (champs backend videoUrl, hostVideoUrl, galleryUrls)

## Contexte (draw.io manquants)

- **Item 14** : Vidéo voyage (TravelHeroVideo) — YouTube nocookie + RGPD 2-click
- **Item 15** : Vidéo indépendant (HostIntroVideo) — intro personnelle
- **Item 16** : Galerie photos réelle + lightbox (actuellement que des emojis placeholder)

## Fichiers à créer

### 1. `frontend/components/travel-detail/TravelHeroVideo.tsx` (NOUVEAU)

Composant vidéo YouTube avec consentement RGPD 2-click :

```
Fonctionnalités :
- Thumbnail YouTube en placeholder (pas de chargement iframe avant clic)
- Bouton "▶ Voir la vidéo" avec mention RGPD
- Au clic : charge l'iframe YouTube nocookie
- Props : videoUrl (string), title (string), posterUrl? (string)
- Style : 16:9, rounded-2xl, shadow, overlay gradient
```

**Template code** :

```tsx
'use client';
import { useState } from 'react';
import { Play, Shield } from 'lucide-react';

interface TravelHeroVideoProps {
  videoUrl: string;  // URL YouTube complète ou ID
  title: string;
  posterUrl?: string;
}

export function TravelHeroVideo({ videoUrl, title, posterUrl }: TravelHeroVideoProps) {
  const [consent, setConsent] = useState(false);

  // Extraire l'ID YouTube
  const videoId = videoUrl.includes('youtu')
    ? videoUrl.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1]
    : videoUrl;

  if (!videoId) return null;

  const thumbnail = posterUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
      {consent ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <button
          onClick={() => setConsent(true)}
          className="w-full h-full relative group cursor-pointer"
          aria-label={`Lire la vidéo : ${title}`}
        >
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            <p className="text-sm font-medium">Voir la vidéo du voyage</p>
            <p className="text-[10px] text-white/60 mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3" /> YouTube (nocookie) — RGPD conforme
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
```

### 2. `frontend/components/travel-detail/HostIntroVideo.tsx` (NOUVEAU)

Même pattern que TravelHeroVideo mais avec le contexte indépendant :

```
- Avatar de l'indépendant à gauche
- "Découvrez votre accompagnateur" comme titre
- Vidéo plus petite (max-w-lg)
- Badge "X voyages accompagnés" sous la vidéo
```

### 3. `frontend/components/travel-detail/PhotoGallery.tsx` (NOUVEAU)

Galerie photos avec lightbox :

```
Fonctionnalités :
- Grid responsive : 1 grande photo (2/3 largeur) + 2 petites (1/3)
- Bouton "Voir les X photos" qui ouvre le lightbox
- Lightbox plein écran avec navigation gauche/droite + miniatures
- Zoom au clic
- Fermer avec Escape ou clic overlay
- Props : images (string[]), alt (string)
```

**Template code** :

```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface PhotoGalleryProps {
  images: string[];
  alt: string;
}

export function PhotoGallery({ images, alt }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation clavier
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setCurrentIndex(i => Math.min(i + 1, images.length - 1));
    if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(i - 1, 0));
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!images || images.length === 0) return null;

  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Grid preview */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[400px]">
        <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt={`${alt} - Photo 1`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        {images.slice(1, 5).map((img, idx) => (
          <div key={idx} className="relative cursor-pointer group overflow-hidden" onClick={() => openLightbox(idx + 1)}>
            <img src={img} alt={`${alt} - Photo ${idx + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
        ))}
        {images.length > 5 && (
          <button
            onClick={() => openLightbox(4)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-colors"
          >
            <Expand className="w-4 h-4 inline mr-1.5" />
            Voir les {images.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white z-10" onClick={() => setLightboxOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => Math.max(i - 1, 0)); }}>
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => Math.min(i + 1, images.length - 1)); }}>
            <ChevronRight className="w-10 h-10" />
          </button>
          <img
            src={images[currentIndex]}
            alt={`${alt} - Photo ${currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
          {/* Miniatures */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
```

### 4. Modifier `frontend/app/(public)/voyages/[slug]/voyage-detail-client.tsx`

**Intégrer les 3 composants** dans la page existante (926 lignes) :

```tsx
// Imports à ajouter :
import { TravelHeroVideo } from '@/components/travel-detail/TravelHeroVideo';
import { HostIntroVideo } from '@/components/travel-detail/HostIntroVideo';
import { PhotoGallery } from '@/components/travel-detail/PhotoGallery';
```

**Emplacement dans le JSX** :

1. `PhotoGallery` → APRÈS le hero, AVANT le programme (remplacer les emojis placeholder)
2. `TravelHeroVideo` → APRÈS la galerie photos
3. `HostIntroVideo` → Dans la section "Votre accompagnateur" existante

## Vérification

1. `npx tsc --noEmit`
2. La galerie affiche les vraies images (ou fallback Unsplash)
3. Le lightbox s'ouvre, navigation gauche/droite + clavier + miniatures
4. La vidéo YouTube ne charge PAS avant le clic (RGPD 2-click)
5. Après clic, la vidéo se lance en autoplay sur YouTube nocookie

---

## ⚠️ CORRECTIFS AUDIT V2 (2026-03-18) — À INTÉGRER

### C1. Badge "Vidéo du terrain" si type CREATOR ou INDE
Dans `TravelHeroVideo.tsx`, ajouter une prop `videoType` et afficher un badge :

```tsx
interface TravelHeroVideoProps {
  videoUrl: string;
  title: string;
  posterUrl?: string;
  videoType?: 'CREATOR_TESTIMONY' | 'INDE_TESTIMONY' | 'PROMO' | 'DRONE';
  caption?: string; // max 120 chars
}

// Dans le rendu, avant le bouton play :
{(videoType === 'CREATOR_TESTIMONY' || videoType === 'INDE_TESTIMONY') && (
  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow">
    🎬 Vidéo du terrain
  </span>
)}

// Sous la vidéo :
{caption && (
  <p className="text-sm text-gray-500 mt-2 italic text-center">{caption}</p>
)}
```

### C2. Autoplay muette + pause au scroll-out
Utiliser `IntersectionObserver` pour contrôler l'autoplay :

```tsx
const videoRef = useRef<HTMLIFrameElement>(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  if (!videoRef.current) return;
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0.5 }
  );
  observer.observe(videoRef.current);
  return () => observer.disconnect();
}, []);

// Dans l'iframe, ajouter : mute=1
// src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0`}
```

### C3. Fallback galerie si pas de vidéo
Dans `voyage-detail-client.tsx`, le hero vidéo doit fallback sur la galerie :

```tsx
{travel.videoUrl ? (
  <TravelHeroVideo
    videoUrl={travel.videoUrl}
    title={travel.title}
    videoType={travel.tripVideoType}
    caption={travel.tripVideoCaption}
  />
) : (
  <PhotoGallery images={travel.galleryUrls} alt={travel.title} />
)}

{/* Si vidéo présente, galerie en dessous */}
{travel.videoUrl && travel.galleryUrls?.length >= 5 && (
  <PhotoGallery images={travel.galleryUrls} alt={travel.title} />
)}
```

---

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Items 14, 15, 16 → ✅ Implémenté (Sprint 5)
- Badge vidéo terrain → ✅
- Légende vidéo → ✅
- Autoplay muette + scroll-out → ✅
- Fallback galerie → ✅
