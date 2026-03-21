# Absolute File Paths — LOT B-016, F-017, F-018

## Backend (NestJS)

### Service Layer
- `/sessions/sleepy-great-dirac/mnt/eventisite/backend/src/modules/pro/sales-dashboard/sales-dashboard.service.ts`
  - SalesDashboard interface definition
  - getSalesDashboard(proProfileId) → SalesDashboard
  - getTimeline(proProfileId, period) → TimelineEntry[]
  - getTopChannels(proProfileId) → TopChannel[]
  - Helper methods for ID validation & data aggregation

### Controller Layer
- `/sessions/sleepy-great-dirac/mnt/eventisite/backend/src/modules/pro/sales-dashboard/sales-dashboard.controller.ts`
  - GET /pro/sales-dashboard
  - GET /pro/sales-dashboard/timeline?period=7d|30d|90d
  - GET /pro/sales-dashboard/channels
  - JwtAuthGuard + RolesGuard integration

### Data Transfer Objects
- `/sessions/sleepy-great-dirac/mnt/eventisite/backend/src/modules/pro/sales-dashboard/sales-dashboard.dto.ts`
  - TimelinePeriodSchema (Zod)
  - GetTimelineQuerySchema (Zod)
  - Type exports for TypeScript

### Module Registration (Already Done)
- `/sessions/sleepy-great-dirac/mnt/eventisite/backend/src/modules/pro/pro.module.ts`
  - SalesDashboardService imported (line 28)
  - SalesDashboardController imported (line 29)
  - Controllers array includes SalesDashboardController (line 70)
  - Providers array includes SalesDashboardService (line 86)
  - Exports array includes SalesDashboardService (line 104)

---

## Frontend (Next.js)

### Dashboard Page
- `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/app/(pro)/pro/vendre/dashboard/page.tsx`
  - Main dashboard component
  - KPI cards section (4 cards)
  - Chart section (CSS-based bar chart)
  - Performance table (6 channels)
  - Top trips section
  - Live feed section
  - Period selector (7d/30d/90d)
  - Demo data embedded
  - useEffect for data fetching (currently demo mode)
  - Loading & error states

### Dashboard Loading UI
- `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/app/(pro)/pro/vendre/dashboard/loading.tsx`
  - Skeleton loader matching dashboard structure
  - Placeholder divs with background gradients
  - Responsive layout skeletons

---

## Components (React)

### Notification Toast
- `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/components/pro/SaleNotificationToast.tsx`
  - SaleNotification interface
  - Simulated real-time sales (45-sec interval in demo)
  - Toast with slide-in animation
  - Auto-dismiss after 8 seconds
  - Sound toggle functionality
  - Web Audio API implementation
  - Demo notification data

### Notification Badge
- `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/components/pro/SaleNotificationBadge.tsx`
  - Counter badge for menu items
  - Props: newSalesCount (optional)
  - Returns null when count = 0
  - Displays "99+" for overflow
  - Orange/coral gradient styling

---

## Styling

### Updated CSS File
- `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/app/(pro)/pro/pro.css`

**New Classes Added:**

Dashboard:
- `.pro-page-header` — Header with title & period selector
- `.pro-page-title` — Page title (Fraunces font)
- `.pro-page-subtitle` — Subtitle text
- `.pro-period-selector` — Period buttons container
- `.pro-btn-period` — Individual period button
- `.pro-kpi-grid` — 4-column grid layout
- `.pro-kpi-card` — KPI card styling with hover
- `.pro-kpi-header`, `.pro-kpi-label`, `.pro-kpi-value` — Card components
- `.pro-kpi-footer`, `.pro-kpi-change` — Change indicator
- `.pro-chart-panel` — Chart container
- `.pro-chart-legend` — Legend with color dots
- `.pro-legend-item`, `.pro-legend-dot` — Legend items
- `.pro-chart-bars` — Bars flex container
- `.pro-chart-bar-group`, `.pro-chart-bar-container` — Bar structures
- `.pro-chart-bar` — Individual bar styling
- `.pro-chart-label` — X-axis labels
- `.pro-table` — Table base
- `.pro-table th`, `.pro-table td` — Cell styling
- `.pro-table-channel`, `.pro-table-number`, `.pro-table-money`, `.pro-table-percent`, `.pro-table-trend` — Column-specific styles
- `.pro-trend-up`, `.pro-trend-stable`, `.pro-trend-down` — Trend indicators
- `.pro-trips-list` — Trips container
- `.pro-trip-card` — Individual trip card
- `.pro-trip-rank`, `.pro-trip-info`, `.pro-trip-name`, `.pro-trip-stats` — Trip card components
- `.pro-feed-list` — Feed container
- `.pro-feed-item` — Individual feed item
- `.pro-feed-icon`, `.pro-feed-content`, `.pro-feed-text`, `.pro-feed-time`, `.pro-feed-amount` — Feed components

Notifications:
- `.pro-notification-container` — Fixed top-right container
- `.pro-notification-toast` — Toast styling
- `.pro-toast-slide-in` — Animation class
- `.pro-toast-icon`, `.pro-toast-success`, `.pro-toast-warning`, `.pro-toast-error` — Icon variants
- `.pro-toast-content` — Content wrapper
- `.pro-toast-title`, `.pro-toast-message` — Text elements
- `.pro-toast-close` — Close button
- `.pro-notification-controls` — Control buttons container
- `.pro-notification-btn` — Control button styling
- `.pro-notification-badge` — Counter badge

Animations:
- `@keyframes proToastSlideIn` — Toast entry animation
- Responsive classes for mobile (600px, 768px, 1200px breakpoints)

---

## Documentation

- `/sessions/sleepy-great-dirac/mnt/eventisite/IMPLEMENTATION_SUMMARY.md`
  - Implementation overview
  - File-by-file breakdown
  - API integration guide
  - Production next steps

- `/sessions/sleepy-great-dirac/mnt/eventisite/FILE_PATHS.md` (this file)
  - Absolute paths reference
  - File purpose descriptions

---

## Quick Reference

### To Test Backend Endpoints:
```bash
# Must have JWT token in header
curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/pro/sales-dashboard

curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/pro/sales-dashboard/timeline?period=7d

curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/pro/sales-dashboard/channels
```

### To Test Frontend:
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/pro/vendre/dashboard`
3. Dashboard loads immediately with demo data
4. Watch toast notifications appear (every 45 seconds in demo mode)
5. Click period buttons to update chart

### To Connect to API:
1. Edit `/sessions/sleepy-great-dirac/mnt/eventisite/frontend/app/(pro)/pro/vendre/dashboard/page.tsx`
2. Replace hardcoded `DEMO_DASHBOARD`, `DEMO_TIMELINE`, `DEMO_CHANNELS` with API calls
3. Remove demo data variables
4. Test API endpoints with real backend

