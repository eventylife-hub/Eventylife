# Plan Stratégique — Vente Pro 360° + Marketplace Activités

> **Date** : 20 mars 2026
> **Auteur** : David (PDG) + IA
> **Statut** : PLAN VALIDÉ — À IMPLÉMENTER
> **Vision** : Le pro Eventy doit pouvoir vendre **partout, par tous les moyens, à tout moment**

---

## Résumé exécutif

Ce plan couvre 3 axes stratégiques :

1. **Arsenal de vente Pro 360°** — Donner aux pros TOUS les outils pour vendre (en ligne, en personne, par téléphone, sur les réseaux sociaux, via leur site web)
2. **Marketplace Activités — Innovation Eventy** — Les prestataires d'activités (Eurodisney, parcs, musées, excursions...) partagent leur catalogue sur Eventy. On leur ramène du monde → ils reversent 5% de commission
3. **Portail HRA comme canal de vente** — Les pros vendent aussi via le HRA (hébergement, restauration, activités)

---

## État des lieux — Ce qui existe déjà ✅

| Fonctionnalité | Statut | Qualité |
|---|---|---|
| Quick Sell (`/pro/vendre`) — Liens référents + code vendeur | ✅ Fait | ⭐⭐⭐ Bon |
| Marketing Suite (`/pro/marketing`) — 8 outils | ✅ Fait | ⭐⭐⭐ Bon |
| Shortlinks traçables (e.ty/xxx) | ✅ Fait | ⭐⭐⭐ Bon |
| QR Codes + Templates d'impression | ✅ Fait | ⭐⭐⭐ Bon |
| Leads inbox | ✅ Fait | ⭐⭐⭐ Bon |
| Analytics & conversions | ✅ Fait | ⭐⭐⭐ Bon |
| Commission pro (15% par défaut) | ✅ Fait | ⭐⭐⭐ Bon |
| HRA backend (hôtels, restos, activités-coût) | ✅ Fait | ⭐⭐⭐ Bon |
| Page profil pro publique | ✅ Fait | ⭐⭐ À enrichir |

---

## Ce qui manque — Les 3 axes

---

## AXE 1 : Arsenal de vente Pro 360°

### 1.1 — Vente assistée (téléphone / en personne / salon)
> **Le pro crée une réservation POUR un client**

**Pourquoi** : Beaucoup de ventes se font par téléphone, en face à face, lors de salons. Le pro doit pouvoir réserver directement sans que le client aille sur le site.

**Pages à créer :**

| Page | Route | Description |
|---|---|---|
| **Réserver pour un client** | `/pro/vendre/reservation-assistee` | Formulaire complet : sélection voyage → infos client (nom, email, tel) → nombre de places → options → paiement (CB par tel, virement, espèces, lien de paiement) → confirmation |
| **Devis rapide** | `/pro/vendre/devis` | Générer un devis PDF personnalisé en 30 secondes : voyage, nombre de personnes, options, prix total → envoyer par email/WhatsApp |
| **Lien de paiement** | `/pro/vendre/lien-paiement` | Créer un lien Stripe unique pour un client → le client paie en cliquant → réservation auto-confirmée |

**Backend nécessaire :**
- `POST /pro/assisted-booking` — Créer une réservation pour un tiers
- `POST /pro/quotes` — Générer un devis
- `POST /pro/payment-links` — Créer un lien de paiement Stripe
- `GET /pro/payment-links` — Lister les liens actifs

---

### 1.2 — Widget embarquable pour sites web partenaires
> **Le pro intègre un mini-module de réservation sur SON site**

**Pourquoi** : Les pros ont souvent leur propre site web, blog, ou page Facebook. Ils doivent pouvoir intégrer un widget Eventy pour que les visiteurs réservent directement.

**Composants à créer :**

