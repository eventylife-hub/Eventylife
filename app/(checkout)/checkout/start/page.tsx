'use client';

/**
 * Page de démarrage du checkout
 * Affiche le résumé du voyage et commence la réservation
 */


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
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '28rem', margin: '0 auto' }} className="animate-fade-up">
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.5rem',
              }}
            >
              Commencer la réservation
            </h1>
          </div>
          <div
            style={{
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              padding: '1.5rem',
            }}
          >
            <p style={{ color: 'var(--terra, #C75B39)', fontWeight: '600', marginBottom: '1rem' }}>
              Authentification requise
            </p>
            <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
              Vous devez être connecté pour réserver un voyage
            </p>
            <button
              onClick={() => router.push(ROUTES.AUTH.CONNEXION)}
              style={{
                width: '100%',
                backgroundColor: 'var(--terra, #C75B39)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: `0 10px 25px -5px rgba(199, 91, 57, 0.2)`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)'Light;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)';
              }}
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!travelId) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '28rem', margin: '0 auto' }} className="animate-fade-up">
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: 'var(--navy, #1A1A2E)',
                marginBottom: '0.5rem',
              }}
            >
              Commencer la réservation
            </h1>
          </div>
          <div
            style={{
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              padding: '1.5rem',
            }}
          >
            <p style={{ color: 'var(--terra, #C75B39)', fontWeight: '600', marginBottom: '1rem' }}>
              Voyage non trouvé
            </p>
            <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
              Le voyage demandé n&apos;existe pas ou n&apos;est plus disponible
            </p>
            <button
              onClick={() => router.push(ROUTES.HOME)}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: 'var(--terra, #C75B39)',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: '600',
                border: '1.5px solid #E5E0D8',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)'Soft;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              Retour à l&apos;accueil
            </button>
          </div>
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream, #FAF7F2)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '28rem', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'var(--navy, #1A1A2E)',
              marginBottom: '0.5rem',
            }}
          >
            Commencer la réservation
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Confirmez les détails de votre voyage
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              color: 'var(--terra, #C75B39)',
            }}
          >
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Erreur</p>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => setError(null)}
              style={{
                color: 'var(--terra, #C75B39)',
                fontSize: '0.875rem',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Fermer
            </button>
          </div>
        )}

        <div
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E0D8',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2
            style={{
              fontWeight: '600',
              fontSize: '1.125rem',
              color: 'var(--navy, #1A1A2E)',
              marginBottom: '0.5rem',
            }}
          >
            Voyage sélectionné
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>ID: {travelId}</p>
          <p style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Vous allez configurer votre réservation à l&apos;étape suivante
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.push(ROUTES.HOME)}
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
              (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)'Soft;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleStartCheckout}
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
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)'Light;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)';
              }
            }}
          >
            {loading ? 'Initialisation...' : 'Continuer vers le panier'}
          </button>
        </div>
      </div>
    </div>
  );
}
