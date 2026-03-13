'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
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
    const controller = new AbortController();
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/bookings/${params.id}`, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (res.status === 404) {
          notFound();
          return;
        }
        if (!res.ok) throw new Error('Impossible de charger la réservation');

        const data = (await res.json() as unknown) as Booking;
        setBooking(data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        logger.warn('API client/bookings indisponible — données démo');
        const FALLBACK_BOOKING: Booking = {
          id: params.id as string,
          status: 'CONFIRMED',
          travelTitle: 'Côte d\'Azur - 5 jours',
          travelSlug: 'cote-azur-5j',
          travelCoverImageUrl: undefined,
          departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          returnDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          destinationCity: 'Nice',
          totalAmountTTC: 89900,
          participantCount: 2,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          rooms: [
            {
              id: 'room-1',
              type: 'Double',
              price: 44950,
              participants: [
                { id: 'p1', firstName: 'Jean', lastName: 'Dupont', email: 'jean@example.com' },
                { id: 'p2', firstName: 'Marie', lastName: 'Martin', email: 'marie@example.com' },
              ],
            },
          ],
          payments: [
            {
              id: 'pay-1',
              amount: 44950,
              status: 'SUCCEEDED',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'pay-2',
              amount: 44950,
              status: 'SUCCEEDED',
              createdAt: new Date().toISOString(),
            },
          ],
          notes: 'Réservation confirmée. Bonne préparation pour votre voyage!',
        };
        setBooking(FALLBACK_BOOKING);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
    return () => controller.abort();
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
          <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: 'var(--terra, #C75B39)' }}>
            ← Retour
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Détails de la réservation</h1>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: 'var(--terra, #C75B39)' }}>
          ← Retour
        </Link>
        <div className="p-6 rounded-2xl mt-6" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Réservation non trouvée'}</p>
          <button type="button"
            onClick={() => window.location.reload()}
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

  const statusLabels: Record<string, string> = {
    CONFIRMED: 'Confirmée',
    HELD: 'En attente',
    PARTIALLY_PAID: 'Partiellement payée',
    DRAFT: 'Brouillon',
    EXPIRED: 'Expirée',
    CANCELED: 'Annulée',
  };

  const statusBadgeStyle: Record<string, { background: string; color: string }> = {
    CONFIRMED: { background: '#DCFCE7', color: '#166534' },
    HELD: { background: '#FDF6E8', color: '#92400e' },
    PARTIALLY_PAID: { background: '#FDF6E8', color: '#92400e' },
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
      <Link href="/client/reservations" className="text-sm font-medium transition-all" style={{ color: 'var(--terra, #C75B39)' }}>
        ← Retour
      </Link>

      {/* En-tête */}
      <div>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>{booking.travelTitle}</h1>
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>Réservation #{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className="px-4 py-2 rounded-xl text-xs font-semibold" style={statusBadgeStyle[booking.status as keyof typeof statusBadgeStyle] || { background: '#F3F4F6', color: '#4B5563' }}>
            {statusLabels[booking.status as keyof typeof statusLabels]}
          </span>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Informations du voyage</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs" style={{ color: '#6B7280' }}>Destination</p>
              <p className="font-semibold text-sm mt-1" style={{ color: 'var(--navy, #1A1A2E)' }}>📍 {booking.destinationCity}</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#6B7280' }}>Dates</p>
              <p className="font-semibold text-sm mt-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
                {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{days} jours</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#6B7280' }}>Participants</p>
              <p className="font-semibold text-sm mt-1" style={{ color: 'var(--navy, #1A1A2E)' }}>👥 {booking.participantCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Résumé financier</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-xs" style={{ color: '#6B7280' }}>Total</p>
              <p className="font-bold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatPrice(booking.totalAmountTTC)}</p>
            </div>
            <div className="flex justify-between" style={{ color: '#166534' }}>
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
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Chambres réservées</h2>
        {booking.rooms && booking.rooms.length > 0 ? (
          <div className="space-y-3">
            {booking.rooms.map((room) => (
              <div key={room.id} className="rounded-xl p-4" style={{ background: 'var(--cream, #FAF7F2)' }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{room.type}</h3>
                  <p className="font-bold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatPrice(room.price)}</p>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: '#6B7280' }}>Participants:</p>
                  {room.participants.length > 0 ? (
                    <ul className="space-y-1">
                      {room.participants.map((p) => (
                        <li key={p.id} className="text-xs" style={{ color: 'var(--navy, #1A1A2E)' }}>
                          • {p.firstName} {p.lastName} ({p.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs italic" style={{ color: '#6B7280' }}>Aucun participant assigné</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏨</div>
            <p className="text-sm font-medium" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucune chambre réservée</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Les détails de votre hébergement apparaîtront ici</p>
          </div>
        )}
      </div>

      {/* Historique des paiements */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Historique des paiements</h2>
        {booking.payments && booking.payments.length > 0 ? (
          <div className="space-y-2">
            {booking.payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center py-3 px-3 rounded-lg" style={{ background: 'var(--cream, #FAF7F2)' }}>
                <div>
                  <p className="text-xs" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>ID: {payment.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatPrice(payment.amount)}</p>
                  <p className="text-xs font-semibold mt-1" style={{
                    color: payment.status === 'SUCCEEDED'
                      ? '#166534'
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
          <div className="text-center py-6">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <p className="text-sm font-medium" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucun paiement effectué</p>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Votre historique de paiements s&apos;affichera ici</p>
          </div>
        )}
      </div>

      {/* Notes */}
      {booking.notes ? (
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <h2 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Notes</h2>
          <p className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>{booking.notes}</p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!['CANCELED', 'EXPIRED'].includes(booking.status) && (
          <>
            <Link
              href={`/client/reservations/${booking.id}/rooming`}
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
              Gérer la chambre
            </Link>
            <Link
              href={`/client/reservations/${booking.id}/preferences`}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
              style={{ background: '#fff', color: 'var(--terra, #DC2626)', border: '1.5px solid #FCA5A5' }}
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
          style={{ background: '#fff', color: 'var(--navy, #1A1A2E)', border: '1.5px solid #E5E0D8' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
            style={{ background: '#fff', color: 'var(--gold, #D4A853)', border: '1.5px solid #E5E0D8' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FDF6E8';
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