| Composant | Description |
|---|---|
| **Widget iframe** | `<iframe src="eventylife.fr/embed/{proSlug}?trip={id}" />` — Module de réservation minimal (photo, prix, CTA "Réserver") intégrable en 1 copier-coller |
| **Widget JS** | `<script src="eventylife.fr/widget.js" data-pro="{proSlug}"></script>` — Version script avec personnalisation (couleurs, taille) |
| **Bouton flottant** | Snippet HTML/JS pour ajouter un bouton "Réserver avec Eventy" sur n'importe quel site |
| **Configurateur widget** | `/pro/vendre/widget` — Interface où le pro configure son widget (couleur, voyages affichés, taille) et copie le code |

**Backend nécessaire :**
- `GET /public/embed/{proSlug}` — Endpoint public pour le widget
- `GET /public/embed/{proSlug}/trips` — Liste des voyages actifs du pro

---

### 1.3 — Partage réseaux sociaux avancé
> **Vendre via Instagram, Facebook, WhatsApp, TikTok, LinkedIn**

**Améliorations :**

| Fonctionnalité | Description |
|---|---|
| **Partage 1-clic** | Boutons de partage sur chaque voyage : WhatsApp, Instagram Story, Facebook, LinkedIn, Email — avec texte pré-rédigé + lien tracké |
| **Visuels auto-générés** | Image OG optimisée par voyage (photo + prix + dates + QR code) — parfait pour les stories Instagram |
| **Catalogue WhatsApp Business** | Export du catalogue voyages au format WhatsApp Business pour les pros qui vendent via WhatsApp |
| **Mini-landing par voyage** | `/v/{code}` — Page ultra-légère (5 secondes de chargement max) optimisée mobile : photo, prix, 3 bullet points, bouton "Je réserve" |
| **Templates stories** | Depuis `/pro/marketing/studio-ia`, générer des visuels stories Instagram/Facebook avec les infos du voyage |

**Backend nécessaire :**
- `GET /pro/social-share/{tripId}` — Générer les assets de partage (textes, liens, visuels)
- `GET /public/v/{code}` — Mini-landing page publique

---

### 1.4 — Améliorations Quick Sell existant
> **Rendre la page `/pro/vendre` plus puissante**

| Amélioration | Description |
|---|---|
| **Multi-voyages** | Permettre de générer un lien unique qui affiche TOUS les voyages du pro (pas juste 1) |
| **Code promo intégré** | Le pro peut créer un code promo (ex: -10€) lié à son lien de vente |
| **Compteur en temps réel** | Afficher les places restantes en temps réel sur le lien partagé ("Plus que 8 places !") |
| **Notification vente** | Push notification + email au pro quand quelqu'un réserve via son lien |
| **Classement vendeurs** | Gamification : top vendeurs du mois avec badges et récompenses |
| **Tableau de bord ventes unifié** | Dashboard qui agrège TOUTES les sources de vente (Quick Sell + Widget + Assistée + Activités) |

---

## AXE 2 : Marketplace Activités — L'INNOVATION 🚀

> **Concept** : Les prestataires d'activités (Eurodisney, parcs aquatiques, musées, excursions locales, dégustations, spa...) partagent leur catalogue sur Eventy. On leur ramène du monde via nos groupes de voyageurs. Ils reversent **5% de commission** sur chaque vente.

### 2.1 — Le concept en détail

```
PRESTATAIRE ACTIVITÉ          EVENTY                    VOYAGEUR
(Eurodisney, parc, musée)     (plateforme)              (client final)
        │                         │                          │
        ├── Crée son compte ─────►│                          │
        ├── Publie ses activités ►│                          │
        │   (prix, dispo, photos) │                          │
        │                         │◄── Réserve l'activité ───┤
        │                         │    (pendant le voyage)    │
        │◄── Reçoit la résa ──────┤                          │
        │    + 95% du prix        │── Garde 5% commission ──►│
        │                         │                          │
        └── Accueille le groupe ──┼──────────────────────────►│
```

### 2.2 — Portail Prestataire Activités (nouveau portail !)

**Route** : `/activites/` ou sous-domaine `activites.eventylife.fr`

