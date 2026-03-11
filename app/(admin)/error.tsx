'use client';

/**
 * Error Boundary — Portail Admin (route group root)
 * Attrape les erreurs avant qu'elles remontent au error.tsx global
 */

import { useEffect } from 'react';

export default function AdminGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Admin] Erreur capturée :', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: '#EEF2FF' }}
      >
        🛡️
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: '#0A1628' }}
      >
        Erreur sur l&apos;espace Admin
      </h1>

      <p className="mb-6 max-w-md" style={{ color: '#4A5568' }}>
        Le back-office a rencontré un problème technique.
        L&apos;intégrité des données n&apos;est pas affectée.
      </p>

      <div className="flex gap-3">
        <button type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#7B2FF7' }}
        >
          Réessayer
        </button>
        <a
          href="/admin/dashboard"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ border: '1px solid #E2E8F0', color: '#0A1628' }}
        >
          Dashboard Admin
        </a>
      </div>

      {error.digest && (
        <p className="text-xs mt-8" style={{ color: '#A0AEC0' }}>
          Réf. erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
