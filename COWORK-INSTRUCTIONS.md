# INSTRUCTIONS COWORK — Plan Global (v2 — 19 mars 2026)

> **MAJ** : 19 mars 2026 — Après MÉGA-AUDIT (1 798 pages drawio analysées)
> **9 sessions au total** : 3 frontend (FAIT) + 3 backend legacy (FAIT) + 3 nouvelles sessions

---

## SESSIONS TERMINÉES

| # | Nom | Scope | Statut |
|---|-----|-------|--------|
| 1 | COWORK-1-ADMIN | Portail Admin (39 pages) | ✅ TERMINÉ |
| 2 | COWORK-2-PRO | Portail Pro (50 pages) | ✅ TERMINÉ |
| 3 | COWORK-3-CLIENT | Portail Client + Public (27+26 pages) | ✅ TERMINÉ |
| 4 | COWORK-4-BACK-FONDATIONS | Infra + Auth + Users + Onboarding | ✅ TERMINÉ (B-001→B-010) |
| 5 | COWORK-5-BACK-COEUR-METIER | Voyage + Booking + Finance | ✅ TERMINÉ (enrichissements) |
| 6 | COWORK-6-BACK-OPERATIONS | Notifs + Docs + Support + Sécu | ✅ TERMINÉ (enrichissements) |

**Bilan sessions 1-6** : 165 pages, 31 modules, 113 modèles Prisma, 0 erreur TS, 3 300+ tests.

---

## NOUVELLES SESSIONS À LANCER

| # | Fichier | Scope | Effort | Priorité |
|---|---------|-------|--------|----------|
| **7** | `COWORK-7-ECARTS-DRAWIO.md` | Écarts frontend drawio : catalogue, détail, checkout, carte, gating | ~12-15j | **P0 — MVP** |
| **8** | `COWORK-8-FEATURES-AVANCEES.md` | Features manquantes : Quality Gate, Runbook J0, Safety Sheets, Duplicate Season, Email flows, NoGo Board | ~12-16j | **P1 — V1.1** |
| **9** | COWORK-9-POLISH-UX (à créer) | Tests E2E complets, polish UX, accessibilité finale, perf audit | ~5-8j | **P2** |

### Ordre de lancement

```
Session 7 (Écarts drawio MVP) ──→ Session 9 (Polish + Tests)
Session 8 (Features avancées)  ──→ peut tourner EN PARALLÈLE avec 7
```

---

## PROMPTS DE LANCEMENT

### Session 7 — Écarts Draw.io Frontend
```
Lis le fichier COWORK-7-ECARTS-DRAWIO.md et exécute-le.
C'est la session frontend : combler les écarts entre le draw.io et le code sur les pages catalogue, détail voyage, checkout et carte bus stops.
Lis aussi AME-EVENTY.md et RAPPORT-ECARTS-DRAWIO-VS-CODE.md en premier.
```

### Session 8 — Features Avancées
```
Lis le fichier COWORK-8-FEATURES-AVANCEES.md et exécute-le.
C'est la session features avancées : Quality Gate, Runbook J0, Safety Sheets, Duplicate Season, Email automation, NoGo Board.
Lis aussi AME-EVENTY.md en premier.
```

### Session 9 — Polish UX (prompt à préparer quand sessions 7-8 terminées)
```
Tu es le testeur QA + UX designer d'Eventy Life.
Ton rôle : tests E2E Playwright sur les 3 portails, audit accessibilité WCAG 2.1 AA, audit performance Lighthouse, polish micro-interactions.
```

---

## ESTIMATION TOTALE MISE À JOUR

| Phase | Sessions | Heures Cowork | Statut |
|-------|----------|---------------|--------|
| Frontend pages UI | 1, 2, 3 | ~20h | ✅ FAIT |
| Backend fondations + enrichissement | 4, 5, 6 | ~45h | ✅ FAIT |
| Écarts drawio frontend | 7 | ~12-15j | 🆕 À faire |
| Features avancées | 8 | ~12-16j | 🆕 À faire |
| Polish + Tests E2E | 9 | ~5-8j | 🆕 À faire |
| **TOTAL** | **9** | **~95-110h** | **67% fait** |

---

## DOCUMENTS DE RÉFÉRENCE

| Document | Rôle |
|----------|------|
| `AME-EVENTY.md` | Manifeste fondateur — LIRE EN PREMIER |
| `MEGA-AUDIT-19-MARS-2026.md` | Audit complet drawio vs code |
| `RAPPORT-ECARTS-DRAWIO-VS-CODE.md` | 45 écarts détaillés page catalogue/détail |
| `ROADMAP-PRODUIT.md` | Priorisation des 18 features manquantes |
| `ETAT-COWORK-FRONT.md` | Mémoire sessions frontend |
| `ETAT-COWORK-BACK.md` | Mémoire sessions backend |

---

*Mis à jour le 19 mars 2026 — Post MÉGA-AUDIT*
