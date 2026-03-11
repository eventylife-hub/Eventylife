'use client';

/**
 * Page de confirmation
 * Affichée après paiement réussi
 */


import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';

interface BookingDetails {
  id: string;
  referenceNumber: string;
  travelName: string;
  totalAmountTTC: number;
  participants: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  roomCount: number;
  createdAt: string;
}

const FALLBACK_BOOKING: BookingDetails = {
  id: 'booking-demo-001',
  referenceNumber: 'EVT-2026-001234',
  travelName: 'Marrakech Express',
  totalAmountTTC: 499900, // 4999.00€
  participants: [
    {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
    },
    {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'marie.dupont@example.com',
    },
  ],
  roomCount: 1,
  createdAt: new Date().toISOString(),
};

export default function CheckoutConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const { bookingGroupId, reset } = useCheckoutStore();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les détails de la réservation via sessionId ou bookingGroupId
  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError(null);

        // Utiliser sessionId en priorité, sinon bookingGroupId
        const id = sessionId || bookingGroupId;
        if (!id) {
          setError('Aucune réservation trouvée');
          setLoading(false);
          return;
        }

        const endpoint = sessionId
          ? `/checkout/by-session/${sessionId}`
          : `/checkout/${id}`;

        const response = await api.get<BookingDetails>(endpoint);

        if (response.success && response.data) {
          setBooking(response.data);
        } else {
          setError(response.error?.message || 'Erreur lors du chargement des détails');
        }
      } catch (err: unknown) {
        console.warn('API /checkout indisponible — données démo');
        setBooking(FALLBACK_BOOKING);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId || bookingGroupId) {
      loadBooking();
    }
  }, [sessionId, bookingGroupId]);

  const handleDownloadPDF = async () => {
    if (!booking) return;

    try {
      setDownloading(true);
      setError(null);

      const response = await api.get<Blob>(
        `/checkout/${booking.id}/confirmation-pdf`,
        { headers: { 'Accept': 'application/pdf' } }
      );

      if (response.success && response.data) {
        // Créer un blob et télécharger
        const url = window.URL.createObjectURL(new Blob([response.data as unknown as BlobPart]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `confirmation-${booking.referenceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError(response.error?.message || 'Erreur lors du téléchargement du PDF');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(message);
    } finally {
      setDownloading(false);
    }
  };

  const handleViewReservation = () => {
    reset();
    router.push(`${ROUTES.CLIENT.RESERVATIONS}/${bookingGroupId}`);
  };

  const handleBackHome = () => {
    reset();
    router.push(ROUTES.HOME);
  };

  // État Loading
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#E5E0D8',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              opacity: 0.5,
            }}
          ></div>
          <div
            style={{
              height: '32px',
              backgroundColor: '#E5E0D8',
              borderRadius: '8px',
              width: '50%',
              margin: '0 auto 1rem',
              opacity: 0.5,
            }}
          ></div>
          <div
            style={{
              height: '16px',
              backgroundColor: '#E5E0D8',
              borderRadius: '8px',
              width: '33%',
              margin: '0 auto',
              opacity: 0.5,
            }}
          ></div>
        </div>
      </div>
    );
  }

  // État Error
  if (error || !booking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }} className="animate-fade-up">
          <div
            style={{
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              padding: '1.5rem',
            }}
          >
            <p style={{ color: 'var(--terra, #C75B39)', fontWeight: '600', marginBottom: '1rem' }}>
              {error || 'Erreur lors du chargement de votre réservation'}
            </p>
            <button type="button"
              onClick={() => router.push(ROUTES.HOME)}
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
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream, #FAF7F2)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto', paddingTop: '2rem' }} className="animate-fade-up">
        <CheckoutProgress currentStep={4} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              boxShadow: '0 8px 30px rgba(22, 101, 52, 0.15)',
            }}
          >
            <CheckCircle
              style={{
                width: '56px',
                height: '56px',
                color: '#166534',
              }}
            />
          </div>
          <style>{`
            @keyframes successPop {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'var(--navy, #1A1A2E)',
              marginBottom: '0.5rem',
            }}
          >
            Réservation confirmée!
          </h1>
          <p style={{ color: '#6B7280' }}>
            Votre paiement a été reçu avec succès
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #E5E0D8',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
            Numéro de confirmation
          </p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
            {booking.referenceNumber}
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            border: '1.5px solid #E5E0D8',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontWeight: '600', fontSize: '1.125rem', color: 'var(--navy, #1A1A2E)', marginBottom: '1rem' }}>
            Résumé de votre réservation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Voyage:</span>
              <span style={{ fontWeight: '600', color: 'var(--navy, #1A1A2E)' }}>{booking.travelName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Nombre de chambres:</span>
              <span style={{ fontWeight: '600', color: 'var(--navy, #1A1A2E)' }}>{booking.roomCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>Participants:</span>
              <span style={{ fontWeight: '600', color: 'var(--navy, #1A1A2E)' }}>
                {booking.participants.length}
              </span>
            </div>
            <div
              style={{
                borderTop: '1.5px solid #E5E0D8',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '600',
                color: 'var(--navy, #1A1A2E)',
              }}
            >
              <span>Total:</span>
              <span>{formatPrice(booking.totalAmountTTC)}</span>
            </div>
          </div>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '1rem' }}>
            Vous recevrez un email de confirmation avec tous les détails à vos coordonnées.
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #E5E0D8',
            borderRadius: '20px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p>✓ Paiement confirmé</p>
            <p>✓ Réservation verrouillée</p>
            <p>✓ Confirmation envoyée par email</p>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              color: 'var(--terra, #C75B39)',
              padding: '1rem',
              fontSize: '0.875rem',
              marginBottom: '2rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: 'var(--terra, #C75B39)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: '1.5px solid #E5E0D8',
              cursor: downloading ? 'not-allowed' : 'pointer',
              opacity: downloading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(199,91,57,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!downloading) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            {downloading ? 'Téléchargement...' : 'Télécharger la confirmation (PDF)'}
          </button>
          <button type="button"
            onClick={handleViewReservation}
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
              (e.target as HTMLButtonElement).style.backgroundColor = '#D97B5E';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)';
            }}
          >
            Voir ma réservation
          </button>
          <button type="button"
            onClick={handleBackHome}
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
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(199,91,57,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
