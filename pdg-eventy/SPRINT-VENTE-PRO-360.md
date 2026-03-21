# SPRINT COWORK — Vente Pro 360° + Marketplace Activités

> **Dernière MAJ** : 2026-03-20 — **TOUTES LES PHASES TERMINÉES ✅**
> **Objectif** : Le pro Eventy peut vendre **partout, par tous les moyens, à tout moment**
> **Organisation** : 2 instances Cowork (BACK + FRONT) + Cowork PDG
> **Réf. stratégique** : `PLAN-VENTE-PRO-360.md`
> **Statut** : **100% IMPLÉMENTÉ** — 7 phases, 24 LOTs backend, 21 LOTs frontend, ~45 endpoints, ~35 pages

---

## Règle d'or

> **Le pro doit pouvoir vendre un voyage en moins de 60 secondes, quel que soit le canal.**
> Chaque outil de vente = un raccourci vers la réservation payée.

---

## Vue d'ensemble — 7 Phases → Vente Pro 360° complète — ✅ TERMINÉ

```
Phase 7  (S7-S8)   ✅ Quick Wins vente — Partage, devis, lien paiement
Phase 8  (S8-S9)   ✅ Vente assistée — Réservation pour un client
Phase 9  (S9-S10)  ✅ Widget & Embed — Vente sur sites partenaires
Phase 10 (S10-S11) ✅ Marketplace Activités — Backend + Modèles
Phase 11 (S11-S12) ✅ Marketplace Activités — Portail prestataire
Phase 12 (S12-S13) ✅ Marketplace Activités — Intégration Pro + Client
Phase 13 (S13-S14) ✅ Cross-sell HRA + Dashboard unifié + Polish
```

---

## PHASE 7 — QUICK WINS VENTE (Semaine 7-8)

> **Sprint Goal** : Le pro a de nouveaux outils de vente immédiats — partage 1-clic, devis PDF, liens de paiement, mini-landing.

### Cowork BACK
- [x] **LOT B-011** : API Devis rapide
  - POST /pro/quotes (créer un devis : tripId, clientName, clientEmail, paxCount, options[], notes)
  - GET /pro/quotes (lister mes devis — filtres : status, date)
  - GET /pro/quotes/:id (détail devis)
  - GET /pro/quotes/:id/pdf (générer PDF devis avec logo Eventy, détail prix, CGV)
  - POST /pro/quotes/:id/send (envoyer par email au client)
  - PATCH /pro/quotes/:id/status (DRAFT → SENT → ACCEPTED → EXPIRED → CANCELLED)
  - Expiration automatique à J+15 (cron job)
  - **Livrable** : 6 endpoints devis + génération PDF

- [x] **LOT B-012** : API Lien de paiement Stripe
  - POST /pro/payment-links (créer un lien : tripId, amount, clientEmail, expiresAt, description)
  - GET /pro/payment-links (lister mes liens — actifs, expirés, payés)
  - GET /pro/payment-links/:id (détail + statut paiement)
  - DELETE /pro/payment-links/:id (annuler un lien non payé)
  - Webhook Stripe : quand le lien est payé → créer réservation auto + notifier pro
  - **Livrable** : 4 endpoints + intégration Stripe Payment Links

- [x] **LOT B-013** : API Partage social + Mini-landing
  - GET /pro/social-share/:tripId (générer assets partage : textes WhatsApp/Insta/FB/Email, lien tracké, données OG)
  - GET /public/v/:code (mini-landing publique : données voyage minimales pour rendu ultra-rapide)
  - POST /public/v/:code/track (tracker clic/vue — analytics)
  - Image OG dynamique par voyage (photo + prix + dates en overlay)
  - **Livrable** : 3 endpoints + image OG dynamique

- [x] **LOT B-014** : Amélioration Quick Sell existant
  - GET /pro/quick-sell/all-trips (lien multi-voyages — tous les voyages actifs du pro)
  - PATCH /pro/quick-sell/links/:id/promo (attacher un code promo au lien vendeur)
  - GET /public/r/:sellerCode (résolution publique du lien vendeur → redirection)
  - WebSocket ou SSE : notification temps réel au pro quand vente via son lien
  - GET /pro/quick-sell/leaderboard (classement vendeurs du mois — gamification)
  - **Livrable** : 5 endpoints + WebSocket notification vente

