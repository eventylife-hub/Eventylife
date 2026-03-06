# Architecture Frontend - Eventy Life

## 📋 Vue d'ensemble

Frontend complète Next.js 14 pour la plateforme française de voyages de groupe **Eventy Life**. Structure organisée selon les meilleures pratiques avec authentification, dashboards multi-rôles et interface responsive.

**Date de création :** 2 mars 2026  
**Langue :** Français (tous les textes et commentaires)  
**Framework :** Next.js 14 avec TypeScript et Tailwind CSS

---

## 📁 Structure des répertoires

```
frontend/
├── app/                          # App router Next.js 14
│   ├── layout.tsx                # Layout racine avec métadonnées
│   ├── page.tsx                  # Page d'accueil
│   ├── providers.tsx             # Providers (React Query, etc.)
│   ├── globals.css               # Styles globaux
│   │
│   ├── (public)/                 # Routes publiques sans authentification
│   │   ├── layout.tsx            # Contient Header + Footer
│   │   ├── voyages/              # Listing des voyages
│   │   │   ├── page.tsx          # Tous les voyages avec filtres
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Détail d'un voyage
│   │   ├── a-propos/page.tsx     # À propos
│   │   ├── contact/page.tsx      # Contact
│   │   └── cgv, confidentialite, mentions-legales/
│   │
│   ├── (auth)/                   # Routes d'authentification
│   │   ├── layout.tsx            # Centré, fond dégradé
│   │   └── auth/
│   │       ├── connexion/page.tsx        # Login
│   │       ├── inscription/page.tsx      # Register
│   │       └── mot-de-passe-oublie/page.tsx
│   │
│   ├── (client)/                 # Dashboard client (protégé)
│   │   └── client/
│   │       ├── layout.tsx        # Sidebar + Header
│   │       ├── page.tsx          # Overview
│   │       ├── reservations/page.tsx
│   │       ├── profil/page.tsx
│   │       ├── documents/page.tsx
│   │       └── support/page.tsx
│   │
│   ├── (pro)/                    # Dashboard guide (protégé)
│   │   └── pro/
│   │       ├── layout.tsx        # Sidebar + Header
│   │       ├── page.tsx          # Overview
│   │       ├── voyages/
│   │       │   ├── page.tsx      # Mes voyages
│   │       │   └── nouveau/page.tsx
│   │       ├── arrets/page.tsx
│   │       ├── documents/page.tsx
│   │       └── formation/page.tsx
│   │
│   ├── (admin)/                  # Dashboard admin (protégé)
│   │   └── admin/
│   │       ├── layout.tsx        # Sidebar + Header
│   │       ├── page.tsx          # Stats et KPIs
│   │       ├── utilisateurs/page.tsx
│   │       ├── voyages/page.tsx
│   │       ├── finance/page.tsx
│   │       ├── support/page.tsx
│   │       └── parametres/page.tsx
│   │
│   └── (checkout)/               # Processus de réservation
│       └── checkout/
│           ├── layout.tsx        # Étapes indicateur
│           ├── start/page.tsx
│           ├── step-1/page.tsx   # Sélection chambres
│           ├── step-2/page.tsx   # Participants
│           ├── step-3/page.tsx   # Paiement
│           └── confirmation/page.tsx
│
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants atomiques
│   │   ├── button.tsx            # Bouton (variantes: primary, secondary, outline, danger, ghost)
│   │   ├── input.tsx             # Input avec label et erreur
│   │   ├── card.tsx              # Carte (Card, CardHeader, CardContent, CardFooter)
│   │   ├── skeleton.tsx          # Skeleton de chargement
│   │   ├── badge.tsx             # Badge de statut
│   │   └── toast.tsx             # Notifications toast
│   │
│   └── layout/                   # Composants de mise en page
│       ├── header.tsx            # En-tête public
│       ├── footer.tsx            # Pied de page
│       └── sidebar.tsx           # Barre latérale dashboards
│
├── lib/                          # Utilitaires et logique métier
│   ├── api.ts                    # Client Axios avec interceptors
│   ├── utils.ts                  # Fonctions utilitaires (formatPrice, formatDate, etc.)
│   ├── constants.ts              # Routes, labels, limites
│   ├── types/
│   │   └── index.ts              # Types TypeScript (User, Travel, etc.)
│   └── stores/                   # Zustand stores
│       ├── auth-store.ts         # Gestion authentification
│       └── ui-store.ts           # État UI (sidebar, toasts)
│
├── hooks/                        # Custom React hooks
│   └── useAuth.ts                # Hook authentification
│
├── public/                       # Fichiers statiques
│   ├── favicon.ico
│   └── ...
│
├── middleware.ts                 # Protection des routes
├── tailwind.config.ts            # Configuration Tailwind
├── next.config.js                # Configuration Next.js
├── tsconfig.json                 # Configuration TypeScript
├── package.json
└── README.md
```

