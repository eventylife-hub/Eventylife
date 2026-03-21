# Plan Stratégique & Technique — Réservation, Transport & Suivi

> **Date** : 20 mars 2026
> **Auteur** : David (PDG) + Assistant IA
> **Statut** : Plan validé — à implémenter par phases
> **Périmètre** : Réservation avion/bus, gestion clients transport, suivi indépendants, rôle employés, future app mobile

---

## Résumé exécutif

Ce plan couvre **7 grands chantiers** pour amener Eventy au niveau opérationnel complet :

1. **Réservation transport unifiée** — Avion + Bus dans un seul parcours client
2. **Gestion des places & sièges** — Attribution, capacité temps réel, manifestes
3. **Suivi temps réel du transport** — Statuts vols/bus, notifications, timeline voyage
4. **Suivi complet des indépendants** — Missions par voyage + performance globale
5. **Admin Terrain & Contrôle** — L'équipe admin Eventy supervise et contrôle les indépendants terrain, zéro blocage
6. **Carnet de Voyage enrichi** — Guide vivant rempli par le créateur, enrichi à chaque édition, héritage entre saisons
7. **Aide Locale & Urgences SOS** — Ressources locales géolocalisées + bouton SOS 1-tap avec GPS

L'app mobile viendra en **Phase 6** en 3 versions : Client (carnet + SOS + aide locale), Indépendant (terrain), Admin (contrôle).

---

## Ce qui existe déjà (acquis)

Le code est déjà très avancé. Voici ce qu'on a :

### Réservation & Transport
- ✅ **BookingGroup + RoomBooking** : système complet de réservation avec hold, paiement, lock
- ✅ **TravelBus** : multi-bus par voyage, capacité, véhicule, chauffeur, prestataire
- ✅ **BusSegment** : tronçons de route avec horaires et distances
- ✅ **BusStop** : points d'arrêt avec géolocalisation, validation admin, médias
- ✅ **BusPassengerAssignment** : attribution de sièges avec contrainte d'unicité
- ✅ **TravelerStopSelection** : choix du mode de départ (arrêt bus ou arrivée autonome)
- ✅ **QuoteRequest** : demandes de devis transport (BUS_ONLY, FLIGHT_ONLY, COMBINED)
- ✅ **FlightManagementService** : stubs pour gestion vols
- ✅ **MultiOrchestrationService** : répartition automatique passagers multi-bus
- ✅ **WebSocket notifications** : temps réel pour statut réservation/paiement

### Suivi Pro/Indépendants
- ✅ **ProProfile** : profil pro avec type INDEPENDANT, validation, onboarding
- ✅ **Revenue tracking** : CA, commissions, net, par voyage et par période
- ✅ **Quality Gate** : validation pré-publication (score 0-100, bloquant/non-bloquant)
- ✅ **ProFormation** : suivi des formations (onboarding, juridique, marketing...)
- ✅ **50 pages portail Pro** : dashboard, voyages, réservations, finance, messagerie

### Ce qui manque (les 5 chantiers)

---

## CHANTIER 1 — Réservation Transport Unifiée (Avion + Bus)

### Vision

Le client réserve son voyage et choisit son transport dans un seul flux :
- **Bus** → Choix de l'arrêt de départ, siège optionnel
- **Avion** → Sélection du vol (allotement), info bagages, transfert bus sur place
- **Combiné** → Vol aller + bus sur place + vol retour (ou bus aller + avion retour)

Le pro qui crée le voyage configure le transport en amont : bus, vols, segments, arrêts.

### Plan technique

#### 1.1 Nouveau modèle : FlightAllotment (Prisma)

```
model FlightAllotment {
  id                String   @id @default(cuid())
  travelId          String
  travel            Travel   @relation(fields: [travelId], references: [id])

  // Vol
  airline           String                    // "Transavia", "EasyJet"
  flightNumber      String                    // "TO4521"
  departureAirport  String                    // "CDG"
  arrivalAirport    String                    // "RAK"
  departureTime     DateTime
  arrivalTime       DateTime
  direction         FlightDirection           // OUTBOUND, RETURN

  // Allotement
  seatsAllocated    Int                       // 53, 106, 159
  seatsBooked       Int        @default(0)
  seatsHeld         Int        @default(0)
  pricePerSeatTTC   Int                       // centimes
  bookingReference  String?                   // ref TO/consolidateur

  // Prestataire
  providerId        String?
  provider          TransportProvider? @relation(...)
  providerQuoteRef  String?

  // Statut
  status            FlightAllotmentStatus     // DRAFT, CONFIRMED, CANCELED

  // Bagages
  luggageIncluded   String?                   // "23kg soute + 10kg cabine"

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  passengers        FlightPassengerAssignment[]
}

enum FlightDirection {
  OUTBOUND
  RETURN
}

enum FlightAllotmentStatus {
  DRAFT
  OPTION_HELD
  CONFIRMED
  WAITLIST
  CANCELED
}
```

#### 1.2 Nouveau modèle : FlightPassengerAssignment

```
model FlightPassengerAssignment {
  id                String   @id @default(cuid())
  flightAllotmentId String
  flightAllotment   FlightAllotment @relation(...)
  bookingGroupId    String
  userId            String

  // Infos passager (obligatoire pour avion)
  firstName         String
  lastName          String
  dateOfBirth       DateTime
  passportNumber    String?
  nationality       String?

  seatNumber        String?              // "12A" (optionnel, selon compagnie)
  boardingPassUrl   String?              // lien PDF carte d'embarquement

  status            PassengerFlightStatus // BOOKED, CHECKED_IN, BOARDED, NO_SHOW

  createdAt         DateTime @default(now())

  @@unique([flightAllotmentId, userId])
  @@unique([flightAllotmentId, seatNumber])
}

enum PassengerFlightStatus {
  BOOKED
  CHECKED_IN
  BOARDED
  NO_SHOW
  CANCELED
}
```

#### 1.3 Extension du checkout

Le checkout actuel (5 pages) doit intégrer une étape transport :

| Étape | Actuel | Nouveau |
|-------|--------|---------|
| 1 | Choix du voyage | Choix du voyage |
| 2 | Choix chambre/occupants | Choix chambre/occupants |
| 3 | **Choix arrêt bus** | **Choix transport : Bus OU Avion OU Combiné** |
| 4 | Récap + assurance | **Infos passagers avion** (si vol) |
| 5 | Paiement | Récap + assurance |
| 6 | — | **Paiement** |

**Logique métier :**
- Si le voyage = bus only → étape 3 = choix de l'arrêt (comme actuellement)
- Si le voyage = avion only → étape 3 = sélection vol + infos passagers
- Si combiné → étape 3 = vol + arrêt bus transfert sur place
- Les infos passagers avion (nom, date naissance, passeport) sont collectées avant paiement

