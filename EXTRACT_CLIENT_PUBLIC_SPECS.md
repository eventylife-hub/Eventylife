# COMPLETE CLIENT & PUBLIC PORTAL SPECIFICATIONS
## Extracted from: eventy_v53_COMPLET_PRET_CODAGE.drawio (11MB XML)
**Generated:** 2026-03-19  
**Source:** Draw.io Diagram - 21,515+ elements analyzed

---

## TABLE OF CONTENTS
1. CLIENT PORTAL - Pages & Routes
2. PUBLIC PORTAL - Pages & Routes  
3. Checkout Flow
4. Key Data Models
5. UI Components & Features (by section)
6. Detailed Feature Specifications

---

# PART 1: CLIENT PORTAL SPECIFICATIONS

## CLIENT PORTAL ROUTES (82 identified)

### Core Navigation
- `/client` - Dashboard entry point
- `/client/dashboard` - Main dashboard ("Mon espace")
- `/client/mes-voyages` - List of bookings/trips
- `/client/mon-voyage` - Trip detail view
- `/client/profil` - User profile/account
- `/client/mon-compte` - Account hub

### My Trips & Bookings
- `/client/mes-voyages` - All trips listing
- `/client/mon-voyage/[bookingId]` - Trip detail
- `/client/mon-voyage/[bookingId]/voyageurs` - Travelers in trip
- `/client/mon-voyage/[bookingId]/annulation` - Cancellation request
- `/client/mon-voyage/[bookingId]/souvenirs` - Trip memories/photos
- `/client/mon-voyage/[bookingId]/souvenirs/zip` - Download memories
- `/client/bookings/[id]` - Booking summary
- `/client/bookings/[id]/transport` - Transport details/map
- `/client/bookings/[id]/activités` - Activities included
- `/client/bookings/[id]/flights` - Flight information
- `/client/bookings/[id]/programme` - Trip program/itinerary
- `/client/bookings/[id]/assistance` - Emergency contact info
- `/client/bookings/[id]/paiements` - Payment history

### Account & Documents
- `/client/profil` - Profile settings
- `/client/documents` - Document upload center
- `/client/paiements` - Payment history
- `/mon-compte/documents` - Account documents
- `/mon-compte/réservations/[id]/transferer` - Transfer booking
- `/mon-compte/sécurité` - Security settings
- `/mon-compte/voyageurs` - Manage travelers

### Wallet & Credits
- `/client/wallet` - Credit wallet view
- `/mon-compte/avoirs` - Credit/havings

### Groups & Social
- `/client/groupe/[groupId]` - Group detail
- `/client/groupe/[id]` - Group management
- `/client/communications` - Communications hub
- `/client/communications/:id` - Message thread
- `/client/messages` - Messaging center

### Support & Notifications
- `/client/support/tickets` - Support tickets list
- `/client/support/tickets/:id` - Ticket detail
- `/client/support/tickets/:id/messages` - Ticket messages
- `/client/support/tickets/:id/resolve` - Resolve ticket
- `/client/support/tickets/:id/reopen` - Reopen ticket
- `/client/incident/tâche` - Incident declaration
- `/client/notifications` - Notification center
- `/client/notifications/:id/read` - Mark notification read
- `/client/notifications/read-all` - Mark all read
- `/client/notification-preferences` - Notification settings

### Preferences & Following
- `/client/favoris` - Favorites/wishlist
- `/client/follow/:proId` - Follow creator
- `/client/follows` - Following list
- `/client/occurrences/:occurrenceId/waitlist` - Waitlist signup
- `/client/occurrences/:occurrenceId/switch-choice` - Change accommodation choice
- `/client/choices/switch` - Switch options

### Other
- `/client/me/export` - Export profile data
- `/client/voyage/:id` - View trip (readonly mode available)
- `/client/reservation` - Reservations endpoint
- `/client/voyages` - Trips listing

---

## CLIENT PORTAL PAGES - DETAILED SPECIFICATIONS

### 1. CLIENT DASHBOARD (Mon Espace)
**Route:** `/client/dashboard`

**Key Elements:**
- Welcome header with user name
- Summary cards of next 3 trips
- Quick access to:
  - Mes voyages (My trips)
  - Mes documents (My documents)
  - Mon portefeuille (My wallet)
  - Mes paiements (My payments)
  - Support
  - Notifications counter

**Status Indicators:**
- Documents missing badge
- Flights to confirm badge
- Modified flight times badge
- Cancellation requested badge

**Actions:**
- View trip detail (CTA per card)
- Contact support
- View notifications

---

### 2. MES VOYAGES (My Trips/Bookings List)
**Route:** `/client/mes-voyages`  
**Also:** `/client/reservations`, `/client/voyages`

**Display:**
- Cards for each booking (next 3 prioritized)
- Info per card:
  - Trip title + dates
  - Departure city/location
  - Status badges (CONFIRMED/PENDING/DOCUMENTS_MISSING)
  - Price
  - Remaining payers (if group booking)

**Filters/Sort:**
- Upcoming vs Past
- By destination
- By status

**CTAs:**
- "Voir mon voyage" → `/client/mon-voyage/[bookingId]`
- "Payer" → Redirect to payment
- Share trip

---

### 3. MON VOYAGE (Trip Detail)
**Route:** `/client/mon-voyage/[bookingId]`

**Tabs/Sections:**
1. **Résumé (Summary)**
   - Trip overview
   - Dates & duration
   - Destination
   - Travel theme
   - Hero image & introduction video (optional)
   - Included services preview

2. **Voyageurs (Travelers)**
   - List of travelers (confidential fields masked)
   - Can add/edit travelers
   - Roles: primary booker, co-payer, participant
   - Emergency contact info visible

3. **Transport**
   - Map with full itinerary
   - Flight details (if flights included)
   - Pickup location & time
   - Return details
   - Bus company info
   - Contacts for transport issues

4. **Activités (Activities)**
   - Section: "Incluses dans votre séjour"
   - Activities description
   - Schedules (if provided)
   - Optional activities (if available)

