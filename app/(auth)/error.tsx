'use client';

/**
 * Error Boundary — Pages d'authentification
 * Design minimal navy pour login/inscription
 */

import { useEffect } from 'react';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Auth] Erreur capturée :', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
        style={{ backgroundColor: '#FEF2F2' }}
      >
        🔒
      </div>

      <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
        Erreur de connexion
      </h1>

      <p className="mb-5 max-w-sm text-sm" style={{ color: '#4A5568' }}>
        Un problème est survenu lors de l&apos;authentification.
        Veuillez réessayer.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white text-sm"
          style={{ backgroundColor: 'var(--navy, #1A1A2E)' }}
        >
          Réessayer
        </button>
        <a
          href="/connexion"
          className="px-5 py-2.5 rounded-lg font-medium text-sm"
          style={{ border: '1px solid #E2E8F0', color: 'var(--navy, #1A1A2E)' }}
        >
          Page de connexion
        </a>
      </div>
    </div>
  );
}
