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

export default function APropos() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* HERO SECTION */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2D2D4A 100%)`,
          color: C.white,
          padding: '100px 40px',
          textAlign: 'center',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '56px',
            fontWeight: '300',
            letterSpacing: '2px',
            margin: '0 0 24px 0',
            maxWidth: '800px',
          }}
        >
          Notre histoire
        </h1>
        <p
          style={{
            fontSize: '20px',
            fontWeight: '300',
            maxWidth: '700px',
            lineHeight: '1.8',
            opacity: 0.95,
            margin: 0,
          }}
        >
          Eventy Life est n&#233;e d&apos;une conviction simple: le voyage en groupe doit être
          accessible, humain et sans stress.
        </p>
      </section>

      {/* MISSION SECTION */}
      <section
        style={{
          background: C.cream,
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '300',
              color: C.navy,
              margin: '0 0 32px 0',
              letterSpacing: '1px',
            }}
          >
            Notre mission
          </h2>
          <div
            style={{
              background: C.white,
              padding: '48px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(26, 26, 46, 0.08)',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.9',
                color: C.navy,
                margin: '0 0 24px 0',
                fontWeight: '500',
              }}
            >
              Rendre le voyage en groupe accessible &#224; tous.
            </p>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: C.muted,
                margin: 0,
              }}
            >
              Accompagnement humain porte-à-porte, du ramassage au retour. Nous croyons que
              chaque voyageur mérite une expérience fluide, personnalisée et riche en
              souvenirs.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section
        style={{
          background: C.white,
          padding: '80px 40px',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '300',
              color: C.navy,
              margin: '0 0 60px 0',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            Nos valeurs
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '32px',
            }}
          >
            {/* Bienveillance */}
            <div
              style={{
                padding: '32px',
                background: C.cream,
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}
              >
                &#10084;
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: C.navy,
                  margin: '0 0 12px 0',
                }}
              >
                Bienveillance
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: C.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Le client doit se sentir aimé
              </p>
            </div>

            {/* Accessibilit&#233; */}
            <div
              style={{
                padding: '32px',
                background: C.greenBg,
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}
              >
                &#127757;
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: C.navy,
                  margin: '0 0 12px 0',
                }}
              >
                Accessibilité
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: C.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Des voyages pour tous les budgets
              </p>
            </div>

            {/* Confiance */}
            <div
              style={{
                padding: '32px',
                background: C.cream,
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}
              >
                &#129309;
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: C.navy,
                  margin: '0 0 12px 0',
                }}
              >
                Confiance
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: C.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Agence immatriculée, garantie APST
              </p>
            </div>

            {/* Innovation */}
            <div
              style={{
                padding: '32px',
                background: C.greenBg,
                borderRadius: '12px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}
              >
                &#128640;
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: C.navy,
                  margin: '0 0 12px 0',
                }}
              >
                Innovation
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: C.muted,
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                Technologie au service de l&apos;humain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section
        style={{
          background: C.cream,
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '300',
              color: C.navy,
              margin: '0 0 32px 0',
              letterSpacing: '1px',
            }}
          >
            L&apos;équipe
          </h2>
          <div
            style={{
              background: C.white,
              padding: '48px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(26, 26, 46, 0.08)',
            }}
          >
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.9',
                color: C.navy,
                margin: 0,
              }}
            >
              Fondée par des passionnés de voyage et de technologie, notre équipe
              réunit expertise dans le tourisme, développement logiciel et service client
              de qualité. Ensemble, nous construisons le futur du voyage en groupe.
            </p>
          </div>
        </div>
      </section>

      {/* KEY FIGURES SECTION */}
      <section
        style={{
          background: C.white,
          padding: '80px 40px',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '300',
              color: C.navy,
              margin: '0 0 60px 0',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            Chiffres clés
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px',
            }}
          >
            {/* Stat 1: Partners */}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '300',
                  color: C.terra,
                  margin: '0 0 12px 0',
                }}
              >
                150+
              </div>
              <p
                style={{
                  fontSize: '16px',
                  color: C.muted,
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Partenaires
              </p>
            </div>

            {/* Stat 2: Destinations */}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '300',
                  color: C.gold,
                  margin: '0 0 12px 0',
                }}
              >
                8
              </div>
              <p
                style={{
                  fontSize: '16px',
                  color: C.muted,
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Destinations
              </p>
            </div>

            {/* Stat 3: Travelers */}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '300',
                  color: C.green,
                  margin: '0 0 12px 0',
                }}
              >
                2000+
              </div>
              <p
                style={{
                  fontSize: '16px',
                  color: C.muted,
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Voyageurs
              </p>
            </div>

            {/* Stat 4: Satisfaction */}
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '300',
                  color: C.terra,
                  margin: '0 0 12px 0',
                }}
              >
                98%
              </div>
              <p
                style={{
                  fontSize: '16px',
                  color: C.muted,
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                Satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          background: `linear-gradient(135deg, ${C.navy} 0%, #2D2D4A 100%)`,
          color: C.white,
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontSize: '36px',
              fontWeight: '300',
              margin: '0 0 24px 0',
              letterSpacing: '1px',
            }}
          >
            Prêts à partir ?
          </h2>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '300',
              margin: '0 0 40px 0',
              opacity: 0.9,
              lineHeight: '1.6',
            }}
          >
            Découvrez nos voyages inoubliables et rejoignez des milliers de voyageurs
            satisfaits.
          </p>
          <Link href="/voyages">
            <button
              style={{
                background: C.gold,
                color: C.navy,
                border: 'none',
                padding: '16px 48px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.background = '#C49533';
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLButtonElement).style.boxShadow =
                  '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.background = C.gold;
                (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              Découvrez nos voyages
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
