'use client';

/**
 * Page index des villes de départ — SEO local
 * Liste toutes les villes avec lien vers la page dédiée
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

/** Villes de départ principales — à terme depuis l'API */
const departureCities = [
  { slug: 'bordeaux', name: 'Bordeaux', region: 'Nouvelle-Aquitaine', icon: '🍷' },
  { slug: 'paris', name: 'Paris', region: 'Île-de-France', icon: '🗼' },
  { slug: 'lyon', name: 'Lyon', region: 'Auvergne-Rhône-Alpes', icon: '🦁' },
  { slug: 'marseille', name: 'Marseille', region: 'Provence-Alpes-Côte d\'Azur', icon: '⛵' },
  { slug: 'toulouse', name: 'Toulouse', region: 'Occitanie', icon: '🌹' },
  { slug: 'nantes', name: 'Nantes', region: 'Pays de la Loire', icon: '🐘' },
  { slug: 'strasbourg', name: 'Strasbourg', region: 'Grand Est', icon: '🏰' },
  { slug: 'montpellier', name: 'Montpellier', region: 'Occitanie', icon: '☀️' },
  { slug: 'nice', name: 'Nice', region: 'Provence-Alpes-Côte d\'Azur', icon: '🌊' },
  { slug: 'lille', name: 'Lille', region: 'Hauts-de-France', icon: '🏛️' },
  { slug: 'rennes', name: 'Rennes', region: 'Bretagne', icon: '🪨' },
  { slug: 'limoges', name: 'Limoges', region: 'Nouvelle-Aquitaine', icon: '🏺' },
  { slug: 'arcachon', name: 'Arcachon', region: 'Nouvelle-Aquitaine', icon: '🦪' },
  { slug: 'libourne', name: 'Libourne', region: 'Nouvelle-Aquitaine', icon: '🏡' },
  { slug: 'perigueux', name: 'Périgueux', region: 'Nouvelle-Aquitaine', icon: '🏰' },
  { slug: 'agen', name: 'Agen', region: 'Nouvelle-Aquitaine', icon: '🫒' },
  { slug: 'bayonne', name: 'Bayonne', region: 'Nouvelle-Aquitaine', icon: '🌶️' },
  { slug: 'pau', name: 'Pau', region: 'Nouvelle-Aquitaine', icon: '⛰️' },
  { slug: 'biarritz', name: 'Biarritz', region: 'Nouvelle-Aquitaine', icon: '🏄' },
  { slug: 'la-rochelle', name: 'La Rochelle', region: 'Nouvelle-Aquitaine', icon: '⚓' },
];

export default function DepartIndexPage() {
  const [search, setSearch] = useState('');

  const filteredCities = useMemo(
    () =>
      departureCities.filter(
        (city) =>
          city.name.toLowerCase().includes(search.toLowerCase()) ||
          city.region.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  // Grouper par région
  const byRegion = useMemo(() => {
    return filteredCities.reduce(
      (acc, city) => {
        if (!acc[city.region]) acc[city.region] = [];
        acc[city.region].push(city);
        return acc;
      },
      {} as Record<string, typeof departureCities>,
    );
  }, [filteredCities]);

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero V4 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem 4rem',
        }}
      >
        <div className="mx-auto max-w-5xl text-center">
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
            Nos points de départ
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Villes de{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>départ</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Retrouvez tous nos voyages de groupe au départ de votre ville.
            Transport porte-à-porte avec accompagnement personnalisé.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Villes de départ', href: '/depart' },
          ]}
        />

        {/* Recherche */}
        <div className="mb-10 mt-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher une ville ou une région..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher une ville de départ"
            className="w-full text-sm"
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1.5px solid #E5E0D8',
              color: 'var(--navy, #1A1A2E)',
              background: 'white',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(199,91,57,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E5E0D8';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Compteur */}
        <p
          className="text-center mb-8"
          style={{ color: '#718096', fontSize: '0.875rem' }}
        >
          {filteredCities.length} ville{filteredCities.length !== 1 ? 's' : ''}
          {search && (
            <>
              {' '}pour «{' '}
              <strong style={{ color: 'var(--terra, #C75B39)' }}>{search}</strong>{' '}
              »
            </>
          )}
        </p>

        {/* Grille par région */}
        {Object.entries(byRegion)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([region, cities]) => (
            <div key={region} className="mb-10">
              <h2
                className="text-lg font-bold mb-4 pb-2"
                style={{
                  color: 'var(--navy, #1A1A2E)',
                  borderBottom: '2px solid #E5E0D8',
                }}
              >
                {region}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/depart/${city.slug}`}
                    className="flex items-center gap-3 rounded-xl transition-all duration-200 hover:-translate-y-1"
                    style={{
                      padding: '14px 18px',
                      border: '1px solid rgba(26,26,46,0.08)',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,46,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(26,26,46,0.08)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,26,46,0.04)';
                    }}
                  >
                    <span className="text-xl">{city.icon}</span>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: 'var(--navy, #1A1A2E)' }}
                    >
                      {city.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        {/* État vide */}
        {filteredCities.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: 'rgba(199,91,57,0.08)' }}
            >
              🔍
            </div>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Aucune ville trouvée
            </p>
            <p style={{ color: '#6B7280' }}>
              Essayez un autre terme de recherche ou{' '}
              <Link
                href="/contact"
                className="font-semibold"
                style={{ color: 'var(--terra, #C75B39)', textDecoration: 'none' }}
              >
                contactez-nous
              </Link>
            </p>
          </div>
        )}

        {/* CTA */}
        <div
          className="text-center mt-16 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
            padding: '3rem 2rem',
            color: 'white',
          }}
        >
          <h2
            className="text-xl sm:text-2xl mb-3"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Votre ville n&apos;est pas dans la liste ?
          </h2>
          <p
            className="mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '32rem',
            }}
          >
            Contactez-nous pour organiser un point de départ personnalisé.
            Notre service porte-à-porte s&apos;adapte à votre localisation.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-xl font-bold transition-all duration-200"
            style={{
              backgroundColor: 'var(--terra, #C75B39)',
              color: 'white',
              padding: '0.875rem 2rem',
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(199,91,57,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Nous contacter
          </Link>
        </div>

        {/* Newsletter */}
        <NewsletterCTA variant="navy" className="mt-16" />
      </div>
    </div>
  );
}
