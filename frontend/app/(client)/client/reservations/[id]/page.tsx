'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';

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

        const data = await res.json();
        setBooking(data);
      } catch (err) {
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/client/reservations" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Détails de la réservation</h1>
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/client/reservations" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Retour
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold mb-4">{error || 'Réservation non trouvée'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-800',
    HELD: 'bg-blue-100 text-blue-800',
    PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    EXPIRED: 'bg-red-100 text-red-800',
    CANCELED: 'bg-red-100 text-red-800',
  };

  const days = getDaysDifference(booking.departureDate, booking.returnDate);
  const paidAmount = booking.payments
    .filter(p => p.status === 'SUCCEEDED')
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = booking.totalAmountTTC - paidAmount;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/client/reservations" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Retour
      </Link>

      {/* En-tête */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{booking.travelTitle}</h1>
            <p className="text-slate-600 mt-2">Réservation #{booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[booking.status as keyof typeof statusColors]}`}>
            {statusLabels[booking.status as keyof typeof statusLabels]}
          </span>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Informations du voyage</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600">Destination</p>
              <p className="font-semibold text-slate-900">📍 {booking.destinationCity}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Dates</p>
              <p className="font-semibold text-slate-900">
                {formatDate(booking.departureDate)} - {formatDate(booking.returnDate)}
              </p>
              <p className="text-xs text-slate-500 mt-1">{days} jours</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Participants</p>
              <p className="font-semibold text-slate-900">👥 {booking.participantCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Résumé financier</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-slate-600">Total</p>
              <p className="font-bold text-slate-900">{formatPrice(booking.totalAmountTTC)}</p>
            </div>
            <div className="flex justify-between text-green-700">
              <p>Payé</p>
              <p className="font-bold">{formatPrice(paidAmount)}</p>
            </div>
            {remainingAmount > 0 && (
              <div className="flex justify-between text-red-700">
                <p>Restant à payer</p>
                <p className="font-bold">{formatPrice(remainingAmount)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chambres */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Chambres réservées</h2>
        {booking.rooms && booking.rooms.length > 0 ? (
          <div className="space-y-4">
            {booking.rooms.map((room) => (
              <div key={room.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{room.type}</h3>
                  </div>
                  <p className="font-bold text-slate-900">{formatPrice(room.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Participants:</p>
                  {room.participants.length > 0 ? (
                    <ul className="space-y-1">
                      {room.participants.map((p) => (
                        <li key={p.id} className="text-sm text-slate-700">
                          • {p.firstName} {p.lastName} ({p.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">Aucun participant assigné</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">Aucune chambre réservée</p>
        )}
      </div>

      {/* Historique des paiements */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Historique des paiements</h2>
        {booking.payments && booking.payments.length > 0 ? (
          <div className="space-y-2">
            {booking.payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm text-slate-600">
                    {formatDate(payment.createdAt)}
                  </p>
                  <p className="text-xs text-slate-500">ID: {payment.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatPrice(payment.amount)}</p>
                  <p className={`text-xs font-semibold ${
                    payment.status === 'SUCCEEDED'
                      ? 'text-green-700'
                      : payment.status === 'PENDING'
                        ? 'text-yellow-700'
                        : 'text-red-700'
                  }`}>
                    {payment.status === 'SUCCEEDED' ? 'Réussi' : payment.status === 'PENDING' ? 'En attente' : 'Échoué'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">Aucun paiement effectué</p>
        )}
      </div>

      {/* Notes */}
      {booking.notes ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Notes</h2>
          <p className="text-slate-700">{booking.notes}</p>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        {!['CANCELED', 'EXPIRED'].includes(booking.status) && (
          <>
            <Link
              href={`/client/reservations/${booking.id}/rooming`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-center"
            >
              Gérer la chambre
            </Link>
            <Link
              href={`/client/reservations/${booking.id}/preferences`}
              className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 text-center"
            >
              Préférences alimentaires
            </Link>
            <Link
              href={`/client/reservations/${booking.id}/annuler`}
              className="px-6 py-3 border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 text-center"
            >
              Annuler la réservation
            </Link>
          </>
        )}
        <Link
          href={`/client/reservations/${booking.id}/facture`}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 text-center"
        >
          Voir la facture
        </Link>
        {booking.status === 'CONFIRMED' && (
          <Link
            href={`/client/reservations/${booking.id}/avis`}
            className="px-6 py-3 border border-yellow-300 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-50 text-center"
          >
            Laisser un avis
          </Link>
        )}
      </div>
    </div>
  );
}
