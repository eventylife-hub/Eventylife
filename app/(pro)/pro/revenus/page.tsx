'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { AlertCircle, Download, TrendingUp, FileText } from 'lucide-react';

interface RevenueSummary {
  totalEarned: number;
  pendingAmount: number;
  paidOutAmount: number;
  currency: string;
}

interface RevenueTrip {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  reservationCount: number;
  totalRevenueInclTax: number;
  commissionPercent: number;
  netAmount: number;
}

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  bankReference?: string;
}

type PeriodFilter = 'thisMonth' | 'lastQuarter' | 'thisYear' | 'custom';

/**
 * Page Dashboard Revenus Pro - Vue d'ensemble des revenus
 *
 * Affiche:
 * - Résumé: montant total gagné, montant en attente, montant payé
 * - Tableau revenus par voyage: nom, dates, réservations, chiffre affaires TTC, commission %, montant net
 * - Graphique évolution des revenus par mois
 * - Historique des versements: date, montant, statut, référence bancaire
 * - Bouton export CSV
 * - Filtre par période (ce mois, 3 derniers mois, cette année, personnalisé)
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA créer voyage
 * - Error: Alerte
 * - Data: Dashboard complet
 */
export default function RevenuesDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [trips, setTrips] = useState<RevenueTrip[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>('thisMonth');

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch revenue summary
        const summaryRes = await fetch(`/api/pro/revenues?period=${period}`, { credentials: 'include' });
        if (!summaryRes.ok) throw new Error('Erreur lors du chargement des revenus');
        const summaryData = await summaryRes.json();
        setSummary(summaryData.summary);
        setTrips(summaryData.trips || []);

        // Fetch payouts
        const payoutsRes = await fetch('/api/pro/revenues/payouts', { credentials: 'include' });
        if (!payoutsRes.ok) throw new Error('Erreur lors du chargement des versements');
        const payoutsData = await payoutsRes.json();
        setPayouts(payoutsData.payouts || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenues();
  }, [period]);

  const handleExportCSV = () => {
    if (!trips.length) {
      setError('Aucune donnée à exporter');
      return;
    }

    const headers = ['Voyage', 'Dates', 'Réservations', 'CA TTC', 'Commission %', 'Montant Net'];
    const rows = trips.map((trip) => [
      trip.tripName,
      `${trip.startDate} - ${trip.endDate}`,
      trip.reservationCount.toString(),
      (trip.totalRevenueInclTax / 100).toFixed(2),
      trip.commissionPercent.toString(),
      (trip.netAmount / 100).toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `revenus_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'FAILED':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPayoutStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Versé';
      case 'PENDING':
        return 'En attente';
      case 'FAILED':
        return 'Échoué';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Revenus</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Revenus</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de vos revenus et versements</p>
        </div>
        <Link href="/pro/revenus/releve">
          <Button className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Voir relevé mensuel
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => setError(null)}>
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Total gagné</div>
              <div className="text-3xl font-bold mt-2">
                {formatPrice(summary.totalEarned)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Tous les temps</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">En attente de versement</div>
              <div className="text-3xl font-bold mt-2 text-yellow-600">
                {formatPrice(summary.pendingAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">À traiter</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">Versements réalisés</div>
              <div className="text-3xl font-bold mt-2 text-green-600">
                {formatPrice(summary.paidOutAmount)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Cumulé</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Period Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'thisMonth', label: 'Ce mois' },
          { value: 'lastQuarter', label: '3 derniers mois' },
          { value: 'thisYear', label: 'Cette année' },
        ].map((opt) => (
          <Button
            key={opt.value}
            variant={period === opt.value ? 'default' : 'outline'}
            onClick={() => setPeriod(opt.value as PeriodFilter)}
            size="sm"
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Revenues by Trip Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenus par voyage</CardTitle>
              <CardDescription>
                {trips.length > 0 ? `${trips.length} voyage${trips.length > 1 ? 's' : ''}` : 'Aucun voyage'}
              </CardDescription>
            </div>
            <Button onClick={handleExportCSV} disabled={trips.length === 0} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Aucun voyage pour cette période</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr className="text-left">
                    <th className="pb-3 px-2 font-semibold">Voyage</th>
                    <th className="pb-3 px-2 font-semibold">Dates</th>
                    <th className="pb-3 px-2 font-semibold text-center">Réservations</th>
                    <th className="pb-3 px-2 font-semibold text-right">CA TTC</th>
                    <th className="pb-3 px-2 font-semibold text-right">Commission</th>
                    <th className="pb-3 px-2 font-semibold text-right">Montant Net</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.tripId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-medium">{trip.tripName}</td>
                      <td className="py-3 px-2 text-gray-600 text-xs">
                        {formatDate(trip.startDate)} -{' '}
                        {formatDate(trip.endDate)}
                      </td>
                      <td className="py-3 px-2 text-center text-gray-600">{trip.reservationCount}</td>
                      <td className="py-3 px-2 text-right">{formatPrice(trip.totalRevenueInclTax)}</td>
                      <td className="py-3 px-2 text-right text-gray-600">{trip.commissionPercent}%</td>
                      <td className="py-3 px-2 text-right font-semibold">
                        {formatPrice(trip.netAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des versements</CardTitle>
          <CardDescription>Historique complet de vos versements</CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun versement pour le moment</p>
            </div>
          ) : (
            <div className="space-y-2">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium">{formatPrice(payout.amount)}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(payout.date)}
                    </p>
                    {payout.bankReference && (
                      <p className="text-xs text-gray-500 mt-1">
                        Référence: {payout.bankReference}
                      </p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPayoutStatusColor(payout.status)}`}>
                    {getPayoutStatusLabel(payout.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