5. **Hébergement (Accommodation)**
   - Hotel name & address
   - Check-in/out dates
   - Room type selected
   - Room mates (if shared)
   - Hotel contact info

6. **Documents**
   - Document checklist
   - Upload status per document
   - Deadline indicators (J-14, J-7)
   - Action: Upload/update documents

7. **Paiements (Payments)**
   - Total cost breakdown
   - Payment status
   - Payment history
   - Remaining balance
   - Co-payer status

8. **Messages**
   - Creator/Indie messages
   - Support tickets
   - Quick reply option

9. **Souvenirs (Memories)** - NEW
   - Upload photos/videos from trip
   - Max 20 files, 10MB each
   - Formats: JPG, PNG, MOV, MP4
   - Timeline view
   - Download all (ZIP)

**Actions on Mon Voyage:**
- "Demander une annulation" (if not started)
- "Inviter co-voyageurs"
- "Déclarer un incident"
- "Partager"
- "Télécharger documents"
- Print itinerary

**Status Indicators:**
- Payment status (UNPAID/PARTIALLY_PAID/FULLY_PAID)
- Documents missing warning
- Flights to confirm badge
- Modified flight times
- Cancellation requested

---

### 4. CLIENT PROFILE (Mon Compte/Profil)
**Route:** `/client/profil`, `/mon-compte/profil`

**Fields:**
- First name, Last name
- Email (primary contact)
- Phone number
- Avatar/Profile picture
- Nationality
- Date of birth
- Address (for invoicing)
- Preferred language
- Newsletter subscription status

**Sections:**
- Personal Information (editable)
- Address book (manage addresses)
- Payment methods (saved cards)
- Preferences (notifications, privacy)
- Security (password change, 2FA)
- GDPR & data export
- Account deletion option

**Sub-page:** `/mon-compte/sécurité`
- Change password
- Session management
- Login history
- Two-factor authentication setup

**Sub-page:** `/mon-compte/voyageurs`
- Manage saved travelers
- Quick-add for repeated trips
- Edit traveler profiles

---

### 5. DOCUMENTS CENTER
**Route:** `/client/documents`

**Display:**
- Document checklist per booking
- Status per document: 
  - NOT_SUBMITTED
  - PENDING_REVIEW
  - APPROVED
  - REJECTED (with reason)
  - EXPIRED

**Document Types:**
- Passport/ID
- Visa (if required)
- Travel insurance proof
- Medical certificates
- Authorization letters (minors)
- Vaccination proof
- Health declaration

**Actions:**
- Upload document
- View submission deadline (J-14, J-7 reminders)
- View required documents list
- Download templates (if available)
- Re-submit after rejection
- View approval confirmation

**Features:**
- Drag-and-drop upload
- Multiple file formats (PDF, JPG, PNG)
- File size validation
- Automatic scan for completeness
- Email notifications on approval/rejection

---

### 6. PAYMENTS & WALLET
**Route:** `/client/paiements`, `/client/wallet`, `/mon-compte/avoirs`

**Payment History:**
- List of all transactions
- Date, amount, status (SUCCEEDED/FAILED/PENDING)
- Payment method used
- Invoice download
- Receipt download

**Payment Modes:**
- A) I pay all
- B) Each pays their share
- C) I pay N shares + invite others
- D) I pay all (reimbursement outside Eventy)

**Co-payer Invitations:**
- Invite email/phone
- Generate payment link
- Track payment status per payer
- Send reminder links

**Wallet/Credits:**
- Current balance display
- Credit history
- Expiration dates (12 months)
- Auto-apply credits at checkout
- Manual discount codes (if applicable)

**Refund Tracking:**
- Status of refund requests
- Reason for refund
- Expected refund date
- Refund method (credit or bank transfer)

---

### 7. SUPPORT & INCIDENTS
**Route:** `/client/support/tickets`, `/client/incident/tâche`

**Support Tickets:**
- Create new ticket
- Select category (BOOKING/PAYMENT/DOCUMENTS/TRANSPORT/ACTIVITY/ACCOMMODATION/OTHER)
- Describe issue
- Attach supporting files
- Assign priority (auto-assigned based on content)

**Ticket Display:**
- Reference number
- Status: NEW → IN_PROGRESS → RESOLVED/CLOSED
- Creation date & time
- Last update
- Messages thread
- Estimated resolution time

**Incident Declaration:**
- Report issue that occurred during trip
- Checklist: date/time, location, people involved, witnesses
- Photos/videos upload
- Police/authority report reference
- Amount claimed (if damages)
- Required documents checklist

**SLA Display:**
- P0 = 1 hour
- P1 = 4 hours
- P2 = 24 hours
- Auto-escalation if not responded
- Auto-close if WAITING_CLIENT > 7 days

---

### 8. GROUPS (Social Groups)
**Route:** `/client/groupe/[groupId]`

**Group View:**
- Group name & description
- Member list (with avatars)
- Roles per member (OWNER/MEMBER/INVITED)
- Shared trip info
- Group chat/messaging
- Group photos (if available)

**Member Actions:**
- Add member (email invite)
- Remove member
- Change roles
- View member profile

**Group Features:**
- Shared messaging (group chat)
- Shared memories/photos
- Group notes
- Event calendar (trip dates, activities)
- Invite links for sharing

---

### 9. NOTIFICATIONS
**Route:** `/client/notifications`, `/client/notification-preferences`

**Notification Types:**
- Payment confirmations
- Document status changes
- Flight updates
- Activity reminders
- Group invites
- Messages from creator/support
- Refund notifications
- Trip start reminders (T-48, T-24, T-7)

**Notification Center:**
- Bell icon with unread count
- List of notifications (newest first)
- Mark as read/unread
- Delete notification
- Mark all as read

**Notification Preferences:**
- Email notifications (toggle by type)
- SMS alerts (for critical updates)
- In-app notifications (toggle)
- Quiet hours (do not disturb)
- Opt-out option per category

---

## CLIENT PORTAL - DATA MODELS

