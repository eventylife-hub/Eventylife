'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CookieConsent,
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_VERSION,
  COOKIE_CONSENT_MAX_AGE,
} from '@/types/cookie-consent';
import { logger } from '@/lib/logger';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Read consent from cookie
   */
  const readConsent = useCallback((): CookieConsent | null => {
    try {
      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`))
        ?.split('=')[1];

      if (!cookieValue) return null;

      const decoded = decodeURIComponent(cookieValue);
      const parsed: CookieConsent = JSON.parse(decoded);

      // Check if version is outdated - if so, treat as no consent
      if (parsed.version < COOKIE_CONSENT_VERSION) {
        return null;
      }

      return parsed;
    } catch (error) {
      logger.error('Failed to parse consent cookie:', error);
      return null;
    }
  }, []);

  /**
   * Write consent to cookie
   */
  const writeConsent = useCallback((consentData: CookieConsent) => {
    try {
      const cookieValue = encodeURIComponent(JSON.stringify(consentData));
      const expiryDate = new Date();
      expiryDate.setSeconds(
        expiryDate.getSeconds() + COOKIE_CONSENT_MAX_AGE
      );

      document.cookie = `${COOKIE_CONSENT_KEY}=${cookieValue}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;

      return true;
    } catch (error) {
      logger.error('Failed to write consent cookie:', error);
      return false;
    }
  }, []);

  /**
   * Initialize consent state from cookie
   */
  useEffect(() => {
    const storedConsent = readConsent();
    setConsent(storedConsent);
    setHasConsented(storedConsent !== null);
    setIsLoading(false);
  }, [readConsent]);

  /**
   * Accept all categories
   */
  const acceptAll = useCallback(async () => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      consentDate: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };

    writeConsent(newConsent);
    setConsent(newConsent);
    setHasConsented(true);

    // Fire custom event for other components to listen to
    dispatchConsentEvent(newConsent);
  }, [writeConsent]);

  /**
   * Reject all optional categories (keep only necessary)
   */
  const refuseAll = useCallback(() => {
    const newConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      consentDate: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };

    writeConsent(newConsent);
    setConsent(newConsent);
    setHasConsented(true);

    dispatchConsentEvent(newConsent);
  }, [writeConsent]);

  /**
   * Save custom preferences
   */
  const savePreferences = useCallback(
    (preferences: Partial<CookieConsent>) => {
      const currentConsent = consent || {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
        consentDate: new Date().toISOString(),
        version: COOKIE_CONSENT_VERSION,
      };

      const newConsent: CookieConsent = {
        ...currentConsent,
        ...preferences,
        necessary: true, // Always required
        consentDate: new Date().toISOString(),
        version: COOKIE_CONSENT_VERSION,
      };

      writeConsent(newConsent);
      setConsent(newConsent);
      setHasConsented(true);

      dispatchConsentEvent(newConsent);
    },
    [consent, writeConsent]
  );

  /**
   * Reset consent (for testing/debugging)
   * Remove the consent cookie entirely
   */
  const resetConsent = useCallback(() => {
    document.cookie = `${COOKIE_CONSENT_KEY}=; path=/; max-age=0`;
    setConsent(null);
    setHasConsented(false);
  }, []);

  /**
   * Check if a specific category is allowed
   */
  const isAllowed = useCallback(
    (category: 'analytics' | 'marketing' | 'functional' | 'necessary'): boolean => {
      if (!consent) return false;
      if (category === 'necessary') return true;
      return consent[category] === true;
    },
    [consent]
  );

  return {
    consent,
    hasConsented,
    isLoading,
    acceptAll,
    refuseAll,
    savePreferences,
    resetConsent,
    isAllowed,
  };
}

/**
 * Helper function to dispatch consent event
 */
function dispatchConsentEvent(consent: CookieConsent) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cookieConsent', {
        detail: consent,
        bubbles: true,
      })
    );
  }
}
