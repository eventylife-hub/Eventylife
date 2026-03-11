'use client';

/**
 * Page Comment ça marche — Design Sun/Ocean V4
 * Explique le processus de réservation en 4 étapes
 */

import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Choisissez votre voyage',
    description:
      'Parcourez notre catalogue de destinations. Filtrez par date, budget ou type de voyage. Chaque fiche détaille l\'itinéraire, l\'hébergement et les activités.',
    details: [
      'Plus de 50 destinations en France et à l\'étranger',
      'Voyages en bus ou en avion',
      'Durée de 3 à 15 jours',
    ],
  },
  {
    number: '02',
    icon: '📝',
    title: 'Réservez en ligne',
    description:
      'Réservez en quelques clics. Choisissez votre chambre, ajoutez vos options et payez en toute sécurité. Vous pouvez payer en plusieurs fois.',
    details: [
      'Paiement sécurisé par Stripe',
      'Paiement en 3x ou 4x sans frais',
      'Confirmation immédiate par email',
    ],
  },
  {
    number: '03',
    icon: '🚌',
    title: 'On vient vous chercher',
    description:
      'Le jour J, un accompagnateur vous attend à un point de ramassage près de chez vous. Parking gratuit disponible. Vous n\'avez rien à gérer.',
    details: [
      'Points de ramassage dans 20+ villes',
      'Accompagnateur dédié dès le départ',
      'Parking gratuit et sécurisé',
    ],
  },
  {
    number: '04',
    icon: '🌟',
    title: 'Profitez du voyage',
    description:
      'Tout est organisé : transport, hôtel, repas, excursions. Votre accompagnateur reste à vos côtés tout au long du séjour. Détendez-vous, on s\'occupe de tout.',
    details: [
      'Hôtels 3★ à 5★ sélectionnés',
      'Excursions et visites guidées incluses',
      'Assistance 24h/24 pendant le séjour',
    ],
  },
];

const guarantees = [
  { icon: '🔒', title: 'Paiement sécurisé', text: 'Transactions cryptées par Stripe' },
  { icon: '✅', title: 'Annulation flexible', text: 'Remboursement jusqu\'à 30 jours avant' },
  { icon: '🛡️', title: 'Assurance incluse', text: 'RC Pro et garantie financière APST' },
  { icon: '📞', title: 'Support réactif', text: 'Joignable par tel, email et chat' },
];

export default function CommentCaMarchePage() {
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
            Simple et transparent
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Comment ça{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>marche ?</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '36rem',
            }}
          >
            De la réservation au retour, on s&apos;occupe de tout.
            Votre seul rôle : profiter du voyage.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Comment ça marche', href: '/comment-ca-marche' },
          ]}
        />

        {/* Étapes */}
        <section className="mt-10 mb-20">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row gap-8 mb-16 last:mb-0 items-start"
            >
              {/* Numéro + icône */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-3"
                  style={{
                    background:
                      i % 2 === 0
                        ? 'rgba(199,91,57,0.08)'
                        : 'rgba(0,119,182,0.08)',
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: 'var(--terra, #C75B39)',
                    letterSpacing: '2px',
                  }}
                >
                  ÉTAPE {step.number}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block w-0.5 h-16 mt-3"
                    style={{ background: 'rgba(199,91,57,0.15)' }}
                  />
                )}
              </div>

              {/* Contenu */}
              <div
                className="flex-1 p-6 rounded-2xl"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
              >
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {step.title}
                </h2>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: '#718096' }}
                >
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--terra, #C75B39)' }}
                      />
                      <span style={{ color: '#4A5568' }}>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Garanties */}
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
              Sérénité garantie
            </p>
            <h2
              className="text-2xl sm:text-3xl"
              style={{
                color: 'var(--navy, #1A1A2E)',
                fontWeight: '700',
                fontFamily: 'var(--font-playfair, Playfair Display, serif)',
              }}
            >
              Nos engagements
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guarantees.map((g, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
              >
                <div className="text-3xl mb-3">{g.icon}</div>
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {g.title}
                </h3>
                <p className="text-xs" style={{ color: '#718096' }}>
                  {g.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ rapide */}
        <section className="mb-20">
          <div
            className="p-8 rounded-2xl"
            style={{
              background: 'white',
              border: '1px solid rgba(26,26,46,0.08)',
            }}
          >
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Questions fréquentes
            </h2>
            {[
              {
                q: 'Puis-je voyager seul(e) ?',
                a: 'Absolument ! Beaucoup de nos voyageurs partent seuls et se retrouvent dans un groupe bienveillant.',
              },
              {
                q: 'Comment fonctionne le ramassage en bus ?',
                a: 'Nous avons des points de ramassage dans plus de 20 villes. Un accompagnateur vous attend et voyage avec vous.',
              },
              {
                q: 'Que se passe-t-il si je dois annuler ?',
                a: 'Annulation gratuite jusqu\'à 30 jours avant le départ. Au-delà, des frais progressifs s\'appliquent selon nos CGV.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="mb-4 last:mb-0 pb-4 last:pb-0"
                style={{
                  borderBottom:
                    i < 2 ? '1px solid rgba(26,26,46,0.06)' : 'none',
                }}
              >
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {faq.q}
                </h3>
                <p className="text-sm" style={{ color: '#718096' }}>
                  {faq.a}
                </p>
              </div>
            ))}
            <Link
              href="/faq"
              className="inline-block mt-4 text-sm font-bold transition-colors"
              style={{ color: 'var(--terra, #C75B39)' }}
            >
              Voir toutes les FAQ →
            </Link>
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
            Prêt à partir ?
          </h2>
          <p
            className="mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '30rem',
            }}
          >
            Choisissez votre prochaine destination et laissez-nous
            organiser le reste.
          </p>
          <Link href="/voyages">
            <button
              className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'white',
                color: 'var(--terra, #C75B39)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Explorer les voyages
            </button>
          </Link>
        </section>

        {/* Newsletter */}
        <NewsletterCTA variant="terra" className="mt-16" />
      </div>
    </div>
  );
}
