'use client';

import { useEffect, useState } from 'react';
import { formatPrice, formatDateTime, formatDate } from '@/lib/utils';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Paiements | Mon Espace Eventy',
  description: 'Historique et suivi de vos paiements',
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
  PENDING: { background: C.goldSoft, color: '#92400e' },
  SUCCEEDED: { background: C.forestBg, color: C.forest },
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

        const data = (await res.json() as unknown) as unknown;
        setPayments(data);
      } catch (err: unknown) {
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
      : payments.filter((p: unknown) => {
          if (filter === 'succeeded') return p.status === 'SUCCEEDED';
          if (filter === 'pending') return p.status === 'PENDING';
          if (filter === 'failed') return p.status === 'FAILED';
          return true;
        });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Historique des paiements</h1>
          <p className="text-sm mt-2" style={{ color: C.muted }}>Consultez tous vos paiements</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_: unknown, i: number) => (
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
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Historique des paiements</h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>Consultez tous vos paiements</p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: `1.5px solid #FCA5A5` }}>
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
      {filteredPayments.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="text-5xl mb-4">💰</div>
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: C.navy }}>Aucun paiement</h2>
          <p className="text-sm" style={{ color: C.muted }}>Vos paiements apparaîtront ici</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: C.cream, borderBottom: `1.5px solid ${C.border}` }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: C.navy }}>Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: C.navy }}>Voyage</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold" style={{ color: C.navy }}>Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: C.navy }}>Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: C.navy }}>Méthode</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: `1.5px solid ${C.border}` }}>
                {filteredPayments.map((payment: unknown, index: number) => (
                  <tr
                    key={payment.id}
                    style={{
                      borderBottom: index < filteredPayments.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.cream;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: C.navy }}>
                      {formatDateTime(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold" style={{ color: C.navy }}>{payment.travelTitle}</p>
                        <p className="text-xs mt-1" style={{ color: C.muted }}>
                          Départ: {formatDate(payment.travelDepartureDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold" style={{ color: C.navy }}>
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
                    <td className="px-6 py-4 text-sm capitalize" style={{ color: C.muted }}>
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
