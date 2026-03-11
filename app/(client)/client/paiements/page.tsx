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

const statusBadgeStyle = {
  PENDING: { background: '#FDF6E8', color: '#92400e' },
  SUCCEEDED: { background: '#DCFCE7', color: '#166534' },
  FAILED: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
  REFUNDED: { background: '#EFF6FF', color: '#0369A1' },
  CANCELED: { background: '#F3F4F6', color: '#4B5563' },
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

        const data = await res.json() as Record<string, unknown>;
        setPayments((data.items || data || []) as Payment[]);
      } catch {
        console.warn('API paiements indisponible — données démo');
        setPayments([
          {
            id: 'pay_001',
            amount: 89900,
            currency: 'EUR',
            status: 'SUCCEEDED',
            provider: 'stripe',
            createdAt: '2026-01-10T14:30:00Z',
            paidAt: '2026-01-10T14:31:00Z',
            travelTitle: 'Marrakech Express',
            travelSlug: 'marrakech-express',
            travelDepartureDate: '2026-05-15',
            bookingId: 'bk_001',
          },
          {
            id: 'pay_002',
            amount: 34950,
            currency: 'EUR',
            status: 'SUCCEEDED',
            provider: 'stripe',
            createdAt: '2026-02-05T09:15:00Z',
            paidAt: '2026-02-05T09:16:00Z',
            travelTitle: 'Barcelone & Gaudí',
            travelSlug: 'barcelone-gaudi',
            travelDepartureDate: '2026-06-20',
            bookingId: 'bk_002',
          },
          {
            id: 'pay_003',
            amount: 94900,
            currency: 'EUR',
            status: 'PENDING',
            provider: 'stripe',
            createdAt: '2026-03-01T18:45:00Z',
            travelTitle: 'Istanbul & le Bosphore',
            travelSlug: 'istanbul-bosphore',
            travelDepartureDate: '2026-07-18',
            bookingId: 'bk_003',
          },
        ]);
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
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Historique des paiements</h1>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Consultez tous vos paiements</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Historique des paiements</h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Consultez tous vos paiements</p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'all', label: 'Tous' },
          { value: 'succeeded', label: 'Réussis' },
          { value: 'pending', label: 'En attente' },
          { value: 'failed', label: 'Échoués' },
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
      {filteredPayments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">💰</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Aucun paiement</h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>Vos paiements apparaîtront ici</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--cream, #FAF7F2)', borderBottom: '1.5px solid #E5E0D8' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Voyage</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Méthode</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1.5px solid #E5E0D8' }}>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    style={{
                      borderBottom: index < filteredPayments.length - 1 ? '1px solid #E5E0D8' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--cream, #FAF7F2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {formatDateTime(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>{payment.travelTitle}</p>
                        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                          Départ: {formatDate(payment.travelDepartureDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-xl text-xs font-semibold inline-block"
                        style={statusBadgeStyle[payment.status as keyof typeof statusBadgeStyle] || { background: '#F3F4F6', color: '#4B5563' }}
                      >
                        {statusLabels[payment.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize" style={{ color: '#6B7280' }}>
                      {payment.provider}
                    </td>
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
