'use client';

import Link from 'next/link';
import Image from 'next/image';

interface TravelCardProps {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  priceInCents: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  capacity?: number;
  currentBookings?: number;
  slug: string;
}

export function TravelCard({
  id,
  title,
  destination,
  startDate,
  endDate,
  priceInCents,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  capacity = 0,
  currentBookings = 0,
  slug,
}: TravelCardProps) {
  // Supprime le warning unused — id est requis pour les clés de liste
  void id;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1); // Minimum 1 jour
  };

  const available = capacity - currentBookings;
  const days = getDays(startDate, endDate);

  return (
    <Link href={`/voyages/${slug}`} className="block h-full group">
      <article
        className="overflow-hidden h-full flex flex-col transition-all duration-300"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid rgba(26,26,46,0.08)',
          boxShadow: '0 2px 8px rgba(26,26,46,0.04)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(26,26,46,0.12)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(26,26,46,0.04)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0077B6 0%, #48CAE4 50%, #FF6B35 100%)',
              }}
            >
              <span className="text-5xl">✈️</span>
            </div>
          )}

          {/* Badges flottants */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: 'var(--navy, #1A1A2E)',
              }}
            >
              {days} jour{days !== 1 ? 's' : ''}
            </span>
            {available <= 10 && available > 0 && (
              <span
                className="px-3 py-1 text-xs font-bold rounded-full"
                style={{
                  background: 'rgba(199,91,57,0.9)',
                  color: '#FFFFFF',
                }}
              >
                Peu de places
              </span>
            )}
            {available <= 0 && (
              <span
                className="px-3 py-1 text-xs font-bold rounded-full"
                style={{
                  background: 'rgba(26,26,46,0.85)',
                  color: '#FFFFFF',
                }}
              >
                Complet
              </span>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Titre */}
          <h3
            className="text-lg font-bold mb-2 line-clamp-2 leading-snug"
            style={{ color: 'var(--navy, #1A1A2E)' }}
          >
            {title}
          </h3>

          {/* Destination et dates */}
          <p className="text-sm mb-1" style={{ color: '#4A5568' }}>
            📍 {destination}
          </p>
          <p className="text-xs mb-4" style={{ color: '#718096' }}>
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>

          {/* Spacer pour pousser le prix en bas */}
          <div className="mt-auto">
            {/* Prix */}
            <p
              className="text-2xl font-bold mb-3"
              style={{ color: 'var(--terra, #C75B39)' }}
            >
              À partir de {formatPrice(priceInCents)}
            </p>

            {/* Rating et places */}
            <div
              className="flex justify-between items-center pt-3 mb-4"
              style={{ borderTop: '1px solid rgba(26,26,46,0.08)' }}
            >
              {rating > 0 && (
                <span className="flex items-center gap-1 text-sm">
                  <span style={{ color: 'var(--gold, #D4A853)' }}>⭐ {rating.toFixed(1)}</span>
                  <span style={{ color: '#718096' }}>({reviewCount})</span>
                </span>
              )}
              <span className="text-xs" style={{ color: '#718096' }}>
                {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Bouton */}
            <button
              className="w-full px-4 py-2.5 rounded-xl font-semibold text-white transition-all duration-200"
              style={{
                background: 'var(--terra, #C75B39)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B5502F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--terra, #C75B39)';
              }}
            >
              Voir détails
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
