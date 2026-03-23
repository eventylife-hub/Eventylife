# INVENTAIRE COMPLET — 247 Pages Frontend Eventy Life

> **Date** : 22 mars 2026 — Audit automatique du code source
> **Référence** : draw.io V53 (1 533 diagrammes dont 834 PATCHES)
> **Statut** : 18/18 features core draw.io implémentées + 46 pages bonus

---

## Résumé

| Portail | Pages | Évolution vs doc |
|---------|-------|------------------|
| Public | 29 | +3 |
| Client | 33 | +3 |
| Pro | 96 | +24 |
| Admin | 68 | +14 |
| Auth | 11 | = |
| Checkout | 7 | +1 |
| Autre | 3 | +1 |
| **TOTAL** | **247** | **+46** |

---

## 1. PORTAIL PUBLIC — 29 pages

| # | Route | Description |
|---|-------|-------------|
| 1 | `/` | Homepage — hero, voyages vedettes, témoignages, CTA |
| 2 | `/a-propos` | Page À propos — histoire Eventy, équipe, valeurs |
| 3 | `/avis` | Avis clients publics |
| 4 | `/blog` | Liste articles blog |
| 5 | `/blog/[slug]` | Article blog détail |
| 6 | `/brochure` | Brochure téléchargeable |
| 7 | `/cgv` | Conditions Générales de Vente |
| 8 | `/comment-ca-marche` | Explication du fonctionnement |
| 9 | `/conditions` | Conditions d'utilisation |
| 10 | `/confidentialite` | Politique de confidentialité (variante) |
| 11 | `/contact` | Formulaire de contact |
| 12 | `/cookies` | Politique cookies |
| 13 | `/depart` | Liste des villes de départ |
| 14 | `/depart/[ville]` | Page SEO ville de départ (dynamique) |
| 15 | `/devenir-partenaire` | Landing page recrutement partenaires |
| 16 | `/faq` | Foire aux questions |
| 17 | `/itineraires` | Catalogue itinéraires / Route Packs publics |
| 18 | `/mentions-legales` | Mentions légales |
| 19 | `/p/[proSlug]` | Mini-landing page partenaire (shortlink) |
| 20 | `/partenaires` | Liste partenaires publique |
| 21 | `/politique-confidentialite` | Politique de confidentialité |
| 22 | `/pro/[slug]` | Fiche publique partenaire pro |
| 23 | `/suivi-commande` | Suivi de commande (sans connexion) |
| 24 | `/v/[code]` | Lien viral / code partage |
| 25 | `/voyages` | Catalogue voyages |
| 26 | `/voyages/[slug]` | Détail voyage |
| 27 | `/voyages/[slug]/avis` | Avis d'un voyage spécifique |
| 28 | `/voyages/[slug]/checkout` | Checkout intégré au voyage |
| 29 | `/voyages/[slug]/groupes` | Groupes ouverts d'un voyage |

---

## 2. PORTAIL CLIENT — 33 pages

| # | Route | Description |
|---|-------|-------------|
| 1 | `/client` | Accueil espace client |
| 2 | `/client/assurance` | Détails assurance Pack Sérénité |
| 3 | `/client/avis` | Mes avis déposés |
| 4 | `/client/dashboard` | Dashboard client |
| 5 | `/client/documents` | Mes documents (factures, billets, attestations) |
| 6 | `/client/donnees-personnelles` | Gestion RGPD / DSAR |
| 7 | `/client/favoris` | Voyages favoris |
| 8 | `/client/groupes` | Mes groupes |
| 9 | `/client/groupes/[id]` | Détail d'un groupe |
| 10 | `/client/groupes/[id]/inviter` | Inviter des membres au groupe |
| 11 | `/client/groupes/creer` | Créer un groupe |
| 12 | `/client/groupes/rejoindre` | Rejoindre un groupe |
| 13 | `/client/notifications` | Notifications |
| 14 | `/client/notifications/preferences` | Préférences de notifications |
| 15 | `/client/paiements` | Historique paiements / échéancier |
| 16 | `/client/pourboire` | Pourboire guides/chauffeurs |
| 17 | `/client/preferences-marketing` | Préférences marketing / unsubscribe |
| 18 | `/client/profil` | Mon profil |
| 19 | `/client/reservations` | Liste réservations |
| 20 | `/client/reservations/[id]` | Détail réservation |
| 21 | `/client/reservations/[id]/annuler` | Annulation réservation |
| 22 | `/client/reservations/[id]/avis` | Déposer un avis post-voyage |
| 23 | `/client/reservations/[id]/facture` | Facture de la réservation |
| 24 | `/client/reservations/[id]/preferences` | Préférences voyage (repas, siège, etc.) |
| 25 | `/client/reservations/[id]/rooming` | Attribution chambre |
| 26 | `/client/support` | Support / tickets |
| 27 | `/client/urgence` | SOS urgence en voyage (GPS) |
| 28 | `/client/voyage/[id]` | Hub voyage (hero, stats J-X, programme) |
| 29 | `/client/voyage/[id]/activites` | Activités disponibles pendant le voyage |
| 30 | `/client/voyage/[id]/aide-locale` | Aide locale / contacts sur place |
| 31 | `/client/voyage/[id]/carnet` | Carnet de voyage personnel |
| 32 | `/client/voyage/[id]/suivi` | Suivi temps réel du transport |
| 33 | `/client/wallet` | Wallet — cartes cadeaux, crédits |