| Page | Route | Description |
|---|---|---|
| **Inscription** | `/activites/inscription` | Formulaire : nom entreprise, type d'activité, zone géographique, SIRET, contact, photos |
| **Dashboard** | `/activites/dashboard` | Vue d'ensemble : réservations reçues, revenus, prochains groupes |
| **Mon catalogue** | `/activites/catalogue` | CRUD de ses activités : titre, description, photos, prix, capacité, disponibilités, durée |
| **Réservations** | `/activites/reservations` | Liste des réservations entrantes avec détails groupe (taille, date, contact pro) |
| **Calendrier** | `/activites/calendrier` | Vue calendrier des réservations + disponibilités |
| **Finance** | `/activites/finance` | Revenus (95% des ventes), historique paiements, factures auto-générées |
| **Avis** | `/activites/avis` | Avis laissés par les voyageurs Eventy |
| **Profil public** | `/activites/profil` | Page vitrine visible par les voyageurs et les pros |

### 2.3 — Côté Pro : Vendre des activités

**Intégration dans le portail pro existant :**

| Page | Route | Description |
|---|---|---|
| **Catalogue activités** | `/pro/voyages/[id]/activites` | Naviguer le catalogue d'activités disponibles à destination → ajouter au voyage |
| **Réserver une activité** | `/pro/voyages/[id]/activites/reserver` | Réserver pour le groupe : sélectionner activité, nombre de personnes, créneau, confirmer |
| **Mes activités vendues** | `/pro/vendre/activites` | Tableau de bord des activités vendues à ses groupes + commission tracking |
| **Recommander une activité** | `/pro/vendre/recommander-activite` | Partager un lien activité avec son groupe WhatsApp → les voyageurs réservent individuellement |

### 2.4 — Côté Client : Réserver des activités

**Intégration dans le portail client :**

| Page | Route | Description |
|---|---|---|
| **Activités du voyage** | `/client/voyage/[id]/activites` | Liste des activités proposées à destination avec prix, photos, avis |
| **Réserver** | `/client/voyage/[id]/activites/[actId]` | Page détail + réservation individuelle ou groupe |
| **Mes activités** | `/client/voyage/[id]/planning` | Planning du voyage avec activités réservées intégrées |

### 2.5 — Modèle économique des activités

| Élément | Valeur |
|---|---|
| **Commission Eventy** | **5% sur chaque vente d'activité** |
| **Commission Pro** (s'il recommande/vend) | **2% supplémentaire** (sur les 5% d'Eventy, ou en plus — à définir) |
| **Prix pour le voyageur** | Prix public du prestataire (pas de surcoût) |
| **Paiement prestataire** | 95% versé sous 7 jours après réalisation de l'activité |
| **Minimum de paiement** | Pas de minimum — on paie dès le 1er euro |
| **Facturation** | Auto-générée par Eventy (facture de commission) |

### 2.6 — Types d'activités visés

| Catégorie | Exemples | Potentiel |
|---|---|---|
| **Parcs à thèmes** | Eurodisney, Astérix, Futuroscope, PortAventura | ⭐⭐⭐⭐⭐ Volume |
| **Parcs aquatiques** | Aqualand, Marineland, Aquaboulevard | ⭐⭐⭐⭐ Saisonnier |
| **Musées & culture** | Louvre, Alhambra, Sagrada Familia, musées locaux | ⭐⭐⭐⭐ Toute l'année |
| **Excursions locales** | Quad, bateau, randonnée, safari | ⭐⭐⭐⭐⭐ Marge élevée |
| **Gastronomie** | Dégustations, cours de cuisine, food tours | ⭐⭐⭐⭐ Expérience |
| **Bien-être** | Spa, hammam, thalasso | ⭐⭐⭐ Premium |
| **Sport & aventure** | Jet ski, parapente, escalade, plongée | ⭐⭐⭐⭐ Wow effect |
| **Spectacles** | Flamenco, cabaret, concerts | ⭐⭐⭐ Soirée |
| **Shopping** | Outlets, souks guidés, artisans | ⭐⭐⭐ Commission shopping |
| **Transferts & VIP** | Chauffeur privé, yacht, hélicoptère | ⭐⭐ Premium |

