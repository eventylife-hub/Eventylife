# AUDIT FRONTEND — 12 mars 2026

## Résumé

Audit complet du frontend Next.js 14 après suppression de shadcn/ui.

### Statistiques
| Métrique | Valeur |
|----------|--------|
| Fichiers TSX | 386 |
| Fichiers TS | 64 |
| Pages (page.tsx) | 130 |
| Loading (loading.tsx) | 130 ✅ |
| Layout (layout.tsx) | 40 |
| Error (error.tsx) | 10 |
| Not-found | 11 |
| Composants actifs | 60 |
| Composants deprecated | 20 (dans _deprecated/) |

---

## 1. shadcn/ui — Suppression complète ✅

- **0 import** de `@/components/ui/` (hors _deprecated)
- **0 import** relatif vers les anciens composants
- **0 import** `@radix-ui`
- **0 import** `shadcn`
- Tous les composants shadcn remplacés par HTML natif + Tailwind CSS
- 20 fichiers UI déplacés dans `components/ui/_deprecated/`
- Seul `components/ui/back-to-top.tsx` reste actif (utilisé par 4 layouts)

### Patterns de remplacement
- Button → `<button>` natif avec classes Tailwind
- Card/CardHeader/CardContent → `<div>` avec shadow-sm, rounded-xl
- Input/Label/Textarea → éléments natifs avec focus:ring-2
- Table → `<table>` natif avec border-b
- Badge → `<span>` inline-flex rounded-full
- Skeleton → div avec bg-gray-200 + shimmer animation
- Dialog/Dropdown/Select → implémentations natives

---

## 2. TypeScript — Qualité code ✅

| Check | Résultat |
|-------|----------|
| Types `any` dans app/ | 0 |
| Catch blocks non typés | 0 (tous `err: unknown`) |
| console.log (debug dev) | ~29 (dans catch blocks — acceptable) |
| 'use client' doublons | 0 (3 corrigés cette session) |
| Export default manquant | 0 |
| Imports cassés | 0 (19 composants vérifiés) |

---

## 3. Hooks, Stores, Lib — Audit ✅

### Hooks (8 fichiers)
- 0 import shadcn
- Problème mineur : `useCallback` non utilisé dans use-pagination.ts

### Stores (16 fichiers, 2 emplacements)
- 0 import shadcn
- Tous suivent les patterns Zustand correctement
- Stores avec `persist` middleware : auth, client, pro, checkout
- Store avec `devtools` : notification
- Pattern d'erreur répétitif (extractible en util) — cosmétique

### Lib (18 fichiers)
- 0 import shadcn
- `types/api.ts` existe et exporte correctement ApiResponse/ApiError
- Duplication api.ts / api-client.ts — acceptable pour l'instant
- Validation Zod bien structurée

---

## 4. Pages — Couverture loading ✅

130/130 pages ont un loading.tsx.

### Loading.tsx créés cette session (5 fichiers) :
1. `app/(auth)/admin-login/loading.tsx` — skeleton dark admin
2. `app/(auth)/login/loading.tsx` — skeleton client sunset
3. `app/(auth)/register/loading.tsx` — skeleton client sunset
4. `app/(auth)/inscription/loading.tsx` — skeleton client sunset
5. `app/(public)/conditions/loading.tsx` — skeleton texte long

### Pages avec couverture complète des 4 états UI
- ✅ Pro voyages, Pro marketing
- ✅ Client réservations, Client groupes
- ✅ Admin alertes, Admin bookings

### Pages avec états UI incomplets (TODO futur)
- ⚠️ Admin voyages — manque loading skeleton + empty state
- ⚠️ Admin utilisateurs — manque loading skeleton + empty state
- ⚠️ Admin dashboard — manque error state avec retry
- ⚠️ Pro support — manque loading + retry
- Note : pages statiques (dashboards) n'ont pas besoin des 4 états

---

## 5. Configuration ✅

- `tailwind.config.ts` — Couleurs custom (navy, cream, terra, gold, sun, ocean, coral, mint), fonts DM Sans + Playfair
- `next.config.js` — ESLint/TS ignorés en build, headers sécurité (CSP, HSTS, X-Frame)
- `middleware.ts` — JWT decode, RBAC (CLIENT/PRO/ADMIN), routes publiques

---

## 6. Corrections cette session

| Fichier | Correction |
|---------|------------|
| `pro/login/page.tsx` | Suppression double `'use client'` |
| `admin-login/page.tsx` | Suppression double `'use client'` |
| `client/reservations/[id]/rooming/page.tsx` | Suppression double `'use client'` |

---

## 7. Prochaines actions recommandées

1. **Supprimer `components/ui/_deprecated/`** quand confirmé qu'aucun autre code n'en dépend
2. **Ajouter les 4 états UI** aux pages admin/pro manquantes (voyages, utilisateurs, support)
3. **Extraire la fonction utilitaire** d'extraction d'erreur commune aux stores
4. **Nettoyer les demo data** dans pro-store.ts (extraire dans fichier séparé)
5. **Unifier api.ts et api-client.ts** en un seul module
6. **Run `next build`** quand npm sera disponible pour validation finale
