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

const statusBadgeStyle = {
  CONFIRMED: { background: '#DCFCE7', color: '#166534' },
  HELD: { background: '#FDF6E8', color: '#92400e' },
  PARTIALLY_PAID: { background: '#FDF6E8', color: '#92400e' },
  DRAFT: { background: '#F3F4F6', color: '#4B5563' },
  EXPIRED: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
  CANCELED: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
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

  // Données fallback quand l'API n'est pas disponible
  const FALLBACK_BOOKINGS: Booking[] = [
    {
      id: 'bk_001', status: 'CONFIRMED', travelTitle: 'Marrakech Express', travelSlug: 'marrakech-express',
      travelCoverImageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
      departureDate: '2026-05-15', returnDate: '2026-05-22', destinationCity: 'Marrakech',
      totalAmountTTC: 89900, participantCount: 2, createdAt: '2026-01-10T14:30:00Z',
    },
    {
      id: 'bk_002', status: 'CONFIRMED', travelTitle: 'Barcelone & Gaudí', travelSlug: 'barcelone-gaudi',
      travelCoverImageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
      departureDate: '2026-06-20', returnDate: '2026-06-25', destinationCity: 'Barcelone',
      totalAmountTTC: 69900, participantCount: 1, createdAt: '2026-02-05T09:15:00Z',
    },
    {
      id: 'bk_003', status: 'HELD', travelTitle: 'Istanbul & le Bosphore', travelSlug: 'istanbul-bosphore',
      travelCoverImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
      departureDate: '2026-07-18', returnDate: '2026-07-25', destinationCity: 'Istanbul',
      totalAmountTTC: 94900, participantCount: 2, createdAt: '2026-03-01T18:45:00Z',
    },
  ];

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

      const data = await res.json() as Record<string, unknown>;
      const items = (data?.items || []) as Booking[];
      setBookings(cursorValue ? [...bookings, ...items] : items);
      setCursor((data.nextCursor as string) || null);
      setHasMore(Boolean(data.hasMore));
    } catch (err: unknown) {
      console.warn('API indisponible, utilisation des données de démonstration');
      setBookings(FALLBACK_BOOKINGS);
      setHasMore(false);
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
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes réservations</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos réservations de voyages</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button type="button"
            onClick={() => fetchBookings()}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
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
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes réservations</h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos réservations de voyages</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'confirmed', label: 'Confirmées' },
          { value: 'pending', label: 'En attente' },
          { value: 'cancelled', label: 'Annulées' },
        ].map((f) => (
          <button type="button"
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === f.value ? 'var(--terra, #C75B39)' : '#fff',
              color: filter === f.value ? '#fff' : 'var(--navy, #1A1A2E)',
              border: `1.5px solid ${filter === f.value ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== f.value) {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== f.value) {
                e.currentTarget.style.background = '#fff';
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* État vide */}
      {filteredBookings.length === 0 && !loading ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">📭</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucune réservation</h2>
          <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Vous n&apos;avez pas encore réservé de voyage</p>
          <Link
            href="/voyages"
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
            Découvrir les voyages →
          </Link>
        </div>
      ) : (
        <>
          {/* Liste des réservations */}
          <div className="space-y-4">
            {loading && bookings.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl skeleton" />
              ))
            ) : (
              filteredBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/client/reservations/${booking.id}`}
                  className="group block"
                >
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#fff',
                      border: '1.5px solid #E5E0D8',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,26,46,0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      {booking.travelCoverImageUrl && (
                        <div className="md:w-1/4 h-32 md:h-auto flex-shrink-0" style={{ background: 'var(--cream, #FAF7F2)' }}>
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
                          <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
                            {booking.travelTitle}
                          </h3>
                          <p className="text-xs mb-1" style={{ color: '#6B7280' }}>
                            📍 {booking.destinationCity}
                          </p>
                          <p className="text-xs mb-2" style={{ color: '#6B7280' }}>
                            📅 {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
                          </p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>
                            👥 {booking.participantCount} participant{booking.participantCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Infos de droite */}
                      <div className="p-6 md:border-l border-t md:border-t-0 flex flex-col justify-between items-start md:items-end" style={{ borderColor: '#E5E0D8' }}>
                        <div className="text-right w-full md:w-auto mb-4 md:mb-0">
                          <p className="text-lg font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                            {formatPrice(booking.totalAmountTTC)}
                          </p>
                          <p className="text-xs" style={{ color: '#6B7280' }}>Total</p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-xl text-xs font-semibold"
                          style={statusBadgeStyle[booking.status as keyof typeof statusBadgeStyle] || { background: '#F3F4F6', color: '#4B5563' }}
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
            <button type="button"
              onClick={() => fetchBookings(cursor || undefined)}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: '#fff',
                color: 'var(--navy, #1A1A2E)',
                border: '1.5px solid #E5E0D8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Charger plus de réservations
            </button>
          )}
        </>
      )}
    </div>
  );
}
