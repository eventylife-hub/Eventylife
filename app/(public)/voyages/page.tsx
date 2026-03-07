'use client';

import React from 'react';
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

const voyages = [
  {
    slug: 'iles-eoliennes-baroque-sicilien',
    title: '\u00celes \u00c9oliennes & Baroque Sicilien',
    country: 'IT',
    countryLabel: 'Italie',
    image: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?w=600&h=400&fit=crop',
    dates: '15 Juin \u2013 22 Juin 2026',
    duration: '8 jours',
    basePrice: 1890,
    spotsLeft: 6,
    transport: 'Bus grand tourisme',
    badge: '6 PLACES RESTANTES',
    badgeColor: '#DC2626',
    tags: ['Culture', 'Nature', '\u00celes'],
  },
  {
    slug: 'maroc-imperial',
    title: 'Maroc Imp\u00e9rial & Sahara',
    country: 'MA',
    countryLabel: 'Maroc',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=400&fit=crop',
    dates: '20 \u2013 27 Avril 2026',
    duration: '8 jours',
    basePrice: 599,
    spotsLeft: 14,
    transport: 'Bus grand tourisme',
    badge: 'D\u00c9PART CONFIRM\u00c9',
    badgeColor: '#059669',
    tags: ['Culture', 'D\u00e9sert', 'M\u00e9dina'],
  },
  {
    slug: 'andalousie-flamenco',
    title: 'Andalousie, Flamenco & Tapas',
    country: 'ES',
    countryLabel: 'Espagne',
    image: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=600&h=400&fit=crop',
    dates: '5 \u2013 12 Mai 2026',
    duration: '8 jours',
    basePrice: 549,
    spotsLeft: 20,
    transport: 'Bus grand tourisme',
    badge: 'D\u00c9PART CONFIRM\u00c9',
    badgeColor: '#059669',
    tags: ['Culture', 'Gastronomie', 'Architecture'],
  },
  {
    slug: 'rome-florence-venise',
    title: 'Rome, Florence & Venise',
    country: 'IT',
    countryLabel: 'Italie',
    image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=600&h=400&fit=crop',
    dates: '10 \u2013 18 Mai 2026',
    duration: '9 jours',
    basePrice: 729,
    spotsLeft: 12,
    transport: 'Bus grand tourisme',
    badge: 'NOUVEAU',
    badgeColor: '#7C3AED',
    tags: ['Culture', 'Art', 'Gastronomie'],
  },
  {
    slug: 'tunisie-hammamet',
    title: 'Tunisie \u2014 Hammamet & Sidi Bou Sa\u00efd',
    country: 'TN',
    countryLabel: 'Tunisie',
    image: 'https://images.unsplash.com/photo-1565109441139-bbc677963da9?w=600&h=400&fit=crop',
    dates: '20 \u2013 27 Avril 2026',
    duration: '8 jours',
    basePrice: 599,
    spotsLeft: 18,
    transport: 'Bus grand tourisme',
    badge: 'D\u00c9PART CONFIRM\u00c9',
    badgeColor: '#059669',
    tags: ['Plage', 'Culture', 'D\u00e9tente'],
  },
  {
    slug: 'croatie-dubrovnik',
    title: 'Croatie \u2014 Dubrovnik & Split',
    country: 'HR',
    countryLabel: 'Croatie',
    image: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop',
    dates: '1 \u2013 8 Juillet 2026',
    duration: '8 jours',
    basePrice: 849,
    spotsLeft: 22,
    transport: 'Bus grand tourisme',
    badge: 'NOUVEAU',
    badgeColor: '#7C3AED',
    tags: ['Plage', '\u00celes', 'Histoire'],
  },
  {
    slug: 'portugal-lisbonne-porto',
    title: 'Portugal \u2014 Lisbonne & Porto',
    country: 'PT',
    countryLabel: 'Portugal',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop',
    dates: '15 \u2013 22 Septembre 2026',
    duration: '8 jours',
    basePrice: 679,
    spotsLeft: 24,
    transport: 'Bus grand tourisme',
    badge: 'BIENT\u00d4T',
    badgeColor: '#D97706',
    tags: ['Culture', 'Gastronomie', 'Oc\u00e9an'],
  },
  {
    slug: 'grece-athenes-santorin',
    title: 'Gr\u00e8ce \u2014 Ath\u00e8nes & Santorin',
    country: 'GR',
    countryLabel: 'Gr\u00e8ce',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop',
    dates: '24 Ao\u00fbt \u2013 1 Sept 2026',
    duration: '9 jours',
    basePrice: 1090,
    spotsLeft: 16,
    transport: 'Avion + bus',
    badge: 'POPULAIRE',
    badgeColor: '#DC2626',
    tags: ['\u00celes', 'Plage', 'Histoire'],
  },
];

const filters = [
  { label: 'Tous', active: true },
  { label: 'Bus', active: false },
  { label: 'Avion', active: false },
  { label: '- de 700\u20ac', active: false },
  { label: 'Week-end', active: false },
  { label: 'Culture', active: false },
  { label: 'Plage', active: false },
  { label: 'Nature', active: false },
];

const destinations = [
  { code: 'MA', label: 'Maroc' },
  { code: 'ES', label: 'Espagne' },
  { code: 'IT', label: 'Italie' },
  { code: 'TN', label: 'Tunisie' },
  { code: 'HR', label: 'Croatie' },
  { code: 'PT', label: 'Portugal' },
  { code: 'GR', label: 'Gr\u00e8ce' },
];

