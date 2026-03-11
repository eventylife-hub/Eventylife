'use client';

/**
 * Page À propos
 */

'use client';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'À Propos | Eventy Life',
  description: 'Découvrez l\'histoire et la mission d\'Eventy Life',
};

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-fade-up mb-12">
        <p style={{ color: C.gold, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="mb-3">
          Qui sommes-nous
        </p>
        <h1 style={{ color: C.navy, fontFamily: 'Playfair, serif', fontSize: '3rem', fontWeight: '700' }} className="mb-8">
          À propos d&apos;Eventy Life
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 animate-fade-up">
        <div>
          <p style={{ color: C.navy }} className="text-lg font-semibold mb-4 leading-relaxed">
            Eventy Life est une plateforme française spécialisée dans l&apos;organisation de voyages de groupe
            avec accompagnement humain. Depuis plusieurs années, nous offrons à nos clients des expériences
            de voyage inoubliables, organisées de A à Z.
          </p>
          <p style={{ color: C.muted }} className="text-base mb-4 leading-relaxed">
            Notre mission est de rendre accessible les voyages de qualité à tous, en proposant une
            alternative sûre et conviviale aux voyages en solitaire.
          </p>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${C.terraSoft}, ${C.goldSoft})`, borderRadius: '20px' }} className="aspect-square flex items-center justify-center text-9xl">
          ✈️
        </div>
      </div>

      <div className="mb-16 animate-fade-up">
        <p style={{ color: C.gold, fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }} className="mb-3">
          Nos convictions
        </p>
        <h2 style={{ color: C.navy, fontFamily: 'Playfair, serif', fontSize: '2rem', fontWeight: '700' }} className="mb-8">
          Nos valeurs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '❤️',
              title: 'Humain',
              description: 'L\'accompagnement humain est au cœur de notre démarche'
            },
            {
              icon: '🎯',
              title: 'Qualité',
              description: 'Nous ne faisons jamais de compromis sur la qualité des expériences'
            },
            {
              icon: '🌍',
              title: 'Durabilité',
              description: 'Nous favorisons le tourisme responsable et durable'
            }
          ].map((value: unknown, i: number) => (
            <div key={i} style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px' }} className="p-6 text-center">
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 style={{ color: C.navy }} className="font-bold text-lg mb-2">{value.title}</h3>
              <p style={{ color: C.muted }} className="text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', background: `linear-gradient(135deg, ${C.terra}, ${C.terraLight})` }} className="p-8 text-center animate-fade-up">
        <h2 style={{ color: 'white', fontFamily: 'Playfair, serif', fontSize: '1.875rem', fontWeight: '700' }} className="mb-4">
          Prêt à rejoindre notre communauté?
        </h2>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>
          Découvrez nos voyages et vivez une expérience unique avec Eventy Life
        </p>
        <Link href={ROUTES.VOYAGES}>
          <button style={{ backgroundColor: 'white', color: C.terra, padding: '12px 32px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: `0 4px 12px rgba(199, 91, 57, 0.2)` }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 20px rgba(199, 91, 57, 0.3)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 12px rgba(199, 91, 57, 0.2)`; }}>
            Découvrir nos voyages
          </button>
        </Link>
      </div>
    </div>
  );
}