#### 1.4 Pages pro — Configuration transport voyage

Enrichir la page `/pro/voyages/[id]/transport` :

- **Onglet Bus** (existe) : gestion bus, segments, arrêts
- **Onglet Avion** (nouveau) : ajout d'allotements, configuration vols aller/retour
- **Onglet Combiné** (nouveau) : vue d'ensemble bus + avion avec timeline
- **Onglet Manifeste** (enrichi) : manifeste unifié bus + avion, export PDF/Excel

---

## CHANTIER 2 — Gestion des Places & Sièges

### Vision

Chaque place (bus ou avion) est trackée en temps réel. Le pro et l'admin voient le remplissage live. Le client peut choisir son siège (optionnel).

### Plan technique

#### 2.1 Dashboard remplissage temps réel (Pro + Admin)

**Nouvelle page : `/pro/voyages/[id]/remplissage`**

```
┌──────────────────────────────────────────────────┐
│  Voyage : Marrakech 15-22 Avril 2026             │
│                                                    │
│  ┌─── BUS A (Paris) ───┐  ┌─── VOL TO4521 ───┐  │
│  │ 48/53 places ██████░ │  │ 51/53 sièges ████│  │
│  │ 90.6% rempli        │  │ 96.2% rempli      │  │
│  │ 3 en hold, 2 libres │  │ 2 libres          │  │
│  └──────────────────────┘  └───────────────────┘  │
│                                                    │
│  ┌─── BUS B (Lyon) ────┐  ┌─── VOL retour ────┐  │
│  │ 42/53 places ████░░░ │  │ 51/53 sièges ████│  │
│  │ 79.2% rempli        │  │ 96.2% rempli      │  │
│  │ 5 en hold, 6 libres │  │ 2 libres          │  │
│  └──────────────────────┘  └───────────────────┘  │
│                                                    │
│  ⚠️ ALERTE : Bus B < 80% à J-30 → Action requise │
│  💡 Suggestion : Activer offre dernière minute     │
└──────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- Jauge visuelle par véhicule/vol avec code couleur (vert >90%, orange 80-90%, rouge <80%)
- Alertes automatiques selon les seuils (J-30 < 80%, J-15 < 90%)
- Suggestions automatiques (offre dernière minute, regroupement bus, bascule midibus)
- Export manifeste passagers par bus/vol (PDF + Excel)

#### 2.2 Plan de sièges interactif (Bus)

**Composant React : `<BusSeatMap />`**

```
┌─ Bus A — Paris → Marrakech ─────────────┐
│  [CHAUFFEUR]                              │
│  01A [✓] 01B [✓]    01C [✓] 01D [✓]     │
│  02A [✓] 02B [ ]    02C [✓] 02D [✓]     │
│  03A [ ] 03B [ ]    03C [✓] 03D [✓]     │
│  ...                                      │
│  13A [✓] 13B [✓]    13C [✓] 13D [✓] 13E│
│                                           │
│  ✓ Occupé  [ ] Libre  [H] Hold  [X] Bloqué│
└───────────────────────────────────────────┘
```

- Vue interactive (clic = attribution/déplacement)
- Drag & drop pour réorganiser les passagers
- Couleurs par groupe (groupe A = bleu, groupe B = vert...)
- Export PDF du plan de sièges

#### 2.3 Système de liste d'attente enrichi

Le modèle `WaitlistEntry` existe déjà. À enrichir :
- Notification automatique quand une place se libère
- Priorité configurable (date d'inscription, VIP, groupe organisateur)
- Conversion automatique hold → booking quand place libérée
- Dashboard waitlist pour le pro (combien en attente par voyage)

---

## CHANTIER 3 — Suivi Temps Réel du Transport

### Vision

Pendant le voyage, tous les acteurs (client, pro, employé, admin) suivent le transport en temps réel : position du bus, statut du vol, horaires mis à jour, incidents.

### Plan technique

#### 3.1 Nouveau modèle : TransportStatus

```
model TransportStatus {
  id              String   @id @default(cuid())
  travelId        String

  // Référence transport
  travelBusId     String?
  flightAllotmentId String?

  // Statut
  status          TransportEventType
  message         String?              // "Bus en route, arrivée estimée 14h30"

  // Position (bus)
  latitude        Float?
  longitude       Float?

  // Horaires
  estimatedArrival DateTime?
  delay           Int?                 // minutes de retard

  // Auteur
  reportedById    String               // userId de qui a rapporté
  reportedByRole  String               // DRIVER, EMPLOYEE, SYSTEM, PRO

  createdAt       DateTime @default(now())
}

enum TransportEventType {
  // Bus
  BUS_DEPARTED
  BUS_AT_STOP
  BUS_EN_ROUTE
  BUS_DELAYED
  BUS_BREAKDOWN
  BUS_ARRIVED

  // Vol
  FLIGHT_ON_TIME
  FLIGHT_DELAYED
  FLIGHT_BOARDING
  FLIGHT_DEPARTED
  FLIGHT_LANDED
  FLIGHT_CANCELED
  FLIGHT_GATE_CHANGE

