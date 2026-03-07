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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Paiement</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <PriceSummary rooms={rooms} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mode de paiement</h2>

        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
            <input
              type="radio"
              name="payment-mode"
              value="full"
              checked={paymentMode === 'full'}
              onChange={(e) => setPaymentMode(e.target.value as 'full' | 'split')}
              className="mr-3"
            />
            <div>
              <p className="font-medium">Payer le montant complet</p>
              <p className="text-sm text-gray-600">{formatPrice(totalAmountTTC)}</p>
            </div>
          </label>

          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-green-50">
            <input
              type="radio"
              name="payment-mode"
              value="split"
              checked={paymentMode === 'split'}
              onChange={(e) => setPaymentMode(e.target.value as 'full' | 'split')}
              className="mr-3"
            />
            <div>
              <p className="font-medium">Partager le paiement</p>
              <p className="text-sm text-gray-600">
                Inviter des co-voyageurs à payer leur part
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
        <Button onClick={handlePayment} disabled={loading} className="flex-1">
          {loading ? 'Chargement...' : 'Payer maintenant'}
        </Button>
      </div>
    </div>
  );
}
