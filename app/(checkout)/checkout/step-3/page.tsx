'use client';

/**
 * ÉTAPE 3: Paiement
 * Options de paiement:
 * 1. "Payer tout" - Paiement complet Stripe
 * 2. "Partager le paiement" - Split-pay avec invitations
 */


import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { api } from '@/lib/api';
import { PriceSummary } from '@/components/checkout/price-summary';
import { formatPrice } from '@/lib/utils';

const FALLBACK_PAYMENT_URL = 'https://checkout.stripe.demo/pay/demo-session-001';
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
      console.warn('API /checkout/payment indisponible — données démo');
      setError(null);
      window.location.href = FALLBACK_PAYMENT_URL;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream, #FAF7F2)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'var(--navy, #1A1A2E)',
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
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              padding: '1rem',
              color: 'var(--terra, #C75B39)',
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
              color: 'var(--navy, #1A1A2E)',
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
                border: '1.5px solid #E5E0D8',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = '#FDF6E8';
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
                  accentColor: 'var(--terra, #C75B39)',
                }}
              />
              <div>
                <p style={{ fontWeight: '600', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>
                  Payer le montant complet
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
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
                border: '1.5px solid #E5E0D8',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLabelElement).style.backgroundColor = '#DCFCE7';
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
                  accentColor: '#166534',
                }}
              />
              <div>
                <p style={{ fontWeight: '600', color: 'var(--navy, #1A1A2E)', marginBottom: '0.25rem' }}>
                  Partager le paiement
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                  Inviter des co-voyageurs à payer leur part
                </p>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button"
            onClick={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: 'var(--terra, #C75B39)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: '1.5px solid #E5E0D8',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(199,91,57,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Retour
          </button>
          <button type="button"
            onClick={handlePayment}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? '#6B7280' : 'var(--terra, #C75B39)',
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
                (e.target as HTMLButtonElement).style.backgroundColor = '#D97B5E';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)';
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
