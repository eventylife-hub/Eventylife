'use client';

/**
 * Error Boundary global — Eventy Life
 * Capture les erreurs React côté client pour éviter un crash total
 * Affiche un message convivial avec option de relance
 */

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Envoyer l'erreur à Sentry en production
    Sentry.captureException(error, {
      contexts: {
        errorBoundary: {
          digest: error.digest || 'non disponible',
          componentStack: 'GlobalError boundary',
        },
      },
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="text-7xl mb-6">⚠️</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Une erreur est survenue
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Nous sommes désolés, quelque chose s'est mal passé. Vous pouvez
        réessayer ou revenir à l'accueil.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Retour à l'accueil
        </a>
      </div>

      {/* Digest pour le support technique */}
      {error.digest && (
        <p className="text-xs text-gray-400 mt-8">
          Référence erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
