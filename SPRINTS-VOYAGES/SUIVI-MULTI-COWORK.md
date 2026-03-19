# SUIVI MULTI-COWORK — Sprints Voyages 1-8
> **Objectif** : Plusieurs sessions Cowork travaillent en parallèle. Ce fichier est le **point de synchronisation unique**.
> **Règle** : Chaque Cowork met à jour CE FICHIER après chaque action terminée.
> **Date de création** : 2026-03-18

---

## 🔴 RÈGLES IMPORTANTES

1. **LIRE ce fichier AVANT de commencer** — Vérifie ce qui est déjà fait
2. **METTRE À JOUR ce fichier APRÈS chaque tâche** — Coche la case + note ton ID Cowork + date
3. **NE PAS travailler sur une tâche déjà "🔄 En cours"** — Choisis une tâche "⬜ À faire"
4. **Si conflit** : la session qui a coché en premier gagne. L'autre session passe à la tâche suivante
5. **Fichiers partagés** : si deux sprints modifient le même fichier, le 2ème sprint RELIT le fichier avant de modifier

---

## SPRINT 1 — Quick Wins (30 min)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 1.1 | Brancher FeaturedTravelsSection dans voyages-client.tsx | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 1.2 | Brancher DestinationSearchBar dans le Hero | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 1.3 | Brancher TrustBadgesSection en bas de page | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 1.4 | Vérification TypeScript `npx tsc --noEmit` | — | ✅ Fait | COWORK-3 | 2026-03-18 |

---

## SPRINT 2 — Chips Filtres (1h)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 2.1 | Ajouter états de filtre (region, theme, experience, month, proximity) | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.2 | Implémenter géolocalisation lazy + slider rayon | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.3 | Définir constantes REGIONS, THEMES, EXPERIENCES (10 tags), MONTHS | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.4 | Créer les 4 lignes de ChipGroup (transport, thème, mois, région) | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.5 | Ajouter slider BUDGET (range prix) | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.6 | Enrichir useEffect filtrage pour nouveaux filtres | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.7 | Filtres persistants dans URL (searchParams) | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.8 | Bouton "Réinitialiser les filtres" | `voyages-client.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.9 | Vérifier composant Chip accepte prop `color` | `chip.tsx` | ✅ Fait | COWORK-3 | 2026-03-18 |
| 2.10 | Vérification TypeScript | — | ✅ Fait | COWORK-3 | 2026-03-18 |

---

## SPRINT 3 — Sections Catalogue & Badges (1h30)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 3.1 | Créer composant ThematicSection.tsx | `catalogue/ThematicSection.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.2 | Ajouter badges overlay dans TravelCard (isConfirmed, isFavorite) | `TravelCard.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.3 | Ajouter tags expérience dans TravelCard (max 2 + "+N") | `TravelCard.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.4 | Ajouter toggle Wishlist/Favoris (cœur) sur TravelCard | `TravelCard.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.5 | Intégrer 6 sections thématiques conformes specs dans voyages-client | `voyages-client.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.6 | Ajouter pagination "Voir plus" (displayCount + bouton) | `voyages-client.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.7 | État favorites (Set) dans voyages-client.tsx | `voyages-client.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 3.8 | Vérification TypeScript | — | ✅ Fait | COWORK-7 | 2026-03-19 |

---

## SPRINT 4 — Backend Tags & Filtres (1h)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 4.1 | Ajouter champs Sprint 4 au model Travel (theme, experienceTags, region, isFeatured, etc.) | `schema.prisma` | ⬜ À faire | — | — |
| 4.2 | Ajouter champs Audit V2 (tripVideoType, uniquePlace, testimonials, minPaxToGo, bar/resto) | `schema.prisma` | ⬜ À faire | — | — |
| 4.3 | Ajouter enum TripVideoType | `schema.prisma` | ⬜ À faire | — | — |
| 4.4 | Ajouter indexes (theme, region, isFeatured) | `schema.prisma` | ⬜ À faire | — | — |
| 4.5 | Enrichir endpoint GET /travels avec query params filtres | `travels.controller.ts` | ⬜ À faire | — | — |
| 4.6 | Implémenter logique filtrage + tri Haversine dans service | `travels.service.ts` | ⬜ À faire | — | — |
| 4.7 | Créer endpoint GET /travels/search-suggestions | `travels.controller.ts` | ⬜ À faire | — | — |
| 4.8 | Migration Prisma | — | ⬜ À faire | — | — |
| 4.9 | `npx prisma validate` + `npm run build` + `npm run test` | — | ⬜ À faire | — | — |

---

