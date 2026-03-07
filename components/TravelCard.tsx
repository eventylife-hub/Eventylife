'use client';

import Link from 'next/link';

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
    return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  };

  const available = capacity - currentBookings;
  const days = getDays(startDate, endDate);

  return (
    <Link href={`/voyages/${slug}`}>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        {imageUrl ? (
          <div className="aspect-video bg-slate-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <span className="text-4xl">✈️</span>
          </div>
        )}

        {/* Contenu */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Badge */}
          <div className="flex gap-2 mb-3">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              {days} jours
            </span>
            {available <= 5 && (
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                Peu de places
              </span>
            )}
          </div>

          {/* Titre */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Destination et dates */}
          <p className="text-sm text-slate-600 mb-1">
            📍 {destination}
          </p>
          <p className="text-xs text-slate-500 mb-4">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>

          {/* Prix */}
          <div className="mb-4 mt-auto">
            <p className="text-2xl font-bold text-blue-600">
              À partir de {formatPrice(priceInCents)}
            </p>
          </div>

          {/* Rating et places */}
          <div className="flex justify-between items-center mb-4 pb-4 border-t border-slate-200">
            {rating > 0 && (
              <span className="flex items-center gap-1 text-sm">
                <span>⭐ {rating.toFixed(1)}</span>
                <span className="text-slate-600">({reviewCount})</span>
              </span>
            )}
            <span className="text-xs text-slate-600">
              {available} place{available !== 1 ? 's' : ''} restante{available !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Bouton */}
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Voir détails
          </button>
        </div>
      </div>
    </Link>
  );
}
