# SPRINTS VOYAGES — Plan de Rattrapage draw.io vs Code
> **Objectif** : Aligner le site Eventy sur le diagramme draw.io v53.
> **Méthode** : 8 sprints, exécutables en parallèle par plusieurs Cowork.
> **Règle** : Chaque session lit son SPRINT-XX.md + met à jour `SUIVI-MULTI-COWORK.md`.
> **Audit V2** : 13 oublis majeurs corrigés le 2026-03-18 (voir `AUDIT-OUBLIS-V2.md`)

## 🚀 COMMENT LANCER (MULTI-COWORK)

```
1. Ouvrir une session Cowork
2. Dire : "Lis SPRINTS-VOYAGES/SUIVI-MULTI-COWORK.md puis exécute le prochain sprint disponible"
3. Cowork vérifie ce qui est déjà fait, choisit un sprint, marque "🔄 En cours"
4. Cowork lit le fichier SPRINT-XX correspondant et exécute
5. À la fin, Cowork marque "✅ Fait" dans SUIVI-MULTI-COWORK.md
```

> **⚠️ Plusieurs Cowork en parallèle** : le fichier `SUIVI-MULTI-COWORK.md` sert de coordination. Chaque Cowork DOIT le lire avant et le mettre à jour après.

## Organisation

| Sprint | Fichier | Scope | Tâches | Estimation |
|--------|---------|-------|--------|------------|
| 1 | `SPRINT-01-QUICK-WINS.md` | 3 composants fantômes catalogue | 4 | 30 min |
| 2 | `SPRINT-02-CHIPS-FILTRES.md` | 10 filtres + sliders + URL persistant | 10 | 1h |
| 3 | `SPRINT-03-SECTIONS-CATALOGUE.md` | 6 sections + badges + wishlist + pagination | 8 | 1h30 |
| 4 | `SPRINT-04-BACKEND-TAGS.md` | Prisma + filtres API + search | 9 | 1h |
| 5 | `SPRINT-05-DETAIL-MEDIAS.md` | Vidéos RGPD + galerie + lightbox | 6 | 1h30 |
| 6 | `SPRINT-06-DETAIL-SOCIAL.md` | Préannonce + waitlist + FAQ + témoignages + CTA + Follow | 16 | 1h30 |
| 7 | `SPRINT-07-DETAIL-UX.md` | Carte + chambre + assurance + sticky + unicité + amenities | 15 | 1h30 |
| 8 | `SPRINT-08-SEO-FINAL.md` | JSON-LD + sitemap + UTM + carte catalogue | 10 | 1h |
| **TOTAL** | | | **78** | **~9h** |

## Fichiers du dossier

| Fichier | Description |
|---------|-------------|
| `SUIVI-MULTI-COWORK.md` | **Point de synchronisation** — 78 tâches avec statuts |
| `AUDIT-OUBLIS-V2.md` | Rapport d'audit — 13 oublis majeurs + 22 corrections |
| `SPRINT-01` à `SPRINT-08` | Instructions détaillées par sprint (avec correctifs V2) |
| `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` | Rapport écarts initial (pré-audit) |

## Fichiers critiques — ATTENTION CONFLITS

| Fichier partagé | Modifié par |
|----------------|-------------|
| `voyages-client.tsx` | Sprint 1, 2, 3, 8 |
| `TravelCard.tsx` | Sprint 3 |
| `voyage-detail-client.tsx` | Sprint 5, 6, 7 |
| `schema.prisma` | Sprint 4 uniquement |
| `travels.controller.ts` | Sprint 4, 6, 7 |

## Statut

- [x] Sprint 0 — Analyse des écarts (FAIT)
- [x] Audit V2 — 13 oublis corrigés (FAIT — 2026-03-18)
- [x] Sprint 1 — Quick Wins (4 tâches)
- [x] Sprint 2 — Chips Filtres (10 tâches)
- [x] Sprint 3 — Sections Catalogue (8 tâches)
- [x] Sprint 4 — Backend Tags (9 tâches)
- [x] Sprint 5 — Détail Médias (6 tâches)
- [x] Sprint 6 — Détail Social (16 tâches)
- [x] Sprint 7 — Détail UX (15 tâches)
- [x] Sprint 8 — SEO Final (10 tâches)

✅ 77/78 tâches terminées — 19 mars 2026. Seule la tâche 4.8 (Migration Prisma) en attente du déploiement DB.