## SPRINT 5 — Détail Médias (1h30)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 5.1 | Créer TravelHeroVideo.tsx (YouTube nocookie + RGPD 2-click + badge terrain + caption) | `travel-detail/TravelHeroVideo.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 5.2 | Créer HostIntroVideo.tsx (vidéo accompagnateur) | `travel-detail/HostIntroVideo.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 5.3 | Créer PhotoGallery.tsx (grid + lightbox + navigation clavier) | `travel-detail/PhotoGallery.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 5.4 | Implémenter autoplay muette + IntersectionObserver pause | `TravelHeroVideo.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 5.5 | Intégrer les 3 composants dans voyage-detail-client.tsx + fallback vidéo→galerie | `voyage-detail-client.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 5.6 | Vérification TypeScript | — | ✅ Fait | COWORK-7 | 2026-03-19 |

---

## SPRINT 6 — Détail Social & Engagement (1h30)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 6.1 | Créer PreannounceForm.tsx (email/tel/ville + RGPD + anti-doublon) | `travel-detail/PreannounceForm.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.2 | Créer WaitlistBanner.tsx (bandeau + form email/tel) | `travel-detail/WaitlistBanner.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.3 | Créer TravelFAQ.tsx (accordéon + FAQ défaut + Schema.org) | `travel-detail/TravelFAQ.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.4 | Créer TravelTestimonials.tsx (témoignages MANUELS, pas UGC) | `travel-detail/TravelTestimonials.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.5 | Créer SimilarTravels.tsx (carrousel + fetch similar) | `travel-detail/SimilarTravels.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.6 | Créer TravelShareQR.tsx (QR + boutons partage + UTM tracking) | `travel-detail/TravelShareQR.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 6.7 | Créer InterestCounter.tsx (vues + leads + animation) | `travel-detail/InterestCounter.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.8 | Créer CallbackForm.tsx (CTA "Être rappelé") | `travel-detail/CallbackForm.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.9 | Créer ProgramRequestButton.tsx (CTA "Recevoir le programme") | `travel-detail/ProgramRequestButton.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.10 | Créer FollowCreatorButton.tsx (bouton Suivre l'indépendant) | `travel-detail/FollowCreatorButton.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 6.11 | Backend : POST /travels/:id/preannounce (+ anti-doublon) | `travels.controller.ts` | ⬜ À faire | — | — |
| 6.12 | Backend : POST /travels/:id/waitlist | `travels.controller.ts` | ⬜ À faire | — | — |
| 6.13 | Backend : GET /travels/:id/similar | `travels.controller.ts` | ⬜ À faire | — | — |
| 6.14 | Backend : POST /travels/:id/callback-request | `travels.controller.ts` | ⬜ À faire | — | — |
| 6.15 | Intégrer tous les composants dans voyage-detail-client.tsx | `voyage-detail-client.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 6.16 | Vérification TypeScript front + back | — | ✅ Fait | COWORK-7 | 2026-03-19 |

---

## SPRINT 7 — Détail UX Enrichie (1h30)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 7.1 | Installer react-leaflet + leaflet + @types/leaflet | `package.json` | ⬜ À faire | — | — |
| 7.2 | Créer PickupMap.tsx (Leaflet + marqueurs + accessibilité + "À faire autour") | `travel-detail/PickupMap.tsx` | ⬜ À faire | — | — |
| 7.3 | Créer ActivityDetails.tsx (accordéon 6 champs complets) | `travel-detail/ActivityDetails.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.4 | Créer RoomTypeSelector.tsx (radio visuel + prix dynamique) | `travel-detail/RoomTypeSelector.tsx` | ⬜ À faire (inline dans AsideCard) | — | — |
| 7.5 | Créer InsuranceToggle.tsx (switch + prix + IPID) | `travel-detail/InsuranceToggle.tsx` | ⬜ À faire (inline dans AsideCard) | — | — |
| 7.6 | Créer CancellationTimeline.tsx (5 jalons colorés) | `travel-detail/CancellationTimeline.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.7 | Créer CreatorMessage.tsx (message + badge + CTAs) | `travel-detail/CreatorMessage.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.8 | Créer UniqueBlock.tsx (pourquoi ce voyage est unique) | `travel-detail/UniqueBlock.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.9 | Créer StickyMobileCTA.tsx (barre fixe mobile) | `travel-detail/StickyMobileCTA.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.10 | Créer AccommodationAmenities.tsx (pictos amenities) | `travel-detail/AccommodationAmenities.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 7.11 | Créer RestaurantBarDetail.tsx (bar/resto infos) | `travel-detail/RestaurantBarDetail.tsx` | ⬜ À faire | — | — |
| 7.12 | Backend : enrichir GET /travels/:slug avec tous les nouveaux champs | `travels.controller.ts` | ⬜ À faire | — | — |
| 7.13 | Intégrer tous les composants dans voyage-detail-client.tsx | `voyage-detail-client.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 7.14 | Gating PREANNOUNCE vs BOOKABLE + toggle programEnabled | `voyage-detail-client.tsx` | ⬜ À faire | — | — |
| 7.15 | Vérification TypeScript | — | ✅ Fait | COWORK-8 | 2026-03-19 |

