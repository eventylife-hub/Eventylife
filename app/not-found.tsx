'use client';

/**
 * Page 404 globale — Design Sun/Ocean V4
 */
import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      {/* Illustration */}
      <div
        className="relative w-32 h-32 rounded-full flex items-center justify-center mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(199,91,57,0.08) 0%, rgba(212,168,83,0.08) 100%)',
        }}
      >
        <span className="text-6xl">🧳</span>
        <div
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background: 'var(--terra, #C75B39)',
            color: 'white',
          }}
        >
          ?
        </div>
      </div>

      {/* Titre */}
      <h1
        className="text-5xl sm:text-6xl font-bold mb-2"
        style={{
          color: 'var(--navy, #1A1A2E)',
          fontFamily: 'var(--font-playfair, Playfair Display, serif)',
        }}
      >
        404
      </h1>
      <h2
        className="text-xl sm:text-2xl font-bold mb-4"
        style={{ color: 'var(--navy, #1A1A2E)' }}
      >
        Page introuvable
      </h2>
      <p
        className="mb-8 max-w-md text-base leading-relaxed"
        style={{ color: '#64748B' }}
      >
        Oups ! Cette page semble avoir pris un autre itinéraire.
        Pas de panique, on vous ramène à bon port.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <button type="button"
            className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--terra, #C75B39)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(199,91,57,0.25)',
            }}
          >
            Retour à l&apos;accueil
          </button>
        </Link>
        <Link href="/voyages">
          <button type="button"
            className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'transparent',
              color: 'var(--navy, #1A1A2E)',
              border: '2px solid rgba(26,26,46,0.15)',
              cursor: 'pointer',
            }}
          >
            Voir nos voyages
          </button>
        </Link>
      </div>

      {/* Liens utiles */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        {[
          { href: '/contact', label: 'Contact' },
          { href: '/faq', label: 'FAQ' },
          { href: '/blog', label: 'Blog' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: '#64748B' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.target as HTMLElement).style.color = '#C75B39';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.target as HTMLElement).style.color = '#64748B';
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
