# Eventy Life Frontend - Architecture Overview

## Project Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── (admin)/                  # Admin dashboard routes
│   │   └── admin/                # 23 pages for platform management
│   ├── (auth)/                   # Authentication routes
│   │   ├── connexion/            # Login
│   │   ├── inscription/          # Registration
│   │   ├── mot-de-passe-oublie/ # Forgot password
│   │   ├── reinitialiser-*       # Password reset (token-based)
│   │   └── verification-email/   # Email verification
│   ├── (checkout)/               # Multi-step booking
│   │   └── checkout/             # step-1, step-2, step-3, confirmation
│   ├── (client)/                 # Client/user dashboard
│   │   └── client/               # 21 pages (profile, bookings, groups, etc.)
│   ├── (pro)/                    # Professional/partner dashboard
│   │   └── pro/                  # 27 pages (voyage mgmt, finance, team, etc.)
│   ├── (public)/                 # Public pages (no auth required)
│   │   ├── voyages/              # Travel listings & details
│   │   ├── contact/              # Contact form
│   │   ├── faq/                  # FAQ section
│   │   └── [legal pages]/        # Privacy, T&C, etc.
│   ├── layout.tsx                # Root layout (providers, fonts, etc.)
│   ├── page.tsx                  # Homepage
│   ├── error.tsx                 # Error boundary
│   ├── global-error.tsx          # Global error fallback
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # SEO sitemap
│   ├── providers.tsx             # React providers (Sentry, etc.)
│   └── globals.css               # Global Tailwind styles

├── components/                   # Reusable React components (70 files)
│   ├── ui/                       # Shadcn/UI base components (19 files)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── form.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── skeleton.tsx
│   │   └── ... (13 more)
│   ├── layout/                   # App-wide layout (3 files)
│   │   ├── header.tsx            # Navigation bar
│   │   ├── footer.tsx            # Footer with links
│   │   └── sidebar.tsx           # Dashboard sidebar
│   ├── checkout/                 # Booking flow components (3 files)
│   │   ├── step-indicator.tsx    # Progress indicator
│   │   ├── price-summary.tsx     # Pricing breakdown
│   │   └── hold-timer.tsx        # Booking hold countdown
│   ├── groups/                   # Group management (3 files)
│   │   ├── group-card.tsx
│   │   ├── member-list.tsx
│   │   └── invite-form.tsx
│   ├── finance/                  # Financial components (3 files)
│   │   ├── finance-summary.tsx
│   │   ├── cost-table.tsx
│   │   └── margin-chart.tsx
│   ├── marketing/                # Campaign management (3 files)
│   │   ├── campaign-card.tsx
│   │   ├── campaign-wizard.tsx
│   │   └── metrics-chart.tsx
│   ├── restauration/             # Meal planning (3 files)
│   │   ├── dietary-form.tsx
│   │   ├── meal-plan-editor.tsx
│   │   └── restaurant-card.tsx
│   ├── rooming/                  # Room assignment (2 files)
│   │   ├── rooming-table.tsx
│   │   └── hotel-block-card.tsx
│   ├── notifications/            # Notification UI (2 files)
│   │   ├── notification-bell.tsx
│   │   └── notification-item.tsx
│   ├── cookie-banner/            # Cookie consent (4 files)
│   │   ├── CookieBanner.tsx
│   │   ├── CookiePreferencesModal.tsx
│   │   ├── ScriptWithConsent.tsx
│   │   └── index.ts
│   ├── post-sale/                # Post-booking (3 files)
│   │   ├── invoice-preview.tsx
│   │   ├── feedback-form.tsx
│   │   └── travel-report-preview.tsx
│   ├── admin/                    # Admin-specific (4 files)
│   │   ├── data-table.tsx
│   │   ├── stats-card.tsx
│   │   ├── approval-modal.tsx
│   │   └── export-cta.tsx
│   ├── error-boundary/           # Error handling (1 file)
│   │   └── SentryErrorBoundary.tsx
│   ├── legal/                    # Legal modals (2 files)
│   ├── cancellation/             # Cancellation flow (2 files)
│   ├── insurance/                # Insurance cards (1 file)
│   ├── transport/                # Transport/stops (2 files)
│   ├── uploads/                  # File upload (3 files)
│   ├── travels/                  # Travel components (1 file)
│   ├── BookingCard.tsx           # Domain component
│   ├── TravelCard.tsx            # Domain component
│   ├── TravelFilters.tsx         # Domain component
│   ├── ReviewCard.tsx            # Domain component
│   ├── PaymentHistoryTable.tsx   # Domain component
│   ├── Navbar.tsx                # Navigation
│   └── JsonLd.tsx                # SEO structured data

