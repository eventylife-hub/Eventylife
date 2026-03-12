/**
 * Configuration et constantes globales de l'application Eventy Life
 *
 * Les utilitaires de formatage sont dans lib/utils.ts
 * Ce fichier contient UNIQUEMENT les constantes de configuration.
 */

// ============= URLs =============

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eventylife.fr';
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
export const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || '';
export const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'eu-west-1';

// ============= LIMITES =============

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const MAX_UPLOAD_RETRIES = 3;

// ============= PAGINATION =============

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// ============= TIMEOUTS =============

export const HOLD_EXPIRY_MINUTES = 15;
export const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 min
export const API_TIMEOUT_MS = 30_000; // 30 sec

// ============= MESSAGES =============

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur réseau. Veuillez vérifier votre connexion.',
  AUTH_ERROR: 'Authentification échouée. Veuillez vous reconnecter.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION_ERROR: 'Validation échouée. Veuillez vérifier vos données.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  PAYMENT_ERROR: 'Erreur de paiement. Veuillez réessayer.',
  UNSUPPORTED_FILE: 'Type de fichier non supporté.',
  FILE_TOO_LARGE: 'Fichier trop volumineux.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGGED_IN: 'Connexion réussie',
  LOGGED_OUT: 'Déconnexion réussie',
  ACCOUNT_CREATED: 'Compte créé avec succès',
  PROFILE_UPDATED: 'Profil mis à jour',
  BOOKING_CREATED: 'Réservation créée',
  PAYMENT_SUCCESS: 'Paiement réussi',
  CANCELLED: 'Annulation réussie',
} as const;
