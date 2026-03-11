'use client';

/**
 * Error Boundary — Portail Admin
 * Capture les erreurs React côté client dans l'espace admin
 * Design system admin : --admin-* variables
 */

import { useEffect } from 'react';

export default function AdminError({
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
      style={{ backgroundColor: 'var(--admin-bg, #FEFCF3)' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: 'var(--admin-coral-soft, #FFE0E3)' }}
      >
        ⚠️
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'var(--admin-text-primary, #0A1628)', fontFamily: 'var(--font-fraunces, serif)' }}
      >
        Erreur dans le back-office
      </h1>

      <p
        className="mb-6 max-w-md"
        style={{ color: 'var(--admin-text-secondary, #4A5568)' }}
      >
        Une erreur inattendue s&apos;est produite dans l&apos;interface d&apos;administration.
        L&apos;équipe technique a été notifiée.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors"
          style={{
            backgroundColor: 'var(--admin-ocean, #0077B6)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'var(--admin-ocean-deep, #005A8C)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'var(--admin-ocean, #0077B6)';
          }}
        >
          Réessayer
        </button>
        <a
          href="/admin"
          className="px-5 py-2.5 rounded-lg font-medium transition-colors"
          style={{
            border: '1px solid var(--admin-border, rgba(10,22,40,.08))',
            color: 'var(--admin-text-primary, #0A1628)',
          }}
        >
          Retour au dashboard
        </a>
      </div>

      {error.digest && (
        <p
          className="text-xs mt-8"
          style={{ color: 'var(--admin-text-muted, #8896A6)' }}
        >
          Réf. erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
