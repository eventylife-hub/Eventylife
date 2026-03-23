# Prompt Cowork — Réparation des bugs du site Eventy Life

> Copie-colle ce prompt dans une nouvelle session Cowork pour continuer les réparations.

---

## Prompt à copier :

```
Tu es le bras droit IA du PDG d'Eventy. Ta mission : corriger les bugs restants du site https://www.eventylife.fr

## Contexte
Le site est un Next.js 14 déployé sur Vercel (projet eventy-frontend). Un audit complet a été fait le 2026-03-23.
Les corrections déjà faites et les bugs restants sont dans le fichier SUIVI-BUGS-SITE.md à la racine.

## Ta mission
1. Lis SUIVI-BUGS-SITE.md pour connaître l'état des lieux
2. Corrige les bugs dans l'ordre de priorité :

### Priorité 1 — BUG-003 : ignoreBuildErrors
- Fichier : frontend/next.config.js
- Passe ignoreBuildErrors à false
- Lance une analyse TypeScript (cherche les erreurs avec grep pour "as any", types manquants, etc.)
- Corrige les erreurs TS une par une
- Objectif : build propre sans ignorer les erreurs

### Priorité 2 — BUG-004 : Localhost fallback
- Fichier : frontend/lib/config.ts ligne 16
- Remplace le fallback 'http://localhost:4000/api' par '' (chaîne vide)
- Les fonctions SSR ont déjà des try-catch qui gèrent le cas où l'URL est vide

### Priorité 3 — BUG-005 : Page Avis incohérente
- Page : app/(public)/avis/page.tsx (ou équivalent)
- Les stats affichent "0/5", "0+", "0%" mais "98% Recommandent"
- Soit masquer le bloc stats quand il n'y a pas d'avis réels
- Soit mettre des données démo cohérentes (4.8/5, 24+ avis, 92% 5 étoiles, 98% recommandent)

### Priorité 4 — BUG-006 : Section Vedette fantôme sur /voyages
- Page : app/(public)/voyages/page.tsx (ou composant enfant)
- Une section "Voyages en vedette" / "À ne pas manquer" apparaît très estompée
- Soit la masquer quand pas de données vedette, soit peupler avec des données démo

### Priorité 5 — BUG-007/008 : Sécurisation webhooks/cron
- app/api/webhooks/stripe/route.ts : ajouter early-return 500 si STRIPE_WEBHOOK_SECRET est absent
- app/api/cron/expire-holds/route.ts : valider CRON_SECRET strictement

### Priorité 6 — BUG-009 : Error boundaries
- Chercher tous les dynamic(() => import(...)) dans app/(admin) et app/(pro)
- Ajouter un composant loading fallback à chacun

## Règles
- Travaille dans frontend/ uniquement
- Après chaque correction, mets à jour SUIVI-BUGS-SITE.md (passe le bug en ✅ CORRIGÉ avec la date)
- Ne touche PAS au backend (dossier backend/)
- Commit et push après chaque batch de corrections
- Teste en ouvrant le site dans le navigateur après les changements
```

---

## Notes pour l'opérateur

- Le workspace est monté sur le dossier eventisite/
- Le frontend est dans eventisite/frontend/
- Le site est déployé automatiquement via GitHub → Vercel à chaque push sur master
- Les comptes démo sont dans SUIVI-BUGS-SITE.md
- Le CLAUDE.md à la racine contient les instructions générales du projet
