'use client';

import Link from 'next/link';

/**
 * 404 — Portail Client (route group root)
 */
export default function ClientGroupNotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      style={{ background: 'var(--cream, #FAF7F2)' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🧳</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'var(--font-fraunces, serif)' }}
        >
          Page introuvable
        </h1>
        <p className="text-base mb-8" style={{ color: '#6B7280' }}>
          Cette page de votre espace client n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
          >
            Mon tableau de bord
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all"
            style={{ border: '1.5px solid #E5E0D8', color: 'var(--navy, #1A1A2E)' }}
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
