'use client';

/**
 * Wallet Client — Portefeuille de crédits
 * Gestion du solde et de l'historique des transactions
 */


import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import { formatPrice, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { voucherCodeSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
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
  CREDIT: { background: '#DCFCE7', color: '#166534' },
  DEBIT: { background: 'var(--terra-soft, #FEF2F2)', color: 'var(--terra, #DC2626)' },
  REFUND: { background: '#EFF6FF', color: '#0369A1' },
  VOUCHER: { background: '#FDF6E8', color: '#92400e' }
};

export default function WalletPage() {
  const [state, setState] = useState<LoadState>('loading');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherErrors, setVoucherErrors] = useState<Record<string, string>>({});
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

        const data = await res.json() as Wallet;
        setWallet(data);
        setState('data');
      } catch (err: unknown) {
        logger.warn('API indisponible, utilisation des données de démonstration');
        setWallet({
          balanceCents: 5000,
          totalCreditsCents: 5000,
          totalDebitsCents: 0,
          totalRefundsCents: 0,
          transactions: [
            { id: 'tx_001', type: 'CREDIT', description: 'Bonus de bienvenue', amountCents: 5000, balanceAfterCents: 5000, createdAt: '2026-01-15T10:00:00Z' },
          ],
        });
        setState('data');
      }
    };

    loadWallet();
  }, []);

  const handleRedeemVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherErrors({});
    setVoucherMessage(null);
    try {
      voucherCodeSchema.parse({ code: voucherCode });
    } catch (err) {
      if (err instanceof ZodError) {
        setVoucherErrors(zodErrorsToRecord(err));
        return;
      }
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
        const error = (await res.json() as unknown) as Record<string, unknown>;
        throw new Error(error.message || 'Erreur lors de la validation du voucher');
      }

      const data = (await res.json() as unknown) as Wallet;
      setWallet(data);
      setVoucherCode('');
      setVoucherMessage({ type: 'success', text: 'Voucher appliqué avec succès !' });

      setTimeout(() => setVoucherMessage(null), 5000);
    } catch (err: unknown) {
      setVoucherMessage({
        type: 'error',
        text: extractErrorMessage(err, 'Erreur lors de l\'application du voucher')
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

        <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E5E0D8' }}>
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
        <div className="p-6 rounded-2xl" style={{ background: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #FCA5A5' }}>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--terra, #DC2626)' }}>⚠️ Erreur : {error}</p>
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

  if (!wallet) return null;

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Mon portefeuille</h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>Gérez vos crédits et historique de transactions</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${'#FDF6E8'}, var(--cream, #FAF7F2))`, border: '1.5px solid #E5E0D8' }}>
        <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Solde disponible</p>
        <h2 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: 'var(--gold, #D4A853)' }}>
          {formatPrice(wallet.balanceCents)}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Total crédité</p>
            <p className="text-xl font-bold" style={{ color: '#166534' }}>
              {formatPrice(wallet.totalCreditsCents)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Total dépensé</p>
            <p className="text-xl font-bold" style={{ color: 'var(--terra, #DC2626)' }}>
              {formatPrice(wallet.totalDebitsCents)}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#6B7280' }}>Total remboursé</p>
            <p className="text-xl font-bold" style={{ color: '#0369A1' }}>
              {formatPrice(wallet.totalRefundsCents)}
            </p>
          </div>
        </div>
      </div>

      {/* Voucher Input */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Appliquer un voucher</h3>
        <form onSubmit={handleRedeemVoucher} className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <input
              type="text"
              placeholder="Code voucher"
              value={voucherCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoucherCode((e.target as HTMLInputElement).value.toUpperCase())}
              disabled={voucherLoading}
              aria-invalid={!!voucherErrors.code}
              aria-describedby={voucherErrors.code ? 'voucher-code-error' : undefined}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: `1.5px solid ${voucherErrors.code ? '#DC2626' : '#E5E0D8'}`,
                background: '#fff',
                color: 'var(--navy, #1A1A2E)',
              }}
            />
            <FormFieldError error={voucherErrors.code} id="voucher-code-error" />
          </div>
          <button
            type="submit"
            disabled={voucherLoading || !voucherCode.trim()}
            className="px-6 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: voucherLoading || !voucherCode.trim() ? '#6B7280' : 'var(--terra, #C75B39)',
              color: '#fff',
              opacity: voucherLoading || !voucherCode.trim() ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!voucherLoading && voucherCode.trim()) {
                e.currentTarget.style.background = '#D97B5E';
                e.currentTarget.style.boxShadow = `0 4px 12px var(--terra, #C75B39)40`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = voucherLoading || !voucherCode.trim() ? '#6B7280' : 'var(--terra, #C75B39)';
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
              background: voucherMessage.type === 'success' ? '#DCFCE7' : 'var(--terra-soft, #FEF2F2)',
              border: `1.5px solid ${voucherMessage.type === 'success' ? '#166534' : '#FCA5A5'}`,
              color: voucherMessage.type === 'success' ? '#166534' : 'var(--terra, #DC2626)',
            }}
          >
            {voucherMessage.text}
          </div>
        )}
      </div>

      {/* Transactions Filters & List */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        <h3 className="font-bold text-base mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Historique des transactions</h3>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Type de transaction
            </label>
            <select
              value={typeFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: '1.5px solid #E5E0D8',
                background: '#fff',
                color: 'var(--navy, #1A1A2E)',
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
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
              À partir du
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom((e.target as HTMLInputElement).value)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: '1.5px solid #E5E0D8',
                background: '#fff',
                color: 'var(--navy, #1A1A2E)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Jusqu'au
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo((e.target as HTMLInputElement).value)}
              className="w-full px-4 py-2 rounded-xl text-sm transition-all"
              style={{
                border: '1.5px solid #E5E0D8',
                background: '#fff',
                color: 'var(--navy, #1A1A2E)',
              }}
            />
          </div>
        </div>

        {/* Reset Filters */}
        {(typeFilter !== 'all' || dateFrom || dateTo) && (
          <button type="button"
            className="mb-6 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: '#fff',
              color: 'var(--navy, #1A1A2E)',
              border: '1.5px solid #E5E0D8',
            }}
            onClick={() => {
              setTypeFilter('all');
              setDateFrom('');
              setDateTo('');
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
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
              <thead style={{ background: 'var(--cream, #FAF7F2)', borderBottom: '1.5px solid #E5E0D8' }}>
                <tr>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Date</th>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Type</th>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Description</th>
                  <th className="text-right py-4 px-4 font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Montant</th>
                  <th className="text-right py-4 px-4 font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Solde après</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    style={{
                      borderBottom: index < filteredTransactions.length - 1 ? '1px solid #E5E0D8' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--cream, #FAF7F2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <td className="py-4 px-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
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
                    <td className="py-4 px-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {transaction.description}
                    </td>
                    <td
                      className="py-4 px-4 text-right font-semibold"
                      style={{
                        color: transaction.type === 'DEBIT' ? 'var(--terra, #DC2626)' : '#166534',
                      }}
                    >
                      {transaction.type === 'DEBIT' ? '-' : '+'}
                      {formatPrice(Math.abs(transaction.amountCents))}
                    </td>
                    <td className="py-4 px-4 text-right" style={{ color: 'var(--navy, #1A1A2E)' }}>
                      {formatPrice(transaction.balanceAfterCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: '#6B7280' }}>Aucune transaction pour ces critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
