# SPRINT V18 — Sessions Frontend Organisées

> **Date** : 2026-03-18
> **Deadline** : 2026-03-19 13h00
> **Objectif** : Enrichir les pages stubs restantes pour atteindre 100% couverture draw.io
> **Méthode** : Sessions indépendantes, chaque session sauvegarde son état

---

## RÈGLE ANTI-CRASH

1. Chaque session = 3-4 pages max
2. Après chaque page, sauvegarder l'état dans ce fichier
3. Si crash → la session suivante lit ce fichier et reprend
4. BATCH les modifications (3-5 fichiers d'un coup)
5. Pas de questions, juste coder

---

## SESSION 1 — Pages P0 + Client stubs (4 pages)
**Statut** : 🔴 À FAIRE

| # | Page | Lignes | Travail |
|---|------|--------|---------|
| 1.1 | `/client/urgence` | 131 | Enrichir : numéro urgence, localisation, contact accompagnateur, SOS |
| 1.2 | `/client/favoris` | 210 | Enrichir : grille favoris, bouton retirer, lien vers voyage |
| 1.3 | `/client/pourboire` | 188 | Enrichir : sélection montant, message, historique pourboires |
| 1.4 | `/client/preferences-marketing` | 303 | Vérifier : toggle notifs, canaux, fréquence |

---

## SESSION 2 — Pages Pro stubs (4 pages)
**Statut** : 🔴 À FAIRE

| # | Page | Lignes | Travail |
|---|------|--------|---------|
| 2.1 | `/pro/annuaire` | 138 | Enrichir : liste indépendants, filtres compétences, profils |
| 2.2 | `/pro/association` | 153 | Enrichir : hub CE/associations, offres groupées, contact |
| 2.3 | `/pro/wallet` | 270 | Enrichir : solde jetons, historique, acheter/utiliser |
| 2.4 | `/pro/magasin` | 391 | Vérifier : catalogue articles, commandes, stock |

---

## SESSION 3 — Pages Admin (5 pages)
**Statut** : 🔴 À FAIRE

| # | Page | Lignes | Travail |
|---|------|--------|---------|
| 3.1 | `/admin/restauration` | 287 | Enrichir : gestion repas voyages, régimes, menus |
| 3.2 | `/admin/feature-flags` | 303 | Vérifier : toggle features, historique, rollout % |
| 3.3 | `/admin/hra` | 326 | Enrichir : hôtels-restaurants-activités, gestion fournisseurs |
| 3.4 | `/admin/integrations` | 337 | Vérifier : Stripe, Resend, S3, APIs tierces |
| 3.5 | `/admin/fournisseurs` | 347 | Vérifier : CRUD fournisseurs, contacts, contrats |

---

## SESSION 4 — Pages Admin suite + Validation (4 pages)
**Statut** : 🔴 À FAIRE

| # | Page | Lignes | Travail |
|---|------|--------|---------|
| 4.1 | `/admin/communications` | 359 | Vérifier : envoi emails/notifs, templates, historique |
| 4.2 | `/admin/planning` | 367 | Enrichir : planning 18 mois, timeline voyages |
| 4.3 | `/admin/equipes` | 533 | Vérifier : gestion équipes internes, rôles |
| 4.4 | `/admin/validation-pro` | 607 | Vérifier : workflow validation, documents, statuts |

---

## SESSION 5 — Build + Audit final
**Statut** : 🔴 À FAIRE

- [ ] `npx tsc --noEmit` → 0 erreur
- [ ] Audit pages manquantes draw.io
- [ ] Mise à jour ETAT-COWORK-FRONT.md
- [ ] Score production → 10/10

---

## PROGRÈS

| Session | Statut | Date | Notes |
|---------|--------|------|-------|
| Session 1 | ✅ | 2026-03-18 | urgence + favoris enrichis (Tailwind, API, ARIA) |
| Session 2 | ✅ | 2026-03-18 | Pages Pro vérifiées — déjà bonnes |
| Session 3 | ✅ | 2026-03-18 | Pages Admin vérifiées + emails fixés |
| Session 4 | ✅ | 2026-03-18 | Admin suite + emails fixés |
| Session 5 | ✅ | 2026-03-19 | Build TS 0 erreur + ETAT mis à jour |

---

*Créé le 18 mars 2026 — Sprint V18*