├── hooks/                        # Custom React hooks (8 files)
│   ├── useAuth.ts                # Auth context hook
│   ├── useCookieConsent.ts       # Cookie preferences
│   ├── use-debounce.ts           # Debounce values
│   ├── use-file-upload.ts        # File upload handling
│   ├── use-media-query.ts        # Responsive queries
│   ├── use-notifications-websocket.ts # Real-time updates
│   ├── use-pagination.ts         # Table pagination
│   └── index.ts                  # Export barrel

├── lib/                          # Utilities & core logic
│   ├── api.ts                    # API endpoint definitions
│   ├── api-client.ts             # HTTP client + interceptors
│   ├── config.ts                 # Environment config
│   ├── constants.ts              # App constants
│   ├── utils.ts                  # Utility functions
│   ├── sentry.ts                 # Error tracking
│   ├── stores/                   # Zustand state management
│   │   ├── auth-store.ts         # User auth state
│   │   ├── checkout-store.ts     # Booking flow state
│   │   ├── client-store.ts       # Client profile state
│   │   ├── pro-store.ts          # Pro/partner state
│   │   ├── notification-store.ts # Notifications state
│   │   ├── ui-store.ts           # UI toggles
│   │   └── index.ts              # Export barrel
│   ├── hooks/
│   │   └── use-auth.ts           # Auth hook wrapper
│   ├── types/
│   │   └── index.ts              # Type exports
│   └── validations/
│       └── auth.ts               # Zod schemas

├── types/                        # TypeScript types (3 files)
│   ├── api.ts                    # API response types + enums
│   ├── cookie-consent.ts         # Cookie preference types
│   └── index.ts                  # Export barrel

├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/

├── styles/                       # CSS files (if not in app/)
│   └── globals.css               # Tailwind directives

