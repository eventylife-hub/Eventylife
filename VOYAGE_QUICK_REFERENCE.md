# EVENTY VOYAGE PAGES — QUICK REFERENCE GUIDE

**Date:** 2026-03-18  
**Purpose:** Quick lookup for voyage feature specifications

---

## PUBLIC CATALOG PAGE (`/voyages`)

### 6 New Sections (Shopping Cart Discovery)
```
1. Around you        (GPS-based proximity)
2. Unusual places    (INSOLITE tag)
3. Found nowhere else (EXCLUSIF_EVENTY tag)
4. For all ages      (FAMILLE/SENIOR/JEUNES sub-sections)
5. Short trips       (WEEKEND tag)
6. Local immersion   (IMMERSION + LOCAL tags)
```

### 7 Filter Chips
```
Around | Region | Date | Budget | Duration | Theme | [NEW] Experience
```

### Card Display
```
[Image - Profile Photo]
📍 Closest pickup point (auto)
📅 Dates
💰 Price TTC
✓ Departure confirmed (badge)
🏷️ Experience tags (max 2 + "+N")
⭐ Coup de cœur Eventy (gold badge if featured)
```

---

## PUBLIC TRIP PAGE (`/voyages/[id]`)

### Hero (10-second decision)
```
🎯 TITLE + Promise
📍 Destination
📅 Dates • Duration
💰 Price TTC (from X if variations)
⭐ Departure confirmed badge
[RESERVE] [Program] [Notify] [Share]
```

### Video Section (No Scroll Needed)
```
🎬 Trip Hero Video (creator/drone/promo)
   - YouTube nocookie + GDPR 2-click consent
   - Auto-mute, pause on scroll-out
   - Fallback: 5+ photo gallery

👤 Independent Intro Video
   - Personal message from field manager
```

### Key Blocks (In Order)
```
1. PICKUP (Priority #1)
   - Auto-closest point (geoloc/city)
   - Changeable
   - PREANNOUNCE: zones only | BOOKABLE: full details
   
2. PROGRAM (Day-by-day)
   - Summary + toggle admin programmeEnabled
   - Timeline: Matin / Midi / Après-midi / Soir
   
3. ON-SITE TOURS
   - Afternoon: 3-6 stops
   - Evening: 2-3 stops (subset of afternoon)
   
4. ACCOMMODATION
   - Type/comfort + room types
   - Price TTC per room
   
5. MEALS
   - Included (non-modifiable MVP)
   
6. YOUR TEAM
   - Creator: photo + name + bio + "Why I created"
   - Independent(s): photo + name + bio
   - Trust badge: trips accompanied
   - CTA: Be reminded / WhatsApp
   
7. BAR PARTNER [NEW]
   - Badge: "Eventy clients welcome"
   - Type + hours + ambiance photo
   - Creator note + Google Maps link
   
8. RESTAURANT PARTNER [NEW]
   - Name + cuisine + photo + hours
   - Meeting point + instructions
   - Allergen mentions + veggie icons
   - "Full board" badge if included
   
9. ACTIVITIES [NEW]
   - Name + description (max 200)
   - Duration + meeting point
   - What to bring + photo
   - Included / Optional badge
   
10. WHY UNIQUE [NEW]
    - "What makes this place special" (max 300)
    - "Nowhere else to find it because..." (max 300)
    
11. EXPERIENCE TAGS [NEW]
    INSOLITE 🔑 | LOCAL 📍 | EXCLUSIF ⭐ | NATURE 🌿 | FAMILLE 👨‍👩‍👧
    SENIOR ☕ | JEUNES ⚡ | PMR ♿ | WEEKEND 📅 | IMMERSION ❤️
    
12. CONDITIONS & CANCELLATION
    - Policy summary (J-60 / J-30 / J-15 / J-7)
    - "No withdrawal right" mention
    - Full CGV link
    
13. INSURANCE
    - Summary + IPID link
    - "Optional, details at checkout"
    
14. SEO & SOCIAL
    - Breadcrumb: /voyages > Destination > Trip Title
    - JSON-LD: TravelAction + Event
    - Meta OG: title, description, image, price
    - Shareable QR (downloadable)
    - "X interested" counter
```

### Departure Confirmation Badge
```
PAID COUNTER (default):
"Departure confirmed from X paid travelers (currently Y paid)" [Y/X progress bar]

OR (if admin switches):
"Departure confirmed from X reserved (currently Y reserved)"

Auto-triggers when minPax reached.
```

