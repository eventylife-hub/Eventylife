'use client';

import Link from 'next/link';

const colors = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  gold: '#D4A853',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E8E4DE',
  green: '#059669',
};

const voyages = [
  { id: 1, title: 'Iles Eoliennes', price: 1890, transport: 'Avion', duration: '8 jours', slug: 'iles-eoliennes' },
  { id: 2, title: 'Maroc Imperial', price: 599, transport: 'Bus', duration: '6 jours', slug: 'maroc-imperial' },
  { id: 3, title: 'Andalousie', price: 549, transport: 'Bus', duration: '5 jours', slug: 'andalousie' },
  { id: 4, title: 'Rome Florence Venise', price: 729, transport: 'Avion', duration: '7 jours', slug: 'rome-florence-venise' },
];

const steps = [
  { num: 1, title: 'Choisissez', desc: 'Parcourez nos destinations et s\u00e9lectionnez votre voyage', emoji: '&#x1F6EB;' },
  { num: 2, title: 'R\u00e9servez', desc: 'Compl\u00e9tez votre inscription en quelques clics', emoji: '&#x1F4CB;' },
  { num: 3, title: 'Voyagez', desc: 'Partez accompagn\u00e9 en groupe et vivez l\'exp\u00e9rience', emoji: '&#x1F389;' },
];

const testimonials = [
  {
    quote: 'Un voyage extraordinaire! Tres bien organis\u00e9 et l\'ambiance de groupe \u00e9tait fantastique.',
    author: 'Sophie M.',
    role: 'Voyageuse',
  },
  {
    quote: 'Eventy rend les voyages accessibles et conviviaux. Je recommande vivement!',
    author: 'Pierre D.',
    role: 'Client r\u00e9guli\u00e8re',
  },
  {
    quote: 'Parfait pour voyager sans stress. Tout est pr\u00e9vu, il n\'y a qu\u00e0 profiter!',
    author: 'Marie T.',
    role: 'Retraita\u00e9',
  },
];

export default function Homepage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#1F2937' }}>
      {/* Hero Section */}
      <section style={{
        background: colors.navy,
        color: colors.white,
        padding: '60px 20px',
        textAlign: 'center',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', margin: '0 0 20px 0', fontWeight: 700 }}>
          Voyagez en groupe, vivez l&#39;aventure
        </h1>
        <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 0 40px 0', lineHeight: 1.6, color: '#E5E7EB' }}>
          Des voyages accompagn&#233;s en bus et en avion vers les plus belles destinations. Vivez l&#39;exp&#233;rience en groupe avec Eventy.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/voyages" style={{
            background: colors.terra,
            color: colors.white,
            padding: '12px 30px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            transition: 'background 0.3s',
          }}>
            D&#233;couvrir nos voyages
          </Link>
          <Link href="/devenir-pro" style={{
            background: 'transparent',
            color: colors.white,
            padding: '12px 30px',
            border: `2px solid ${colors.gold}`,
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            transition: 'all 0.3s',
          }}>
            Devenir partenaire
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        background: colors.cream,
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        textAlign: 'center',
      }}>
        <div>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.terra, margin: 0 }}>5000+</p>
          <p style={{ color: colors.muted, margin: '5px 0 0 0' }}>Voyageurs satisfaits</p>
        </div>
        <div>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.terra, margin: 0 }}>150+</p>
          <p style={{ color: colors.muted, margin: '5px 0 0 0' }}>Destinations</p>
        </div>
        <div>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.terra, margin: 0 }}>98%</p>
          <p style={{ color: colors.muted, margin: '5px 0 0 0' }}>Satisfaction client</p>
        </div>
        <div>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.terra, margin: 0 }}>15+</p>
          <p style={{ color: colors.muted, margin: '5px 0 0 0' }}>Ans d&#39;exp&#233;rience</p>
        </div>
      </section>

      {/* Featured Voyages */}
      <section style={{ padding: '60px 20px', background: colors.white }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', color: colors.navy }}>
          Nos voyages en vedette
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {voyages.map((voyage) => (
            <Link key={voyage.id} href={`/voyages/${voyage.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: colors.white,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  height: '180px',
                  background: `hsl(${voyage.id * 45}, 65%, 60%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.white,
                  fontSize: '14px',
                  fontWeight: 600,
                }}>
                  Image {voyage.title}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: colors.navy }}>{voyage.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                    <span style={{ color: colors.muted, fontSize: '13px' }}>{voyage.transport}</span>
                    <span style={{ color: colors.muted, fontSize: '13px' }}>{voyage.duration}</span>
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: colors.terra, margin: '10px 0 0 0' }}>
                    &#224; partir de {voyage.price}&#8364;
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '60px 20px', background: colors.cream }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '50px', color: colors.navy }}>
          Comment ca marche
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {steps.map((step) => (
            <div key={step.num} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '15px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {step.emoji}
              </div>
              <h3 style={{ fontSize: '20px', color: colors.navy, margin: '0 0 10px 0' }}>{step.title}</h3>
              <p style={{ color: colors.muted, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 20px', background: colors.white }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px', color: colors.navy }}>
          Ce que disent nos clients
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          {testimonials.map((test, idx) => (
            <div key={idx} style={{
              background: colors.cream,
              padding: '25px',
              borderRadius: '8px',
              borderLeft: `4px solid ${colors.gold}`,
            }}>
              <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '0 0 15px 0', color: colors.navy }}>
                &quot;{test.quote}&quot;
              </p>
              <div>
                <p style={{ fontWeight: 600, margin: '0', color: colors.terra }}>{test.author}</p>
                <p style={{ fontSize: '13px', color: colors.muted, margin: '3px 0 0 0' }}>{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partners CTA */}
      <section style={{
        background: colors.navy,
        color: colors.white,
        padding: '50px 20px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '28px', margin: '0 0 15px 0' }}>Vous etes une agence ou un prestataire?</h2>
        <p style={{ fontSize: '16px', margin: '0 0 30px 0', maxWidth: '500px', margin: '0 auto 30px' }}>
          Rejoignez notre reseau de partenaires et d&#233;veloppez votre activit&#233; avec Eventy.
        </p>
        <Link href="/devenir-pro" style={{
          background: colors.terra,
          color: colors.white,
          padding: '12px 30px',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 600,
          display: 'inline-block',
        }}>
          Devenir partenaire
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0F0F1E',
        color: colors.white,
        padding: '40px 20px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto 40px',
          fontSize: '14px',
        }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px' }}>Eventy</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/a-propos" style={{ color: '#D1D5DB', textDecoration: 'none' }}>A propos</Link>
              <Link href="/comment-ca-marche" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Comment ca marche</Link>
            </nav>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px' }}>Client</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/voyages" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Nos voyages</Link>
              <Link href="/contact" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Contact</Link>
            </nav>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px' }}>Legal</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/mentions-legales" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Mentions legales</Link>
              <Link href="/politique-confidentialite" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Confidentialite</Link>
              <Link href="/cgv" style={{ color: '#D1D5DB', textDecoration: 'none' }}>CGV</Link>
            </nav>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '12px' }}>Pro</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/devenir-pro" style={{ color: '#D1D5DB', textDecoration: 'none' }}>Devenir partenaire</Link>
              <Link href="/faq" style={{ color: '#D1D5DB', textDecoration: 'none' }}>FAQ</Link>
            </nav>
          </div>
        </div>
        <div style={{
          borderTop: `1px solid ${colors.border}`,
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#9CA3AF',
        }}>
          &copy; 2026 Eventy. Tous droits reserves.
        </div>
      </footer>
    </div>
  );
}
