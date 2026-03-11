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

        const reviewsData = (await reviewsRes.json() as unknown) as unknown;
        setReviews(reviewsData);

        // Charger les voyages terminés pour le formulaire
        if (travelsRes.ok) {
          const travelsData = (await travelsRes.json() as unknown) as unknown;
          // Filtrer les voyages déjà notés
          const reviewedTravelIds = new Set(reviewsData.map((r: Review) => r.travelId));
          const availableTravels = (travelsData.items || travelsData).filter(
            (t: CompletedTravel) => !reviewedTravelIds.has(t.id)
          );
          setCompletedTravels(availableTravels);
        }
      } catch (err: unknown) {
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
      const data = (await resList.json() as unknown) as unknown;
      setReviews(data);
      setShowForm(false);
      setFormData({ travelId: '', rating: 5, comment: '' });
    } catch (err: unknown) {
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
              className="text-2xl cursor-pointer transition-colors"
              style={{
                color: star <= rating ? '#F59E0B' : '#D1D5DB',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FBBF24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = star <= rating ? '#F59E0B' : '#D1D5DB';
              }}
            >
              ★
            </button>
          ) : (
            <span
              key={star}
              className="text-2xl transition-colors"
              style={{
                color: star <= rating ? '#F59E0B' : '#D1D5DB',
              }}
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
      <div className="max-w-4xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes avis</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Partagez votre expérience des voyages</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes avis</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Partagez votre expérience des voyages</p>
        </div>
        {!showForm && (
          <button type="button"
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Laisser un avis
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Laisser un avis</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Sélectionnez un voyage
              </label>
              <select
                value={formData.travelId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, travelId: (e.target as HTMLInputElement).value })}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: '1.5px solid #E5E0D8',
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                }}
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
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Note
              </label>
              {renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                Commentaire
              </label>
              <textarea
                value={formData.comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, comment: (e.target as HTMLInputElement).value })}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                style={{
                  border: '1.5px solid #E5E0D8',
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                  minHeight: '100px',
                }}
                placeholder="Partagez votre expérience..."
                required
                minLength={10}
                maxLength={2000}
              />
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {formData.comment.length}/2000 caractères
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D97B5E';
                  e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--terra, #C75B39)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Publier l&apos;avis
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
        </div>
      )}

      {/* État vide */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">⭐</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucun avis</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Vous n&apos;avez pas encore laissé d&apos;avis</p>
          <button type="button"
            onClick={() => setShowForm(true)}
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 6px 24px var(--terra, #C75B39)30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--terra, #C75B39)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Laisser votre premier avis →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--navy, #1A1A2E)' }}>{review.travelTitle}</h3>
                  <div className="mt-2">{renderStars(review.rating)}</div>
                </div>
                <span
                  className="px-3 py-1 rounded-xl text-xs font-semibold"
                  style={{
                    background: review.status === 'APPROVED' ? '#DCFCE7' : '#FDF6E8',
                    color: review.status === 'APPROVED' ? '#166534' : '#92400e',
                  }}
                >
                  {review.status === 'APPROVED' ? 'Publié' : 'En modération'}
                </span>
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>{review.comment}</p>

              <p className="text-xs" style={{ color: '#6B7280' }}>
                Publié le {formatDate(review.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
