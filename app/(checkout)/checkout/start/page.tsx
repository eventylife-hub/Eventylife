/**
 * Page de démarrage du checkout
 * Affiche le résumé du voyage et commence la réservation
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { useAuth } from '@/lib/hooks/use-auth';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

export default function CheckoutStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const travelId = searchParams.get('travel_id');
  
  const { user } = useAuth();
  const { setBookingGroupId, setTravel, setCurrentStep } = useCheckoutStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Commencer la réservation</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-semibold mb-4">Authentification requise</p>
          <p className="text-red-600 mb-4">Vous devez être connecté pour réserver un voyage</p>
          <Button onClick={() => router.push(ROUTES.AUTH.CONNEXION)} className="bg-red-600 hover:bg-red-700">
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  if (!travelId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Commencer la réservation</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700 font-semibold mb-4">Voyage non trouvé</p>
          <p className="text-red-600 mb-4">Le voyage demandé n&apos;existe pas ou n&apos;est plus disponible</p>
          <Button onClick={() => router.push(ROUTES.HOME)} variant="outline">
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    );
  }

  const handleStartCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      // Appeler l'API pour initier le checkout
      const response = await api.post('/checkout/initiate', {
        travelId,
      });

      const { bookingGroupId } = response.data as { bookingGroupId: string };

      // Sauvegarder dans le store
      setBookingGroupId(bookingGroupId);
      setCurrentStep(1);

      // Rediriger vers l'étape 1 (sélection de chambres)
      router.push(ROUTES.CHECKOUT.STEP_1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du démarrage du checkout';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Commencer la réservation</h1>
        <p className="text-slate-600">Confirmez les détails de votre voyage</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-semibold mb-2">Erreur</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-lg text-slate-900 mb-2">Voyage sélectionné</h2>
        <p className="text-slate-600 text-sm">ID: {travelId}</p>
        <p className="text-slate-500 text-xs mt-2">Vous allez configurer votre réservation à l&apos;étape suivante</p>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={() => router.push(ROUTES.HOME)}
          variant="outline"
        >
          Annuler
        </Button>
        <Button
          onClick={handleStartCheckout}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Initialisation...' : 'Continuer vers le panier'}
        </Button>
      </div>
    </div>
  );
}