---

## 3. PORTAIL PRO — 96 pages

### Dashboard & Général
| # | Route | Description |
|---|-------|-------------|
| 1 | `/pro` | Dashboard principal Pro |
| 2 | `/pro/dashboard` | Dashboard secondaire / widgets |
| 3 | `/pro/profil` | Mon profil pro |
| 4 | `/pro/compte` | Paramètres compte |
| 5 | `/pro/notifications` | Notifications |
| 6 | `/pro/support` | Support |
| 7 | `/pro/support/[id]` | Détail ticket support |
| 8 | `/pro/documents` | Mes documents contractuels |
| 9 | `/pro/annuaire` | Annuaire partenaires |
| 10 | `/pro/association` | Page association / réseau |
| 11 | `/pro/paiements` | Historique paiements reçus |
| 12 | `/pro/wallet` | Wallet pro |

### Auth Pro
| # | Route | Description |
|---|-------|-------------|
| 13 | `/pro/login` | Login espace pro |
| 14 | `/pro/inscription` | Inscription partenaire |
| 15 | `/pro/forgot-password` | Mot de passe oublié pro |
| 16 | `/pro/onboarding` | Onboarding nouveau partenaire |
| 17 | `/pro/formation` | Formation obligatoire (22 vidéos) |

### Voyages Pro
| # | Route | Description |
|---|-------|-------------|
| 18 | `/pro/voyages` | Liste mes voyages |
| 19 | `/pro/voyages/nouveau` | Créer un voyage |
| 20 | `/pro/voyages/[id]` | Détail voyage |
| 21 | `/pro/voyages/[id]/edit` | Éditer un voyage |
| 22 | `/pro/voyages/[id]/reservations` | Réservations du voyage |
| 23 | `/pro/voyages/[id]/remplissage` | Taux de remplissage / jauge |
| 24 | `/pro/voyages/[id]/finance` | Finance du voyage |
| 25 | `/pro/voyages/[id]/factures` | Factures du voyage |
| 26 | `/pro/voyages/[id]/forfaits` | Forfaits & packs du voyage |
| 27 | `/pro/voyages/[id]/rooming` | Rooming list |
| 28 | `/pro/voyages/[id]/rooming/hotel-blocks` | Blocs chambres hôtel |
| 29 | `/pro/voyages/[id]/restauration` | Restauration du voyage |
| 30 | `/pro/voyages/[id]/sponsors` | Sponsors du voyage |
| 31 | `/pro/voyages/[id]/activites` | Activités du voyage |
| 32 | `/pro/voyages/[id]/aide-locale` | Aide locale |
| 33 | `/pro/voyages/[id]/carnet` | Carnet de voyage |
| 34 | `/pro/voyages/[id]/equipe` | Équipe assignée |
| 35 | `/pro/voyages/[id]/bilan` | Bilan post-voyage |
| 36 | `/pro/voyages/[id]/clone-season` | Dupliquer pour nouvelle saison |
| 37 | `/pro/voyages/[id]/runbook-j0` | Runbook jour J |

### Transport Pro
| # | Route | Description |
|---|-------|-------------|
| 38 | `/pro/voyages/[id]/transport` | Transport du voyage |
| 39 | `/pro/voyages/[id]/transport/avion` | Allotement avion |
| 40 | `/pro/voyages/[id]/transport/manifest` | Manifeste passagers |
| 41 | `/pro/transports/charters` | Gestion charters |
| 42 | `/pro/transports/multi-bus` | Multi-bus coordonné |

