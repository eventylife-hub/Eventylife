'use client';

import Link from 'next/link';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  gold: '#D4A853',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E8E4DE',
  green: '#059669',
  greenBg: '#ECFDF5',
};

export default function CommentCaMarche() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: C.navy }}>
      {/* Hero Section */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2A2A3E 100%)`,
          color: C.white,
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 20px 0' }}>
          Comment ça marche ?
        </h1>
        <p style={{ fontSize: '20px', fontWeight: 300, margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Voyager avec Eventy, c’est simple comme bonjour
        </p>
      </section>

      {/* Pour les Voyageurs Section */}
      <section
        style={{
          background: C.cream,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: C.navy }}>
            Pour les voyageurs
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
            }}
          >
            {[
              {
                number: 1,
                icon: '&#128269;',
                title: 'Choisissez votre voyage',
                desc: 'Parcourez notre catalogue de destinations. Bus ou avion, week-end ou séjour, il y en a pour tous les goûts.',
              },
              {
                number: 2,
                icon: '&#128197;',
                title: 'Réservez en ligne',
                desc: 'Sélectionnez vos dates, le nombre de participants et payez en toute sécurité. Paiement en plusieurs fois possible.',
              },
              {
                number: 3,
                icon: '&#128230;',
                title: 'Préparez vos valises',
                desc: 'Vous recevez tous les détails : point de ramassage, horaires, programme détaillé, contacts.',
              },
              {
                number: 4,
                icon: '&#128652;',
                title: 'On vient vous chercher',
                desc: 'Le jour J, un bus grand tourisme vous récupère près de chez vous. Accompagnateur dédié à bord.',
              },
              {
                number: 5,
                icon: '&#127796;',
                title: 'Profitez !',
                desc: 'Hébergement, restauration, visites, tout est inclus. Vous n’avez qu’à profiter.',
              },
            ].map((step) => (
              <div
                key={step.number}
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Gradient Circle with Number */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.terra} 0%, ${C.gold} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 8px 20px rgba(199, 91, 57, 0.2)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: 700,
                      color: C.white,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div
                  style={{
                    fontSize: '40px',
                    marginBottom: '15px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: step.icon }}
                />

                {/* Title */}
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: C.navy }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: C.muted, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour les Partenaires Section */}
      <section
        style={{
          background: C.white,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: C.navy }}>
            Pour les partenaires
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '30px',
            }}
          >
            {[
              {
                number: 1,
                title: 'Inscription gratuite en 5 minutes',
              },
              {
                number: 2,
                title: 'Validation de votre profil sous 48h',
              },
              {
                number: 3,
                title: 'Formation en ligne de 2h offerte',
              },
              {
                number: 4,
                title: 'Commencez à organiser et gagner des commissions',
              },
            ].map((step) => (
              <div
                key={step.number}
                style={{
                  padding: '30px',
                  background: C.cream,
                  borderRadius: '12px',
                  border: `1px solid ${C.border}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '200px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(199, 91, 57, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.terra} 0%, ${C.gold} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ fontSize: '24px', fontWeight: 700, color: C.white }}>
                    {step.number}
                  </span>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 600, margin: 0, lineHeight: 1.5, color: C.navy }}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Garanties Section */}
      <section
        style={{
          background: C.cream,
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', marginBottom: '60px', color: C.navy }}>
            Nos garanties
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
            }}
          >
            {[
              {
                icon: '&#128274;',
                title: 'Paiement sécurisé',
                desc: 'Transactions chiffrées via Stripe',
              },
              {
                icon: '&#127891;',
                title: 'Agence immatricul&#233;e',
                desc: 'Atout France + garantie APST',
              },
              {
                icon: '&#128222;',
                title: 'Support réactif',
                desc: '\u00c9quipe disponible 6j/7',
              },
              {
                icon: '&#128170;',
                title: 'Satisfait ou accompagné',
                desc: 'On ne vous l\u00e2che jamais',
              },
            ].map((guarantee, idx) => (
              <div
                key={idx}
                style={{
                  padding: '40px 30px',
                  background: C.white,
                  borderRadius: '12px',
                  border: `2px solid ${C.border}`,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: '20px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: guarantee.icon }}
                />
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: C.navy }}>
                  {guarantee.title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: C.muted, margin: 0 }}>
                  {guarantee.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2A2A3E 100%)`,
          color: C.white,
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '20px' }}>
          Prêt à partir ?
        </h2>
        <p style={{ fontSize: '18px', fontWeight: 300, marginBottom: '40px', margin: '0 auto 40px', maxWidth: '500px' }}>
          Rejoignez des milliers de voyageurs heureux ou devenez partenaire d’Eventy
        </p>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <Link href="/voyages">
            <button
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${C.terra} 0%, ${C.gold} 100%)`,
                color: C.white,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(199, 91, 57, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(199, 91, 57, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(199, 91, 57, 0.3)';
              }}
            >
              Voir les voyages
            </button>
          </Link>

          <Link href="/devenir-pro">
            <button
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: 600,
                border: `2px solid ${C.white}`,
                borderRadius: '8px',
                background: 'transparent',
                color: C.white,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.white;
                e.currentTarget.style.color = C.navy;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = C.white;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Devenir partenaire
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
