# CLIENT PORTAL SPECIFICATION EXTRACTION
## From eventy_v53_COMPLET_PRET_CODAGE.drawio (March 2026)

### DOCUMENT OVERVIEW
This is a comprehensive extraction of ALL client portal (portail client) specifications from the draw.io diagram. The client portal is the logged-in user experience at `/client/*` where customers manage reservations, documents, payments, and support.

---

## ENTRY POINT & ROUTING
- **Main Entry:** `/client` (authenticated users only)
- **Protected Routes:** All `/client/*` routes require JWT authentication
- **Authentication:** HTTP-only cookies, JWT (15m access + 30-day refresh rotation)
- **Guest Checkout:** `/checkout/*` accessible without authentication, leads to password creation

---

## COMPLETE CLIENT PORTAL PAGES

### 1. MY TRIPS / MES VOYAGES (V289)
**Route:** `/mes-voyages` (file: src/app/client/mes-voyages/page.tsx)
**Authentication:** Required

**Display:**
- List of all user's trip bookings as cards
- Sort order: Most recent first (default)
- Optional status filter

**Trip Card Components:**
- Trip name + destination
- Trip dates
- Status badges (one or multiple):
  - Documents missing
  - Flights to confirm (modal/accordion with details)
  - Schedule modified
- Booking reference number (REF-XXXXXX)
- CTA button: "View my trip" / "Voir mon voyage"

**Booking Statuses:**
- PAID / confirmed (active trip)
- CANCELLED (user cancelled)
- COMPLETED (trip finished)

**Special Case - Guest Purchases:**
- If user bought as guest (no password created)
- Access via unique 48-hour password creation link sent in email
- After password creation, full access to `/mon-voyage/[bookingId]`

**Related Model:** `RoomBooking(status, bookingRef, paidAt)`

---

### 2. MY TRIP DETAIL / MON VOYAGE (V535/V537)
**Route:** `/mon-voyage/[bookingId]` (file: src/app/client/mes-voyages/[id]/page.tsx)
**Authentication:** Required

**Content Sections:**

1. **Header**
   - Trip name, destination, dates
   - Booking reference (REF-XXXXXX)
   - Status indicator (color-coded)

2. **Reservation Status**
   - Payment status (HOLD / PARTIALLY_PAID / CONFIRMED)
   - Occupancy details
   - Room information
   - Rooming sheet (if published)

3. **Flights/Transport**
   - Flight numbers (when published)
   - Departure/arrival times
   - Terminals
   - Status badges: "To Confirm" / "Published" / "Modified"
   - Historical changes if schedule modified

4. **Documents Required**
   - Passeport/CI (identity card)
   - Status for each traveler: PENDING / SUBMITTED / VALIDATED / REJECTED
   - Upload links (if missing)
   - Reminders shown (D-21, D-14, D-7, D-3)

5. **Timeline/Activity**
   - Chronological event log
   - Payment confirmations
   - Document submissions
   - Admin actions
   - Schedule changes

6. **Pickup/Ramassage Information**
   - Departure location + time
   - Pickup point if applicable
   - Contact person (trip leader or independent)
   - Phone/email for questions

7. **Actions**
   - "Cancel trip" → `/mon-voyage/[bookingId]/annulation`
   - "Download confirmation"
   - "View rooming"
   - "Support/Help"
   - "Share with group" (if group feature enabled)

**File Location:** `src/app/client/mes-voyages/[id]/page.tsx`
**API Dependency:** `GET /client/bookings/:id` with relations (payment, flights, documents, timeline)

---

### 3. CREDITS / WALLET DASHBOARD (V106-V110)
**Feature:** Credit/avoir wallet system (not points, account credit)
**Routes:** `/client/wallet` or `/compte/credits`

**Dashboard Display:**
- **Current Balance:** Formatted currency (e.g., "€245.50")
- **Status:** Non-transferable, expires in 12 months
- **Quick Stats:** Total received, total spent, expiring soon

**Ledger / History:**
- Sortable table or card list:
  - Date
  - Reason/Type
  - Amount
  - Running balance
  - Expiration date (if applicable)

**Credit Sources (visible to client):**
- NO-GO: Trip cancelled (admin/force-major)
- Annulation: User-initiated cancellation (within cutoff)
- Admin adjustment: Manual credit issued by support
- Expiration alerts: "€X expires on [date]"

