'use client';

/**
 * Error Boundary — Checkout / Paiement
 * Message rassurant : aucun prélèvement effectué en cas d'erreur
 */

import { useEffect } from 'react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Checkout] Erreur capturée :', error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
        style={{ backgroundColor: '#FEF2F2' }}
      >
        💳
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'var(--font-fraunces, serif)' }}>
        Erreur lors du paiement
      </h1>

      <p className="mb-2 max-w-md" style={{ color: '#4A5568' }}>
        Un problème technique est survenu pendant le processus de réservation.
      </p>

      <p className="mb-6 max-w-md text-sm font-medium" style={{ color: 'var(--forest, #166534)' }}>
        ✅ Rassurez-vous : aucun paiement n&apos;a été prélevé.
      </p>

      <div className="flex gap-3">
        <button type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-lg font-medium text-white"
          style={{ backgroundColor: 'var(--terra, #C75B39)' }}
        >
          Réessayer le paiement
        </button>
        <a
          href="/client/reservations"
          className="px-5 py-2.5 rounded-lg font-medium"
          style={{ border: '1px solid #E2E8F0', color: 'var(--navy, #1A1A2E)' }}
        >
          Mes réservations
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
