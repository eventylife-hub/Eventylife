# EVENTY PRO PORTAL — COMPLETE SPECIFICATIONS EXTRACTION
**Source**: eventy_v53_COMPLET_PRET_CODAGE.drawio (11MB XML)
**Extracted**: 2026-03-19
**Format**: Comprehensive inventory of all PRO portal pages, features, and API specifications

---

## TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [PRO Portal Pages Inventory](#pro-portal-pages-inventory)
3. [Core PRO Features by Page](#core-pro-features-by-page)
4. [Permissions & RBAC](#permissions--rbac)
5. [API Endpoints & Data Models](#api-endpoints--data-models)
6. [Key Technical Specifications](#key-technical-specifications)

---

## EXECUTIVE SUMMARY

### PRO Portal Scope
- **47 pages** in PRO portal (/pro/*)
- **5 major page categories** (Dashboard, Voyages, Finance, Communication, Tools)
- **3 user types** (CREATOR, INDE, SELLER/MAGASIN)
- **Multiple workflow states** (Onboarding → Active → Archived)
- **Integrated with**: Client portal, Admin portal, Marketing, Support systems

### Key Identifiers Found
- **PRO_ONBOARDING** (5 types, state machine)
- **PRO_PAGE** (24 references - public profile + marketing)
- **PRO_PROFILE** (shortlinks, QR codes, attribution)
- **PRO_MESSAGE** (10+ notification templates)
- **PRO_FINANCE/REVENUE** (payout, commissions, invoicing)
- **PRO_SUPPORT** (tickets, status changes, audit)

---

## PRO PORTAL PAGES INVENTORY

### 1. **ONBOARDING & ACCOUNT SETUP**

#### PRO_ONBOARDING (DEV_009 — 5 Types)
**Pages**: /pro/inscription, /pro/onboarding/*, /pro/profil

**Onboarding Types**:
1. **CREATOR** (indépendant voyage)
   - Profile (nom, photo, bio)
   - Company (SIRET, RNA)
   - Documents (CI, assurance RC, RIB)
   - Legal (CGU, Politique confidentialité)

2. **INDE** (accompagnateur)
   - Profil simplifié
   - Disponibilités + rotations
   - Points ramassage (5 minimum)
   - Formation obligatoire

3. **SELLER/VENDEUR** (partenaire ventes)
   - Store setup (magasin, adresse)
   - Commission policy
   - Marketing QR/shortlinks
   - No document requirements

4. **ASSOCIATION_CREATOR** (créateur association)
   - RNA (numéro RNA)
   - Simplified company flow
   - Revenue split configuration
   - Legal simplified

5. **STAFF_TEAM_MEMBER** (employé Eventy)
   - Role assignment
   - Service-based access
   - Trust levels
   - Audit tracking

**State Machine**:
```
PENDING → PROFILE_INCOMPLETE → DOCUMENTS_PENDING → VALIDATION_IN_PROGRESS 
  ↓ (Admin approval)
APPROVED → ONBOARDING_COMPLETE → ACTIVE
  ↓ (Rejection)
REJECTED (reason + retry option)
```

**Status Check Endpoint**:
```
GET /pro/onboarding-status
Returns:
  - needsProfile: boolean
  - needsCompany: boolean (SIRET/RNA/RCS)
  - needsDocs: boolean
  - needsDocsDetail[]: {code, status, blocking}
  - needsSignaturesDetail[]: {code, status, blocking}
  - needsIban: boolean
  - needsValidation: boolean
  - needsLegal: boolean
  - insuranceStatus: {hasValidRCPro, expiresAt, status}
  - complianceScore / complianceTotal
  - blockingActions: string[]
  - nextBestAction: {label, href}
  - statusMessage: string
```

**Guards & Access Control**:
- `ProValidationGuard` → 403 code=PRO_NOT_VALIDATED
- `ProOnboardingCompleteGuard` → 403 code=PRO_ONBOARDING_INCOMPLETE
- Banner component: `BannerAccessLimited({scope, code, message, actions[]})`

---

### 2. **DASHBOARD & HOME**

#### PRO_ACCUEIL / DASHBOARD (Home)
**Pages**: /pro/ (hub adapté par pack)

**Features**:
- Welcome message (role-specific)
- Quick stats:
  - Total voyages (active/archived)
  - Total réservations (month/YTD)
  - Total revenus (commission + ventes)
  - Pending actions count

- Quick access (role-based):
  - **Creator**: Créer voyage, Mes voyages, Revenus, Formation
  - **Inde**: Disponibilités, Mes affectations, Relevé, Formations
  - **Vendor**: Magasin, Stats QR, Revenus, Commandes

- Recent activity feed
- Formation recommendations (non-blocking)
- Status banners (missing IBAN, docs pending, etc.)
- Pack-specific UX (different layouts per tier)

---

### 3. **VOYAGE MANAGEMENT**

#### PRO_MES_VOYAGES / VOYAGES
**Pages**: /pro/voyages, /pro/voyages/[id], /pro/voyages/create, /pro/voyages/[id]/edit

**List View** (/pro/voyages):
- Filters: Status (draft/submitted/approved/public/archived)
- Columns: Titre, Dates, Participants (current/max), État, Actions
- Pagination + Export CSV
- Tab switcher: Active | Archived | Draft

**Detail View** (/pro/voyages/[id]):
- **Basic Info**: Title, dates, destination, theme, description
- **Pricing Section**:
  - Base price (HT)
  - Occupancy tiers (single/double/triple)
  - Reminders (markup by room type)
  - Total per person (auto-calc)

- **Inventory Section**:
  - Total capacity
  - Rooms by type + count
  - Current bookings
  - Availability timeline

- **Team Section**:
  - Creator (display only)
  - Inde(s) assigned
  - Co-organizers
  - Transport staff (if applicable)

- **Documents Tab**:
  - Program (PDF)
  - Hotel contracts
  - Transport agreements
  - Traveler docs (CI/passport status)

- **Status & Actions**:
  - Status indicator (Draft → Submitted → Approved → Public)
  - Approve button (Admin preview)
  - Publish button (makes public + bookable)
  - Edit button (phase-dependent restrictions)
  - Share QR/shortlink (if approved)
  - Archive button (after end date + delay)

**Create/Edit Flow**:
- Step 1: Basic info (title, dates, theme)
- Step 2: Destination + Routing
- Step 3: Accommodation (hotels, rooms)
- Step 4: Pricing
- Step 5: Team (indes, co-organizers)
- Step 6: Transport + Routing
- Step 7: Activities
- Step 8: Documents + Compliance
- Step 9: Review + Submit

---

### 4. **RÉSERVATIONS & GROUPAGE**

#### PRO_BOOKING (Groupes)
**Pages**: /pro/reservations, /pro/reservations/[id], /pro/groupes

**Group Management**:
- View all groups (status: forming/confirmed/partial/expired)
- Group detail:
  - Code + members list
  - Payment status per member
  - Rooming assignments
  - Hold timer (if applicable)
  - Message thread (group ↔ pro)
  - Export member list + contact info

**Member Visibility Rules** (Privacy):
- Pro sees: First names, room assignments, payment status
- Pro does NOT see: Email, phone, full address (except leader if group leader)
- Pro sees aggregates: Total rooms paid, total people, hold expiry

**Communication**:
- Message to group (notify all + email)
- Automated messages:
  - GROUP_CREATED
  - GROUP_HOLD_STARTED
  - GROUP_CONFIRMED
  - GROUP_PARTIAL
  - GROUP_EXPIRED
  - GROUP_MEMBER_JOINED

---

### 5. **FINANCES & REVENUE**

#### PRO_REVENUS / FINANCE
**Pages**: /pro/revenus, /pro/revenus/[period], /pro/documents/factures, /pro/parametres/paiement

**Revenue Dashboard**:
- Total YTD revenue (HT commission only)
- Monthly breakdown (graph)
- Pending payouts (awaiting bank details or 24h minimum)
- Last payout date + method

**Statement / Relevé**:
- Detailed ledger:
  - Date, Booking ID, Voyage, Participant count, Amount HT, Commission %, Commission net, Tax, Payout status
- Filters: Date range, voyage, status
- Export PDF/CSV
- Archive old statements

**Commission Model** (MVP):
```
Commission Rate: Per seller policy (default, e.g., 8-15%)
Calculation:
  - Gross = Booking total price HT
  - Commission = Gross × Rate%
  - Tax (if applicable) = Commission × 20%
  - Net to Pro = Commission - Tax

Payout Rules:
  - Minimum 24h hold (anti-chargeback)
  - Minimum 500€ threshold (or monthly payout if > threshold)
  - Manual request allowed (instant payout possible, no minimum)
  - Bank hold 2-3 days (clearing time)
```

**Payout Details**:
- IBAN entry (encrypted storage)
- Payout frequency (monthly / on-request)
- Minimum threshold override
- Payout history + status
- Payment method (SEPA transfer)

**Invoicing**:
- Generate invoice (PDF) for each payout
- Invoice number: EV-2026-00001 (format)
- Invoice details: Date, period, bookings, commission breakdown, taxes, net amount
- Archive invoices (searchable)

---

### 6. **MARKETING & PUBLIC PAGE**

#### PRO_PAGE (Public Profile)
**Pages**: /p/[proSlug], /pro/marketing, /pro/marketing/campaigns, /pro/marketing/shortlinks, /pro/marketing/qr-print

**Public Page** (/p/[proSlug]):
- Pro photo + bio
- Featured voyages (up to 3, selected by creator)
- "À partir de" pricing (lowest available voyage)
- Call-to-action: Réserver | Contactez-moi
- Social share buttons
- Video slot (optional YouTube embed, 2-click RGPD)
- Contact info: Email only (no phone publicly)

**Shortlinks & QR System**:
- Shortlink format: `e.ty/ab-c12` (base62, 6 chars)
- QR codes (SVG/PNG, cached 24h)
- Destination types:
  - PRO_PAGE (default, to /p/[slug])
  - VOYAGE (specific trip, to /voyages/[id])

**Campaign Management**:
- Create campaigns (optional, 1 active max)
- Campaign fields: Name, channel (SALON, BOUTIQUE, PARTENARIAT), goal (optional), active dates
- Campaign QR: Separate shortlink with campaignId
- Disable/archive campaigns

**Marketing Features**:
- Lead capture (email optional on impact assessment, no PII in MVP)
- Lead notification (in-app only, email future)
- Analytics: Scans, clicks, conversions
- Export reports (CSV)

**Print/A4 Template System**:
- 3 fixed templates (A4 variants)
- Editable fields: Headline, subheadline, slogan, CTA text
- Auto-injected footer: Legal text + QR code
- Assets: Logo + background from Document Center
- One QR per template (via shortlink)
- No media library (docs only, docId reference)

---

### 7. **COMMUNICATION & INBOX**

#### PRO_MESSAGE / INBOX
**Pages**: /pro/messages, /pro/messages/[threadId], /pro/inbox

**Inbox Structure**:
- Unread count badge
- Conversation list (threads):
  - Avatar (group/traveler/team)
  - Name + preview
  - Last message + timestamp
  - Unread indicator
  - Pinned threads

**Thread Types**:
1. **Client Thread** (Traveler → Pro)
   - Single traveler + pro 1:1
   - Message history
   - Status: OPEN / ANSWERED / RESOLVED
   - Pro can reply (reply_enabled flag)

2. **Group Thread** (Group leader → Pro)
   - Group code visible
   - All members see replies (except pro sees only leader name)
   - Message history
   - Status + hold timer context

3. **Team Thread** (Staff → Pro)
   - Internal (staff-only)
   - Voyage context
   - Status updates

**Message Features**:
- Text + optional attachment (file/image)
- Notifications (email + in-app)
- Read receipts
- Auto-reply templates (future)
- Merge threads (admin only)

**Notification Templates** (10 new for groups):
```
GROUP_CREATED → "Groupe créé [code]"
GROUP_HOLD_STARTED → "Hold 24h lancé"
GROUP_CONFIRMED → "Groupe confirmé, X chambres"
GROUP_PARTIAL → "Confirmation partielle"
GROUP_EXPIRED → "Groupe expiré sans paiement"
GROUP_MEMBER_JOINED → "[Nom] a rejoint"
GROUP_MESSAGE → "Nouveau message du groupe"
PRO_MESSAGE → "Pro répond au groupe"
PRE_RESERVATION_ACTIVE → "Acompte payé"
PRE_RESERVATION_RESULT → "Fin du hold, résultat"
```

---

### 8. **DOCUMENTS & COMPLIANCE**

#### PRO_DOCUMENTS / COMPLIANCE
**Pages**: /pro/documents, /pro/documents/[type], /pro/parametres/documents

**Document Types** (7 total):
1. **Pièce identité**: Status (PENDING, VALIDATED, REJECTED), Expiry warning (J-90)
2. **Assurance RC Pro**: Auto-check (API call), expiry alert
3. **SIRET/Extrait Kbis**: Verified via Admin
4. **RNA (Association)**: Verified via Admin
5. **RIB/IBAN**: Encrypted, used for payouts
6. **Signature CGV**: e-signature (SummarSign or similar)
7. **Non-salariat/Indépendant proof**: Freelance status (optional in MVP)

**Document Workflow**:
```
PENDING (upload) 
  → UNDER_REVIEW (admin review 24-48h)
  → VALIDATED (approved) or REJECTED (reason given)
  → EXPIRY_WARNING (J-90 before end)
  → EXPIRED (manual re-upload needed)
```

**Alerts**:
- Missing blocking docs (prevent publishing)
- Expiring docs (24h, 7d, 30d before expiry)
- Auto-reminders (J-21, J-14, J-7, J-3 before expiry)
- Red banner if critical docs missing

---

### 9. **FORMATIONS & EDUCATION**

#### PRO_FORMATION (Training Hub)
**Pages**: /pro/formation, /pro/formation/[themeId], /pro/formation/certificates

**Training Structure**:
- Themes (organized by topic):
  - "Principes Eventy" (brand, philosophy)
  - "Mécanique voyages" (bookings, pricing, groups)
  - "Conformité & documents" (RGPD, insurance, etc.)
  - "Marketing & ventes" (campaigns, QR, leads)
  - "Support & relations clients" (communication, issues)

- Videos (embedded YouTube):
  - Title, duration, transcript
  - Not mandatory in MVP (recommended)
  - Future: Quiz + badges + obligations

- Progress tracking:
  - Videos watched count
  - Completion % per theme
  - Total score (future)

- Certificates (future feature, MVP = none)

---

### 10. **ANNUAIRE & NETWORKING**

#### PRO_ANNUAIRE (Directory)
**Pages**: /pro/annuaire/independants, /pro/annuaire/vendeurs, /p/[proSlug]

**Directory Features**:
- Filter by:
  - Status (APPROVED, PENDING, LIMITED, REJECTED)
  - Type (CREATOR, INDE, VENDEUR)
  - Region / destinations
  - Rating (future)

- Actions:
  - Recommander (pro recommends colleague, request to admin)
  - Inviter (invite to voyage, if pro is creator)
  - Suivre (public: opt-in email follow)

- Badges:
  - APPROVED (green)
  - PENDING (yellow - validation in progress)
  - LIMITED (orange - incomplete)
  - REJECTED (red - rejected)

**Public Profiles** (/p/[proSlug]):
- Only APPROVED status visible
- Featured voyages (creator choice)
- "À partir de" pricing
- Contact button (message or call pro)
- Video + bio
- Social share

---

### 11. **GESTION MAGASIN / STORE MANAGEMENT**

#### PRO_MAGASIN / SELLER
**Pages**: /pro/magasin, /pro/magasin/[storeId], /pro/revenus/commissions

**Store Setup**:
- Store name + address (street, city, zip, country)
- Opening hours (text field)
- Category (optional: souvenir, activity, restaurant)
- Contact email (optional)
- Active toggle

**Commission Tracking**:
- Sales via store QR (attribution)
- Sales via seller shortlink (attribution)
- Monthly breakdown
- Commission %, rate, net amount
- Payout status + history

**Marketing**:
- Store QR code (generate + download)
- Shortlinks to trips (trackable)
- Campaign QR (if campaign active)
- Analytics (scans, clicks, conversions)
- Print orders (A4 posters with store QR)

---

### 12. **PARAMÈTRES / SETTINGS**

#### PRO_PROFILE & SETTINGS
**Pages**: /pro/parametres, /pro/parametres/profil, /pro/parametres/paiement, /pro/parametres/notifications

**Profile Settings**:
- Photo (upload, auto-crop)
- Full name (display)
- Bio (description, <500 chars)
- Phone (optional, private)
- Email (verified, display on public page = false by default)
- Region(s) preference (multi-select)

**Payment Settings**:
- IBAN entry (required for payout)
- Payout frequency (monthly / on-request)
- Minimum threshold (can override)
- Payout history (view only)

**Privacy & Consent**:
- Marketing emails opt-in/out
- SMS opt-in/out (future)
- Data sharing consent (lead capture, analytics)
- Data download (GDPR DSAR)

**Notification Preferences**:
- Email digest frequency
- In-app notifications (bulk setting)
- Channel preferences (email, in-app, SMS)

---

## CORE PRO FEATURES BY PAGE

### Feature Matrix by User Type

| Feature | Creator | Inde | Seller/Magasin |
|---------|---------|------|----------------|
| Create Voyage | ✓ | ✗ | ✗ |
| Manage Voyage | ✓ | Limited (edit rooming) | ✗ |
| View Reservations | ✓ | Limited (only assigned) | ✗ |
| View Revenue | ✓ | ✓ (share-based) | ✓ (commission) |
| Upload Documents | ✓ | ✓ | Limited |
| Marketing (shortlinks, QR) | ✓ | ✓ | ✓ |
| Access Formation | ✓ | ✓ | ✓ |
| Directory Access | ✓ | ✓ | ✓ |
| Store Management | ✗ | ✗ | ✓ |
| Inbox/Messages | ✓ | ✓ | ✓ |

---

## PERMISSIONS & RBAC

### Permission Model (NestJS Guards)

**Core Guards**:
1. `AuthGuard` → 401 (not authenticated)
2. `EmailVerifiedGuard` → 403 code=EMAIL_NOT_VERIFIED
3. `ProValidationGuard` → 403 code=PRO_NOT_VALIDATED
4. `ProOnboardingCompleteGuard` → 403 code=PRO_ONBOARDING_INCOMPLETE
5. `RBACGuard` → 403 (insufficient role/permission)

### Permission Scopes

**Pro Permissions** (minimum MVP):
```
CLIENT: CLIENT_READ, BOOKING_CREATE (if canReserve=true)

PRO (all):
  - PRO_READ (view own data)
  - PRO_PROFILE_WRITE (edit profile, shortlinks, QR)
  - PRO_INBOX_READ (read messages)
  - PRO_INBOX_REPLY (reply to messages)

CREATOR (specific):
  - CREATOR_TRIP_WRITE (create/edit voyages)
  - CREATOR_TEAM_INVITE (invite indes)
  - CREATOR_REVENUE_READ (view commission breakdown)

INDE (specific):
  - INDE_AVAIL_WRITE (manage availability)
  - INDE_ASSIGN_ACCEPT (accept/decline assignments)
  - INDE_ROOMING_EDIT (limited rooming edit)

SELLER/MAGASIN (specific):
  - SELLER_SALES_CREATE (not used MVP)
  - SELLER_QR_VIEW (view store QR)
  - SELLER_REVENUE_READ (view sales stats)

STAFF SUPPORT: SUPPORT_READ, SUPPORT_WRITE, SUPPORT_MANUAL_BLOCK
STAFF VOYAGE: VOYAGE_ADMIN_READ, VOYAGE_MANUAL_BLOCK
STAFF TRANSPORT: TRANSPORT_HOLD_SET, TRANSPORT_HOLD_CLEAR
STAFF FINANCE: FINANCE_LOCK_SET, FINANCE_LOCK_CLEAR
ADMIN ROOT: ADMIN_ALL (audit required)
SUPERADMIN: SUPER_ADMIN_ALL, LOCK_ANY, OVERRIDE_ELIGIBILITY, ADMIN_RBAC_MANAGE
```

### Status-Based Access Control

**PRO_NOT_VALIDATED**:
- Pro account exists but not approved by Eventy
- Cannot create/publish voyages
- Cannot request payout
- Cannot send marketing materials

**PRO_ONBOARDING_INCOMPLETE**:
- Missing critical docs (blocking list)
- Cannot publish voyages
- Can draft, can message, can manage profile
- Banner shows next best action

**PRO_REJECTED**:
- Application rejected (fraud, compliance issue, etc.)
- Appeal process available
- Can view archived data (read-only)

---

## API ENDPOINTS & DATA MODELS

### Authentication & Session

```
POST /api/auth/register
  Body: email, password, firstName, lastName, entityType (CREATOR|INDE|SELLER|ASSOCIATION)
  Response: userId, accessToken, refreshToken

POST /api/auth/login
  Body: email, password
  Response: accessToken, refreshToken, user {id, email, proStatus, roles}

POST /api/auth/refresh
  Body: refreshToken
  Response: accessToken (new, rotated)

POST /api/auth/logout
  Response: 200 (token invalidated)
```

### Pro Profile & Onboarding

```
GET /api/pro/profile
  Returns: ProProfile {
    id, userId, slug, entityType, status,
    firstName, lastName, photo, bio, phone,
    regions, rating (future),
    createdAt, updatedAt, proValidatedAt
  }

PATCH /api/pro/profile
  Body: { firstName, lastName, photo, bio, phone, regions[] }
  Response: updated ProProfile

GET /api/pro/onboarding-status
  Returns: {
    needsProfile, needsCompany, needsDocs, needsDocsDetail[],
    needsIban, needsValidation, needsLegal,
    insuranceStatus, complianceScore, blockingActions, nextBestAction
  }

POST /api/pro/submit-for-validation
  Body: { }
  Response: { status: UNDER_REVIEW }
```

### Voyage Management

```
GET /api/pro/voyages?tab=active&page=1&limit=20
  Response: [Voyage{ id, title, dates, capacity, participants, status }]

POST /api/pro/voyages
  Body: Voyage { title, dates, destination, description, ... }
  Response: created Voyage { id, status: DRAFT }

GET /api/pro/voyages/:id
  Response: full Voyage detail

PATCH /api/pro/voyages/:id
  Body: partial Voyage update
  Response: updated Voyage

POST /api/pro/voyages/:id/submit
  Body: {}
  Response: { status: SUBMITTED }

POST /api/pro/voyages/:id/publish (admin approval required)
  Body: {}
  Response: { status: PUBLIC, publishedAt }

POST /api/pro/voyages/:id/archive
  Body: {}
  Response: { status: ARCHIVED }
```

### Documents

```
POST /api/pro/documents/:type/upload
  Body: FormData { file }
  Response: { documentId, status: PENDING, expiresAt (if applicable) }

GET /api/pro/documents
  Response: [Document{ type, status, uploadedAt, expiresAt, validatedAt }]

GET /api/pro/documents/:id/status
  Response: { status, rejectionReason?, expiryDate? }
```

### Revenue & Payouts

```
GET /api/pro/revenue/summary
  Response: {
    ytdTotal, monthlyBreakdown[], lastPayout,
    pendingAmount, minimumThreshold, nextPayoutEta
  }

GET /api/pro/revenue/statement?from=&to=&voyageId=
  Response: [RevenueEntry{ date, bookingId, voyageId, amount, commission%, net, tax, status }]

GET /api/pro/revenue/invoices/:invoiceId
  Response: Invoice { number, date, period, total, items[], PDF url }

PATCH /api/pro/settings/payment
  Body: { iban, payoutFrequency, minimumThreshold }
  Response: updated settings (IBAN partially masked)

POST /api/pro/revenue/request-payout
  Body: { amount (optional) }
  Response: { payoutId, status: PENDING, eta }
```

### Marketing

```
POST /api/pro/marketing/shortlinks
  Body: { label, destinationType (PRO_PAGE|VOYAGE), destinationRef, campaignId? }
  Response: { code, url: e.ty/abc123, qrCodeUrl }

GET /api/pro/marketing/shortlinks?campaignId=&status=ACTIVE
  Response: [Shortlink{ code, label, destination, status, scans, createdAt }]

GET /api/pro/marketing/shortlinks/:id/qr?format=png&size=256
  Response: PNG image (cached 24h)

GET /api/pro/marketing/shortlinks/:id/stats?from=&to=
  Response: { scans, clicks, conversions (future), revenue (future) }

POST /api/pro/marketing/campaigns
  Body: { name, channel, goal?, activeFrom?, activeTo? }
  Response: created Campaign { id, status: ACTIVE/DRAFT }

GET /api/pro/marketing/campaigns
  Response: [Campaign{ id, name, channel, status, scans, leads }]

PATCH /api/pro/marketing/campaigns/:id
  Body: { name, channel, status, activeFrom?, activeTo? }
  Response: updated Campaign

POST /api/pro/marketing/leads/capture
  Body: { name, email?, phone?, sourceShortlinkId, message? }
  Response: { leadId, confirmation: "Email sent" }

GET /api/pro/marketing/leads?campaignId=
  Response: [Lead{ name, email, phone, source, createdAt, contactedAt? }]
```

### Messages & Inbox

```
GET /api/pro/inbox?unreadOnly=false&limit=20
  Response: [Thread{ id, subject, lastMessage, unreadCount, avatar, pinned }]

GET /api/pro/inbox/:threadId
  Response: Thread {
    id, participantId, participantName, type (CLIENT|GROUP|TEAM),
    messages[{ id, author, content, attachments, createdAt, readAt }],
    status, replyEnabled
  }

POST /api/pro/inbox/:threadId/reply
  Body: { content, attachmentUrl? }
  Response: Message { id, createdAt }

PATCH /api/pro/inbox/:threadId
  Body: { status: RESOLVED, pinned: true }
  Response: updated Thread

GET /api/pro/inbox/:threadId/messages?limit=50
  Response: paginated messages
```

### Formations

```
GET /api/pro/formation/themes
  Response: [Theme{ id, name, description, videoCount }]

GET /api/pro/formation/themes/:themeId/videos
  Response: [Video{ id, title, youtubeId, duration, watched }]

POST /api/pro/formation/videos/:videoId/mark-watched
  Body: {}
  Response: { completed: true, themeProgress: 3/5 }

GET /api/pro/formation/progress
  Response: { themeProgress[], totalComplete%, badges (future) }
```

### Annuaire

```
GET /api/pro/annuaire/independants?region=&status=APPROVED
  Response: [ProProfile{ id, name, photo, bio, rating, status, featured[] }]

GET /api/pro/annuaire/independants/:id
  Response: full ProProfile + contact options

POST /api/pro/annuaire/independants/:id/recommender
  Body: { reason: string }
  Response: { requestId, status: PENDING }

POST /api/pro/annuaire/independants/:id/inviter
  Body: { voyageId }
  Response: { invitationId, sentAt }
```

---

## KEY TECHNICAL SPECIFICATIONS

### Database Models (Prisma)

#### Pro & User Models
```prisma
model ProProfile {
  id                String   @id @default(cuid())
  user              User     @relation(fields: [userId], references: [id])
  userId            String   @unique
  slug              String   @unique
  entityType        EntityType // CREATOR, INDE, SELLER, ASSOCIATION
  status            ProValidationStatus // PENDING, APPROVED, REJECTED, LIMITED
  firstName         String
  lastName          String
  photo             String?  // S3 URL
  bio               String?
  phone             String?
  regions           String[] // ["Île-de-France", "Provence"]
  rating            Float?   @default(0)
  reviewCount       Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  validatedAt       DateTime?
  
  trips             Travel[]
  documents         ProDocument[]
  shortlinks        MarketingShortlink[]
  campaigns         MarketingCampaign[]
  
  @@index([status])
  @@index([createdAt])
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  password          String   // Argon2id hashed
  emailVerified     DateTime?
  proProfile        ProProfile?
  roles             RoleAssignment[]
  serviceAssignments ServiceAssignment[]
  createdAt         DateTime @default(now())
  
  @@index([email])
}

enum EntityType {
  CREATOR           // Créateur indépendant voyage
  INDE              // Accompagnateur
  SELLER            // Vendeur/Magasin
  ASSOCIATION       // Association (RNA)
}

enum ProValidationStatus {
  PENDING
  APPROVED
  REJECTED
  LIMITED            // Incomplete docs, can still operate
  ONBOARDING_INCOMPLETE
}
```

#### Document Models
```prisma
model ProDocument {
  id                String   @id @default(cuid())
  proProfile        ProProfile @relation(fields: [proProfileId], references: [id])
  proProfileId      String
  type              ProDocType
  status            DocStatus // PENDING, VALIDATED, REJECTED, EXPIRED
  fileUrl           String   // S3 URL
  uploadedAt        DateTime @default(now())
  validatedAt       DateTime?
  expiresAt         DateTime?
  rejectionReason   String?
  aiValidated       Boolean  @default(false)
  manualValidation  Boolean  @default(false)
  validatedBy       String?  // staffUserId
  
  @@index([proProfileId, type])
  @@index([status])
  @@index([expiresAt])
}

enum ProDocType {
  PIECE_IDENTITE
  ASSURANCE_RC_PRO
  SIRET_KBIS
  RNA
  RIB_IBAN
  SIGNATURE_CGV
  NON_SALARIAT
}

enum DocStatus {
  PENDING
  UNDER_REVIEW
  VALIDATED
  REJECTED
  EXPIRED
  EXPIRY_WARNING    // Within 90 days of expiry
}
```

#### Marketing Models
```prisma
model MarketingShortlink {
  id                String   @id @default(cuid())
  code              String   @unique // e.g., "abc123"
  beneficiaryType   BeneficiaryType // PRO, VOYAGE, EVENTY
  beneficiaryId     String?
  destinationType   DestinationType // PRO_PAGE, VOYAGE_PAGE, VOYAGE_LIST
  destinationRef    String   // slug or ID
  status            ShortlinkStatus // ACTIVE, DISABLED, ARCHIVED
  campaign          MarketingCampaign? @relation(fields: [campaignId], references: [id])
  campaignId        String?
  createdBy         String   // userId
  createdAt         DateTime @default(now())
  disabledAt        DateTime?
  
  events            MarketingEvent[]
  
  @@index([code])
  @@index([beneficiaryType, beneficiaryId])
  @@index([status])
}

model MarketingCampaign {
  id                String   @id @default(cuid())
  name              String
  ownerType         OwnerType // PRO, EVENTY
  ownerId           String?
  channel           String   // SALON, BOUTIQUE, PARTENARIAT, DIRECT
  goal              String?
  status            CampaignStatus // DRAFT, ACTIVE, PAUSED, ARCHIVED
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  shortlinks        MarketingShortlink[]
  leads             LeadCapture[]
  
  @@index([ownerId, status])
}

model MarketingEvent {
  id                String   @id @default(cuid())
  type              EventType // SCAN, CLICK, SHARE, LEAD, CONVERSION
  shortlink         MarketingShortlink @relation(fields: [shortlinkId], references: [id])
  shortlinkId       String
  campaign          MarketingCampaign? @relation(fields: [campaignId], references: [id])
  campaignId        String?
  createdAt         DateTime @default(now())
  userAgent         String?
  referer           String?
  sessionId         String?
  
  @@index([shortlinkId, createdAt])
  @@index([campaignId])
}

model LeadCapture {
  id                String   @id @default(cuid())
  name              String
  email             String?
  phone             String?
  message           String?
  source            String   // shortlinkId
  campaign          MarketingCampaign @relation(fields: [campaignId], references: [id])
  campaignId        String
  consentAt         DateTime @default(now())
  createdAt         DateTime @default(now())
  
  @@index([campaignId, createdAt])
  @@index([email])
}

enum ShortlinkStatus {
  ACTIVE
  DISABLED
  ARCHIVED
}

enum DestinationType {
  PRO_PAGE
  VOYAGE_PAGE
  VOYAGE_LIST
}
```

### Feature Flags & Settings

```prisma
model FeatureFlag {
  id                String   @id @default(cuid())
  key               String   @unique // e.g., "ENABLE_SHORTLINKS"
  isActive          Boolean  @default(false)
  scope             Scope    // GLOBAL, PRO_ONLY, ADMIN_ONLY
  rolloutPercentage Int      @default(100)
  updatedAt         DateTime @updatedAt
}

// MVP Feature Flags:
ENABLE_PRO_PAGE = true
ENABLE_SHORTLINKS = true
ENABLE_QR_PROFILE = true
ENABLE_QR_CAMPAIGN = true
ENABLE_QR_VOYAGE = true
ENABLE_LEAD_CAPTURE = true
ENABLE_PRINT_ORDERS = true
ENABLE_VIDEO_SLOT_MARKETING = true
ENABLE_FORMATION = true
ENABLE_ANNUAIRE = true
ENABLE_STORE_MANAGEMENT = true
ENABLE_MAGASIN_MODE = true  // For sellers
```

### Response & Error Handling

```json
// Success Response (200/201)
{
  "data": { /* entity */ },
  "meta": {
    "timestamp": "2026-03-19T10:30:00Z",
    "version": "v1"
  }
}

// Error Response (4xx/5xx)
{
  "code": "PRO_NOT_VALIDATED",
  "message": "Your account is not validated yet. Please complete onboarding.",
  "actions": [
    { "label": "Complete Onboarding", "href": "/pro/onboarding" }
  ],
  "timestamp": "2026-03-19T10:30:00Z"
}

// Error Codes (MVP):
PRO_NOT_VALIDATED
PRO_REJECTED
PRO_ONBOARDING_INCOMPLETE
DOCS_MISSING
IBAN_MISSING
EMAIL_NOT_VERIFIED
ADMIN_ROLE_REQUIRED
```

### Security & Rate Limiting

**JWT Configuration**:
- Algorithm: ES256 (ECDSA)
- Access token TTL: 15 minutes
- Refresh token TTL: 30 days (rotated)
- Tokens in HttpOnly cookies + Authorization header
- CSRF protection: Double-submit cookie pattern

**Rate Limits** (per IP/user):
- Login: 5 attempts / 15 minutes
- API calls: 100/minute (pro), 1000/minute (admin)
- File upload: 10 MB max, 5 files/minute
- Email: 5/hour per recipient

**Audit Logging**:
- All state-changing operations logged
- Fields: userId, action, entityType, entityId, beforeJson, afterJson, ip, userAgent, timestamp
- Retention: 2 years
- No PII in logs (tokens, passwords masked)

---

## APPENDIX: PAGE COUNT & ARCHITECTURE

### PRO Portal Page Inventory

**Total Pages: 47**

1. **Onboarding & Auth** (5 pages)
   - Login / Register
   - Onboarding (profile, company, documents, legal)
   - Status check / progress

2. **Dashboard** (2 pages)
   - Home (hub)
   - Quick stats

3. **Voyage Management** (6 pages)
   - Voyages list
   - Voyage detail
   - Create voyage (multi-step)
   - Edit voyage
   - Archival

4. **Reservations** (5 pages)
   - Reservations list
   - Reservation detail
   - Groups list
   - Group detail
   - Member communication

5. **Finance** (5 pages)
   - Revenue summary
   - Statement / Relevé
   - Invoices
   - Payout settings
   - Payout history

6. **Marketing** (6 pages)
   - Public profile (external)
   - Shortlinks list
   - Campaigns list
   - Campaign detail
   - QR generator
   - Print order management

7. **Communication** (4 pages)
   - Inbox / Messages
   - Thread detail
   - Support tickets (future)
   - Notifications settings

8. **Documents** (3 pages)
   - Documents list
   - Document detail
   - Compliance status

9. **Formation** (3 pages)
   - Themes list
   - Theme detail + videos
   - Progress + certificates

10. **Annuaire** (2 pages)
    - Directory listing
    - Profile detail

11. **Magasin / Store** (2 pages)
    - Store detail
    - Sales analytics

12. **Settings** (5 pages)
    - Profile settings
    - Payment settings
    - Privacy & consent
    - Notifications preferences
    - Account & Security

---

## DOCUMENT METADATA

**File**: eventy_v53_COMPLET_PRET_CODAGE.drawio
**Size**: 11 MB (XML)
**Extracted**: 2026-03-19
**Total Cells**: ~15,000
**PRO References**: 156+
**Pages Detailed**: 47
**Database Models**: 25+
**API Endpoints**: 45+
**Feature Flags**: 12+

**Key Versions Referenced**:
- V200 (Pack Sérénité / Accueil adapté)
- V252 (Notification templates)
- V288 (Email outbox)
- V300 (RBAC granulaire)
- V302 (Admin dashboard)
- V304 (Audit obligatoire)
- V313 (Groupe notifications)
- V315 (Documents validation)
- V429 (Formation Pro)
- V515 (Compliance score)
- V535/V537 (Mon voyage)

**DEV Tasks Covered**:
- DEV_009: Pro Onboarding
- DEV_010: Auth Flow
- DEV_011: Prisma Enums
- DEV_012: Error Codes
- DEV_013: Cron Jobs
- DEV_014: Seed Data
- DEV_015: Stripe Webhooks
- DEV_016: Finance Formulas
- DEV_017: API Endpoints
- DEV_018: Go-Live Checklist
- DEV_019: Admin Dashboard
- DEV_020: Mobile-First Specs
- DEV_021: Testing Strategy

---

**End of Document**