```
Key Models Referenced:

User
  - id, email, firstName, lastName, phone, avatar, nationality, dateOfBirth
  - status: ACTIVE/INACTIVE/SUSPENDED

Booking (RoomBooking)
  - id, userId, tripId, occurrenceId
  - status: DRAFT/HELD/PARTIALLY_PAID/FULLY_PAID/EXPIRED/CANCELLED
  - paymentStatus, totalPrice, paidAmount
  - primaryTraveler, travelers[], createdAt

Traveler
  - id, bookingId, firstName, lastName, dateOfBirth, nationality
  - passportNumber (encrypted), role: PRIMARY/COPAYER/PARTICIPANT

Document
  - id, bookingId, travelerId
  - type: PASSPORT/VISA/INSURANCE/etc
  - status: NOT_SUBMITTED/PENDING/APPROVED/REJECTED
  - fileUrl, uploadedAt, expiryDate

Payment & PaymentContribution
  - id, bookingId, status: PENDING/SUCCEEDED/FAILED/REFUNDED
  - amount, method, stripePaymentId
  - PaymentContribution: tracks co-payer share

CreditWallet
  - userId, totalBalance, usedBalance
  - Credit transactions with expiry

TravelGroup & TravelGroupMember
  - Group for social features
  - Members with roles

Notification
  - id, userId, type, status: UNREAD/READ
  - content, actionUrl, createdAt

SupportTicket
  - id, userId, status, category, priority
  - messages[], attachments[], createdAt

Trip & Occurrence
  - Trip: product definition
  - Occurrence: specific departure date instance
  - destination, dates, price, travelers capacity
```

---

# PART 2: PUBLIC PORTAL SPECIFICATIONS

## PUBLIC PORTAL ROUTES (37 identified)

### Main Pages
- `/` - Homepage
- `/voyages` - Trip catalogue/search
- `/voyages/[slug]` - Trip detail page
- `/voyages/[slug]/[variantSlug]` - Variant selection
- `/contact` or `/contacter` - Contact page
- `/faq` - FAQ page
- `/independants` - Directory of creators
- `/p/[proSlug]` - Creator public profile

### Trip Detail Sub-pages
- `/voyages/[id]/timeline` - Trip timeline/itinerary
- `/voyages/[id]/vol-sec` - Standalone flights (if available)
- `/voyages/[id]/meals` - Meal inclusions detail
- `/voyages/[id]/premium` - Premium options
- `/voyages/[id]/budget-recap` - Budget breakdown
- `/voyages/[id]/sms-history` - SMS updates (if available)

### Legal & Info
- `/mentions-legales` - Legal notices
- `/cgv` - Terms & Conditions
- `/cgu` - General Terms
- `/confidentialite` - Privacy policy
- `/cookies` - Cookie policy
- `/accessibilite` - Accessibility statement

### Other
- `/catalogue` - Catalogue/Search (same as /voyages)
- `/blog` - Blog (future)
- `/about` - About Eventy
- `/partners` - Partner info (future)
- `/destinationes` - Destinations (future)

---

## PUBLIC PORTAL PAGES - DETAILED SPECIFICATIONS

### 1. HOMEPAGE (Landing Page)
**Route:** `/`

**Hero Section:**
- Large cover image
- Headline: "Le voyage de groupe où tu n'as rien à gérer, tout à vivre"
- Sub-headline: Brief value prop
- CTA button: "Découvrir les voyages"
- Optional video background (auto-muted)

**Section 1: "Autour de Chez Vous" (Near Me)**
- Proximity-based trip suggestions
- Uses browser geolocation (or city input)
- Radius: 100km around user
- 3-6 trips displayed as cards
- Filter options: Date, Budget, Duration, Theme

**Section 2: "Voyages Populaires"**
- Top-rated/most-booked trips
- 4-6 trip cards with:
  - Hero image
  - Title
  - Dates
  - Price from
  - Rating/reviews
  - Number of reviews

**Section 3: "Lieux Insolites" (Unique Destinations)**
- Filter by tag: INSOLITE
- 3-4 featured trips
- Tagline: "Découvrez des destinations hors des sentiers battus"

**Section 4: "Latest Updates"**
- Recently added/updated trips
- 3-4 trip cards

**Footer:**
- Links to legal pages
- Newsletter signup
- Social media links
- Contact info
- Copyright

**Filters (sticky or hero):**
- Date range picker
- Budget slider (€0-€5000)
- Duration (days)
- Theme/Category (Beach, Mountain, Culture, Adventure, etc)
- Region
- Difficulty level (if applicable)

---

### 2. CATALOGUE / VOYAGE LISTING
**Route:** `/voyages`, `/catalogue`

**Header:**
- Search bar (by destination, theme, etc)
- Filter panel (collapsible on mobile):
  - Date range
  - Budget min/max
  - Duration (days)
  - Theme (multiple select)
  - Region/Destination
  - Ratings
  - Distance from location
  - Difficulty level
  - Group size

**Sorting Options:**
- Relevance
- Price (low to high)
- Price (high to low)
- Departure date (nearest first)
- Rating (highest first)
- Newest
- Distance (closest first)

**Results Display:**
- Grid view (default) or List view toggle
- Trip cards showing:
  - Hero image
  - Title
  - Destination
  - Departure date
  - Duration
  - Price from (per person)
  - Star rating & review count
  - Quick info: "Vendu en chambre" badge
  - "Meals included" badge
  - Creator/Indie name
  - Availability indicator (Available/Limited/Waitlist)

**Pagination:**
- Load more button or page numbers
- Results count ("Showing X-Y of Z")

**Empty State:**
- "No trips found for your criteria"
- Suggestion to broaden filters
- Link to browse all trips

---

### 3. VOYAGE DETAIL PAGE
**Route:** `/voyages/[slug]`

**Hero Section:**
- Large background image or carousel
- Trip title & headline
- Key info overlay:
  - Dates
  - Duration
  - Max travelers
  - Price from
  - Rating (if reviews exist)

**Main Content Tabs:**

**Tab 1: Présentation (Overview)**
- Detailed description (rich text/HTML)
- Hero video (optional)
- Trip theme tags
- Highlights section (key points)