---

## 🎨 Composants UI

### Bouton (Button)
```tsx
<Button variant="primary|secondary|outline|danger|ghost" size="sm|md|lg">
  Texte du bouton
</Button>
```

### Input
```tsx
<Input
  label="Libellé"
  type="text|email|password"
  error={erreur}
  helperText="Aide"
  required
/>
```

### Carte (Card)
```tsx
<Card elevated hoverEffect>
  <CardHeader>Titre</CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Pied</CardFooter>
</Card>
```

### Badge
```tsx
<Badge variant="default|success|error|warning|info|subtle">
  Texte
</Badge>
```

---

## 🔐 Authentification et Protection des Routes

### Middleware (middleware.ts)
- Protège `/client/*` → Rôle **CLIENT**
- Protège `/pro/*` → Rôle **PRO** ou **ADMIN**
- Protège `/admin/*` → Rôle **ADMIN** uniquement
- Protège `/checkout/*` → Authentifié
- Redirige vers `/auth/connexion` si non authentifié

### Auth Store (Zustand)
```typescript
const { user, isAuthenticated, login, register, logout } = useAuthStore();
```

---

## 📡 API Client

Client Axios avec gestion automatique des tokens :

```typescript
import { api } from '@/lib/api';

// GET
const { success, data, error } = await api.get<Type>('/endpoint');

// POST
await api.post('/endpoint', { body });

// Interceptor 401 → Refresh token automatique
```

---

## 🎯 États des Pages

Chaque page implémente 4 états UI :

1. **Loading** - Skeleton ou spinner
2. **Empty** - CTA pour action utilisateur
3. **Error** - Toast FR + bouton retry
4. **Data** - Contenu chargé

---

## 🌍 Localisation

**Tout le contenu est en français :**
- Tous les commentaires de code
- Tous les libellés UI
- Tous les messages d'erreur
- Toutes les routes (ex: `/auth/connexion`, `/voyages`)
- Tous les placeholders

---

## 🔑 Constantes (lib/constants.ts)

### Routes
```typescript
ROUTES = {
  HOME, VOYAGES, VOYAGE_DETAIL(slug),
  AUTH: { CONNEXION, INSCRIPTION, FORGOT_PASSWORD },
  CLIENT: { DASHBOARD, RESERVATIONS, PROFIL, DOCUMENTS, SUPPORT },
  PRO: { DASHBOARD, VOYAGES, VOYAGES_NEW, STOPS, DOCUMENTS, FORMATION },
  ADMIN: { DASHBOARD, UTILISATEURS, VOYAGES, FINANCE, SUPPORT, SETTINGS },
  CHECKOUT: { START, STEP_1, STEP_2, STEP_3, CONFIRMATION }
}
```

### Libellés
```typescript
BOOKING_STATUS_LABELS = { PENDING, CONFIRMED, CANCELLED, COMPLETED }
TRAVEL_STATUS_LABELS = { DRAFT, PUBLISHED, CANCELLED, ARCHIVED }
USER_ROLES = { CLIENT, PRO, ADMIN }
```

---

## 📦 Types TypeScript (lib/types/index.ts)