### 2.7 — Backend Marketplace Activités

**Nouveau module** : `activity-marketplace`

```
/backend/src/modules/activity-marketplace/
├── activity-marketplace.module.ts
├── activity-marketplace.controller.ts      # Endpoints publics
├── activity-provider.service.ts            # CRUD prestataires
├── activity-catalog.service.ts             # CRUD catalogue activités
├── activity-booking.service.ts             # Réservation + paiement
├── activity-commission.service.ts          # Calcul + versement commissions
├── activity-review.service.ts              # Avis voyageurs
├── dto/
│   ├── create-activity-provider.dto.ts
│   ├── create-activity.dto.ts
│   ├── book-activity.dto.ts
│   └── activity-review.dto.ts
```

**Nouveaux modèles Prisma** :

```prisma
model ActivityProvider {
  id              String   @id @default(cuid())
  companyName     String
  siret           String?  @unique
  contactEmail    String
  contactPhone    String?
  description     String?  @db.Text
  logo            String?
  website         String?
  zone            String?              // "Marrakech", "Barcelone", etc.
  category        ActivityCategory     // THEME_PARK, MUSEUM, EXCURSION, etc.
  status          ProviderStatus       // PENDING, ACTIVE, SUSPENDED
  commissionRate  Int      @default(500) // 5% en basis points
  stripeAccountId String?              // Pour Stripe Connect
  createdAt       DateTime @default(now())

  activities      ActivityCatalogItem[]
  bookings        ActivityBooking[]
}

model ActivityCatalogItem {
  id              String   @id @default(cuid())
  providerId      String
  title           String
  description     String?  @db.Text
  category        ActivityCategory
  photos          String[] // URLs
  priceCents      Int                  // Prix par personne en centimes
  groupPriceCents Int?                 // Prix groupe (si différent)
  minPax          Int      @default(1)
  maxPax          Int      @default(53)
  duration        String?              // "2h", "journée", "3h"
  location        String?
  available       Boolean  @default(true)
  availableDays   String[] // ["MON","TUE","WED","THU","FRI","SAT","SUN"]
  seasonStart     DateTime?
  seasonEnd       DateTime?
  rating          Float?   @default(0)
  reviewCount     Int      @default(0)
  createdAt       DateTime @default(now())

  provider        ActivityProvider @relation(...)
  bookings        ActivityBooking[]
}

model ActivityBooking {
  id              String   @id @default(cuid())
  activityId      String
  providerId      String
  travelId        String?              // Si lié à un voyage Eventy
  bookedBy        String               // userId du pro ou client
  bookedByType    BookerType           // PRO, CLIENT
  paxCount        Int
  totalCents      Int                  // Prix total TTC
  commissionCents Int                  // 5% pour Eventy
  proCommCents    Int      @default(0) // Commission pro (si applicable)
  status          BookingStatus        // PENDING, CONFIRMED, COMPLETED, CANCELLED
  activityDate    DateTime
  notes           String?
  createdAt       DateTime @default(now())

  activity        ActivityCatalogItem @relation(...)
  provider        ActivityProvider @relation(...)
}
```

---

## AXE 3 : Portail HRA comme canal de vente

> **Les hôtels et restos du HRA deviennent aussi des "vendeurs"**

### 3.1 — Hôtels qui vendent des séjours Eventy

| Fonctionnalité | Description |
|---|---|
| **Widget sur leur site** | L'hôtel intègre un widget Eventy sur son propre site web → affiche les voyages qui passent par cet hôtel → les visiteurs réservent → **commission 3%** |
| **Affiche dans le lobby** | QR code Eventy dans les halls d'hôtels partenaires → "Voyagez en groupe avec Eventy" |
| **Lien tracké hôtel** | Chaque hôtel partenaire a un lien de parrainage → 3% commission sur les réservations |
| **Cross-sell** | Quand un client réserve un voyage, proposer automatiquement les activités disponibles à destination |

