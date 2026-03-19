# COWORK 7 — Combler les écarts Draw.io ↔ Code (Frontend)

> **STATUT : ✅ TERMINÉ** — 77/78 tâches complétées (19 mars 2026)
> Seule la tâche 4.8 (Migration Prisma) reste en attente du déploiement DB production.

> **Scope** : Pages catalogue, détail voyage, checkout avancé, gating PREANNOUNCE
> **Durée estimée** : ~12-15 jours Cowork
> **Dépendances** : Aucune — le code actuel est stable (0 erreur TS)
> **Source** : MEGA-AUDIT-19-MARS-2026.md + RAPPORT-ECARTS-DRAWIO-VS-CODE.md

---

## CONTEXTE

Le draw.io v53 contient 1 798 pages de specs. L'audit du 19/03 montre que les pages existent toutes (165 pages) mais certaines sont incomplètes par rapport aux specs. Cette session comble les écarts les plus critiques.

**AVANT TOUTE CHOSE**, lis ces fichiers :
1. `AME-EVENTY.md` — L'âme du produit
2. `MEGA-AUDIT-19-MARS-2026.md` — Section 3 (GAPS DRAWIO ↔ CODE)
3. `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` — Détail des 45 écarts identifiés
4. `SPRINTS-VOYAGES/README.md` — **Plan détaillé de 78 tâches en 8 sprints** (déjà écrit, plus granulaire que ce fichier)
5. `SPRINTS-VOYAGES/SUIVI-MULTI-COWORK.md` — Tracker de progression multi-cowork

> **NOTE IMPORTANTE** : Le dossier `SPRINTS-VOYAGES/` contient déjà un plan extrêmement détaillé
> avec 78 tâches réparties en 8 sprints (~9h). **Utilise ces sprints comme base d'exécution.**
> Ce fichier COWORK-7 est la vue d'ensemble ; les SPRINT-01 à SPRINT-08 sont les instructions détaillées.

---

## LOT 7.1 — Page Catalogue /voyages (~3-4 jours)

### Objectif : Passer de 55% à 95% de conformité draw.io

### Tâches

**7.1.1 — Intégrer les composants existants non utilisés**
- `FeaturedTravelsSection` : composant EXISTE mais jamais appelé dans `voyages-client.tsx` → l'intégrer
- `DestinationSearchBar` avec autocomplete : EXISTE mais pas appelé → l'intégrer
- `TrustBadgesSection` : IMPORTÉ mais jamais rendu → l'afficher

**7.1.2 — Système de filtres complet**
- Ajouter les filtres draw.io manquants : Région, Date (date range picker), Thème, Expérience
- Filtre "Autour de vous" (GPS — si permission accordée) avec tri par proximité par défaut
- Chips filtres visuels (tags cliquables)

**7.1.3 — Système de tags d'expérience**
- 10 tags : INSOLITE 🔑, LOCAL 📍, EXCLUSIF ⭐, NATURE 🌿, FAMILLE 👨‍👩‍👧, SENIOR ☕, JEUNES ⚡, PMR ♿, WEEKEND 📅, IMMERSION ❤️
- Filtrage par tag + badges sur TravelCard (max 2 visibles + "+N")

**7.1.4 — Sections catalogue thématiques**
- 6 sections : "Autour de vous", "Lieux insolites", "Introuvable ailleurs", "Tous les âges", "Week-ends & courts séjours", "Immersion locale"

**7.1.5 — Améliorations TravelCard**
- Badge "Départ confirmé" (quand minPax atteint)
- Badge "Coup de cœur Eventy" (gold, admin-défini)
- Bouton Waitlist / "Être notifié" quand voyage complet
- Pagination cursor-based / Lazy loading (scroll infini)

**7.1.6 — Vue carte** (toggle carte/liste)
- Leaflet ou Google Maps embed avec markers par destination
- SEO : JSON-LD ItemList + Schema.org dans le listing

---

## LOT 7.2 — Page Détail /voyages/[slug] (~3-4 jours)

### Objectif : Passer de 65% à 95% de conformité draw.io

### Tâches

**7.2.1 — Vidéos**
- TravelHeroVideo : YouTube nocookie + RGPD 2-click consent, auto-mute, pause on scroll-out
- HostIntroVideo : vidéo intro personnelle du responsable terrain

**7.2.2 — Galerie photos**
- Remplacer les emojis placeholder par une vraie galerie
- Lightbox (zoom, navigation, swipe mobile)
- Lazy loading des images

**7.2.3 — Formulaire "Être notifié"**
- Phase PREANNOUNCE : email (requis), téléphone (opt), ville préférée (opt), consentement RGPD
- Système waitlist 24h quand voyage complet

**7.2.4 — Sections manquantes**
- Section FAQ par voyage (FAQ spécifique)
- Section avis/témoignages clients
- Trust badges (Pack Sérénité, Stripe, Atout France, APST, RC Pro, 24/7)
- Carrousel voyages similaires / recommandations

**7.2.5 — SEO & Partage**
- JSON-LD (TravelAction + Event schema)
- Meta OG (titre, description, image hero, prix)
- QR code partageable téléchargeable
- Compteur "X intéressés" (pageViews + leads)
- Boutons partage : WhatsApp, Facebook (en plus du partage natif)

---

## LOT 7.3 — Checkout avancé (~2-3 jours)

### Tâches

**7.3.1 — Sélecteur type de chambre dynamique**
- Choix single/double/triple (actuellement codé en dur "chambre double")
- Prix dynamique selon le type de chambre sélectionné

**7.3.2 — Toggle assurance interactif**
- Checkbox on/off avec calcul prix en temps réel (actuellement statique +89€)
- Lien IPID assurance

**7.3.3 — Politique annulation visuelle**
- Grille J-60/J-30/J-15/J-7 avec pourcentages (actuellement que du texte prose)
- Barre visuelle de progression

**7.3.4 — Gating PREANNOUNCE vs BOOKABLE**
- Rendu conditionnel complet selon le statut du voyage
- PREANNOUNCE → formulaire "Être notifié" au lieu de "Réserver"
- BOOKABLE → tunnel checkout standard

---

## LOT 7.4 — Carte interactive bus stops (~1-2 jours)

### Tâches

**7.4.1 — Remplacer les emojis par une vraie carte**
- Leaflet (open source, gratuit) OU Google Maps embed
- Markers pour chaque arrêt de ramassage
- Popup avec nom, adresse, horaire

**7.4.2 — Photos arrêts**
- Draw.io prévoit 3-5 photos par arrêt → les afficher si disponibles

---

## VALIDATION

Après chaque LOT :
```bash
cd frontend && npx tsc --noEmit --skipLibCheck  # 0 erreur
```

---

## FORMAT DE TRAVAIL

Pour chaque page traitée, le Cowork doit :
1. Lire le fichier page.tsx existant
2. Identifier ce qui manque vs draw.io
3. Implémenter les améliorations
4. Tester TypeScript (0 erreur)
5. Passer à la page suivante

---

*Créé le 19 mars 2026 — Source : MEGA-AUDIT*