---

## SPRINT 8 — SEO Final (1h)

| # | Tâche | Fichier modifié | Statut | Cowork | Date |
|---|-------|----------------|--------|--------|------|
| 8.1 | Enrichir generateMetadata() page détail (OG, Twitter, canonical) | `[slug]/page.tsx` | ⬜ À faire | — | — |
| 8.2 | JSON-LD TouristTrip + Event + FAQPage sur page détail | `seo/VoyageDetailJsonLd.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 8.3 | JSON-LD ItemList dynamique sur page catalogue | `seo/VoyagesJsonLd.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 8.4 | Créer MapViewToggle.tsx (toggle liste/carte + Leaflet clustering) | `catalogue/MapViewToggle.tsx` | ✅ Fait | COWORK-7 | 2026-03-19 |
| 8.5 | Intégrer toggle carte dans voyages-client.tsx | `voyages-client.tsx` | ✅ Fait (import ready) | COWORK-8 | 2026-03-19 |
| 8.6 | Enrichir pages /depart/[ville] (meta + JSON-LD) | `depart/[ville]/page.tsx` | ⬜ À faire | — | — |
| 8.7 | UTM tracking auto sur tous les liens partagés | `TravelShareQR.tsx` | ✅ Fait | COWORK-8 | 2026-03-19 |
| 8.8 | Créer/enrichir sitemap.ts dynamique | `app/sitemap.ts` | ⬜ À faire | — | — |
| 8.9 | Checklist finale 22 items (cf. sprint file) | — | ⬜ À faire | — | — |
| 8.10 | Vérification TypeScript front + `prisma validate` + `npm run build` | — | ⬜ À faire | — | — |

---

## 📊 RÉSUMÉ PROGRESSION

| Sprint | Total tâches | Faites | En cours | Restantes | % |
|--------|-------------|--------|----------|-----------|---|
| 1 | 4 | 4 | 0 | 0 | 100% |
| 2 | 10 | 10 | 0 | 0 | 100% |
| 3 | 8 | 8 | 0 | 0 | 100% |
| 4 | 9 | 0 | 0 | 9 | 0% |
| 5 | 6 | 6 | 0 | 0 | 100% |
| 6 | 16 | 12 | 0 | 4 | 75% |
| 7 | 15 | 9 | 0 | 6 | 60% |
| 8 | 10 | 5 | 0 | 5 | 50% |
| **TOTAL** | **78** | **54** | **0** | **24** | **69%** |

---

## 🔒 FICHIERS PARTAGÉS (ATTENTION CONFLITS)

Ces fichiers sont modifiés par PLUSIEURS sprints. Si tu travailles sur un sprint qui touche un de ces fichiers, **RELIS-LE** d'abord pour ne pas écraser le travail d'un autre Cowork :

| Fichier | Modifié par |
|---------|-------------|
| `voyages-client.tsx` | Sprint 1, 2, 3, 8 |
| `TravelCard.tsx` | Sprint 3 |
| `voyage-detail-client.tsx` | Sprint 5, 6, 7 |
| `schema.prisma` | Sprint 4 uniquement |
| `travels.controller.ts` | Sprint 4, 6, 7 |
| `travels.service.ts` | Sprint 4 |
| `TravelShareQR.tsx` | Sprint 6, 8 |

---

## 📋 COMMENT UTILISER CE FICHIER

### Pour un nouveau Cowork :
```
1. "Lis SPRINTS-VOYAGES/SUIVI-MULTI-COWORK.md"
2. Regarde quels sprints ont des tâches "⬜ À faire"
3. Choisis un sprint (de préférence dans l'ordre)
4. Marque les tâches "🔄 En cours" AVANT de commencer
5. Lis le fichier SPRINT-XX correspondant
6. Exécute les tâches
7. Marque "✅ Fait" + ton ID + la date
8. Mets à jour le tableau résumé progression
```

### Statuts possibles :
- ⬜ À faire
- 🔄 En cours (note l'ID Cowork)
- ✅ Fait (note l'ID Cowork + date)
- ⚠️ Bloqué (note la raison)
- ❌ Annulé (note la raison)
