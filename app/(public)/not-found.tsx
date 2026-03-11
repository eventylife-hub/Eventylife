'use client';

import Link from 'next/link';

/**
 * 404 — Pages publiques
 */
export default function PublicNotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#FAF7F2' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-7xl mb-4">🌅</div>
        <h1
          className="text-4xl font-bold mb-3"
          style={{ color: '#1A1A2E', fontFamily: 'Playfair Display, serif' }}
        >
          Page introuvable
        </h1>
        <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
          Cette page n'existe pas ou a changé d'adresse. Pas d'inquiétude,
          votre prochaine aventure vous attend !
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#C75B39', color: '#fff' }}
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/voyages"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all"
            style={{ border: '1.5px solid #E5E0D8', color: '#1A1A2E' }}
          >
            Découvrir nos voyages
          </Link>
        </div>
      </div>
    </div>
  );
}
