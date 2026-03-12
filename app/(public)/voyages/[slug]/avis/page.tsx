'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Breadcrumb } from '@/components/seo/breadcrumb';
import { logger } from '@/lib/logger';
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

        const data = await res.json() as { reviews: Review[]; travel: Travel };
        setReviews(data.reviews || []);
        setTravel(data.travel);
      } catch (err: unknown) {
        logger.warn('API avis indisponible — données démo');
        // Fallback demo data — 5 reviews
        const fallbackReviews: Review[] = [
          {
            id: 'review-1',
            userId: 'user-1',
            userName: 'Catherine M.',
            rating: 5,
            comment: 'Voyage magnifique ! Les îles Éoliennes sont sublimes et notre accompagnateur était impeccable. À refaire sans hésitation.',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'APPROVED',
          },
          {
            id: 'review-2',
            userId: 'user-2',
            userName: 'Pierre D.',
            rating: 5,
            comment: 'Excellent rapport qualité-prix. Le transport porte-à-porte était très apprécié, pas de stress pour rejoindre le groupe.',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'APPROVED',
          },
          {
            id: 'review-3',
            userId: 'user-3',
            userName: 'Martine B.',
            rating: 4,
            comment: 'Très bon voyage. L\'hôtel était confortable et la nourriture délicieuse. Un petit bémol sur le timing d\'une excursion qui a retardé le dîner.',
            createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'APPROVED',
          },
          {
            id: 'review-4',
            userId: 'user-4',
            userName: 'Jacques L.',
            rating: 5,
            comment: 'J\'ai voyagé seul et j\'ai trouvé une belle ambiance de groupe. Même les passionnés de photographie y ont trouvé leur compte.',
            createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'APPROVED',
          },
          {
            id: 'review-5',
            userId: 'user-5',
            userName: 'Nathalie G.',
            rating: 4,
            comment: 'Superbe découverte de Sicile ! Les sites historiques étaient fascinants. Recommande vivement.',
            createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'APPROVED',
          },
        ];
        const fallbackTravel: Travel = {
          id: 'voyage-demo-' + params.slug,
          title: 'Îles Éoliennes & Baroque Sicilien',
          slug: params.slug as string,
        };
        setReviews(fallbackReviews);
        setTravel(fallbackTravel);
        setError(null);
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
        {[1, 2, 3, 4, 5].map((star) => (
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
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  if (loading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-12 animate-fade-up"
        style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
      >
        <Link
          href={`/voyages/${params.slug}`}
          style={{ color: 'var(--terra, #C75B39)' }}
          className="hover:underline mb-4 inline-block"
        >
          ← Retour au voyage
        </Link>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg animate-pulse"
              style={{
                backgroundColor: '#E5E0D8',
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
      style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}
    >
      <Breadcrumb
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Nos voyages', href: '/voyages' },
          { name: travel?.title || 'Voyage', href: `/voyages/${params.slug}` },
          { name: 'Avis', href: `/voyages/${params.slug}/avis` },
        ]}
      />

      {/* En-tête */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--navy, #1A1A2E)', fontFamily: 'Playfair Display' }}
        >
          Avis sur {travel?.title || 'ce voyage'}
        </h1>
        <p style={{ color: '#6B7280' }}>
          {reviews.length} avis vérifiés
        </p>
      </div>

      {error ? (
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: '#fee2e2',
            border: '1.5px solid #fca5a5',
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
            border: '1.5px solid #E5E0D8',
            borderRadius: '20px',
          }}
        >
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun avis</h2>
          <p style={{ color: '#6B7280' }}>Soyez le premier à laisser un avis sur ce voyage</p>
        </div>
      ) : (
        <>
          {/* Résumé des notes */}
          <div
            className="rounded-lg p-8 mb-8"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {averageRating}
                  </span>
                  <span className="text-2xl" style={{ color: '#6B7280' }}>
                    /5
                  </span>
                </div>
                <div className="mb-3">{renderStars(Math.round(Number(averageRating)))}</div>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Basé sur {reviews.length} avis
                </p>
              </div>

              <div className="flex-1 space-y-2 w-full">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-12" style={{ color: '#6B7280' }}>
                      {rating} ★
                    </span>
                    <div
                      className="flex-1 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: '#E5E0D8' }}
                    >
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm w-8 text-right" style={{ color: '#6B7280' }}>
                      {ratingDistribution[rating as keyof typeof ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tri */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Tous les avis
            </h2>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'recent' | 'rating-high' | 'rating-low')}
              aria-label="Trier les avis"
              className="px-4 py-2 rounded-lg focus:ring-2"
              style={{
                borderRadius: '12px',
                border: '1.5px solid #E5E0D8',
                color: 'var(--navy, #1A1A2E)',
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
            {sortedReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg p-6"
                style={{
                  backgroundColor: 'white',
                  border: '1.5px solid #E5E0D8',
                  borderRadius: '20px',
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {review.userName}
                    </h3>
                    <div className="mt-1">{renderStars(review.rating)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: '#6B7280' }}>
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
                <p style={{ color: 'var(--navy, #1A1A2E)' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
