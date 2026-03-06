'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPrice, formatDate } from '@/lib/utils';
import { AlertCircle, Download, ChevronLeft, FileText } from 'lucide-react';

interface StatementTrip {
  tripName: string;
  startDate: string;
  endDate: string;
  reservationCount: number;
  grossAmountCents: number;
  commissionPercent: number;
  commissionCents: number;
  netAmountCents: number;
}

interface MonthlyStatement {
  month: string;
  trips: StatementTrip[];
  totalGrossCents: number;
  totalCommissionCents: number;
  totalNetCents: number;
}

/**
 * Page Relevé Mensuel - Détail des revenus par mois
 *
 * Affiche:
 * - Sélecteur de mois (6 derniers mois)
 * - Tableau détaillé des voyages du mois
 * - Totaux du mois
 * - Boutons export CSV et PDF
 * - États UI: Loading, Empty, Error, Data
 */
export default function ReleveMensuelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statement, setStatement] = useState<MonthlyStatement | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  // Initialize current month on mount
  useEffect(() => {
    const today = new Date();
    const monthFromUrl = searchParams.get('month');

    if (monthFromUrl && /^\d{4}-\d{2}$/.test(monthFromUrl)) {
      setCurrentMonth(monthFromUrl);
    } else {
      const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      setCurrentMonth(defaultMonth);
    }

    // Generate 6 last months
    const months: string[] = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      months.push(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      );
    }
    setAvailableMonths(months);
  }, [searchParams]);

  // Fetch statement data
  useEffect(() => {
    if (!currentMonth) return;

    const fetchStatement = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/pro/revenues/releve?month=${currentMonth}`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          throw new Error('Erreur lors du chargement du relevé mensuel');
        }

        const data = await res.json();
        setStatement(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();
  }, [currentMonth]);

  // Handle month change
  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
    router.push(`?month=${month}`);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!statement || !statement.trips.length) {
      setError('Aucune donnée à exporter');
      return;
    }

    const headers = [
      'Voyage',
      'Dates',
      'Réservations',
      'CA TTC',
      'Commission %',
      'Montant Commission',
      'Montant Net',
    ];

    const rows = statement.trips.map((trip) => [
      trip.tripName,
      `${trip.startDate} - ${trip.endDate}`,
      trip.reservationCount.toString(),
      (trip.grossAmountCents / 100).toFixed(2),
      trip.commissionPercent.toString(),
      (trip.commissionCents / 100).toFixed(2),
      (trip.netAmountCents / 100).toFixed(2),
    ]);

    const totalsRow = [
      'TOTAL',
      '',
      '',
      (statement.totalGrossCents / 100).toFixed(2),
      '',
      (statement.totalCommissionCents / 100).toFixed(2),
      (statement.totalNetCents / 100).toFixed(2),
    ];

    const csv = [headers, ...rows, totalsRow]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `releve_${currentMonth}.csv`;
    link.click();
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!statement) {
      setError('Aucune donnée à exporter');
      return;
    }

    window.open(
      `/api/pro/revenues/releve?month=${currentMonth}&format=pdf`,
      '_blank'
    );
  };

  // Format month for display
  const formatMonthDisplay = (monthStr: string | undefined) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year || '2000'), parseInt(month || '1') - 1);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/pro/revenus')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux revenus
          </Button>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-96" />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-48" />
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Error state
  if (error && !statement) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/pro/revenus')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux revenus
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Relevé mensuel</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!statement || !statement.trips.length) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/pro/revenus')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour aux revenus
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Relevé mensuel</h1>
          <p className="text-gray-600 mt-2">
            Consultez vos revenus détaillés par mois
          </p>
        </div>

        {/* Month selector */}
        <div className="flex flex-wrap gap-2">
          {availableMonths.map((month) => (
            <Button
              key={month}
              variant={currentMonth === month ? 'default' : 'outline'}
              onClick={() => handleMonthChange(month)}
              size="sm"
            >
              {formatMonthDisplay(month)}
            </Button>
          ))}
        </div>

        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Aucun voyage pour le mois de{' '}
            <strong>{formatMonthDisplay(currentMonth)}</strong>. Sélectionnez
            un autre mois.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Data state
  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/pro/revenus')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour aux revenus
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Relevé mensuel</h1>
        <p className="text-gray-600 mt-2">
          Détail complet des revenus pour{' '}
          <strong>{formatMonthDisplay(currentMonth)}</strong>
        </p>
      </div>

      {/* Error alert if any */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setError(null)}
            >
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Month selector */}
      <div className="flex flex-wrap gap-2">
        {availableMonths.map((month) => (
          <Button
            key={month}
            variant={currentMonth === month ? 'default' : 'outline'}
            onClick={() => handleMonthChange(month)}
            size="sm"
          >
            {formatMonthDisplay(month)}
          </Button>
        ))}
      </div>

      {/* Statement Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Détail des voyages</CardTitle>
              <CardDescription>
                {statement.trips.length} voyage{statement.trips.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExportCSV}
                disabled={!statement.trips.length}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                onClick={handleExportPDF}
                disabled={!statement.trips.length}
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr className="text-left">
                  <th className="pb-3 px-2 font-semibold">Voyage</th>
                  <th className="pb-3 px-2 font-semibold">Dates</th>
                  <th className="pb-3 px-2 font-semibold text-center">
                    Réservations
                  </th>
                  <th className="pb-3 px-2 font-semibold text-right">CA TTC</th>
                  <th className="pb-3 px-2 font-semibold text-right">
                    Commission
                  </th>
                  <th className="pb-3 px-2 font-semibold text-right">
                    Montant Commission
                  </th>
                  <th className="pb-3 px-2 font-semibold text-right">
                    Montant Net
                  </th>
                </tr>
              </thead>
              <tbody>
                {statement.trips.map((trip, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-2 font-medium">{trip.tripName}</td>
                    <td className="py-3 px-2 text-gray-600 text-xs">
                      {formatDate(trip.startDate)} -{' '}
                      {formatDate(trip.endDate)}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600">
                      {trip.reservationCount}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {formatPrice(trip.grossAmountCents)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {trip.commissionPercent}%
                    </td>
                    <td className="py-3 px-2 text-right text-red-600">
                      -{formatPrice(trip.commissionCents)}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-green-600">
                      {formatPrice(trip.netAmountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total CA TTC:</span>
              <span className="font-bold text-lg">
                {formatPrice(statement.totalGrossCents)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total commissions:</span>
              <span className="font-bold text-lg text-red-600">
                -{formatPrice(statement.totalCommissionCents)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="font-semibold">Montant net reçu:</span>
              <span className="font-bold text-xl text-green-600">
                {formatPrice(statement.totalNetCents)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