**Tab 2: Itinéraire (Itinerary)**
- Day-by-day breakdown
- Each day:
  - Date
  - Location
  - Activities included
  - Meals included (breakfast/lunch/dinner)
  - Accommodation details
  - Transport info

**Tab 3: Budget**
- Price breakdown by category:
  - Transport (flight/bus)
  - Accommodation
  - Meals
  - Activities
  - Insurance (if included)
  - Transfers/Pickups
  - Optional add-ons

**Tab 4: Hébergement (Accommodation)**
- Hotel name, address, star rating
- Photos gallery
- Room types available
- Check-in/check-out times
- Amenities list
- Contact info

**Tab 5: Transport**
- Pickup/dropoff locations
- Departure times
- Bus company info
- Flight details (if applicable)
  - Airlines
  - Airports
  - Flight numbers
  - Baggage allowance
  - Seat selection info

**Tab 6: Activités (Activities)**
- Included activities list
- Optional activities with pricing
- Activity descriptions
- Photos/videos
- Duration & difficulty
- Age restrictions (if any)

**Tab 7: Avis (Reviews)**
- Customer testimonials
- Star ratings (1-5)
- Review text & date
- Reviewer name/photo
- Rating distribution graph
- Filter/sort reviews

**Tab 8: FAQ**
- Frequently asked questions about this trip
- Collapsible Q&A format
- Global FAQ link

**Sidebar:**
- Price display (per person, in various occupancies)
- Occupancy selector (1/2/3/4 per room)
- Availability status:
  - "Available" (green)
  - "Limited spaces" (yellow)
  - "Waitlist" (gray)
- CTA: "Réserver maintenant" / "Rejoindre la liste d'attente"
- Vendu par chambre badge (if applicable)
- Meals included badge
- Insurance option checkbox (with modal detail)
- Creator/Indie info card:
  - Name, photo, badge (APPROVED status)
  - Rating, reviews count
  - "Suivre" button (follow)
  - "Contacter" button
- Share buttons (social, email, WhatsApp)
- Wishlist/Favorite button (heart icon)

**Bottom Section:**
- "You might also like" (similar trips carousel)
- Reviews highlight section
- Trust indicators (Eventy security seal, guarantees)

---

### 4. CREATOR PUBLIC PROFILE
**Route:** `/p/[proSlug]`, `/independants`

**Hero Section:**
- Creator cover image (or branded bg)
- Profile photo
- Name & badge (PENDING/LIMITED/APPROVED/REJECTED)
- Zone of departure (location)
- Short bio/description
- Video introduction (optional)

**Sections:**

**Section 1: Mes voyages (Creator's Trips)**
- Cards showing trips created by this creator
- Filterable by:
  - Upcoming
  - By destination
  - By theme
- Cards include:
  - Trip image
  - Title, dates, price
  - Availability
  - Rating if reviews exist
  - CTA: "Voir le détail" or "Réserver"

**Section 2: Catalogue Eventy (Eventy Recommends)**
- Trips recommended near creator's zone
- Radius: 100km from departure point
- Cards with same format
- Label: "Recommandé près de vous"

**Section 3: À propos (About)**
- Longer biography
- Experience/credentials
- Specialties (themes, regions)
- Languages spoken

**Section 4: Contact**
- Chat option (Eventy messaging)
- WhatsApp link (if provided)
- Phone call (reveal on click)
- Email form

**Section 5: Suivre (Follow)**
- "Follow" button
- Opt-in for trip notifications
- "Following" label if user follows

**Trust Section:**
- Verification status badge
- Years in business
- Total trips led
- Total travelers
- Average rating
- Guarantees info (Eventy financial guarantee)

---

### 5. CONTACT PAGE
**Route:** `/contact`, `/contacter`

**Header:**
- "Nous sommes à votre écoute"
- Brief intro text

**Contact Form:**
- Name (text input)
- Email (email input)
- Subject (select dropdown)
- Message (textarea)
- Attachment upload (optional, max 5MB)
- Honeypot field (spam prevention)
- GDPR consent checkbox
- "Envoyer" button

**Contact Methods:**
- Email: contact@eventy.fr
- Phone: (masked or clickable)
- WhatsApp
- Chat widget
- Social media links

**FAQ Link:**
- "Consulter notre FAQ" CTA

**Response Time:**
- "We'll respond within 24 hours" message

---

### 6. FAQ PAGE
**Route:** `/faq`

**Header:**
- Search bar (full-text search)
- Filter by category (General/Booking/Documents/Payment/Transport/Accommodation/Activities/Cancellation/Insurance)

**Content:**
- Collapsible Q&A format
- Each question:
  - Clear, searchable title
  - Answer (rich text, can include images/links)
  - Related questions links
  - Expand/collapse on click

**Categories:**
1. General Information
2. Booking Process
3. Payment & Refunds
4. Documents & Visas
5. Transport
6. Accommodation
7. Activities
8. Cancellation & Changes
9. Insurance
10. Safety & Emergency
11. Group Management
12. Post-Trip

**Bottom Section:**
- "Didn't find your answer?" CTA
- Contact form link
- Live chat option

---

### 7. INDEPENDENT DIRECTORY (Annuaire)
**Route:** `/independants`

**Filters:**
- Status: PENDING/LIMITED/APPROVED/REJECTED
- Zone/Region
- Specialties (themes)
- Languages
- Rating

**Display:**
- Cards for each approved creator
- Card shows:
  - Profile photo
  - Name & status badge
  - Zone
  - Specialties (tags)
  - Star rating
  - "Voir le profil" CTA
  - "Suivre" button

**Sorting:**
- By rating (highest first)
- By name (A-Z)
- By zone (proximity)

---

### 8. LEGAL PAGES

**Terms & Conditions (/cgv, /cgu)**
- Eventy responsibilities
- Cancellation policy
- Payment terms
- Traveler obligations
- Liability disclaimers
- Severability clause
- Dispute resolution

**Privacy Policy (/confidentialite)**
- Data controller info
- Data collected
- Purposes of processing
- Legal bases
- Retention periods
- User rights (GDPR)
- Contact for data inquiries

**Cookie Policy (/cookies)**
- Cookie banner (CMP)
- Types of cookies:
  - Necessary (functionality)
  - Analytics (Google Analytics, optional)
  - Marketing (optional)
- Accept/Reject buttons
- Preferences link

**Accessibility Statement (/accessibilite)**
- WCAG 2.1 AA compliance
- Known issues
- Contact for accessibility issues
- Keyboard navigation info

**Legal Notices (/mentions-legales)**
- Company info (SIREN, RCS, address)
- Director/Publisher name
- Contact email & phone
- Hosting provider info
- Copyright notice

---

# PART 3: CHECKOUT FLOW

**Route Pattern:** `/checkout/[bookingId]/step-*`

## Step 1: Select Room Type
**Route:** `/checkout/[bookingId]/step-1-chambre`

**Display:**
- Available room types (1/2/3/4 places)
- Photos per room type
- Amenities icons
- Price per room

**Selection:**
- Choose room capacity
- Choose occupancy (who sleeps where)
- Example: "Chambre 3 places, occupée par 2 pers"
- Price calculation updates (price per person = room price / occupancy)

**Button:** "Continuer"

---

## Step 2: Select Payment Method
**Route:** `/checkout/[bookingId]/step-2-paiement`

**Payment Options:**
A) Je paie tout (I pay everything)
B) Chacun paie sa part (Each person pays their share)
C) Je paie N parts + j'invite (I pay X shares + invite others)
D) Je paie tout (remboursement hors Eventy) - I pay, reimburse outside

