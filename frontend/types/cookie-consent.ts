/**
 * CNIL-Compliant Cookie Consent Types
 * 
 * Implements compliance with:
 * - CNIL (French Data Protection Authority) guidelines
 * - GDPR requirements for consent management
 * - ePrivacy Directive (2002/58/EC)
 */

export interface CookieConsent {
  necessary: true; // Always required, cannot be disabled
  analytics: boolean; // Google Analytics, performance metrics
  marketing: boolean; // Advertising, remarketing, tracking pixels
  functional: boolean; // User preferences, language, theme settings
  consentDate: string; // ISO 8601 timestamp of consent
  version: number; // Consent version for re-consent tracking
}

/**
 * Consent version - increment this when cookie consent requirements change
 * This forces users to re-consent
 */
export const COOKIE_CONSENT_VERSION = 1;

/**
 * Key for storing consent cookie in browser
 */
export const COOKIE_CONSENT_KEY = 'eventy_cookie_consent';

/**
 * Max age for consent cookie: 13 months (CNIL maximum)
 * 13 months * 30 days * 24 hours * 60 minutes * 60 seconds
 */
export const COOKIE_CONSENT_MAX_AGE = 13 * 30 * 24 * 60 * 60; // ~11,664,000 seconds

/**
 * Cookie consent categories with descriptions (in French for CNIL compliance)
 */
export const COOKIE_CATEGORIES = {
  necessary: {
    label: 'Cookies Nécessaires',
    description: 'Indispensables au fonctionnement du site. Authentification, sécurité CSRF, préférences de session.',
    required: true,
  },
  analytics: {
    label: 'Cookies Analytiques',
    description: 'Analyse du trafic et du comportement utilisateur pour améliorer nos services.',
    required: false,
  },
  marketing: {
    label: 'Cookies Marketing',
    description: 'Publicités ciblées et remarketing basés sur vos intérêts et comportements.',
    required: false,
  },
  functional: {
    label: 'Cookies Fonctionnels',
    description: 'Mémorisation de vos préférences: langue, thème, paramètres d\'affichage.',
    required: false,
  },
} as const;

/**
 * Custom event fired when consent is provided
 * Listen with: window.addEventListener('cookieConsent', handler)
 */
export interface CookieConsentEvent extends CustomEvent {
  detail: CookieConsent;
}
