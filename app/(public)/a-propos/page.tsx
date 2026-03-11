'use client';

/**
 * Page À propos — Design Sun/Ocean V4
 */

import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

const values = [
  {
    icon: '❤️',
    title: 'Humain avant tout',
    description:
      'Un accompagnateur dédié de votre porte à votre destination. Vous n\'êtes jamais seul.',
  },
  {
    icon: '🎯',
    title: 'Qualité sans compromis',
    description:
      'Hôtels sélectionnés, restaurants testés, excursions vérifiées. Chaque détail compte.',
  },
  {
    icon: '🌍',
    title: 'Tourisme responsable',
    description:
      'Prestataires locaux, empreinte carbone réduite, respect des communautés visitées.',
  },
  {
    icon: '🤝',
    title: 'Accessibilité',
    description:
      'Des voyages de qualité à prix justes, ouverts à tous, quels que soient l\'âge ou la mobilité.',
  },
];

const stats = [
  { value: '50+', label: 'Destinations', icon: '📍' },
  { value: '10 000+', label: 'Voyageurs accompagnés', icon: '👥' },
  { value: '4.8/5', label: 'Note moyenne', icon: '⭐' },
  { value: '98%', label: 'Taux de satisfaction', icon: '💯' },
];

const timeline = [
  {
    year: '2024',
    title: 'L\'idée naît',
    description: 'Le constat : voyager en groupe manque d\'humain. L\'idée d\'Eventy Life germe.',
  },
  {
    year: '2025',
    title: 'Développement',
    description: 'Conception de la plateforme, premiers tests avec des groupes pilotes.',
  },
  {
    year: '2026',
    title: 'Lancement officiel',
    description: 'Ouverture au public avec 50+ destinations et un réseau de partenaires vérifiés.',
  },
];

export default function AboutPage() {
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
        <div className="mx-auto max-w-6xl text-center">
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
            Qui sommes-nous
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            À propos d&apos;
            <span style={{ color: 'var(--terra, #C75B39)' }}>Eventy Life</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '38rem',
            }}
          >
            Le voyage de groupe réinventé. Avec accompagnement humain,
            de votre porte à votre destination.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'À propos', href: '/a-propos' },
          ]}
        />

        {/* Notre histoire */}
        <section className="mt-10 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="mb-3"
                style={{
                  color: 'var(--gold, #D4A853)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Notre histoire
              </p>
              <h2
                className="text-2xl sm:text-3xl mb-6"
                style={{
                  color: 'var(--navy, #1A1A2E)',
                  fontWeight: '700',
                  fontFamily: 'var(--font-playfair, Playfair Display, serif)',
                }}
              >
                Le client doit se sentir aimé
              </h2>
              <p
                className="text-lg mb-4 leading-relaxed"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                Eventy Life est née d&apos;un constat simple : le voyage en groupe
                manque d&apos;humanité. Trop souvent, les voyageurs se retrouvent
                livrés à eux-mêmes, sans accompagnement réel.
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: '#718096' }}>
                Notre réponse : un accompagnement humain porte-à-porte. Un
                accompagnateur vous attend près de chez vous, voyage avec vous,
                et reste votre référent tout au long du séjour.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#718096' }}>
                Que vous voyagiez seul, en couple ou en famille, vous faites
                partie d&apos;un groupe bienveillant où chacun trouve sa place.
              </p>
            </div>
            <div
              className="aspect-square flex items-center justify-center rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(199,91,57,0.08) 0%, rgba(212,168,83,0.08) 100%)',
              }}
            >
              <span className="text-9xl">✈️</span>
            </div>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="mb-20">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div
                  className="text-2xl sm:text-3xl font-bold mb-1"
                  style={{ color: 'var(--terra, #C75B39)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: '#718096' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <p
              className="mb-3"
              style={{
                color: 'var(--gold, #D4A853)',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Nos convictions
            </p>
            <h2
              className="text-2xl sm:text-3xl"
              style={{
                color: 'var(--navy, #1A1A2E)',
                fontWeight: '700',
                fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              }}
            >
              Nos valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: 'rgba(199,91,57,0.06)' }}
                >
                  {value.icon}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#718096' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <p
              className="mb-3"
              style={{
                color: 'var(--gold, #D4A853)',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Notre parcours
            </p>
            <h2
              className="text-2xl sm:text-3xl"
              style={{
                color: 'var(--navy, #1A1A2E)',
                fontWeight: '700',
                fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              }}
            >
              Les étapes clés
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                {/* Cercle + ligne */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: 'var(--terra, #C75B39)',
                      color: 'white',
                    }}
                  >
                    {step.year}
                  </div>
                  {i < timeline.length - 1 && (
                    <div
                      className="flex-1 w-0.5 mt-2"
                      style={{ background: 'rgba(199,91,57,0.2)' }}
                    />
                  )}
                </div>
                {/* Contenu */}
                <div className="pb-8">
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: 'var(--navy, #1A1A2E)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#718096' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="text-center rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
            padding: '3rem 2rem',
            color: 'white',
          }}
        >
          <h2
            className="text-2xl sm:text-3xl mb-3"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Prêt à rejoindre l&apos;aventure ?
          </h2>
          <p
            className="mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '32rem',
            }}
          >
            Découvrez nos voyages et vivez une expérience unique avec Eventy Life
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/voyages">
              <button type="button"
                className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'white',
                  color: 'var(--terra, #C75B39)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                Découvrir nos voyages
              </button>
            </Link>
            <Link href="/contact">
              <button type="button"
                className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
              >
                Nous contacter
              </button>
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterCTA variant="navy" className="mt-16" />
      </div>
    </div>
  );
}
