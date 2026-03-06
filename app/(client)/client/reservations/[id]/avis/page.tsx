'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';

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
        <label className="block text-sm font-medium text-gray-900 mb-3">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`w-10 h-10 rounded-lg font-bold transition ${
                star <= rating
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-yellow-200'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-3 text-gray-700 font-medium">{rating}/5</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laisser un Avis</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Laisser un Avis</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold mb-4">{error || 'Réservation non trouvée'}</p>
          <button
            onClick={() => fetchBooking()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Laisser un Avis</h1>
        <p className="text-gray-600 mt-2">
          Aidez-nous à améliorer nos services en partageant votre expérience
        </p>
      </div>

      {/* Toast inline */}
      {toast && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Infos voyage */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Votre Voyage</h2>
        <div className="space-y-2 text-gray-700">
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Vos Impressions</h2>

        {/* Note globale */}
        <RatingStars rating={overallRating} onChange={setOverallRating} label="Note Globale" />

        {/* Notes par catégorie */}
        <div className="border-t pt-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-6">Détails par Catégorie</h3>

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
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Votre Commentaire
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez vos impressions, ce que vous avez aimé, ce qui pourrait être amélioré..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 caractères
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Envoi en cours...' : '✓ Envoyer mon avis'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Note */}
      <p className="text-xs text-gray-500 mt-6 text-center">
        Vos avis nous aident à offrir une meilleure expérience à tous nos clients.
        Merci de votre retour!
      </p>
    </div>
  );
}