  // Général
  INCIDENT
  INFO
  RESOLVED
}
```

#### 3.2 Timeline voyage temps réel

**Nouvelle page client : `/client/voyage/[id]/suivi`**

```
┌─ Votre voyage Marrakech — Suivi en direct ────────┐
│                                                     │
│  ✅ 07:00 — Départ Bus A (Paris Bercy)             │
│  ✅ 07:45 — Arrêt Orly (12 passagers montés)      │
│  ✅ 09:15 — Arrivée aéroport CDG                   │
│  ✅ 10:00 — Enregistrement vol TO4521              │
│  ✅ 11:30 — Embarquement porte B24                 │
│  🔵 12:00 — Vol en cours → arrivée 14:30 (à l'heure)│
│  ⏳ 14:30 — Atterrissage Marrakech                 │
│  ⏳ 15:00 — Récupération bagages                   │
│  ⏳ 15:30 — Transfert bus → hôtel                  │
│  ⏳ 16:30 — Check-in hôtel                         │
│                                                     │
│  📍 Position bus transfert : En attente aéroport   │
│  👤 Votre accompagnateur : Marie (06 XX XX XX XX)  │
└─────────────────────────────────────────────────────┘
```

**Notifications push (WebSocket + email/SMS) :**
- Bus parti de l'arrêt → "Votre bus est parti de Paris Bercy, arrivée Orly à 07h45"
- Retard > 15 min → "Retard estimé de 20 min, nouvelle arrivée 15h50"
- Changement de porte → "Vol TO4521 : nouvelle porte B24"
- Incident → "Un retard est signalé, votre accompagnateur Marie gère la situation"

#### 3.3 Vue accompagnateur (indépendant sur le terrain)

**Page dédiée dans le portail Pro : `/pro/voyage/[id]/terrain` (future app)**

L'indépendant accompagnateur peut :
- Mettre à jour le statut du bus (parti, arrêt, incident)
- Faire l'appel passagers (checkbox par nom)
- Signaler un incident
- Voir la liste complète des passagers avec infos (régime alimentaire, urgence, chambre)
- Contacter n'importe quel passager (téléphone, SMS)
- Voir le planning de la journée en temps réel

> **Le suivi terrain est fait par les indépendants**, pas par des "employés". Les admins Eventy contrôlent et supervisent depuis le portail admin.

---

## CHANTIER 4 — Suivi Complet des Indépendants

### Vision

Chaque indépendant a un **tableau de bord de ses missions** et Eventy a une **vue globale de la performance** de chaque partenaire. C'est un suivi bienveillant, pas un flicage — conforme à l'âme d'Eventy ("partenaires, pas prestataires").

### Plan technique

#### 4.1 Nouveau modèle : Mission

```
model Mission {
  id              String   @id @default(cuid())
  travelId        String
  travel          Travel   @relation(...)

  // Assignation
  assignedToId    String                  // userId de l'indépendant
  assignedTo      User     @relation(...)
  assignedById    String                  // userId de qui a assigné (admin/pro)

  // Détails
  title           String                  // "Accompagnement bus Paris→Marrakech"
  description     String?
  category        MissionCategory

  // Timing
  startDate       DateTime
  endDate         DateTime

  // Checklist
  checklistItems  MissionChecklistItem[]

  // Statut
  status          MissionStatus
  completedAt     DateTime?
  completionNotes String?

  // Évaluation
  clientRating    Float?                  // note client 1-5
  adminRating     Float?                  // note admin 1-5
  ratingComment   String?

  // Financier
  compensationTTC Int?                    // rémunération en centimes
  compensationPaid Boolean @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum MissionCategory {
  ACCOMPAGNEMENT         // Accompagnateur de voyage
  GUIDE_LOCAL            // Guide sur place
  COMMERCIAL             // Remplissage places
  LOGISTIQUE             // Gestion bagages, transferts
  ANIMATION              // Animation soirée, activités
  COORDINATION           // Coordination multi-groupes
  SUPPORT_CLIENT         // Support client sur place
}

enum MissionStatus {
  PROPOSED               // Mission proposée, pas encore acceptée
  ACCEPTED               // Indépendant a accepté
  IN_PROGRESS            // En cours (voyage démarré)
  COMPLETED              // Terminée
  CANCELED               // Annulée
  ISSUE_REPORTED         // Problème signalé
}

model MissionChecklistItem {
  id          String   @id @default(cuid())
  missionId   String
  mission     Mission  @relation(...)

  label       String                    // "Vérifier les passeports au départ"
  isCompleted Boolean  @default(false)
  completedAt DateTime?
  completedBy String?                   // userId
  sortOrder   Int

  @@index([missionId, sortOrder])
}
```

#### 4.2 Dashboard indépendant — Mes missions

**Page enrichie : `/pro/missions` (nouvelle)**

```
┌─ Mes Missions — Mars 2026 ──────────────────────┐
│                                                    │
│  🟢 EN COURS                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │ Accompagnement Marrakech 15-22 Avril        │  │
│  │ Statut : Acceptée — Départ dans 26 jours    │  │
│  │ Checklist : 3/8 tâches complétées           │  │
│  │ ████░░░░ 37%                                │  │
│  │ [Voir détail] [Checklist]                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  📋 PROPOSÉES                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Guide local Barcelone 5-8 Mai               │  │
│  │ Compensation : 800€ — 4 jours               │  │
│  │ [Accepter] [Décliner]                       │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  📊 MES STATS                                     │
│  Voyages réalisés : 12 | Note moyenne : 4.7/5    │
│  Taux de complétion : 98% | CA généré : 3 200€   │
└──────────────────────────────────────────────────┘
```

#### 4.3 Dashboard admin — Suivi global indépendants

**Page enrichie : `/admin/independants` (nouvelle)**

```
┌─ Suivi Indépendants — Vue admin ─────────────────┐
│                                                     │
│  Actifs : 24 | En mission : 8 | Disponibles : 16  │
│                                                     │
│  Top performers :                                   │
│  1. Marie D. — ⭐ 4.9 — 18 voyages — 0 incident  │
│  2. Karim L. — ⭐ 4.8 — 14 voyages — 1 incident  │
│  3. Sophie M. — ⭐ 4.7 — 12 voyages — 0 incident │
│                                                     │
│  ⚠️ Attention requise :                            │
│  - Tom R. : 2 missions en retard                   │
│  - Checklist Marrakech 15/04 : 3 indép. non confirmés│
│                                                     │
│  [Assigner mission] [Voir tous] [Export]           │
└─────────────────────────────────────────────────────┘
```

**Métriques par indépendant :**
- Nombre de voyages réalisés
- Note moyenne clients + note admin
- Taux de complétion des checklist
- Nombre d'incidents signalés
- CA généré (pour les commerciaux)
- Formations complétées
- Ancienneté dans le réseau

---

## CHANTIER 5 — Admin Terrain & Contrôle des Indépendants

### Vision

L'**équipe admin Eventy** (tes collaborateurs admin) supervise tout depuis le portail admin. Ils contrôlent ce que les indépendants font sur le terrain, peuvent intervenir, aider, et s'assurer que tout se passe bien. Pas de nouveau rôle — on enrichit le **système AdminRole existant**.

Les **indépendants** font le suivi terrain (appel, transport, accompagnement) via leur portail Pro.
Les **admins Eventy** contrôlent, vérifient et interviennent via le portail Admin.

> **Principe clé : ZÉRO BLOCAGE pour les admins.** L'équipe Eventy doit pouvoir accéder à toute information et effectuer toute action d'assistance à tout moment.

### Plan technique

#### 5.1 Enrichissement AdminRole existant (pas de nouveau rôle)

Le système AdminRole existe déjà avec : `FOUNDER_ADMIN`, `OPS_VOYAGE_ADMIN`, `TRANSPORT_ADMIN`, `MARKETING_ADMIN`, `FINANCE_ADMIN`, `SUPPORT_ADMIN`, `HRA_ADMIN`, `LEGAL_ADMIN`, `TECH_ADMIN`.

**Ajout de nouveaux AdminRoles terrain :**

```
enum AdminRole {
  // Existants
  FOUNDER_ADMIN
  OPS_VOYAGE_ADMIN
  TRANSPORT_ADMIN
  MARKETING_ADMIN
  FINANCE_ADMIN
  SUPPORT_ADMIN
  HRA_ADMIN
  LEGAL_ADMIN
  TECH_ADMIN

  // NOUVEAUX — Contrôle terrain
  TERRAIN_ADMIN           // Supervise les voyages en cours, contrôle les indépendants
  MISSION_ADMIN           // Gère l'assignation et le suivi des missions indépendants
}
```

**Pas de nouveau modèle EmployeeProfile** — les admins terrain sont des Users avec `role: ADMIN` et les bons `adminRoles`. Simple, propre, légalement correct.

#### 5.2 Portail Pro enrichi — Outils terrain pour indépendants

L'indépendant qui accompagne un voyage a accès à des outils terrain dans son portail Pro :

| Page Pro | Fonction terrain |
|----------|-----------------|
| `/pro/voyage/[id]/terrain` | **NOUVEAU** — Cockpit terrain : statut transport, timeline, actions rapides |
| `/pro/voyage/[id]/terrain/appel` | **NOUVEAU** — Appel passagers par bus/vol — checkbox rapide |
| `/pro/voyage/[id]/terrain/incidents` | **NOUVEAU** — Signalement et suivi d'incidents |
| `/pro/voyage/[id]/terrain/passagers` | **NOUVEAU** — Liste passagers avec infos utiles (régime, chambre, urgence) |
| `/pro/voyage/[id]/terrain/contacts` | **NOUVEAU** — Annuaire (passagers du voyage, équipe Eventy, prestataires) |

**Principes UX terrain (portail Pro) :**
- **Mobile-first** → utilisé sur le terrain, sur téléphone
- **Gros boutons, peu de texte** → rapide à utiliser debout dans un bus
- **Accès simplifié** → les pages terrain sont séparées du reste du portail Pro
- **Future app** → ces pages seront reprises dans l'app mobile indépendant

#### 5.3 Portail Admin enrichi — Contrôle & supervision

L'admin terrain voit **tout en temps réel** et peut intervenir :

| Page Admin | Fonction |
|------------|----------|
| `/admin/voyages/[id]/controle` | **NOUVEAU** — Vue live du voyage : où en est le bus, qui est monté, incidents |
| `/admin/voyages/[id]/controle/appel` | **NOUVEAU** — Visualiser les appels faits par l'indépendant, compléter si besoin |
| `/admin/voyages/[id]/controle/incidents` | **NOUVEAU** — Tous les incidents signalés, statut résolution, actions admin |
| `/admin/voyages/[id]/controle/override` | **NOUVEAU** — Modifier siège, chambre, transport d'un client (override admin) |
| `/admin/independants/suivi-live` | **NOUVEAU** — Vue globale : tous les indépendants en mission, leur statut, alertes |
| `/admin/missions/dashboard` | **NOUVEAU** — Toutes les missions en cours, taux complétion, alertes retard |

```
┌─ Admin — Contrôle voyage Marrakech 15/04 ─────────┐
│                                                      │
│  👤 Indépendant terrain : Marie D. (accompagnatrice) │
│  📍 Statut : Bus A en route → dernier update 11h32  │
│  ✅ Appel fait : 48/48 passagers montés              │
│  ⚠️ 0 incidents signalés                            │
│                                                      │
│  🚌 Bus A — Paris→CDG : EN ROUTE (arrivée 09h15)   │
│  ✈️ Vol TO4521 — CDG→RAK : PRÉVU 12h00             │
│  🚌 Bus transfert — RAK→Hôtel : EN ATTENTE          │
│                                                      │
│  📋 Checklist Marie : 5/8 tâches OK                 │
│     ✅ Vérification passeports                       │
│     ✅ Appel bus A                                    │
│     ✅ Distribution kits voyage                       │
│     ⏳ Enregistrement aéroport                       │
│     ⏳ Distribution cartes embarquement              │
│     ⏳ Appel bus transfert                           │
│     ⏳ Check-in hôtel                                │
│     ⏳ Briefing accueil                              │
│                                                      │
│  [📞 Appeler Marie] [💬 Message] [🔧 Override]      │
└──────────────────────────────────────────────────────┘
```

#### 5.4 Matrice de permissions : Indépendant terrain vs Admin

| Capacité | Indépendant (Pro) | Admin Terrain | Admin Fondateur |
|----------|-------------------|---------------|-----------------|
| Voir passagers de SES voyages | ✅ | ✅ | ✅ |
| Voir passagers de TOUS les voyages | ❌ | ✅ | ✅ |
| Faire l'appel passagers | ✅ (ses voyages) | ✅ (tous) | ✅ |
| Mettre à jour statut transport | ✅ (ses voyages) | ✅ (tous) | ✅ |
| Signaler un incident | ✅ | ✅ | ✅ |
| Modifier siège/chambre d'un client | ❌ | ✅ (override) | ✅ |
| Modifier prix/conditions | ❌ | ❌ | ✅ |
| Assigner/modifier missions | ❌ | ✅ | ✅ |
| Voir revenus indépendants | Ses propres revenus | ✅ Résumé | ✅ Tout |
| Supprimer des données | ❌ | ❌ | ✅ |
| Contacter participants | ✅ (ses voyages) | ✅ (tous) | ✅ |
| Voir le dashboard contrôle live | ❌ | ✅ | ✅ |

---

## PLANNING DE MISE EN ŒUVRE — ✅ 100% IMPLÉMENTÉ (Cowork-22, 21/03/2026)

### Phase 1 — Fondations ✅

| Tâche | Statut |
|-------|--------|
| Backend : FlightAllotmentService (CRUD allotements, assignation passagers, manifeste, export) | ✅ |
| Backend : MissionService (CRUD missions, checklist, assignation) | ✅ (Cowork-19) |
| Backend : TransportStatusService (statuts temps réel, 8 endpoints, timeline, alertes) | ✅ |
| Backend : SeatManagementService (occupancy dashboard, seat map, waitlist, suggestions) | ✅ |

### Phase 2 — Frontend Pro & Admin ✅

| Tâche | Statut |
|-------|--------|
| Pro : config transport avion `/pro/voyages/[id]/transport/avion` | ✅ |
| Pro : dashboard remplissage `/pro/voyages/[id]/remplissage` + BusSeatMap | ✅ |
| Pro : page missions `/pro/missions` + détail `/pro/missions/[id]` | ✅ |
| Admin : gestion indépendants `/admin/independants` | ✅ |
| Admin : missions dashboard `/admin/missions` | ✅ |
| Admin : suivi live `/admin/independants/suivi-live` | ✅ |
| Admin : contrôle voyage `/admin/voyages/[id]/controle` (+ appel, incidents, override) | ✅ |

### Phase 3 — Checkout & Client ✅

| Tâche | Statut |
|-------|--------|
| Checkout : étape transport unifiée (bus/avion/combiné) | ✅ |
| Client : timeline voyage temps réel `/client/voyage/[id]/suivi` | ✅ |
| Composant `SeatSelector` pour choix de siège checkout | ✅ |

### Phase 4 — Outils Terrain Pro ✅

| Tâche | Statut |
|-------|--------|
| Pro : cockpit terrain `/pro/voyages/[id]/terrain` | ✅ |
| Pro : appel passagers `/pro/voyages/[id]/terrain/appel` | ✅ |
| Pro : incidents `/pro/voyages/[id]/terrain/incidents` | ✅ |
| Pro : liste passagers `/pro/voyages/[id]/terrain/passagers` | ✅ |
| Pro : contacts terrain `/pro/voyages/[id]/terrain/contacts` | ✅ |

### Phase 5 — Carnet de Voyage & Aide Locale ✅

| Tâche | Statut |
|-------|--------|
| Backend : NotebookService + LocalResourcesService | ✅ (Cowork-19) |
| Pro : éditeur carnet `/pro/voyages/[id]/carnet` | ✅ |
| Pro : aide locale `/pro/voyages/[id]/aide-locale` | ✅ |
| Client : carnet immersif `/client/voyage/[id]/carnet` | ✅ |
| Client : aide locale SOS `/client/voyage/[id]/aide-locale` | ✅ |
| Client : urgence enrichie `/client/urgence` (SOS + GPS) | ✅ |
| Admin : carnets overview `/admin/carnets` | ✅ |
| Admin : aide locale `/admin/aide-locale` | ✅ |

### Phase 6 — App Mobile (Plus tard)

| Élément | Description |
|---------|-------------|
| Cible | App React Native / PWA — **3 versions** : Client, Indépendant, Admin |
| **App Client** | Carnet de voyage, urgences SOS, aide locale GPS, timeline, notifications |
| **App Indépendant** | Mes missions, checklist, appel, statut transport, incidents, contacts |
| **App Admin** | Vue contrôle simplifiée pour admins terrain en déplacement |
| Hors-ligne | Cache local : carnet de voyage, contacts urgence, aide locale, passagers |
| Notifications push | Alerte départ, incidents, changements, rappels carnet |
| Géolocalisation | Position bus temps réel, aide locale autour de moi, SOS avec position |

> **Décision PDG** : L'app mobile sera développée APRÈS la validation du flux web complet. Les phases 4-5 web servent de prototype et de validation fonctionnelle.

---

## CHANTIER 6 — Carnet de Voyage Enrichi

### Vision

Le **Carnet de Voyage** est le cœur de l'expérience Eventy. C'est un document vivant que le créateur (pro/indépendant) remplit et enrichit au fil du temps. Chaque fois qu'un voyage est reconduit, le carnet s'enrichit avec l'expérience accumulée.

> **"Le carnet de voyage Eventy, c'est comme avoir un ami qui connaît la destination par cœur et qui te dit tout ce qu'il faut savoir."** — Conforme à l'âme d'Eventy.

### Ce qui existe vs ce qu'on améliore

| Fonctionnalité | Aujourd'hui | Amélioré |
|----------------|-------------|----------|
| Programme jour par jour | ✅ `programJson` — titres + activités | ✅ + descriptions riches, photos, temps estimés |
| Description du voyage | ✅ `description`, `summary` | ✅ + sections thématiques (culture, cuisine, nature...) |
| Inclusions/exclusions | ✅ `inclusionsJson`, `exclusionsJson` | ✅ Inchangé (déjà bien) |
| **Carnet de voyage** | ❌ N'existe pas | 🆕 **Document complet enrichi progressivement** |
| **Tips & bons plans** | ❌ N'existe pas | 🆕 Recommandations du créateur par lieu/jour |
| **Infos culturelles** | ❌ N'existe pas | 🆕 Culture, coutumes, mots utiles, pourboires |
| **Photos & ambiance** | ✅ `galleryUrls` basique | 🆕 Photos par jour/lieu + légendes + mood |
| **Enrichissement progressif** | ❌ Figé à la création | 🆕 Le créateur enrichit après chaque édition du voyage |
| **Héritage entre éditions** | ❌ Duplicate = copie brute | 🆕 Le carnet se transmet d'une édition à l'autre et s'enrichit |

### Plan technique

#### 6.1 Nouveau modèle : TravelNotebook

```
model TravelNotebook {
  id              String   @id @default(cuid())
  travelId        String   @unique
  travel          Travel   @relation(...)

  // Méta
  status          NotebookStatus            // DRAFT, PUBLISHED, ARCHIVED
  version         Int      @default(1)       // incrémenté à chaque édition du voyage
  lastEnrichedAt  DateTime?                  // date du dernier enrichissement

  // Sections du carnet
  entries         NotebookEntry[]

  // Hérité de
  parentNotebookId String?                   // carnet de la saison précédente
  parentNotebook   TravelNotebook? @relation("NotebookLineage", ...)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum NotebookStatus {
  DRAFT                   // En cours de rédaction
  PUBLISHED               // Visible par les clients
  ARCHIVED                // Voyage passé, carnet archivé (mais consultable)
}

model NotebookEntry {
  id              String   @id @default(cuid())
  notebookId      String
  notebook        TravelNotebook @relation(...)

  // Type d'entrée
  entryType       NotebookEntryType
  category        NotebookCategory?

  // Contenu
  title           String
  content         String                    // Markdown ou texte riche
  imageUrls       String[]                  // Photos associées
  imageCaption    String?                   // Légende photo principale

  // Localisation (optionnel)
  locationName    String?                   // "Marché de Jemaa el-Fna"
  latitude        Float?
  longitude       Float?

  // Timing
  dayNumber       Int?                      // Jour du voyage (1, 2, 3...)
  timeOfDay       String?                   // "matin", "après-midi", "soirée"

  // Enrichissement
  addedInEdition  Int      @default(1)      // ajouté à quelle édition du voyage
  source          EntrySource               // qui a ajouté cette entrée
  sourceUserId    String?                   // userId du contributeur

  // Ordre
  sortOrder       Int

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([notebookId, dayNumber, sortOrder])
}

enum NotebookEntryType {
  // Programme
  ACTIVITY                // Activité du jour (visite, excursion...)
  FREE_TIME               // Temps libre — suggestions

  // Carnet enrichi
  TIP                     // Bon plan / astuce du créateur
  CULTURAL_NOTE           // Info culturelle (coutumes, fêtes, histoire)
  FOOD_RECOMMENDATION     // Restaurant, plat local, street food
  SHOPPING_TIP            // Où acheter, négocier, prix attendu
  PHOTO_SPOT              // Spot photo recommandé
  WARNING                 // Attention / à éviter / arnaque connue
  TRANSPORT_TIP           // Astuce transport local (taxi, bus, marche)

  // Pratique
  USEFUL_PHRASE           // Mots/phrases utiles dans la langue locale
  TIPPING_GUIDE           // Guide pourboire par situation
  DRESS_CODE              // Code vestimentaire / recommandations
  WEATHER_NOTE            // Météo typique + quoi emmener
  PACKING_TIP             // Conseil bagage spécifique à la destination

  // Ambiance
  STORY                   // Anecdote vécue par le créateur
  TESTIMONIAL             // Témoignage d'un voyageur précédent
  MOOD                    // Ambiance / atmosphère attendue
}

enum NotebookCategory {
  BEFORE_DEPARTURE        // À lire avant de partir
  ON_SITE                 // Sur place — consultable pendant le voyage
  DAY_SPECIFIC            // Lié à un jour précis
  GENERAL                 // Valable pour tout le voyage
  RETURN                  // Retour — souvenirs, achats de dernière minute
}

enum EntrySource {
  CREATOR                 // Le pro créateur du voyage
  INDEPENDANT             // Un indépendant qui a accompagné
  ADMIN                   // L'équipe Eventy
  TRAVELER                // Retour d'un voyageur (modéré)
}
```

#### 6.2 Éditeur Carnet de Voyage (Portail Pro)

**Nouvelle page : `/pro/voyages/[id]/carnet`**

```
┌─ Carnet de Voyage — Marrakech 15-22 Avril ────────┐
│                                                      │
│  📘 Édition 3 — Enrichi après 2 voyages précédents  │
│  Statut : PUBLIÉ — Visible par 48 voyageurs inscrits│
│                                                      │
│  ── AVANT LE DÉPART ──────────────────────────────  │
│                                                      │
│  📋 Checklist bagage Marrakech          [✏️ Éditer] │
│  "Prenez des chaussures confortables pour la        │
│  médina (pavés irréguliers), un foulard léger       │
│  pour les mosquées, et de la crème solaire SPF50."  │
│                                                      │
│  🗣️ 10 phrases utiles en darija         [✏️ Éditer] │
│  "Choukran = Merci, Bslama = Au revoir,             │
│  Bchhal? = Combien?, La choukran = Non merci"       │
│                                                      │
│  💰 Guide pourboire                     [✏️ Éditer] │
│  "Restaurant : 10%. Guide : 50-100 DH/jour.        │
│  Porteur : 20 DH. Taxi : pas de pourboire."        │
│  📝 Ajouté en édition 2 (retour voyageurs)          │
│                                                      │
│  ── JOUR 1 — Arrivée & Médina ───────────────────  │
│                                                      │
│  🏛️ Découverte Jemaa el-Fna (16h-19h)  [✏️ Éditer] │
│  📍 Place Jemaa el-Fna, Marrakech                   │
│  "Arrivez en fin d'après-midi quand la place        │
│  s'anime. Les stands de jus d'orange frais sont     │
│  à 5 DH — ceux du milieu sont les meilleurs."      │
│  📸 [3 photos]                                      │
│  ⚠️ "Attention aux charmeurs de serpents qui        │
│  demandent des photos payantes (50-100 DH)."       │
│                                                      │
│  🍽️ Restaurant Nomad — Terrasse rooftop  [✏️]      │
│  📍 1 Derb Aarjane, Médina                          │
│  "Vue sur la médina, cuisine marocaine moderne.     │
│  Réserver pour le coucher de soleil. Budget ~200    │
│  DH/pers. Le tajine d'agneau est incontournable."  │
│  📝 Ajouté en édition 1 par Marie D. (accompagn.)  │
│                                                      │
│  [+ Ajouter une entrée] [🔄 Voir les suggestions]  │
│                                                      │
│  ── JOUR 2 — Atlas & Cascades ────────────────────  │
│  ...                                                 │
│                                                      │
│  ┌─ ENRICHISSEMENT ───────────────────────────────┐ │
│  │ 💡 3 suggestions de voyageurs en attente       │ │
│  │ de modération pour cette destination.           │ │
│  │ [Voir les suggestions]                          │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Fonctionnalités clés de l'éditeur :**

1. **Création initiale** — Le créateur remplit le carnet en même temps que le programme voyage
2. **Enrichissement progressif** — Après chaque édition du voyage, le créateur ajoute ce qu'il a appris
3. **Contributions multiples** — L'indépendant accompagnateur peut proposer des ajouts (modérés par le créateur)
4. **Suggestions voyageurs** — Les voyageurs de retour peuvent soumettre des tips (modérés)
5. **Héritage entre saisons** — Quand le voyage est dupliqué (saison suivante), le carnet est copié et enrichi (version +1)
6. **Historique des ajouts** — Chaque entrée indique à quelle édition elle a été ajoutée et par qui

#### 6.3 Vue Client — Mon Carnet de Voyage

**Page enrichie : `/client/voyage/[id]/carnet`**

```
┌─ 📘 Votre Carnet de Voyage — Marrakech ───────────┐
│                                                      │
│  Préparé avec ❤️ par Marie D., votre accompagnatrice│
│  Enrichi après 2 voyages précédents sur cette dest.  │
│                                                      │
│  [📋 Avant le départ] [📅 Jour par jour] [📍 Carte]│
│                                                      │
│  ── AVANT LE DÉPART ──────────────────────────────  │
│                                                      │
│  📋 Votre checklist bagage                           │
│  ☐ Chaussures confortables (pavés médina)           │
│  ☐ Foulard léger (mosquées)                         │
│  ☐ Crème solaire SPF50                              │
│  ☐ Adaptateur prise (type C/E)                      │
│  ☐ Cash en dirhams (~500 DH pour les 2 premiers    │
│    jours, distributeurs dispo ensuite)               │
│                                                      │
│  🗣️ Vos 10 phrases en darija                        │
│  🔊 [Écouter la prononciation]                      │
│                                                      │
│  ── JOUR 1 — 15 Avril ───────────────────────────  │
│                                                      │
│  16h 🏛️ Place Jemaa el-Fna                          │
│  💡 "Jus d'orange frais à 5 DH — ceux du milieu"   │
│  ⚠️ "Photos serpents payantes (50-100 DH)"          │
│  📸 [Voir les photos]                                │
│  📍 [Ouvrir dans Maps]                               │
│                                                      │
│  19h30 🍽️ Restaurant Nomad                           │
│  💡 "Réserver le rooftop pour le coucher de soleil"  │
│  📍 [Ouvrir dans Maps] [📞 Appeler]                 │
│                                                      │
│  ── 📍 CARTE ────────────────────────────────────   │
│  [Carte interactive avec tous les points du carnet] │
│  🏛️ Jemaa el-Fna  🍽️ Nomad  🏥 Clinique Majorelle │
│  💊 Pharmacie Guéliz  🇫🇷 Consulat France           │
│                                                      │
│  ── 🆘 URGENCES RAPIDES ─────────────────────────  │
│  [🆘 SOS Eventy]  [🏥 Urgences]  [🇫🇷 Consulat]  │
└──────────────────────────────────────────────────────┘
```

**Fonctionnalités client :**
- **Vue avant départ** — Checklist bagages interactive (cochable), phrases utiles, infos pratiques
- **Vue jour par jour** — Programme enrichi avec tips, photos, spots, warnings
- **Vue carte** — Carte interactive avec TOUS les points du carnet (activités, restos, aide locale, urgences)
- **Hors-ligne** — Le carnet entier est téléchargeable en cache (PWA service worker)
- **Liens GPS** — Chaque lieu ouvre dans Google Maps / Apple Plans
- **Accès urgences** — Bouton SOS toujours visible en bas du carnet

---

## CHANTIER 7 — Aide Locale Structurée & Urgences Améliorées

### Vision

Aujourd'hui l'aide locale est un simple champ texte (`localContacts`) dans les Safety Sheets. On transforme ça en un **système structuré avec GPS** : pharmacies, hôpitaux, consulat, police — tout géolocalisé et accessible en 1 tap.

La page urgence client existe déjà (numéro 24/7, email, chat). On l'améliore avec un **SOS géolocalisé** et l'intégration de l'aide locale.

### Ce qui existe vs ce qu'on améliore

| Fonctionnalité | Aujourd'hui | Amélioré |
|----------------|-------------|----------|
| Page urgence client | ✅ `/client/urgence` — numéro 24/7, email, 6 situations | ✅ + SOS 1-tap avec GPS, aide locale intégrée |
| Safety Sheets | ✅ 8 champs texte libre (protocole, médical, local...) | ✅ + aide locale structurée avec coordonnées GPS |
| Contacts locaux | ✅ Champ `localContacts` texte libre | 🆕 **Modèle structuré : catégorie, adresse, GPS, téléphone, horaires** |
| Pharmacies/hôpitaux | ❌ Pas structuré | 🆕 Géolocalisés sur la carte du carnet |
| Consulat/ambassade | ❌ Pas structuré | 🆕 Avec numéro d'urgence consulaire |
| SOS géolocalisé | ❌ N'existe pas | 🆕 **1 tap → alerte Eventy + position GPS + info voyage** |

### Plan technique

#### 7.1 Nouveau modèle : LocalResource

```
model LocalResource {
  id              String   @id @default(cuid())
  travelId        String
  travel          Travel   @relation(...)

  // Catégorie
  category        LocalResourceCategory
  name            String                    // "Clinique Internationale de Marrakech"
  description     String?                   // "Urgences 24/7, médecins francophones"

  // Contact
  phone           String?                   // "+212 524 438 090"
  email           String?
  website         String?

  // Localisation
  address         String                    // "Route de Casablanca, Marrakech"
  city            String
  latitude        Float?
  longitude       Float?
  placeId         String?                   // Google Maps Place ID

  // Disponibilité
  openingHours    String?                   // "24/7" ou "Lun-Ven 8h-20h"
  isEmergency     Boolean  @default(false)  // accessible en urgence
  is24h           Boolean  @default(false)

  // Méta
  addedById       String                    // userId (pro, indépendant, admin)
  verifiedAt      DateTime?                 // vérifié par l'équipe Eventy
  verifiedById    String?

  sortOrder       Int
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([travelId, category])
}

enum LocalResourceCategory {
  // Santé
  HOSPITAL                // Hôpital / clinique
  PHARMACY                // Pharmacie
  DOCTOR                  // Médecin généraliste
  DENTIST                 // Dentiste

  // Sécurité
  POLICE                  // Commissariat / gendarmerie
  FIRE_DEPARTMENT         // Pompiers
  EMBASSY                 // Ambassade / consulat

  // Services
  BANK_ATM                // Banque / distributeur
  POST_OFFICE             // Poste
  PHONE_SHOP              // Recharge téléphone / SIM locale
  SUPERMARKET             // Supermarché / épicerie

  // Transport
  TAXI_STAND              // Station taxi fiable
  BUS_STATION             // Gare routière
  TRAIN_STATION           // Gare
  CAR_RENTAL              // Location voiture

  // Eventy
  EVENTY_CONTACT          // Contact Eventy local (accompagnateur)
  HOTEL_RECEPTION         // Réception hôtel du voyage
}
```

#### 7.2 Urgence SOS améliorée

**Page enrichie : `/client/urgence` → ajout SOS 1-tap**

```
┌─ 🆘 URGENCE — Eventy à vos côtés ─────────────────┐
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │          🆘 SOS EVENTY                        │   │
│  │                                                │   │
│  │    [  APPUYER POUR ALERTER  ]                 │   │
│  │                                                │   │
│  │  Envoie votre position GPS + infos voyage     │   │
│  │  à l'équipe Eventy + votre accompagnateur     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  📞 Appel direct :                                   │
│  [📞 Eventy 24/7 : +33 9 70 80 80 80]             │
│  [📞 Marie (accompagnatrice) : +33 6 XX XX XX]     │
│  [📞 Hôtel réception : +212 524 XXX XXX]           │
│                                                      │
│  ── AIDE LOCALE AUTOUR DE MOI ───────────────────  │
│  📍 Basé sur votre position actuelle                │
│                                                      │
│  🏥 Clinique Internationale — 1.2 km               │
│     24/7 — Médecins francophones                    │
│     [📞 Appeler] [📍 Y aller]                      │
│                                                      │
│  💊 Pharmacie Guéliz — 0.4 km                      │
│     Ouvert jusqu'à 22h                              │
│     [📞 Appeler] [📍 Y aller]                      │
│                                                      │
│  🇫🇷 Consulat de France — 3.1 km                   │
│     Urgences consulaires : +33 1 43 17 53 53       │
│     [📞 Appeler] [📍 Y aller]                      │
│                                                      │
│  👮 Commissariat central — 0.8 km                   │
│     [📞 Appeler] [📍 Y aller]                      │
│                                                      │
│  ── SITUATIONS D'URGENCE ────────────────────────  │
│  [🏥 Problème médical] → Protocole + contacts      │
│  [📄 Perte de documents] → Étapes + consulat       │
│  [🧳 Bagages perdus] → Procédure + contacts       │
│  [🚌 Problème transport] → Contact direct          │
│  [🏨 Problème hébergement] → Contact hôtel + admin │
│  [⚠️ Urgence locale] → Numéros locaux + SOS       │
│                                                      │
│  Pack Sérénité actif ✅                              │
│  "Quoi qu'il arrive, on s'en occupe."               │
└──────────────────────────────────────────────────────┘
```

**Fonctionnement du bouton SOS :**
1. Client appuie sur SOS
2. L'app récupère sa position GPS
3. Envoie une alerte WebSocket + SMS à :
   - L'accompagnateur indépendant du voyage
   - L'admin terrain Eventy
   - Le numéro d'urgence Eventy
4. L'alerte contient : nom du client, voyage, position GPS, heure
5. L'admin/accompagnateur voit l'alerte dans son cockpit avec le bouton "Rappeler"
6. Historique des alertes SOS dans le dashboard admin

#### 7.3 Gestion aide locale (Portail Pro)

**Nouvelle page : `/pro/voyages/[id]/aide-locale`**

Le créateur ajoute les ressources locales importantes pour sa destination :

- L'ajout est guidé par catégorie (santé, sécurité, services, transport)
- Recherche Google Maps intégrée pour auto-remplir adresse + GPS
- Les ressources sont vérifiées par l'équipe admin Eventy (badge "Vérifié")
- Les ressources sont héritées quand le voyage est dupliqué pour la saison suivante
- L'indépendant accompagnateur peut proposer de nouvelles ressources après chaque voyage

---

## ENRICHISSEMENT PROGRESSIF — Comment ça fonctionne

Le carnet de voyage et l'aide locale s'enrichissent naturellement :

```
Édition 1 — Premier voyage Marrakech
├── Créateur remplit le programme + quelques tips de base
├── Carnet : 15 entrées (programme + 5 tips)
├── Aide locale : 6 ressources (hôpital, pharmacie, consulat, police, hôtel, taxi)
│
Édition 2 — Deuxième voyage Marrakech
├── Carnet hérité de l'édition 1 (15 entrées)
├── + 8 nouvelles entrées ajoutées par le créateur (retour d'expérience)
├── + 3 suggestions de voyageurs (modérées)
├── + 2 ajouts de Marie (accompagnatrice)
├── Carnet : 28 entrées — version 2
├── Aide locale : +3 (dentiste, bureau de change, pharmacie de nuit)
│
Édition 3 — Troisième voyage Marrakech
├── Carnet hérité : 28 entrées
├── + entrées enrichies (corrections, mises à jour prix)
├── + nouveaux spots découverts
├── Carnet : 35+ entrées — version 3
├── Le carnet est maintenant "mature" → gros avantage compétitif
└── Chaque édition améliore le carnet → les voyageurs adorent
```

> **C'est l'avantage Eventy** : Plus on fait un voyage, meilleur le carnet devient. Les agences classiques donnent un PDF générique. Eventy donne un vrai guide personnalisé, enrichi par l'expérience réelle.

---

## MÉTRIQUES DE SUCCÈS

| KPI | Objectif | Mesure |
|-----|----------|--------|
| Taux de remplissage bus | > 90% | (passagers / capacité) par voyage |
| Taux de remplissage vol | > 95% | (passagers / allotement) par vol |
| Temps moyen checkout | < 5 min | Du choix transport au paiement |
| Complétion checklist indépendants | > 95% | Tâches complétées / tâches assignées |
| Note moyenne indépendants | > 4.5/5 | Moyenne des évaluations clients |
| Incidents résolus < 1h | > 80% | Temps entre signalement et résolution |
| Satisfaction client transport | > 4.5/5 | Note post-voyage sur le transport |
| **Entrées carnet par voyage** | **> 20** | Nombre d'entrées dans le carnet (maturité) |
| **Consultation carnet** | **> 80%** | % de voyageurs qui consultent le carnet |
| **Enrichissement post-voyage** | **> 5 entrées** | Nouvelles entrées ajoutées après chaque édition |
| **Ressources aide locale** | **> 10 par destination** | Ressources géolocalisées actives |
| **Temps réponse SOS** | **< 3 min** | Temps entre alerte SOS et premier contact |

---

## DÉPENDANCES & RISQUES

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Complexité checkout avion | Retard Phase 3 | Commencer par bus-only, ajouter avion incrémentalement |
| Adoption outils terrain par les indépendants | Sous-utilisation | Design mobile-first, formation, feedback terrain, app mobile |
| Données passagers avion (RGPD) | Conformité | Chiffrement passeports, durée rétention limitée, consentement explicite |
| Hors-ligne app mobile | Complexité technique | PWA avec service worker avant app native |
| Statut juridique des indépendants | Requalification en salariat | S'assurer que les indépendants restent autonomes (pas de lien de subordination), contrat de prestation clair |
| Intégration compagnies aériennes | Pas d'API directe en Phase 1 | Saisie manuelle des infos vol, API en Phase 2+ |
| **Qualité du contenu carnet** | Carnet vide ou bâclé | Templates pré-remplis par destination, score de complétion, incitation à enrichir |
| **Précision aide locale** | Infos périmées (horaires, fermetures) | Vérification admin, badge "vérifié", mise à jour à chaque édition |
| **Faux SOS** | Surcharge d'alertes | Rate limit (1 SOS / 5 min), confirmation avant envoi, suivi des abus |

---

## RÉSUMÉ DES LIVRABLES

| # | Livrable | Type | Phase |
|---|----------|------|-------|
| 1 | Modèles Prisma (6 nouveaux transport + missions) | Backend | Phase 1 |
| 2 | Services backend (5 nouveaux transport + missions) | Backend | Phase 1 |
| 3 | Guards & decorators AdminRoles terrain | Backend | Phase 1 |
| 4 | Pages pro transport avion | Frontend | Phase 2 |
| 5 | Dashboard remplissage temps réel | Frontend | Phase 2 |
| 6 | Composant `<BusSeatMap />` | Frontend | Phase 2 |
| 7 | Pages admin indépendants + missions | Frontend | Phase 2 |
| 8 | Pages admin contrôle terrain + suivi live | Frontend | Phase 2 |
| 9 | Checkout transport unifié | Frontend | Phase 3 |
| 10 | Timeline voyage client | Frontend | Phase 3 |
| 11 | Pages terrain Pro (5 pages) + Pages contrôle Admin (6 pages) | Frontend | Phase 4 |
| 12 | **Modèles Prisma carnet + aide locale (TravelNotebook, NotebookEntry, LocalResource)** | Backend | **Phase 5** |
| 13 | **Éditeur carnet de voyage (Pro)** | Frontend | **Phase 5** |
| 14 | **Gestionnaire aide locale (Pro)** | Frontend | **Phase 5** |
| 15 | **Vue carnet client + carte interactive** | Frontend | **Phase 5** |
| 16 | **Page urgence SOS améliorée (Client)** | Frontend | **Phase 5** |
| 17 | **Héritage carnet entre éditions** | Backend | **Phase 5** |
| 18 | App mobile (PWA puis native) — Client + Indépendant + Admin | Mobile | **Phase 6** |

---

> **Prochaine action** : Valider ce plan avec David, puis démarrer Phase 1 — migrations Prisma + services backend.
