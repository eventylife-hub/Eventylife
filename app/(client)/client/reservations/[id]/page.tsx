'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Ma Réservation | Eventy Life',
  description: 'Détail de votre réservation',
};

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

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Room {
  id: string;
  type: string;
  price: number;
  participants: Participant[];
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

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
  rooms: Room[];
  payments: Payment[];
  notes?: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/bookings/${params.id}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Impossible de charger la réservation');

        const data = (await res.json() as unknown) as unknown;
        setBooking(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.id]);

  const getDaysDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <div className="mb-8">
          <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: C.terra }}>
            ← Retour
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-4" style={{ color: C.navy }}>Détails de la réservation</h1>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_: unknown, i: number) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: C.terra }}>
          ← Retour
        </Link>
        <div className="p-6 rounded-2xl mt-6" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Réservation non trouvée'}</p>
          <button
            onClick={() => window.location.reload()}
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

  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Confirmée',
    HELD: 'En attente',
    PARTIALLY_PAID: 'Partiellement payée',
    DRAFT: 'Brouillon',
    EXPIRED: 'Expirée',
    CANCELED: 'Annulée',
  };

  const statusBadgeStyle: Record<string, { background: string; color: string }> = {
    CONFIRMED: { background: C.forestBg, color: C.forest },
    HELD: { background: C.goldSoft, color: '#92400e' },
    PARTIALLY_PAID: { background: C.goldSoft, color: '#92400e' },
    DRAFT: { background: '#F3F4F6', color: '#4B5563' },
    EXPIRED: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
    CANCELED: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
  };

  const days = getDaysDifference(booking.departureDate, booking.returnDate);
  const paidAmount = booking.payments
    .filter(p => p.status === 'SUCCEEDED')
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = booking.totalAmountTTC - paidAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: C.terra }}>
        ← Retour
      </Link>

      {/* En-tête */}
      <div>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>{booking.travelTitle}</h1>
            <p className="text-xs mt-2" style={{ color: C.muted }}>Réservation #{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className="px-4 py-2 rounded-xl text-xs font-semibold" style={statusBadgeStyle[booking.status as keyof typeof statusBadgeStyle] || { background: '#F3F4F6', color: '#4B5563' }}>
            {statusLabels[booking.status as keyof typeof statusLabels]}
          </span>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Informations du voyage</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs" style={{ color: C.muted }}>Destination</p>
              <p className="font-semibold text-sm mt-1" style={{ color: C.navy }}>📍 {booking.destinationCity}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: C.muted }}>Dates</p>
              <p className="font-semibold text-sm mt-1" style={{ color: C.navy }}>
                {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
              </p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{days} jours</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: C.muted }}>Participants</p>
              <p className="font-semibold text-sm mt-1" style={{ color: C.navy }}>👥 {booking.participantCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Résumé financier</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-xs" style={{ color: C.muted }}>Total</p>
              <p className="font-bold text-sm" style={{ color: C.navy }}>{formatPrice(booking.totalAmountTTC)}</p>
            </div>
            <div className="flex justify-between" style={{ color: C.forest }}>
              <p className="text-xs">Payé</p>
              <p className="font-bold text-sm">{formatPrice(paidAmount)}</p>
            </div>
            {remainingAmount > 0 && (
              <div className="flex justify-between" style={{ color: 'var(--terra, #DC2626)' }}>
                <p className="text-xs">Restant à payer</p>
                <p className="font-bold text-sm">{formatPrice(remainingAmount)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chambres */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Chambres réservées</h2>
        {booking.rooms && booking.rooms.length > 0 ? (
          <div className="space-y-3">
            {booking.rooms.map((room: unknown) => (
              <div key={room.id} className="rounded-xl p-4" style={{ background: C.cream }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-sm" style={{ color: C.navy }}>{room.type}</h3>
                  <p className="font-bold text-sm" style={{ color: C.navy }}>{formatPrice(room.price)}</p>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: C.muted }}>Participants:</p>
                  {room.participants.length > 0 ? (
                    <ul className="space-y-1">
                      {room.participants.map((p: unknown) => (
                        <li key={p.id} className="text-xs" style={{ color: C.navy }}>
                          • {p.firstName} {p.lastName} ({p.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic" style={{ color: C.muted }}>Aucun participant assigné</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: C.muted }}>Aucune chambre réservée</p>
        )}
      </div>

      {/* Historique des paiements */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Historique des paiements</h2>
        {booking.payments && booking.payments.length > 0 ? (
          <div className="space-y-2">
            {booking.payments.map((payment: unknown) => (
              <div key={payment.id} className="flex justify-between items-center py-3 px-3 rounded-lg" style={{ background: C.cream }}>
                <div>
                  <p className="text-xs" style={{ color: C.navy }}>
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>ID: {payment.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: C.navy }}>{formatPrice(payment.amount)}</p>
                  <p className="text-xs font-semibold mt-1" style={{
                    color: payment.status === 'SUCCEEDED'
                      ? C.forest
                      : payment.status === 'PENDING'
                        ? '#92400e'
                        : 'var(--terra, #DC2626)'
                  }}>
                    {payment.status === 'SUCCEEDED' ? 'Réussi' : payment.status === 'PENDING' ? 'En attente' : 'Échoué'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center py-4" style={{ color: C.muted }}>Aucun paiement effectué</p>
        )}
      </div>

      {/* Notes */}
      {booking.notes ? (
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <h2 className="font-bold text-base mb-4" style={{ color: C.navy }}>Notes</h2>
          <p className="text-sm" style={{ color: C.navy }}>{booking.notes}</p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!['CANCELED', 'EXPIRED'].includes(booking.status) && (
          <>
            <Link
              href={`/client/reservations/${booking.id}/rooming`}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
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
              Gérer la chambre
            </Link>
            <Link
              href={`/client/reservations/${booking.id}/preferences`}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.terraSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Préférences alimentaires
            </Link>
            <Link
              href={`/client/reservations/${booking.id}/annuler`}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: '#fff', color: 'var(--terra, #DC2626)', border: `1.5px solid #FCA5A5` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--terra-soft, #FEF2F2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
              }}
            >
              Annuler la réservation
            </Link>
          </>
        )}
        <Link
          href={`/client/reservations/${booking.id}/facture`}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ background: '#fff', color: C.navy, border: `1.5px solid ${C.border}` }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.terraSoft;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
          }}
        >
          Voir la facture
        </Link>
        {booking.status === 'CONFIRMED' && (
          <Link
            href={`/client/reservations/${booking.id}/avis`}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: '#fff', color: C.gold, border: `1.5px solid ${C.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.goldSoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Laisser un avis
          </Link>
        )}
      </div>
    </div>
  );
}
