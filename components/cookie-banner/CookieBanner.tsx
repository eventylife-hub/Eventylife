'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';

/**
 * CNIL-Compliant Cookie Banner
 *
 * Implements the full consent flow:
 * 1. First layer: Simple banner at bottom with Accept/Refuse/Customize
 * 2. Second layer: Detailed preferences modal
 *
 * CNIL Requirements:
 * - Refuse must be as easy as accept (equal visual prominence)
 * - Must be able to change consent at any time
 * - Consent re-asked every 13 months maximum
 * - No pre-checked optional boxes
 * - No cookie wall (blocking access)
 * - Must inform about purposes before consent
 */
export function CookieBanner() {
  const {
    consent,
    hasConsented,
    isLoading,
    acceptAll,
    refuseAll,
    savePreferences,
  } = useCookieConsent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Show banner only if user hasn't consented yet
   */
  useEffect(() => {
    // Only show after hydration to avoid hydration mismatch
    const timer = setTimeout(() => {
      setIsVisible(!hasConsented);
    }, 100);

    return () => clearTimeout(timer);
  }, [hasConsented]);

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-[9999] animate-in slide-in-from-bottom-4 duration-500"
        role="complementary"
        aria-label="Banneau de consentement aux cookies"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid gap-6 md:grid-cols-[1fr_auto]">
            {/* Content */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Nous utilisons des cookies
              </h2>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience sur
                notre site, analyser le trafic, et personnaliser le contenu.
                Certains cookies sont nécessaires au fonctionnement du site
                (authentification, sécurité), tandis que d'autres sont
                optionnels (analytiques, marketing, fonctionnels).
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400">
                En cliquant sur «&nbsp;Accepter tout&nbsp;», vous acceptez
                l'utilisation de tous les cookies. Vous pouvez à tout moment
                modifier vos préférences.
              </p>
            </div>

            {/* Actions - Responsive Layout */}
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row justify-between items-stretch sm:items-center">
              {/* Refuse Button - CNIL requires equal visual prominence */}
              <button type="button"
                onClick={refuseAll}
                className="px-4 py-3 sm:py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-center sm:text-base text-sm order-2 sm:order-1 md:order-2 lg:order-1"
                aria-label="Refuser tous les cookies optionnels"
              >
                Refuser tout
              </button>

              {/* Customize Link */}
              <button type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-3 sm:py-2 rounded-lg font-medium text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-center sm:text-base text-sm order-3 sm:order-2 md:order-3 lg:order-2"
                aria-label="Personnaliser les préférences de cookies"
              >
                Personnaliser
              </button>

              {/* Accept Button - Green for clear acceptance */}
              <button type="button"
                onClick={acceptAll}
                className="px-4 py-3 sm:py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 text-center sm:text-base text-sm order-1 sm:order-3 md:order-1 lg:order-3"
                aria-label="Accepter tous les cookies"
              >
                Accepter tout
              </button>
            </div>
          </div>

          {/* CNIL Compliance Info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Conformément à la recommandation CNIL, nous vous proposons un
              consentement explicite pour chaque catégorie de cookies. Vous
              pouvez refuser ou modifier vos choix à tout moment.{' '}
              <a
                href="/cookies"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                aria-label="Lire notre politique de cookies"
              >
                Lire notre politique de cookies
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={savePreferences}
        onAcceptAll={acceptAll}
        onRefuseAll={refuseAll}
        initialConsent={consent}
      />

      {/* Spacer to prevent content overlap on mobile */}
      <div className="h-32 sm:h-40 md:h-0" />
    </>
  );
}
