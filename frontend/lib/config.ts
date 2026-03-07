/**
 * Configuration globale de l'application
 * Constantes, URLs, clés, et utilitaires de formatage
 */

// ============= URLs =============

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '';
export const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || '';
export const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'eu-west-1';

// ============= LIMITES =============

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_UPLOAD_RETRIES = 3;

// ============= PAGINATION =============

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// ============= TIMEOUTS =============

export const HOLD_EXPIRY_MINUTES = 15;
export const TOKEN_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
export const API_TIMEOUT_MS = 30000; // 30 secondes

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
};

export const SUCCESS_MESSAGES = {
  LOGGED_IN: 'Connexion réussie',
  LOGGED_OUT: 'Déconnexion réussie',
  ACCOUNT_CREATED: 'Compte créé avec succès',
  PROFILE_UPDATED: 'Profil mis à jour',
  BOOKING_CREATED: 'Réservation créée',
  PAYMENT_SUCCESS: 'Paiement réussi',
  CANCELLED: 'Annulation réussie',
};

// ============= FORMATTERS =============

/**
 * Formate un montant en euros (FR)
 * 1000 centimes → "10,00 €"
 */
export function formatPrice(centimes: number): string {
  const euros = (centimes / 100).toFixed(2);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(centimes / 100);
}

/**
 * Formate une date en français
 * "2026-03-02" → "2 mars 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une date et heure
 * "2026-03-02T14:30:00Z" → "2 mars 2026 à 14h30"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formate une durée en jours
 */
export function formatDuration(days: number): string {
  return `${days} jour${days > 1 ? 's' : ''}`;
}

/**
 * Formate un nom (prénom + nom)
 */
export function formatName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

/**
 * Formate un téléphone français
 * "0612345678" → "06 12 34 56 78"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

/**
 * Valide un format d'email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valide un numéro de téléphone français
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 && cleaned.startsWith('0');
}

/**
 * Formate un statut en français
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmé',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
    PROCESSING: 'En cours de traitement',
    FAILED: 'Échoué',
    DRAFT: 'Brouillon',
    PUBLISHED: 'Publié',
    IN_PROGRESS: 'En cours',
    EXPIRED: 'Expiré',
    HOLD: 'Bloqué',
    REFUNDED: 'Remboursé',
    PARTIALLY_REFUNDED: 'Partiellement remboursé',
    ACTIVE: 'Actif',
    APPROVED: 'Approuvé',
    REJECTED: 'Rejeté',
  };
  return statusMap[status] || status;
}

/**
 * Arrondit un nombre à 2 décimales
 */
export function roundTo2(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * Convertit des centimes en euros
 */
export function centimesToEuros(centimes: number): number {
  return centimes / 100;
}

/**
 * Convertit des euros en centimes
 */
export function eurosToCentimes(euros: number): number {
  return Math.round(euros * 100);
}

// ============= LOCAL STORAGE =============

export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue || null;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch {
    return defaultValue || null;
  }
}

export function setStorageItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde dans localStorage: ${key}`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// ============= DATE UTILITIES =============

/**
 * Ajoute des jours à une date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calcule la différence en jours entre deux dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
}

/**
 * Vérifie si une date est passée
 */
export function isPastDate(dateString: string): boolean {
  return new Date(dateString) < new Date();
}
