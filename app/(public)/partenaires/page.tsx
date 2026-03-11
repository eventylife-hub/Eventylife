'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';

const avantages = [
  {
    icon: '📈',
    title: 'Visibilité accrue',
    desc: 'Accédez à des milliers de voyageurs actifs chaque mois via notre plateforme.',
  },
  {
    icon: '💰',
    title: 'Revenus supplémentaires',
    desc: 'Remplissez vos capacités avec des groupes réguliers toute l\u2019année.',
  },
  {
    icon: '🤝',
    title: 'Accompagnement dédié',
    desc: 'Un chargé de compte personnel pour optimiser votre partenariat.',
  },
  {
    icon: '📊',
    title: 'Dashboard pro',
    desc: 'Suivez vos réservations, revenus et avis clients en temps réel.',
  },
  {
    icon: '⭐',
    title: 'Avis vérifiés',
    desc: 'Bénéficiez de retours clients authentiques pour améliorer votre offre.',
  },
  {
    icon: '🚀',
    title: 'Sans engagement',
    desc: 'Inscription gratuite, commission uniquement sur les réservations confirmées.',
  },
];

const typePartenaires = [
  {
    type: 'Hôtels & Hébergements',
    desc: 'Riads, hôtels, gîtes, campings… Proposez vos chambres aux groupes Eventy Life.',
    icon: '🏨',
  },
  {
    type: 'Restaurants & Traiteurs',
    desc: 'Accueillez nos groupes pour des expériences culinaires authentiques.',
    icon: '🍽',
  },
  {
    type: 'Activités & Excursions',
    desc: 'Guides touristiques, sports, bien-être… Enrichissez nos voyages.',
    icon: '🏔',
  },
  {
    type: 'Transport',
    desc: 'Autocaristes, transferts aéroport, location de véhicules pour groupes.',
    icon: '🚌',
  },
];

export default function PartenairesPage() {
  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '5rem 1rem',
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
            Partenariat
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-6"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Développez votre activité avec{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>Eventy Life</span>
          </h1>
          <p
            className="mx-auto mb-8"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Rejoignez notre réseau de partenaires et accédez à des milliers de
            voyageurs. Inscription gratuite, commission uniquement sur les
            réservations.
          </p>
          <Link
            href="/pro"
            className="inline-block rounded-xl font-bold text-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--terra, #C75B39)',
              color: 'white',
              padding: '1rem 2rem',
              textDecoration: 'none',
              boxShadow: '0 10px 25px rgba(199,91,57,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 30px rgba(199,91,57,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(199,91,57,0.2)';
            }}
          >
            Devenir partenaire →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Devenir partenaire', href: '/partenaires' },
          ]}
        />

        {/* Avantages */}
        <div className="text-center mb-12 mt-10">
          <p
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Avantages
          </p>
          <h2
            className="text-2xl sm:text-3xl"
            style={{
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              marginBottom: '1rem',
            }}
          >
            Pourquoi devenir partenaire ?
          </h2>
          <p
            className="mx-auto"
            style={{ color: '#6B7280', maxWidth: '26rem' }}
          >
            Des avantages concrets pour faire grandir votre business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {avantages.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                padding: '1.5rem',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: 'rgba(199,91,57,0.06)' }}
              >
                {a.icon}
              </div>
              <h3
                className="text-base font-bold mb-2"
                style={{ color: 'var(--navy, #1A1A2E)' }}
              >
                {a.title}
              </h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {a.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Types de partenaires */}
        <div className="text-center mb-12">
          <p
            style={{
              color: 'var(--gold, #D4A853)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Catégories
          </p>
          <h2
            className="text-2xl sm:text-3xl"
            style={{
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Qui peut devenir partenaire ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {typePartenaires.map((t, i) => (
            <div
              key={i}
              className="flex gap-5 items-start rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                padding: '2rem',
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'rgba(199,91,57,0.06)' }}
              >
                {t.icon}
              </div>
              <div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {t.type}
                </h3>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {t.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <div
          className="rounded-2xl mb-20"
          style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
            padding: '3rem 2rem',
            color: 'white',
          }}
        >
          <h2
            className="text-2xl sm:text-3xl text-center mb-10"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                title: 'Inscription gratuite',
                desc: 'Créez votre profil pro en 5 minutes. Sans engagement ni frais.',
              },
              {
                num: '2',
                title: 'Publiez vos offres',
                desc: 'Ajoutez vos prestations, tarifs et disponibilités sur votre dashboard.',
              },
              {
                num: '3',
                title: 'Recevez des groupes',
                desc: "Accueillez des voyageurs et développez votre chiffre d\u2019affaires.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4"
                  style={{ backgroundColor: 'var(--terra, #C75B39)' }}
                >
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center">
          <h2
            className="text-2xl sm:text-3xl mb-4"
            style={{
              fontWeight: '700',
              color: 'var(--navy, #1A1A2E)',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Prêt à nous rejoindre ?
          </h2>
          <p
            className="mx-auto mb-8"
            style={{ color: '#6B7280', maxWidth: '32rem' }}
          >
            Rejoignez les partenaires qui font confiance à Eventy Life pour
            développer leur activité touristique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pro"
              className="inline-block rounded-xl font-bold transition-all duration-200"
              style={{
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
                padding: '1rem 2rem',
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
              Créer mon compte pro
            </Link>
            <a
              href="mailto:partenaires@eventylife.fr"
              className="inline-block rounded-xl font-bold transition-all duration-200"
              style={{
                backgroundColor: 'white',
                color: 'var(--navy, #1A1A2E)',
                padding: '1rem 2rem',
                border: '2px solid #E5E0D8',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                e.currentTarget.style.color = 'var(--terra, #C75B39)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E0D8';
                e.currentTarget.style.color = 'var(--navy, #1A1A2E)';
              }}
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
