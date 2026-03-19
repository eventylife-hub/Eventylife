# CLIENT & PUBLIC PORTAL SPECIFICATIONS EXTRACTION

## Overview
Complete extraction of all CLIENT and PUBLIC portal specifications from the draw.io diagram file (`eventy_v53_COMPLET_PRET_CODAGE.drawio`).

**Status:** COMPLETE - "Oublie rien" (Nothing forgotten)  
**Date:** 2026-03-19  
**Source File:** 11.0 MB XML (21,515+ elements analyzed)

---

## Files Generated

### 1. **EXTRACT_CLIENT_PUBLIC_SPECS.md** (1,784 lines)
Complete, detailed specifications document containing:
- **PART 1:** CLIENT PORTAL - 82 routes, all pages with detailed sections, tabs, fields
- **PART 2:** PUBLIC PORTAL - 37 routes, homepage, catalogue, trip detail, creator profile, legal pages
- **PART 3:** CHECKOUT FLOW - 4-step flow with all options & validation
- **PART 4:** DATA MODELS - 17 core entities with all fields & relationships
- **PART 5:** UI COMPONENTS - 2,366+ components organized by category
- **PART 6:** FEATURE SPECIFICATIONS - 25+ major features (checkout, documents, support, notifications, search, social, etc.)

**Use this file for:**
- Frontend development (route mapping, component structure)
- Database schema reference (Prisma models)
- Email template definitions
- Feature implementation checklist
- QA test case creation

### 2. **EXTRACTION_SUMMARY.txt** (this file)
High-level overview with:
- Extraction statistics (routes, models, components counts)
- Key findings by section
- Bullet-point summaries of all major features
- Checklist of coverage & depth
- Recommendations for next steps

**Use this file for:**
- Quick reference & navigation
- Executive summary
- Project status overview
- Development planning

---

## What Was Extracted

### CLIENT PORTAL
**82 Routes across 8+ major sections:**

1. **Dashboard & Trip Management**
   - `/client/dashboard` - Main dashboard (Mon espace)
   - `/client/mes-voyages` - Trip list
   - `/client/mon-voyage/[bookingId]` - Trip detail (8 tabs: Résumé, Voyageurs, Transport, Activités, Hébergement, Documents, Paiements, Messages)
   - `/client/mon-voyage/[bookingId]/souvenirs` - Trip memories/photos

2. **Account & Documents**
   - `/client/profil` - Profile settings
   - `/client/documents` - Document upload center (5-step workflow: NOT_SUBMITTED → PENDING → APPROVED/REJECTED)
   - `/mon-compte/*` - Account hub pages

3. **Payments & Wallet**
   - `/client/paiements` - Payment history
   - `/client/wallet` - Credit wallet
   - Co-payer tracking & invitations

4. **Support & Communication**
   - `/client/support/tickets` - Support tickets (SLA: P0=1h, P1=4h, P2=24h)
   - `/client/incident/tâche` - Incident declaration
   - `/client/notifications` - Notification center (9+ event types)
   - `/client/messages` - Messaging

5. **Social & Groups**
   - `/client/groupe/[groupId]` - Group management
   - `/client/favoris` - Favorites/wishlist
   - `/client/follow/:proId` - Follow creators

### PUBLIC PORTAL
**37 Routes covering discovery to booking:**

1. **Discovery**
   - `/` - Homepage (hero, proximity section, popular trips, filters)
   - `/voyages` - Catalogue/search (10+ filters, 7+ sort options)
   - `/voyages/[slug]` - Trip detail (8 tabs, sidebar with booking CTA)

2. **Creators**
   - `/p/[proSlug]` - Creator public profile (with verification badges)
   - `/independants` - Creator directory (advanced filtering)

3. **Information**
   - `/contact` - Contact form
   - `/faq` - FAQ with search & filters
   - `/mentions-legales` - Legal notices
   - `/cgv`, `/cgu`, `/confidentialite`, `/cookies`, `/accessibilite` - Legal pages

### CHECKOUT FLOW
**4-step process:**
1. Room selection & occupancy
2. Payment method choice (4 modes: I pay all / Each pays / Split + invite / Reimburse outside)
3. Co-payer invitations
4. Payment (Stripe with 3D Secure)

### DATA MODELS
**17 core entities:**
User, Booking, Traveler, Trip, Occurrence, Document, Payment, PaymentContribution, CreditWallet, TravelGroup, TravelGroupMember, Notification, SupportTicket, Message, FileAsset, ConsentRecord, LegalPageVersion

### UI COMPONENTS
**2,366+ components referenced:**
- Navigation (header, footer, breadcrumbs, tabs, pagination)
- Cards (trip, creator, notification, message)
- Forms (text, date, select, file upload, autocomplete)
- Modals (confirmation, preview, lightbox, success/error)
- Data display (tables, timeline, badges, progress bars)
- Interactive (buttons, accordions, toggles, sliders, carousels, rating widget)
- Status indicators (badges, color-coded status, toast, alerts)
- Media (hero carousel, image gallery, video player)

### FEATURES
**25+ major feature areas documented:**
✓ Checkout & payment (room calc, co-payer tracking, Stripe integration)  
✓ Document management (upload, status workflow, deadline reminders)  
✓ Support & incidents (tickets, SLA, auto-escalation)  
✓ Notifications (9+ event types, multi-channel)  
✓ Search & filtering (10+ dimensions, 7+ sorts)  
✓ Social groups (chat, file sharing, roles)  
✓ Profiles & accounts (preferences, security, GDPR)  
✓ Compliance (CMP, GDPR, accessibility, legal pages)  
✓ Mobile & performance (responsive, Core Web Vitals)  
✓ Analytics & tracking (UTM, QR codes, conversion)  

