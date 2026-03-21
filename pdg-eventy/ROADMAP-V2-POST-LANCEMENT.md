# ROADMAP V2 — Features Post-Lancement

> **Créé** : 20 mars 2026
> **MAJ** : 20 mars 2026 — **100% IMPLÉMENTÉ** ✅
> **Source** : Draw.io V53 (1 533 pages) — features non implémentées mais spécifiées
> **Organisation** : Par trimestre, par impact business

---

## T1 POST-LANCEMENT (M1-M3 après Go-Live) — ✅ 100% FAIT

### P1 — Module VENDEUR (7 pages drawio : 392-398) — ✅ FAIT (précédemment)
**Impact** : Canal d'acquisition supplémentaire — les vendeurs amènent des clients moyennant commission.

| Page drawio | Feature | Complexité | Statut |
|-------------|---------|------------|--------|
| 392 | Dashboard Vendeur (stats ventes, commissions) | 2 jours | ✅ |
| 393 | Profil Vendeur (onboarding, documents) | 1 jour | ✅ |
| 394 | Campagnes QR (génération codes QR trackés par vendeur) | 2 jours | ✅ |
| 395 | Ventes & Commissions (suivi, historique, calcul auto) | 2 jours | ✅ |
| 396 | Payouts & Facturation (virements vendeurs) | 2 jours | ✅ |
| 397 | Équipe & Sous-comptes (vendeur → sous-vendeurs) | 1 jour | ✅ |
| 398 | Hub Vendeur (page d'accueil du portail vendeur) | 1 jour | ✅ |

---

### P1 — Croissance Virale (6 pages drawio : VIRAL_*) — ✅ FAIT (Cowork-21)
**Impact** : Acquisition organique gratuite — chaque client devient un ambassadeur.

| Page drawio | Feature | Complexité | Statut |
|-------------|---------|------------|--------|
| VIRAL_Hub | Hub croissance virale (dashboard métriques virales) | 1 jour | ✅ FAIT |
| VIRAL_SEO | SEO auto par ville (pages /depart/[ville] dynamiques) | — | ✅ FAIT |
| VIRAL_Share | Partage organique (boutons partage + UTM + QR) | — | ✅ FAIT |
| VIRAL_Fiche | Fiche Pro améliorée (profil public indépendant) | 2 jours | ✅ FAIT |
| VIRAL_UGC | Avis clients (reviews post-voyage, modération) | 3 jours | ✅ FAIT |
| VIRAL_QuickSell | Quick Sell Pro (vente rapide en 1 clic depuis mobile) | 2 jours | ✅ FAIT |

**Livrables** : Backend ViralGrowthService (6 méthodes K-factor), ReviewsService amélioré, 4 pages frontend (hub viral, fiche pro publique, avis clients, admin modération)

---

### P2 — Forfaits, Frais & Packs (pages 73, 78-79) — ✅ FAIT (Cowork-21)
**Impact** : Automatisation de la tarification complexe (suppléments, réductions, packs).

| Feature | Complexité | Statut |
|---------|------------|--------|
| Gestion des forfaits (all-inclusive, demi-pension, etc.) | 3 jours | ✅ FAIT |
| Frais additionnels configurables (supplément single, vue mer, etc.) | 2 jours | ✅ FAIT |
| Packs marketing (early bird -10%, groupe -15%, fidélité -5%) | 2 jours | ✅ FAIT |

**Livrables** : Backend PackagesService (14 méthodes, 7 Zod schemas), page pro /voyages/[id]/forfaits (4 onglets), admin /forfaits, composant PriceBreakdown réutilisable

---

## T2 POST-LANCEMENT (M4-M6) — ✅ 100% FAIT

### P2 — Portail Hôtelier (pages 63-65) — ✅ FAIT (précédemment)
| Feature | Complexité | Statut |
|---------|------------|--------|
| Dashboard hôtelier (réservations à confirmer, calendrier) | 3 jours | ✅ |
| Confirmation/refus de blocs de chambres | 2 jours | ✅ |
| Facturation automatique hôtel → Eventy | 2 jours | ✅ |
| Tests et intégration | 1 jour | ✅ |

### P2 — Portail Restaurateur (pages 199-206) — ✅ FAIT (précédemment)
| Feature | Complexité | Statut |
|---------|------------|--------|
| Options repas (menus, allergies, régimes) | 2 jours | ✅ |
| Déclaration repas servis (onsite, mobile) | 2 jours | ✅ |
| Payout restaurateur automatique | 1 jour | ✅ |
| Gestion litiges restauration | 2 jours | ✅ |
| Tests | 1 jour | ✅ |

### P3 — Portail Sponsor/Partenaire (pages 74, 80-81) — ✅ FAIT (Cowork-21)
**Impact** : Les sponsors financent des voyages en échange de visibilité.

| Feature | Complexité | Statut |
|---------|------------|--------|
| Dashboard sponsor (visibilité, ROI) | 2 jours | ✅ FAIT |
| Attribution sponsoring par voyage | 1 jour | ✅ FAIT |
| Facturation sponsor | 1 jour | ✅ FAIT |

**Livrables** : Backend SponsorsModule (13 méthodes, 14 endpoints), admin /sponsors + /sponsors/[id], pro /voyages/[id]/sponsors, modèles Prisma Sponsor + Sponsorship

---

## T3 POST-LANCEMENT (M7-M12) — ✅ 100% FAIT

### P3 — Route Packs & Transport avancé (pages 307-325) — ✅ FAIT (Cowork-21)
**Impact** : Optimisation logistique multi-bus et charter.

| Feature | Complexité | Statut |
|---------|------------|--------|
| Wizard création Route Pack (itinéraire réutilisable) | 3 jours | ✅ FAIT |
| Export PDF/CSV pour loueurs | 1 jour | ✅ FAIT |
| Lien Route Pack → Devis transport (pré-remplissage) | 2 jours | ✅ FAIT |
| Approbation admin + verrouillage pax | 1 jour | ✅ FAIT |
| Snapshot & archivage Route Pack | 1 jour | ✅ FAIT |

**Livrables** : Backend RoutePacksService (15 méthodes, 17 endpoints, 7 Zod schemas), 4 pages frontend (pro wizard, pro détail, admin, marketplace publique), 4 modèles Prisma (RoutePack, RoutePackStop, RoutePackTripLink, RoutePackSnapshot)

### P3 — Charter & Multi-bus (page drawio QA_PATCH_1352) — ✅ FAIT (Cowork-21)
**Impact** : Passage à l'échelle — 159+ passagers sur charter A320.

| Feature | Complexité | Statut |
|---------|------------|--------|
| Gestion vol charter (sièges, tarification, split B2B/OTA) | 5 jours | ✅ FAIT |
| Multi-bus coordonné (2-4 bus même voyage) | 3 jours | ✅ FAIT |
| Finance charter (close pack, cotisations, fonds pool créateur) | 3 jours | ✅ FAIT |

**Livrables** : Backend CharterFinanceService (11 méthodes) + MultiBusService existant enrichi, pages pro /transport/charter et /transport/multi-bus, admin /transport

### P3 — ClosePack Finance (pages 738-755) — ✅ FAIT (Cowork-21)
**Impact** : Clôture comptable automatisée de chaque voyage.

| Feature | Complexité | Statut |
|---------|------------|--------|
| ClosePack automatique (fin de voyage → clôture financière) | 3 jours | ✅ FAIT |
| Exports compta (cotisations, fonds, remises, pool créateur) | 2 jours | ✅ FAIT |
| Transfert cabinet comptable automatisé | 1 jour | ✅ FAIT |

**Livrables** : Backend ClosePackService (17 méthodes, 17 endpoints), page pro /finance/cloture, admin /finance/cloture, widget ClosePackSummary, modèle Prisma ClosePack, exports FEC/CSV/Excel

---

## RÉSUMÉ

| Trimestre | Features | Jours estimés | Statut |
|-----------|----------|--------------|--------|
| **T1** (M1-M3) | Vendeur + Viral + Forfaits | ~26 jours | ✅ **100% FAIT** |
| **T2** (M4-M6) | Hôtelier + Restaurateur + Sponsors | ~20 jours | ✅ **100% FAIT** |
| **T3** (M7-M12) | Route Packs + Charter + ClosePack | ~25 jours | ✅ **100% FAIT** |
| **TOTAL** | | **~71 jours** | ✅ **TOUT IMPLÉMENTÉ** |

> **Toute la roadmap V2 post-lancement (~71 jours de travail estimé) a été implémentée.** Le produit dispose maintenant de toutes les features prévues pour les 12 premiers mois post-lancement.

---

*Créé le 20 mars 2026 — MAJ 20 mars 2026 — Cowork-21 (Sprints T1-T3 complets)*
