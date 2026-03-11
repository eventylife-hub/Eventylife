'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
}

interface Travel {
  id: string;
  title: string;
  slug: string;
}

export default function TravelReviewsPage() {
  const C = {
    navy: '#1A1A2E',
    cream: '#FAF7F2',
    terra: '#C75B39',
    terraLight: '#D97B5E',
    gold: '#D4A853',
    border: '#E5E0D8',
    muted: '#6B7280',
  };

  const params = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [travel, setTravel] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'rating-high' | 'rating-low'>('recent');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/reviews/travel/${params.slug}`, { credentials: 'include' });

        if (!res.ok) throw new Error('Impossible de charger les avis');

        const data = (await res.json() as unknown) as unknown;
        setReviews(data.reviews || []);
        setTravel(data.travel);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [params.slug]);

  // formatDate locale supprimée — utilise formatDate de @/lib/utils

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star: unknown) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const sortedReviews = [...(reviews || [])].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'rating-high') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: reviews.filter((r: unknown) => r.rating === 5).length,
    4: reviews.filter((r: unknown) => r.rating === 4).length,
    3: reviews.filter((r: unknown) => r.rating === 3).length,
    2: reviews.filter((r: unknown) => r.rating === 2).length,
    1: reviews.filter((r: unknown) => r.rating === 1).length,
  };

  if (loading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-12 animate-fade-up"
        style={{ backgroundColor: C.cream }}
      >
        <Link
          href={`/voyages/${params.slug}`}
          style={{ color: C.terra }}
          className="hover:underline mb-4 inline-block"
        >
          ← Retour au voyage
        </Link>
        <div className="space-y-4">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div
              key={i}
              className="h-24 rounded-lg animate-pulse"
              style={{
                backgroundColor: C.border,
                borderRadius: '20px',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-12 animate-fade-up"
      style={{ backgroundColor: C.cream }}
    >
      <Link
        href={`/voyages/${params.slug}`}
        style={{ color: C.terra }}
        className="hover:underline mb-4 inline-block"
      >
        ← Retour au voyage
      </Link>

      {/* En-tête */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: C.navy, fontFamily: 'Playfair Display' }}
        >
          Avis sur {travel?.title || 'ce voyage'}
        </h1>
        <p style={{ color: C.muted }}>
          {reviews.length} avis vérifiés
        </p>
      </div>

      {error ? (
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: '#fee2e2',
            border: `1.5px solid #fca5a5`,
            borderRadius: '20px',
            color: '#991b1b',
          }}
        >
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="text-center py-16 rounded-lg"
          style={{
            backgroundColor: 'white',
            border: `1.5px solid ${C.border}`,
            borderRadius: '20px',
          }}
        >
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun avis</h2>
          <p style={{ color: C.muted }}>Soyez le premier à laisser un avis sur ce voyage</p>
        </div>
      ) : (
        <>
          {/* Résumé des notes */}
          <div
            className="rounded-lg p-8 mb-8"
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold" style={{ color: C.navy }}>
                    {averageRating}
                  </span>
                  <span className="text-2xl" style={{ color: C.muted }}>
                    /5
                  </span>
                </div>
                <div className="mb-3">{renderStars(Math.round(Number(averageRating)))}</div>
                <p className="text-sm" style={{ color: C.muted }}>
                  Basé sur {reviews.length} avis
                </p>
              </div>

              <div className="flex-1 space-y-2 w-full">
                {[5, 4, 3, 2, 1].map((rating: unknown) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12" style={{ color: C.muted }}>
                      {rating} ★
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: C.border }}
                    >
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm w-8 text-right" style={{ color: C.muted }}>
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tri */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold" style={{ color: C.navy }}>
              Tous les avis
            </h2>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSortBy((e.target as HTMLInputElement).value as 'recent' | 'rating-high' | 'rating-low')}
              className="px-4 py-2 rounded-lg focus:ring-2"
              style={{
                borderRadius: '12px',
                border: `1.5px solid ${C.border}`,
                color: C.navy,
                backgroundColor: 'white',
              }}
            >
              <option value="recent">Plus récents</option>
              <option value="rating-high">Meilleure note</option>
              <option value="rating-low">Note moins élevée</option>
            </select>
          </div>

          {/* Liste des avis */}
          <div className="space-y-4">
            {sortedReviews.map((review: unknown) => (
              <div
                key={review.id}
                className="rounded-lg p-6"
                style={{
                  backgroundColor: 'white',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '20px',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: C.navy }}>
                      {review.userName}
                    </h3>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: C.muted }}>
                      {formatDate(review.createdAt)}
                    </p>
                    {review.status !== 'APPROVED' && (
                      <span
                        className="inline-block mt-2 px-2 py-1 text-xs rounded"
                        style={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '8px',
                        }}
                      >
                        En modération
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ color: C.navy }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
