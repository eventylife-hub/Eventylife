'use client';

/**
 * Error Boundary — Portail Pro (route group root)
 * Attrape les erreurs avant qu'elles remontent au error.tsx global
 */

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function ProGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('[Pro] Erreur capturée', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: '#FFF7ED' }}
      >
        🏢
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: '#0A1628' }}
      >
        Erreur sur l&apos;espace Pro
      </h1>

      <p className="mb-6 max-w-md" style={{ color: '#4A5568' }}>
        Un problème technique est survenu sur votre espace professionnel.
        Vos données sont intactes, réessayez dans un instant.
      </p>

      <div className="flex gap-3">
        <button type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#FF6B35' }}
        >
          Réessayer
        </button>
        <a
          href="/pro/dashboard"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ border: '1px solid #E2E8F0', color: '#0A1628' }}
        >
          Dashboard Pro
        </a>
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ color: '#FF6B35' }}
        >
          Accueil
        </a>
      </div>

      {error.digest && (
        <p className="text-xs mt-8" style={{ color: '#6B7280' }}>
          Réf. erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
