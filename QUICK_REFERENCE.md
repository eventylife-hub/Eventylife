# Frontend Quick Reference Guide

## Quick Stats

```
102 pages       | 29.7K LOC        | 6 route groups
72 components   | 8.0K LOC         | 20+ domains
8 hooks         | 5 Zustand stores | 45K total LOC
```

## Route Map (102 Pages)

### Public Routes (16 pages) - No Auth Required
```
/                           Homepage + travel listings
/voyages                    Browse all travels
/voyages/[slug]             Travel details + reviews + booking
/voyages/[slug]/avis        Travel reviews
/voyages/[slug]/groupes     Group booking
/voyages/[slug]/checkout    Direct checkout from public
/depart/[ville]             Filter travels by departure city
/contact                    Contact form
/a-propos                   About company
/faq                        FAQ section
/cgv                        Terms & Conditions
/politique-confidentialite  Privacy Policy
/mentions-legales           Legal Mentions
/cookies                    Cookie settings
/p/[proSlug]               Pro/Agency profile
```

### Auth Routes (10 pages) - Authentication
```
/connexion                  Login form ✓ IMPL
/inscription                Registration form ✓ IMPL
/mot-de-passe-oublie        Forgot password ✓ IMPL
/reinitialiser-mot-de-passe Password reset (token) ✓ IMPL
/verification-email         Email verification ✓ IMPL
```

### Client Dashboard (21 pages) - User Account
```
/client                     Dashboard overview
/client/profil              Edit profile (609 LOC - comprehensive)
/client/reservations        All bookings
/client/reservations/[id]   Booking details
/client/reservations/[id]/facture    Invoice/receipt
/client/reservations/[id]/annuler    Cancel booking
/client/reservations/[id]/avis       Leave review
/client/reservations/[id]/rooming    Room assignments (440 LOC)
/client/reservations/[id]/preferences Dietary needs
/client/paiements           Payment history
/client/wallet              Virtual wallet/credits
/client/documents           Travel documents
/client/avis                My reviews
/client/assurance           Insurance management
/client/notifications       Notification center
/client/support             Support tickets (408 LOC)
/client/groupes             Manage groups
/client/groupes/creer       Create group
/client/groupes/[id]        Group details
/client/groupes/[id]/inviter Invite members
/client/groupes/rejoindre   Join group
```

### Pro/Partner Dashboard (27 pages) - Travel Providers
```
/pro                        Dashboard overview
/pro/login                  Pro login
/pro/inscription            Pro registration
/pro/onboarding             Multi-step setup (538 LOC)
/pro/formation              Training module
/pro/voyages                Manage voyages (list)
/pro/voyages/nouveau        Create voyage (1105 LOC - COMPLEX)
/pro/voyages/[id]           Voyage details
/pro/voyages/[id]/reservations       Bookings management (342 LOC)
/pro/voyages/[id]/rooming            Room allocation
/pro/voyages/[id]/rooming/hotel-blocks Hotel blocks
/pro/voyages/[id]/restauration       Meal planning
/pro/voyages/[id]/transport          Transport/stops
/pro/voyages/[id]/transport/manifest  Passenger manifest
/pro/voyages/[id]/equipe             Team management
/pro/voyages/[id]/finance            Financial tracking
/pro/voyages/[id]/factures           Invoices
/pro/voyages/[id]/bilan              Final report
/pro/vendre                  Sales opportunities
/pro/arrets                  Stop management
/pro/documents               Document library
/pro/marketing               Marketing campaigns
/pro/marketing/creer         Create campaign
/pro/marketing/[id]          Campaign details
/pro/finance                 Finance overview
/pro/revenus                 Revenue tracking
/pro/revenus/releve          Revenue statements
```

### Admin Dashboard (23 pages) - Platform Management
```
/admin                      Dashboard overview (202 LOC)
/admin/voyages              All voyages
/admin/voyages/[id]         Voyage details
/admin/voyages/[id]/lifecycle Lifecycle tracking (330 LOC)
/admin/voyages/creer        Create voyage (1020 LOC)
/admin/utilisateurs         User management
/admin/utilisateurs/[id]    User details
/admin/pros                 Partner list
/admin/bookings             Booking management (457 LOC)
/admin/annulations          Cancellations (209 LOC)
/admin/annulations/[id]     Cancellation detail (354 LOC)
/admin/finance              Financial overview
/admin/finance/payouts      Payout management
/admin/alertes              System alerts (393 LOC)
/admin/notifications        Notifications (591 LOC)
/admin/documents            Document management
/admin/support              Support tickets
/admin/rooming              Room/accommodation
/admin/transport            Transport management
/admin/exports              Data exports
/admin/marketing            Marketing management
/admin/parametres           Settings/configuration
/admin/audit                Audit logs
```

