'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useConsentStore } from '@/stores/consent-store';

export function CookieBanner() {
  const [isClient, setIsClient] = useState(false);
  const { consent, setConsent } = useConsentStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Ne pas afficher si consentement déjà enregistré
  if (consent) {
    return null;
  }

  const handleAcceptAll = () => {
    setConsent('accepted');
  };

  const handleRefuse = () => {
    setConsent('refused');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Message */}
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <strong>Politique de cookies</strong> : Ce site utilise des cookies
              pour améliorer votre expérience, analyser le trafic et afficher des
              publicités personnalisées. En continuant à naviguer, vous acceptez
              notre utilisation des cookies.{' '}
              <Link
                href="/politique-confidentialite"
                className="font-medium text-blue-600 hover:underline"
              >
                En savoir plus
              </Link>
            </p>
          </div>

          {/* Boutons */}
          <div className="flex flex-shrink-0 gap-3">
            <button
              onClick={handleRefuse}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Refuser
            </button>

            <Link
              href="/cookies"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Personnaliser
            </Link>

            <button
              onClick={handleAcceptAll}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Accepter tout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