### Entités principales
- `User` - Utilisateur avec rôle
- `Travel` - Voyage avec prix, capacité, dates
- `BookingGroup` - Réservation de groupe
- `RoomBooking` - Réservation de chambre
- `Participant` - Participant à une réservation
- `Stop` - Arrêt du voyage
- `Document` - Document uploadé
- `Payment` - Paiement Stripe

### Types de réponses
- `ApiResponse<T>` - Réponse API standard
- `PaginatedResponse<T>` - Réponse paginée
- `ApiError` - Erreur API

---

## 🛠️ Utilitaires (lib/utils.ts)

```typescript
formatPrice(centimes)         // "12,50 €"
formatDate(dateString)        // "2 mars 2026"
formatDateTime(dateString)    // "2 mars 2026 à 14:30"
truncate(str, max)            // Tronquer avec ellipse
cn(...classes)                // Combine classes CSS
getInitials(firstName, lastName) // "JD"
calculateAge(dateOfBirth)     // Calcul âge
slugify(str)                  // Convertir en slug
```

---

## 🎬 États UI (Zustand - ui-store.ts)

```typescript
const {
  sidebarOpen, toggleSidebar,
  mobileMenuOpen, toggleMobileMenu,
  toasts, addToast, removeToast,
  isLoading, setIsLoading,
  modals, openModal, closeModal
} = useUIStore();

// Helper pour toasts
const { success, error, info, warning } = useToast();
success("Message de succès");
error("Erreur: ...");
```

---

## 🎨 Thème Tailwind

### Couleurs personnalisées
- **Primaire** (bleu) : `#3b82f6`
- **Secondaire** (orange) : `#f97316`
- **Accent** (vert) : `#22c55e`

### Utilisation
```tsx
className="bg-primary-600 text-secondary-500"
```

---

## 📱 Responsive Design

- Mobile-first
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Touch targets minimum 44x44px
- Hamburger menu sur mobile

---

## ✅ Pages implémentées

### Public (✓ Complètes)
- [x] Accueil avec hero, voyages en vedette, témoignages
- [x] Listing voyages avec filtres
- [x] Détail voyage
- [x] À propos
- [x] Contact
- [x] Legal (CGV, Confidentialité, Mentions)

### Auth (✓ Complètes)
- [x] Connexion
- [x] Inscription
- [x] Mot de passe oublié

### Client (✓ Complètes)
- [x] Dashboard overview
- [x] Réservations
- [x] Profil
- [x] Documents (placeholder)
- [x] Support (placeholder)

### Pro (✓ Complètes)
- [x] Dashboard overview
- [x] Mes voyages (placeholder)
- [x] Nouveau voyage (placeholder)
- [x] Arrêts (placeholder)
- [x] Documents (placeholder)
- [x] Formation (placeholder)

### Admin (✓ Complètes)
- [x] Dashboard avec KPIs
- [x] Utilisateurs (placeholder)
- [x] Voyages (placeholder)
- [x] Finance (placeholder)
- [x] Support (placeholder)
- [x] Paramètres (placeholder)

### Checkout (✓ Complètes)
- [x] Sélection voyage
- [x] Sélection chambres (placeholder)
- [x] Participants (placeholder)
- [x] Paiement (placeholder)
- [x] Confirmation (placeholder)

---

## 🚀 Démarrage

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Production
npm start

# Formatage
npm run format

# Linting
npm run lint
```

---

## 🔧 Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 📋 Checklist de développement

- [ ] Implémenter API calls réelles (remplacer les mocks)
- [ ] Intégrer Stripe pour les paiements
- [ ] Uploadify pour documents
- [ ] Page 404/500 personnalisées
- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] SEO optimization
- [ ] Analytics (Google Analytics)
- [ ] Monitoring (Sentry)
- [ ] PWA features
- [ ] Dark mode (optionnel)
- [ ] i18n (multilingue si demandé)

---

## 📞 Support

Pour toute question sur l'architecture, consultez :
- `FRONTEND_ARCHITECTURE.md` (ce fichier)
- Code commenté en français
- Structures TypeScript strictes

**Créé le :** 2 mars 2026  
**Dernière mise à jour :** 2 mars 2026
