'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';

interface CompletedTravel {
  id: string;
  title: string;
  destinationCity: string;
  returnDate: string;
}

interface Review {
  id: string;
  travelId: string;
  travelTitle: string;
  travelSlug: string;
  travelCoverImageUrl?: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
}

export default function AvisPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedTravels, setCompletedTravels] = useState<CompletedTravel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    travelId: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Charger les avis et les voyages terminés en parallèle
        const [reviewsRes, travelsRes] = await Promise.all([
          fetch('/api/reviews/mine', { credentials: 'include' }),
          fetch('/api/client/bookings?status=CONFIRMED&completed=true', { credentials: 'include' }),
        ]);

        if (!reviewsRes.ok) throw new Error('Impossible de charger les avis');

        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);

        // Charger les voyages terminés pour le formulaire
        if (travelsRes.ok) {
          const travelsData = await travelsRes.json();
          // Filtrer les voyages déjà notés
          const reviewedTravelIds = new Set(reviewsData.map((r: Review) => r.travelId));
          const availableTravels = (travelsData.items || travelsData).filter(
            (t: CompletedTravel) => !reviewedTravelIds.has(t.id)
          );
          setCompletedTravels(availableTravels);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'avis');

      // Rafraîchir la liste
      const resList = await fetch('/api/reviews/mine', {
        credentials: 'include',
      });
      const data = await resList.json();
      setReviews(data);
      setShowForm(false);
      setFormData({ travelId: '', rating: 5, comment: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          interactive ? (
            <button
              key={star}
              type="button"
              onClick={() => onChange?.(star)}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } cursor-pointer hover:text-yellow-300 transition-colors`}
            >
              ★
            </button>
          ) : (
            <span
              key={star}
              className={`text-2xl ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } transition-colors`}
            >
              ★
            </span>
          )
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes avis</h1>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes avis</h1>
          <p className="text-slate-600">Partagez votre expérience des voyages</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Laisser un avis</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Sélectionnez un voyage
              </label>
              <select
                value={formData.travelId}
                onChange={(e) => setFormData({ ...formData, travelId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Choisir un voyage --</option>
                {completedTravels.length > 0 ? (
                  completedTravels.map((travel) => (
                    <option key={travel.id} value={travel.id}>
                      {travel.title} — {travel.destinationCity}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Aucun voyage éligible pour un avis
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Note
              </label>
              {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Commentaire
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-24"
                placeholder="Partagez votre expérience..."
                required
                minLength={10}
                maxLength={2000}
              />
              <p className="text-xs text-slate-500 mt-1">
                {formData.comment.length}/2000 caractères
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Publier l'avis
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* État vide */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun avis</h2>
          <p className="text-slate-600 mb-6">Vous n'avez pas encore laissé d'avis</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Laisser votre premier avis
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{review.travelTitle}</h3>
                  <div className="mt-2">{renderStars(review.rating)}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    review.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {review.status === 'APPROVED' ? 'Publié' : 'En modération'}
                </span>
              </div>

              <p className="text-slate-700 mb-4">{review.comment}</p>

              <p className="text-xs text-slate-500">
                Publié le{' '}
                {formatDate(review.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
