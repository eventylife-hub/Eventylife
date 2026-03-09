import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Devenir Partenaire | Eventy Life',
  description:
    'Rejoignez le reseau de partenaires Eventy Life. Hotels, restaurants, activites : developpez votre business avec nous.',
};

const avantages = [
  {
    icon: '\u{1F4C8}',
    title: 'Visibilite accrue',
    desc: 'Accedez a des milliers de voyageurs actifs chaque mois via notre plateforme.',
  },
  {
    icon: '\u{1F4B0}',
    title: 'Revenus supplementaires',
    desc: 'Remplissez vos capacites avec des groupes reguliers toute l&apos;annee.',
  },
  {
    icon: '\u{1F91D}',
    title: 'Accompagnement dedie',
    desc: 'Un charge de compte personnel pour optimiser votre partenariat.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Dashboard pro',
    desc: 'Suivez vos reservations, revenus et avis clients en temps reel.',
  },
  {
    icon: '\u{2B50}',
    title: 'Avis verifies',
    desc: 'Beneficiez de retours clients authentiques pour ameliorer votre offre.',
  },
  {
    icon: '\u{1F680}',
    title: 'Sans engagement',
    desc: 'Inscription gratuite, commission uniquement sur les reservations confirmees.',
  },
];

const typePartenaires = [
  {
    type: 'Hotels & Hebergements',
    desc: 'Riads, hotels, gites, campings... Proposez vos chambres aux groupes Eventy Life.',
    icon: '\u{1F3E8}',
  },
  {
    type: 'Restaurants & Traiteurs',
    desc: 'Accueillez nos groupes pour des experiences culinaires authentiques.',
    icon: '\u{1F37D}',
  },
  {
    type: 'Activites & Excursions',
    desc: 'Guides touristiques, sports, bien-etre... Enrichissez nos voyages.',
    icon: '\u{1F3D4}',
  },
  {
    type: 'Transport',
    desc: 'Autocaristes, transferts aeroport, location de vehicules pour groupes.',
    icon: '\u{1F68C}',
  },
];

export default function PartenairesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] text-white py-20 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block bg-[#FF6B35]/20 text-[#FF6B35] px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            Partenariat
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Developpez votre activite avec{' '}
            <span className="text-[#FF6B35]">Eventy Life</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Rejoignez notre reseau de partenaires et accedez a des milliers de
            voyageurs. Inscription gratuite, commission uniquement sur les
            reservations.
          </p>
          <Link
            href="/pro"
            className="inline-block bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FF8F5E] transition-all hover:scale-105 shadow-lg"
          >
            Devenir partenaire &rarr;
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Avantages */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi devenir partenaire ?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Des avantages concrets pour faire grandir votre business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {avantages.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-4 block">{a.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Types de partenaires */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Qui peut devenir partenaire ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {typePartenaires.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex gap-5 items-start"
            >
              <span className="text-4xl flex-shrink-0">{t.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.type}</h3>
                <p className="text-sm text-gray-600">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment ca marche */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1B3A5C] rounded-3xl p-8 sm:p-12 text-white mb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Comment ca marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Inscription gratuite</h3>
              <p className="text-sm text-gray-300">
                Creez votre profil pro en 5 minutes. Sans engagement ni frais.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Publiez vos offres</h3>
              <p className="text-sm text-gray-300">
                Ajoutez vos prestations, tarifs et disponibilites sur votre dashboard.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#FF6B35] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Recevez des groupes</h3>
              <p className="text-sm text-gray-300">
                Accueillez des voyageurs et developpez votre chiffre d&apos;affaires.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pret a nous rejoindre ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Rejoignez les partenaires qui font confiance a Eventy Life pour
            developper leur activite touristique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pro"
              className="inline-block bg-[#FF6B35] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#FF8F5E] transition-all shadow-lg"
            >
              Creer mon compte pro
            </Link>
            <a
              href="mailto:partenaires@eventylife.fr"
              className="inline-block bg-white text-[#0A1628] px-8 py-4 rounded-xl font-bold border-2 border-gray-200 hover:border-[#FF6B35] transition-all"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