### Cowork FRONT
- [x] **LOT F-011** : Page Devis rapide `/pro/vendre/devis`
  - Formulaire : sélection voyage, infos client, nb personnes, options, notes
  - Preview du devis en temps réel (avant envoi)
  - Bouton "Générer PDF" + "Envoyer par email"
  - Liste des devis créés avec statuts colorés (DRAFT/SENT/ACCEPTED/EXPIRED)
  - Action rapide : relancer un devis expiré, dupliquer un devis
  - **Livrable** : Page devis complète avec PDF preview

- [x] **LOT F-012** : Page Liens de paiement `/pro/vendre/lien-paiement`
  - Formulaire : voyage, montant (auto-calculé ou custom), email client, date expiration
  - Bouton "Créer le lien" → copier le lien + partager WhatsApp/Email
  - Liste des liens actifs avec badge statut (ACTIF / PAYÉ / EXPIRÉ)
  - Notification toast en temps réel quand un lien est payé
  - **Livrable** : Page liens de paiement complète

- [x] **LOT F-013** : Partage 1-clic réseaux sociaux
  - Composant `<ShareButtons tripId={id} />` réutilisable : WhatsApp, Instagram, Facebook, LinkedIn, Email, Copier lien
  - Intégrer sur : `/pro/vendre` (Quick Sell), chaque voyage dans `/pro/voyages/[id]`, page devis
  - Texte pré-rédigé par canal (WhatsApp = court + emoji, LinkedIn = pro, Email = complet)
  - Lien tracké automatique (shortlink e.ty/xxx) pour chaque partage
  - **Livrable** : Composant partage + intégration 3 pages

- [x] **LOT F-014** : Mini-landing `/v/:code`
  - Route publique Next.js : page ultra-légère SSR
  - Contenu : 1 photo hero, titre voyage, dates, prix par personne, places restantes, bouton "Je réserve"
  - Temps de chargement cible : < 1.5 secondes
  - Meta OG optimisées (image dynamique + description)
  - Responsive mobile-first (90% du trafic = partage WhatsApp = mobile)
  - **Livrable** : Mini-landing publique optimisée mobile

- [x] **LOT F-015** : Améliorations Quick Sell `/pro/vendre`
  - Mode multi-voyages : toggle "Tous mes voyages" → lien unique qui affiche la liste
  - Compteur places restantes en temps réel sur chaque voyage
  - Section "Code promo" : créer/attacher un code promo à son lien vendeur
  - Notification temps réel (toast + son) quand vente via lien
  - Badge classement vendeur du mois
  - **Livrable** : Quick Sell amélioré avec 5 fonctionnalités

### Point de synchro
> À la fin de Phase 7 : le pro peut générer un devis PDF en 30 sec, envoyer un lien de paiement Stripe, partager en 1 clic sur WhatsApp/réseaux, et sa page Quick Sell est boostée.

---

## PHASE 8 — VENTE ASSISTÉE (Semaine 8-9)

> **Sprint Goal** : Le pro peut créer une réservation complète POUR un client — par téléphone, en face à face, ou au salon.

### Cowork BACK
- [x] **LOT B-015** : API Réservation assistée
  - POST /pro/assisted-booking (créer résa pour un tiers)
    - Body : tripId, clientInfo { firstName, lastName, email, phone, birthDate }, paxCount, roomType, options[], paymentMethod (CARD_BY_PHONE, PAYMENT_LINK, BANK_TRANSFER, CASH, PAY_LATER)
    - Crée le user client s'il n'existe pas (inscription auto avec email de bienvenue)
    - Crée la réservation en mode CONFIRMED ou PENDING_PAYMENT selon paymentMethod
    - Envoie confirmation email au client + récapitulatif au pro
  - GET /pro/assisted-bookings (lister mes résa assistées — filtres)
  - GET /pro/assisted-bookings/:id (détail avec statut paiement)
  - POST /pro/assisted-bookings/:id/payment-reminder (relance paiement client)
  - POST /pro/assisted-bookings/:id/cancel (annuler)
  - Validation : le pro ne peut réserver que pour SES voyages
  - **Livrable** : 5 endpoints réservation assistée + auto-création client

