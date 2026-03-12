/**
 * Constantes de l'application Eventy Life
 */

/**
 * Routes de l'application
 */
export const ROUTES = {
  // Public
  HOME: '/',
  VOYAGES: '/voyages',
  VOYAGE_DETAIL: (slug: string) => `/voyages/${slug}`,
  ABOUT: '/a-propos',
  CONTACT: '/contact',
  LEGAL: {
    CGV: '/cgv',
    CONFIDENTIALITE: '/confidentialite',
    MENTIONS: '/mentions-legales'
  },

  // Authentification
  AUTH: {
    CONNEXION: '/auth/connexion',
    INSCRIPTION: '/auth/inscription',
    FORGOT_PASSWORD: '/auth/mot-de-passe-oublie',
    RESET_PASSWORD: (token: string) => `/auth/reinitialiser-mot-de-passe/${token}`,
    VERIFY_EMAIL: (token: string) => `/auth/verifier-email/${token}`
  },

  // Client
  CLIENT: {
    DASHBOARD: '/client',
    RESERVATIONS: '/client/reservations',
    PROFIL: '/client/profil',
    DOCUMENTS: '/client/documents',
    SUPPORT: '/client/support'
  },

  // Pro
  PRO: {
    DASHBOARD: '/pro',
    VOYAGES: '/pro/voyages',
    VOYAGES_NEW: '/pro/voyages/nouveau',
    VOYAGES_EDIT: (id: string) => `/pro/voyages/${id}/editer`,
    STOPS: '/pro/arrets',
    DOCUMENTS: '/pro/documents',
    FORMATION: '/pro/formation'
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin',
    UTILISATEURS: '/admin/utilisateurs',
    UTILISATEURS_DETAIL: (id: string) => `/admin/utilisateurs/${id}`,
    VOYAGES: '/admin/voyages',
    FINANCE: '/admin/finance',
    SUPPORT: '/admin/support',
    SETTINGS: '/admin/parametres'
  },

  // Checkout
  CHECKOUT: {
    START: '/checkout/start',
    STEP_1: '/checkout/step-1',
    STEP_2: '/checkout/step-2',
    STEP_3: '/checkout/step-3',
    CONFIRMATION: '/checkout/confirmation'
  }
};

/**
 * Libellés des statuts de réservation
 */
export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
  COMPLETED: 'Complétée'
};

/**
 * Libellés des statuts de voyage
 */
export const TRAVEL_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  CANCELLED: 'Annulé',
  ARCHIVED: 'Archivé'
};

/**
 * Libellés des statuts de validation PRO
 */
export const PRO_VALIDATION_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté'
};

/**
 * Types de chambres
 */
export const ROOM_TYPES: Record<string, string> = {
  SINGLE: 'Chambre simple',
  DOUBLE: 'Chambre double',
  TRIPLE: 'Chambre triple',
  QUAD: 'Chambre quadruple'
};

/**
 * Rôles utilisateur
 */
export const USER_ROLES: Record<string, string> = {
  CLIENT: 'Client',
  PRO: 'Guide de voyage',
  ADMIN: 'Administrateur'
};

/**
 * Messages d'erreur
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Erreur réseau. Vérifiez votre connexion.',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à accéder à cette ressource.',
  FORBIDDEN: 'Accès refusé.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION: 'Erreur de validation. Vérifiez vos données.',
  SERVER: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNKNOWN: 'Une erreur est survenue. Veuillez réessayer.',
  LOGIN_REQUIRED: 'Vous devez être connecté pour continuer.',
  ROLE_REQUIRED: 'Accès réservé aux %s.'
};

/**
 * Messages de succès
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie!',
  REGISTER: 'Inscription réussie! Veuillez vérifier votre email.',
  LOGOUT: 'Déconnexion réussie.',
  UPDATE: 'Mise à jour réussie.',
  DELETE: 'Suppression réussie.',
  CREATE: 'Création réussie.',
  EMAIL_SENT: 'Email envoyé avec succès.'
};

/**
 * Limites de l'application
 */
export const LIMITS = {
  PAGE_SIZE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  MAX_UPLOAD_FILES: 5,
  PASSWORD_MIN_LENGTH: 8,
  SEARCH_DEBOUNCE: 300
};

/**
 * Cookies
 * Les tokens sont gérés par le serveur via des cookies httpOnly sécurisés
 */
export const COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'userPreferences'
};

/**
 * Clés localStorage
 * AUTH_TOKEN n'est plus utilisée car les tokens sont gérés par cookies httpOnly côté serveur
 */
export const STORAGE_KEYS = {
  USER: 'eventy_user',
  UI_STATE: 'eventy_ui_state',
  PREFERENCES: 'eventy_preferences'
};

/**
 * Délai d'expiration de la session (en millisecondes)
 */
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',

  // Travels
  TRAVELS: '/travels',
  TRAVEL_DETAIL: (id: string) => `/travels/${id}`,
  TRAVELS_BY_PRO: (proId: string) => `/travels/pro/${proId}`,

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
  BOOKINGS_CLIENT: '/bookings/client',

  // Users
  USERS: '/users',
  USER_PROFILE: (id: string) => `/users/${id}`,
  USER_UPDATE_PROFILE: '/users/profile',
  USER_AVATAR: '/users/avatar',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_UPLOAD: '/documents/upload',
  DOCUMENT_DELETE: (id: string) => `/documents/${id}`,

  // Stops
  STOPS: '/stops',
  STOP_DETAIL: (id: string) => `/stops/${id}`,

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_INTENT: '/payments/create-intent',
  PAYMENT_CONFIRM: (id: string) => `/payments/${id}/confirm`,

  // Pro
  PRO_VALIDATION: '/pro/validation',
  PRO_PROFILE: '/pro/profile',

  // Admin
  ADMIN_STATS: '/admin/stats',
  ADMIN_USERS: '/admin/users',
  ADMIN_TRAVELS: '/admin/travels',
  ADMIN_BOOKINGS: '/admin/bookings'
};

/**
 * Configuration Stripe (à définir via env)
 */
export const STRIPE_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  API_VERSION: '2024-06-20'
};

/**
 * Configuration API
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

/**
 * Jours fériés français
 */
export const FRENCH_HOLIDAYS = [
  '0101', // 1er janvier
  '0405', // Lundi de Pâques
  '0501', // 1er mai
  '0508', // 8 mai
  '0914', // Ascension
  '0925', // Pentecôte
  '0714', // 14 juillet
  '0815', // 15 août
  '1101', // 1er novembre
  '1111', // 11 novembre
  '1225'  // 25 décembre
];
