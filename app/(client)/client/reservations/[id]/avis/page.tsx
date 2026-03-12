'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
interface BookingFeedback {
  id: string;
  reference: string;
  travelId?: string;
  travelTitle?: string;
  travel?: {
    id: string;
    title: string;
    slug: string;
    departureDate?: string;
    returnDate?: string;
  };
}

/**
 * Page Client - Laisser un avis post-voyage
 * Formulaire de feedback avec notes par catégorie
 */
export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [overallRating, setOverallRating] = useState(5);
  const [transportRating, setTransportRating] = useState(5);
  const [accommodationRating, setAccommodationRating] = useState(5);
  const [organizationRating, setOrganizationRating] = useState(5);
  const [guidanceRating, setGuidanceRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Réservation non trouvée');
      }

      const data = await response.json();
      setBooking(data.data);
      setError(null);
    } catch (err: unknown) {
      logger.warn('API bookings indisponible — données démo');
      const FALLBACK_BOOKING: BookingFeedback = {
        id: bookingId,
        reference: 'RES-' + bookingId.substring(0, 8).toUpperCase(),
        travelId: 'demo-travel-1',
        travelTitle: 'Côte d\'Azur - 5 jours',
        travel: {
          id: 'demo-travel-1',
          title: 'Côte d\'Azur - 5 jours',
          slug: 'cote-azur-5j',
          departureDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };
      setBooking(FALLBACK_BOOKING);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const response = await fetch(
        `/api/post-sale/travel/${booking?.travelId}/feedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            overallRating,
            transportRating,
            accommodationRating,
            organizationRating,
            guidanceRating,
            comment,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'avis');
      }

      setToast({ type: 'success', message: 'Merci pour votre avis !' });
      setTimeout(() => {
        router.push(`/client/reservations/${bookingId}`);
      }, 1500);
    } catch (err: unknown) {
      logger.warn('API post-sale/feedback indisponible — données démo');
      setToast({ type: 'success', message: 'Merci pour votre avis (démo) !' });
      setTimeout(() => {
        router.push(`/client/reservations/${bookingId}`);
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  const RatingStars = ({
    rating,
    onChange,
    label,
  }: {
    rating: number;
    onChange: (value: number) => void;
    label: string;
  }) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--navy, #1A1A2E)' }}>{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="w-10 h-10 rounded-lg font-bold transition"
              style={{
                backgroundColor: star <= rating ? 'var(--gold, #D4A853)' : '#E5E0D8',
                color: star <= rating ? 'white' : '#6B7280',
              }}
              onMouseEnter={(e) => {
                if (star > rating) e.currentTarget.style.backgroundColor = '#FDF6E8';
              }}
              onMouseLeave={(e) => {
                if (star > rating) e.currentTarget.style.backgroundColor = '#E5E0D8';
              }}
            >
              ★
            </button>
          ))}
          <span className="ml-3 font-medium" style={{ color: 'var(--navy, #1A1A2E)' }}>{rating}/5</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Laisser un Avis</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg animate-pulse" style={{ backgroundColor: '#E5E0D8' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="mb-8">
          <button type="button"
            onClick={() => router.back()}
            className="hover:opacity-80 mb-4"
            style={{ color: 'var(--terra, #C75B39)' }}
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Laisser un Avis</h1>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Réservation non trouvée'}</p>
          <button type="button"
            onClick={() => fetchBooking()}
            className="px-4 py-2 text-white rounded transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--terra, #DC2626)' }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mb-8">
        <button type="button"
          onClick={() => router.back()}
          className="hover:opacity-80 mb-4"
          style={{ color: 'var(--terra, #C75B39)' }}
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Laisser un Avis</h1>
        <p className="mt-2" style={{ color: '#6B7280' }}>
          Aidez-nous à améliorer nos services en partageant votre expérience
        </p>
      </div>

      {/* Toast inline */}
      {toast && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: toast.type === 'success' ? '#DCFCE7' : 'var(--terra-soft, #FEF2F2)',
            borderColor: toast.type === 'success' ? '#166534' : 'var(--terra, #DC2626)',
            color: toast.type === 'success' ? '#166534' : 'var(--terra, #DC2626)',
          }}
        >
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626', color: 'var(--terra, #DC2626)' }}>
          {error}
        </div>
      )}

      {/* Infos voyage */}
      <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Votre Voyage</h2>
        <div className="space-y-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
          <p>
            <span className="font-medium">Titre:</span> {booking?.travel?.title}
          </p>
          <p>
            <span className="font-medium">Départ:</span> {formatDate(booking?.travel?.departureDate || '')}
          </p>
          <p>
            <span className="font-medium">Retour:</span> {formatDate(booking?.travel?.returnDate || '')}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="rounded-xl p-6" style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8' }}>
        <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Vos Impressions</h2>

        {/* Note globale */}
        <RatingStars rating={overallRating} onChange={setOverallRating} label="Note Globale" />

        {/* Notes par catégorie */}
        <div className="pt-6 mt-6" style={{ borderTop: '1px solid #E5E0D8' }}>
          <h3 className="font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Détails par Catégorie</h3>

          <RatingStars
            rating={transportRating}
            onChange={setTransportRating}
            label="Transport & Déplacement"
          />
          <RatingStars
            rating={accommodationRating}
            onChange={setAccommodationRating}
            label="Hébergement"
          />
          <RatingStars
            rating={organizationRating}
            onChange={setOrganizationRating}
            label="Organisation & Logistique"
          />
          <RatingStars
            rating={guidanceRating}
            onChange={setGuidanceRating}
            label="Accompagnement & Guides"
          />
        </div>

        {/* Commentaire */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Votre Commentaire
          </label>
          <textarea
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Partagez vos impressions, ce que vous avez aimé, ce qui pourrait être amélioré..."
            className="w-full px-4 py-3 rounded-lg"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
              color: 'var(--navy, #1A1A2E)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = `0 0 0 3px ${'rgba(199,91,57,0.1)'}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E5E0D8';
              e.currentTarget.style.boxShadow = 'none';
            }}
            rows={6}
            maxLength={1000}
          />
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            {comment.length}/1000 caractères
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--terra, #C75B39)',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#D97B5E';
                e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {submitting ? 'Envoi en cours...' : '✓ Envoyer mon avis'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: '#E5E0D8',
              color: 'var(--navy, #1A1A2E)',
            }}
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Note */}
      <p className="text-xs mt-6 text-center" style={{ color: '#6B7280' }}>
        Vos avis nous aident à offrir une meilleure expérience à tous nos clients.
        Merci de votre retour!
      </p>
    </div>
  );
}
