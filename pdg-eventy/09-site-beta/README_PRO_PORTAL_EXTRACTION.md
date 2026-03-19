# PRO PORTAL EXTRACTION — DOCUMENTATION INDEX
**Date**: 2026-03-19 | **Status**: Complete | **Source**: eventy_v53_COMPLET_PRET_CODAGE.drawio (11MB)

---

## QUICK START

This extraction provides a complete inventory of the Eventy PRO portal specifications from the draw.io design file. Two documents have been generated:

### Document 1: PRO_PORTAL_SUMMARY.md (Quick Reference)
**Use this for**: Quick lookups, overview, feature checklist, development priorities
- 12 page categories with 47 total pages
- 3 user types (CREATOR, INDE, SELLER)
- Core features by user type (feature matrix)
- API endpoints overview (45+)
- Database models (25+)
- Feature flags
- Key versions referenced
- Next steps for development

**File**: `/pdg-eventy/09-site-beta/PRO_PORTAL_SUMMARY.md` (14 KB)

### Document 2: PRO_PORTAL_SPECIFICATIONS.md (Comprehensive Reference)
**Use this for**: Detailed implementation, API contract, state machines, data models
- Executive summary
- 12 detailed page sections with all specifications
- Permissions & RBAC deep-dive
- All API endpoints with request/response formats
- Prisma database models (full schemas)
- Feature flags configuration
- Security & rate limiting rules
- Appendix with page counts & architecture

**File**: `/pdg-eventy/09-site-beta/PRO_PORTAL_SPECIFICATIONS.md` (33 KB)

---

## WHAT WAS EXTRACTED

### Pages Found: 47 Total
1. **Onboarding & Setup** (5 pages) — 5 user types, state machine
2. **Dashboard** (2 pages) — Home, stats, quick actions
3. **Voyages** (6 pages) — Create, edit, list, detail, archive
4. **Réservations** (5 pages) — Bookings, groups, members, communication
5. **Finances** (5 pages) — Revenue, statements, invoices, payouts, settings
6. **Marketing** (6 pages) — Public profile, shortlinks, QR, campaigns, print orders, leads
7. **Communication** (4 pages) — Inbox, threads, notifications, support
8. **Documents** (3 pages) — Compliance, upload, expiry management
9. **Formation** (3 pages) — Training videos, themes, progress
10. **Annuaire** (2 pages) — Directory, networking, profiles
11. **Magasin** (2 pages) — Store management, sales analytics
12. **Paramètres** (5 pages) — Profile, payment, privacy, notifications, account

### Key Identifiers Extracted
- **PRO_ONBOARDING** (5 types: CREATOR, INDE, SELLER, ASSOCIATION, STAFF)
- **PRO_PAGE** (24 references: public profile + marketing system)
- **PRO_PROFILE** (shortlinks, QR codes, attribution)
- **PRO_MESSAGE** (10 group notification templates)
- **PRO_FINANCE** (payout, commission, invoicing)
- **PRO_SUPPORT** (tickets, status changes, audit)

### DEV Tasks Documented (009-021)
- **DEV_009**: Pro Onboarding (5 types, state machine)
- **DEV_010**: Auth Flow (JWT, refresh, cookies)
- **DEV_011**: Prisma Enums
- **DEV_012**: Error Codes
- **DEV_013**: Cron Jobs
- **DEV_014**: Seed Data
- **DEV_015**: Stripe Webhooks
- **DEV_016**: Finance Formulas
- **DEV_017**: API Endpoints
- **DEV_018**: Go-Live Checklist
- **DEV_019**: Admin Dashboard
- **DEV_020**: Mobile-First Specs
- **DEV_021**: Testing Strategy

---

## ARCHITECTURE HIGHLIGHTS

### User Types (3 + 2 variants)
1. **CREATOR** — Independent trip organizer (full access)
2. **INDE** — Trip accompanist/guide (limited access)
3. **SELLER/MAGASIN** — Sales partner (store management)
4. **ASSOCIATION_CREATOR** — Association (simplified flow, RNA)
5. **STAFF_TEAM_MEMBER** — Eventy employee (role-based)

### Onboarding State Machine
```
PENDING 
  → PROFILE_INCOMPLETE 
  → DOCUMENTS_PENDING 
  → VALIDATION_IN_PROGRESS
    ↓ (Admin approval)
  APPROVED 
    → ONBOARDING_COMPLETE 
    → ACTIVE
    ↓ (Rejection)
  REJECTED
```

### Finance Model (MVP)
- **Commission Rate**: 8-15% (per seller policy)
- **Calculation**: Gross HT × Rate% = Commission
- **Payout**: 24h hold minimum, 500€ threshold (or monthly)
- **Invoice Format**: EV-2026-00001

