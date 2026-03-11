'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/seo/breadcrumb';

const articles = [
  {
    id: 1,
    title: 'Voyager en groupe : 10 raisons de se lancer',
    excerpt:
      'Decouvrez pourquoi le voyage en groupe est la meilleure facon de decouvrir le monde. Partage, economie, securite... tous les avantages.',
    category: 'Conseils',
    date: '5 mars 2026',
    readTime: '5 min',
    image: '/images/blog/groupe.jpg',
    slug: '#',
  },
  {
    id: 2,
    title: 'Maroc : les incontournables pour un premier voyage',
    excerpt:
      'De Marrakech a Chefchaouen, en passant par le desert du Sahara. Notre guide complet pour un voyage inoubliable au Maroc.',
    category: 'Destinations',
    date: '2 mars 2026',
    readTime: '8 min',
    image: '/images/blog/maroc.jpg',
    slug: '#',
  },
  {
    id: 3,
    title: 'Comment preparer sa valise pour un voyage organise',
    excerpt:
      'Check-list complete et astuces pour ne rien oublier. Adaptez votre valise a la destination et a la duree du sejour.',
    category: 'Conseils',
    date: '28 fevrier 2026',
    readTime: '4 min',
    image: '/images/blog/valise.jpg',
    slug: '#',
  },
  {
    id: 4,
    title: 'Andalousie : entre culture et farniente',
    excerpt:
      'Seville, Grenade, Cordoue... Plongez dans le patrimoine andalou et profitez du soleil du sud de l&apos;Espagne.',
    category: 'Destinations',
    date: '25 fevrier 2026',
    readTime: '6 min',
    image: '/images/blog/andalousie.jpg',
    slug: '#',
  },
  {
    id: 5,
    title: 'Voyager seul en groupe : la solution ideale',
    excerpt:
      'Vous souhaitez voyager mais n&apos;avez personne pour vous accompagner ? Le voyage en groupe est la solution parfaite.',
    category: 'Temoignages',
    date: '20 fevrier 2026',
    readTime: '5 min',
    image: '/images/blog/solo.jpg',
    slug: '#',
  },
  {
    id: 6,
    title: 'Ramassage en bus : comment ca marche ?',
    excerpt:
      'Decouvrez notre systeme de ramassage pres de chez vous. Parking gratuit, horaires flexibles et accompagnement personnalise.',
    category: 'Services',
    date: '15 fevrier 2026',
    readTime: '3 min',
    image: '/images/blog/bus.jpg',
    slug: '#',
  },
];

const categories = ['Tous', 'Conseils', 'Destinations', 'Temoignages', 'Services'];

export default function BlogPage() {
  const C = {
    navy: '#1A1A2E',
    cream: '#FAF7F2',
    terra: '#C75B39',
    terraLight: '#D97B5E',
    terraSoft: 'var(--terra-soft)',
    gold: '#D4A853',
    goldSoft: '#FDF6E8',
    border: '#E5E0D8',
    muted: '#6B7280',
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, color: 'white', paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="mx-auto max-w-6xl text-center">
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Playfair, serif' }} className="sm:text-5xl mb-4">
            Le Blog <span style={{ color: C.terra }}>Eventy Life</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '42rem' }} className="mx-auto">
            Conseils voyage, inspirations et decouvertes. Tout pour preparer
            votre prochain voyage en groupe.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb items={[{name:'Accueil',href:'/'}, {name:'Blog',href:'/blog'}]} />
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat: unknown) => (
            <button
              key={cat}
              style={{
                backgroundColor: cat === 'Tous' ? C.terra : 'white',
                color: cat === 'Tous' ? 'white' : C.navy,
                border: `1.5px solid ${cat === 'Tous' ? C.terra : C.border}`,
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (cat !== 'Tous') {
                  e.currentTarget.style.borderColor = C.terra;
                  e.currentTarget.style.color = C.terra;
                }
              }}
              onMouseLeave={(e) => {
                if (cat !== 'Tous') {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.navy;
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: unknown) => (
            <article
              key={article.id}
              style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s ease' }}
              className="shadow-sm hover:shadow-lg hover:-translate-y-1 group"
            >
              <div style={{ height: '12rem', background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem', opacity: 0.3 }}>
                  {article.category === 'Destinations' ? '\u{1F30D}' : article.category === 'Conseils' ? '\u{1F4A1}' : article.category === 'Temoignages' ? '\u{1F4AC}' : '\u{1F68C}'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: C.terra, backgroundColor: C.terraSoft, padding: '4px 12px', borderRadius: '9999px' }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: C.muted }}>{article.readTime} de lecture</span>
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: C.navy, marginBottom: '0.5rem', transition: 'color 0.3s ease' }} className="group-hover:line-clamp-2 line-clamp-2" onMouseEnter={(e) => { e.currentTarget.style.color = C.terra; }} onMouseLeave={(e) => { e.currentTarget.style.color = C.navy; }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: C.muted }} className="line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '0.75rem', color: C.muted }}>{article.date}</span>
                  <span style={{ color: C.terra, fontSize: '0.875rem', fontWeight: '700', transition: 'transform 0.3s ease' }} className="group-hover:translate-x-1">
                    Lire →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div style={{ marginTop: '4rem', background: `linear-gradient(135deg, ${C.terra}, ${C.terraLight})`, borderRadius: '20px', padding: '2rem', color: 'white', textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }} className="sm:p-12">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.75rem', fontFamily: 'Playfair, serif' }} className="sm:text-3xl mb-3">
            Ne manquez aucune inspiration
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', maxWidth: '42rem' }} className="mx-auto">
            Inscrivez-vous a notre newsletter et recevez nos meilleurs conseils
            voyage et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', color: C.navy, border: 'none', outline: 'none' }}
            />
            <button style={{ backgroundColor: C.navy, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
              S&apos;inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