### Status Visibility
```
PREANNOUNCE (Phase 2 Transport validated):
- Page visible
- Share enabled
- "Be notified" CTA only (no booking)
- Stop details: zones/cities only

BOOKABLE (Phase 2 fully validated + FEU 2/3 passed):
- Full page visible
- "Reserve" CTA enabled
- Stop details: full map + photos + instructions
- Occurrence selection available
```

---

## PRO CREATION PAGES

### `/pro/voyages/nouveau` (Phase 1 Form)

#### Button State Machine
```
SAVE (DRAFT)
  Always available
  Training mode OK

SEND PHASE 1 (Submission)
  LOCKED if:
    ❌ ProValidation ≠ VALIDATED
    ❌ Non-salariat declaration not signed
    ❌ RC Pro not approved/expired
    ❌ Charte Eventy not signed
    ❌ SIRET/RNA invalid
    ❌ Accommodation incomplete (if required)
  
  ACTIVE if all ✓
  Shows reasons + shortcuts to fix each
```

#### Form Sections
```
1. TRIP BASICS
   - Title + promise
   - Destination + dates
   - rotationCount (default 5, max 10)
   - Occurrence dates (optional, autosave)

2. ACCOMMODATION
   - Hotel selection
   - Room types + prices TTC
   - "Included" state (fixed MVP)

3. MEALS
   - Breakfast/Lunch/Dinner
   - Fixed "included" (non-modifiable MVP)

4. PROGRAM (Day-by-day)
   - Daily agenda
   - Afternoon: 3-6 stops
   - Evening: 2-3 stops

5. PICKUP POINTS
   - Select from creator's 5+ configured points
   - MUST be VALIDATED by TransportAdmin

6. MEDIA
   - Trip video (tripVideoUrl, tripVideoType, tripVideoCaption)
   - Photos (5+ required for quality gate)
   - Independent video (editable post-creation)

7. INDEPENDENT CONTACT
   - Select 1 indie (searchable)
   - Saves to Trip.contactIndeId
   - Public phone only if inde.tripPhonePublicEnabled=true

8. DESCRIPTION MODULES [NEW]
   - Presentation (text)
   - Highlights (bullets)
   - Included/Not included (checklist)
   - Activities (list)
   - BAR info [NEW]
     * barEnabled: Boolean
     * barCreatorNote (max 200)
     * barPhoto: 1 image
     * barGoogleMapsUrl: if separate from hotel
   
   - Activities [NEW] (6 fields each)
     * activityDescription (max 200)
     * activityDuration (e.g., "2h")
     * activityMeetingPoint (max 150)
     * activityBringList (max 200)
     * activityPhoto: 1 image
     * activityIncluded: Boolean
   
   - Experience Tags [NEW]
     * Multi-select: 1-3 max
     * 10 options: INSOLITE, LOCAL, EXCLUSIF_EVENTY, NATURE_SAUVAGE,
       FAMILLE, SENIOR_FRIENDLY, JEUNES_ADULTES, ACCESSIBLE_PMR,
       WEEKEND, IMMERSION
   
   - Uniqueness [NEW]
     * uniquePlaceDescription (max 300)
     * uniqueWhyNotElsewhere (max 300)
   
   - Practical info (luggage, docs, etc.)
   - Conditions/policies (cancellation, insurance)
```

#### Submission Result
```
Status: PHASE1_SUBMITTED
Badge: "En validation"
Routes to: OpsVoyageAdmin + TransportAdmin (parallel)
Creator sees: Feedback comments + corrections
```

---

### `/pro/voyages/[id]` (Trip Dashboard)

#### Sub-routes
```
/pro/voyages/[id]           → Main dashboard (overview)
/pro/voyages/[id]/clients   → Bookings + communication
/pro/voyages/[id]/chambres  → Rooms + rooming list
/pro/voyages/[id]/hotel     → Hotel confirmations
/pro/voyages/[id]/ramassage → Pickup organization
/pro/voyages/[id]/medias    → Video/photo management
```

#### A) CLIENTS SECTION
```
- Booking list
- Payment status (per room: partial/confirmed)
- Message/call/WhatsApp actions
- CSV export
```

#### B) ROOMS SECTION
```
- Booked rooms + occupants
- Payments received vs pending (contributions)
- Export rooming list (PDF/CSV)
- Status: "Sent to hotel" / "OK" / "ANOMALY"
```

#### C) HOTEL SECTION
```
- Rooming list to send
- Hotel return: OK / ANOMALY + comment
- Auto-ticket if anomaly
```