### Terrain / Ops
| # | Route | Description |
|---|-------|-------------|
| 43 | `/pro/voyages/[id]/terrain` | Vue terrain temps réel |
| 44 | `/pro/voyages/[id]/terrain/appel` | Appel nominatif |
| 45 | `/pro/voyages/[id]/terrain/contacts` | Contacts terrain |
| 46 | `/pro/voyages/[id]/terrain/incidents` | Gestion incidents |
| 47 | `/pro/voyages/[id]/terrain/passagers` | Liste passagers |

### Vendre
| # | Route | Description |
|---|-------|-------------|
| 48 | `/pro/vendre` | Hub vendeur |
| 49 | `/pro/vendre/dashboard` | Dashboard ventes |
| 50 | `/pro/vendre/classement` | Classement vendeurs |
| 51 | `/pro/vendre/devis` | Générateur devis |
| 52 | `/pro/vendre/lien-paiement` | Lien de paiement |
| 53 | `/pro/vendre/mini-landing` | Mini-landing page |
| 54 | `/pro/vendre/notifications` | Notifications ventes |
| 55 | `/pro/vendre/reservation-assistee` | Réservation assistée |
| 56 | `/pro/vendre/widget` | Widget intégrable |
| 57 | `/pro/vendre/widget-partenaires` | Widget partenaires |

### Marketing Pro
| # | Route | Description |
|---|-------|-------------|
| 58 | `/pro/marketing` | Dashboard marketing |
| 59 | `/pro/marketing/[id]` | Détail campagne |
| 60 | `/pro/marketing/analytics` | Analytics marketing |
| 61 | `/pro/marketing/creer` | Créer campagne |
| 62 | `/pro/marketing/leads` | Leads / prospects |
| 63 | `/pro/marketing/qr-print` | QR codes imprimables A4 |
| 64 | `/pro/marketing/reseaux` | Réseaux sociaux |
| 65 | `/pro/marketing/shortlinks` | Liens courts e.ty/xxx |
| 66 | `/pro/marketing/studio-ia` | Studio IA (visuels générés) |
| 67 | `/pro/marketing/viral` | Croissance virale |
| 68 | `/pro/marketing/visuels` | Bibliothèque visuels |

### Finance & Revenus Pro
| # | Route | Description |
|---|-------|-------------|
| 69 | `/pro/finance` | Dashboard finance |
| 70 | `/pro/finance/cloture` | ClosePack — clôture comptable |
| 71 | `/pro/revenus` | Mes revenus |
| 72 | `/pro/revenus/releve` | Relevé détaillé |
| 73 | `/pro/reservations` | Toutes mes réservations |

### Itinéraires & Arrêts
| # | Route | Description |
|---|-------|-------------|
| 74 | `/pro/itineraires` | Mes itinéraires / Route Packs |
| 75 | `/pro/itineraires/[id]` | Détail itinéraire |
| 76 | `/pro/arrets` | Liste arrêts |
| 77 | `/pro/arrets/nouveau` | Ajouter un arrêt |

### Missions & Messagerie
| # | Route | Description |
|---|-------|-------------|
| 78 | `/pro/missions` | Missions assignées |
| 79 | `/pro/missions/[id]` | Détail mission |
| 80 | `/pro/messagerie` | Messagerie |
| 81 | `/pro/messagerie/[id]` | Conversation |

### Magasin & Activités
| # | Route | Description |
|---|-------|-------------|
| 82 | `/pro/magasin` | Magasin pro (fournitures, matériel) |
| 83 | `/pro/activites/dashboard` | Dashboard activités |
| 84 | `/pro/activites/catalogue` | Catalogue activités |
| 85 | `/pro/activites/catalogue/creer` | Créer une activité |
| 86 | `/pro/activites/reservations` | Réservations activités |
| 87 | `/pro/activites/calendrier` | Calendrier activités |
| 88 | `/pro/activites/avis` | Avis activités |
| 89 | `/pro/activites/finance` | Finance activités |
| 90 | `/pro/activites/profil` | Profil prestataire activités |
| 91 | `/pro/activites/inscription` | Inscription prestataire activités |

### Paramètres Pro
| # | Route | Description |
|---|-------|-------------|
| 92 | `/pro/parametres` | Paramètres généraux |
| 93 | `/pro/parametres/comptes` | Gestion comptes bancaires |
| 94 | `/pro/parametres/equipe` | Gestion équipe / sous-comptes |
| 95 | `/pro/parametres/facturation` | Paramètres facturation |
| 96 | `/pro/parametres/notifications` | Préférences notifications |

---

