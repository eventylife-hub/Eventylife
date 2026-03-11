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
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
      style={{ backgroundColor: '#FAF7F2' }}
    >
      <div className="text-7xl mb-6">⚠️</div>
      <h1
        className="text-3xl font-bold mb-3"
        style={{ color: '#1A1A2E' }}
      >
        Oups, une erreur est survenue
      </h1>
      <p className="mb-8 max-w-md" style={{ color: '#6B7280' }}>
        Nous sommes désolés, quelque chose s&#39;est mal passé.
        Vous pouvez réessayer ou revenir à l&#39;accueil.
      </p>

      <div className="flex gap-4">
        <button type="button"
          onClick={reset}
          className="px-6 py-3 text-white rounded-xl font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#C75B39' }}
        >
          Réessayer
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-xl font-semibold transition-colors"
          style={{ border: '1.5px solid #E5E0D8', color: '#1A1A2E', backgroundColor: 'white' }}
        >
          Retour à l&#39;accueil
        </a>
      </div>

      {/* Digest pour le support technique */}
      {error.digest && (
        <p className="text-xs mt-8" style={{ color: '#6B7280' }}>
          Référence erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
