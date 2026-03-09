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

export default function BrochurePage() {
  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, color: 'white', paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="mx-auto max-w-4xl text-center">
          <h1 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Playfair, serif' }} className="sm:text-5xl mb-4">
            Nos <span style={{ color: C.terra }}>Brochures</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: '42rem' }} className="mx-auto">
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
              style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              className="sm:flex-row items-start sm:p-8"
            >
              <div style={{ width: '5rem', height: '5rem', background: `linear-gradient(135deg, ${C.terra}, ${C.terraLight})`, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.875rem', flexShrink: 0 }}>
                {b.icon}
              </div>
              <div className="flex-1">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: C.navy, marginBottom: '0.5rem' }}>{b.title}</h2>
                <p style={{ color: C.muted, marginBottom: '0.75rem' }}>{b.desc}</p>
                <span style={{ fontSize: '0.75rem', color: C.muted }}>{b.pages} - PDF</span>
              </div>
              <button style={{ backgroundColor: C.terra, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', whiteSpace: 'nowrap', alignSelf: 'center', marginTop: '1rem' }} className="sm:mt-0 sm:self-center" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.terraLight; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.terra; }}>
                Telecharger
              </button>
            </div>
          ))}
        </div>

        {/* Demande brochure par email */}
        <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, borderRadius: '20px', padding: '2rem', color: 'white', textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }} className="sm:p-12">
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Playfair, serif' }} className="sm:text-3xl mb-4">
            Recevez la brochure par email
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem', maxWidth: '32rem' }} className="mx-auto">
            Entrez votre email pour recevoir notre catalogue complet directement
            dans votre boite mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email..."
              style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', color: C.navy, border: 'none', outline: 'none' }}
            />
            <button style={{ backgroundColor: C.terra, color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.terraLight; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.terra; }}>
              Envoyer
            </button>
          </div>
        </div>

        {/* Back to voyages */}
        <div className="mt-12 text-center">
          <Link
            href="/voyages"
            style={{ color: C.terra, fontWeight: '700', textDecoration: 'none', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            ← Voir tous nos voyages
          </Link>
        </div>
      </div>
    </div>
  );
}
