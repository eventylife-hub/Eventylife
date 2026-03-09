import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Voyage | Eventy Life',
  description:
    'Conseils voyage, inspirations et actualites Eventy Life. Decouvrez nos guides de voyage en groupe.',
};

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] text-white py-16 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Le Blog <span className="text-[#FF6B35]">Eventy Life</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Conseils voyage, inspirations et decouvertes. Tout pour preparer
            votre prochain voyage en groupe.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                cat === 'Tous'
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="h-48 bg-gradient-to-br from-[#0A1628] to-[#1B3A5C] flex items-center justify-center">
                <span className="text-5xl opacity-30">
                  {article.category === 'Destinations' ? '\u{1F30D}' : article.category === 'Conseils' ? '\u{1F4A1}' : article.category === 'Temoignages' ? '\u{1F4AC}' : '\u{1F68C}'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-[#FF6B35] bg-orange-50 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.readTime} de lecture</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{article.date}</span>
                  <span className="text-[#FF6B35] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Lire &rarr;
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#FF6B35] to-[#FF8F5E] rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ne manquez aucune inspiration
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Inscrivez-vous a notre newsletter et recevez nos meilleurs conseils
            voyage et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none"
            />
            <button className="bg-[#0A1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1B3A5C] transition-colors">
              S&apos;inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
