'use client';

/**
 * Page index des villes de départ — SEO local
 * Liste toutes les villes avec lien vers la page dédiée
 */

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  gold: '#D4A853',
  border: '#E5E0D8',
  muted: '#6B7280',
};

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

  const filteredCities = departureCities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.region.toLowerCase().includes(search.toLowerCase())
  );

  // Grouper par région
  const byRegion = filteredCities.reduce((acc, city) => {
    if (!acc[city.region]) acc[city.region] = [];
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, typeof departureCities>);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumb items={[
        { name: 'Accueil', href: '/' },
        { name: 'Villes de départ', href: '/depart' },
      ]} />

      {/* Header */}
      <div className="text-center mb-12">
        <p style={{ color: C.gold, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="mb-3">
          Nos points de départ
        </p>
        <h1 style={{ color: C.navy, fontFamily: 'Playfair, serif', fontSize: '2.25rem', fontWeight: '700' }} className="mb-4">
          Villes de départ
        </h1>
        <p style={{ color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
          Retrouvez tous nos voyages de groupe au départ de votre ville.
          Transport porte-à-porte avec accompagnement personnalisé.
        </p>
      </div>

      {/* Recherche */}
      <div className="mb-10 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Rechercher une ville ou une région..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher une ville de départ"
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: '14px',
            border: `1.5px solid ${C.border}`,
            fontSize: '0.95rem',
            color: C.navy,
            background: 'white',
            outline: 'none',
          }}
        />
      </div>

      {/* Grille par région */}
      {Object.entries(byRegion).sort(([a], [b]) => a.localeCompare(b)).map(([region, cities]) => (
        <div key={region} className="mb-10">
          <h2 style={{ color: C.navy, fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', paddingBottom: '8px', borderBottom: `2px solid ${C.border}` }}>
            {region}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/depart/${city.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: `1.5px solid ${C.border}`,
                  background: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="hover:shadow-md"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.terra;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{city.icon}</span>
                <span style={{ color: C.navy, fontWeight: '600', fontSize: '0.95rem' }}>{city.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* État vide */}
      {filteredCities.length === 0 && (
        <div className="text-center py-16">
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</p>
          <p style={{ color: C.navy, fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>
            Aucune ville trouvée
          </p>
          <p style={{ color: C.muted }}>
            Essayez un autre terme de recherche ou{' '}
            <Link href="/contact" style={{ color: C.terra, fontWeight: '600' }}>
              contactez-nous
            </Link>
          </p>
        </div>
      )}

      {/* CTA */}
      <div
        className="text-center mt-16 py-12 px-8 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${C.navy}, #2D2D4E)` }}
      >
        <h2 style={{ color: '#FAF7F2', fontFamily: 'Playfair, serif', fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>
          Votre ville n&apos;est pas dans la liste ?
        </h2>
        <p style={{ color: 'rgba(250,247,242,0.7)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
          Contactez-nous pour organiser un point de départ personnalisé.
          Notre service porte-à-porte s&apos;adapte à votre localisation.
        </p>
        <Link
          href="/contact"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: '14px',
            background: C.terra,
            color: 'white',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