function VoyageCard({ v }: { v: typeof voyages[0] }) {
  return (
    <Link href={'/voyages/' + v.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: C.white,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid ' + C.border,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img src={v.image} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Badge */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: v.badgeColor, color: C.white,
            padding: '6px 12px', borderRadius: 8,
            fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
          }}>{v.badge}</div>
          {/* Heart */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer',
          }}>&#9825;</div>
          {/* Transport badge */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.6)', color: C.white,
            padding: '4px 10px', borderRadius: 6,
            fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>&#128652; {v.transport}</div>
          {/* Country flag */}
          <div style={{
            position: 'absolute', bottom: 12, left: 12,
            background: 'rgba(255,255,255,0.95)',
            padding: '4px 10px', borderRadius: 6,
            fontSize: 12, fontWeight: 600, color: C.navy,
          }}>{v.country} {v.countryLabel}</div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 20px 20px' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 8px', lineHeight: 1.3 }}>{v.title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.muted, marginBottom: 8 }}>
            <span>&#128197; {v.dates}</span>
            <span>&#183;</span>
            <span>{v.duration}</span>
          </div>
          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {v.tags.map((t, i) => (
              <span key={i} style={{
                background: C.cream, color: C.navy,
                padding: '4px 10px', borderRadius: 20,
                fontSize: 12, fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
          {/* Price + CTA */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted }}>{'\u00e0'} partir de</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.terra }}>{v.basePrice}&#8364;</div>
              <div style={{ fontSize: 12, color: C.muted }}>par personne</div>
            </div>
            <div style={{
              background: C.terra, color: C.white,
              padding: '12px 24px', borderRadius: 12,
              fontWeight: 700, fontSize: 15,
            }}>R{'\u00e9'}server</div>
          </div>
          {/* Spots */}
          {v.spotsLeft <= 10 && (
            <div style={{
              marginTop: 12, background: v.spotsLeft <= 6 ? '#FEF2F2' : C.greenBg,
              borderRadius: 8, padding: '8px 12px',
              fontSize: 13, fontWeight: 600,
              color: v.spotsLeft <= 6 ? '#DC2626' : C.green,
              textAlign: 'center',
            }}>&#9203; Plus que {v.spotsLeft} places sur ce d{'\u00e9'}part !</div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function VoyagesPage() {
  return (
    <div style={{ background: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, ' + C.navy + ' 0%, #2D2B55 100%)',
        padding: '60px 20px 50px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, color: C.white, margin: '0 0 12px' }}>
          Nos voyages en groupe
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: '0 0 30px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          D{'\u00e9'}couvrez nos destinations avec accompagnement humain porte-{'\u00e0'}-porte. Ramassage pr{'\u00e8'}s de chez vous, z{'\u00e9'}ro logistique.
        </p>
        {/* Search bar */}
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: C.white, borderRadius: 16,
          padding: '12px 16px', display: 'flex',
          alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>&#128269;</span>
          <input
            type="text"
            placeholder={'Rechercher une destination, un pays...'}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 16, color: C.navy, background: 'transparent',
            }}
          />
          <div style={{
            background: C.terra, color: C.white,
            padding: '10px 20px', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Rechercher</div>
        </div>
      </div>

      {/* Destination pills */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {destinations.map((d, i) => (
            <button key={i} style={{
              background: C.white, border: '1px solid ' + C.border,
              borderRadius: 20, padding: '8px 16px',
              fontSize: 14, fontWeight: 500, color: C.navy,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>{d.code}</span> {d.label}
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {filters.map((f, i) => (
            <button key={i} style={{
              background: f.active ? C.terra : C.white,
              color: f.active ? C.white : C.navy,
              border: f.active ? 'none' : '1px solid ' + C.border,
              borderRadius: 20, padding: '8px 18px',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, color: C.muted }}>
            <span style={{ fontWeight: 700, color: C.navy }}>{voyages.length} voyages</span> disponibles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: C.muted }}>
            Trier par :
            <select style={{
              border: '1px solid ' + C.border, borderRadius: 8,
              padding: '6px 12px', fontSize: 14, color: C.navy,
              background: C.white, cursor: 'pointer',
            }}>
              <option>Prochains d{'\u00e9'}parts</option>
              <option>Prix croissant</option>
              <option>Prix d{'\u00e9'}croissant</option>
              <option>Popularit{'\u00e9'}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
          paddingBottom: 60,
        }}>
          {voyages.map((v, i) => (
            <VoyageCard key={i} v={v} />
          ))}
        </div>

        {/* USP Banner */}
        <div style={{
          background: C.white, borderRadius: 20, padding: '40px 32px',
          marginBottom: 60, border: '1px solid ' + C.border,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
          textAlign: 'center',
        }}>
          {[
            { icon: '&#128652;', title: 'Ramassage', desc: 'Pr\u00e8s de chez vous' },
            { icon: '&#128100;', title: 'Accompagnateur', desc: 'D\u00e9di\u00e9 tout le voyage' },
            { icon: '&#9989;', title: '3x sans frais', desc: 'Paiement s\u00e9curis\u00e9' },
            { icon: '&#128274;', title: 'Garantie APST', desc: 'Protection totale' },
          ].map((u, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: u.icon }} />
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 4 }}>{u.title}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{u.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
