'use client';

import Link from 'next/link';

/**
 * 404 — Pages d'authentification
 */
export default function AuthNotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#1A1A2E' }}
    >
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔐</div>
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#FAF7F2' }}
        >
          Page introuvable
        </h1>
        <p className="mb-8" style={{ color: 'rgba(250,247,242,0.6)' }}>
          Cette page d'authentification n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/connexion"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-opacity hover:opacity-90"
          style={{ background: '#FF6B35', color: '#fff' }}
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
