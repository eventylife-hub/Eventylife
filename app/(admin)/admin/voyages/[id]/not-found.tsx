'use client';

import Link from 'next/link';

export default function AdminVoyageNotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#1A1A2E',
        borderRadius: '16px',
        margin: '2rem',
      }}
    >
      <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>✈️</p>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '0.75rem',
          fontFamily: 'var(--font-fraunces, Fraunces, serif)',
        }}
      >
        Voyage introuvable
      </h1>
      <p style={{ color: '#94A3B8', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '28rem' }}>
        Ce voyage n'existe pas ou a été supprimé du système.
      </p>
      <Link
        href="/admin/voyages"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          backgroundColor: '#E63946',
          color: 'white',
          borderRadius: '12px',
          fontWeight: 600,
          textDecoration: 'none',
          fontSize: '1rem',
        }}
      >
        Retour aux voyages
      </Link>
    </div>
  );
}