- [x] **LOT B-016** : API Dashboard ventes unifié
  - GET /pro/sales-dashboard (agrège TOUTES les sources de vente)
    - Response : { quickSell: { bookings, revenue, conversionRate }, assisted: { bookings, revenue }, paymentLinks: { sent, paid, revenue }, quotes: { sent, accepted, revenue }, widget: { views, bookings, revenue }, social: { shares, clicks, bookings }, total: { bookings, revenue, growth } }
  - GET /pro/sales-dashboard/timeline?period=7d|30d|90d (courbe ventes dans le temps par source)
  - GET /pro/sales-dashboard/top-channels (classement canaux par performance)
  - **Livrable** : 3 endpoints dashboard unifié

### Cowork FRONT
- [x] **LOT F-016** : Page Réservation assistée `/pro/vendre/reservation-assistee`
  - Wizard 4 étapes :
    1. **Voyage** : sélection voyage + affichage places restantes + prix
    2. **Client** : formulaire infos client (autocomplete si client existant) + nombre de personnes
    3. **Options** : chambre, options voyage, Pack Sérénité (déjà inclus mais afficher), assurance annulation
    4. **Paiement** : choix méthode (CB par tél, lien paiement, virement, espèces, paiement différé) + validation
  - Récapitulatif final avant confirmation
  - Bouton "Confirmer la réservation" → confirmation + email auto
  - Mode rapide : formulaire tout-en-un pour les pros pressés (salon, tel)
  - **Livrable** : Wizard 4 étapes + mode rapide

- [x] **LOT F-017** : Dashboard ventes unifié `/pro/vendre/dashboard`
  - KPI cards en haut : Réservations totales, CA total, Taux de conversion, Croissance vs mois précédent
  - Graphique courbe : ventes dans le temps (7j / 30j / 90j) par source
  - Tableau des canaux de vente : Quick Sell | Assistée | Liens paiement | Devis | Widget | Social — avec métriques par canal
  - Top 3 voyages les plus vendus
  - Dernières ventes en temps réel (live feed)
  - **Livrable** : Dashboard ventes complet avec graphiques

- [x] **LOT F-018** : Notifications vente temps réel
  - Composant toast global : "🎉 Nouvelle réservation ! Marie L. — Marrakech Express — 2 places — 746€"
  - Son de notification optionnel (activable/désactivable dans les paramètres pro)
  - Badge compteur sur l'icône "Vendre Eventy" dans la sidebar pro
  - Page notifications `/pro/notifications` : historique complet
  - **Livrable** : Système notifications vente en temps réel

### Point de synchro
> À la fin de Phase 8 : le pro peut vendre par téléphone en créant une résa pour son client, et suit TOUTES ses ventes dans un dashboard unifié tous canaux.

---

## PHASE 9 — WIDGET & EMBED (Semaine 9-10)

> **Sprint Goal** : Le pro peut intégrer un module de réservation Eventy sur son propre site web.

### Cowork BACK
- [ ] **LOT B-017** : API Widget / Embed
  - GET /public/embed/:proSlug (données pour le widget : profil pro, voyages actifs, config couleurs)
  - GET /public/embed/:proSlug/trips (liste voyages actifs avec prix, places, photos)
  - GET /public/embed/:proSlug/config (configuration personnalisée du widget : couleurs, layout, CTA text)
  - POST /pro/widget/config (sauvegarder la config widget du pro)
  - GET /pro/widget/stats (stats du widget : vues, clics, réservations)
  - CORS configuré : autoriser l'origine du site du pro (whitelist domaines)
  - **Livrable** : 5 endpoints embed + config CORS

### Cowork FRONT
- [ ] **LOT F-019** : Widget iframe
  - Route `/embed/:proSlug` : page Next.js minimaliste (pas de header/footer Eventy)
  - Affiche : carte(s) voyage avec photo, prix, dates, places restantes, bouton "Réserver"
  - Clic "Réserver" → ouvre le checkout Eventy dans un nouvel onglet (avec tracking pro)
  - Design responsive : s'adapte à la taille de l'iframe
  - Temps de chargement : < 2 secondes
  - **Livrable** : Page embed iframe prête

