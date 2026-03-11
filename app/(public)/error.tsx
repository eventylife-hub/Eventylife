'use client';

/**
 * Error Boundary — Pages publiques
 * Design client Sun/Ocean V4 avec palette cream/navy/terra
 */

import { useEffect } from 'react';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Public] Erreur capturée :', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: '#FFF8ED' }}
      >
        🌅
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'var(--font-fraunces, serif)' }}
      >
        Page temporairement indisponible
      </h1>

      <p className="mb-6 max-w-md" style={{ color: '#4A5568' }}>
        Nous rencontrons un petit souci technique. Notre équipe est dessus !
        En attendant, vous pouvez explorer nos autres pages.
      </p>

      <div className="flex gap-3">
        <button type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white"
          style={{ backgroundColor: 'var(--terra, #C75B39)' }}
        >
          Réessayer
        </button>
        <a
          href="/"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ border: '1px solid #E2E8F0', color: 'var(--navy, #1A1A2E)' }}
        >
          Retour à l&apos;accueil
        </a>
        <a
          href="/voyages"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ color: 'var(--terra, #C75B39)' }}
        >
          Voir les voyages
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
