'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/stats-card';
import { Skeleton, SkeletonList } from '@/components/ui/skeleton';
import { Download, Wallet, TrendingUp, AlertCircle, RefreshCw, CreditCard, RotateCcw, Settings, FileText, Zap } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

/**
 * PATCH LOT 8 — G1 : Page Finance corrigée
 *
 * Corrections :
 * - formatPrice centralisé (centimes → euros) — INVARIANT 3
 * - stats.map() remplacé par stats.monthlyData (objet vs tableau)
 * - Placeholder Paiements/Remboursements remplacés par vraies listes API
 * - État erreur ajouté avec retry
 * - Interfaces typées (plus de any)
 */

interface RevenueStats {
  totalRevenueCents: number;
  monthlyRevenueCents: number;
  refundsCents: number;
  monthlyData: { month: string; revenueCents: number }[];
}

interface Payment {
  id: string;
  bookingRef: string;
  amountCents: number;
  status: string;
  createdAt: string;
}

interface Refund {
  id: string;
  bookingRef: string;
  amountCents: number;
  reason: string;
  status: string;
  createdAt: string;
}

export default function FinancePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [revenueRes, paymentsRes, refundsRes] = await Promise.all([
        fetch('/api/admin/dashboard/revenue', { credentials: 'include' }),
        fetch('/api/admin/finance/payments?limit=5', { credentials: 'include' }),
        fetch('/api/admin/finance/refunds?status=PENDING', { credentials: 'include' }),
      ]);

      if (!revenueRes.ok) {
        if (revenueRes.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error('Impossible de charger les données financières');
      }

      const revenueData = await revenueRes.json();
      setStats(revenueData);

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.items || paymentsData || []);
      }

      if (refundsRes.ok) {
        const refundsData = await refundsRes.json();
        setRefunds(refundsData.items || refundsData || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données financières');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /** INVARIANT 3 : formatPrice centralisé (centimes Int → euros) */

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/finance/export', {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-finance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (_err) {
      // Export silencieux — erreur non critique
    }
  };

  // État erreur
  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 font-medium mb-2">{error}</p>
          <p className="text-red-600 text-sm mb-4">Vérifiez votre connexion et réessayez.</p>
          <Button onClick={fetchAll} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600 mt-2">
            Gérez les paiements, remboursements et rapports financiers
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/exports?type=finance" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Voir les exports</h3>
                <p className="text-sm text-gray-600">Accédez à l'historique des exports</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/finance/payouts" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Versements</h3>
                <p className="text-sm text-gray-600">Gestion des versements PayRun</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/parametres" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Paramètres financiers</h3>
                <p className="text-sm text-gray-600">Cotisations et configuration</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton height="1rem" width="100%" />
                <Skeleton height="2rem" width="80%" />
                <Skeleton height="0.75rem" width="60%" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            icon={<Wallet />}
            title="Chiffre d'affaires total"
            value={formatPrice(stats.totalRevenueCents)}
          />
          <StatsCard
            icon={<TrendingUp />}
            title="CA ce mois"
            value={formatPrice(stats.monthlyRevenueCents)}
          />
          <StatsCard
            icon={<RotateCcw />}
            title="Remboursements"
            value={formatPrice(stats.refundsCents)}
          />
          <StatsCard
            icon={<Wallet />}
            title="Solde net"
            value={formatPrice(stats.totalRevenueCents - stats.refundsCents)}
          />
        </div>
      ) : null}

      {/* Graphique Revenue — utilise stats.monthlyData (tableau) et non stats (objet) */}
      {!loading && stats?.monthlyData && stats.monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Revenus par mois</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2">
              {stats.monthlyData.map((item, index) => {
                const maxRevenue = Math.max(
                  ...stats.monthlyData.map((s) => s.revenueCents),
                );
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-gray-500 font-medium">
                      {formatPrice(item.revenueCents)}
                    </span>
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{
                        height: `${Math.max(
                          maxRevenue > 0
                            ? (item.revenueCents / maxRevenue) * 200
                            : 5,
                          5,
                        )}px`,
                      }}
                    />
                    <span className="text-xs text-gray-600 text-center">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Paiements récents et Remboursements en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paiements récents */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Paiements récents</h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonList count={3} height="60px" />
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucun paiement récent</p>
              </div>
            ) : (
              <div className="space-y-2">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Réservation #{payment.bookingRef}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(payment.amountCents)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          payment.status === 'SUCCEEDED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {payment.status === 'SUCCEEDED' ? 'Réussi' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Remboursements en attente */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Remboursements en attente</h3>
          </CardHeader>
          <CardContent>
            {loading ? (
              <SkeletonList count={3} height="60px" />
            ) : refunds.length === 0 ? (
              <div className="text-center py-8">
                <RotateCcw className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Aucun remboursement en attente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Réservation #{refund.bookingRef}
                      </p>
                      <p className="text-xs text-gray-500">
                        {refund.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-700">
                        -{formatPrice(refund.amountCents)}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">
                        En attente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
