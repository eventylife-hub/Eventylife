'use client';

/**
 * Page FAQ Publique — Design Sun/Ocean V4
 * Accordéon interactif, recherche, JSON-LD FAQPage pour Google Rich Snippets
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { FAQPageJsonLd } from '@/components/seo/json-ld';
import { NewsletterCTA } from '@/components/newsletter-cta';

/* ─── Catégories FAQ ─── */
const faqCategories = [
  {
    key: 'reservation',
    title: 'Réservation',
    icon: '📝',
    items: [
      {
        id: 'res-1',
        q: 'Comment puis-je réserver un voyage ?',
        a: 'Sélectionnez le voyage souhaité, cliquez sur "Réserver", remplissez vos informations et procédez au paiement sécurisé. Vous recevrez une confirmation par email en quelques minutes.',
      },
      {
        id: 'res-2',
        q: 'Puis-je modifier ma réservation après la confirmation ?',
        a: "Oui, vous pouvez modifier votre réservation jusqu'à 14 jours avant le voyage. Connectez-vous à votre compte client et accédez à vos réservations.",
      },
      {
        id: 'res-3',
        q: 'Quelle est la capacité minimale pour confirmer un voyage ?',
        a: "La capacité minimale varie selon les voyages et est indiquée sur chaque fiche. En général, nous avons besoin d'au minimum 10 personnes confirmées.",
      },
      {
        id: 'res-4',
        q: 'Puis-je ajouter des participants après la réservation ?',
        a: "Oui, vous pouvez ajouter des participants jusqu'à 7 jours avant le départ. Contactez-nous pour les ajouts.",
      },
      {
        id: 'res-5',
        q: 'Puis-je voyager seul(e) ?',
        a: 'Absolument ! Beaucoup de nos voyageurs partent seuls et se retrouvent dans un groupe bienveillant. Vous ne serez jamais isolé(e).',
      },
    ],
  },
  {
    key: 'payment',
    title: 'Paiement',
    icon: '💳',
    items: [
      {
        id: 'pay-1',
        q: 'Quels modes de paiement acceptez-vous ?',
        a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) via notre paiement sécurisé Stripe.',
      },
      {
        id: 'pay-2',
        q: "Y a-t-il un acompte à verser ?",
        a: 'Oui, un acompte de 30 % est demandé lors de la réservation. Le solde est dû 30 jours avant le départ.',
      },
      {
        id: 'pay-3',
        q: 'Puis-je payer en plusieurs fois ?',
        a: 'Oui, nous proposons un paiement en 3x ou 4x sans frais. Le plan de paiement est configuré directement lors du checkout.',
      },
      {
        id: 'pay-4',
        q: 'Mon paiement a échoué, que faire ?',
        a: "Vérifiez les coordonnées de votre carte. Si l'erreur persiste, essayez un autre mode de paiement ou contactez notre support client.",
      },
    ],
  },
  {
    key: 'transport',
    title: 'Transport & Ramassage',
    icon: '🚌',
    items: [
      {
        id: 'trans-1',
        q: 'Le transport est-il inclus dans le prix ?',
        a: "Oui, le transport est inclus. Pour les voyages en bus, un autocar de qualité vous prend en charge. Pour les voyages en avion, les billets sont compris.",
      },
      {
        id: 'trans-2',
        q: 'Comment fonctionne le ramassage en bus ?',
        a: "Nous avons des points de ramassage dans plus de 20 villes. Un accompagnateur vous attend à votre point de départ et voyage avec vous jusqu'à destination.",
      },
      {
        id: 'trans-3',
        q: "Y a-t-il un parking au point de ramassage ?",
        a: 'Oui, un parking gratuit et sécurisé est disponible à chaque point de ramassage. Vous pouvez y laisser votre véhicule en toute tranquillité.',
      },
      {
        id: 'trans-4',
        q: 'Combien de bagages puis-je emporter ?',
        a: "Chaque passager peut emporter 1 bagage en soute et 1 bagage à main. Les bagages volumineux doivent être signalés à l'avance.",
      },
    ],
  },
  {
    key: 'cancellation',
    title: 'Annulation & Remboursement',
    icon: '🔄',
    items: [
      {
        id: 'cancel-1',
        q: "Quelle est votre politique d'annulation ?",
        a: "Annulation gratuite jusqu'à 30 jours avant le départ (remboursement 100 %). Entre 30 et 14 jours : 50 % de remboursement. Moins de 14 jours : crédit voyage utilisable sur une prochaine réservation.",
      },
      {
        id: 'cancel-2',
        q: 'Comment annuler ma réservation ?',
        a: 'Connectez-vous à votre compte, allez dans "Mes réservations" et cliquez sur "Annuler". Vous recevrez un email de confirmation.',
      },
      {
        id: 'cancel-3',
        q: "Qu'advient-il si le voyage est annulé par Eventy Life ?",
        a: 'Si nous annulons un voyage, vous êtes remboursé intégralement ou pouvez choisir un autre voyage sans frais supplémentaires.',
      },
      {
        id: 'cancel-4',
        q: "L'assurance annulation est-elle incluse ?",
        a: "Une assurance de base est incluse. Vous pouvez souscrire une assurance annulation étendue lors de la réservation pour une protection complète.",
      },
    ],
  },
  {
    key: 'accompagnement',
    title: 'Accompagnement',
    icon: '🤝',
    items: [
      {
        id: 'acc-1',
        q: "Qu'est-ce que l'accompagnement porte-à-porte ?",
        a: "Un accompagnateur dédié vous attend à votre point de ramassage, voyage avec vous, et reste votre référent tout au long du séjour. Vous n'êtes jamais seul(e).",
      },
      {
        id: 'acc-2',
        q: "L'accompagnateur parle-t-il ma langue ?",
        a: "Tous nos accompagnateurs parlent français. Pour les destinations internationales, ils parlent également la langue locale ou l'anglais.",
      },
      {
        id: 'acc-3',
        q: "Que se passe-t-il en cas de problème pendant le voyage ?",
        a: "Votre accompagnateur est votre premier contact. En plus, notre équipe support est joignable 24h/24 par téléphone, email et chat.",
      },
    ],
  },
  {
    key: 'pro',
    title: 'Espace Pro',
    icon: '💼',
    items: [
      {
        id: 'pro-1',
        q: 'Comment devenir un Pro Eventy Life ?',
        a: "Créez un compte pro sur notre plateforme, complétez votre profil avec vos documents (SIRET, assurance RC Pro...), et commencez à créer vos voyages.",
      },
      {
        id: 'pro-2',
        q: 'Quelles sont les commissions ?',
        a: "La commission est de 15 % sur chaque réservation. Le reste vous est versé dans les 7 jours suivant le voyage.",
      },
      {
        id: 'pro-3',
        q: 'Comment promouvoir mes voyages ?',
        a: "Vous disposez d'un lien unique et d'un QR code personnalisé. Partagez-les sur les réseaux sociaux, par email ou sur votre site web.",
      },
    ],
  },
];