### Marketing System
- **Shortlinks**: Format `e.ty/ab-c12` (base62, 6 chars)
- **QR Codes**: Destinations (PRO_PAGE, VOYAGE_PAGE)
- **Campaigns**: 1 active per pro (MVP)
- **Print Orders**: A4 templates, 3 variants, editable fields
- **Lead Capture**: Email optional, 90d retention

### Communication
- **10 Group Templates** (GROUP_CREATED, GROUP_HOLD_STARTED, GROUP_CONFIRMED, etc.)
- **Message Types**: Client, Group, Team threads
- **Privacy**: Pro sees first names, rooms, status (no email/phone)
- **Notifications**: Email + in-app channels

### Documents & Compliance (7 Types)
1. **Pièce identité** — Auto-check, expiry warning J-90
2. **Assurance RC Pro** — API validation, mandatory
3. **SIRET/Kbis** — Manual verify (CREATOR)
4. **RNA** — Manual verify (ASSOCIATION)
5. **RIB/IBAN** — Encrypted storage, payout required
6. **Signature CGV** — E-signature, legal mandatory
7. **Non-salariat** — Optional proof

---

## API ENDPOINTS: COMPLETE INVENTORY

### Authentication (7 endpoints)
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/pro/profile
PATCH /api/pro/profile
GET /api/pro/onboarding-status
```

### Voyages (8 endpoints)
```
GET /api/pro/voyages?tab=active
POST /api/pro/voyages
GET /api/pro/voyages/:id
PATCH /api/pro/voyages/:id
POST /api/pro/voyages/:id/submit
POST /api/pro/voyages/:id/publish
POST /api/pro/voyages/:id/archive
GET /api/pro/voyages/:id/bookings
```

### Finance (6 endpoints)
```
GET /api/pro/revenue/summary
GET /api/pro/revenue/statement?from=&to=
GET /api/pro/revenue/invoices/:id
PATCH /api/pro/settings/payment
POST /api/pro/revenue/request-payout
GET /api/pro/revenue/history
```

### Marketing (12 endpoints)
```
POST /api/pro/marketing/shortlinks
GET /api/pro/marketing/shortlinks
GET /api/pro/marketing/shortlinks/:id/qr
GET /api/pro/marketing/shortlinks/:id/stats
PATCH /api/pro/marketing/shortlinks/:id
POST /api/pro/marketing/campaigns
GET /api/pro/marketing/campaigns
PATCH /api/pro/marketing/campaigns/:id
POST /api/pro/marketing/leads/capture
GET /api/pro/marketing/leads?campaignId=
POST /api/pro/marketing/print-order
GET /api/pro/marketing/campaigns/:id/export
```

### Communication (6 endpoints)
```
GET /api/pro/inbox
GET /api/pro/inbox/:threadId
POST /api/pro/inbox/:threadId/reply
PATCH /api/pro/inbox/:threadId
GET /api/pro/messages?type=
POST /api/pro/notifications/settings
```

### Documents (5 endpoints)
```
POST /api/pro/documents/:type/upload
GET /api/pro/documents
GET /api/pro/documents/:id/status
PATCH /api/pro/documents/:id
GET /api/pro/documents/compliance-score
```

### Formation (4 endpoints)
```
GET /api/pro/formation/themes
GET /api/pro/formation/themes/:id/videos
POST /api/pro/formation/videos/:id/mark-watched
GET /api/pro/formation/progress
```

### Total: 45+ API Endpoints

---

## DATABASE MODELS (25+)

**Core Models**:
- ProProfile (entityType, status, slug, regions, rating)
- User (auth, email, emailVerified, roles)
- ProDocument (7 types, status flow, expiry, validation)
- Travel/Voyage (title, dates, pricing, team)
- Booking (reservation, group, pricing, status)
- TravelGroup (members, hold status, payment)

**Marketing Models**:
- MarketingShortlink (code, destination, campaign, status)
- MarketingCampaign (name, channel, status, analytics)
- MarketingEvent (scans, clicks, conversions, attribution)
- LeadCapture (name, email, phone, source, consent)
- MarketingTemplate (A4 variants, fields, assets)
- MarketingSettings (legal text, logo, printer config)

**Communication Models**:
- MessageThread (participants, type, status)
- ProMessage (content, attachments, read status)
- NotificationEvent (type, channels, payload, status)
- MessageTemplate (templateKey, variables, version)

**System Models**:
- RoleAssignment (user, role, service, level)
- ServiceAssignment (user, service, level)
- AuditLog (action, entity, before/after, user, ip, timestamp)
- FeatureFlag (key, isActive, scope, rolloutPercentage)
- ConsentRecord (type, granted, version, source, ip)

---

## PERMISSIONS & GUARDS

### Core Guards
```
AuthGuard (401 if not authenticated)
EmailVerifiedGuard (403 EMAIL_NOT_VERIFIED)
ProValidationGuard (403 PRO_NOT_VALIDATED)
ProOnboardingCompleteGuard (403 PRO_ONBOARDING_INCOMPLETE)
RBACGuard (403 insufficient role)
```

### Pro Base Permissions
```
PRO_READ (view own data)
PRO_PROFILE_WRITE (edit profile, shortlinks, QR)
PRO_INBOX_READ (read messages)
PRO_INBOX_REPLY (reply to messages)
```

### Role-Specific Permissions
```
CREATOR: CREATOR_TRIP_WRITE, CREATOR_TEAM_INVITE, CREATOR_REVENUE_READ
INDE: INDE_AVAIL_WRITE, INDE_ASSIGN_ACCEPT, INDE_ROOMING_EDIT
SELLER: SELLER_SALES_CREATE, SELLER_QR_VIEW, SELLER_REVENUE_READ
```

---

## FEATURE FLAGS (MVP = 12)

All are **ENABLED** in MVP:
```
ENABLE_PRO_PAGE
ENABLE_SHORTLINKS
ENABLE_QR_PROFILE
ENABLE_QR_CAMPAIGN
ENABLE_QR_VOYAGE
ENABLE_LEAD_CAPTURE
ENABLE_PRINT_ORDERS
ENABLE_VIDEO_SLOT_MARKETING
ENABLE_FORMATION
ENABLE_ANNUAIRE
ENABLE_STORE_MANAGEMENT
ENABLE_MAGASIN_MODE
```

---

## KEY VERSIONS REFERENCED

**V200-V300 Range**:
- V200: Pack Sérénité, accueil adapté par pack
- V252: Notification templates (14+)
- V288: Email outbox pattern
- V300: RBAC granulaire
- V302: Admin dashboard
- V304: Audit obligatoire

**V300-V500 Range**:
- V313: Group notifications (10 templates)
- V315: Document validation workflow
- V429: Formation Pro
- V515: Compliance score, docs detail, insurance API
- V535/V537: Mon voyage detail

---

## DEVELOPMENT PRIORITIES

### Priority P0 (Critical Path)
1. DEV_009: Onboarding state machine (CREATOR, INDE, SELLER, ASSO)
2. DEV_010: Auth flow + guards (JWT, refresh, 2FA)
3. DEV_017: API endpoints (45+)
4. DEV_011: Prisma enums (entityType, status, roles, etc.)
5. DEV_018: Go-live checklist

### Priority P1 (Core Features)
6. Dashboard + pack customization
7. Voyage CRUD + submission workflow
8. Finance + payout integration (Stripe)
9. Marketing (shortlinks, QR, campaigns)
10. Communication (inbox, notifications)

### Priority P2 (Advanced Features)
11. Documents + compliance automation
12. Formation (video hub)
13. Annuaire (directory)
14. Store management
15. Settings & preferences

---

## HOW TO USE THESE DOCUMENTS

### For Product Managers
- Start with **PRO_PORTAL_SUMMARY.md**
- Review "PRO Portal Overview" and "Core Features by User Type"
- Check "Key API Endpoints" and "Database Models" sections

### For Backend Developers
- Start with **PRO_PORTAL_SPECIFICATIONS.md**
- Review complete API endpoint contracts
- Study Prisma database models (full schemas with relations)
- Review error codes and response formats

### For Frontend Developers
- Start with **PRO_PORTAL_SUMMARY.md**
- Review page categories and navigation structure
- Study feature matrix (what each user type can do)
- Check API endpoints you'll need to call

### For QA/Testing
- Review **PRO_PORTAL_SUMMARY.md** page categories
- Check feature matrix for each user type
- Review API endpoints and error codes
- Study onboarding state machine

### For DevOps/Deployment
- Check DEV_018 (Go-Live Checklist)
- Review feature flags (12 total)
- Study database models and migrations needed
- Check API endpoints for rate limiting configuration

---

## EXTRACTION METADATA

**Source File**: eventy_v53_COMPLET_PRET_CODAGE.drawio
- Size: 11 MB (XML format)
- Total cells: ~15,000
- Parsed date: 2026-03-19

**Coverage**:
- PRO references: 156+
- Pages catalogued: 47
- User types: 3 primary + 2 variants
- Document types: 7
- API endpoints: 45+
- Database models: 25+
- Notification templates: 20+
- Onboarding types: 5
- DEV tasks: 13 (009-021)

**Files Generated**:
- PRO_PORTAL_SUMMARY.md (14 KB) — Quick reference
- PRO_PORTAL_SPECIFICATIONS.md (33 KB) — Comprehensive spec
- README_PRO_PORTAL_EXTRACTION.md (this file) — Index

---

## NEXT STEPS

1. **Review** both documents with your team
2. **Create** backend issue tickets from API endpoints (DEV_017)
3. **Set up** database schema from Prisma models
4. **Implement** onboarding state machine (DEV_009)
5. **Configure** feature flags
6. **Test** with test cases provided in specifications

---

**Questions?** Refer to the full specifications document for details on any section.
**Last Updated**: 2026-03-19 | **Maintained by**: AI Assistant for David (PDG)