**Checkout Integration:**
- Credit auto-applied at payment step
- Formula: `creditApplied = min(walletBalance, amountDue)`
- Can result in €0 balance if full payment from credit
- Display: "€XX credit applied" + breakdown

**Database Models:**
- `CreditWallet(userId, balance, lastModified)`
- `CreditLedgerEntry(walletId, type, amount, reason, expiresAt, createdAt)`
- `CreditRedemption(bookingId, walletId, amountUsed)`
- `CreditPolicySettings(expirationDays=365, minCreditForAutoApply=0)`

**Rules:**
- Non-transferable (cannot gift to another user)
- 12-month expiration (configurable per admin setting)
- Auto-applied at checkout (no manual selection needed)
- PDF receipt downloadable for tax purposes
- Ledger entry types: ISSUE, REDEEM, EXPIRE, ADJUST, (REFUND future)

**Accessibility:** Only visible to authenticated user (own wallet only)

---

### 4. CANCELLATION / ANNULATION (V109-V290)
**Route:** `/mon-voyage/[bookingId]/annulation`
**Authentication:** Required + must own the booking

**Process Flow:**

1. **Request Form**
   - Button: "Demander une annulation" (Request cancellation)
   - Required field: Raison (Reason) - dropdown or textarea
   - Optional: Additional comments
   - Submit button

2. **State Machine**
   ```
   REQUESTED → ADMIN_REVIEW → {APPROVED | REJECTED} → CLOSED
   ```
   - REQUESTED: Just submitted by client
   - ADMIN_REVIEW: Awaiting admin decision
   - APPROVED: Cancellation accepted, credit issued
   - REJECTED: Cancellation denied, funds retained
   - CLOSED: Process complete

3. **Validation Rules**
   - `cancelCutoffDays`: Admin-configurable (7 or 14 days from trip start)
   - Errors:
     - 409 Conflict: `already_cancelled` (already cancelled)
     - 403 Forbidden: `cutoff_reached` (outside cutoff window)
     - 400 Bad Request: `invalid_state` (wrong booking state)

4. **Default Credit Type**
   - MVP default: Credit-voyage (CREDIT type)
   - REFUND type is future feature (currently OFF)
   - Client sees: "Cancellation will be credited to your wallet"

5. **Admin Overrides**
   - Per-trip override of cutoff
   - Manual approval outside normal rules
   - Mandatory audit trail

**Database Model:**
- `CancelRequest(bookingId, userId, reason, status, requestedAt, approvedAt, approvedBy, notes)`

**Audit Logging:** All cancellation actions logged with user/admin, timestamp, status change

---

### 5. EMAIL NOTIFICATIONS TO CLIENTS (V283/V295)
**Infrastructure:** Resend/Brevo via Outbox pattern with 30-second CRON retry (3x attempts)

**Email Templates Sent:**

| Template | Trigger | Subject Line | Content |
|----------|---------|-------------|---------|
| **Booking Confirmation** | After payment CONFIRMED | "Confirmation de réservation [REF]" | Includes link to `/mon-voyage/[bookingId]`, booking details, ramassage info |
| **Password Creation (Guest)** | Guest purchase (no password) | "Créer votre mot de passe Eventy" | 48-hour link to `/auth/password-create?token=X` |
| **Documents Reminder D-14** | IF documents incomplete 14 days before trip | "Documents manquants - [TripName]" | List of missing docs, direct upload links |
| **Documents Reminder D-7** | IF documents still incomplete 7 days before | "Rappel: Documents manquants - [TripName]" | Final reminder, urgent tone |
| **Flights Published** | Admin Transport publishes + validates | "Vos vols sont publiés!" | Flight numbers, times, terminals |
| **Schedule Modified** | Any flight time/date changes | "Modification d'horaires - [TripName]" | Old vs new times, impact on ramassage |

**Allowed Template Variables (safe):**
- `bookingRef` (REF-XXXXXX format)
- `tripName` (name of trip)
- `tripDates` (e.g., "15-20 April 2026")
- `departureLocation` (e.g., "Paris, Gare de Lyon")
- `passengersCount` (how many travelers)
- `clientFirstName` (salutation)
- `clientEmail` (for footer)

**PII RESTRICTIONS (NEVER include in emails):**
- Passport numbers ❌
- Birth dates ❌
- Full addresses ❌
- Health information ❌
- Payment card details ❌
- Full phone numbers ❌