### Checkout Routes (5 pages) - Multi-Step Booking
```
/checkout/start             Start/summary page
/checkout/step-1            Select rooms (210 LOC)
/checkout/step-2            Set occupancy (307 LOC)
/checkout/step-3            Payment & confirmation (111 LOC)
/checkout/confirmation      Success page (235 LOC)
```

---

## Key Components (72 total)

### UI Layer (19 Shadcn components)
Button, Input, Card, Badge, Modal, Dialog, Tabs, Accordion, Form, Select, Checkbox, Radio, Switch, Textarea, Toast, Dropdown, Skeleton, etc.

### Domain Components

**Checkout (210 LOC)**
- PriceSummary - Pricing breakdown
- StepIndicator - Progress tracker
- HoldTimer - Booking hold countdown

**Finance (434 LOC)**
- FinanceSummary - Revenue overview
- CostTable - Expense tracking
- MarginChart - Profitability visualization

**Groups (327 LOC)**
- GroupCard - Group preview
- MemberList - Participants list
- InviteForm - Send invitations

**Rooming (284 LOC)**
- RoomingTable - Room assignments
- HotelBlockCard - Block management

**Restauration (453 LOC)**
- DietaryForm - Special needs
- MealPlanEditor - Meal planning
- RestaurantCard - Restaurant info

**Marketing (443 LOC)**
- CampaignCard - Preview
- CampaignWizard - Creation flow
- MetricsChart - Performance graphs

**Admin (361 LOC)**
- DataTable - Sortable tables
- StatsCard - KPI displays
- ApprovalModal - Review & approve
- ExportCTA - Export controls

**Notifications (312 LOC)**
- NotificationBell - Unread badge
- NotificationItem - Single notification

**Post-Sale (513 LOC)**
- InvoicePreview - Receipt display
- FeedbackForm - Collect reviews
- TravelReportPreview - Final report

**Layout (479 LOC)**
- Header - Navigation bar
- Footer - Links & contact
- Sidebar - Dashboard navigation

**Cookie Banner (498 LOC)**
- CookieBanner - Initial prompt
- CookiePreferencesModal - Detailed settings
- ScriptWithConsent - GA4/Sentry integration

---

## State Management (Zustand Stores)

### 1. auth-store (5.5 KB)
```typescript
user: UserProfile
token: string
role: 'CLIENT' | 'PRO' | 'ADMIN'
permissions: string[]

login(email, password)
logout()
refreshToken()
```

### 2. checkout-store (2.9 KB)
```typescript
currentStep: 1 | 2 | 3 | 'confirmation'
selectedRooms: Room[]
occupancy: Record<roomId, number>
pricing: { subtotal, fees, taxes, total }
holdExpiry: timestamp

setStep(step)
selectRoom(roomId, occupancy)
calculatePricing()
applyPromo(code)
```

### 3. client-store (4.6 KB)
```typescript
profile: ClientProfile
bookings: Booking[]
groups: Group[]
paymentMethods: PaymentMethod[]

fetchProfile()
fetchBookings()
createBooking(travelId, details)
cancelBooking(bookingId)
```

### 4. pro-store (7.9 KB) - Most Complex
```typescript
proProfile: ProProfile
voyages: Voyage[]
team: TeamMember[]
financials: FinancialData
onboardingStatus: 'not_started' | 'in_progress' | 'done'
formationProgress: 0-100

fetchProProfile()
createVoyage(data)
updateVoyage(id, changes)
fetchReservations(voyageId)
addTeamMember(data)
```

### 5. notification-store (7.2 KB)
```typescript
notifications: Notification[]
unreadCount: number
preferences: NotificationPreferences
isConnected: boolean (WebSocket)

connectWebSocket()
markAsRead(id)
setPreferences(newPrefs)
```