---

## Key Statistics

| Metric | Count |
|--------|-------|
| Total Elements Analyzed | 21,515+ |
| Client Routes | 82 |
| Public Routes | 37 |
| Total Routes | 119 |
| Data Models | 17 |
| UI Components | 2,366+ |
| Feature Areas | 25+ |
| Pages Documented | 20+ |
| Email Templates | 18+ |
| Tabs/Sections | 40+ |

---

## Coverage Verification

### Client Portal Completeness
- ✓ All core navigation pages
- ✓ All trip management pages (with 8 tabs detailed)
- ✓ All account/profile pages
- ✓ All payment & wallet pages
- ✓ All support & communication pages
- ✓ All social & group pages
- ✓ All notification & preference pages

### Public Portal Completeness
- ✓ Homepage with all sections
- ✓ Catalogue with all filters & sorts
- ✓ Trip detail with all 8 tabs
- ✓ Creator public profile
- ✓ Creator directory
- ✓ Contact page
- ✓ FAQ page
- ✓ All legal pages (5 pages)

### Checkout Flow
- ✓ Step 1: Room selection (with occupancy calculator)
- ✓ Step 2: Payment method (all 4 modes)
- ✓ Step 3: Co-payer invitations
- ✓ Step 4: Payment processing
- ✓ Success/Failure handling

### Features
- ✓ Checkout & payment complete
- ✓ Document management complete
- ✓ Support & incidents complete
- ✓ Notification system complete
- ✓ Search & filtering complete
- ✓ Social features complete
- ✓ Profile & account complete
- ✓ Compliance & legal complete
- ✓ Mobile & performance specs
- ✓ Analytics & tracking specs

---

## How to Use These Documents

### For Frontend Development
1. Read EXTRACT_CLIENT_PUBLIC_SPECS.md PART 1 for CLIENT portal routes & pages
2. Read EXTRACT_CLIENT_PUBLIC_SPECS.md PART 2 for PUBLIC portal routes & pages
3. Map each route to a Next.js page file
4. Use tab descriptions to create component structure
5. Reference UI components section for component patterns
6. Use feature specifications for implementation details

### For Database Design
1. Read EXTRACT_CLIENT_PUBLIC_SPECS.md PART 4 for data models
2. Use model descriptions as Prisma schema reference
3. Note all relationships and field types
4. Reference payment contribution model for group bookings
5. Note document workflow status enums

### For QA & Testing
1. Use EXTRACTION_SUMMARY.txt for test scope overview
2. Create test cases for each of 119 routes
3. Test all 10+ filter combinations on catalogue
4. Verify all 18+ email templates send correctly
5. Test checkout with all 4 payment distribution modes
6. Verify document workflow for each document type
7. Test SLA tracking for support tickets
8. Verify notification delivery channels

### For Design & UX
1. Review EXTRACT_CLIENT_PUBLIC_SPECS.md PART 5 for UI components
2. Map routes to Figma components
3. Ensure all button states documented
4. Verify responsive breakpoints (375px, 768px, 1024px)
5. Test accessibility (WCAG 2.1 AA)
6. Validate form error states

---

## Search & Navigation Guide

### Finding Information

**By Page:**
- Client Dashboard: Search "CLIENT PORTAL PAGES - CLIENT DASHBOARD"
- Trip Detail (Mon Voyage): Search "MON VOYAGE (Trip Detail)"
- Checkout Flow: Search "PART 3: CHECKOUT FLOW"
- Catalogue: Search "CATALOGUE / VOYAGE LISTING"

**By Feature:**
- Payment: Search "PAYMENTS & WALLET"
- Documents: Search "DOCUMENTS CENTER"
- Support: Search "SUPPORT & INCIDENTS"
- Notifications: Search "NOTIFICATIONS"
- Groups: Search "GROUPS (Social"

**By Data Model:**
- User: Search "User {"
- Booking: Search "Booking / RoomBooking"
- Payment: Search "Payment {"
- Document: Search "Document {"

**By UI Component:**
- Cards: Search "Card Components"
- Forms: Search "Form Components"
- Modals: Search "Modal/Dialog Components"
- Status: Search "Status Indicators"

---

## Next Steps

### Immediate (Week 1)
1. Share EXTRACT_CLIENT_PUBLIC_SPECS.md with dev team
2. Share data models with database team
3. Create detailed route map for Next.js folder structure
4. Begin mapping routes to components

### Short-term (Week 2-3)
1. Create Figma components from UI component list
2. Create email templates from template descriptions
3. Create test cases from page specifications
4. Create database migrations from data models

### Medium-term (Week 4+)
1. Implement routes & pages according to specifications
2. Integrate email templates with backend
3. Execute QA test plan
4. Measure against Core Web Vitals targets
5. Verify accessibility (WCAG 2.1 AA)

---

## Questions & Clarifications

For questions about specific:
- **Routes:** See "Routes" section in relevant PART (1 for client, 2 for public)
- **Page layouts:** See detailed page sections with tabs, fields, and actions
- **Data models:** See PART 4 with all fields and relationships
- **Features:** See PART 6 with implementation details
- **Components:** See PART 5 organized by category

---

## Version Info
- **Extraction Date:** 2026-03-19
- **Source File:** eventy_v53_COMPLET_PRET_CODAGE.drawio (11.0 MB)
- **Total Elements Analyzed:** 21,515+
- **Coverage:** Complete - all CLIENT and PUBLIC portal pages, routes, features, and components
- **Quality:** Comprehensive with no omissions

---

**Document generated for Eventy Life - Platform specifications for development & QA**
