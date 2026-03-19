# EVENTY VOYAGE PAGES — COMPLETE EXTRACTION (11MB draw.io)

**Generated:** 2026-03-18  
**Source:** eventy_v53_COMPLET_PRET_CODAGE.drawio (11 key voyage-related pages parsed)

---

## OVERVIEW

This document consolidates ALL extracted content from the draw.io file related to voyage/travel pages across:
- Pro/Creator portals (voyage creation, dashboards)
- Public/Client portals (discovery, listing, booking)
- Admin interfaces (validation, operations)
- Database schemas (entities, relationships)

Total pages analyzed: 9 core voyage pages + 4 specialized UI/visibility pages

---

## TABLE OF CONTENTS

1. [VOYAGE CREATION (Phase 1 & 2)](#1-voyage-creation)
2. [PUBLIC PAGES & DISCOVERY](#2-public-pages)
3. [CLIENT/BOOKING FLOW](#3-clientbooking-flow)
4. [PRO DASHBOARDS](#4-pro-dashboards)
5. [DATABASE ENTITIES](#5-database-entities)
6. [MARKETING & OPERATIONS](#6-marketing--operations)
7. [UI SPECIFICATIONS](#7-ui-specifications)
8. [VALIDATION & GATES](#8-validation--gates)

---

## 1. VOYAGE CREATION

### Phase 1: On-Site + Accommodation + Meals

**Duration:** Full trip definition + supplier setup  
**Owner:** Creator (sometimes also Independent)

#### Key Features:

**1.1 Draft vs Submission**
- **DRAFT mode:** Accessible even if pro not validated (training)
- **"Send Phase 1" button:** LOCKED until:
  - Pro validation status = VALIDATED
  - Non-salariat declaration signed
  - RC Pro APPROVED & not expired
  - Charte Eventy signed
  - SIRET/RNA valid

**1.2 Submission Flow**
- Submission → OpsVoyageAdmin + TransportAdmin (parallel validation)
- Status changes to: PHASE1_SUBMITTED
- Snapshot created + timestamped
- Pro sees "En validation" badge

**1.3 Key Fields (Phase 1 Form)**

| Section | Elements |
|---------|----------|
| **Trip Basics** | Title, promise statement, destination, start/end dates, duration |
| **Accommodation** | Hotel selection, room types, price TTC per room, person |
| **Meals** | Included by default (non-modifiable in MVP), breakfast/lunch/dinner |
| **On-Site Schedule** | Daily program (jour par jour), afternoon/evening bus tours |
| **Tour Stops (on-site)** | Afternoon: 3-6 stops; Evening: 2-3 stops (subset of afternoon) |
| **Pickup Points** | Selection of departure points + windows |
| **Media** | Trip video (tripVideoUrl), independent video, photos (5+ required) |
| **Contact** | Independent assigned to trip (Trip.contactIndeId) |
| **Rotation** | rotationCount (default 5, max 10), occurrence dates (optional, autosave) |

**1.4 Trip Video Specification**
- **Fields:** tripVideoUrl (YouTube), tripVideoType, tripVideoCaption
- **Types:** CREATOR_TESTIMONY, INDE_TESTIMONY, PROMO, DRONE
- **Embed:** YouTube no-cookie + GDPR 2-click consent
- **Fallback:** Photo gallery (5+ images) if no video
- **Caption:** Max 120 chars

**1.5 Description Structure (Modules)**
Displayed in order:
1. Presentation (text)
2. Highlights (bullets)
3. Included/Not included (checklist)
4. Accommodation (summary + photos)
5. Meals + **BAR** option (new)
6. Program (day by day, optional)
7. Activities (list)
8. Practical info (meeting, luggage, docs)
9. Conditions/Policies (cancellation, insurance)

**1.6 Quality Score Gate**
- Minimum quality threshold to publish (PREANNOUNCE)
- Components: cover photo + 3 photos, description min chars, modules filled, transport info, Phase 2 validated stops
- Quality bar visible to creator

**1.7 Experience Tags (10 seed options)**
- Multi-select: 1-3 tags max per voyage
- Options: INSOLITE, LOCAL, EXCLUSIF_EVENTY, NATURE_SAUVAGE, FAMILLE, SENIOR_FRIENDLY, JEUNES_ADULTES, ACCESSIBLE_PMR, WEEKEND, IMMERSION
- Used for: badges, catalog filters
- Admin can modify

**1.8 Uniqueness Fields (NEW)**
- uniquePlaceDescription (max 300): "What makes this place special"
- uniqueWhyNotElsewhere (max 300): "Nowhere else to find it because..."

**1.9 Bar Enhancement (NEW)**
- barEnabled: Boolean
- barCreatorNote (max 200): "The evening spot where..."
- barPhoto: 1 ambiance image
- barGoogleMapsUrl: If bar separate from hotel

**1.10 Activities Enhancement (6 NEW fields)**
- activityName (existing)
- activityDescription (max 200)
- activityDuration (e.g., "2h")
- activityMeetingPoint (max 150)
- activityBringList (max 200): "What to bring: hiking shoes..."
- activityPhoto: 1 illustrative image
- activityIncluded: Boolean (included or optional)

**1.11 Rotation Planning (PATCH V85)**
- Creator chooses rotationCount (default 5, configurable, max 10)
- Occurrence dates optional in Phase 1 (autosave, e.g., 52 weeks/year)
- Instances auto-archive at end of period (reusable, reschedule)
- One independent **per occurrence** (rotation)

---

### Phase 2: Pickup Routes + Transport

**Duration:** Specialized transport/logistics definition

**2.1 Pickup System (PATCH V75)**
- Creator must have **min 5 pickup points** (setting)
- In voyage: choose **1 arrival** + **1–10 departures**
- **MUST be VALIDATED by TransportAdmin before Phase 2 validation**

**2.2 Route Planning**
- Instead of individual stops: select **named routes** (e.g., "Justine" = 8 ordered stops)
- Creator chooses **N routes** (N = rotationCount, default 5, max 10)
- Auto assignment: occurrenceIndex % N (cycle)
- Manually set: stop times + arrival time (for transport quotes)

**2.3 Transport Validation Gates**
- **FEU 2 (Tech):** Transport capacity, rotation feasibility, schedules
- **FEU 3 (Cost):** RFQ express, confidential margins, safety margins

**2.4 Pickup Point Details (PATCH V75)**
- From page 151: BusStop model
- Each stop: name, address, hours, photos (3-5)
- Accessibility tags
- "Things to do around" (differentiator) — 2-3 bullets
- Mini interactive map + Google Maps link
- Status badges: "Provisional hours" / "Confirmed hours"

---

## 2. PUBLIC PAGES

### 2.1 Public Homepage / Catalog (`/voyages`)

**Owner:** Client UI  
**Key Purpose:** Discovery, filtering, proximity-based search

#### Sections:
1. **"Around you"** (GPS priority) — auto-closest pickup point
2. **New:** "Unusual places" (INSOLITE tag filter)
3. **New:** "Found nowhere else" (EXCLUSIF_EVENTY tag)
4. **New:** "For all ages" (sub-sections FAMILY/SENIOR/JEUNES)
5. **New:** "Short trips & weekends" (WEEKEND tag)
6. **New:** "Local immersion" (IMMERSION + LOCAL tags)

#### Filter Chips (7 total, fixed order):
1. Around you (proximity)
2. Region
3. Date
4. Budget
5. Duration
6. Theme
7. **NEW:** Experience (multi-select from 10 tags)

#### Card Display:
- Pickup point (closest, auto)
- Dates
- Price TTC
- Badge: "Departure confirmed"
- **NEW:** Experience tags (max 2 visible + "+N")
- **NEW:** Gold badge "Coup de cœur Eventy" if featured

#### Sorting:
- Default: Proximity (changeable to date/price)

---

### 2.2 Pro/Independent Public Page (`/p/[proSlug]`)

**Owner:** Pro UI  
**Key Purpose:** Vendor presence, trip showcase, lead capture

#### Hero Section:
- Name + photo
- Tagline: "Near you"
- Public city (if filled)
- Short description
- **Video:** YouTube (non-indexed) → nocookie embed + GDPR 2-click consent

#### My Trips Section (`#voyages` anchor):
- Cards: closest pickup, date, price TTC
- CTA: **Reserve** + **Program** + **Contact**
- "See trips" button → auto-scroll #voyages

#### Info Block:
- Role(s) — creator/inde/seller
- Trainings (future badge)
- Networks (simple icons)

#### Actions (0 friction):
- Call button reveals number (anti-spam)
- **Be reminded** form (lead opt-in RGPD) → notifies pro + email
- **Share buttons** + text template
- WhatsApp direct link

#### Rules:
- Phone visible IF publicPhoneEnabled = true
- No geolocation auto — creator manages
- Email opt-in max 1/week + auto-unsubscribe
- Attribution: LAST-TOUCH via /p/[proSlug] (PRO_PAGE), seller links (SELLER_LINK), store QR (STORE_QR)

---

### 2.3 Public Trip Page (`/voyages/[id]`)

**Owner:** Client UI  
**Phase:** Visibility depends on status (PREANNOUNCE vs BOOKABLE)

#### Hero (Decision in 10s):
- Title + 1-line promise
- Status badge: "Departure confirmed"
- Price TTC (per room, "from X if variations")
- Dates + duration + destination
- **PRIMARY CTA:** Reserve
- **Secondary CTAs:** Receive program, Be reminded, Share ("I'm going to...")

#### Videos (Visible without scroll):
1. **Trip hero video** (TravelHeroVideo)
   - Presenter testimony or destination intro
   - Auto-mute, pause on scroll-out
2. **Independent hero video** (HostIntroVideo)
   - Personal intro from field manager

**Buttons below videos:** Follow independent · Share · Message/Call/WhatsApp (if allowed)

#### Pickup (Priority #1):
- Closest point auto-detected (geoloc/city)
- Changeable button
- Details: time/window, address, instructions
- **Visibility:**
  - PREANNOUNCE: zones/cities only, no stop details
  - BOOKABLE: full details, interactive map, stop photos, consignes

#### Program (Visible, non-PDF required):
- Summary + day-by-day
- **Toggle admin:** programmeEnabled (default OFF MVP)
- If ON: timeline (Matin / Midi / Après-midi / Soir) with icons + descriptions

#### On-Site Tour (Afternoon/Evening):
- Afternoon: 3-6 stops
- Evening: 2-3 stops (subset of afternoon)
- Each stop: what to do, practical info (filled by creator)

#### Accommodation & Meals:
- **Hotel:** type/comfort, room info
- **Meals:** included statement (non-modifiable MVP)

#### Relationship Block ("Your team on this trip"):
- **Creator:** photo + name + bio + "Why I created this trip" (creatorWhyMessage)
- **Independent(s):** photo + name + bio
- Trust badge: count trips accompanied
- CTA: Be reminded / WhatsApp

#### Waylist (NEW, PATCH V99):
- Only when BOOKABLE & occurrence full
- Hold 24h for next person (config admin)
- If expires, passes to next in queue
- Admin can override

#### Conditions & Cancellation (Legal FR):
- Visual policy summary (J-60 / J-30 / J-15 / J-7)
- Mention: "No withdrawal right (art. L221-28 C.conso)"
- Link to full CGV

#### Insurance (Info précontractuelle):
- Summary if activated + IPID link
- Mention: "Optional, details at checkout"
- Hidden if no insurance

#### Experience Tags Display:
- Badges under title: INSOLITE 🔑, LOCAL 📍, EXCLUSIF_EVENTY ⭐, NATURE_SAUVAGE 🌿, FAMILLE 👨‍👩‍👧, SENIOR_FRIENDLY ☕, JEUNES_ADULTES ⚡, ACCESSIBLE_PMR ♿, WEEKEND 📅, IMMERSION ❤️

#### Featured Trips (Coup de cœur Eventy):
- Gold badge on card
- Admin Marketing selects 3–6 max
- Dedicated section at top of /voyages + homepage
- Source: enableFeaturedTrips + maxFeaturedTrips (Settings)

#### Bar Enrichment (On public page):
- Badge: "Eventy clients welcome" (no rate/discount mentioned)
- Type bar + hours + ambiance photo
- Creator note (if filled)
- Google Maps link (if bar separate from hotel)

#### Restaurant Partner (On public page):
- Name + cuisine type + photo + hours
- Restaurateur message (creator-approved, 1 click)
- Meeting point + instructions + allergen mention
- Veggie/vegan icons if applicable
- Badge if meals included: "Full board"

#### Paid Departure Confirmation:
- **Badge visible** if status = CONFIRMED
- **Auto-confirm** when minPax reached (counter: PAID_CONFIRMED by default)
- Admin can switch counter to RESERVED instead
- Display: "Departure confirmed from X paid travelers (currently Y paid)"
- If not confirmed: show progress Y/X

#### SEO & Social Enrichment:
- Breadcrumb: /voyages > {destination} > {trip title}
- JSON-LD: TravelAction + Event schema
- Meta OG: title, description, hero image, price
- Shareable QR (downloadable)
- Counter: "X interested" (pageViews + leads)
- Share buttons: WhatsApp / Facebook / Copy link

#### Hidden from Client:
- Transport costs, quotes, margins, prices for suppliers, internal logic

---

### 2.4 "Notify Me" Flow (`/voyages/[id]` — PREANNOUNCE only)

**Owner:** UI Lead Capture  
**Phase:** MVP Rules

#### CTA:
- "Be notified" button (PREANNOUNCE phase)

#### Form:
- Email (required)
- Phone (optional)
- Preferred departure city (optional)
- GDPR consent (required)

#### Rules:
- Anti-duplicate: 1 lead per travelId + email
- No marketing email without consentAt
- Source tracking: PUBLIC_PAGE, SHARE, QR, ADS

#### Confirmation:
- Message + button "Share the trip"

#### Future:
- Segment by departure city + occurrence
- Auto-relances if BOOKABLE (J-7, J-1)

---

## 3. CLIENT/BOOKING FLOW

### 3.1 Journey Map (`/voyages` → `/voyages/[id]` → `/checkout`)

**Owner:** Client (public user or logged-in)

#### Stage 1: Discover (Homepage `/voyages`)
- **"Around you" (priority #1):** GPS/city input or "Locate me"
- Filter chips (region, date, budget, duration, theme, experience)
- Card view: nearby pickup, dates, price, badges
- Tri par défaut: Proximity (changeable to date/price)
- Number of travelers (input)

#### Stage 2: View Trip (`/voyages/[id]`)
- Full program, accommodations, meals, video, team
- See pickup points in detail (map, photos, hours)
- Share options ("I'm going to...")
- If PREANNOUNCE: "Be notified" CTA only
- If BOOKABLE: "Reserve" CTA

#### Stage 3: Checkout (`/checkout`)
- Room selection (type, TTC price, availability)
- Participants & payment split options:
  - A) I pay everything (1 payment)
  - B) Split payment: each pays their share (link per co-payer)
  - C) I pay 2 shares + invite 3rd to pay (mix)
  - D) I pay then reimburse from others (outside system)
- Room HOLD: 45 min default (configurable)
- Statuses: HOLD → PARTIALLY_PAID → PAID_CONFIRMED; else EXPIRED
- Invite links expire (same duration as HOLD)
- Equal parts in MVP (price/places)

#### Stage 4: Confirmation + Handoff
- Confirmation + info to independent/creator
- Ramassage chosen + nb voyageurs + contacts transmitted
- Client sees: status + documents (in `/client/réservations`)

#### Stage 5: Post-Voyage
- Share media (photos/videos) with consent
- Feedback/testimonials (future)

### 3.2 Itinerary Routes (Client Portal)

| Route | Purpose |
|-------|---------|
| `/voyages` | Trip listing (all departures confirmed) |
| `/voyages/[id]` | Full trip detail (program, booking) |
| `/checkout` | Payment + room selection |
| `/client/réservations` | Booking status + documents |
| `/compte/groupes` | **NEW:** "My groups" list (FORMING/HOLD/CONFIRMED/EXPIRED) |
| `/groupe/[code]` | Group dashboard (NEW V303) |

### 3.3 Client Channels

- **Message/call** to creator/independent (before, during, after trip)
- **Logistics:** Organization independent/creator receives: pickup chosen + count + contacts
- **Cancellation policy:** Terms visible pre-checkout

---

## 4. PRO DASHBOARDS

### 4.1 Creation Dashboard (`/pro/voyages/nouveau`)

**Owner:** Creator/Independent

#### Sections:
1. **Trip basics:** Title, promise, destination, dates
2. **Pickup points:** Selection + time windows
3. **Program:** Day-by-day + on-site stops
4. **Accommodation:** Type + room info
5. **Meals:** (Included, non-modifiable MVP)
6. **Media:** Trip video + indie video (editable post-creation)

#### Button States:

**Save (DRAFT)**
- Always available
- Allows training/testing even if not validated

**Send Phase 1** (Submission)
- **LOCKED (with explanation + shortcuts) if:**
  - Pro validation ≠ VALIDATED
  - Non-salariat declaration not signed
  - RC Pro not approved/expired
  - Charte Eventy not signed
  - SIRET/RNA invalid
- **ACTIVE if all conditions met**
- Help text: "Training mode: create and test your trip. To submit for validation: complete prerequisites above."

#### Dynamic Sections:
- **Prerequisite: Accommodation** (if required)
  - ≥1 Hotel Block in HOTEL_SUBMITTED or ACTIVE state
- **Contact selection:** Choose 1 independent terrain (searchable, max 1)
  - Saves to Trip.contactIndeId
  - Public phone display only if inde.tripPhonePublicEnabled = true

#### Actions:
- ➕ **Create trip**
- 🏠 **Home**
- 💶 **Revenues** (commissions)
- 📄 **Docs/Signature**
- 🛟 **Support**
- 🧾 **Validation**
- **Studio IA Video** (1 click)
- **Timeline** (V310)
- **Preview** (fiche voyage)
- **Sell** (SELLER auto) → /pro/vendeur/campagnes
- **Duplicate this season** (PATCH V103) — copies fiche, modules, safety, settings, rotationCount; regenerates 52 occurrences + dates; status DRAFT

---

### 4.2 Trip Dashboard (`/pro/voyages/[id]`)

**Owner:** Creator / Independent / OpsVoyageAdmin

#### Routes (Suggested):
- `/pro/voyages/[id]` — Main dashboard
- `/pro/voyages/[id]/clients` — Bookings/communication
- `/pro/voyages/[id]/chambres` — Rooms + rooming
- `/pro/voyages/[id]/hotel` — Hotel confirmations
- `/pro/voyages/[id]/ramassage` — Pickup organization
- `/pro/voyages/[id]/medias` — Video/photo management

#### A) Clients & Communication
- Booking list + status
- Payment status (per room: partial/confirmed)
- Actions: message/call/WhatsApp (if allowed)
- CSV export

#### B) Rooms & Rooming List
- Booked rooms + occupants
- Payments received vs pending (contributions)
- Export rooming list (PDF/CSV)
- Status: "Sent to hotel" / "OK" / "ANOMALY"

#### C) Hotel — Anomaly Control
- "Hotel confirmations" block:
  - Rooming list to send
  - Hotel return: OK / ANOMALY + comment
  - Internal correction ticket if anomaly

#### D) Pickup & Organization
- Recap by pickup point (chosen by clients)
- Totals per point + instructions

#### E) Media Management
- Trip video (editable while Phase 1 not validated)
- Independent video (editable even post-validation)
- **(Future)** versioning/history

#### Sidebar Menu:
- ✅ Onboarding
- ➕ Create trip
- 🏠 Home
- 💶 Revenues
- 📄 Docs/Sign
- 🛟 Support
- 🧾 Validation

---

### 4.3 Marketing Hub (`/pro/marketing`)

**Owner:** Creator/Independent/Seller

#### Overview:
PRO drafts campaigns + content + template selection + voyage kits  
Admin Marketing validates before publication  
MVP Channels: Site + Email + Social (copy/paste, no API)  
MVP Tracking: shortlink/QR + UTM → last-touch attribution + stats

#### Sections:

1. **Campaign Manager**
   - Drafts (campaigns + texts + template selection)
   - Campaign targets: Eventy brand, specific voyage, personal pro page
   - Selection: A) Eventy brand, B) Exact voyage, C) /p/[proSlug]

2. **QR/Flash + Link Generator**
   - Tracked link (UTM)
   - Printable QR + social QR
   - Per pro + per voyage
   - Targets: pro page (priority) / voyage / landing
   - Modes: QR by PRO + QR by VOYAGE

3. **Template Manager**
   - Library: assets + versions
   - Pre-made: IG/Facebook/TikTok/WhatsApp posts, stories, reels
   - Scripts + objections + flyers/posters
   - Auto-personalized (pro name + link/QR + zone + voyage)

4. **Print Pack**
   - Flyers/posters (terrain)
   - Starter: 5000 flyers + 100 posters
   - Dispatch: per role (after printer validation)
   - Zones: pickup locations first
   - Boutique fournitures (subcontracted) — catalog + lots

5. **Media & Rights**
   - Upload video/photo
   - Tagging (voyage, day)
   - Client memory + marketing (if consent)
   - Auto-moderation (MVP) + audit data

6. **Reporting**
   - Global KPIs: clicks, leads, conversions, commissions
   - Zone performance (natural selection data)
   - Conformity rules: legal mentions + light validation

#### Outputs:
1. **QR/flash + tracked link** — per pro, per voyage, UTM + ID
2. **Print pack** — flyers + posters, 5000 starter (branded), pro/voyage versions
3. **Social pack** — posts + stories/reels + scripts, link/QR config
4. **Media memory** — voyage photos/videos, reusable marketing (consent)
5. **Supplies boutique** — kits (digital + merch/textile/signage), admin-validated

---

## 5. DATABASE ENTITIES

### 5.1 Core Entities (Voyage/Trip)

From page 08_DB_Catalog_V15:

| Entity | Description | Relationships |
|--------|-------------|-----------------|
| **Travel** | Trip definition | 1-n TravelDayPlan, 1-n Occurrence |
| **TravelDayPlan** | Daily agenda (morning/lunch/afternoon/evening) | 1-1 Travel |
| **TripOccurrence** | Instance of trip (specific dates) | 1-1 Travel, 1-n Inventory |
| **PickupPoint** | Departure point (location) | 0-n Trip |
| **OnSiteStop** | Afternoon/evening bus stops | 1-1 TravelDayPlan |
| **ProProfile** | Creator/independent profile | 1-n Travel |
| **ProPublicPage** | /p/[proSlug] page | 1-1 ProProfile |
| **Transport** | Pool (logistics) | 1-n TransportRequest, TransportQuote |
| **TransportRequest** | Brief to carriers | 1-1 Travel |
| **TransportQuote** | Cost/capacity from carriers | 1-1 TransportRequest |
| **Supplier** | Hotel, restaurant, bar partners | 1-n SupplierInvoice |
| **SupplierInvoice** | Monthly invoices (NET30 EOM) | 1-1 Supplier |
| **Booking** | Client reservation | 1-1 TripOccurrence, 1-1 User |
| **Availability** | Room inventory | 1-1 TripOccurrence |
| **Incident** | Anomaly reports | 1-1 Travel or TravelDayPlan |
| **MealDeclaration** | Meals served (per supplier, per day) | 1-1 Travel, per service |
| **MealReconciliation** | Meal discrepancy checks | 1-1 MealDeclaration |
| **MediaAsset** | Photos/videos | 0-n Travel, ProPublicPage |
| **MessageThread** | Comms client ↔ pro | 1-1 Booking |
| **Template** | Email/SMS/social templates | 1-n TemplateRender |
| **TemplateRender** | Personalized output | 1-1 Template |
| **QrFlashAsset** | QR codes + shortlinks | 1-1 Travel or ProPublicPage |
| **MarketingCampaign** | Campaign definition | 1-n TrackingLink |
| **TrackingLink** | UTM link tracking | 1-1 MarketingCampaign, 1-n ClickEvent |
| **ClickEvent** | User interaction logging | 1-1 TrackingLink |
| **ShareEvent** | Social share tracking | 1-1 Travel, 1-1 User |
| **Leads** | Notify me form capture | 1-1 Travel |
| **Consent** | GDPR opt-in tracking | 1-1 User |
| **PaymentRun** | Batch payment (NET30 EOM) | 1-n SupplierInvoice |
| **ProFeesLedger** | Management fee ledger | 1-1 ProProfile |
| **AccountingExport** | Accounting data exports | 1-1 PaymentRun |
| **ChangeRequest** | Modification requests | 1-1 Travel + 1-1 User (requester) |
| **Validation** | Phase 1/2 approval statuses | 1-1 Travel |
| **CallRequest** | Contact/callback requests | 1-1 Travel, 1-1 User |

---

### 5.2 Payment & Financial Entities

| Entity | Description |
|--------|-------------|
| **PaymentRun** | Batch monthly payments to suppliers |
| **SupplierInvoice** | Monthly invoices with NET30 EOM due |
| **ProFeesLedger** | Management fee tracking per creator |
| **AccountingExport** | Zero-data-entry export to accounting |
| **Forfaits** | Management fee packages (future) |

**Rules:**
- Suppliers invoice end-of-month + NET30 due
- Eventy pays NET30 end-of-month
- **No manual entry required** (scalable automation)

---

## 6. MARKETING & OPERATIONS

### 6.1 Marketing Pack Distribution

**Dispatch Rules:**
- **Creators/Indies:** Pack included via droit d'entrée (entry fee)
- **Sellers:** Packs at cost
- **Quantities:** Per printer-validated packs

**Starter Pack:**
- 5,000 flyers
- 100 posters
- Delivery/dispatch to pickup zones first

---

### 6.2 Tracking & Attribution

**Channels:**
- `/p/[proSlug]` (PRO_PAGE)
- Seller links (SELLER_LINK)
- Store QR (STORE_QR)

**Attribution Model (MVP):**
- **LAST-TOUCH** (configurable by admin)
- Stored in cookie/token
- Recorded at first booking
- No "seller code" at checkout (attribution via link/QR only)
- Campaign: optional (null if direct link)

---

### 6.3 KPI Tracking

- **Clicks** on shortlinks
- **Leads** (program/reminder form)
- **Reservations** (bookings)
- **Commissions** (seller split)
- **Zone performance** (natural selection data)

---

## 7. UI SPECIFICATIONS

### 7.1 Visibility Phases

#### PREANNOUNCE (Phase 2 Transport validated)
- **Public:** Page visible, share OK, notifications only (no booking)
- **Client connected:** Same + can save/set alerts
- **Independent:** Can share/prospect + view stats
- **Stop details:** Zones/cities only, no full details
- **CTA:** "Be notified" button

#### BOOKABLE (Phase 2 fully validated + FEU 2/3 passed)
- **Public:** Full page visible, **booking open**
- **Stop details:** Full stops with map, photos, instructions
- **Occurrence selection:** Available + dates visible
- **CTA:** "Reserve" button

**Transition Rule:** Phase 1 validated ≠ public. Must complete Phase 2 Transport validation.

---

### 7.2 Sticky/Mobile UI

**Mobile:**
- Sticky bottom bar: Price "from X" + "Reserve" button
- If full → "Waitlist"
- If PREANNOUNCE → "Be notified"

**Desktop:**
- CTA visible in sidebar (non-sticky)

---

### 7.3 Quality Score

**Components evaluated:**
- Cover photo ✓
- 3+ photos ✓
- Description min chars ✓
- Modules filled (included/not, activities, bar, etc.) ✓
- Transport: occurrences + rotationCount ✓
- Phase 2: stops validated ✓

**Publication gate:** Quality < threshold blocks PREANNOUNCE (admin configurable)

---

## 8. VALIDATION & GATES

### 8.1 Phase 1 Validation (Ops + Transport)

**FEU 1 (Ops Voyage Service):**
- Program coherence + quality + suppliers + meals OK/to correct
- On-site reference: creator/indie present + travelers + hotel/external coherence

**Transport Service:**
- On-site coherence: tours logical
- Travel time on-site: zones near food OK/to correct

**Outputs:**
- Approvals or corrections back to creator

---

### 8.2 Phase 2 Validation (Transport Pool)

**FEU 2 (Technical):**
- Pickup routes + rotations + schedule feasibility
- Bus capacity match

**FEU 3 (Cost):**
- RFQ express
- Confidential margins + safety margins

**Outputs:**
- FEUX OK → trip publishable as public

---

### 8.3 Publishing Gates

**Before PREANNOUNCE:**
- Phase 1 Validated ✓
- Quality score ≥ threshold ✓
- SEO: travelSlug + departureCityLabel ✓
- Safety sheet (if enabled) ✓

**Before BOOKABLE:**
- Phase 2 Transport VALIDATED ✓
- Departure not yet DECIDED (stays FORMING until minPax reached)
- Occurrence selection enabled

**Departure Confirmation:**
- Auto-triggers when minPax reached (default: paid travelers count)
- Admin can switch to RESERVED count instead
- Display: "Confirmed from X paid (currently Y paid)" with progress bar

---

### 8.4 Blocking Conditions

Pro cannot send Phase 1 if:
- ProValidation ≠ VALIDATED
- Required docs not signed (non-salariat, etc.)
- RC Pro not approved/expired
- Charte Eventy not signed
- SIRET/RNA invalid
- Accommodation module incomplete (if required)

**UI:** Buttons + shortcuts to complete each requirement

---

## 9. MISCELLANEOUS

### 9.1 Meals Management (MVP)

**Supplier Flow:**
- End-of-day declaration: quantities served per service (breakfast/lunch/dinner)
- Creator/indie on-site validates/adjusts
- **Auto-control:** qtyServed ≤ nbTravelers (per day/service)
- Discrepancy → auto-incident
- Recurring issue → contract end (rule configurable)

---

### 9.2 Change Requests

**Workflow:**
- Creator → request modification (Voyage + Transport)
- Minimum delay (configurable)
- Approval → new version created
- Simple MVP: creator validates (if recurrence: Eventy contract end)

---

### 9.3 Insurance

**MVP — Fixed Price:**
- Plan STANDARD (unique) locked per voyage
- costPaxFixe€ configured Admin Finance
- Variable (risk/age/duration) = V1+

---

### 9.4 Group Management (NEW — V303)

**Route:** `/compte/groupes`  
**Card display:**
- Trip name
- Code
- Status: FORMING / HOLD_ACTIVE / CONFIRMED / EXPIRED
- Colored badges per status
- CTA: "See group" → `/groupe/[code]`
- CTA: "Create group" → trip page

**Menu:** "My groups" + counter badge

---

### 9.5 Independent Public Phone Option

**Rule:**
- Independent has setting: tripPhonePublicEnabled (Boolean)
- If true: phone displays on public trip page
- If false: remains internal (visible to admin/pro only), client sees "Contact via form"
- Creator can select 1 indie per trip (Trip.contactIndeId)

---

## APPENDIX: KEY IMPROVEMENTS/PATCHES REFERENCED

| Patch | Focus | Impact |
|-------|-------|--------|
| **V75** | Bus stops (pickup validation) | Phase 2 arrival/departures (1 arrival, 1-10 departures) |
| **V85** | Rotations + occurrences + profile photo | Phase 1: rotationCount + dates; Phase 2: auto-assignment cycles |
| **V87** | UI exact screens Phase 1/2 | Description toolbar + quality bar + 52 occurrences + rotationCount in P1 |
| **V88** | Structured description + modules + bar | Inclus/non-inclus, activities, bar enrichment, experience tags |
| **V89** | Public trip page exact | Hero videos, pickup enriched, activities, bar, restaurant, tags, SEO |
| **V99** | Waitlist + min pax + departure confirm | Waitlist (24h hold), minPaxToGo, decisionDeadlineAt, auto-confirm |
| **V101** | Publishing gates + quality score | SEO slugs, quality threshold, marketing toggles, featured trips |
| **V102** | Safety form submission | Creator can submit Phase 1 even if incomplete; admin requires completion for validation |
| **V103** | Duplicate season | Copy voyage + regenerate 52 occurrences |
| **V215** | Featured trips settings | enableFeaturedTrips, maxFeaturedTrips (3-6) |
| **V216/V217** | Why message + contact settings | creatorWhyMessage, contact CTA, WhatsApp option |
| **V218/V221** | Independent per occurrence | 1 indie/occurrence, rotation, planning conflicts (MVP warning, not blocking) |
| **V303** | Group management | `/compte/groupes` list + create |
| **V515** | Document requirements | RC Pro APPROVED, Charte Eventy signed, SIRET/RNA valid for Phase 1 submit |

---

## SUMMARY STATS

- **Total Core Pages Analyzed:** 9 (creation, catalog, public, pro dashboard, execution, visibility)
- **Specialized UI Pages:** 4 (exact screens, notify-me, phase 1/2, visibility matrix)
- **Database Entities Referenced:** 40+
- **Voyage Statuses Tracked:** DRAFT → PHASE1_SUBMITTED → PHASE1_VALIDATED → PHASE2_SUBMITTED → PHASE2_VALIDATED → PREANNOUNCE → BOOKABLE → CONFIRMED/NO_GO
- **Validation Gates:** 6+ (FEU 1, FEU 2, FEU 3, Quality score, Safety, Publishing)
- **Languages/Regions:** French throughout (EUR/TTC prices, French law terms)

---

**END OF EXTRACTION**  
Generated: 2026-03-18  
Source file: `/sessions/brave-admiring-bell/mnt/eventisite/eventy_v53_COMPLET_PRET_CODAGE.drawio`

