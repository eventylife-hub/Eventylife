'use client';

import { useEffect, useState } from 'react';
import { formatPrice, formatDateTime, formatDate } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  paidAt?: string;
  travelTitle: string;
  travelSlug: string;
  travelDepartureDate: string;
  bookingId: string;
}

const statusLabels = {
  PENDING: 'En attente',
  SUCCEEDED: 'Réussi',
  FAILED: 'Échoué',
  REFUNDED: 'Remboursé',
  CANCELED: 'Annulé',
};

const statusColors = {
  PENDING: 'text-yellow-700 bg-yellow-50',
  SUCCEEDED: 'text-green-700 bg-green-50',
  FAILED: 'text-red-700 bg-red-50',
  REFUNDED: 'text-blue-700 bg-blue-50',
  CANCELED: 'text-gray-700 bg-gray-50',
};

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/client/payments', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Impossible de charger l\'historique');

        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments =
    filter === 'all'
      ? payments
      : payments.filter((p) => {
          if (filter === 'succeeded') return p.status === 'SUCCEEDED';
          if (filter === 'pending') return p.status === 'PENDING';
          if (filter === 'failed') return p.status === 'FAILED';
          return true;
        });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Historique des paiements</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Historique des paiements</h1>
        <p className="text-slate-600">Consultez tous vos paiements</p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'succeeded', label: 'Réussis' },
          { value: 'pending', label: 'En attente' },
          { value: 'failed', label: 'Échoués' },
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
      {filteredPayments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
          <div className="text-6xl mb-4">💰</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun paiement</h2>
          <p className="text-slate-600">Vos paiements apparaîtront ici</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Voyage</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Méthode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {formatDateTime(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{payment.travelTitle}</p>
                        <p className="text-xs text-slate-500">
                          Départ: {formatDate(payment.travelDepartureDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                          statusColors[payment.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[payment.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 capitalize">{payment.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
