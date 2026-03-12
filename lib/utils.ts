/**
 * Utilitaires et helpers pour Eventy Life
 */

export type ClassNameValue = string | undefined | null | false;

/**
 * Combine les classe CSS avec support de Tailwind
 */
export function cn(...classes: ClassNameValue[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formate un montant en centimes au format EUR
 * @param centimes Montant en centimes
 * @returns Chaîne formatée "12,50 €"
 */
export function formatPrice(centimes: number): string {
  const euros = (centimes / 100).toFixed(2);
  return euros.replace('.', ',') + ' €';
}

/**
 * Formate un montant en centimes à la devise EUR
 * @param amountInCents Montant en centimes
 * @returns Chaîne formatée avec devise EUR
 */
export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amountInCents / 100);
}

/**
 * Formate une date au format français
 * @param dateString Date ISO, string, ou objet Date
 * @returns Date formatée "2 mars 2026"
 */
export function formatDate(dateString: string | Date): string {
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Europe/Paris'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch {
    return String(dateString);
  }
}

/**
 * Formate une date et heure au format français
 * @param dateString Date ISO, string, ou objet Date
 * @returns Date/heure formatée "2 mars 2026 à 14:30"
 */
export function formatDateTime(dateString: string | Date): string {
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch {
    return String(dateString);
  }
}

/**
 * Tronque une chaîne à une longueur maximale
 * @param str Chaîne à tronquer
 * @param max Longueur maximale
 * @returns Chaîne tronquée avec ellipse
 */
export function truncate(str: string, max: number): string {
  return str.length > max ? str.substring(0, max) + '...' : str;
}

/**
 * Extrait le domaine d'une URL email
 */
export function getEmailDomain(email: string): string {
  return email.split('@')[1] || '';
}

/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Génère une couleur hex aléatoire
 */
export function getRandomColor(): string {
  const colors = ['#3b82f6', '#f97316', '#10b981', '#f43f5e', '#8b5cf6', '#ec4899'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor ?? (colors[0] as string);
}

/**
 * Initialise les initiales d'une personne
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
}

/**
 * Formatte le nombre de places disponibles
 */
export function formatCapacity(current: number, total: number): string {
  const available = total - current;
  if (available <= 0) return 'Complet';
  if (available === 1) return '1 place restante';
  return `${available} places restantes`;
}

/**
 * Récupère l'initiale d'une URL de fichier pour afficher une icône
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop() || 'fichier';
}

/**
 * Formate un numéro SIRET
 */
export function formatSiret(siret: string): string {
  return siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
}

/**
 * Calcule l'âge d'une personne
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Convertit une chaîne en slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

/**
 * Ajoute des points de suspension au centre d'une chaîne
 */
export function ellipsis(str: string, start: number, end: number): string {
  if (str.length <= start + end) return str;
  return str.substring(0, start) + '...' + str.substring(str.length - end);
}

/**
 * Formate un nombre avec séparateurs
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

// ============= FORMATTERS SUPPLÉMENTAIRES =============

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

// ============= CONVERSIONS MONÉTAIRES =============

/**
 * Convertit des centimes en euros
 */
export function centimesToEuros(centimes: number): number {
  return centimes / 100;
}

/**
 * Convertit des euros en centimes (arrondi entier)
 */
export function eurosToCentimes(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Arrondit un nombre à 2 décimales
 */
export function roundTo2(num: number): number {
  return Math.round(num * 100) / 100;
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

// ============= LOCAL STORAGE (SSR-safe) =============

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
  } catch {
    // Silently fail — localStorage plein ou indisponible
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