### 3.2 — Restaurants qui ramènent du monde

| Fonctionnalité | Description |
|---|---|
| **Widget sur leur site** | Le restaurant intègre un widget Eventy sur son site → affiche les voyages avec repas chez eux → **commission 2%** |
| **Programme ambassadeur resto** | Le resto met une affiche/QR → 2% commission sur les voyageurs référés |
| **Carte de visite Eventy** | Sur chaque table des restos partenaires, un support avec QR code |

> **Principe clé** : Tout partenaire HRA (hôtel, restaurant) peut devenir un canal de vente Eventy en intégrant un widget sur son site. Même mécanisme que le widget pro — copier-coller 1 ligne de code, commission automatique.

---

## Priorités d'implémentation

### Phase 1 — Quick Wins (Semaines 1-2)
> Impact immédiat, peu de développement

| # | Tâche | Impact | Effort |
|---|---|---|---|
| 1 | **Partage 1-clic WhatsApp/réseaux** sur chaque voyage dans `/pro/vendre` | 🔥🔥🔥 | ⚡ Facile |
| 2 | **Devis rapide PDF** — Générer un devis en 30 secondes | 🔥🔥🔥 | ⚡ Moyen |
| 3 | **Lien de paiement Stripe** — Le pro envoie un lien, le client paie | 🔥🔥🔥 | ⚡ Moyen |
| 4 | **Mini-landing `/v/{code}`** — Page ultra-rapide pour partager | 🔥🔥 | ⚡ Facile |
| 5 | **Améliorer Quick Sell** — Multi-voyages + compteur places | 🔥🔥 | ⚡ Facile |

### Phase 2 — Vente Assistée (Semaines 3-4)
> Le pro peut vendre par téléphone et en personne

| # | Tâche | Impact | Effort |
|---|---|---|---|
| 6 | **Page réservation assistée** `/pro/vendre/reservation-assistee` | 🔥🔥🔥🔥 | ⚡⚡ Moyen |
| 7 | **Backend assisted-booking** — Créer résa pour un tiers | 🔥🔥🔥🔥 | ⚡⚡ Moyen |
| 8 | **Dashboard ventes unifié** — Toutes les sources agrégées | 🔥🔥🔥 | ⚡⚡ Moyen |
| 9 | **Notifications vente en temps réel** | 🔥🔥 | ⚡ Facile |

### Phase 3 — Widget & Embed (Semaines 5-6)
> Le pro intègre Eventy sur son propre site

| # | Tâche | Impact | Effort |
|---|---|---|---|
| 10 | **Widget iframe** — Module réservation embarquable | 🔥🔥🔥 | ⚡⚡ Moyen |
| 11 | **Widget JS** — Script personnalisable | 🔥🔥🔥 | ⚡⚡ Moyen |
| 12 | **Configurateur widget** `/pro/vendre/widget` | 🔥🔥 | ⚡ Facile |

### Phase 4 — Marketplace Activités (Semaines 7-12) 🚀
> L'innovation majeure

| # | Tâche | Impact | Effort |
|---|---|---|---|
| 13 | **Modèles Prisma** — ActivityProvider, CatalogItem, Booking | 🔥🔥🔥🔥🔥 | ⚡⚡ Moyen |
| 14 | **Backend activity-marketplace** — Module complet | 🔥🔥🔥🔥🔥 | ⚡⚡⚡ Élevé |
| 15 | **Portail prestataire activités** — 8 pages front | 🔥🔥🔥🔥🔥 | ⚡⚡⚡ Élevé |
| 16 | **Intégration Pro** — Catalogue + réservation pour le groupe | 🔥🔥🔥🔥 | ⚡⚡ Moyen |
| 17 | **Intégration Client** — Voir/réserver activités pendant le voyage | 🔥🔥🔥🔥 | ⚡⚡ Moyen |
| 18 | **Stripe Connect** — Paiement split (95% prestataire / 5% Eventy) | 🔥🔥🔥🔥🔥 | ⚡⚡⚡ Élevé |
| 19 | **Système d'avis** — Les voyageurs notent les activités | 🔥🔥🔥 | ⚡⚡ Moyen |