### 6. ui-store (3.1 KB)
```typescript
sidebarOpen: boolean
modals: { [key: string]: boolean }
toast: Toast | null
pagination: { page, size }

toggleSidebar()
openModal(key)
showToast(message, type)
```

---

## Custom Hooks (8 total)

```typescript
useAuth()                           // Session + role checking
useCookieConsent()                  // Cookie preferences
useDebounce(value, delay)           // Debounce values
useFileUpload()                     // File upload handling
useMediaQuery(query)                // Responsive breakpoints
useNotificationsWebSocket()         // Real-time updates
usePagination()                     // Table pagination
useAuth() [from lib/hooks]          // Wrapper hook
```

---

## API Client Pattern

```typescript
// lib/api.ts
export const api = {
  auth: {
    login(email, password) { /* ... */ },
    register(data) { /* ... */ },
    verifyEmail(token) { /* ... */ },
  },
  travels: {
    list(filters) { /* ... */ },
    detail(slug) { /* ... */ },
  },
  bookings: {
    create(travelId, details) { /* ... */ },
    list(userId) { /* ... */ },
    cancel(bookingId) { /* ... */ },
  },
  // 15+ more domains
}
```

---

## Form Validation (Zod + React Hook Form)

```typescript
// lib/validations/auth.ts
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// In component
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(LoginSchema),
})
```

---

## Key Dependencies

```json
{
  "next": "^14.0.4",
  "react": "^18.2.0",
  "zustand": "^4.4.7",
  "react-hook-form": "^7.50.1",
  "zod": "^3.22.4",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.369.0",
  "@sentry/nextjs": "^7.80.0"
}
```

---

## File Organization

```
frontend/
├── app/                 # 102 page routes
├── components/          # 72 reusable components
├── hooks/              # 8 custom hooks
├── lib/                # API, stores, utils, types
├── types/              # TypeScript definitions
├── public/             # Static assets
└── styles/             # Global CSS
```

---

## Quick Imports

```typescript
// Components
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TravelCard } from '@/components/TravelCard'

// Hooks
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/lib/stores/auth-store'
import { usePagination } from '@/hooks/use-pagination'

// Utils & Types
import { formatPrice, formatDate } from '@/lib/utils'
import { api } from '@/lib/api'
import type { Travel, Booking, UserProfile } from '@/types/api'

// Constants
import { ROUTES } from '@/lib/constants'
```

---

## Implementation Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| **Public Pages** | ✓ 100% | Homepage, travels, legal pages |
| **Auth** | ✓ 100% | All flows implemented |
| **Client Dashboard** | ✓ 95% | UI ready, API integration needed |
| **Pro Dashboard** | ✓ 90% | Complex voyage creation implemented |
| **Admin Dashboard** | ✓ 95% | Comprehensive management UI |
| **Checkout** | ⚙ 70% | Steps ready, payment integration needed |
| **Components** | ✓ 90% | 72 components, well-organized |
| **State Management** | ✓ 100% | 5 Zustand stores complete |
| **Type System** | ✓ 100% | Comprehensive types + enums |
| **Error Handling** | ✓ 100% | Sentry + error boundaries |
| **Forms & Validation** | ✓ 90% | Zod + Hook Form ready |

---

## Next Steps (Priority Order)

1. **Connect Backend API**
   - Replace mock API calls with real endpoints
   - Verify authentication flow

2. **Integrate Payment Gateway**
   - Stripe or PayPal
   - Handle success/failure flows

3. **Set Up Notifications**
   - Email service (SendGrid/Mailgun)
   - SMS (Twilio)
   - WebSocket connection for real-time

4. **Document Storage**
   - S3 for uploads
   - PDF generation for invoices

5. **Testing & QA**
   - Add integration tests
   - End-to-end testing
   - Performance optimization

---

## Development Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run test             # Run Jest tests
npm run e2e              # Run Playwright E2E tests
npm run e2e:ui           # E2E with UI mode
```

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
NEXT_PUBLIC_STRIPE_KEY=...
```

---

## Key Patterns

1. **Route Protection** - Check auth-store role before rendering
2. **Loading States** - Use useState + useEffect for async data
3. **Error Handling** - Try/catch in effects, show user-friendly messages
4. **Form Handling** - React Hook Form + Zod for validation
5. **API Calls** - Use api.* object from lib/api.ts
6. **State Updates** - Use Zustand store actions
7. **Component Props** - Strong typing with TypeScript interfaces

