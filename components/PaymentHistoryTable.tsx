'use client';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  travelTitle: string;
  travelDepartureDate: string;
  bookingId: string;
}

interface PaymentHistoryTableProps {
  payments: Payment[];
  loading?: boolean;
  error?: string | null;
}

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  SUCCEEDED: 'Réussi',
  FAILED: 'Échoué',
  REFUNDED: 'Remboursé',
  CANCELED: 'Annulé',
};

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow-700 bg-yellow-50',
  SUCCEEDED: 'text-green-700 bg-green-50',
  FAILED: 'text-red-700 bg-red-50',
  REFUNDED: 'text-blue-700 bg-blue-50',
  CANCELED: 'text-gray-700 bg-gray-50',
};

export function PaymentHistoryTable({
  payments,
  loading = false,
  error = null,
}: PaymentHistoryTableProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i: number) => (
          <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun paiement</h2>
        <p className="text-slate-600">Vos paiements apparaîtront ici</p>
      </div>
    );
  }

  return (
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
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-700">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{payment.travelTitle}</p>
                    <p className="text-xs text-slate-500">
                      Départ: {new Date(payment.travelDepartureDate).toLocaleDateString('fr-FR')}
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
                <td className="px-6 py-4 text-sm text-slate-700 capitalize">
                  {payment.provider}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