#### D) PICKUP SECTION
```
- Recap by departure point
- Totals per point
- Instructions
```

#### E) MEDIA SECTION
```
- Trip video (editable while Phase 1 not validated)
- Independent video (editable even post-validation)
- *Future: versioning/history
```

---

### `/pro/marketing` (Marketing Hub)

#### Sections
```
1. CAMPAIGN MANAGER
   - Draft campaigns + texts + templates
   - Targets: Eventy brand / specific voyage / /p/[proSlug]
   - Admin validation before publication

2. QR/FLASH + LINK GENERATOR
   - Tracked links (UTM)
   - Printable QR + social QR
   - Per pro + per voyage
   - Last-touch attribution

3. TEMPLATE LIBRARY
   - IG/Facebook/TikTok/WhatsApp posts/stories/reels
   - Scripts + objections
   - Flyers/posters
   - Auto-personalized

4. PRINT PACK
   - 5,000 flyers + 100 posters (starter)
   - Per-role dispatch
   - Zones: pickup locations first

5. MEDIA & RIGHTS
   - Upload photos/videos
   - Tagging (voyage, day)
   - Consent-based marketing usage

6. REPORTING
   - Clicks + leads + conversions
   - Zone performance
   - Commissions tracking
```

#### Outputs
```
• QR/shortlink + UTM tracking
• Print pack (branded flyers/posters)
• Social pack (posts + scripts + link/QR)
• Media memory (consent-based reusable assets)
• Supplies boutique (digital + merch)
```

---

## PHASE 2: PICKUP ROUTES

### Requirements
```
✓ Creator must have min 5 pickup points configured
✓ In voyage: select 1 arrival + 1-10 departures
✓ Each stop MUST be VALIDATED by TransportAdmin

[NEW] Named routes instead of individual stops
Example: "Justine" = 8 ordered stops
Creator selects N routes (N = rotationCount, default 5)
Auto-assignment: occurrenceIndex % N (cycle)
```

### Pickup Point Details
```
📍 Name + address
🕐 Hours (provisional → confirmed)
📸 Photos (3-5)
♿ Accessibility tags
🎯 "Things to do around" (2-3 bullets) — Eventy differentiator
🗺️ Mini interactive map + Google Maps link
```

### Validation Gates
```
FEU 2 (Technical):
  - Transport capacity + rotation feasibility
  - Schedule coherence

FEU 3 (Cost):
  - RFQ express
  - Confidential margins + safety margins

Result: FEUX OK → Trip becomes PUBLIC + BOOKABLE
```

---

## CLIENT BOOKING FLOW

### `/voyages` (Discover)
```
1. GPS or "Around you"
2. Filter by: region, date, budget, duration, theme, experience
3. Sort by: proximity (default), date, price
4. Select travelers count
```

### `/voyages/[id]` (View Detail)
```
1. Hero + videos + pickup
2. Program + accommodations + team
3. If PREANNOUNCE: "Be notified" only
4. If BOOKABLE: "Reserve" CTA
```

### `/checkout` (Payment)
```
1. Select room (type + price)
2. Choose payment split:
   A) I pay everything (1 payment)
   B) Split equally (link per person)
   C) I pay 2, invite 3rd
   D) Reimburse outside system

3. Room HOLD: 45 min (configurable)
4. Status: HOLD → PARTIALLY_PAID → PAID_CONFIRMED
```

### `/client/réservations` (Confirmation)
```
- Booking status
- Documents to review
- Contact info
```

---

## VALIDATION FLOW

### Phase 1 Validation (Ops + Transport)

#### FEU 1 (Ops)
```
✓ Program coherence + quality
✓ Suppliers confirmed
✓ Meals logic OK/to correct
✓ On-site reference validated
→ Approve or request corrections
```

#### Transport Service
```
✓ On-site tours logical (afternoon/evening)
✓ Travel times reasonable
✓ Food zone proximity OK
→ Approve or request corrections
```

### Phase 2 Validation (Transport Pool)

#### FEU 2 (Technical)
```
✓ Pickup routes + rotations feasible
✓ Bus capacity matches
✓ Schedule coherent
```

#### FEU 3 (Cost)
```
✓ RFQ express obtained
✓ Margins acceptable
✓ Safety margins included
```

**Result: FEUX OK → Trip publishable**

---

## TRIP VIDEO SPECIFICATION

### Fields
```
tripVideoUrl         String (YouTube URL)
tripVideoType        Enum: CREATOR_TESTIMONY | INDE_TESTIMONY | PROMO | DRONE
tripVideoCaption     String (max 120 chars)
```

