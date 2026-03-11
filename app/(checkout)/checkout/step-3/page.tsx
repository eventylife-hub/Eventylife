'use client';

/**
 * ÉTAPE 3: Paiement
 * Options de paiement:
 * 1. "Payer tout" - Paiement complet Stripe
 * 2. "Partager le paiement" - Split-pay avec invitations
 */

'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { api } from '@/lib/api';
import { PriceSummary } from '@/components/checkout/price-summary';
import { formatPrice } from '@/lib/utils';
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

export default function CheckoutStep3Page() {
  const router = useRouter();
  const params = useParams();
  const bookingGroupId = params.id as string;

  const { rooms, totalAmountTTC, setCurrentStep } = useCheckoutStore();

  const [paymentMode, setPaymentMode] = useState<'full' | 'split'>('full');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Créer la session de paiement Stripe
      const response = await api.post(`/checkout/${bookingGroupId}/payment`);

      const { url } = response.data as { url: string };

      // Rediriger vers Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la session';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.cream,
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: C.navy,
            }}
          >
            Paiement
          </h1>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
              padding: '1rem',
              color: C.terra,
            }}
          >
            {error}
          </div>
        )}

        <PriceSummary rooms={rooms} />

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: C.navy,
            }}
          >
            Mode de paiement
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: `1.5px solid ${C.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = C.goldSoft;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'white';
              }}
            >
              <input
                type="radio"
                name="payment-mode"
                value="full"
                checked={paymentMode === 'full'}
                onChange={(e) => setPaymentMode((e.target as HTMLInputElement).value as 'full' | 'split')}
                style={{
                  marginRight: '1rem',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: C.terra,
                }}
              />
              <div>
                <p style={{ fontWeight: '600', color: C.navy, marginBottom: '0.25rem' }}>
                  Payer le montant complet
                </p>
                <p style={{ fontSize: '0.875rem', color: C.muted }}>
                  {formatPrice(totalAmountTTC)}
                </p>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: `1.5px solid ${C.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = C.forestBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'white';
              }}
            >
              <input
                type="radio"
                name="payment-mode"
                value="split"
                checked={paymentMode === 'split'}
                onChange={(e) => setPaymentMode((e.target as HTMLInputElement).value as 'full' | 'split')}
                style={{
                  marginRight: '1rem',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: C.forest,
                }}
              />
              <div>
                <p style={{ fontWeight: '600', color: C.navy, marginBottom: '0.25rem' }}>
                  Partager le paiement
                </p>
                <p style={{ fontSize: '0.875rem', color: C.muted }}>
                  Inviter des co-voyageurs à payer leur part
                </p>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: C.terra,
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: `1.5px solid ${C.border}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = C.terraSoft;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Retour
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? C.muted : C.terra,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: `0 10px 25px -5px rgba(199, 91, 57, 0.2)`,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = C.terraLight;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = C.terra;
              }
            }}
          >
            {loading ? 'Chargement...' : 'Payer maintenant'}
          </button>
        </div>
      </div>
    </div>
  );
}