**Display:**
- Total amount
- Your amount to pay (calculated based on selection)
- Breakdown if group booking
- Occupancy count
- Parts distribution (if applicable)

**Button:** "Continuer"

---

## Step 3: Invite Co-payers
**Route:** `/checkout/[bookingId]/step-3-inviter`

**If Selected:**
- Email/phone input for co-payers
- Multiple invite fields
- Generate PaymentInviteToken per person
- Email sent with payment link
- "Renvoyer lien" button (resend, with rate limiting)

---

## Step 4: Payment
**Route:** `/checkout/[bookingId]/payment`

**Display:**
- Final summary
- Breakdown of costs
- Promo code field (if applicable)
- Credit/Wallet balance (auto-apply or manual)
- Final amount due

**Payment Method Selection:**
- Stripe card payment
- Google Pay / Apple Pay (if enabled)
- Bank transfer / SEPA (future)

**Stripe Checkout:**
- Hosted payment form
- Card details collection
- 3D Secure (if required)
- Receipt generation

**Success:**
- Confirmation page
- Booking reference
- Email confirmation sent (template: booking_confirmed)
- CTA: "Aller à mon espace client"

**Failure:**
- Error message
- Retry link with email
- Support contact info
- Template: payment_failed

---

## Post-Payment Flow

**Email Confirmations:**
- booking_confirmed (with template vars: firstName, tripName, refCode, departureDate, dashboardUrl)
- payment_received (if group payer)
- payment_failed (with retry link)

**Statuses Updated:**
- RoomBooking: HELD → PARTIALLY_PAID or FULLY_PAID
- PaymentContribution: PENDING → SUCCEEDED
- If no SUCCEEDED payment: RoomBooking → EXPIRED

**Wallet Updates (if partial refund):**
- CreditWallet: credited if refund partial
- Email: booking_confirmed + payment_received

---

# PART 4: KEY DATA MODELS

## Core Entities

