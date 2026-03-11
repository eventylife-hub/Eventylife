'use client';

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
    desc: 'Remplissez vos capacites avec des groupes reguliers toute l\'annee.',
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

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: '#FEF0EB',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
};

export default function PartenairesPage() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, color: 'white', paddingTop: '5rem', paddingBottom: '5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="mx-auto max-w-5xl text-center">
          <span style={{ backgroundColor: 'rgba(199, 91, 57, 0.2)', color: C.terra, padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '700', display: 'inline-block', marginBottom: '1.5rem' }}>
            Partenariat
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1.5rem', fontFamily: 'Playfair, serif' }} className="sm:text-5xl mb-6">
            Developpez votre activite avec{' '}
            <span style={{ color: C.terra }}>Eventy Life</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '42rem' }} className="mx-auto mb-8">
            Rejoignez notre reseau de partenaires et accedez a des milliers de
            voyageurs. Inscription gratuite, commission uniquement sur les
            reservations.
          </p>
          <Link
            href="/pro"
            style={{ display: 'inline-block', backgroundColor: C.terra, color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', fontSize: '1.125rem', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: `0 10px 25px rgba(199, 91, 57, 0.2)` }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.terraLight; e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.terra; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Devenir partenaire →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Avantages */}
        <div className="text-center mb-12">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: C.navy, marginBottom: '1rem', fontFamily: 'Playfair, serif' }}>
            Pourquoi devenir partenaire ?
          </h2>
          <p style={{ color: C.muted, maxWidth: '26rem' }} className="mx-auto">
            Des avantages concrets pour faire grandir votre business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {avantages.map((a, i) => (
            <div
              key={i}
              style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', padding: '1.5rem', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: '1.875rem', display: 'block', marginBottom: '1rem' }}>{a.icon}</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>{a.title}</h3>
              <p style={{ fontSize: '0.875rem', color: C.muted }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Types de partenaires */}
        <div className="text-center mb-12">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: C.navy, marginBottom: '1rem', fontFamily: 'Playfair, serif' }}>
            Qui peut devenir partenaire ?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
          {typePartenaires.map((t, i) => (
            <div
              key={i}
              style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', padding: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: '2.25rem', flexShrink: 0 }}>{t.icon}</span>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>{t.type}</h3>
                <p style={{ fontSize: '0.875rem', color: C.muted }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment ca marche */}
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, borderRadius: '20px', padding: '2rem', color: 'white', paddingTop: '3rem', paddingBottom: '3rem' }} className="sm:p-12 mb-20">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', textAlign: 'center', marginBottom: '2.5rem', fontFamily: 'Playfair, serif' }}>Comment ca marche ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: C.terra, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem' }}>
                1
              </div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Inscription gratuite</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                Creez votre profil pro en 5 minutes. Sans engagement ni frais.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: C.terra, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem' }}>
                2
              </div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Publiez vos offres</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                Ajoutez vos prestations, tarifs et disponibilites sur votre dashboard.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: C.terra, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem' }}>
                3
              </div>
              <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Recevez des groupes</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                Accueillez des voyageurs et developpez votre chiffre d&apos;affaires.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: C.navy, marginBottom: '1rem', fontFamily: 'Playfair, serif' }}>
            Pret a nous rejoindre ?
          </h2>
          <p style={{ color: C.muted, marginBottom: '2rem', maxWidth: '32rem' }} className="mx-auto">
            Rejoignez les partenaires qui font confiance a Eventy Life pour
            developper leur activite touristique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pro"
              style={{ display: 'inline-block', backgroundColor: C.terra, color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: `0 10px 25px rgba(199, 91, 57, 0.2)` }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.terraLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.terra; }}
            >
              Creer mon compte pro
            </Link>
            <a
              href="mailto:partenaires@eventylife.fr"
              style={{ display: 'inline-block', backgroundColor: 'white', color: C.navy, padding: '1rem 2rem', borderRadius: '12px', fontWeight: '700', border: `2px solid ${C.border}`, textDecoration: 'none', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.terra; e.currentTarget.style.color = C.terra; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy; }}
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