### Embed Rules
```
✓ YouTube no-cookie embed
✓ GDPR 2-click consent required
✓ Auto-mute
✓ Pause on scroll-out

Fallback: 5+ photo gallery if no video
Badge: "Vidéo du terrain" if CREATOR_TESTIMONY or INDE_TESTIMONY
```

---

## EXPERIENCE TAGS (10 SEED OPTIONS)

```
🔑 INSOLITE         (Unusual)
📍 LOCAL            (Local)
⭐ EXCLUSIF_EVENTY  (Only on Eventy)
🌿 NATURE_SAUVAGE   (Wild nature)
👨‍👩‍👧 FAMILLE        (Family-friendly)
☕ SENIOR_FRIENDLY   (Senior-friendly)
⚡ JEUNES_ADULTES   (Young adults)
♿ ACCESSIBLE_PMR   (Accessible)
📅 WEEKEND          (Short trip)
❤️ IMMERSION        (Immersion)

Max 3 per voyage
Used for: badges, catalog filters, catalog sections
```

---

## KEY BLOCKERS & GATES

### Phase 1 Submit Button
```
Pro CANNOT send Phase 1 if:
  ❌ ProValidation ≠ VALIDATED
  ❌ Non-salariat declaration not signed
  ❌ RC Pro not approved/expired
  ❌ Charte Eventy not signed
  ❌ SIRET/RNA invalid
  ❌ Accommodation incomplete (if required)

UI: Show reason + shortcut to fix each
```

### Quality Score Gate
```
Publication blocked if quality < threshold (admin configurable)

Components:
  ✓ Cover photo
  ✓ 3+ photos
  ✓ Description min chars
  ✓ Modules filled
  ✓ Transport info (occurrences + rotationCount)
  ✓ Phase 2 stops validated
```

### Departure Confirmation
```
Auto-triggers when minPax reached
Default counter: PAID_CONFIRMED
Admin can switch to: RESERVED

Display: "Departure confirmed from X paid (currently Y paid)"
         or
         "Departure confirmed from X reserved (currently Y reserved)"
```

---

## SPECIAL FEATURES

### "Coup de Cœur Eventy" (Featured Trips)
```
Admin Marketing selects 3-6 max trips
Display:
  - Gold badge on catalog cards
  - Dedicated section at top of /voyages
  - Homepage featured section

Source: enableFeaturedTrips + maxFeaturedTrips (Settings)
```

### Waitlist (PATCH V99)
```
Only when: BOOKABLE + occurrence full
- 24h hold for next person
- If expires, passes to next
- Admin can override
- Source: minPaxToGo + decisionDeadlineAt
```

### Groups (NEW — V303)
```
Route: /compte/groupes
Display:
  - Trip name
  - Code
  - Status: FORMING / HOLD_ACTIVE / CONFIRMED / EXPIRED
  - Color badges
  - CTA: "See group" / "Create group"

Menu badge: counter of active groups
```

### Independent Public Phone
```
Independent setting: tripPhonePublicEnabled (Boolean)

If true:
  → Phone visible on public trip page

If false:
  → Internal only (admin/pro see)
  → Client sees "Contact via form"

Creator selects 1 indie per trip (Trip.contactIndeId)
```

---

## STICKY UI (MOBILE)

```
Bottom bar (sticky):
  💰 Price "from X"
  [RESERVE] button

If full:
  [WAITLIST] button

If PREANNOUNCE:
  [BE NOTIFIED] button

Desktop: CTA in sidebar (non-sticky)
```

---

## TRIP STATUSES

```
DRAFT
  → Creator training/testing
  → No visibility to public
  → All fields editable

PHASE1_SUBMITTED
  → Waiting for Ops + Transport review
  → Creator sees "En validation" badge

PHASE1_VALIDATED
  → Ops approval received
  → NOT YET public

PHASE2_SUBMITTED
  → Transport awaiting final approval

PHASE2_VALIDATED
  → Transport FEU 2/3 passed
  → Can become PREANNOUNCE

PREANNOUNCE
  → Public + shareable
  → "Be notified" CTA only
  → Zone-level pickup details

BOOKABLE
  → Fully public + reservable
  → Full pickup details + stop selection
  → Occurrence selection enabled

CONFIRMED
  → minPax reached
  → Departure date locked
  → Full operations mode

NO_GO (admin decision)
  → minPax not reached
  → Offer credit/refund
  → Cancellation notified
```

---

**END OF QUICK REFERENCE**