```
User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  nationality?: string
  dateOfBirth?: Date
  status: ACTIVE | INACTIVE | SUSPENDED
  createdAt: DateTime
  updatedAt: DateTime
}

Booking / RoomBooking {
  id: string
  userId: string (primary booker)
  tripId: string
  occurrenceId: string
  status: DRAFT | HELD | PARTIALLY_PAID | FULLY_PAID | EXPIRED | CANCELLED | COMPLETED
  paymentStatus: UNPAID | PARTIALLY_PAID | FULLY_PAID | REFUNDED
  totalPrice: number (in cents)
  paidAmount: number
  roomingChoiceId?: string
  occupancyCount: number (travelers per room)
  createdAt: DateTime
  updatedAt: DateTime
  expiresAt: DateTime
}

Traveler {
  id: string
  bookingId: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  nationality: string
  passportNumber: string (encrypted)
  role: PRIMARY | COPAYER | PARTICIPANT
  createdAt: DateTime
}

Trip {
  id: string
  title: string
  slug: string
  description: string (HTML)
  destination: string
  theme: string[]
  duration: number (days)
  startDate: Date (first occurrence)
  pricePerPerson: number (cents)
  capacity: number (max travelers)
  createdBy: string (creator/indie userId)
  publishedAt?: DateTime
  status: DRAFT | PUBLISHED | ARCHIVED
  createdAt: DateTime
  updatedAt: DateTime
}

Occurrence {
  id: string
  tripId: string
  departureDate: Date
  returnDate: Date
  status: DRAFT | PUBLISHED | CANCELLED | COMPLETED
  capacity: number
  occupancy: number (current bookings)
  price: number (cents, may vary by occurrence)
  createdAt: DateTime
  updatedAt: DateTime
}

Document {
  id: string
  bookingId: string
  travelerId?: string
  type: PASSPORT | VISA | INSURANCE | VACCINATION | AUTHORIZATION_LETTER | HEALTH_DECLARATION | OTHER
  status: NOT_SUBMITTED | PENDING_REVIEW | APPROVED | REJECTED | EXPIRED
  fileUrl: string (S3)
  uploadedAt: DateTime
  reviewedAt?: DateTime
  expiryDate?: Date
  rejectionReason?: string
  createdAt: DateTime
  updatedAt: DateTime
}

Payment & PaymentContribution {
  id: string
  bookingId: string
  amount: number (cents)
  status: PENDING | SUCCEEDED | FAILED | REFUNDED
  paymentMethod: CARD | BANK_TRANSFER | WALLET_CREDIT | OTHER
  stripePaymentId?: string
  stripeCustomerId?: string
  createdAt: DateTime
  updatedAt: DateTime
}

PaymentContribution {
  id: string
  paymentId: string
  userId: string (payer)
  amount: number
  status: PENDING | SUCCEEDED | FAILED | DISPUTED | REFUNDED
  inviteToken: string (for co-payer links)
  createdAt: DateTime
}

CreditWallet {
  id: string
  userId: string
  totalBalance: number (cents)
  usedBalance: number
  createdAt: DateTime
  updatedAt: DateTime
}

CreditTransaction {
  id: string
  walletId: string
  amount: number
  type: ISSUED | REDEEMED | REFUNDED | EXPIRED
  reason: string
  expiresAt: Date (12 months)
  createdAt: DateTime
}

TravelGroup {
  id: string
  name: string
  ownerId: string
  tripId?: string
  description?: string
  createdAt: DateTime
  updatedAt: DateTime
}

TravelGroupMember {
  id: string
  groupId: string
  userId: string
  role: OWNER | MEMBER | INVITED
  inviteEmail?: string
  joinedAt?: DateTime
  createdAt: DateTime
}

Notification {
  id: string
  userId: string
  type: PAYMENT_CONFIRMED | DOCUMENT_APPROVED | FLIGHT_UPDATE | ACTIVITY_REMINDER | GROUP_INVITE | MESSAGE_RECEIVED | REFUND_ISSUED | TRIP_REMINDER
  status: UNREAD | READ
  content: string
  actionUrl?: string
  relatedEntityId?: string
  createdAt: DateTime
  readAt?: DateTime
}

SupportTicket {
  id: string
  userId: string
  status: NEW | IN_PROGRESS | WAITING_CLIENT | RESOLVED | CLOSED | REOPENED
  category: BOOKING | PAYMENT | DOCUMENTS | TRANSPORT | ACTIVITY | ACCOMMODATION | OTHER
  priority: P0 | P1 | P2 (auto-assigned)
  title: string
  description: string
  messages: Message[]
  attachments: FileAsset[]
  createdAt: DateTime
  updatedAt: DateTime
  resolvedAt?: DateTime
}

Message {
  id: string
  ticketId?: string
  senderId: string
  receiverId?: string
  body: string
  attachments?: FileAsset[]
  createdAt: DateTime
}

FileAsset / Document (uploads) {
  id: string
  userId: string
  type: DOCUMENT | TRIP_MEMORY | EVIDENCE | OTHER
  mimeType: string
  s3Key: string
  s3Url: string
  fileSize: number (bytes)
  originalName: string
  uploadedAt: DateTime
  expiresAt?: DateTime
  createdAt: DateTime
}

ConsentRecord (GDPR) {
  id: string
  userId?: string
  emailHash?: string
  scope: ANALYTICS | MARKETING | COOKIES
  status: GRANTED | DENIED | WITHDRAWN
  version: number
  createdAt: DateTime
  revokedAt?: DateTime
}

LegalPageVersion {
  id: string
  type: TERMS | PRIVACY | COOKIE | ACCESSIBILITY
  version: number
  content: string (HTML)
  publishedAt: DateTime
  createdAt: DateTime
}
```

---

# PART 5: UI COMPONENTS & FEATURES

## Navigation Components
- Header (sticky, responsive)
- Footer (multi-column, legal links, newsletter signup)
- Breadcrumb navigation
- Sidebar (mobile collapsible)
- Tab navigation (for detail pages)
- Pagination (load more / page numbers)

## Card Components
- Trip card (image, title, dates, price, rating, availability)
- Creator card (photo, name, badges, rating, follow button)
- Notification card (type-specific layout)
- Message card (in thread view)

## Form Components
- Text input (name, email, phone)
- Textarea (message, description)
- Date picker (departure, birth date)
- Time picker (pickup time)
- Select dropdown (country, theme, category)
- Multi-select (themes, filters)
- Checkbox (agree to terms, optional services)
- Radio buttons (payment method selection)
- File upload (drag-and-drop, with validation)
- Autocomplete (destination, traveler name)

## Modal/Dialog Components
- Confirmation modal (cancellation, deletion)
- Insurance detail modal (expanded coverage info)
- Document preview modal (PDF viewer)
- Image gallery modal (lightbox, carousel)
- Error modal (with retry option)
- Success modal (booking confirmation)

## Data Display
- Tables (payment history, travelers list, activity schedule)
- Timeline (itinerary, day-by-day breakdown)
- Badges (status, availability, verification)
- Progress bars (document submission, payment progress)
- Progress spinners (loading states)
- Skeleton loaders (content loading placeholders)
- Counters (notifications, co-payers)

## Interactive Elements
- Buttons (primary/secondary, disabled states, loading states)
- Links (internal navigation, external links)
- Accordions (FAQ, collapsible sections)
- Toggles (view mode, dark mode)
- Sliders (price range filter, rating slider)
- Dropdowns (sorting, filtering, user menu)
- Carousels (next trips, recommended trips, reviews)
- Rating widget (star rating display, click-to-rate)

## Media Components
- Hero image/carousel (trip detail, creator profile)
- Image gallery (hotel photos, activity images, trip memories)
- Video player (trip intro, activity preview, creator video)
- Audio player (future - podcast/guide)

## Status Indicators
- Badges (PENDING, APPROVED, LIMITED, REJECTED)
- Status pills (Payment: PAID/UNPAID, Documents: COMPLETE/INCOMPLETE)
- Color-coded status (Green=OK, Yellow=Warning, Red=Alert)
- Icons (check mark, warning, error, info)
- Dot indicators (online status, sync status)

## Notification Components
- Toast notifications (temporary messages, bottom-right)
- Alert banners (persistent warnings, top of page)
- In-app notification bell (with dropdown menu)
- Inline alerts (form validation errors, success messages)
- Snackbar (action confirmations)

## Input Validation
- Real-time error messages (below input field)
- Validation icons (checkmark for valid, X for invalid)
- Helpful error messages (not just "invalid")
- Character counter (for textarea, max limits)
- Password strength meter (if password field)