## 4. PORTAIL ADMIN — 68 pages

### Dashboard & Général
| # | Route | Description |
|---|-------|-------------|
| 1 | `/admin` | Homepage admin |
| 2 | `/admin/dashboard` | Dashboard secondaire |
| 3 | `/admin/parametres` | Paramètres système |
| 4 | `/admin/notifications` | Centre notifications |
| 5 | `/admin/utilisateurs` | Gestion utilisateurs |
| 6 | `/admin/utilisateurs/[id]` | Détail utilisateur |
| 7 | `/admin/rbac` | Rôles & permissions |
| 8 | `/admin/feature-flags` | Feature flags |
| 9 | `/admin/exports` | Centre d'exports (CSV, FEC, Excel) |
| 10 | `/admin/audit` | Journal d'audit |

### Voyages Admin
| # | Route | Description |
|---|-------|-------------|
| 11 | `/admin/voyages` | Liste voyages |
| 12 | `/admin/voyages/creer` | Créer voyage admin |
| 13 | `/admin/voyages/[id]` | Détail voyage |
| 14 | `/admin/voyages/[id]/lifecycle` | Lifecycle voyage |
| 15 | `/admin/voyages/[id]/controle` | Contrôle temps réel |
| 16 | `/admin/voyages/[id]/controle/appel` | Appel nominatif admin |
| 17 | `/admin/voyages/[id]/controle/incidents` | Incidents admin |
| 18 | `/admin/voyages/[id]/controle/override` | Override admin |

### Finance Admin
| # | Route | Description |
|---|-------|-------------|
| 19 | `/admin/finance` | Dashboard finance |
| 20 | `/admin/finance/accounting-dashboard` | Tableau de bord comptable |
| 21 | `/admin/finance/closing` | Closing financier |
| 22 | `/admin/finance/cloture` | ClosePack admin |
| 23 | `/admin/finance/ledger` | Grand livre / ledger |
| 24 | `/admin/finance/payout-batch` | Batch payouts |
| 25 | `/admin/finance/payouts` | Payouts individuels |
| 26 | `/admin/finance/reconciliation` | Réconciliation bancaire |
| 27 | `/admin/finance/supplier-invoices` | Factures fournisseurs |
| 28 | `/admin/finance/tva` | Déclaration TVA marge |

### Gestion opérationnelle
| # | Route | Description |
|---|-------|-------------|
| 29 | `/admin/bookings` | Réservations |
| 30 | `/admin/annulations` | Annulations |
| 31 | `/admin/annulations/[id]` | Détail annulation |
| 32 | `/admin/ventes` | Ventes globales |
| 33 | `/admin/ventes/activites` | Ventes activités |
| 34 | `/admin/forfaits` | Gestion forfaits |
| 35 | `/admin/rooming` | Rooming global |
| 36 | `/admin/restauration` | Restauration globale |
| 37 | `/admin/transport` | Transport |
| 38 | `/admin/transports` | Transports (variante) |
| 39 | `/admin/itineraires` | Itinéraires / Route Packs |
| 40 | `/admin/planning` | Planning global |

### Partenaires & RH
| # | Route | Description |
|---|-------|-------------|
| 41 | `/admin/pros` | Liste partenaires pro |
| 42 | `/admin/validation-pro` | Validation nouveaux pros |
| 43 | `/admin/independants` | Gestion indépendants |
| 44 | `/admin/independants/suivi-live` | Suivi live indépendants |
| 45 | `/admin/equipes` | Gestion équipes |
| 46 | `/admin/fournisseurs` | Gestion fournisseurs |
| 47 | `/admin/missions` | Missions |
| 48 | `/admin/sponsors` | Liste sponsors |
| 49 | `/admin/sponsors/[id]` | Détail sponsor |

### Marketing & Communication
| # | Route | Description |
|---|-------|-------------|
| 50 | `/admin/marketing` | Dashboard marketing |
| 51 | `/admin/marketing/leads` | Leads centralisés |
| 52 | `/admin/marketing/planner` | Planificateur marketing |
| 53 | `/admin/communications` | Communications internes |
| 54 | `/admin/comms` | Communications (variante) |
| 55 | `/admin/emails-queue` | File d'attente emails |

### Support & Incidents
| # | Route | Description |
|---|-------|-------------|
| 56 | `/admin/support` | Support / tickets |
| 57 | `/admin/incidents` | Incidents |
| 58 | `/admin/alertes` | Alertes système |
| 59 | `/admin/aide-locale` | Aide locale admin |

