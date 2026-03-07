/**
 * Wallet Client — Portefeuille de crédits
 * Gestion du solde et de l'historique des transactions
 */

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';

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

const typeBadgeColor: Record<Transaction['type'], string> = {
  CREDIT: 'bg-green-100 text-green-800',
  DEBIT: 'bg-red-100 text-red-800',
  REFUND: 'bg-blue-100 text-blue-800',
  VOUCHER: 'bg-purple-100 text-purple-800'
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
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          Erreur : {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon portefeuille</h1>
        <p className="text-gray-600">Gérez vos crédits et historique de transactions</p>
      </div>

      {/* Balance Card */}
      <Card elevated className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-8">
          <p className="text-gray-700 mb-2">Solde disponible</p>
          <h2 className="text-5xl font-bold text-blue-600 mb-6">
            {formatPrice(wallet.balanceCents)}
          </h2>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total crédité</p>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(wallet.totalCreditsCents)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total dépensé</p>
              <p className="text-xl font-bold text-red-600">
                {formatPrice(wallet.totalDebitsCents)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total remboursé</p>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(wallet.totalRefundsCents)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voucher Input */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Appliquer un voucher</h3>
          <form onSubmit={handleRedeemVoucher} className="flex gap-3">
            <Input
              type="text"
              placeholder="Code voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              disabled={voucherLoading}
            />
            <Button
              variant="primary"
              type="submit"
              disabled={voucherLoading || !voucherCode.trim()}
            >
              {voucherLoading ? 'Traitement...' : 'Appliquer'}
            </Button>
          </form>

          {voucherMessage && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${
                voucherMessage.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {voucherMessage.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Filters & List */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4">Historique des transactions</h3>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de transaction
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="all">Toutes</option>
                  <option value="CREDIT">Crédits</option>
                  <option value="DEBIT">Dépenses</option>
                  <option value="REFUND">Remboursements</option>
                  <option value="VOUCHER">Vouchers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  À partir du
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jusqu'au
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            {/* Reset Filters */}
            {(typeFilter !== 'all' || dateFrom || dateTo) && (
              <Button
                variant="outline"
                size="sm"
                className="mb-4"
                onClick={() => {
                  setTypeFilter('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            {filteredTransactions.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Description</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Montant</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Solde après</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={typeBadgeColor[transaction.type]}>
                          {typeLabels[transaction.type]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {transaction.description}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${
                        transaction.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'DEBIT' ? '-' : '+'}
                        {formatPrice(Math.abs(transaction.amountCents))}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {formatPrice(transaction.balanceAfterCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune transaction pour ces critères.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