type CategoryFilter = 'all' | string;

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return faqCategories
      .filter((cat) => activeCategory === 'all' || cat.key === activeCategory)
      .map((cat) => {
        if (!query) return cat;
        const filteredItems = cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query),
        );
        return { ...cat, items: filteredItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery, activeCategory]);

  const totalResults = filteredCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  // JSON-LD — toutes les questions pour Google Rich Snippets
  const allFaqItems = useMemo(
    () =>
      faqCategories.flatMap((cat) =>
        cat.items.map((item) => ({ question: item.q, answer: item.a })),
      ),
    [],
  );

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      <FAQPageJsonLd items={allFaqItems} />

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
            Aide & Support
          </p>
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Questions{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>fréquentes</span>
          </h1>
          <p
            className="mx-auto mb-8"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '36rem',
            }}
          >
            Trouvez les réponses à vos questions sur les voyages, la
            réservation, le paiement et plus encore.
          </p>

          {/* Barre de recherche dans le hero */}
          <div className="max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher dans la FAQ"
              className="w-full px-5 py-3.5 rounded-2xl text-base"
              style={{
                color: 'var(--navy, #1A1A2E)',
                border: 'none',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Questions fréquentes', href: '/faq' },
          ]}
        />

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mt-8 mb-8 justify-center">
          <button type="button"
            onClick={() => setActiveCategory('all')}
            style={{
              backgroundColor:
                activeCategory === 'all'
                  ? 'var(--terra, #C75B39)'
                  : 'white',
              color: activeCategory === 'all' ? 'white' : 'var(--navy, #1A1A2E)',
              border: `1.5px solid ${activeCategory === 'all' ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Toutes
          </button>
          {faqCategories.map((cat) => (
            <button type="button"
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                backgroundColor:
                  activeCategory === cat.key
                    ? 'var(--terra, #C75B39)'
                    : 'white',
                color:
                  activeCategory === cat.key ? 'white' : 'var(--navy, #1A1A2E)',
                border: `1.5px solid ${activeCategory === cat.key ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.icon} {cat.title}
            </button>
          ))}
        </div>

        {/* Compteur résultats */}
        {searchQuery && (
          <p
            className="text-center mb-6"
            style={{ color: '#64748B', fontSize: '0.875rem' }}
          >
            {totalResults} résultat{totalResults !== 1 ? 's' : ''} pour «{' '}
            <strong style={{ color: 'var(--terra, #C75B39)' }}>
              {searchQuery}
            </strong>{' '}
            »
          </p>
        )}

        {/* Sections FAQ */}
        <div className="space-y-10">
          {filteredCategories.map((category) => (
            <section key={category.key}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.icon}</span>
                <h2
                  className="text-xl font-bold"
                  style={{ color: 'var(--navy, #1A1A2E)' }}
                >
                  {category.title}
                </h2>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: 'rgba(199,91,57,0.08)',
                    color: 'var(--terra, #C75B39)',
                  }}
                >
                  {category.items.length}
                </span>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => {
                  const isOpen = openItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl overflow-hidden transition-all duration-300"
                      style={{
                        background: 'white',
                        border: '1px solid rgba(26,26,46,0.08)',
                        boxShadow: isOpen
                          ? '0 4px 16px rgba(26,26,46,0.08)'
                          : '0 2px 8px rgba(26,26,46,0.04)',
                      }}
                    >
                      <button type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${item.id}`}
                        className="w-full text-left flex items-center justify-between gap-4 transition-colors duration-200"
                        style={{
                          padding: '1.125rem 1.5rem',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        <span
                          className="font-semibold"
                          style={{ fontSize: '1rem', lineHeight: '1.5' }}
                        >
                          {item.q}
                        </span>
                        <span
                          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                          style={{
                            background: isOpen
                              ? 'var(--terra, #C75B39)'
                              : 'rgba(199,91,57,0.08)',
                            color: isOpen ? 'white' : 'var(--terra, #C75B39)',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        >
                          ▼
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          id={`faq-answer-${item.id}`}
                          role="region"
                          style={{
                            padding: '0 1.5rem 1.25rem',
                          }}
                        >
                          <div
                            style={{
                              borderTop: '1px solid rgba(26,26,46,0.06)',
                              paddingTop: '1rem',
                            }}
                          >
                            <p
                              className="text-base leading-relaxed"
                              style={{ color: '#64748B' }}
                            >
                              {item.a}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* État vide */}
        {filteredCategories.length === 0 && (
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
              Aucune question trouvée
            </p>
            <p className="mb-4" style={{ color: '#64748B' }}>
              Essayez avec d&apos;autres termes ou réinitialisez les filtres.
            </p>
            <button type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: '1.5px solid #E5E0D8',
                color: 'var(--navy, #1A1A2E)',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* CTA Contact */}
        <section
          className="mt-16 text-center rounded-3xl"
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
            Vous n&apos;avez pas trouvé votre réponse ?
          </h2>
          <p
            className="mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '32rem',
            }}
          >
            Notre équipe de support est disponible pour répondre à toutes vos
            questions par téléphone, email et chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
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
                Nous contacter
              </button>
            </Link>
            <Link href="/comment-ca-marche">
              <button type="button"
                className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                }}
              >
                Comment ça marche ?
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
