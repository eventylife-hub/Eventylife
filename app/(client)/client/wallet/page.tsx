/**
 * Wallet Client — Portefeuille de crédits
 * Gestion du solde et de l'historique des transactions
 */

'use client';

import { useEffect, useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: '#FEF0EB',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

interface Transaction {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND' | 'VOUCHER';
  description: string;
  amountCents: number;
  balanceAfterCents: number;
  createdAt: string;
}

interface Wallet {
  balanceCents: number;
  totalCreditsCents: number;
  totalDebitsCents: number;
  totalRefundsCents: number;
  transactions: Transaction[];
}

type LoadState = 'loading' | 'error' | 'data';

const typeLabels: Record<Transaction['type'], string> = {
  CREDIT: 'Crédit ajouté',
  DEBIT: 'Dépense',
  REFUND: 'Remboursement',
  VOUCHER: 'Voucher'
};

const typeBadgeStyle: Record<Transaction['type'], { background: string; color: string }> = {
  CREDIT: { background: C.forestBg, color: C.forest },
  DEBIT: { background: '#FEF2F2', color: '#DC2626' },
  REFUND: { background: '#EFF6FF', color: '#0369A1' },
  VOUCHER: { background: C.goldSoft, color: '#92400e' }
};

export default function WalletPage() {
  const [state, setState] = useState<LoadState>('loading');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Filtres
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Charger les données du wallet
  useEffect(() => {
    const loadWallet = async () => {
      try {
        setState('loading');
        setError(null);

        const res = await fetch('/api/client/wallet', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Impossible de charger le portefeuille');
        }

        const data = await res.json();
        setWallet(data);
        setState('data');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
        setState('error');
      }
    };

    loadWallet();
  }, []);

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      setVoucherMessage({ type: 'error', text: 'Veuillez entrer un code voucher' });
      return;
    }

    setVoucherLoading(true);
    try {
      const res = await fetch('/api/client/wallet/redeem-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ voucherCode }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la validation du voucher');
      }

      const data = await res.json();
      setWallet(data);
      setVoucherCode('');
      setVoucherMessage({ type: 'success', text: 'Voucher appliqué avec succès !' });

      setTimeout(() => setVoucherMessage(null), 5000);
    } catch (err) {
      setVoucherMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erreur lors de l\'application du voucher'
      });
    } finally {
      setVoucherLoading(false);
    }
  };

  // Filtrer les transactions
  const getFilteredTransactions = () => {
    if (!wallet) return [];

    let result = wallet.transactions;

    // Filtre par type
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Filtre par date
    if (dateFrom) {
      result = result.filter(t => new Date(t.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter(t => new Date(t.createdAt) <= new Date(dateTo));
    }

    return result;
  };

  if (state === 'loading') {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
        <div>
          <div className="h-8 w-48 rounded-2xl skeleton mb-2" />
          <div className="h-4 w-64 rounded-2xl skeleton" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 rounded-2xl skeleton" />
          <div className="h-48 rounded-2xl skeleton" />
        </div>

        <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: C.border }}>
          <div className="h-8 w-32 rounded-2xl skeleton mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl skeleton mb-2" />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-6xl mx-auto animate-fade-up">
        <div className="p-6 rounded-2xl" style={{ background: '#FEF2F2', border: `1.5px solid #FCA5A5` }}>
          <p className="text-sm font-medium mb-4" style={{ color: '#DC2626' }}>⚠️ Erreur : {error}</p>
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

  if (!wallet) return null;

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>Mon portefeuille</h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>Gérez vos crédits et historique de transactions</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${C.goldSoft}, ${C.cream})`, border: `1.5px solid ${C.border}` }}>
        <p className="text-sm mb-2" style={{ color: C.muted }}>Solde disponible</p>
        <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: C.gold }}>
          {formatPrice(wallet.balanceCents)}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: C.muted }}>Total crédité</p>
            <p className="text-xl font-bold" style={{ color: C.forest }}>
              {formatPrice(wallet.totalCreditsCents)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: C.muted }}>Total dépensé</p>
            <p className="text-xl font-bold" style={{ color: '#DC2626' }}>
              {formatPrice(wallet.totalDebitsCents)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: C.muted }}>Total remboursé</p>
            <p className="text-xl font-bold" style={{ color: '#0369A1' }}>
              {formatPrice(wallet.totalRefundsCents)}
            </p>
          </div>
        </div>
      </div>

      {/* Voucher Input */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h3 className="font-bold text-base mb-4" style={{ color: C.navy }}>Appliquer un voucher</h3>
        <form onSubmit={handleRedeemVoucher} className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Code voucher"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            disabled={voucherLoading}
            className="flex-1 min-w-48 px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              border: `1.5px solid ${C.border}`,
              background: '#fff',
              color: C.navy,
            }}
          />
          <button
            type="submit"
            disabled={voucherLoading || !voucherCode.trim()}
            className="px-6 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: voucherLoading || !voucherCode.trim() ? C.muted : C.terra,
              color: '#fff',
              opacity: voucherLoading || !voucherCode.trim() ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!voucherLoading && voucherCode.trim()) {
                e.currentTarget.style.background = C.terraLight;
                e.currentTarget.style.boxShadow = `0 4px 12px ${C.terra}40`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = voucherLoading || !voucherCode.trim() ? C.muted : C.terra;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {voucherLoading ? 'Traitement...' : 'Appliquer'}
          </button>
        </form>

        {voucherMessage && (
          <div
            className="mt-3 p-3 rounded-xl text-sm"
            style={{
              background: voucherMessage.type === 'success' ? C.forestBg : '#FEF2F2',
              border: `1.5px solid ${voucherMessage.type === 'success' ? C.forest : '#FCA5A5'}`,
              color: voucherMessage.type === 'success' ? C.forest : '#DC2626',
            }}
          >
            {voucherMessage.text}
          </div>
        )}
      </div>

      {/* Transactions Filters & List */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        <h3 className="font-bold text-base mb-4" style={{ color: C.navy }}>Historique des transactions</h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
              Type de transaction
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: `1.5px solid ${C.border}`,
                background: '#fff',
                color: C.navy,
              }}
            >
              <option value="all">Toutes</option>
              <option value="CREDIT">Crédits</option>
              <option value="DEBIT">Dépenses</option>
              <option value="REFUND">Remboursements</option>
              <option value="VOUCHER">Vouchers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
              À partir du
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: `1.5px solid ${C.border}`,
                background: '#fff',
                color: C.navy,
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: C.navy }}>
              Jusqu'au
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: `1.5px solid ${C.border}`,
                background: '#fff',
                color: C.navy,
              }}
            />
          </div>
        </div>

        {/* Reset Filters */}
        {(typeFilter !== 'all' || dateFrom || dateTo) && (
          <button
            className="mb-6 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: '#fff',
              color: C.navy,
              border: `1.5px solid ${C.border}`,
            }}
            onClick={() => {
              setTypeFilter('all');
              setDateFrom('');
              setDateTo('');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraSoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Réinitialiser les filtres
          </button>
        )}

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          {filteredTransactions.length > 0 ? (
            <table className="w-full text-sm">
              <thead style={{ background: C.cream, borderBottom: `1.5px solid ${C.border}` }}>
                <tr>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: C.navy }}>Date</th>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: C.navy }}>Type</th>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: C.navy }}>Description</th>
                  <th className="text-right py-4 px-4 font-bold" style={{ color: C.navy }}>Montant</th>
                  <th className="text-right py-4 px-4 font-bold" style={{ color: C.navy }}>Solde après</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    style={{
                      borderBottom: index < filteredTransactions.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.cream;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <td className="py-4 px-4" style={{ color: C.navy }}>
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="px-3 py-1 rounded-xl text-xs font-semibold inline-block"
                        style={typeBadgeStyle[transaction.type]}
                      >
                        {typeLabels[transaction.type]}
                      </span>
                    </td>
                    <td className="py-4 px-4" style={{ color: C.navy }}>
                      {transaction.description}
                    </td>
                    <td
                      className="py-4 px-4 text-right font-semibold"
                      style={{
                        color: transaction.type === 'DEBIT' ? '#DC2626' : C.forest,
                      }}
                    >
                      {transaction.type === 'DEBIT' ? '-' : '+'}
                      {formatPrice(Math.abs(transaction.amountCents))}
                    </td>
                    <td className="py-4 px-4 text-right" style={{ color: C.navy }}>
                      {formatPrice(transaction.balanceAfterCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: C.muted }}>Aucune transaction pour ces critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
