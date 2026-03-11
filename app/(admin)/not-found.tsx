'use client';

import Link from 'next/link';

/**
 * 404 — Portail Admin (route group root)
 */
export default function AdminGroupNotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      style={{ background: '#F8FAFC' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🛡️</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#0A1628' }}
        >
          Page introuvable
        </h1>
        <p className="text-base mb-8" style={{ color: '#6B7280' }}>
          Cette page du back-office n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#7B2FF7', color: '#fff' }}
          >
            Dashboard Admin
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
