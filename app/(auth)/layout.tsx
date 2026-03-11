/**
 * Layout pages d'authentification — Design Eventy V4
 * Fond navy avec orbe décoratif, centré, ambiance premium
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentification | Eventy Life',
  description:
    'Connectez-vous ou créez un compte pour accéder à votre espace Eventy Life — voyages de groupe avec accompagnement.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#1A1A2E' }}
    >
      {/* Orbes décoratifs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FF6B35 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #0077B6 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-0 mb-8 relative z-10"
        aria-label="Retour à l'accueil Eventy Life"
      >
        <span
          className="font-display text-2xl font-bold tracking-tight"
          style={{ color: '#FAF7F2' }}
        >
          Eventy
        </span>
        <span
          className="font-display text-2xl font-bold"
          style={{ color: '#D4A853' }}
        >
          .
        </span>
        <span
          className="font-display text-2xl font-bold tracking-tight"
          style={{ color: '#FAF7F2' }}
        >
          Life
        </span>
      </Link>

      {/* Contenu auth */}
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>

      {/* Lien retour */}
      <p className="mt-8 text-sm relative z-10" style={{ color: 'rgba(250,247,242,0.4)' }}>
        <Link
          href="/"
          className="hover:underline transition-colors"
          style={{ color: 'rgba(250,247,242,0.6)' }}
        >
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
