'use client';

import Link from 'next/link';

/**
 * 404 — Pages de checkout / réservation
 */
export default function CheckoutNotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#FAF7F2' }}
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🛒</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#1A1A2E', fontFamily: 'Playfair Display, serif' }}
        >
          Étape introuvable
        </h1>
        <p className="mb-6" style={{ color: '#6B7280' }}>
          Cette étape de réservation n'existe pas. Votre panier et vos données sont en sécurité.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/voyages"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#C75B39', color: '#fff' }}
          >
            Voir nos voyages
          </Link>
          <Link
            href="/client/reservations"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all"
            style={{ border: '1.5px solid #E5E0D8', color: '#1A1A2E' }}
          >
            Mes réservations
          </Link>
        </div>
      </div>
    </div>
  );
}
