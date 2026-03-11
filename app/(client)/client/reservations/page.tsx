'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

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
  CONFIRMED: { background: C.forestBg, color: C.forest },
  HELD: { background: C.goldSoft, color: '#92400e' },
  PARTIALLY_PAID: { background: C.goldSoft, color: '#92400e' },
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

      const data = (await res.json() as unknown) as unknown;
      setBookings(cursorValue ? [...bookings, ...data?.items] : data?.items);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err: unknown) {
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
      : bookings.filter((b: unknown) => {
          if (filter === 'confirmed') return b.status === 'CONFIRMED';
          if (filter === 'pending') return ['HELD', 'PARTIALLY_PAID'].includes(b.status);
          if (filter === 'cancelled') return b.status === 'CANCELED';
          return true;
        });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mes réservations</h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos réservations de voyages</p>
        </div>
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
          <button
            onClick={() => fetchBookings()}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
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
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mes réservations</h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos réservations de voyages</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'confirmed', label: 'Confirmées' },
          { value: 'pending', label: 'En attente' },
          { value: 'cancelled', label: 'Annulées' },
        ].map((f: unknown) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === f.value ? C.terra : '#fff',
              color: filter === f.value ? '#fff' : C.navy,
              border: `1.5px solid ${filter === f.value ? C.terra : C.border}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== f.value) {
                e.currentTarget.style.background = C.terraSoft;
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
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="text-5xl mb-4">📭</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>Aucune réservation</h2>
          <p className="text-sm mb-6" style={{ color: C.muted }}>Vous n&apos;avez pas encore réservé de voyage</p>
          <Link
            href="/voyages"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: C.terra, color: '#fff' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraLight;
              e.currentTarget.style.boxShadow = `0 6px 24px ${C.terra}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.terra;
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
              [...Array(3)].map((_: unknown, i: number) => (
                <div key={i} className="h-32 rounded-2xl skeleton" />
              ))
            ) : (
              filteredBookings.map((booking: unknown) => (
                <Link
                  key={booking.id}
                  href={`/client/reservations/${booking.id}`}
                  className="group block"
                >
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#fff',
                      border: `1.5px solid ${C.border}`,
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
                        <div className="md:w-1/4 h-32 md:h-auto flex-shrink-0" style={{ background: C.cream }}>
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
                          <h3 className="font-bold text-base mb-2" style={{ color: C.navy }}>
                            {booking.travelTitle}
                          </h3>
                          <p className="text-xs mb-1" style={{ color: C.muted }}>
                            📍 {booking.destinationCity}
                          </p>
                          <p className="text-xs mb-2" style={{ color: C.muted }}>
                            📅 {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
                          </p>
                          <p className="text-xs" style={{ color: C.muted }}>
                            👥 {booking.participantCount} participant{booking.participantCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Infos de droite */}
                      <div className="p-6 md:border-l border-t md:border-t-0 flex flex-col justify-between items-start md:items-end" style={{ borderColor: C.border }}>
                        <div className="text-right w-full md:w-auto mb-4 md:mb-0">
                          <p className="text-lg font-bold" style={{ color: C.navy }}>
                            {formatPrice(booking.totalAmountTTC)}
                          </p>
                          <p className="text-xs" style={{ color: C.muted }}>Total</p>
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
            <button
              onClick={() => fetchBookings(cursor || undefined)}
              className="w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: '#fff',
                color: C.navy,
                border: `1.5px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.terraSoft;
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
