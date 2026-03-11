/**
 * Page 404 pour le checkout — Design V4
 */

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutNotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream, #FAF7F2)', padding: 16 }}>
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="flex justify-center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(199,91,57,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle style={{ width: 32, height: 32, color: 'var(--terra, #C75B39)' }} />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              color: 'var(--navy, #1A1A2E)',
              fontFamily: 'var(--font-playfair, Playfair Display, serif)',
            }}
          >
            Oups !
          </h1>
          <p style={{ color: '#6B7280' }}>
            La page de checkout n&apos;a pas pu être trouvée.
          </p>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
          Le voyage ou la session de réservation n&apos;existe plus.
        </p>

        <Link
          href={ROUTES.VOYAGES}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 12,
            background: 'var(--terra, #C75B39)',
            color: '#FAF7F2',
            fontWeight: 700,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          Retour aux voyages
        </Link>
      </div>
    </div>
  );
}
