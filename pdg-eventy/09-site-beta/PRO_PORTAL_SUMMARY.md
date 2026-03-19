# PRO PORTAL — QUICK REFERENCE SUMMARY
**Date**: 2026-03-19 | **Source**: eventy_v53_COMPLET_PRET_CODAGE.drawio

---

## 🎯 PRO PORTAL OVERVIEW

**Total Pages**: 47 | **User Types**: 3 (CREATOR, INDE, SELLER) | **Routes**: /pro/*

---

## 📋 PAGE CATEGORIES (12 Groups)

| Category | Pages | Key Routes |
|----------|-------|-----------|
| **1. Onboarding** | 5 | /pro/inscription, /pro/onboarding/*, /pro/profil |
| **2. Dashboard** | 2 | /pro/ (home), dashboard |
| **3. Voyages** | 6 | /pro/voyages, /pro/voyages/[id], /pro/voyages/create |
| **4. Réservations** | 5 | /pro/reservations, /pro/reservations/[id], /pro/groupes |
| **5. Finances** | 5 | /pro/revenus, /pro/documents/factures, /pro/parametres/paiement |
| **6. Marketing** | 6 | /pro/marketing, /pro/marketing/campaigns, /pro/marketing/shortlinks, /p/[proSlug] |
| **7. Communication** | 4 | /pro/messages, /pro/inbox, /pro/messages/[threadId] |
| **8. Documents** | 3 | /pro/documents, /pro/documents/[type], /pro/parametres/documents |
| **9. Formation** | 3 | /pro/formation, /pro/formation/[themeId] |
| **10. Annuaire** | 2 | /pro/annuaire/independants, /p/[proSlug] |
| **11. Magasin** | 2 | /pro/magasin, /pro/magasin/[storeId] |
| **12. Paramètres** | 5 | /pro/parametres/profil, /paiement, /documents, /notifications |

---

## 🔑 CORE FEATURES BY USER TYPE

### CREATOR (Créateur indépendant)
✓ Create/edit voyages
✓ View all reservations & groups
✓ View revenue (commission breakdown)
✓ Invite indes
✓ Upload documents (CI, insurance, SIRET, RIB)
✓ Marketing (shortlinks, QR, campaigns)
✓ Access formation & annuaire

### INDE (Accompagnateur)
✓ Limited voyage access (assigned only)
✓ Edit rooming/availability
✓ View shared revenue
✓ Upload documents (simplified)
✓ Marketing (personal QR)
✓ Communication (inbox, formation)

### SELLER/MAGASIN (Partenaire ventes)
✓ Store management (address, hours)
✓ Commission tracking (QR attribution)
✓ Shortlinks to trips
✓ Analytics (scans, clicks, revenue)
✓ No document requirements (minimal)

---

## 🛡️ ONBOARDING STATE MACHINE (DEV_009)

```
PENDING → PROFILE_INCOMPLETE → DOCUMENTS_PENDING → VALIDATION_IN_PROGRESS
    ↓
APPROVED → ONBOARDING_COMPLETE → ACTIVE
    ↓ (rejection)
REJECTED
```

**5 Onboarding Types**:
1. CREATOR — Full profile, company (SIRET), docs (CI, insurance, RIB), legal
2. INDE — Simplified profile, availability, 5 pickup points min
3. SELLER — Store setup, no docs required
4. ASSOCIATION_CREATOR — RNA, simplified company, revenue split
5. STAFF_TEAM_MEMBER — Role assignment, service-based access

---

## 💰 FINANCE MODULE

**Commission Model**:
- Rate: Per seller policy (default 8-15%)
- Gross booking price HT × Rate% = Commission
- Payout: 24h hold minimum, 500€ threshold (or monthly)
- Invoice format: EV-2026-00001

**Payout Features**:
- IBAN encrypted storage
- Monthly or on-request frequency
- Threshold override allowed
- Statement export (PDF/CSV)
- Ledger detail (date, booking, amount, commission, tax, status)

---

## 📢 MARKETING SYSTEM

### Public Profile (/p/[proSlug])
- Creator photo + bio
- Featured voyages (up to 3)
- "À partir de" pricing
- Social share buttons
- Optional video slot (YouTube unlisted)
- Contact CTA (email only)

### Shortlinks & QR
- Format: `e.ty/ab-c12` (base62, 6 chars, unique)
- Destinations: PRO_PAGE (profile), VOYAGE (specific trip)
- Tracking: Scans, clicks, conversions (future)
- QR codes: SVG/PNG, cached 24h

### Campaigns
- 1 active per pro (MVP limit)
- Fields: Name, channel (SALON/BOUTIQUE/PARTENARIAT), goal, dates
- Campaign QR = separate shortlink with campaignId
- Analytics: Scans, clicks, export

### Print Orders (A4 Templates)
- 3 fixed templates (A4 variants)
- Editable: Headline, subheadline, slogan, CTA
- Auto-injected: Footer (legal text + QR)
- Assets: Logo + background from Document Center

### Lead Capture (Optional)
- Lead form on public page (email optional, no PII)
- Notification: In-app only (email future)
- Lead retention: 90 days (configurable)
- Export: CSV list

---

## 📧 COMMUNICATION & MESSAGING

### Inbox Structure
- Conversation threads (client, group, team)
- Message history + read receipts
- Unread badges + pinned threads
- Auto-reply templates (future)

### 10 Group Notification Templates (V313)
1. GROUP_CREATED — Group [code] created
2. GROUP_HOLD_STARTED — Hold 24h active
3. GROUP_CONFIRMED — All rooms paid
4. GROUP_PARTIAL — Timer expired, some paid
5. GROUP_EXPIRED — Timer expired, 0 paid
6. GROUP_MEMBER_JOINED — [Name] joined
7. GROUP_MESSAGE — Leader wrote to pro
8. PRO_MESSAGE — Pro replied to group
9. PRE_RESERVATION_ACTIVE — Deposit paid
10. PRE_RESERVATION_RESULT — Hold end result

**Message Visibility** (Privacy):
- Pro sees: First names, room assignments, payment status
- Pro does NOT see: Email, phone, full address
- Pro sees aggregates: Total rooms, total people, hold timer

---

## 📄 DOCUMENTS & COMPLIANCE (7 Types)

| Document | Status Flow | Expiry | Blocking |
|----------|------------|--------|----------|
| Pièce identité | PENDING → VALIDATED/REJECTED | 90d warning | No |
| Assurance RC Pro | Auto-check API | Expiry alert | Yes |
| SIRET/Kbis | Manual verify | None | Yes (for CREATOR) |
| RNA | Manual verify | None | Yes (for ASSO) |
| RIB/IBAN | Encrypted storage | None | Yes (for payout) |
| Signature CGV | e-signature | None | Yes (legal) |
| Non-salariat | Optional proof | None | No |

**Status Values**: PENDING, UNDER_REVIEW, VALIDATED, REJECTED, EXPIRED, EXPIRY_WARNING (J-90)

**Auto-reminders**: J-21, J-14, J-7, J-3 before expiry

---

## 🎓 FORMATION (Training Hub)

**Themes** (5+ videos each):
- Principes Eventy (brand, philosophy)
- Mécanique voyages (bookings, pricing, groups)
- Conformité & documents (RGPD, insurance)
- Marketing & ventes (campaigns, QR, leads)
- Support & relations clients (communication, issues)

**Features**:
- Embedded YouTube videos (2-click RGPD)
- Progress tracking (% complete)
- Not mandatory in MVP (recommended)
- Future: Quiz + badges + obligations

---

## 📑 ANNUAIRE (Directory)

**Features**:
- Filter by status (APPROVED, PENDING, LIMITED, REJECTED)
- Filter by type (CREATOR, INDE, VENDEUR)
- Filter by region/destinations
- Actions: Recommender, Inviter, Suivre (opt-in email)
- Badges: APPROVED, PENDING, LIMITED, REJECTED

**Public Profiles** (/p/[proSlug]):
- Only APPROVED status visible (404 otherwise)
- Featured voyages (creator choice)
- "À partir de" pricing
- Contact CTA (message only)

---

## 🏪 MAGASIN / STORE MANAGEMENT

**Store Fields**:
- Name, address (street, city, zip, country)
- Opening hours (text)
- Category (optional: souvenir, activity, restaurant)
- Contact email (optional)
- Active toggle

**Attribution & Commission**:
- Store QR (unique to store)
- Seller shortlinks (trackable)
- Commission % per seller policy
- Monthly breakdown
- Payout history

**Marketing**:
- Store QR download
- Shortlinks to trips
- Campaign QR (if campaign active)
- Analytics (scans, clicks, conversions)
- Print orders (A4 posters with QR)

---

## ⚙️ SETTINGS & PARAMETERS

**Profile Settings**:
- Photo, name, bio
- Phone (private), email (private)
- Region(s) preference
- Rating + reviews (future)

**Payment Settings**:
- IBAN entry (required for payout)
- Payout frequency (monthly / on-request)
- Minimum threshold (override allowed)
- Payout history (read-only)

**Privacy & Consent**:
- Marketing emails opt-in/out
- Data sharing consent
- Lead capture opt-in
- GDPR DSAR request

**Notification Preferences**:
- Email digest frequency
- In-app toggle
- Channel preferences (email, in-app, SMS future)

---

## 🔐 PERMISSIONS & RBAC

### Core Guards
- `AuthGuard` → 401 (not authenticated)
- `EmailVerifiedGuard` → 403 EMAIL_NOT_VERIFIED
- `ProValidationGuard` → 403 PRO_NOT_VALIDATED
- `ProOnboardingCompleteGuard` → 403 PRO_ONBOARDING_INCOMPLETE
- `RBACGuard` → 403 (insufficient role)

### Access Codes
- `PRO_NOT_VALIDATED` — Account not approved
- `PRO_ONBOARDING_INCOMPLETE` — Missing blocking docs
- `PRO_REJECTED` — Application rejected (appeal available)

### Pro Base Permissions
```
PRO_READ (view own data)
PRO_PROFILE_WRITE (edit profile, shortlinks, QR)
PRO_INBOX_READ (read messages)
PRO_INBOX_REPLY (reply to messages)

+ Role-specific:
CREATOR_TRIP_WRITE, CREATOR_TEAM_INVITE, CREATOR_REVENUE_READ
INDE_AVAIL_WRITE, INDE_ASSIGN_ACCEPT, INDE_ROOMING_EDIT
SELLER_SALES_CREATE, SELLER_QR_VIEW, SELLER_REVENUE_READ
```

---

## 🔗 KEY API ENDPOINTS (45+)

### Auth & Profile
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET /api/pro/profile
PATCH /api/pro/profile
GET /api/pro/onboarding-status
POST /api/pro/submit-for-validation
```

### Voyages
```
GET /api/pro/voyages?tab=active&page=1
POST /api/pro/voyages
GET /api/pro/voyages/:id
PATCH /api/pro/voyages/:id
POST /api/pro/voyages/:id/submit
POST /api/pro/voyages/:id/publish
```

### Finance
```
GET /api/pro/revenue/summary
GET /api/pro/revenue/statement?from=&to=
GET /api/pro/revenue/invoices/:id
PATCH /api/pro/settings/payment
POST /api/pro/revenue/request-payout
```

### Marketing
```
POST /api/pro/marketing/shortlinks
GET /api/pro/marketing/shortlinks
GET /api/pro/marketing/shortlinks/:id/qr
GET /api/pro/marketing/shortlinks/:id/stats
POST /api/pro/marketing/campaigns
GET /api/pro/marketing/campaigns
POST /api/pro/marketing/leads/capture
```

### Inbox
```
GET /api/pro/inbox
GET /api/pro/inbox/:threadId
POST /api/pro/inbox/:threadId/reply
PATCH /api/pro/inbox/:threadId
```

---

## 📊 DATABASE MODELS (25+)

**Core Tables**:
- ProProfile (with entityType, status, slug, regions)
- User (auth, email, roles)
- ProDocument (7 types, status flow, expiry)
- Travel/Voyage (creator, pricing, status)
- Booking (reservation, group, pricing)
- TravelGroup (members, hold status)
- MarketingShortlink (code, destination, status, stats)
- MarketingCampaign (name, channel, status)
- MarketingEvent (scans, clicks, attribution)
- LeadCapture (name, email, source, consent)
- MessageThread (participants, messages, status)
- NotificationEvent (type, channels, payload)
- RoleAssignment (user, role, service)
- ServiceAssignment (user, service, level)
- AuditLog (action, entity, before/after, user, ip, timestamp)

---

## 🚀 FEATURE FLAGS (MVP)

```
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
ENABLE_MAGASIN_MODE = true
```

---

## 📈 KEY VERSIONS REFERENCED

- **V200**: Pack Sérénité, accueil adapté par pack
- **V252**: Notification templates (14+)
- **V288**: Email outbox pattern (retry 3x backoff)
- **V300**: RBAC granulaire (9 services × 3 levels)
- **V302**: Admin dashboard (KPIs, feux 4 services)
- **V304**: Audit obligatoire (state changes, overrides)
- **V313**: 10 group notification templates
- **V315**: Document validation workflow
- **V429**: Formation Pro (videos, themes)
- **V515**: Compliance score, docs detail, insurance API check
- **V535/V537**: Mon Voyage detail (booking statuses, timeline)

---

## 📍 KEY FILES & MODULES

**Frontend** (/app/(pro)/pro/):
- src/app/pro/page.tsx (dashboard)
- src/app/pro/voyages/ (voyage CRUD)
- src/app/pro/reservations/ (bookings, groups)
- src/app/pro/revenus/ (revenue, payouts)
- src/app/pro/marketing/ (shortlinks, campaigns, QR)
- src/app/pro/messages/ (inbox, threads)
- src/app/pro/documents/ (doc list, compliance)
- src/app/pro/formation/ (training videos)
- src/app/pro/annuaire/ (directory)
- src/app/pro/magasin/ (store management)
- src/app/pro/parametres/ (settings)

**Backend Modules** (NestJS):
- auth/ (JWT, refresh, guards)
- pro/ (profile, onboarding, validation)
- documents/ (upload, storage, validation)
- marketing/ (shortlinks, QR, campaigns, leads)
- messages/ (inbox, threads, notifications)
- finance/ (revenue, commissions, payouts)
- formation/ (videos, themes, progress)

---

## 🔍 EXTRACTION METADATA

| Metric | Value |
|--------|-------|
| Source File | eventy_v53_COMPLET_PRET_CODAGE.drawio |
| File Size | 11 MB (XML) |
| Total Cells | ~15,000 |
| PRO References | 156+ |
| DEV Tasks | 13 (009-021) |
| Database Models | 25+ |
| API Endpoints | 45+ |
| Feature Flags | 12+ |
| Pages Catalogued | 47 |
| User Types | 3 |
| Document Types | 7 |
| Notification Templates | 20+ |
| Onboarding Types | 5 |

---

## 🎯 NEXT STEPS FOR DEVELOPMENT

**Priority P0**:
1. Implement DEV_009 (Pro Onboarding state machine)
2. Implement DEV_010 (Auth flow with guards)
3. Set up DEV_017 (API endpoints)
4. Configure DEV_011 (Prisma enums)
5. Deploy DEV_018 (go-live checklist)

**Priority P1**:
6. Dashboard & home customization per pack
7. Voyage CRUD + submission workflow
8. Finance & payout integration (Stripe)
9. Marketing (shortlinks, QR, campaigns)
10. Communication (inbox, notifications)

**Priority P2**:
11. Documents & compliance automation
12. Formation (video hub)
13. Annuaire (directory + discovery)
14. Store management (sellers)
15. Settings & preferences

---

**Full specs**: See `PRO_PORTAL_SPECIFICATIONS.md` for detailed API endpoints, database models, and technical specifications.

