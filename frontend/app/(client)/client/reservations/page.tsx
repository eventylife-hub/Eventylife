'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';

interface Booking {
  id: string;
  status: string;
  travelTitle: string;
  travelSlug: string;
  travelCoverImageUrl?: string;
  departureDate: string;
  returnDate: string;
  destinationCity: string;
  totalAmountTTC: number;
  participantCount: number;
  createdAt: string;
}

const statusBadgeColor = {
  CONFIRMED: 'bg-green-100 text-green-800',
  HELD: 'bg-blue-100 text-blue-800',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  CONFIRMED: 'Confirmée',
  HELD: 'En attente',
  PARTIALLY_PAID: 'Partiellement payée',
  DRAFT: 'Brouillon',
  EXPIRED: 'Expirée',
  CANCELED: 'Annulée',
};

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchBookings = async (cursorValue?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ limit: '10' });
      if (cursorValue) params.append('cursor', cursorValue);

      const res = await fetch(`/api/client/bookings?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Impossible de charger les réservations');

      const data = await res.json();
      setBookings(cursorValue ? [...bookings, ...data.items] : data.items);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings =
    filter === 'all'
      ? bookings
      : bookings.filter((b) => {
          if (filter === 'confirmed') return b.status === 'CONFIRMED';
          if (filter === 'pending') return ['HELD', 'PARTIALLY_PAID'].includes(b.status);
          if (filter === 'cancelled') return b.status === 'CANCELED';
          return true;
        });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes réservations</h1>
          <p className="text-slate-600">Gérez vos réservations de voyages</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Erreur : {error}
          <button
            onClick={() => fetchBookings()}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes réservations</h1>
        <p className="text-slate-600">Gérez vos réservations de voyages</p>
      </div>

      {/* Filtres */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'confirmed', label: 'Confirmées' },
          { value: 'pending', label: 'En attente' },
          { value: 'cancelled', label: 'Annulées' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* État vide */}
      {filteredBookings.length === 0 && !loading ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucune réservation</h2>
          <p className="text-slate-600 mb-6">Vous n'avez pas encore réservé de voyage</p>
          <Link
            href="/voyages"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Découvrir les voyages
          </Link>
        </div>
      ) : (
        <>
          {/* Liste des réservations */}
          <div className="space-y-4 mb-8">
            {loading && bookings.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-200 rounded-lg animate-pulse"
                />
              ))
            ) : (
              filteredBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/client/reservations/${booking.id}`}
                  className="group"
                >
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {booking.travelCoverImageUrl && (
                        <div className="md:w-1/4 h-32 md:h-auto bg-slate-100 flex-shrink-0">
                          <img
                            src={booking.travelCoverImageUrl}
                            alt={booking.travelTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}

                      {/* Contenu */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {booking.travelTitle}
                          </h3>
                          <p className="text-sm text-slate-600 mb-1">
                            📍 {booking.destinationCity}
                          </p>
                          <p className="text-sm text-slate-600 mb-2">
                            📅 {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
                          </p>
                          <p className="text-sm text-slate-600">
                            👥 {booking.participantCount} participant{booking.participantCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Infos de droite */}
                      <div className="p-6 md:border-l border-t md:border-t-0 border-slate-200 flex flex-col justify-between items-start md:items-end">
                        <div className="text-right w-full md:w-auto mb-4 md:mb-0">
                          <p className="text-2xl font-bold text-slate-900">
                            {formatPrice(booking.totalAmountTTC)}
                          </p>
                          <p className="text-xs text-slate-500">Total</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusBadgeColor[booking.status as keyof typeof statusBadgeColor]
                          }`}
                        >
                          {statusLabels[booking.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Bouton charger plus */}
          {hasMore && !loading && (
            <button
              onClick={() => fetchBookings(cursor || undefined)}
              className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Charger plus de réservations
            </button>
          )}
        </>
      )}
    </div>
  );
}
