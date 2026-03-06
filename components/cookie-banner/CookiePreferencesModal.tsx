'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CookieConsent, COOKIE_CATEGORIES } from '@/types/cookie-consent';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: Partial<CookieConsent>) => void;
  onAcceptAll: () => void;
  onRefuseAll: () => void;
  initialConsent?: CookieConsent | null;
}

export function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
  onAcceptAll,
  onRefuseAll,
  initialConsent,
}: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState({
    analytics: initialConsent?.analytics ?? false,
    marketing: initialConsent?.marketing ?? false,
    functional: initialConsent?.functional ?? false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  /**
   * Focus trap: keep focus within modal when open
   */
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusableRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleToggle = useCallback(
    (category: 'analytics' | 'marketing' | 'functional') => {
      setPreferences((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    },
    []
  );

  const handleSave = useCallback(() => {
    onSave(preferences);
    onClose();
  }, [preferences, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-200 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="cookie-modal-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Gérer vos préférences de cookies
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Personnalisez vos choix de consentement aux cookies
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(100vh-300px)]">
            {/* Necessary Cookies */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-necessary"
                  checked={true}
                  disabled
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 cursor-not-allowed opacity-60"
                  aria-label="Cookies nécessaires (toujours activés)"
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-necessary"
                    className="block font-semibold text-gray-900 dark:text-white cursor-not-allowed"
                  >
                    {COOKIE_CATEGORIES.necessary.label}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {COOKIE_CATEGORIES.necessary.description}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                    Toujours activé
                  </span>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            {/* Analytics Cookies */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={preferences.analytics}
                  onChange={() => handleToggle('analytics')}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label={COOKIE_CATEGORIES.analytics.label}
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-analytics"
                    className="block font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    {COOKIE_CATEGORIES.analytics.label}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {COOKIE_CATEGORIES.analytics.description}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            {/* Marketing Cookies */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-marketing"
                  checked={preferences.marketing}
                  onChange={() => handleToggle('marketing')}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label={COOKIE_CATEGORIES.marketing.label}
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-marketing"
                    className="block font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    {COOKIE_CATEGORIES.marketing.label}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {COOKIE_CATEGORIES.marketing.description}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-6 border-gray-200 dark:border-gray-700" />

            {/* Functional Cookies */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cookie-functional"
                  checked={preferences.functional}
                  onChange={() => handleToggle('functional')}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  aria-label={COOKIE_CATEGORIES.functional.label}
                />
                <div className="flex-1">
                  <label
                    htmlFor="cookie-functional"
                    className="block font-semibold text-gray-900 dark:text-white cursor-pointer"
                  >
                    {COOKIE_CATEGORIES.functional.label}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {COOKIE_CATEGORIES.functional.description}
                  </p>
                </div>
              </div>
            </div>

            {/* CNIL Compliance Notice */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Conformité CNIL :</strong> Vous pouvez modifier vos choix
                à tout moment dans les paramètres de confidentialité. Votre
                consentement sera valable pendant 13 mois maximum.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {/* Secondary Actions */}
              <button
                ref={firstFocusableRef}
                onClick={onRefuseAll}
                className="flex-1 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Refuser tous les cookies optionnels"
              >
                Refuser tout
              </button>

              {/* Primary Actions */}
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Enregistrer mes choix"
              >
                Enregistrer mes choix
              </button>

              <button
                onClick={onAcceptAll}
                className="flex-1 px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label="Accepter tous les cookies"
              >
                Accepter tout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
