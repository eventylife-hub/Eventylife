import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Brochure Voyages | Eventy Life',
  description:
    'Telechargez notre brochure de voyages en groupe. Decouvrez toutes nos destinations et formules.',
};

const brochures = [
  {
    title: 'Catalogue Printemps-Ete 2026',
    desc: 'Toutes nos destinations pour la saison : Maroc, Andalousie, Tunisie, Italie et bien plus.',
    pages: '48 pages',
    icon: '\u{2600}',
  },
  {
    title: 'Special Week-ends',
    desc: 'Nos week-ends thematiques : gastronomie, bien-etre, culture, aventure.',
    pages: '24 pages',
    icon: '\u{1F389}',
  },
  {
    title: 'Guide du Voyageur',
    desc: 'Tout ce que vous devez savoir avant de partir : preparation, bagages, documents.',
    pages: '16 pages',
    icon: '\u{1F4D6}',
  },
];

export default function BrochurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] text-white py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Nos <span className="text-[#FF6B35]">Brochures</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Decouvrez nos destinations et formules de voyages en groupe.
            Telechargez nos brochures gratuitement.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Brochures disponibles */}
        <div className="space-y-6 mb-16">
          {brochures.map((b, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start gap-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF8F5E] rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                {b.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{b.title}</h2>
                <p className="text-gray-600 mb-3">{b.desc}</p>
                <span className="text-xs text-gray-400">{b.pages} - PDF</span>
              </div>
              <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#FF8F5E] transition-all whitespace-nowrap self-center">
                Telecharger
              </button>
            </div>
          ))}
        </div>

        {/* Demande brochure par email */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] rounded-3xl p-8 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Recevez la brochure par email
          </h2>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Entrez votre email pour recevoir notre catalogue complet directement
            dans votre boite mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none"
            />
            <button className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#FF8F5E] transition-colors">
              Envoyer
            </button>
          </div>
        </div>

        {/* Back to voyages */}
        <div className="mt-12 text-center">
          <Link
            href="/voyages"
            className="text-[#FF6B35] font-semibold hover:underline"
          >
            &larr; Voir tous nos voyages
          </Link>
        </div>
      </div>
    </div>
  );
}