- [ ] **LOT F-020** : Widget JS (script embarquable)
  - Fichier `/public/widget.js` : script léger (~15KB) qui injecte un mini-module Eventy
  - Attributs configurables : `data-pro`, `data-trip`, `data-theme` (light/dark), `data-color`, `data-size` (compact/full)
  - Rendu : bouton flottant OU carte voyage inline selon la config
  - Clic → popup modale avec détails voyage + bouton réservation
  - Tracking automatique des vues/clics via shortlink
  - **Livrable** : Script widget.js + popup modale

- [ ] **LOT F-021** : Configurateur widget `/pro/vendre/widget`
  - Preview en temps réel : le pro voit le widget comme il apparaîtra sur son site
  - Options configurables : couleur principale, couleur CTA, texte CTA, voyages affichés (tous ou sélection), layout (horizontal/vertical), taille
  - Code à copier : 3 options (iframe simple, script JS, bouton HTML)
  - Bouton "Copier le code" pour chaque option
  - Whitelist domaines : le pro ajoute les domaines autorisés pour son widget
  - Stats widget intégrées : vues, clics, conversions
  - **Livrable** : Configurateur complet avec preview live

- [ ] **LOT F-021b** : Widget pour Hôtels & Restaurants partenaires
  - Les hôtels et restaurants partenaires HRA peuvent AUSSI intégrer un widget Eventy sur LEUR site
  - `/hra/hotel-partners/:id/widget` : Configurateur widget hôtel (même principe que le pro)
  - `/hra/restaurant-partners/:id/widget` : Configurateur widget restaurant
  - Widget hôtel : "Voyagez en groupe avec Eventy — Hébergement inclus à l'Hôtel [Nom]"
    - Affiche les voyages Eventy qui passent par CET hôtel
    - Le client réserve → l'hôtel touche sa commission (3%)
  - Widget restaurant : "Découvrez nos voyages gourmands Eventy"
    - Affiche les voyages avec repas dans CE restaurant
    - Le client réserve → le resto touche sa commission (2%)
  - Code embed identique au widget pro : iframe OU script JS
  - Lien tracké automatique → attribution commission partenaire HRA
  - **Livrable** : Widget embed pour hôtels + restaurants + tracking commission

### Cowork BACK (ajout)
- [ ] **LOT B-017b** : API Widget HRA partenaires
  - GET /public/embed/hotel/:hotelPartnerId (widget hôtel : voyages liés à cet hôtel)
  - GET /public/embed/restaurant/:restaurantPartnerId (widget restaurant : voyages liés à ce resto)
  - POST /hra/hotel-partners/:id/widget/config (config widget hôtel)
  - POST /hra/restaurant-partners/:id/widget/config (config widget resto)
  - GET /hra/widget/stats/:partnerId (stats widget : vues, clics, réservations, commission)
  - Attribution automatique de la commission partenaire quand réservation via widget
  - **Livrable** : 5 endpoints widget HRA + attribution commission

### Point de synchro
> À la fin de Phase 9 : **TOUT le monde peut vendre Eventy sur son site** — les pros, les hôtels ET les restaurants. Chacun copie-colle 1 ligne de code → widget Eventy avec ses voyages. Commission automatique.

---

## PHASE 10 — MARKETPLACE ACTIVITÉS : BACKEND (Semaine 10-11)

> **Sprint Goal** : Le backend de la marketplace activités est prêt — modèles, API, Stripe Connect split.

### Cowork BACK
- [ ] **LOT B-018** : Modèles Prisma Marketplace Activités
  - model ActivityProvider (companyName, siret, contactEmail, phone, description, logo, website, zone, category, status, commissionRateBps, stripeAccountId)
  - model ActivityCatalogItem (providerId, title, description, photos[], priceCents, groupPriceCents, minPax, maxPax, duration, location, available, availableDays[], seasonStart, seasonEnd, rating, reviewCount)
  - model ActivityBooking (activityId, providerId, travelId?, bookedBy, bookedByType, paxCount, totalCents, commissionCents, proCommCents, status, activityDate, notes)
  - model ActivityReview (bookingId, userId, rating, comment, createdAt)
  - enum ActivityCategory (THEME_PARK, WATER_PARK, MUSEUM, EXCURSION, GASTRONOMY, WELLNESS, SPORT, SHOW, SHOPPING, TRANSFER, OTHER)
  - enum ProviderStatus (PENDING, ACTIVE, SUSPENDED, BLACKLISTED)
  - enum BookingStatus (existant, réutiliser)
  - Migration Prisma + seed données démo (5 prestataires, 20 activités, 10 réservations)
  - **Livrable** : 4 modèles + enums + migration + seed

