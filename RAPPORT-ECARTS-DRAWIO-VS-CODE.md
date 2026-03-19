# Rapport d'écarts : Draw.io vs Code — Pages Voyages
**Date :** 2026-03-18
**Analysé par :** 6 agents en parallèle (parsing draw.io 11MB + lecture code + comparaison)

---

## Résumé exécutif

| Métrique | Valeur |
|----------|--------|
| Complétude page catalogue | ~55% |
| Complétude page détail | ~65% |
| Éléments critiques manquants | 26 |
| Éléments partiels | 16 |
| Composants existants mais non intégrés | 3 (FeaturedTravelsSection, DestinationSearchBar, TrustBadgesSection) |

---

## 🔴 MANQUANTS CRITIQUES — Page Catalogue /voyages

1. **FeaturedTravelsSection** — composant EXISTE (`/components/FeaturedTravelsSection.tsx`) mais N'EST PAS APPELÉ dans `voyages-client.tsx`
2. **DestinationSearchBar** avec autocomplete — composant EXISTE (`/components/DestinationSearchBar.tsx`) mais N'EST PAS APPELÉ
3. **TrustBadgesSection** — IMPORTÉ ligne 16 de `voyages-client.tsx` mais JAMAIS RENDU dans le JSX (import mort)
4. **Chips filtres draw.io** manquants : "Autour de vous" (GPS), Région, Date, Thème, Expérience (5/7 absents)
5. **Système de tags d'expérience** complet (INSOLITE 🔑, LOCAL 📍, EXCLUSIF ⭐, NATURE 🌿, FAMILLE 👨‍👩‍👧, SENIOR ☕, JEUNES ⚡, PMR ♿, WEEKEND 📅, IMMERSION ❤️) — filtrage + badges + max 2 visibles + "+N"
6. **6 sections catalogue thématiques** : "Autour de vous", "Lieux insolites", "Introuvable ailleurs", "Tous les âges", "Week-ends & courts séjours", "Immersion locale"
7. **Badge "Départ confirmé"** sur les TravelCards du catalogue
8. **Badge "Coup de cœur Eventy"** (gold) sur les TravelCards
9. **Bouton Waitlist / "Être notifié"** quand voyage complet (TravelCard affiche "Complet" mais pas de CTA)
10. **Pagination / Lazy loading** — tous les résultats affichés d'un coup
11. **Vue carte** (map view toggle) des destinations
12. **SEO : JSON-LD ItemList + Schema.org** dans page listing (présent dans page.tsx serveur mais pas dans le listing client)
13. **Tri par proximité** comme défaut (draw.io = Proximity, code = Populaires)
14. **Filtre date** (date range picker)
15. **Filtre région/département**
16. **Filtre thème**

## 🔴 MANQUANTS CRITIQUES — Page Détail /voyages/[slug]

17. **Vidéo voyage** (TravelHeroVideo) — YouTube nocookie + RGPD 2-click consent, auto-mute, pause on scroll-out
18. **Vidéo indépendant** (HostIntroVideo) — intro personnelle du responsable terrain
19. **Galerie photos réelle** + lightbox (actuellement que des emojis placeholder)
20. **Formulaire "Être notifié"** (phase PREANNOUNCE) — email (requis), téléphone (optionnel), ville préférée (optionnel), consentement RGPD
21. **Système waitlist 24h** quand voyage complet
22. **Section FAQ**
23. **Section avis/témoignages clients**
24. **Trust badges** dans la page détail (Pack Sérénité, Paiement sécurisé Stripe, Atout France, APST, RC Pro, Accompagnement 24/7)
25. **Carrousel voyages similaires** / recommandations
26. **JSON-LD** (TravelAction + Event schema)
27. **Meta OG** (titre, description, image hero, prix)
28. **QR code partageable** téléchargeable
29. **Compteur "X intéressés"** (pageViews + leads)

---

## 🟠 PARTIELLEMENT IMPLÉMENTÉS

30. **Carte interactive ramassage** → Placeholder emoji 🗺️ au lieu d'une vraie carte (Google Maps embed ou Leaflet)
31. **Photos arrêts de ramassage** → draw.io prévoit 3-5 photos par arrêt, code = aucune photo
32. **creatorWhyMessage** ("Pourquoi j'ai créé ce voyage") → champ prévu, non rendu dans VoyageTeam
33. **Badge confiance accompagnateur** ("X voyages accompagnés") → non affiché
34. **Détails activités enrichis** → manque : activityDescription, activityDuration, activityMeetingPoint, activityBringList, activityPhoto
35. **Photo ambiance bar** + barCreatorNote + barGoogleMapsUrl → champs enrichissement bar absents
36. **Icônes allergènes restaurant** + photo restaurateur → absents
37. **Sélecteur type de chambre** → codé en dur "chambre double", pas de choix single/triple
38. **Toggle assurance interactif** → affiché en statique (+89€), pas de checkbox on/off
39. **Politique annulation visuelle** (grille J-60/J-30/J-15/J-7) → que du texte prose
40. **Boutons partage individuels** (WhatsApp, Facebook) → seulement bouton "Partager" natif/clipboard
41. **Gating PREANNOUNCE vs BOOKABLE** → pas de logique conditionnelle de rendu selon le statut du voyage
42. **Toggle programmeEnabled** → pas de rendu conditionnel admin
43. **Lien IPID assurance** → absent
44. **CTA "Être rappelé"** dans section équipe → seulement Message/Appeler, pas de "Be reminded"
45. **Compteur départ confirmé détaillé** ("X payés sur Y minimum") avec barre de progression → juste badge texte

