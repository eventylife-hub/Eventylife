'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur inconnue',
      });
      setTimeout(() => setToast(null), 5000);
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
        <label className="block text-sm font-medium mb-3" style={{ color: C.navy }}>{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="w-10 h-10 rounded-lg font-bold transition"
              style={{
                backgroundColor: star <= rating ? C.gold : C.border,
                color: star <= rating ? 'white' : C.muted,
              }}
              onMouseEnter={(e) => {
                if (star > rating) e.currentTarget.style.backgroundColor = C.goldSoft;
              }}
              onMouseLeave={(e) => {
                if (star > rating) e.currentTarget.style.backgroundColor = C.border;
              }}
            >
              ★
            </button>
          ))}
          <span className="ml-3 font-medium" style={{ color: C.navy }}>{rating}/5</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: C.cream }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: C.navy }}>Laisser un Avis</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg animate-pulse" style={{ backgroundColor: C.border }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: C.cream }}>
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="hover:opacity-80 mb-4"
            style={{ color: C.terra }}
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold" style={{ color: C.navy }}>Laisser un Avis</h1>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #DC2626` }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Réservation non trouvée'}</p>
          <button
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
    <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: C.cream, animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="hover:opacity-80 mb-4"
          style={{ color: C.terra }}
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold" style={{ color: C.navy }}>Laisser un Avis</h1>
        <p className="mt-2" style={{ color: C.muted }}>
          Aidez-nous à améliorer nos services en partageant votre expérience
        </p>
      </div>

      {/* Toast inline */}
      {toast && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: toast.type === 'success' ? C.forestBg : 'var(--terra-soft, #FEF2F2)',
            borderColor: toast.type === 'success' ? C.forest : 'var(--terra, #DC2626)',
            color: toast.type === 'success' ? C.forest : 'var(--terra, #DC2626)',
          }}
        >
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #DC2626`, color: 'var(--terra, #DC2626)' }}>
          {error}
        </div>
      )}

      {/* Infos voyage */}
      <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: C.navy }}>Votre Voyage</h2>
        <div className="space-y-2" style={{ color: C.navy }}>
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
      <form onSubmit={handleSubmit} className="rounded-xl p-6" style={{ backgroundColor: 'white', border: `1.5px solid ${C.border}` }}>
        <h2 className="text-lg font-bold mb-6" style={{ color: C.navy }}>Vos Impressions</h2>

        {/* Note globale */}
        <RatingStars rating={overallRating} onChange={setOverallRating} label="Note Globale" />

        {/* Notes par catégorie */}
        <div className="pt-6 mt-6" style={{ borderTop: `1px solid ${C.border}` }}>
          <h3 className="font-bold mb-6" style={{ color: C.navy }}>Détails par Catégorie</h3>

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
          <label className="block text-sm font-medium mb-2" style={{ color: C.navy }}>
            Votre Commentaire
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez vos impressions, ce que vous avez aimé, ce qui pourrait être amélioré..."
            className="w-full px-4 py-3 rounded-lg"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              color: C.navy,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.terra;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${C.terraSoft}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
            rows={6}
            maxLength={1000}
          />
          <p className="text-xs mt-1" style={{ color: C.muted }}>
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
              backgroundColor: C.terra,
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = C.terraLight;
                e.currentTarget.style.boxShadow = `0 8px 16px ${C.terraSoft}`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = C.terra;
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
              backgroundColor: C.border,
              color: C.navy,
            }}
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Note */}
      <p className="text-xs mt-6 text-center" style={{ color: C.muted }}>
        Vos avis nous aident à offrir une meilleure expérience à tous nos clients.
        Merci de votre retour!
      </p>
    </div>
  );
}