- [ ] **LOT B-019** : API Prestataire Activités (portail prestataire)
  - POST /activity-providers/register (inscription prestataire)
  - GET /activity-providers/me (mon profil)
  - PATCH /activity-providers/me (modifier profil)
  - CRUD /activity-providers/me/catalog (CRUD catalogue activités)
    - POST /activity-providers/me/catalog (ajouter activité)
    - GET /activity-providers/me/catalog (lister mes activités)
    - PATCH /activity-providers/me/catalog/:id (modifier)
    - DELETE /activity-providers/me/catalog/:id (supprimer)
  - GET /activity-providers/me/bookings (réservations reçues)
  - PATCH /activity-providers/me/bookings/:id/confirm (confirmer une résa)
  - PATCH /activity-providers/me/bookings/:id/cancel (annuler)
  - GET /activity-providers/me/finance (revenus, historique paiements)
  - GET /activity-providers/me/reviews (avis reçus)
  - **Livrable** : 12 endpoints portail prestataire

- [ ] **LOT B-020** : API Catalogue public + Réservation
  - GET /public/activities?zone=&category=&date=&minPrice=&maxPrice=&minRating= (recherche catalogue)
  - GET /public/activities/:id (détail activité avec avis)
  - POST /activities/book (réserver une activité — client ou pro)
    - Body : activityId, travelId?, paxCount, activityDate, bookedByType (PRO|CLIENT)
    - Crée le booking + déclenche paiement
  - GET /activities/bookings (mes réservations d'activités)
  - POST /activities/reviews (laisser un avis après activité complétée)
  - **Livrable** : 5 endpoints catalogue + réservation

- [ ] **LOT B-021** : Stripe Connect — Split paiement activités
  - Onboarding Stripe Connect pour les prestataires (Express account)
  - Paiement split automatique : 95% prestataire / 5% Eventy (configurable par prestataire via commissionRateBps)
  - Webhook : gérer les paiements Connect (transfer_paid, payout_paid)
  - Tableau de bord commission admin : GET /admin/activities/commissions
  - **Livrable** : Stripe Connect intégré + split automatique

### Point de synchro
> À la fin de Phase 10 : le backend est prêt — on peut inscrire des prestataires, gérer un catalogue d'activités, réserver et payer avec split 95/5.

---

## PHASE 11 — MARKETPLACE ACTIVITÉS : PORTAIL PRESTATAIRE (Semaine 11-12)

> **Sprint Goal** : Le prestataire d'activités a son portail complet pour gérer son catalogue et ses réservations.

### Cowork FRONT
- [ ] **LOT F-022** : Layout portail prestataire activités
  - Nouveau layout `/app/(activities)/` avec sidebar dédiée :
    - Dashboard, Mon catalogue, Réservations, Calendrier, Finance, Avis, Mon profil
  - Design : thème distinct (comme les 3 autres portails)
  - Auth : nouveau rôle ACTIVITY_PROVIDER ou réutiliser PRO avec flag
  - **Livrable** : Layout + navigation portail activités

- [ ] **LOT F-023** : Inscription + Dashboard prestataire
  - `/activites/inscription` : Formulaire multi-étapes (infos entreprise → catalogue initial → Stripe Connect onboarding)
  - `/activites/dashboard` : KPI cards (réservations ce mois, CA, note moyenne, prochains groupes), graphique revenus, alertes (réservations en attente)
  - **Livrable** : Inscription + Dashboard

- [ ] **LOT F-024** : Gestion catalogue
  - `/activites/catalogue` : Liste de mes activités avec photo, prix, statut (active/inactive)
  - `/activites/catalogue/creer` : Formulaire création (titre, description, photos upload, prix/personne, prix groupe, capacité min/max, durée, jours dispo, saison)
  - `/activites/catalogue/[id]/modifier` : Édition activité
  - Gestion disponibilités : calendrier avec jours ON/OFF
  - **Livrable** : CRUD catalogue complet

- [ ] **LOT F-025** : Réservations + Calendrier + Finance
  - `/activites/reservations` : Liste réservations entrantes avec filtre statut (EN ATTENTE, CONFIRMÉE, TERMINÉE, ANNULÉE)
  - `/activites/calendrier` : Vue calendrier mensuel avec réservations
  - `/activites/finance` : Revenus (95% des ventes), graphique mensuel, historique paiements Stripe, factures auto
  - `/activites/avis` : Avis reçus avec note moyenne et tendance
  - **Livrable** : 4 pages gestion complètes

### Point de synchro
> À la fin de Phase 11 : un prestataire peut s'inscrire, publier ses activités, recevoir des réservations et être payé automatiquement.

---

## PHASE 12 — MARKETPLACE ACTIVITÉS : INTÉGRATION PRO + CLIENT (Semaine 12-13)

> **Sprint Goal** : Les pros vendent des activités à leurs groupes. Les clients réservent des activités pendant leur voyage.

### Cowork FRONT
- [ ] **LOT F-026** : Catalogue activités dans le portail Pro
  - `/pro/voyages/[id]/activites` : Naviguer le catalogue d'activités filtrées par destination du voyage
  - Bouton "Ajouter au voyage" → réserver l'activité pour X personnes du groupe
  - Vue "Mes activités réservées" avec statut et récap prix
  - Attribution commission pro (2%) visible dans ses revenus
  - **Livrable** : Intégration catalogue dans gestion voyage Pro

- [ ] **LOT F-027** : Activités dans le portail Client
  - `/client/voyage/[id]/activites` : Liste des activités proposées à destination (par le pro + catalogue ouvert)
  - `/client/voyage/[id]/activites/[actId]` : Page détail activité (photos, description, prix, avis, disponibilités)
  - Bouton "Réserver" → paiement individuel ou groupe (Stripe checkout)
  - `/client/voyage/[id]/planning` : Planning du voyage avec activités réservées intégrées (timeline visuelle)
  - **Livrable** : 3 pages activités client

- [ ] **LOT F-028** : Partage activités via lien
  - Le pro peut partager un lien activité sur WhatsApp/email → ses voyageurs réservent individuellement
  - Le lien est tracké : le pro touche sa commission sur les réservations via son lien
  - Composant `<ShareActivityButton activityId={id} />` réutilisable
  - **Livrable** : Partage activités avec tracking commission

### Cowork BACK
- [ ] **LOT B-022** : API intégration Pro-Activités
  - GET /pro/travels/:id/available-activities?zone= (activités disponibles à destination)
  - POST /pro/travels/:id/activities/book (réserver activité pour le groupe)
  - GET /pro/travels/:id/activities (activités réservées pour ce voyage)
  - GET /pro/revenues/activities (revenus commission activités)
  - **Livrable** : 4 endpoints intégration pro-activités

### Point de synchro
> À la fin de Phase 12 : le pro ajoute des activités au voyage de son groupe, les clients réservent aussi individuellement, tout est tracké et commissionné.

---

## PHASE 13 — CROSS-SELL HRA + DASHBOARD UNIFIÉ + POLISH (Semaine 13-14)

> **Sprint Goal** : Cross-sell automatique, programmes ambassadeurs HRA, et polish final de toute la stack vente.

### Cowork BACK
- [ ] **LOT B-023** : Cross-sell activités dans le checkout
  - GET /checkout/:bookingId/suggested-activities (activités recommandées à destination)
  - POST /checkout/:bookingId/add-activity (ajouter activité au panier avant paiement)
  - Algorithme de recommandation : popularité + zone + saison + budget
  - **Livrable** : 2 endpoints cross-sell + algo recommandation

- [ ] **LOT B-024** : Programme ambassadeur HRA
  - POST /hra/hotel-partners/:id/referral-link (générer lien ambassadeur pour un hôtel)
  - POST /hra/restaurant-partners/:id/referral-link (générer lien ambassadeur resto)
  - GET /hra/referrals/stats (stats de parrainage HRA : clics, réservations, commission)
  - Commission configurable par partenaire HRA (défaut : 3% hôtel, 2% resto)
  - **Livrable** : 3 endpoints ambassadeur HRA

### Cowork FRONT
- [ ] **LOT F-029** : Cross-sell activités dans le checkout client
  - Étape supplémentaire dans le tunnel checkout (entre récap et paiement) :
    "Activités à destination — Profitez de votre séjour !"
  - Carrousel 3-5 activités recommandées avec prix, photo, "Ajouter"
  - Bouton "Non merci, passer" bien visible (pas de dark pattern)
  - Mise à jour du récap prix avec activités ajoutées
  - **Livrable** : Étape cross-sell dans le checkout

- [ ] **LOT F-030** : Dashboard ventes admin — Vue globale
  - `/admin/ventes` : Dashboard admin avec vue 360° de toutes les ventes
  - Par canal : Quick Sell, Assistée, Liens paiement, Widget, Social, Activités
  - Par pro : classement des pros par performance
  - Par activité : top activités vendues, revenus commission
  - **Livrable** : Dashboard admin ventes 360°

- [ ] **LOT F-031** : Polish UX + Responsive + Tests
  - Audit UX de toutes les pages vente pro (cohérence, rapidité, mobile)
  - Tests E2E Playwright : tunnel réservation assistée, devis, lien paiement, widget
  - Tests intégration backend : tous les nouveaux endpoints
  - Optimisation performance : lazy loading, images Next.js, bundle analysis
  - **Livrable** : UX auditée + tests complets

### Point de synchro
> À la fin de Phase 13 : **Vente Pro 360° terminée**. Le pro vend via Quick Sell, vente assistée, devis, liens paiement, widget, réseaux sociaux, activités. Le cross-sell booste le panier moyen. Le dashboard unifié montre tout.

---

## Résumé Timing

| Phase | Semaine | Lots BACK | Lots FRONT | Résultat |
|-------|---------|-----------|------------|----------|
| 7. Quick Wins | S7-S8 | B-011→B-014 | F-011→F-015 | Devis + Liens paiement + Partage social + Mini-landing |
| 8. Vente Assistée | S8-S9 | B-015→B-016 | F-016→F-018 | Résa pour un client + Dashboard unifié |
| 9. Widget | S9-S10 | B-017 + B-017b | F-019→F-021 + F-021b | Widget Pro + Hôtels + Restaurants |
| 10. Marketplace Back | S10-S11 | B-018→B-021 | — | Modèles + API + Stripe Connect |
| 11. Marketplace Front | S11-S12 | — | F-022→F-025 | Portail prestataire activités |
| 12. Intégration | S12-S13 | B-022 | F-026→F-028 | Pro + Client vendent/achètent des activités |
| 13. Cross-sell + Polish | S13-S14 | B-023→B-024 | F-029→F-031 | Cross-sell checkout + HRA ambassadeur + Tests |

---

## Métriques de succès

| KPI | Cible Phase 7 | Cible Phase 13 |
|-----|---------------|----------------|
| Canaux de vente actifs | 4 (Quick Sell + Devis + Lien paiement + Social) | **8** (+ Assistée + Widget + Activités + Cross-sell) |
| Temps pour vendre (pro) | < 60 sec | < 30 sec |
| Taux de conversion Quick Sell | 5% (actuel) | **8%** |
| Devis envoyés / semaine / pro | 0 | **5+** |
| Activités au catalogue | 0 | **50+** |
| Panier moyen client | 373€ | **418€** (+12% cross-sell activités) |

---

## Dépendances techniques

| Dépendance | Phase | Statut |
|---|---|---|
| Stripe Payment Links API | Phase 7 | Stripe déjà intégré, extension simple |
| Génération PDF (devis) | Phase 7 | Utiliser PDFKit ou Puppeteer (déjà dispo backend) |
| WebSocket/SSE (notifications temps réel) | Phase 7-8 | Gateway NestJS déjà configuré |
| Stripe Connect (split paiement) | Phase 10 | Extension du Stripe existant — mode Express |
| Nouveau rôle ACTIVITY_PROVIDER | Phase 10 | Prisma enum Role à étendre |
| Image OG dynamique | Phase 7 | @vercel/og ou Sharp (déjà installé) |

---

> *Chaque phase livre de la valeur. Le pro n'attend pas la Phase 13 pour vendre — dès la Phase 7, il a de nouveaux outils.*