### Données & Monitoring
| # | Route | Description |
|---|-------|-------------|
| 60 | `/admin/data-satisfaction` | Données satisfaction |
| 61 | `/admin/documents` | Gestion documents |
| 62 | `/admin/dsar` | Demandes RGPD (DSAR) |
| 63 | `/admin/hra` | HRA (Health Risk Assessment) |
| 64 | `/admin/carnets` | Carnets de voyage |
| 65 | `/admin/integrations` | Intégrations tierces |
| 66 | `/admin/monitoring` | Monitoring technique |
| 67 | `/admin/monitoring/cron-history` | Historique crons |
| 68 | `/admin/system-health` | Santé système |

---

## 5. AUTH — 11 pages

| # | Route | Description |
|---|-------|-------------|
| 1 | `/admin-login` | Login admin dédié |
| 2 | `/auth/connexion` | Connexion (variante) |
| 3 | `/auth/inscription` | Inscription (variante) |
| 4 | `/auth/mot-de-passe-oublie` | MDP oublié (variante) |
| 5 | `/connexion` | Connexion principale |
| 6 | `/inscription` | Inscription principale |
| 7 | `/login` | Login (redirect) |
| 8 | `/mot-de-passe-oublie` | Mot de passe oublié |
| 9 | `/register` | Register (redirect) |
| 10 | `/reinitialiser-mot-de-passe` | Réinitialisation MDP |
| 11 | `/verification-email` | Vérification email |

---

## 6. CHECKOUT — 7 pages

| # | Route | Description |
|---|-------|-------------|
| 1 | `/checkout/start` | Démarrage checkout |
| 2 | `/checkout/step-1` | Étape 1 — Infos voyageurs |
| 3 | `/checkout/step-2` | Étape 2 — Options & forfaits |
| 4 | `/checkout/step-3` | Étape 3 — Paiement (Stripe) |
| 5 | `/checkout/activites` | Sélection activités |
| 6 | `/checkout/transport` | Choix transport (siège bus/avion) |
| 7 | `/checkout/confirmation` | Confirmation & récapitulatif |

---

## 7. AUTRE — 3 pages

| # | Route | Description |
|---|-------|-------------|
| 1 | `/embed/[proSlug]` | Widget embed partenaire (iframe) |
| 2 | `/maintenance` | Page maintenance |
| 3 | `/offline` | Page hors ligne (PWA) |

---

## Correspondance Draw.io V53 → Code

| Feature Draw.io | Pages | Statut |
|----------------|-------|--------|
| **Module Vendeur** (pages 392-398) | pro/vendre/* — 10 pages | ✅ |
| **Croissance Virale** | pro/marketing/viral, depart/[ville], v/[code] | ✅ |
| **Forfaits/Packs** (pages 73, 78-79) | pro/voyages/[id]/forfaits, admin/forfaits | ✅ |
| **Portail Hôtelier** (pages 63-65) | admin/rooming, pro/voyages/[id]/rooming/* | ✅ |
| **Portail Restaurateur** (pages 199-206) | admin/restauration, pro/voyages/[id]/restauration | ✅ |
| **Sponsors** (pages 74, 80-81) | admin/sponsors/*, pro/voyages/[id]/sponsors | ✅ |
| **Route Packs** (pages 307-325) | pro/itineraires/*, admin/itineraires | ✅ |
| **Charter/Multi-bus** (QA_PATCH_1352) | pro/transports/charters, pro/transports/multi-bus | ✅ |
| **ClosePack Finance** (pages 738-755) | pro/finance/cloture, admin/finance/cloture | ✅ |
| **Formation Pro** (22 vidéos) | pro/formation | ✅ |
| **Marketing Suite** (10 outils) | pro/marketing/* — 12 pages | ✅ |
| **Checkout** (5 étapes) | checkout/* — 7 pages | ✅ |
| **Transport** (bus, avion, charter) | pro/voyages/[id]/transport/* | ✅ |
| **Terrain/Ops** | pro/voyages/[id]/terrain/* — 5 pages | ✅ |
| **Finance Admin** (compta, TVA, ledger) | admin/finance/* — 10 pages | ✅ |
| **Wallet** (cartes cadeaux, crédits) | pro/wallet, client/wallet | ✅ |
| **Assurance Pack Sérénité** | client/assurance | ✅ |
| **Blog SEO** | blog, blog/[slug] | ✅ |

**18/18 features core = 100% implémenté**

---

*Généré automatiquement le 22 mars 2026 — Audit code source frontend/app/*