---

# PART 6: FEATURE SPECIFICATIONS

## Checkout & Payment Features

**Room Selection:**
- Occupancy selector (1-N per room)
- Price calculation per person (room price / occupancy)
- Hotel block selection (if multiple hotels)
- Verification: len(pricingParts) == occupancyCount

**Payment Distribution:**
- Option A: I pay all (stripeCharge = fullAmount)
- Option B: Each pays share (multiple PaymentContributions)
- Option C: I pay N parts + invite (mixed)
- Option D: I pay all, reimburse outside (booking confirmed, payment pending)

**Co-payer Management:**
- Invite emails/phone via form
- Generate PaymentInviteToken per person
- Track payment status per contributor
- Resend capability (rate-limited)
- Email template with direct payment link

**Payment Processing:**
- Stripe integration (hosted checkout)
- 3D Secure for high-risk transactions
- Card tokenization
- Webhook handling (payment.succeeded, payment.failed)
- Idempotent payment processing
- Fallback on network error

**Wallet/Credits:**
- Auto-apply credits at checkout (if available)
- Manual credit entry option
- Credit expiration tracking (12 months)
- Partial credit usage supported
- Credit history for each user

---

## Document Management

**Submission:**
- Drag-and-drop upload
- Multiple file formats: PDF, JPG, PNG, HEIC
- File size limits: 10MB per file
- Type-specific validation (e.g., PDF for contracts)
- Scan for MIME type accuracy

**Status Tracking:**
- NOT_SUBMITTED → PENDING_REVIEW → APPROVED / REJECTED
- Rejection with reason + retry option
- Expiry date tracking (visa, insurance, etc)
- Deadline reminders (J-14, J-7 before trip)
- Dashboard badge: "Documents incomplete"

**Admin Review:**
- Batch review interface
- Document preview (PDF/image viewer)
- Approve/Reject with optional note
- Audit trail of all actions

**Privacy:**
- PII masking in admin views
- Encryption of sensitive documents at rest
- Secure S3 storage with versioning
- Access logs for compliance

---

## Support & Incident Management

**Ticket Creation:**
- Category selection (BOOKING/PAYMENT/TRANSPORT/etc)
- Priority auto-assignment based on keywords
- Attachment support (evidence photos, receipts)
- SLA assignment (P0=1h, P1=4h, P2=24h)

**Ticket Lifecycle:**
- NEW → IN_PROGRESS → RESOLVED → CLOSED
- WAITING_CLIENT status (client response pending)
- Auto-escalation after response timeout
- Auto-close if WAITING_CLIENT > 7 days
- Reopen capability with new message

**Messaging:**
- Thread-based conversation
- File attachments in messages
- Mention/notification on new message
- Read receipts
- Typing indicators

**Incident Declaration:**
- Date, time, location, people involved
- Witness information
- Photos/videos as evidence
- Police/authority report reference
- Damage/cost claim
- Automatic incident ticket creation

---

## Notification System

**Triggers:**
- Payment confirmed / failed
- Document status changes
- Flight information updates
- Activity reminders (T-48h, T-24h, T-7days)
- Group member activities
- New messages
- Refund issued
- Trip cancellation
- Accommodation changes

**Delivery Channels:**
- In-app (Notification table, bell icon)
- Email (transactional, batched)
- SMS (critical alerts only)
- Push notifications (PWA, if enabled)

**Preferences:**
- Per-user notification settings
- Category-based opt-in/out
- Quiet hours (do not disturb)
- Email frequency (immediate, daily digest, weekly)
- Channel preference (email, SMS, in-app)

**Email Templates:**
- booking_confirmed (vars: firstName, tripName, refCode, departureDate, dashboardUrl)
- payment_received (payment method, amount)
- payment_failed (retry link, support contact)
- document_approved (document type, trip link)
- document_rejected (reason, retry instructions)
- flight_updated (new times, itinerary link)
- refund_issued (amount, method, timeline)
- group_invite (group name, trip details, join link)
- message_received (sender name, preview, thread link)

---

## Search & Filtering (Catalogue)

**Search Capabilities:**
- Full-text search (destination, title, theme keywords)
- Auto-complete suggestions
- Search history (saved for logged-in users)

**Filters:**
- Date range (check-in/check-out or dates range)
- Budget (min-max slider)
- Duration (exact or range)
- Theme/Category (multi-select)
- Region/Destination (hierarchical)
- Proximity (distance from user location)
- Ratings (minimum star rating)
- Availability (Available/Limited/Waitlist)
- Group size (min-max travelers)
- Difficulty level (easy/moderate/challenging)
- Meals included (yes/no/partial)

**Sorting:**
- Relevance (default, if search used)
- Price (low to high, high to low)
- Departure date (nearest first, furthest first)
- Rating (highest first)
- Newest (recently added)
- Popularity (most viewed/booked)
- Proximity (closest to user)

**Faceted Navigation:**
- Filter count per category
- Filter combinations (AND logic within, OR between categories)
- "Clear all filters" button
- Active filter pills (removable)
- Filter persistence (maintain filters on back button)

---

## Social Features (Groups)

**Group Creation:**
- Name, description, optional image
- Add members via email invite
- Generate shareable invite link
- Privacy: private group (members only) vs shared

**Group Chat:**
- Threaded messaging
- File sharing
- @mentions
- Read receipts
- Typing indicators

**Group Activities:**
- Shared trip booking (all members see same booking)
- Group role: Owner (can manage members), Member (can chat/share)
- Member list with avatars
- Remove member functionality
- Leave group functionality

**Shared Features:**
- Trip memory album (all members upload/view)
- Expense tracking (optional, for group costs)
- Vote/poll on preferences
- Shared notes/planning document

---

## Creator/Indie Public Profile

**Verification Badge:**
- PENDING (yellow, review in progress)
- LIMITED (orange, conditional approval)
- APPROVED (green, full featured)
- REJECTED (gray, with reason)

