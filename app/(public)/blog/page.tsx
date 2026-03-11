'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';

const articles = [
  {
    id: 1,
    title: 'Voyager en groupe : 10 raisons de se lancer',
    excerpt:
      'Découvrez pourquoi le voyage en groupe est la meilleure façon de découvrir le monde. Partage, économie, sécurité... tous les avantages.',
    category: 'Conseils',
    date: '5 mars 2026',
    readTime: '5 min',
    slug: 'voyager-en-groupe-10-raisons-de-se-lancer',
  },
  {
    id: 2,
    title: 'Maroc : les incontournables pour un premier voyage',
    excerpt:
      'De Marrakech à Chefchaouen, en passant par le désert du Sahara. Notre guide complet pour un voyage inoubliable au Maroc.',
    category: 'Destinations',
    date: '2 mars 2026',
    readTime: '8 min',
    slug: 'maroc-les-incontournables-pour-un-premier-voyage',
  },
  {
    id: 3,
    title: 'Comment préparer sa valise pour un voyage organisé',
    excerpt:
      'Check-list complète et astuces pour ne rien oublier. Adaptez votre valise à la destination et à la durée du séjour.',
    category: 'Conseils',
    date: '28 février 2026',
    readTime: '4 min',
    slug: 'comment-preparer-sa-valise-pour-un-voyage-organise',
  },
  {
    id: 4,
    title: 'Andalousie : entre culture et farniente',
    excerpt:
      'Séville, Grenade, Cordoue... Plongez dans le patrimoine andalou et profitez du soleil du sud de l\'Espagne.',
    category: 'Destinations',
    date: '25 février 2026',
    readTime: '6 min',
    slug: 'andalousie-entre-culture-et-farniente',
  },
  {
    id: 5,
    title: 'Voyager seul en groupe : la solution idéale',
    excerpt:
      'Vous souhaitez voyager mais n\'avez personne pour vous accompagner ? Le voyage en groupe est la solution parfaite.',
    category: 'Témoignages',
    date: '20 février 2026',
    readTime: '5 min',
    slug: 'voyager-seul-en-groupe-la-solution-ideale',
  },
  {
    id: 6,
    title: 'Ramassage en bus : comment ça marche ?',
    excerpt:
      'Découvrez notre système de ramassage près de chez vous. Parking gratuit, horaires flexibles et accompagnement personnalisé.',
    category: 'Services',
    date: '15 février 2026',
    readTime: '3 min',
    slug: 'ramassage-en-bus-comment-ca-marche',
  },
  {
    id: 7,
    title: 'Portugal : de Lisbonne à Porto en groupe',
    excerpt:
      'Un itinéraire idéal pour découvrir les deux perles du Portugal. Tramway, azulejos, et pastéis de nata au programme.',
    category: 'Destinations',
    date: '10 février 2026',
    readTime: '7 min',
    slug: 'portugal-de-lisbonne-a-porto-en-groupe',
  },
  {
    id: 8,
    title: 'Assurance voyage : ce qu\'il faut savoir',
    excerpt:
      'Annulation, rapatriement, bagages... Tout comprendre sur les assurances voyage et comment choisir la bonne couverture.',
    category: 'Conseils',
    date: '5 février 2026',
    readTime: '6 min',
    slug: 'assurance-voyage-ce-qu-il-faut-savoir',
  },
  {
    id: 9,
    title: 'Témoignage : mon premier voyage Eventy Life',
    excerpt:
      'Marie, 67 ans, raconte son expérience de premier voyage en groupe. « Je me suis sentie comme en famille dès le premier jour. »',
    category: 'Témoignages',
    date: '1 février 2026',
    readTime: '4 min',
    slug: 'temoignage-mon-premier-voyage-eventy-life',
  },
];

const categories = ['Tous', 'Conseils', 'Destinations', 'Témoignages', 'Services'];

const categoryIcons: Record<string, string> = {
  Destinations: '🌍',
  Conseils: '💡',
  'Témoignages': '💬',
  Services: '🚌',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'Tous') return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '4rem 1rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <h1
            className="text-3xl sm:text-5xl mb-4"
            style={{
              fontWeight: '700',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Le Blog{' '}
            <span style={{ color: 'var(--terra, #C75B39)' }}>Eventy Life</span>
          </h1>
          <p
            className="mx-auto"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '42rem',
            }}
          >
            Conseils voyage, inspirations et découvertes. Tout pour préparer
            votre prochain voyage en groupe.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]}
        />

        {/* Catégories filtre */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                backgroundColor:
                  cat === activeCategory
                    ? 'var(--terra, #C75B39)'
                    : 'white',
                color:
                  cat === activeCategory ? 'white' : 'var(--navy, #1A1A2E)',
                border: `1.5px solid ${cat === activeCategory ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Compteur résultats */}
        <p
          className="text-center mb-8"
          style={{ color: '#718096', fontSize: '0.875rem' }}
        >
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          {activeCategory !== 'Tous' && (
            <> dans <strong style={{ color: 'var(--terra, #C75B39)' }}>{activeCategory}</strong></>
          )}
        </p>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.id}
              className="block group"
            >
              <article
                className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid rgba(26,26,46,0.08)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 12px 32px rgba(26,26,46,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(26,26,46,0.04)';
                }}
              >
                {/* Image placeholder */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: '12rem',
                    background:
                      'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
                  }}
                >
                  <span
                    className="text-5xl transition-transform duration-300 group-hover:scale-110"
                    style={{ opacity: 0.4 }}
                  >
                    {categoryIcons[article.category] ?? '📝'}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        color: 'var(--terra, #C75B39)',
                        backgroundColor: 'rgba(199,91,57,0.08)',
                      }}
                    >
                      {article.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: '#718096' }}
                    >
                      {article.readTime} de lecture
                    </span>
                  </div>

                  <h2
                    className="text-lg font-bold mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-[#C75B39]"
                    style={{ color: 'var(--navy, #1A1A2E)' }}
                  >
                    {article.title}
                  </h2>

                  <p
                    className="text-sm line-clamp-3 mb-4 flex-1"
                    style={{ color: '#718096' }}
                  >
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}
                  >
                    <span className="text-xs" style={{ color: '#A0AEC0' }}>
                      {article.date}
                    </span>
                    <span
                      className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: 'var(--terra, #C75B39)' }}
                    >
                      Lire →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* État vide */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ backgroundColor: 'rgba(199,91,57,0.08)' }}
            >
              📝
            </div>
            <p
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--navy, #1A1A2E)' }}
            >
              Aucun article dans cette catégorie
            </p>
            <p style={{ color: '#718096' }}>
              De nouveaux articles arrivent bientôt !
            </p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div
          className="mt-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
            borderRadius: '24px',
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
            Ne manquez aucune inspiration
          </h2>
          <p
            className="mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '42rem',
            }}
          >
            Inscrivez-vous à notre newsletter et recevez nos meilleurs conseils
            voyage et offres exclusives.
          </p>
          <form
            role="search"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Votre email..."
              aria-label="Adresse email pour la newsletter"
              className="flex-1 px-4 py-3 rounded-xl text-sm"
              style={{
                color: 'var(--navy, #1A1A2E)',
                border: 'none',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--navy, #1A1A2E)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
