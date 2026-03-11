import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Article Blog Eventy Life';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { slug: string } }) {
  const title = decodeURIComponent(params.slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 60%, #1A1A2E 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbe décoratif terra */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(199,91,57,0.4) 0%, transparent 70%)',
          }}
        />
        {/* Orbe décoratif ocean */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-40px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,119,182,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Badge Blog */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(199,91,57,0.2)',
            border: '1px solid rgba(199,91,57,0.4)',
          }}
        >
          <span style={{ fontSize: '16px', color: '#C75B39', fontWeight: 700 }}>
            📝 BLOG EVENTY LIFE
          </span>
        </div>

        {/* Titre article */}
        <div
          style={{
            display: 'flex',
            textAlign: 'center',
            maxWidth: '900px',
            padding: '0 40px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 50 ? '36px' : '44px',
              fontWeight: 800,
              color: '#FAF7F2',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Séparateur */}
        <div
          style={{
            width: '80px',
            height: '4px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #C75B39, #D4A853)',
            marginTop: '28px',
            marginBottom: '28px',
          }}
        />

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            borderRadius: '14px',
            background: '#C75B39',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 700,
          }}
        >
          Lire l&apos;article →
        </div>

        {/* Logo en bas */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px', color: 'rgba(250,247,242,0.5)' }}>
            eventy.fr/blog
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