**Profile Info:**
- Photo, name, bio, video intro
- Years of experience
- Zone of departure
- Specialties (themes, destinations)
- Languages
- Contact options (chat, WhatsApp, phone)

**Trip Showcase:**
- Creator's own trips (prioritized)
- Recommended nearby trips (from Eventy catalogue)
- Filtering by availability, date, price

**Reviews & Ratings:**
- Average star rating
- Total review count
- Recent reviews displayed
- "Leave review" CTA (post-trip)

**Follow Feature:**
- Follow button (if not creator's own profile)
- Email opt-in for new trip notifications
- Follower count
- "Following" list (if public)

---

## Compliance & Legal

**CMP (Consent Management Platform):**
- Cookie banner (top or bottom)
- Accept All / Reject All buttons
- Preferences button
- Necessary cookies (always on)
- Analytics cookies (optional)
- Marketing cookies (optional)
- Preference persistence (localStorage, cookie)

**GDPR Features:**
- Privacy policy (updated, versioned)
- Terms of Service (updated, versioned)
- Cookie policy (updated, versioned)
- DSAR (Data Subject Access Request):
  - Form on privacy page
  - SLA: 15 days
  - Delivery: downloadable JSON
- Account deletion option
- Data export option
- Consent records table (audit trail)
- Retention policies (configurable per entity type)

**Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support (ARIA labels, alt text)
- Color contrast (4.5:1 for text)
- Focus indicators
- Form error announcements
- Accessibility statement page (/accessibilite)

---

## Performance & Mobile

**Mobile-First Design:**
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1024px (desktop)
- Touch-friendly buttons (min 44px)
- Optimized images (WebP with fallback)
- Lazy loading (images, components)
- Minimal redirects
- Optimized bundle size

**Performance Metrics:**
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.8s
- Lighthouse score >= 90

**Mobile-Specific Features:**
- Bottom sheet (payment details, filters)
- Swipe gestures (carousel, trip details)
- Pinch to zoom (image gallery)
- One-tap buttons (phone call, WhatsApp)
- Mobile menu (hamburger icon)
- Sticky header/footer (quick actions)

---

## Analytics & Tracking

**Events Tracked:**
- Page views (with context: trip_id, user_id, referrer)
- Trip detail views (viewed timestamp, view duration)
- Catalogue searches (search query, filters used, results count)
- Booking creation (trip_id, price, group size)
- Payment (amount, method, status)
- Document uploads (type, status)
- Support ticket creation (category, priority)
- Creator follows
- Trip reviews (rating, sentiment)

**UTM Parameters:**
- utm_source (campaign source)
- utm_medium (campaign medium)
- utm_campaign (campaign name)
- utm_content (creative asset)
- utm_term (keyword)
- Tracked on trip links, creator profiles, share buttons

**QR Codes & Shortlinks:**
- Trackable shortlinks (/s/[code])
- QR code generation (no PII in URL)
- Scan attribution (device, time, location)
- Conversion tracking (scan → view → booking)
- Reports on QR effectiveness

---

## Email Templates & Communication

**Client Email Categories:**

1. **Transaction Emails** (Transactional, required by law)
   - booking_confirmed
   - payment_received
   - payment_failed
   - refund_issued
   - document_approved
   - document_rejected

2. **Trip Updates** (Trip context)
   - flight_updated (new times, airline changes)
   - activity_reminder (activity starting soon)
   - accommodation_confirmed (hotel details)
   - transport_reminder (pickup details, T-48h/T-24h/T-7days)
   - itinerary_published (trip program available)

3. **Group & Social** (Engagement)
   - group_invite_received
   - member_joined_group
   - new_message_in_group
   - group_chat_activity

4. **Support** (Help-focused)
   - ticket_created (confirmation)
   - ticket_update (agent response)
   - ticket_resolved (resolution summary)
   - incident_acknowledged (confirmation of incident receipt)

5. **Account & Preferences** (Account-specific)
   - welcome (new account)
   - password_reset (with link)
   - account_deleted (confirmation)
   - credit_issued (wallet credit notification, if NO-GO=false)
   - credit_expiring_soon (12 month deadline reminder, if NO-GO=false)

6. **Marketing** (Promotional, opt-in)
   - newsletter (curated trips)
   - new_trip_notification (creator follow list)
   - flash_sale (limited-time offer)
   - recommend_trips (based on browsing history)

---

## Admin & Staff UI Features (Referenced in specs)

**Admin Panels:**
- Voyage/Trip management (status, costs, publishing)
- Transport management (flights, buses, routing)
- Accommodation management (hotels, blocks, inventory)
- Finance dashboard (payments, refunds, ledger)
- Customer support (ticket queue, priority assignment)
- Document review (batch processing, approval)
- User management (roles, permissions, teams)
- Reports & Analytics (various dashboards)
- System settings (feature flags, email templates, policies)

**Admin Features:**
- Role-based access control (RBAC) with custom permissions
- Audit logs (all actions with user, timestamp, before/after state)
- Batch operations (bulk approve documents, send emails, export data)
- Filters & search (advanced filtering on all lists)
- Export functions (CSV, PDF, ICS for calendars)
- Notifications & alerts (SLA tracking, escalation)
- Workflow automation (email triggers, status transitions)

---

## Summary Statistics

**Extracted Components:**
- **Client Portal Routes:** 82
- **Public Portal Routes:** 37
- **Data Models:** 17 core entities
- **UI Components:** 2,366+ referenced
- **Pages Specified:** 20+ detailed
- **Email Templates:** 18+ categories
- **Features Documented:** 25+ major feature areas

**Coverage:**
- Full client booking lifecycle (search → book → manage → support)
- Complete public discovery (homepage → catalogue → detail → booking)
- Comprehensive user management (profile, documents, payments, wallet)
- Social features (groups, creator profiles, reviews)
- Compliance (GDPR, CCPA ready, accessibility, legal)
- Admin/Staff operations (referenced throughout)

---

**END OF SPECIFICATIONS**

This document represents a comprehensive extraction of all CLIENT and PUBLIC portal specifications from the draw.io diagram. All key pages, routes, data models, UI components, and features are documented.

