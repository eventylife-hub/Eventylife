'use client';

/**
 * Error Boundary — Portail Pro
 * Capture les erreurs React côté client dans l'espace professionnel
 * Design system pro : --pro-* variables
 */

import { useEffect } from 'react';

export default function ProError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Pro] Erreur capturée :', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: 'var(--pro-bg, #FEFCF3)' }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: 'var(--pro-coral-soft, #FFE0E3)' }}
      >
        ⚠️
      </div>

      <h1
        className="text-2xl font-bold mb-2"
        style={{ color: 'var(--pro-text-primary, #0A1628)', fontFamily: 'var(--font-fraunces, serif)' }}
      >
        Erreur dans l&apos;espace professionnel
      </h1>

      <p
        className="mb-6 max-w-md"
        style={{ color: 'var(--pro-text-secondary, #4A5568)' }}
      >
        Une erreur inattendue s&apos;est produite. Notre équipe a été informée
        et travaille à résoudre le problème.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors"
          style={{
            backgroundColor: 'var(--pro-sun, #FF6B35)',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'var(--pro-sun-hover, #E85A25)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = 'var(--pro-sun, #FF6B35)';
          }}
        >
          Réessayer
        </button>
        <a
          href="/pro"
          className="px-5 py-2.5 rounded-lg font-medium transition-colors"
          style={{
            border: '1px solid var(--pro-border, rgba(10,22,40,.08))',
            color: 'var(--pro-text-primary, #0A1628)',
          }}
        >
          Retour au dashboard
        </a>
      </div>

      {error.digest && (
        <p
          className="text-xs mt-8"
          style={{ color: 'var(--pro-text-muted, #8896A6)' }}
        >
          Réf. erreur : {error.digest}
        </p>
      )}
    </div>
  );
}