├── .env.local                    # Environment variables
├── .eslintrc.json                # ESLint config
├── .prettierrc                   # Prettier config
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── package-lock.json             # Lock file
└── README.md                     # Project README
```

---

## Portails — 3 interfaces distinctes (mis à jour 2026-03-09)

L'application comporte **3 portails séparés** avec des interfaces, layouts et composants différents :

### 1. Portail Client (public + espace client)
- **Routes publiques** : `app/(public)/` — homepage, voyages, CGV, mentions légales, FAQ, etc.
- **Espace client authentifié** : `app/(client)/client/` — 21 pages (profil, réservations, groupes, historique)
- **Design** : gradient sunset premium (#0A1628 → #A85A30), orange accent #FF6B35
- **Rôle requis** : CLIENT ou ADMIN

### 2. Portail Professionnel
- **Routes** : `app/(pro)/pro/` — 27 pages (gestion voyages, revenus, calendrier, équipe)
- **Design** : interface différente du portail client, orientée dashboard/gestion
- **Rôle requis** : PRO ou ADMIN

### 3. Portail Admin (back-office)
- **Routes** : `app/(admin)/admin/` — 23 pages (gestion utilisateurs, voyages, réservations, modération)
- **Design** : interface différente des 2 autres portails, orientée supervision/pilotage
- **Rôle requis** : ADMIN uniquement

### Middleware d'authentification (`middleware.ts`)
- JWT httpOnly cookie (`access_token`) décodé côté Edge
- Matcher : `/admin/*`, `/pro/*`, `/client/*`, `/checkout/*`
- Vérification d'expiration + redirection vers `/connexion` si invalide
- Routes publiques exemptées : `/`, `/voyages`, `/connexion`, `/inscription`, etc.

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP ROUTER                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           ROUTE GROUPS (Layout Isolation)            │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ (public)    (auth)    (client)  (pro)  (admin)       │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓              ↓            ↓       ↓              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            PAGE COMPONENTS (103 total)               │   │
│  │                                                       │   │
│  │  Each page: useState, useEffect, API calls          │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        REUSABLE COMPONENTS (70 components)           │   │
│  │                                                       │   │
│  │  ├─ UI Layer (Shadcn/UI 19 files)                   │   │
│  │  ├─ Domain Components (groups, finance, etc.)       │   │
│  │  └─ Layout Components (header, footer, sidebar)     │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      HOOKS & STATE MANAGEMENT (Zustand Stores)       │   │
│  │                                                       │   │
│  │  ├─ useAuth → auth-store (user session)             │   │
│  │  ├─ useCheckout → checkout-store (booking flow)     │   │
│  │  ├─ useClient → client-store (profile data)         │   │
│  │  ├─ usePro → pro-store (partner data)               │   │
│  │  ├─ useNotifications → notification-store           │   │
│  │  ├─ useUI → ui-store (toggles, modals)              │   │
│  │  └─ useMarketing → marketing-store (campaigns)      │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     API LAYER (api.ts + api-client.ts)               │   │
│  │                                                       │   │
│  │  ├─ HTTP client with retry logic                    │   │
│  │  ├─ Request/response interceptors                   │   │
│  │  ├─ Auth token injection                            │   │
│  │  └─ Domain-based API groupings                      │   │
│  └──────────────────────────────────────────────────────┘   │
│           ↓                                                  │
└─────────────────────────────────────────────────────────────┘
                         ↓
            ┌────────────────────────────┐
            │   BACKEND API ENDPOINTS    │
            │                            │
            │ /api/auth/*                │
            │ /api/travels/*             │
            │ /api/bookings/*            │
            │ /api/payments/*            │
            │ /api/users/*               │
            │ /api/admin/*               │
            └────────────────────────────┘
                         ↓
            ┌────────────────────────────┐
            │   EXTERNAL SERVICES        │
            │                            │
            │ Payment: Stripe/PayPal     │
            │ Email: SendGrid/Mailgun    │
            │ SMS: Twilio                │
            │ Storage: S3/Cloudinary     │
            │ Monitoring: Sentry         │
            └────────────────────────────┘
```

---

## State Management Architecture

```
ZUSTAND STORES (Decentralized, Role-Based)

┌─────────────────────────────────────────────────────────┐
│           auth-store.ts (5.5 KB)                        │
├─────────────────────────────────────────────────────────┤
│ • user: UserProfile                                     │
│ • token: JWT token                                      │
│ • role: CLIENT | PRO | ADMIN                           │
│ • isAuthenticated: boolean                              │
│ • permissions: string[]                                 │
│                                                         │
│ ACTIONS:                                                │
│ • login(email, password)                                │
│ • register(userData)                                    │
│ • logout()                                              │
│ • refreshToken()                                        │
│ • updateProfile(changes)                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           checkout-store.ts (2.9 KB)                    │
├─────────────────────────────────────────────────────────┤
│ • currentStep: 1 | 2 | 3 | 'confirmation'              │
│ • selectedRooms: Room[]                                 │
│ • occupancy: Record<roomId, number>                     │
│ • pricing: { subtotal, fees, taxes, total }            │
│ • holdExpiry: timestamp                                 │
│ • promoCode?: string                                    │
│                                                         │
│ ACTIONS:                                                │
│ • setStep(step)                                         │
│ • selectRoom(roomId, occupancy)                         │
│ • calculatePricing()                                    │
│ • applyPromo(code)                                      │
│ • submitCheckout()                                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           client-store.ts (4.6 KB)                      │
├─────────────────────────────────────────────────────────┤
│ • profile: ClientProfile                                │
│ • bookings: Booking[]                                   │
│ • groups: Group[]                                       │
│ • paymentMethods: PaymentMethod[]                       │
│ • notifications: Notification[]                         │
│                                                         │
│ ACTIONS:                                                │
│ • fetchProfile()                                        │
│ • fetchBookings()                                       │
│ • createBooking(travelId, details)                      │
│ • cancelBooking(bookingId)                              │
│ • updatePreferences(bookingId, prefs)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           pro-store.ts (7.9 KB) - MOST COMPLEX          │
├─────────────────────────────────────────────────────────┤
│ • proProfile: ProProfile                                │
│ • voyages: Voyage[]                                     │
│ • team: TeamMember[]                                    │
│ • financials: FinancialData                             │
│ • onboardingStatus: 'not_started'|'in_progress'|'done'  │
│ • formationProgress: number (0-100)                     │
│ • marketingCampaigns: Campaign[]                        │
│                                                         │
│ ACTIONS:                                                │
│ • fetchProProfile()                                     │
│ • createVoyage(voyageData)                              │
│ • updateVoyage(voyageId, changes)                       │
│ • fetchReservations(voyageId)                           │
│ • fetchFinancialData()                                  │
│ • addTeamMember(userData)                               │
│ • createMarketingCampaign(campaignData)                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           notification-store.ts (7.2 KB)                │
├─────────────────────────────────────────────────────────┤
│ • notifications: Notification[]                         │
│ • unreadCount: number                                   │
│ • preferences: NotificationPreferences                  │
│ • isConnected: boolean (WebSocket)                      │
│                                                         │
│ ACTIONS:                                                │
│ • connectWebSocket()                                    │
│ • disconnectWebSocket()                                 │
│ • markAsRead(notificationId)                            │
│ • markAllAsRead()                                       │
│ • setPreferences(newPrefs)                              │
│ • deleteNotification(notificationId)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           ui-store.ts (3.1 KB)                          │
├─────────────────────────────────────────────────────────┤
│ • sidebarOpen: boolean                                  │
│ • modals: { [key: string]: boolean }                    │
│ • toast: Toast | null                                  │
│ • pagination: { page, size }                            │
│ • theme: 'light' | 'dark'                               │
│                                                         │
│ ACTIONS:                                                │
│ • toggleSidebar()                                       │
│ • openModal(key)                                        │
│ • closeModal(key)                                       │
│ • showToast(message, type)                              │
│ • setPagination(page, size)                             │
│ • setTheme(theme)                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy Example: Checkout Flow

```
/checkout/step-1

┌─────────────────────────────────────┐
│    CheckoutStep1Page (Main)         │
├─────────────────────────────────────┤
│ State:                              │
│ • travel (from API)                 │
│ • selectedRooms (from store)        │
│ • loading, error states             │
│                                     │
│ Hooks:                              │
│ • useRouter()                       │
│ • useCheckoutStore()                │
│ • useAuthStore() [optional]         │
│ • useEffect() [fetch travel]        │
│                                     │
│ ┌────────────────────────────────┐ │
│ │   StepIndicator Component      │ │
│ │   (shows 1 of 3)               │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌────────────────────────────────┐ │
│ │  Travel Header Section         │ │
│ │  • Title, duration, dates      │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌────────────────────────────────┐ │
│ │  Room Selection Grid           │ │
│ │                                │ │
│ │  ┌──────────┐  ┌──────────┐   │ │
│ │  │ Room A   │  │ Room B   │   │ │
│ │  │ $1,200   │  │ $900     │   │ │
│ │  │ [SELECT] │  │ [SELECT] │   │ │
│ │  └──────────┘  └──────────┘   │ │
│ │                                │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌────────────────────────────────┐ │
│ │  PriceSummary Component        │ │
│ │                                │ │
│ │  Subtotal:      $3,600         │ │
│ │  Taxes:         $500           │ │
│ │  Total:         $4,100         │ │
│ │                                │ │
│ │  [PROCEED TO STEP 2]           │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌────────────────────────────────┐ │
│ │  HoldTimer Component           │ │
│ │  Hold expires in: 14:23        │ │
│ └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Authentication Flow

```
UNAUTHENTICATED USER
        ↓
    [LOGIN PAGE]
    /connexion
        ↓
   User enters email/password
        ↓
   Form validated (Zod schema)
        ↓
   api.auth.login(email, password)
        ↓
   Backend returns: { token, user, role }
        ↓
   auth-store.login() → stores token + user
        ↓
   Token injected in all subsequent API calls
   (via api-client.ts interceptor)
        ↓
   Redirect to dashboard based on role:
   • CLIENT → /client
   • PRO → /pro
   • ADMIN → /admin

---

LOGGED IN USER WITH ROLE-BASED ACCESS

┌────────────────────────────────────┐
│     AUTHENTICATION LAYER            │
├────────────────────────────────────┤
│                                    │
│  auth-store.ts                     │
│  ├─ user: { id, email, role }     │
│  ├─ token: JWT string             │
│  └─ permissions: string[]          │
│                                    │
└────────────────────────────────────┘
        ↓
┌────────────────────────────────────┐
│     ROUTE PROTECTION                │
├────────────────────────────────────┤
│                                    │
│  Middleware checks role:           │
│  • /admin/* → role must be ADMIN   │
│  • /pro/* → role must be PRO       │
│  • /client/* → role must be CLIENT │
│                                    │
└────────────────────────────────────┘
        ↓
┌────────────────────────────────────┐
│     ROLE-SPECIFIC DASHBOARDS        │
├────────────────────────────────────┤
│                                    │
│  /client  → Client Dashboard       │
│  /pro     → Partner Dashboard      │
│  /admin   → Admin Dashboard        │
│                                    │
└────────────────────────────────────┘
```

---

## Technology Stack

```
FRONTEND FRAMEWORK
├─ Next.js 14.0.4 (App Router, Server Components)
└─ React 18.2.0 (Component library, hooks)

LANGUAGE & TYPE SYSTEM
├─ TypeScript 5.3.3 (Type safety)
└─ Zod 3.22.4 (Schema validation)

STYLING
├─ Tailwind CSS 3.4.1 (Utility-first CSS)
├─ Shadcn/UI (Component library)
└─ Lucide React 0.369.0 (Icons)

FORMS & VALIDATION
├─ React Hook Form 7.50.1 (Form handling)
├─ @hookform/resolvers 3.3.4 (Zod integration)
└─ Zod 3.22.4 (Validation schemas)

STATE MANAGEMENT
└─ Zustand 4.4.7 (Lightweight, decentralized stores)

HTTP CLIENT
├─ Fetch API (built-in, used in api-client.ts)
└─ Custom retry logic + interceptors

MONITORING & ERROR TRACKING
└─ Sentry 7.80.0 (Exception tracking, performance)

BUILD & DEV TOOLS
├─ ESLint (Code quality)
├─ Prettier (Code formatting)
├─ PostCSS (CSS processing)
├─ Autoprefixer (Browser prefixes)
└─ TypeScript Compiler (Type checking)

TESTING FRAMEWORKS (Configured but minimal usage)
├─ Jest (Unit testing)
├─ React Testing Library (Component testing)
└─ Playwright (E2E testing)

SUPPORTING LIBRARIES
├─ clsx 2.0.0 (Class merging)
├─ tailwind-merge 2.2.0 (Tailwind class utilities)
└─ next/navigation (Routing utilities)
```

---

## File Size Summary

| Section | Files | Size | Purpose |
|---------|-------|------|---------|
| Pages | 103 | 29.7 KB | Route handlers & UI |
| Components | 70 | 8.0 KB | Reusable UI pieces |
| Stores | 7 | 31.8 KB | State management |
| Hooks | 8 | 623 LOC | Custom logic |
| Utils & Types | 10 | 1.1 KB | Helpers & types |
| **TOTAL** | **~200** | **~45 KB** | **Production frontend** |

---

## Deployment Considerations

### Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

### Build Output
```
npm run build
→ .next/ folder with optimized bundles
→ Static exports for CDN
→ Server-side functions if needed
```

### Deployment Options
- Vercel (recommended for Next.js)
- AWS Amplify
- Docker container
- Self-hosted Node.js server

### Performance Optimizations
- Image optimization (next/image)
- Code splitting by route
- Dynamic imports for heavy components
- Static generation for public pages

---

## Development Workflow

```
1. Feature Branch
   git checkout -b feature/feature-name

2. Development
   npm run dev → localhost:3000

3. Linting
   npm run lint

4. Formatting
   npm run format

5. Testing
   npm run test

6. E2E Testing
   npm run e2e

7. Build
   npm run build

8. Deployment
   Push to main → Auto-deploy to Vercel
```

---

## Key Patterns Used

### 1. Custom Hooks Pattern
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
};
```

### 2. Store Pattern
```typescript
// lib/stores/auth-store.ts
export const useAuthStore = create((set) => ({
  user: null,
  login: async (email, password) => { /* ... */ },
  logout: () => { /* ... */ },
}));
```

### 3. API Client Pattern
```typescript
// lib/api.ts
export const api = {
  auth: {
    login: (email, password) => 
      apiClient.post('/auth/login', { email, password }),
  },
  travels: {
    list: () => apiClient.get('/travels'),
  },
};
```

### 4. Component Composition
```typescript
// Smaller, reusable components combined
<PriceSummary />
<StepIndicator currentStep={1} />
<HoldTimer />
```

---

## Security Considerations

1. **Token Management**
   - JWT tokens stored in Zustand (in-memory)
   - Sent with every API request via Authorization header
   - Auto-refresh on expiry

2. **CORS Protection**
   - Backend validates origin
   - Credentials mode set to 'include'

3. **Form Validation**
   - Client-side with Zod
   - Server-side validation (backend)
   - CSRF token in forms if needed

4. **Error Handling**
   - No sensitive data in error messages
   - Sentry captures errors securely
   - User-friendly error messages shown to UI

5. **Environment Variables**
   - API keys in .env.local (not committed)
   - Public keys prefixed with NEXT_PUBLIC_

