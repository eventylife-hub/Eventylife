import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Eventy Life — Voyages de Groupe avec Accompagnement';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG Image par défaut — page d'accueil Eventy Life
 * Design navy + sun/terra gradient
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbe décoratif sun */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Orbe décoratif ocean */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,119,182,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#FF6B35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            E
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#FAF7F2',
              letterSpacing: '-0.02em',
            }}
          >
            Eventy.Life
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(250, 247, 242, 0.8)',
            textAlign: 'center',
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Voyages de groupe avec accompagnement humain porte-à-porte
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Bus & Avion', 'Prix justes', 'Qualité garantie'].map((text) => (
            <div
              key={text}
              style={{
                padding: '10px 24px',
                borderRadius: 999,
                background: 'rgba(255, 107, 53, 0.15)',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                color: '#FF6B35',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 18,
            color: 'rgba(250, 247, 242, 0.4)',
          }}
        >
          eventylife.fr
        </div>
      </div>
    ),
    { ...size },
  );
}