**Database Models:**
- `EmailTemplate(key, subject, htmlBody, variables, createdAt)`
- `EmailOutbox(templateId, recipientEmail, userId, variables, status, sentAt, failedAt, retryCount)`
- `EmailLog(outboxId, sentAt, provider, messageId, bounceStatus)`
- **Deduplication:** `unique(templateKey + dedupeKey)` to prevent duplicate sends

**Opt-Out:**
- GDPR Article 21 opposition: Immediate stop of marketing emails
- Unsubscribe link in footer
- Respects DNC (Do Not Call/Email) list

---

### 6. SUPPORT & HELP CENTER (SUPPORT CLIENT)
**Routes:**
- `/client/support` (main)
- `/client/support/faq`
- `/client/support/contact`
- `/client/support/tickets` (list of user's tickets)

**Features:**

1. **FAQ (Public, no auth needed)**
   - Search by keyword
   - Categories (Booking, Documents, Payment, Cancellation, Rooming)
   - Expandable Q&A cards

2. **Contact Support Form**
   - Required: Subject, Message, Email confirmation
   - Optional: Attachment upload
   - Submits as ticket
   - Confirmation email sent immediately

3. **Support Tickets**
   - User's ticket history
   - Status: OPEN, IN_PROGRESS, RESOLVED, CLOSED
   - SLA displayed: "Response expected by [date]"
   - Conversation thread (client can reply)

**Related:** See Account/Preferences section for support preferences

---

### 7. COMPLETE USER JOURNEY / PARCOURS CLIENT

**Step 1: Discovery**
- Route: `/voyages`
- Features:
  - "Autour de chez moi" (Around me) - 3 sources of location data
  - Filters: dates, destination, price range, group size
  - Map view option
  - Trip cards with hero image + quick info

**Step 2: Trip Details**
- Route: `/voyages/[slug]`
- Content:
  - Full itinerary/program
  - Ramassage (pickup) details
  - Trip leader bio + contact
  - Reviews/avis from other travelers
  - Share buttons (WhatsApp, Email, Social)
  - Price breakdown
  - CTA: "Reserve" or "Checkout"

**Step 3: Checkout (5-Step Tunnel)**
- Route: `/checkout/[bookingId]/step-1..4`
- Entrance: `/checkout/start`
- Exit: `/checkout/[bookingId]/confirmation`

  **Step 1: Room/Accommodation Selection**
  - Display available room types
  - Select room
  - Display occupants from group (if applicable)

  **Step 2: Payment Method**
  - Credit card via Stripe
  - Optional: Split payment invitation
  - Display wallet credit (auto-applied)

  **Step 3: Co-Payer Invitations**
  - Invite others to split payment
  - Generate unique co-payer link + token
  - Display: "Awaiting payment from [name]"

  **Step 4: Pre-Contract Info**
  - Arrêté 2018 pre-contract disclosure
  - CGV snapshot (versioned)
  - Assurance checkbox (optional)
  - Confirmation checkboxes (required)

  **Step 5: Stripe Payment**
  - External Stripe Checkout modal or Payment Page
  - Returns with status (success/fail)

- **Statuses During Checkout:**
  - HOLD: Payment initiated, awaiting confirmation
  - PARTIALLY_PAID: Some co-payers paid, waiting for others
  - CONFIRMED: All payment received

**Step 4: My Trip Dashboard**
- Route: `/mon-voyage/[bookingId]`
- See "MY TRIP DETAIL" section above
- Access: Direct link + listed in `/mes-voyages`

**Step 5: Post-Trip**
- Share experience via social
- Leave review/avis
- Apply cancellation credit if applicable
- Provide feedback

---

### 8. CHECKOUT & PAYMENT (V53 - Advanced Split-Pay)
**Routes:**
- `/checkout/start` - Initiation
- `/checkout/[bookingId]/step-1` - Room selection
- `/checkout/[bookingId]/step-2` - Payment info
- `/checkout/[bookingId]/step-3` - Co-payers
- `/checkout/[bookingId]/step-4` - Pre-contract
- `/checkout/[bookingId]/paiement` - Stripe payment
- `/checkout/[bookingId]/confirmation` - Success page

**Guest Checkout:**
- No authentication required
- Email collected in step 2
- Post-purchase: Password creation link (48 hours)

**Split-Pay Features:**
- 4 modes:
  1. Full payment by one person
  2. Split equally
  3. Unequal split (specify per person)
  4. Use wallet credit + co-payer split

**Booking Payment Flow:**
```
START → ROOM_SELECTED → PAYMENT_METHOD → CO_PAYERS_INVITED
  → PAYMENT_SUBMITTED (Stripe) → PAYMENT_HOLD (pending)
  → [Optional: Co-payers complete] → CONFIRMED
```

**Insurance (V288/PATCH 8.4):**
- Optional toggle: "Add travel insurance?"
- Calculated: `insuranceAmountPerPersonTTC`
- Can be removed before payment
- Admin can add/remove post-payment
- Feature flag: `insuranceEnabled` (boolean)

**Pre-Contract (PATCH 1.5):**
- Arrêté 2018 compliance
- CGV snapshot stored (versioned)
- Co-payer names captured
- PDF archivable
- Required consent checkbox

**Payment Contribution Model:**
- `PaymentContribution(roomBookingId, payerId, amount, status, createdAt)`
- Status: PENDING, SUCCEEDED, FAILED, CANCELLED
- Idempotency key: Prevents duplicate charges

---

### 9. ACCOUNT & PROFILE (MON COMPTE) (V495)
**Routes:**
- `/compte` - Profile home
- `/compte/profil` - Edit profile
- `/compte/réservations` - Booking history
- `/compte/documents` - Document management
- `/compte/preferences` - Settings

**Profile Page (/compte/profil):**
- Name (given + family)
- Email
- Phone number
- Date of birth (if required)
- Nationality (for international trips)
- Edit form with save button

**Reservation History (/compte/réservations):**
- Same as `/mes-voyages` but includes past trips
- Filter: Current, Past, Cancelled
- Export/download options

**Documents (/compte/documents):**
- Central repository for all documents
- Passport/CI uploads
- Visa documents
- Travel insurance certificates
- Download links

**Preferences (/compte/preferences):**
- See "Preferences/Préférences" section below

---

### 10. DOCUMENTS / IDENTITY REQUIREMENTS (PIÈCES D'IDENTITÉ)
**Routes:**
- `/client/documents` (main document dashboard)
- `/mon-voyage/[bookingId]/documents` (trip-specific)

**For Each Traveler:**

**Upload Section:**
- Passport or National ID card
- Formats: JPG, PNG, PDF
- Max size: 10MB
- File scanning: MIME type verification

**Status Display:**
- PENDING (not yet uploaded)
- SUBMITTED (uploaded, awaiting review)
- VALIDATED (admin approved)
- REJECTED (admin declined - reason shown)

**Reminder Emails (CRON jobs):**
- D-21: "Upload documents soon"
- D-14: "Documents needed"
- D-7: "Urgent: Documents required"
- D-3: "Final reminder: Documents today"

**Admin Actions:**
- View document
- Validate ✓ (GDPR compliance check)
- Reject with reason
- Request re-upload

**Database Model:**
- `ProDocument(userId, bookingId, type, fileUrl, status, uploadedAt, validatedAt, validatedBy, rejectionReason)`
- Type: PIECE_IDENTITE (potentially: VISA, INSURANCE in future)

**Rules:**
- Required documents displayed per destination
- Affects travel eligibility
- Blocking for international trips
- Export capability (audit trail PDF)

---

### 11. IN-APP NOTIFICATIONS (PATCH 3.3)
**Route:** `/client/notifications`
**Component:** Bell icon in header

**Features:**
- **Notification Bell**
  - Badge showing count of unread notifications
  - Dropdown or full page view
  - Real-time updates (polling or WebSocket future)

- **Notification List**
  - Chronological order (newest first)
  - Read/unread status
  - Icons by type (info, warning, alert)
  - Click to view details

- **Actions**
  - Mark as read
  - Mark all as read
  - Delete notification
  - Filter by type (optional)

**Notification Types Sent:**
- Document reminder
- Payment received
- Flight published
- Schedule changed
- Support response
- Group invitation
- Admin messages

**Database Model:**
- `Notification(userId, type, title, body, relatedId, isRead, createdAt)`

**API:**
- `GET /client/notifications` - List
- `PATCH /client/notifications/:id/read` - Mark as read
- WebSocket future: Real-time push

**Delivery:** Email + in-app (redundancy)

---

### 12. AVIS CLIENTS / REVIEWS & RATINGS (V289/PATCH 7.2)
**Feature:** User-generated content (UGC) - client reviews of trips

**Leave Review:**
- Route: `/mon-voyage/[bookingId]/avis` or modal on trip detail
- Trigger: After trip completion
- Form:
  - Star rating: 1-5 (required)
  - Text review: 0-1000 characters (optional)
  - Anonymous toggle (optional)

**Review Moderation:**
- Admin dashboard: Flag inappropriate reviews
- Status: PENDING, APPROVED, REJECTED, ARCHIVED
- Rejection reasons: Spam, Inappropriate language, Off-topic

**Display Reviews:**
- Route: `/voyages/[slug]/avis`
- Show on trip detail page
- Features:
  - Author name (or "Anonymous")
  - Star rating (visual + numeric)
  - Text content
  - Date posted
  - "Helpful" reaction count
  - Link to reviewer's profile (if public)

**Profile Visibility (Pro):**
- Pro profile card shows average rating
- All reviews of pro's trips summarized
- Filtering: "Most helpful", "Recent", "5-star only"

**Signaling:**
- Report inappropriate review button
- Admin review of reports

**Database Model:**
- `Review(userId, tripId, rating, text, status, createdAt, approvedAt, approvedBy)`
- `ReviewReaction(userId, reviewId, type, createdAt)` (helpful, etc.)
- `ReviewReport(reportedById, reviewId, reason, status, resolvedAt)`

**API:**
- `POST /reviews` - Create review
- `GET /voyages/[slug]/avis` - List reviews
- `PATCH /reviews/:id` - Edit own review (30 min window)
- `POST /reviews/:id/report` - Report review

---

### 13. TRAVEL INSURANCE / ASSURANCE (V288/PATCH 8.4)
**Feature:** Optional travel cancellation insurance

**In Checkout (Step 4):**
- Checkbox: "Ajouter une assurance annulation?"
- Price: Displayed per person (TTC with VAT)
- Details: Expandable accordion with coverage terms
- Selection: Can toggle on/off before payment

**Post-Payment (Admin):**
- Admin can add insurance (if forgotten)
- Admin can remove (rare, policy issue)
- Requires admin approval/audit

**In Booking:**
- Field: `RoomBooking.insuranceSelected` (boolean)
- Price: `insuranceAmountPerPersonTTC` (calculated)

**Feature Flag:**
- `insuranceEnabled` (boolean, default: true)
- Configurable in admin settings
- Can disable globally or per-trip

**Database Model:**
- `Insurance(bookingId, selectedAt, amount, status, policyNumber, certURL)`

**Compliance:**
- Snapshot of policy terms at purchase
- Proof PDF downloadable
- Claim process documented

---

### 14. GROUPS / GROUPES & SOCIAL FEATURES (V500-V502) [OPTIONAL PHASE 1]
**Note:** Phase 1 feature (optional) - "Groupes sociaux"

**Routes:**
- `/client/groupe` - Groups hub
- `/client/groupe/creer` - Create group (V301)
- `/client/groupe/join` - Join via link (V302)
- `/client/mes-groupes` - My groups list (V303)
- `/client/groupe/[groupId]` - Group dashboard (V501)

**Features:**

**Create Group (V301):**
- Form: Group name, description
- Privacy: Private/Public
- CTA: Share invite link

**Join Group (V302):**
- Unique invite link: `/client/groupe/join?token=X&groupId=Y`
- Accept/decline prompt
- Auto-add to "My Groups"

**My Groups List (V303):**
- Cards showing:
  - Group name
  - Member count
  - Group status
  - Role (Owner/Member)
  - CTA: "View group"

**Group Dashboard (V501):**
- Header: Group name + photo
- Members list: Name, role, email
- Upcoming trips (for group members)
- Internal messaging (if Phase 3 enabled)
- Settings (if owner)
  - Add/remove members
  - Edit group info
  - Delete group

**Invite Link (V502):**
- Intelligent: Auto-recognize existing group members
- Short URL via shortlink service
- Expiry: Configurable (default 30 days)
- Single-use vs reusable

**Database Models:**
- `TravelGroup(id, name, ownerId, description, privacy, createdAt)`
- `TravelGroupMember(id, groupId, userId, role, joinedAt)` — role: OWNER, MEMBER, INVITED
- `GroupInvite(id, groupId, token, expiresAt, usedAt)`

**Messaging (Phase 3, optional):**
- Internal group chat
- Shared document
- Announcement board

---

### 15. FAVORITES / WISHLIST (AUDIT C-016)
**Feature:** Save favorite trips for later

**Routes:**
- `/client/favoris` (wishlist page)
- Button on trip card: Add/Remove from favorites

**Wishlist Page:**
- List of saved trips (cards)
- Filter: By destination, date range, price
- Sort: Date added, price, rating
- CTA: "Book now" for each trip

**Database Model:**
- `Favorite(userId, tripId, addedAt)`

**Usage:**
- Plan trips in advance
- Track price changes (future: price drop alerts)
- Share wishlist with friends (future: export list)

---

### 16. TIPS / GRATUITIES (POURBOIRE)
**Feature:** Post-trip tipping system (optional)

**Scenarios:**
- Tip the trip leader/guide
- Tip the bus driver
- Tip the accommodation staff

**How It Works:**
- Appears in trip details after completion
- Modal with: "Thank you! Leave a tip?"
- Fixed amounts (€5, €10, €20) or custom
- Payment via Stripe (separate from trip payment)
- Optional "Leave message" box
- Confirmation email sent to recipient

**Database Model:**
- `Tip(bookingId, giverId, recipientId, type, amount, message, createdAt)`
- Type: GUIDE, DRIVER, STAFF, OTHER

---

### 17. PREFERENCES & SETTINGS (V495, V1247)
**Routes:**
- `/compte/preferences`
- `/client/preferences`
- `/client/settings`

**Sections:**

**1. Marketing Communications (V1247)**
- Center: Manage by channel
- Channels:
  - Email (checkbox)
  - SMS (checkbox)
  - WhatsApp (checkbox)
  - Push notifications (checkbox)
  - Direct mail (checkbox)

- Per-category (optional):
  - Promotions
  - New trips
  - Newsletter
  - Updates

- GDPR Art. 21 Opposition:
  - "Stop all marketing" button
  - Immediate effect
  - Added to DNC list
  - Audit logged

**2. Privacy & Data**
- View my data (DSAR)
- Download my data (GDPR export)
- Delete my account (7-day confirmation)
- Cookie preferences
- Tracking consent

**3. Account Security**
- Password change
- Two-factor authentication (future)
- Active sessions
- Login history

**4. Notification Preferences**
- Email reminders (documents, flights, etc.)
- Frequency: Daily digest, weekly, as-it-happens
- Quiet hours (do not send between X-Y)

**5. Travel Preferences**
- Preferred departure city
- Dietary requirements
- Mobility needs
- Language preference (for trips)
- Accessibility needs

---

### 18. EMERGENCY CONTACT / URGENCE (V240)
**Feature:** Critical contact info for on-trip incidents

**Routes:**
- `/mon-voyage/[bookingId]/urgence` (setup)
- Admin/trip leader access: `/admin/trips/[id]/urgence`

**Form:**
- Emergency contact name
- Relationship (family, friend, etc.)
- Phone (mobile priority)
- Email
- Allergies / Medical conditions (optional)
- Blood type (optional)

**Admin View:**
- Visible to trip leader
- Visible to support team
- Visible to independent (indépendant) leading trip
- Encrypted for privacy

**Database Model:**
- `EmergencyContact(bookingId, userId, name, relationship, phone, email, createdAt)`
- `TravelerHealth(bookingId, userId, allergies, bloodType, medicalConditions, consent)`

---

## CHECKOUT FLOW SUMMARY
1. Browse trips at `/voyages`
2. View trip at `/voyages/[slug]`
3. Click "Reserve" → Entry to `/checkout/start`
4. Step 1: Select room/accommodation
5. Step 2: Payment method + apply wallet credit
6. Step 3: Invite co-payers (optional, get split-pay links)
7. Step 4: Pre-contract + insurance + confirmations
8. Step 5: Stripe payment (external)
9. Success: `/checkout/[bookingId]/confirmation`
10. Email: Confirmation + link to `/mon-voyage/[bookingId]`
11. Login/password creation (if guest) → Full access to dashboard

---

## PROTECTED ROUTES AUTHENTICATION
**Guard:** JWT + User ownership verification

**All require:**
- Valid access token
- User must own the booking/resource
- IP/device verification (optional future)

**Routes Protected:**
- `/client/*`
- `/mon-voyage/*`
- `/compte/*`
- `/checkout/*` (after payment)

**Exceptions:**
- `/voyages` (public discovery)
- `/checkout/start` (guest OK)
- Public legal pages

---

## LEGAL & COMPLIANCE PAGES
**Visible to Clients:**
- `/mentions-legales` - Legal notices
- `/cgv` - Terms & conditions (versioned snapshot at purchase)
- `/confidentialite` - Privacy policy (GDPR minimum)
- `/cookies` - Cookie consent (CMP + CNIL compliance)
- `/accessibilite` - Accessibility statement (WCAG 2.1 AA target)

---

## DATABASE MODELS SUMMARY (CLIENT-FOCUSED)
- `User` - Client profile
- `CreditWallet` - Wallet balance
- `CreditLedgerEntry` - Wallet history
- `Notification` - In-app notifications
- `Review` - Trip reviews/avis
- `TravelGroup` - Social groups (Phase 1)
- `TravelGroupMember` - Group membership
- `RoomBooking` - Trip reservation
- `PaymentContribution` - Split-pay tracking
- `ProDocument` - Document uploads (passeport, etc.)
- `CancelRequest` - Cancellation requests
- `ConsentLog` - Consent tracking
- `EmailTemplate` - Email templates
- `EmailOutbox` - Outbox queue
- `Favorite` - Wishlist entries
- `EmergencyContact` - Emergency info
- `Tip` - Gratuities

---

## KEY API ENDPOINTS (Client-facing)
- `GET /client/notifications` - Fetch notifications
- `PATCH /client/notifications/:id/read` - Mark as read
- `GET /client/bookings` - My trips list
- `GET /client/bookings/:id` - Trip details
- `POST /reviews` - Create review
- `GET /voyages` - Browse trips
- `GET /voyages/[slug]` - Trip detail
- `GET /checkout/[id]` - Checkout progress
- `POST /checkout/[id]/step-*` - Progress through steps
- `GET /rgpd/dsar` - DSAR request start
- `GET /me` - Current user profile

---

## DESIGN PATTERNS & UI ELEMENTS
- **Status Badges:** Colored labels (green=good, orange=pending, red=issue)
- **Timeline:** Vertical chronological event list with icons
- **Card Layouts:** Trip cards, review cards, group cards
- **CTAs:** Primary buttons (blue), secondary buttons (gray), danger buttons (red)
- **Modals:** Cancellation form, insurance details, co-payer invites
- **Forms:** Clean inputs, clear labels, helper text for required fields
- **Responsive:** Mobile-first (90%+ of bookings likely on mobile)
- **Accessibility:** WCAG 2.1 AA target, ARIA labels, keyboard navigation

---

## FUTURE / OPTIONAL FEATURES
- REFUND ledger type (currently MVP = CREDIT only)
- Group pre-registrations (V310-V314, Phase 2)
- Group internal communications (V320-V321, Phase 3)
- Advanced rooming with preferences
- Flexible flight window management (V506)
- Association/CE wallet & group discounts (V19)
- Price tracking & drop alerts
- Two-factor authentication
- Social sharing with preview cards
- Multi-language support

---

## PATCH/VERSION CROSS-REFERENCE
| Component | Patch | Notes |
|-----------|-------|-------|
| My Trips | V289 | Core listing page |
| Cancellation | V109-V290 | Refund flow |
| Wallet/Credits | V106-V110 | Ledger system |
| Emails | V283, V295 | Templates |
| In-App Notif | V322, PATCH 3.3 | Bell + history |
| Trip Detail | V535, V537 | Full booking view |
| Insurance | V288, PATCH 8.4 | Travel insurance toggle |
| Groups | V500-V502 | Social features (Phase 1) |
| Preferences | V495, V1247 | Settings center |
| Checkout | V53, PATCH 2.2 | 5-step tunnel |
| Documents | PATCH 4.2 | Traveler docs |
| Pre-Contract | PATCH 1.5 | Arrêté 2018 compliance |

---

## RELATED DOCUMENTS
- Portail Public & Client: `DEV_01_Portail_Public_Client_V20`
- Checkout Details: `DEV_01` (Checkout section)
- Pro Portal: `DEV_02_Portail_Pro_V20`
- Admin Portal: `DEV_03_Admin_Dashboard`
- Backend Architecture: `backend/ARCHITECTURE.md`
- Frontend Architecture: `frontend/ARCHITECTURE_OVERVIEW.md`

---

**Last Updated:** March 19, 2026
**Source:** eventy_v53_COMPLET_PRET_CODAGE.drawio
**Diagram ID:** SITE_V8_CLIENT_69e0faeab3fa4f58
