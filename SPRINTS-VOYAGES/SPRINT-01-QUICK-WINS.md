# SPRINT 1 — Quick Wins : Brancher les 3 composants fantômes

> **Durée estimée** : 30 min
> **Scope** : Page catalogue `/voyages` uniquement
> **Risque** : Faible — les composants existent déjà et sont testés

## Contexte

3 composants sont codés, importés, mais JAMAIS rendus dans le JSX :

1. **`FeaturedTravelsSection`** (310 lignes) — Section "Voyages en vedette" avec grille, animations reveal, badges, countdown
2. **`DestinationSearchBar`** (333 lignes) — Barre recherche autocomplete avec suggestions, navigation clavier, destinations populaires
3. **`TrustBadgesSection`** (178 lignes) — Bandeau confiance (Pack Sérénité, Stripe, Atout France, APST, RC Pro, 24/7)

## Fichiers à modifier

### 1. `frontend/app/(public)/voyages/voyages-client.tsx`

**ÉTAT ACTUEL** : `TrustBadgesSection` est importé ligne 16 mais JAMAIS rendu.

**ACTIONS** :

#### A. Ajouter l'import de `FeaturedTravelsSection` et `DestinationSearchBar`

```tsx
// Ligne ~13, ajouter après les imports existants :
import { FeaturedTravelsSection } from '@/components/FeaturedTravelsSection';
import { DestinationSearchBar } from '@/components/DestinationSearchBar';
```

#### B. Intégrer `DestinationSearchBar` dans le Hero

Dans la fonction `VoyagesPageClient()`, APRÈS le `<p>` de description dans le Hero (vers ligne 466), ajouter :

```tsx
{/* Barre de recherche destination — Draw.io ref: DestinationSearchBar hero variant */}
<div className="mt-8 max-w-2xl mx-auto">
  <DestinationSearchBar variant="hero" placeholder="Où voulez-vous partir ?" />
</div>
```

#### C. Intégrer `FeaturedTravelsSection` AVANT les filtres

Dans `VoyagesPageClient()`, APRÈS le `<Breadcrumb>` (vers ligne 477) et AVANT le `<Suspense>`, ajouter :

```tsx
{/* Voyages en vedette — Draw.io ref: FeaturedTravelsSection */}
<FeaturedTravelsSection
  title="À ne pas manquer"
  subtitle="Les prochains départs les plus populaires — Pack Sérénité inclus."
  maxItems={3}
  showCTA={false}
  className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8"
/>
```

> **Note** : `maxItems={3}` sur la page catalogue (pas 6 comme homepage) pour ne pas surcharger.
> `showCTA={false}` car on est déjà sur la page voyages.

#### D. Intégrer `TrustBadgesSection` en bas de page

APRÈS le `<NewsletterCTA>` (vers ligne 496), ajouter :

```tsx
{/* Bandeau confiance — Draw.io ref: TrustBadgesSection */}
<TrustBadgesSection variant="compact" className="mt-12" />
```

> **Note** : Variante `compact` pour le catalogue, la variante `full` sera sur la homepage.

## Vérification

Après modification, vérifier :

1. `cd frontend && npx tsc --noEmit` — Pas d'erreur TypeScript
2. Vérifier visuellement que les 3 sections sont rendues
3. Vérifier que `DestinationSearchBar` affiche les destinations populaires au focus
4. Vérifier que `TrustBadgesSection` affiche les 6 badges

## Résultat attendu

La page `/voyages` affiche maintenant :
1. Hero avec barre de recherche autocomplete
2. Breadcrumb
3. Section "À ne pas manquer" (3 voyages populaires)
4. Filtres + Chips + Grille de voyages
5. Newsletter CTA
6. Bandeau de confiance compact

## Post-sprint

Mettre à jour `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` :
- Items 1, 2, 3 → Statut : ✅ Implémenté (Sprint 1)
- Item 21 → Statut : ✅ Trust badges intégrés dans catalogue
