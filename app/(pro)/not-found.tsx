'use client';

import Link from 'next/link';

/**
 * 404 — Portail Pro (route group root)
 */
export default function ProGroupNotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      style={{ background: '#F8FAFC' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🏢</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#0A1628' }}
        >
          Page introuvable
        </h1>
        <p className="text-base mb-8" style={{ color: '#6B7280' }}>
          Cette page de votre espace professionnel n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pro/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#FF6B35', color: '#fff' }}
          >
            Dashboard Pro
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-all"
            style={{ border: '1.5px solid #E5E0D8', color: '#0A1628' }}
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
