'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

const brochures = [
  {
    title: 'Catalogue Printemps-Été 2026',
    desc: 'Toutes nos destinations pour la saison : Maroc, Andalousie, Tunisie, Italie et bien plus.',
    pages: '48 pages',
    icon: '☀',
  },
  {
    title: 'Spécial Week-ends',
    desc: 'Nos week-ends thématiques : gastronomie, bien-être, culture, aventure.',
    pages: '24 pages',
    icon: '🎉',
  },
  {
    title: 'Guide du Voyageur',
    desc: 'Tout ce que vous devez savoir avant de partir : préparation, bagages, documents.',
    pages: '16 pages',
    icon: '📖',
  },
];

export default function BrochurePage() {
  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="mb-4"
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Catalogue
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Nos <span style={{ color: 'var(--terra, #C75B39)' }}>Brochures</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Découvrez nos destinations et formules de voyages en groupe.
            Téléchargez nos brochures gratuitement.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Brochure', href: '/brochure' },
          ]}
        />

        {/* Brochures disponibles */}
        <div className="space-y-6 mt-8 mb-16">
          {brochures.map((b, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start gap-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                padding: '2rem',
              }}
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, var(--terra, #C75B39), var(--terra-light, #D97B5E))',
                  color: 'white',
                }}
              >
                {b.icon}
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {b.title}
                </h2>
                <p className="text-sm mb-2" style={{ color: '#6B7280' }}>
                  {b.desc}
                </p>
                <span className="text-xs" style={{ color: '#6B7280' }}>
                  {b.pages} — PDF
                </span>
              </div>
              <button type="button"
                className="rounded-xl font-bold text-sm transition-all duration-200 sm:self-center"
                style={{
                  backgroundColor: 'var(--terra, #C75B39)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(199,91,57,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(199,91,57,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(199,91,57,0.2)';
                }}
              >
                Télécharger
              </button>
            </div>
          ))}
        </div>

        {/* Demande brochure par email — composant réutilisable */}
        <NewsletterCTA
          variant="navy"
          subtitle="Par email"
          title="Recevez la brochure par email"
          description="Entrez votre email pour recevoir notre catalogue complet directement dans votre boîte mail."
          className="mb-12"
        />

        {/* Retour voyages */}
        <div className="text-center">
          <Link
            href="/voyages"
            className="font-bold text-sm transition-colors duration-200"
            style={{
              color: 'var(--terra, #C75B39)',
              textDecoration: 'none',
            }}
          >
            ← Voir tous nos voyages
          </Link>
        </div>
      </div>
    </div>
  );
}
