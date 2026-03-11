'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

        const data = (await res.json() as unknown) as unknown;
        setStatement(data);
      } catch (err: unknown) {
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
      <div className="pro-fade-in p-6 space-y-6">
        <button
          onClick={() => router.push('/pro/revenus')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--pro-sun)',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour aux revenus
        </button>
        <div className="space-y-2">
          <div style={{ height: '2.5rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }} />
          <div style={{ height: '1.25rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite', width: '24rem' }} />
        </div>
        <div style={{ height: '2.5rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite', width: '12rem' }} />
        <div style={{ height: '24rem', background: '#FEFCF3', borderRadius: '0.5rem', animation: 'pulse 2s infinite' }} />
      </div>
    );
  }

  // Error state
  if (error && !statement) {
    return (
      <div className="pro-fade-in p-6 space-y-6">
        <button
          onClick={() => router.push('/pro/revenus')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--pro-sun)',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour aux revenus
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Relevé mensuel
        </h1>
        <div
          style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            <span style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: '1px solid #991b1b',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#991b1b',
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!statement || !statement.trips.length) {
    return (
      <div className="pro-fade-in p-6 space-y-6">
        <button
          onClick={() => router.push('/pro/revenus')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--pro-sun)',
            fontSize: '0.875rem',
            fontWeight: '500',
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour aux revenus
        </button>

        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Relevé mensuel
          </h1>
          <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Consultez vos revenus détaillés par mois
          </p>
        </div>

        {/* Month selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {availableMonths.map((month) => (
            <button
              key={month}
              onClick={() => handleMonthChange(month)}
              style={{
                padding: '0.5rem 1rem',
                background: currentMonth === month ? 'var(--pro-sun)' : 'white',
                color: currentMonth === month ? 'white' : '#0A1628',
                border: currentMonth === month ? 'none' : '1px solid #ccc',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {formatMonthDisplay(month)}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: '1rem',
            background: '#e0f2fe',
            border: '1px solid #0ea5e9',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <FileText className="h-4 w-4" style={{ color: '#0ea5e9' }} />
          <span style={{ color: '#0369a1', fontSize: '0.875rem' }}>
            Aucun voyage pour le mois de{' '}
            <strong>{formatMonthDisplay(currentMonth)}</strong>. Sélectionnez
            un autre mois.
          </span>
        </div>
      </div>
    );
  }

  // Data state
  return (
    <div className="pro-fade-in p-6 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push('/pro/revenus')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--pro-sun)',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        <ChevronLeft className="h-4 w-4" />
        Retour aux revenus
      </button>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Relevé mensuel
        </h1>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Détail complet des revenus pour{' '}
          <strong>{formatMonthDisplay(currentMonth)}</strong>
        </p>
      </div>

      {/* Error alert if any */}
      {error && (
        <div
          style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
            <span style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              padding: '0.25rem 0.75rem',
              background: 'white',
              border: '1px solid #991b1b',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: '500',
              color: '#991b1b',
            }}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Month selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {availableMonths.map((month) => (
          <button
            key={month}
            onClick={() => handleMonthChange(month)}
            style={{
              padding: '0.5rem 1rem',
              background: currentMonth === month ? 'var(--pro-sun)' : 'white',
              color: currentMonth === month ? 'white' : '#0A1628',
              border: currentMonth === month ? 'none' : '1px solid #ccc',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
          >
            {formatMonthDisplay(month)}
          </button>
        ))}
      </div>

      {/* Statement Table */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <div>
            <div className="pro-panel-title">Détail des voyages</div>
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              {statement.trips.length} voyage{statement.trips.length > 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              onClick={handleExportCSV}
              disabled={!statement.trips.length}
              className="pro-btn-outline"
              style={{
                opacity: !statement.trips.length ? 0.5 : 1,
                cursor: !statement.trips.length ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={handleExportPDF}
              disabled={!statement.trips.length}
              className="pro-btn-sun"
              style={{
                opacity: !statement.trips.length ? 0.5 : 1,
                cursor: !statement.trips.length ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
        <div className="pro-panel-body">
          <div style={{ overflowX: 'auto' }}>
            <table className="pro-table">
              <thead style={{ borderBottom: '1px solid #e5e7eb', background: '#fefcf3' }}>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>Voyage</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600' }}>Dates</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600', textAlign: 'center' }}>
                    Réservations
                  </th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600', textAlign: 'right' }}>CA TTC</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600', textAlign: 'right' }}>
                    Commission
                  </th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600', textAlign: 'right' }}>
                    Montant Commission
                  </th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: '600', textAlign: 'right' }}>
                    Montant Net
                  </th>
                </tr>
              </thead>
              <tbody>
                {statement.trips.map((trip, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fefcf3')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                  >
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>{trip.tripName}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#666', fontSize: '0.75rem' }}>
                      {formatDate(trip.startDate)} -{' '}
                      {formatDate(trip.endDate)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: '#666' }}>
                      {trip.reservationCount}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      {formatPrice(trip.grossAmountCents)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#666' }}>
                      {trip.commissionPercent}%
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--pro-coral)' }}>
                      -{formatPrice(trip.commissionCents)}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: '600', color: 'var(--pro-mint)' }}>
                      {formatPrice(trip.netAmountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1.5rem', space: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: '600' }}>Total CA TTC:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
                {formatPrice(statement.totalGrossCents)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: '600' }}>Total commissions:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'var(--pro-coral)' }}>
                -{formatPrice(statement.totalCommissionCents)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#e0f7f4', borderRadius: '0.5rem' }}>
              <span style={{ fontWeight: '600' }}>Montant net reçu:</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--pro-mint)' }}>
                {formatPrice(statement.totalNetCents)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