---

## ✅ BIEN IMPLÉMENTÉ

- Hero section (titre, destination, dates, prix dynamique, compteur voyageurs)
- Breadcrumb navigation
- Section ramassage (point le plus proche, sélection, adresse, horaires, "à faire autour")
- Programme jour par jour avec timeline visuelle (4 créneaux : Matin/Midi/Après-midi/Soir)
- Navettes sur place (après-midi + soir avec numérotation)
- Hébergement & HRA (hôtel, étoiles, équipements, restaurants, bars, activités basiques)
- Section équipe (créateur + indépendant, avatars, bio, Message/Appeler, liens Facebook/WhatsApp/Copier)
- Conditions & Inclus/Non-inclus (double colonne avec icônes ✓/✗)
- Mention légale obligatoire (L211-8 Code Tourisme, absence droit de rétractation)
- Badge "Départ confirmé" dans le hero
- Sticky CTA bottom (apparaît au scroll > 500px)
- Navigation par onglets (5 sections)
- Sidebar prix sticky avec calcul TTC, "Recevoir le programme", "Être rappelé"
- Occurrences/dates multiples avec barres de progression et badges statut
- Newsletter CTA (variant terra)
- TrustBadgesSection APRÈS la page détail (via page.tsx serveur)
- FeaturedTravelsSection "Vous pourriez aussi aimer" APRÈS la page détail (via page.tsx serveur)
- Skeleton loading + états vide/erreur
- Responsive grid (1-2-3 colonnes)
- SEO basique (metadata dans page.tsx serveur du catalogue)

---

## 🏗️ COMPOSANTS FANTÔMES (existent mais non utilisés)

| Composant | Fichier | Utilisé dans catalogue ? | Utilisé dans détail ? |
|-----------|---------|--------------------------|----------------------|
| FeaturedTravelsSection | `/components/FeaturedTravelsSection.tsx` | ❌ NON | ✅ OUI (via page.tsx) |
| DestinationSearchBar | `/components/DestinationSearchBar.tsx` | ❌ NON | N/A |
| TrustBadgesSection | `/components/TrustBadgesSection.tsx` | ❌ IMPORT MORT | ✅ OUI (via page.tsx) |
| OpenSpotsBanner | `/components/OpenSpotsBanner.tsx` | Non vérifié | Non vérifié |
| BusProgressWidget | `/components/BusProgressWidget.tsx` | Non vérifié | Non vérifié |
| PackSereniteBadge | `/components/PackSereniteBadge.tsx` | ❌ | ❌ |

---

## 📋 PRIORISATION RECOMMANDÉE

### Sprint 1 — Quick wins (composants existants à brancher)
1. Intégrer FeaturedTravelsSection dans voyages-client.tsx (section "Coups de cœur" en haut)
2. Intégrer DestinationSearchBar dans voyages-client.tsx (remplacer l'input texte basique)
3. Rendre TrustBadgesSection dans voyages-client.tsx (supprimer l'import mort, ajouter le rendu)
4. Ajouter badge "Départ confirmé" dans TravelCard
5. Ajouter badge "Coup de cœur" dans TravelCard

### Sprint 2 — Enrichissements détail
6. Rendre creatorWhyMessage dans VoyageTeam
7. Ajouter politique annulation visuelle (grille J-60/J-30/J-15/J-7)
8. Boutons partage individuels (WhatsApp, Facebook, Copy)
9. Toggle assurance interactif dans sidebar
10. Sélecteur type de chambre

### Sprint 3 — Fonctionnalités majeures
11. Système de tags d'expérience complet (10 tags + filtres + badges)
12. Formulaire "Être notifié" (PREANNOUNCE)
13. Waitlist 24h
14. Section FAQ
15. Section avis/témoignages

### Sprint 4 — Médias & SEO
16. Galerie photos réelle + lightbox
17. Vidéo voyage + vidéo indépendant
18. JSON-LD complet (TravelAction + Event)
19. Meta OG dynamiques
20. Carte interactive (Google Maps ou Leaflet)

### Sprint 5 — Catalogue avancé
21. 6 sections thématiques catalogue
22. Filtres avancés (date, région, thème, expérience)
23. Pagination / lazy loading
24. Tri par proximité (GPS)
25. Vue carte
