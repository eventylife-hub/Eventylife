/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Voyage Eventy Life';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG Image dynamique pour les pages voyage détail
 * Affiche titre, destination, prix, durée sur fond navy premium
 */
export default function Image({ params }: { params: { slug: string } }) {
  // Decode le slug pour un titre lisible
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
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(145deg, #1A1A2E 0%, #0A0A1A 60%, #1A1A2E 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbes décoratifs */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-30px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,119,182,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Top : Logo + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6B35, #FF8F5E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              ✈️
            </div>
            <span style={{ color: '#FFFFFF', fontSize: '28px', fontWeight: 700 }}>
              Eventy.Life
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 20px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span style={{ fontSize: '16px' }}>🚌</span>
            <span style={{ color: '#FAF7F2', fontSize: '16px', fontWeight: 500 }}>
              Voyage de groupe accompagné
            </span>
          </div>
        </div>

        {/* Centre : Titre du voyage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              color: '#D4A853',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
            }}
          >
            Découvrez ce voyage
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: '900px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </span>
        </div>

        {/* Bottom : Tagline + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FAF7F2',
                fontSize: '16px',
              }}
            >
              <span>📍</span>
              <span>Accompagnement porte-à-porte</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FAF7F2',
                fontSize: '16px',
              }}
            >
              <span>⭐</span>
              <span>Tout inclus</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #C75B39, #D97B5E)',
              padding: '14px 32px',
              borderRadius: '14px',
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            Voir les détails →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
