'use client';

import { useState } from 'react';
import Link from 'next/link';
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
};

export default function SuiviCommandePage() {
  const [orderRef, setOrderRef] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div style={{ backgroundColor: C.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #2d2d4e)`, color: 'white', paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="mx-auto max-w-3xl text-center">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', fontFamily: 'Playfair, serif' }}>
            Suivi de <span style={{ color: C.terra }}>commande</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>
            Retrouvez le statut de votre reservation en quelques clics.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-12">
        {/* Formulaire de recherche */}
        <div style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', padding: '2rem' }}>
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label
                htmlFor="orderRef"
                style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}
              >
                Reference de reservation
              </label>
              <input
                id="orderRef"
                type="text"
                value={orderRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderRef((e.target as HTMLInputElement).value)}
                placeholder="Ex: EVT-2026-XXXXX"
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.terra; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(199, 91, 57, 0.1)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                style={{ color: C.navy, fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}
              >
                Email utilise lors de la reservation
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="votre@email.com"
                style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '0.875rem', outline: 'none', transition: 'all 0.3s ease' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.terra; e.currentTarget.style.boxShadow = `0 0 0 2px rgba(199, 91, 57, 0.1)`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', backgroundColor: C.terra, color: 'white', padding: '0.75rem 1rem', borderRadius: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.terraLight; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.terra; }}
            >
              Rechercher ma reservation
            </button>
          </form>

          {searched && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: C.terraSoft, borderRadius: '12px', border: `1.5px solid ${C.terra}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🔍</span>
                <h3 style={{ fontWeight: '700', color: C.navy }}>Aucune reservation trouvee</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: C.muted, marginBottom: '1rem' }}>
                Verifiez votre reference et votre email, ou connectez-vous a votre
                espace client pour voir toutes vos reservations.
              </p>
              <Link
                href="/connexion"
                style={{ fontSize: '0.875rem', color: C.terra, fontWeight: '700', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Se connecter →
              </Link>
            </div>
          )}
        </div>

        {/* Info box */}
        <div style={{ marginTop: '2rem', backgroundColor: 'white', border: `1.5px solid ${C.border}`, borderRadius: '20px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', color: C.navy, marginBottom: '1rem' }}>Besoin d&apos;aide ?</h3>
          <div className="space-y-3 text-sm">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.125rem' }}>📧</span>
              <div>
                <p style={{ fontWeight: '700', color: C.navy }}>Par email</p>
                <p style={{ color: C.muted }}>contact@eventylife.fr - Reponse sous 24h</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.125rem' }}>📱</span>
              <div>
                <p style={{ fontWeight: '700', color: C.navy }}>Par telephone</p>
                <p style={{ color: C.muted }}>+33 (0)1 23 45 67 89 - Lun-Ven 9h-18h</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.125rem' }}>👤</span>
              <div>
                <p style={{ fontWeight: '700', color: C.navy }}>Espace client</p>
                <Link href="/connexion" style={{ color: C.terra, textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}>
                  Connectez-vous pour voir toutes vos reservations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
