# AUDIT OUBLIS — Specs draw.io vs Sprints 1-8
> **Date** : 2026-03-18
> **Méthode** : 4 agents parallèles ont croisé les 1510 pages de specs, le code existant (frontend + backend + Prisma), et les 8 fichiers sprints.
> **Résultat** : 13 oublis majeurs + 22 corrections mineures

---

## 🔴 OUBLIS MAJEURS (absents de TOUS les 8 sprints)

| # | Fonctionnalité | Spec source | Impact | Ajouté dans |
|---|----------------|-------------|--------|-------------|
| 1 | **Wishlist/Favoris** — toggle cœur sur cartes + page `/compte/favoris` + animation + compteur | V289 Client | UX client | Sprint 3 |
| 2 | **CTA sticky mobile** — barre fixe bas écran (prix + Réserver/Waitlist) | V89 P1360 | Conversion mobile | Sprint 7 |
| 3 | **CTA "Être rappelé"** — formulaire lead (email/tel/ville + RGPD) routé vers Pro + Indé | V89 P1360 | Lead gen | Sprint 6 |
| 4 | **CTA "Recevoir le programme"** — bouton envoi programme par email | V89 | Lead gen | Sprint 6 |
| 5 | **Suivre l'indépendant** — bouton Follow + notifications nouveau voyage | V312 | Engagement | Sprint 6 |
| 6 | **Bloc "Pourquoi ce voyage est unique"** — uniquePlaceDescription + uniqueWhyNotElsewhere | V89 P1358 | Contenu | Sprint 7 |
| 7 | **Amenities HRA pictos** — galerie hébergement avec icônes amenities | V89 P1359 | Contenu | Sprint 7 |
| 8 | **Restaurant/Bar détail** — barPublicMessage, barPhoto, barGoogleMapsUrl | V89 P1360 | Contenu | Sprint 7 |
| 9 | **Pages SEO `/depart/[ville]`** — pages auto-générées par ville | SEO specs | SEO | Sprint 8 |
| 10 | **UTM tracking auto** — sur tous liens partagés | Marketing V3 | Analytics | Sprint 8 |
| 11 | **Accessibilité ramassage enrichie** — tags PMR, parking, abri + "À faire autour" | V75 P1361 | Contenu | Sprint 7 |
| 12 | **Sitemap dynamique** — voyages publiés | SEO specs | SEO | Sprint 8 |
| 13 | **Pourboire "Merci Voyage"** — post-voyage, 30j après retour | V501 | UX post | Hors scope (futur) |

---

## 🟡 CORRECTIONS PAR SPRINT

### Sprint 2 — Filtres
| Correction | Détail |
|-----------|--------|
| Tags expérience incomplets | Sprint a 6 tags, specs en prévoient **10** : ajouter SENIOR_FRIENDLY, JEUNES_ADULTES, ACCESSIBLE_PMR, WEEKEND, IMMERSION |
| Slider RAYON géoloc | Specs : slider rayon 0-500km (défaut 100km), pas juste un chip on/off |
| Filtre BUDGET range | Specs : slider prix min/max — pas dans les chips |
| Filtre DURÉE jours | Specs : filtre par nombre de jours — pas dans les chips |
| Filtres persistants URL | Specs : `/voyages?exp=INSOLITE&exp=LOCAL` — filtres dans query params |
| Bouton Reset filtres | Specs : bouton pour effacer tous les filtres |
| Chip Région manquant | Les données REGIONS sont définies mais aucun chip Région dans le JSX |

### Sprint 3 — Catalogue
| Correction | Détail |
|-----------|--------|
| Sections non conformes specs | "Mer & Soleil" et "Montagne & Nature" ne sont PAS dans les specs. Remplacer par "Autour de chez vous" (GPS) et "Courts séjours & weekends" (tag WEEKEND) |
| Tags cartes : max 2 + "+N" | Specs disent max 2 visibles + « +N », sprint dit max 3 |
| Wishlist toggle | Ajouter toggle cœur sur chaque TravelCard |

### Sprint 4 — Backend
| Correction | Détail |
|-----------|--------|
| Champs Prisma manquants | `tripVideoType` (enum), `tripVideoCaption` (String 120), `uniquePlaceDescription`, `uniqueWhyNotElsewhere`, `enableTestimonials` (Boolean), `testimonials` (Json), `minPaxToGo` (Int), `decisionDeadlineAt` (DateTime) |
| Enum TripVideoType | CREATOR_TESTIMONY, INDE_TESTIMONY, PROMO, DRONE |

### Sprint 5 — Médias
| Correction | Détail |
|-----------|--------|
| Badge "Vidéo du terrain" | Si videoType = CREATOR_TESTIMONY ou INDE_TESTIMONY → badge visible |
| Légende vidéo | Afficher `tripVideoCaption` (max 120 chars) sous la vidéo |
| Autoplay muette | Specs : autoplay muette + pause au scroll-out (IntersectionObserver) |
| Fallback galerie | Si pas de videoUrl → afficher galerie 5+ images en hero |

### Sprint 6 — Social
| Correction | Détail |
|-----------|--------|
| Avis ≠ Reviews UGC | MVP = témoignages manuels admin (enableTestimonials + testimonials[]), PAS de reviews UGC. Renommer TravelReviews → TravelTestimonials |
| Anti-doublon préannonce | 1 lead par travelId + email (vérification backend) |
| Bouton partage post-inscription | Après préannonce → "Partager le voyage" |

### Sprint 7 — UX
| Correction | Détail |
|-----------|--------|
| Activités 6 champs complets | Specs : photo, description, durée, point RDV, quoi apporter[], niveau difficulté — le sprint mentionne l'accordéon mais pas les 6 champs |

### Sprint 8 — SEO
| Correction | Détail |
|-----------|--------|
| JSON-LD TravelAction | Specs disent TravelAction + Event, sprint utilise TouristTrip — ajouter les deux |

---

## ✅ VÉRIFICATION : Ce qui est BIEN couvert

- [x] Composants fantômes (FeaturedTravels, SearchBar, TrustBadges) → Sprint 1
- [x] Chips transport Bus/Avion → Sprint 2
- [x] Géolocalisation GPS lazy → Sprint 2
- [x] Sections thématiques carrousel → Sprint 3
- [x] Badges "Départ confirmé" + "Coup de cœur" → Sprint 3
- [x] Pagination "Voir plus" → Sprint 3
- [x] Champs Prisma (theme, experienceTags, region, isFeatured, isConfirmed, departureLat/Lng) → Sprint 4
- [x] Endpoint filtres avancés + search-suggestions → Sprint 4
- [x] Vidéo YouTube RGPD 2-click → Sprint 5
- [x] Galerie photos + lightbox → Sprint 5
- [x] Vidéo accompagnateur → Sprint 5
- [x] Préannonce form + Waitlist → Sprint 6
- [x] FAQ accordéon + Schema.org → Sprint 6
- [x] QR code + partage réseaux → Sprint 6
- [x] Compteur intéressés → Sprint 6
- [x] Voyages similaires → Sprint 6
- [x] Carte Leaflet ramassage → Sprint 7
- [x] Sélecteur chambre → Sprint 7
- [x] Toggle assurance + IPID → Sprint 7
- [x] Timeline annulation → Sprint 7
- [x] Message créateur → Sprint 7
- [x] Gating PREANNOUNCE vs BOOKABLE → Sprint 7
- [x] JSON-LD dynamique → Sprint 8
- [x] Meta OG complètes → Sprint 8
- [x] Vue carte catalogue → Sprint 8
