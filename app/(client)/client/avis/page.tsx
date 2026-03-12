'use client';

import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { reviewSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

        const reviewsJson = await reviewsRes.json() as Record<string, unknown>;
        const reviewsData = (reviewsJson.items || reviewsJson || []) as Review[];
        setReviews(reviewsData);

        // Charger les voyages terminés pour le formulaire
        if (travelsRes.ok) {
          const travelsData = await travelsRes.json() as Record<string, unknown>;
          // Filtrer les voyages déjà notés
          const reviewedTravelIds = new Set(reviewsData.map((r: Review) => r.travelId));
          const items = (travelsData.items || travelsData || []) as CompletedTravel[];
          const availableTravels = items.filter(
            (t: CompletedTravel) => !reviewedTravelIds.has(t.id)
          );
          setCompletedTravels(availableTravels);
        }
      } catch {
        logger.warn('API avis indisponible — données démo');
        setReviews([
          {
            id: 'rev_001',
            travelId: '1',
            travelTitle: 'Marrakech Express',
            travelSlug: 'marrakech-express',
            travelCoverImageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
            rating: 5,
            comment: 'Voyage incroyable ! L\'organisation était parfaite du début à la fin. Notre accompagnateur Mohamed était exceptionnel. Les excursions étaient variées et adaptées à tous. Je recommande vivement !',
            status: 'APPROVED',
            createdAt: '2026-01-25T10:00:00Z',
          },
          {
            id: 'rev_002',
            travelId: '3',
            travelTitle: 'Barcelone & Gaudí',
            travelSlug: 'barcelone-gaudi',
            rating: 4,
            comment: 'Très beau voyage, Barcelone est une ville magnifique. La Sagrada Familia m\'a coupé le souffle. Seul petit bémol : le trajet en bus était un peu long.',
            status: 'APPROVED',
            createdAt: '2026-02-20T15:30:00Z',
          },
        ]);
        setCompletedTravels([
          { id: '5', title: 'Istanbul & le Bosphore', destinationCity: 'Istanbul', returnDate: '2026-07-25' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      reviewSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    setSubmitting(true);
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
      const data = (await resList.json() as unknown) as Record<string, unknown>;
      const reviewsData = (data.items || data || []) as Review[];
      setReviews(reviewsData);
      setShowForm(false);
      setFormData({ travelId: '', rating: 5, comment: '' });
    } catch (err: unknown) {
      alert(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, travelId: e.target.value })}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                aria-invalid={!!errors.travelId}
                aria-describedby={errors.travelId ? 'travelId-error' : undefined}
                style={{
                  border: `1.5px solid ${errors.travelId ? '#DC2626' : '#E5E0D8'}`,
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
              <FormFieldError error={errors.travelId} id="travelId-error" />
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 rounded-xl text-sm transition-all"
                aria-invalid={!!errors.comment}
                aria-describedby={errors.comment ? 'comment-error' : undefined}
                style={{
                  border: `1.5px solid ${errors.comment ? '#DC2626' : '#E5E0D8'}`,
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                  minHeight: '100px',
                }}
                placeholder="Partagez votre expérience..."
                required
                minLength={10}
                maxLength={2000}
              />
              <FormFieldError error={errors.comment} id="comment-error" />
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                {formData.comment.length}/2000 caractères
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
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
                {submitting ? 'Publication...' : 'Publier l\'avis'}
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
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--terra-soft, #FEF2F2)',
          border: '1.5px solid #E5E0D8',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--terra, #C75B39)', fontWeight: 500 }}>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            color: 'var(--terra, #C75B39)',
            border: '1px solid var(--terra, #C75B39)',
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Fermer
          </button>
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
