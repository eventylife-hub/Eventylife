# Roadmap Produit — Eventy Life
> **Créé** : 19 mars 2026
> **Source** : MEGA-AUDIT drawio (1 798 pages) vs code existant

---

## Légende priorités
- **MVP** = Nécessaire avant lancement production
- **V1.1** = Après lancement, dans les 2 premières semaines
- **V1.5** = Améliorations Q2 2026
- **V2** = Évolutions futures

---

## Features à implémenter

### 🔴 MVP — Avant production

| # | Feature | Pages drawio | Effort | Assignation |
|---|---------|-------------|--------|-------------|
| 1 | **Compléter page catalogue /voyages** (55% → 95%) | 02, 185-188 | 3-4 jours | COWORK-7 |
| 2 | **Compléter page détail /voyages/[slug]** (65% → 95%) | 16, 185-188 | 3-4 jours | COWORK-7 |
| 3 | **Checkout avancé** (sélecteur chambre, toggle assurance, grille annulation) | 117-119 | 2-3 jours | COWORK-7 |
| 4 | **Gating PREANNOUNCE vs BOOKABLE** (rendu conditionnel selon statut) | 186, 208 | 1-2 jours | COWORK-7 |
| 5 | **Quality Gate Scoring** (score qualité avant publication voyage) | 216 | 1-2 jours | COWORK-8 |

### 🟡 V1.1 — Semaines 1-2 après lancement

| # | Feature | Pages drawio | Effort | Assignation |
|---|---------|-------------|--------|-------------|
| 6 | **Carte interactive bus stops** (Google Maps/Leaflet remplace emoji) | 156-157 | 2-3 jours | COWORK-7 |
| 7 | **Email flows crédit/NoGo** (automatisation complète) | 245-249 | 2-3 jours | COWORK-8 |
| 8 | **NoGo Decision Board admin** (dashboard 52 occurrences) | 213 | 1-2 jours | COWORK-8 |
| 9 | **Runbook J0** (opérations jour du départ) | 272-277 | 3-5 jours | COWORK-8 |
| 10 | **Safety Sheets / Fiche Sécurité** (fiches par voyage) | 216-221 | 2-3 jours | COWORK-8 |

### 🔵 V1.5 — Q2 2026

| # | Feature | Pages drawio | Effort | Assignation |
|---|---------|-------------|--------|-------------|
| 11 | **Duplicate Season Wizard** (cloner un voyage) | 223-230 | 2-3 jours | Backend |
| 12 | **Bibliothèque de parcours** (clone par ville de départ) | 171 | 1-2 jours | Backend |
| 13 | **Transport Quote Automation** (demandes devis auto) | 177 | 2-3 jours | Backend |
| 14 | **Admin PurgeSimulation Preview** (simulation RGPD) | 270-271 | 1 jour | Backend |
| 15 | **Elastic Hold Policy 72h** (configuration dynamique) | DevOps | 1 jour | Backend |

### ⚪ V2 — Futures évolutions

| # | Feature | Pages drawio | Effort | Assignation |
|---|---------|-------------|--------|-------------|
| 16 | **Portail Hôtelier MVP** (interface dédiée) | 128-130 | 5-8 jours | Nouveau portail |
| 17 | **Portail Restaurateur** (interface dédiée) | 05, 199-206 | 5-8 jours | Nouveau portail |
| 18 | **Module VENDEUR** (campagnes QR, magasin) | 400+ | 3-5 jours | Nouveau module |

---

## Estimation totale

| Phase | Features | Jours estimés |
|-------|----------|---------------|
| MVP | 5 features | ~12-15 jours |
| V1.1 | 5 features | ~12-16 jours |
| V1.5 | 5 features | ~7-10 jours |
| V2 | 3 features | ~13-21 jours |
| **TOTAL** | **18 features** | **~44-62 jours** |

---

## Ordre de priorité recommandé

```
Semaine 1-2 : COWORK-7 (MVP frontend : catalogue, détail, checkout, gating)
       ↓
Semaine 2-3 : COWORK-8 (Quality Gate + Runbook + Safety + Email flows)
       ↓
Semaine 3-4 : Tests E2E + Polish UX (COWORK-9)
       ↓
LANCEMENT PRODUCTION
       ↓
Semaine 5-6 : V1.1 (carte bus, NoGo board, email automation complète)
       ↓
Q2 2026 : V1.5 (Duplicate Season, Transport Quotes, Purge Simulation)
       ↓
Q3 2026 : V2 (Portails Hôtelier et Restaurateur, Module VENDEUR)
```

---

*Créé le 19 mars 2026 par Claude PDG Cowork*
