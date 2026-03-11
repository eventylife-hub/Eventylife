'use client';

/**
 * Page Blog — Design Sun/Ocean V4
 * Listing avec article vedette, recherche, tags, auteurs, catégories
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { NewsletterCTA } from '@/components/newsletter-cta';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  isoDate: string;
  readTime: string;
  slug: string;
  author: { name: string; initials: string };
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Voyager en groupe : 10 raisons de se lancer',
    excerpt:
      'Découvrez pourquoi le voyage en groupe est la meilleure façon de découvrir le monde. Partage, économie, sécurité... tous les avantages.',
    category: 'Conseils',
    tags: ['groupe', 'premier voyage', 'guide'],
    date: '5 mars 2026',
    isoDate: '2026-03-05',
    readTime: '5 min',
    slug: 'voyager-en-groupe-10-raisons-de-se-lancer',
    author: { name: 'Sophie Martin', initials: 'SM' },
    featured: true,
  },
  {
    id: 2,
    title: 'Maroc : les incontournables pour un premier voyage',
    excerpt:
      'De Marrakech à Chefchaouen, en passant par le désert du Sahara. Notre guide complet pour un voyage inoubliable au Maroc.',
    category: 'Destinations',
    tags: ['maroc', 'afrique', 'incontournables'],
    date: '2 mars 2026',
    isoDate: '2026-03-02',
    readTime: '8 min',
    slug: 'maroc-les-incontournables-pour-un-premier-voyage',
    author: { name: 'Karim Benhadi', initials: 'KB' },
  },
  {
    id: 3,
    title: 'Comment préparer sa valise pour un voyage organisé',
    excerpt:
      'Check-list complète et astuces pour ne rien oublier. Adaptez votre valise à la destination et à la durée du séjour.',
    category: 'Conseils',
    tags: ['préparation', 'valise', 'checklist'],
    date: '28 février 2026',
    isoDate: '2026-02-28',
    readTime: '4 min',
    slug: 'comment-preparer-sa-valise-pour-un-voyage-organise',
    author: { name: 'Sophie Martin', initials: 'SM' },
  },
  {
    id: 4,
    title: 'Andalousie : entre culture et farniente',
    excerpt:
      'Séville, Grenade, Cordoue... Plongez dans le patrimoine andalou et profitez du soleil du sud de l\'Espagne.',
    category: 'Destinations',
    tags: ['espagne', 'andalousie', 'culture'],
    date: '25 février 2026',
    isoDate: '2026-02-25',
    readTime: '6 min',
    slug: 'andalousie-entre-culture-et-farniente',
    author: { name: 'Julie Dupont', initials: 'JD' },
  },
  {
    id: 5,
    title: 'Voyager seul en groupe : la solution idéale',
    excerpt:
      'Vous souhaitez voyager mais n\'avez personne pour vous accompagner ? Le voyage en groupe est la solution parfaite.',
    category: 'Témoignages',
    tags: ['solo', 'groupe', 'témoignage'],
    date: '20 février 2026',
    isoDate: '2026-02-20',
    readTime: '5 min',
    slug: 'voyager-seul-en-groupe-la-solution-ideale',
    author: { name: 'Marie Laurent', initials: 'ML' },
  },
  {
    id: 6,
    title: 'Ramassage en bus : comment ça marche ?',
    excerpt:
      'Découvrez notre système de ramassage près de chez vous. Parking gratuit, horaires flexibles et accompagnement personnalisé.',
    category: 'Services',
    tags: ['bus', 'ramassage', 'transport'],
    date: '15 février 2026',
    isoDate: '2026-02-15',
    readTime: '3 min',
    slug: 'ramassage-en-bus-comment-ca-marche',
    author: { name: 'David Eventy', initials: 'DE' },
  },
  {
    id: 7,
    title: 'Portugal : de Lisbonne à Porto en groupe',
    excerpt:
      'Un itinéraire idéal pour découvrir les deux perles du Portugal. Tramway, azulejos, et pastéis de nata au programme.',
    category: 'Destinations',
    tags: ['portugal', 'lisbonne', 'porto', 'europe'],
    date: '10 février 2026',
    isoDate: '2026-02-10',
    readTime: '7 min',
    slug: 'portugal-de-lisbonne-a-porto-en-groupe',
    author: { name: 'Karim Benhadi', initials: 'KB' },
  },
  {
    id: 8,
    title: 'Assurance voyage : ce qu\'il faut savoir',
    excerpt:
      'Annulation, rapatriement, bagages... Tout comprendre sur les assurances voyage et comment choisir la bonne couverture.',
    category: 'Conseils',
    tags: ['assurance', 'annulation', 'sécurité'],
    date: '5 février 2026',
    isoDate: '2026-02-05',
    readTime: '6 min',
    slug: 'assurance-voyage-ce-qu-il-faut-savoir',
    author: { name: 'Julie Dupont', initials: 'JD' },
  },
  {
    id: 9,
    title: 'Témoignage : mon premier voyage Eventy Life',
    excerpt:
      'Marie, 67 ans, raconte son expérience de premier voyage en groupe. Elle s\'est sentie comme en famille dès le premier jour.',
    category: 'Témoignages',
    tags: ['témoignage', 'premier voyage', 'expérience'],
    date: '1 février 2026',
    isoDate: '2026-02-01',
    readTime: '4 min',
    slug: 'temoignage-mon-premier-voyage-eventy-life',
    author: { name: 'Marie Laurent', initials: 'ML' },
  },
];

const categories = ['Tous', 'Conseils', 'Destinations', 'Témoignages', 'Services'];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Destinations: { bg: 'rgba(0,119,182,0.08)', text: '#0077B6' },
  Conseils: { bg: 'rgba(199,91,57,0.08)', text: '#C75B39' },
  Témoignages: { bg: 'rgba(212,168,83,0.08)', text: '#B8860B' },
  Services: { bg: 'rgba(26,26,46,0.06)', text: '#1A1A2E' },
};

const categoryIcons: Record<string, string> = {
  Destinations: '🌍',
  Conseils: '💡',
  Témoignages: '💬',
  Services: '🚌',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeCategory !== 'Tous') {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.author.name.toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const featuredArticle = articles.find((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured || searchQuery || activeCategory !== 'Tous');

  return (
    <div style={{ backgroundColor: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
          color: 'white',
          padding: '4rem 1rem 3rem',
        }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--gold, #D4A853)',
              marginBottom: '1rem',
            }}
          >
            Inspirations &amp; Conseils
          </p>
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
            className="mx-auto mb-8"
            style={{
              fontSize: '1.125rem',
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '42rem',
            }}
          >
            Conseils voyage, inspirations et découvertes. Tout pour préparer
            votre prochain voyage en groupe.
          </p>

          {/* Barre de recherche */}
          <div className="max-w-lg mx-auto relative">
            <input
              type="search"
              placeholder="Rechercher un article, une destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un article"
              className="w-full py-3.5 pl-12 pr-4 rounded-xl text-sm"
              style={{
                background: 'rgba(250,247,242,0.1)',
                color: '#FAF7F2',
                border: '1.5px solid rgba(250,247,242,0.15)',
                outline: 'none',
                backdropFilter: 'blur(8px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
                e.currentTarget.style.background = 'rgba(250,247,242,0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(250,247,242,0.15)';
                e.currentTarget.style.background = 'rgba(250,247,242,0.1)';
              }}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2"
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="rgba(250,247,242,0.5)" strokeWidth="2" strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb
          items={[
            { name: 'Accueil', href: '/' },
            { name: 'Blog', href: '/blog' },
          ]}
        />

        {/* Article vedette */}
        {featuredArticle && !searchQuery && activeCategory === 'Tous' && (
          <Link
            href={`/blog/${featuredArticle.slug}`}
            className="block group mb-12 mt-6"
          >
            <article
              className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'white',
                border: '1px solid rgba(26,26,46,0.08)',
                borderRadius: '24px',
                boxShadow: '0 4px 16px rgba(26,26,46,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(26,26,46,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,26,46,0.06)';
              }}
            >
              <div
                className="flex items-center justify-center relative"
                style={{
                  minHeight: '16rem',
                  background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 50%, #C75B39 100%)',
                }}
              >
                <span
                  className="text-7xl transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.3 }}
                  aria-hidden="true"
                >
                  {categoryIcons[featuredArticle.category] ?? '📝'}
                </span>
                <span
                  className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: 'var(--gold, #D4A853)',
                    color: '#1A1A2E',
                  }}
                >
                  Article vedette
                </span>
              </div>

              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={categoryColors[featuredArticle.category] ?? { bg: 'rgba(199,91,57,0.08)', text: '#C75B39' }}
                  >
                    {featuredArticle.category}
                  </span>
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    {featuredArticle.readTime} de lecture
                  </span>
                </div>
                <h2
                  className="text-2xl font-bold mb-3 transition-colors duration-200 group-hover:text-[#C75B39]"
                  style={{
                    color: 'var(--navy, #1A1A2E)',
                    fontFamily: 'var(--font-playfair, Playfair Display, serif)',
                  }}
                >
                  {featuredArticle.title}
                </h2>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: '#64748B' }}>
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {featuredArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(26,26,46,0.04)', color: '#6B7280' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
                    >
                      {featuredArticle.author.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                        {featuredArticle.author.name}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        {featuredArticle.date}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: 'var(--terra, #C75B39)' }}
                  >
                    Lire l&apos;article →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Catégories filtre */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center mt-6">
          {categories.map((cat) => (
            <button
              type="button"
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
              {cat !== 'Tous' && <span className="mr-1.5">{categoryIcons[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>

        {/* Compteur résultats */}
        <p
          className="text-center mb-8"
          style={{ color: '#64748B', fontSize: '0.875rem' }}
        >
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          {activeCategory !== 'Tous' && (
            <> dans <strong style={{ color: 'var(--terra, #C75B39)' }}>{activeCategory}</strong></>
          )}
          {searchQuery && (
            <>
              {' '}pour &laquo;{' '}
              <strong style={{ color: 'var(--terra, #C75B39)' }}>{searchQuery}</strong>
              {' '}&raquo;
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="ml-2 text-xs underline"
                style={{ color: '#C75B39' }}
              >
                Effacer
              </button>
            </>
          )}
        </p>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
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
                  className="flex items-center justify-center relative"
                  style={{
                    height: '12rem',
                    background:
                      'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%)',
                  }}
                >
                  <span
                    className="text-5xl transition-transform duration-300 group-hover:scale-110"
                    style={{ opacity: 0.4 }}
                    aria-hidden="true"
                  >
                    {categoryIcons[article.category] ?? '📝'}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={categoryColors[article.category] ?? { backgroundColor: 'rgba(199,91,57,0.08)', color: '#C75B39' }}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs" style={{ color: '#64748B' }}>
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
                    className="text-sm line-clamp-3 mb-3 flex-1"
                    style={{ color: '#64748B' }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(26,26,46,0.04)', color: '#6B7280' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid rgba(26,26,46,0.06)' }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: 'linear-gradient(135deg, var(--terra, #C75B39), var(--gold, #D4A853))',
                          color: '#fff',
                          fontSize: '0.625rem',
                        }}
                      >
                        {article.author.initials}
                      </div>
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {article.date}
                      </span>
                    </div>
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
              Aucun article trouvé
            </p>
            <p className="mb-4" style={{ color: '#64748B' }}>
              {searchQuery
                ? 'Essayez avec d\'autres mots-clés'
                : 'De nouveaux articles arrivent bientôt !'}
            </p>
            {(searchQuery || activeCategory !== 'Tous') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Tous');
                }}
                className="text-sm font-bold"
                style={{ color: 'var(--terra, #C75B39)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Voir tous les articles →
              </button>
            )}
          </div>
        )}

        {/* Newsletter CTA */}
        <NewsletterCTA variant="terra" className="mt-16" />
      </div>
    </div>
  );
}