### Phase 5 — HRA comme canal de vente (Semaines 13-14)
> Cross-sell et programmes ambassadeurs

| # | Tâche | Impact | Effort |
|---|---|---|---|
| 20 | **Liens traçables hôtels/restos partenaires** | 🔥🔥 | ⚡ Facile |
| 21 | **Commission tracking pour HRA** | 🔥🔥 | ⚡⚡ Moyen |
| 22 | **Cross-sell activités dans le checkout client** | 🔥🔥🔥 | ⚡⚡ Moyen |

---

## Estimation de revenus supplémentaires

### Marketplace Activités (Y1)

| Hypothèse | Calcul |
|---|---|
| 27 voyages Y1 × 53 voyageurs = 1 431 voyageurs | Base |
| 60% réservent au moins 1 activité = **859 voyageurs** | Conservateur |
| Panier moyen activité = **45€** par personne | Mix parcs + excursions |
| CA activités brut = 859 × 45€ = **38 655€** | Volume |
| **Commission Eventy 5% = 1 933€** | Revenu net Y1 |

**Y2 avec scaling** (4 bus, 100+ voyages) :
- 5 300 voyageurs × 60% × 45€ × 5% = **~7 155€** de commission activités
- **+ valeur ajoutée immense** : les voyageurs réservent chez Eventy PARCE qu'on propose des activités uniques

### Vente assistée + Widget (Y1)

| Canal | Réservations supplémentaires estimées |
|---|---|
| Vente assistée (téléphone/salon) | +15% de réservations |
| Widget sur sites partenaires | +8% de réservations |
| Partage réseaux sociaux amélioré | +5% de réservations |
| **Total** | **+28% de réservations potentielles** |

Sur un CA Y1 de 500 000€ → **+140 000€ de CA potentiel**

---

## Architecture cible — Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    EVENTY PLATFORM                       │
├────────────┬────────────┬──────────┬───────────────────┤
│  PORTAIL   │  PORTAIL   │ PORTAIL  │   PORTAIL         │
│  CLIENT    │  PRO       │ ADMIN    │   ACTIVITÉS       │
│  (54 p.)   │  (50+ p.)  │ (45 p.)  │   (8 p.) ← NEW   │
├────────────┴────────────┴──────────┴───────────────────┤
│                                                         │
│  CANAUX DE VENTE PRO                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Quick    │ │ Vente    │ │ Widget   │ │ Réseaux  │  │
│  │ Sell     │ │ Assistée │ │ Embed    │ │ Sociaux  │  │
│  │ (existe) │ │ (NEW)    │ │ (NEW)    │ │ (amélio) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Devis    │ │ Lien de  │ │ Mini-    │ │ QR       │  │
│  │ Rapide   │ │ Paiement │ │ Landing  │ │ Print    │  │
│  │ (NEW)    │ │ (NEW)    │ │ (NEW)    │ │ (existe) │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  MARKETPLACE ACTIVITÉS ← INNOVATION                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Prestataires → Catalogue → Réservation → 5% com  │  │
│  │ (Eurodisney, parcs, musées, excursions, spa...)  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  HRA CROSS-SELL                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Hôtels/Restos → Liens traçables → Commission     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Prochaines étapes immédiates

1. **Valider ce plan** avec David
2. **Phase 1** : Commencer par les Quick Wins (partage 1-clic, devis, lien paiement)
3. **Contacter les premiers prestataires activités** pour valider l'intérêt du modèle 5%
4. **Définir le modèle juridique** de la commission activités (contrat type)
5. **Préparer le pitch** de la Marketplace Activités pour les investisseurs

---

> *"Le pro Eventy ne vend pas des voyages — il offre des expériences. Et maintenant, il a TOUS les outils pour le faire."*
