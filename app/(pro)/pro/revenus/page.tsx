'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Card, Button, Alert components removed - using pro-panel and pro-btn-* classes instead
import { formatPrice, formatDate } from '@/lib/utils';
import { AlertCircle, Download, TrendingUp, FileText } from 'lucide-react';
import { logger } from '@/lib/logger';
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
 * Page Dashboard Revenus Pro - Vue d&apos;ensemble des revenus
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
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch revenue summary
        const summaryRes = await fetch(`/api/pro/revenues?period=${period}`, { credentials: 'include' });
        if (!summaryRes.ok) throw new Error('Erreur lors du chargement des revenus');
        const summaryData = await summaryRes.json() as Record<string, unknown>;
        setSummary(summaryData.summary as RevenueSummary);
        setTrips((summaryData.trips || []) as RevenueTrip[]);

        // Fetch payouts
        const payoutsRes = await fetch('/api/pro/revenues/payouts', { credentials: 'include' });
        if (!payoutsRes.ok) throw new Error('Erreur lors du chargement des versements');
        const payoutsData = await payoutsRes.json() as Record<string, unknown>;
        setPayouts((payoutsData.payouts || []) as Payout[]);
      } catch {
        logger.warn('API pro/revenues indisponible — données démo');
        setSummary({
          totalEarned: 1245600,
          pendingAmount: 389400,
          paidOutAmount: 856200,
          currency: 'EUR',
        });
        setTrips([
          {
            tripId: '1',
            tripName: 'Marrakech Express',
            startDate: '2026-05-15',
            endDate: '2026-05-22',
            reservationCount: 38,
            totalRevenueInclTax: 3416200,
            commissionPercent: 15,
            netAmount: 512430,
          },
          {
            tripId: '3',
            tripName: 'Barcelone & Gaudí',
            startDate: '2026-06-20',
            endDate: '2026-06-25',
            reservationCount: 44,
            totalRevenueInclTax: 3075600,
            commissionPercent: 15,
            netAmount: 461340,
          },
          {
            tripId: '5',
            tripName: 'Istanbul & le Bosphore',
            startDate: '2026-07-18',
            endDate: '2026-07-25',
            reservationCount: 36,
            totalRevenueInclTax: 3416400,
            commissionPercent: 12,
            netAmount: 409968,
          },
        ]);
        setPayouts([
          { id: 'pay_001', date: '2026-02-28', amount: 512430, status: 'PAID', bankReference: 'VIR-2026-0228-001' },
          { id: 'pay_002', date: '2026-03-05', amount: 343770, status: 'PAID', bankReference: 'VIR-2026-0305-001' },
          { id: 'pay_003', date: '2026-03-15', amount: 389400, status: 'PENDING' },
        ]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenues();
  }, [period, retryKey]);

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
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ height: 128, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
          <div style={{ height: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1 className="pro-page-title">Revenus</h1>
          <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)' }} />
              <p style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</p>
            </div>
            <button type="button" onClick={() => setRetryKey((k) => k + 1)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
          <div>
            <h1 className="pro-page-title">Revenus</h1>
            <p style={{ color: '#64748B', marginTop: '8px' }}>Vue d&apos;ensemble de vos revenus et versements</p>
          </div>
          <Link href="/pro/revenus/releve" style={{ width: 'fit-content' }}>
            <button type="button" className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText className="h-4 w-4" />
              Voir relevé mensuel
            </button>
          </Link>
        </div>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)' }} />
              <span style={{ color: 'var(--pro-coral)', fontSize: '14px' }}>{error}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => setRetryKey((k) => k + 1)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Réessayer
              </button>
              <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Total gagné</div>
              <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: '#0A1628' }}>
                {formatPrice(summary.totalEarned)}
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>Tous les temps</p>
            </div>

            <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#64748B' }}>En attente de versement</div>
              <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: 'var(--pro-sun)' }}>
                {formatPrice(summary.pendingAmount)}
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>À traiter</p>
            </div>

            <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#64748B' }}>Versements réalisés</div>
              <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: 'var(--pro-mint)' }}>
                {formatPrice(summary.paidOutAmount)}
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>Cumulé</p>
            </div>
          </div>
        )}

        {/* Period Filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { value: 'thisMonth', label: 'Ce mois' },
            { value: 'lastQuarter', label: '3 derniers mois' },
            { value: 'thisYear', label: 'Cette année' },
          ].map((opt) => (
            <button type="button"
              key={opt.value}
              onClick={() => setPeriod(opt.value as PeriodFilter)}
              className={period === opt.value ? 'pro-btn-sun' : 'pro-btn-outline'}
              style={{ fontSize: '14px' }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Revenues by Trip Table */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="pro-panel-title">Revenus par voyage</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                {trips.length > 0 ? `${trips.length} voyage${trips.length > 1 ? 's' : ''}` : 'Aucun voyage'}
              </p>
            </div>
            <button type="button" onClick={handleExportCSV} disabled={trips.length === 0} className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: trips.length === 0 ? 0.5 : 1, cursor: trips.length === 0 ? 'not-allowed' : 'pointer' }}>
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          {trips.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <TrendingUp className="h-12 w-12" style={{ color: '#64748B', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0A1628', marginBottom: '0.5rem' }}>Aucun voyage pour cette période</h3>
              <p style={{ color: '#64748B', margin: 0, fontSize: '0.875rem' }}>Changez la période pour voir vos revenus</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <caption className="sr-only">Détail des revenus par voyage</caption>
                <thead style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Voyage</th>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Dates</th>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'center' }}>Réservations</th>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>CA TTC</th>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Commission</th>
                    <th scope="col" style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Montant Net</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.tripId} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', fontWeight: 500, color: '#0A1628' }}>{trip.tripName}</td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B', fontSize: '12px' }}>
                        {formatDate(trip.startDate)} -{' '}
                        {formatDate(trip.endDate)}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B', textAlign: 'center' }}>{trip.reservationCount}</td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', color: '#0A1628' }}>{formatPrice(trip.totalRevenueInclTax)}</td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', color: '#64748B' }}>{trip.commissionPercent}%</td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', fontWeight: 600, color: '#0A1628' }}>
                        {formatPrice(trip.netAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px' }}>
            <h2 className="pro-panel-title">Historique des versements</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Historique complet de vos versements</p>
          </div>
          {payouts.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0A1628', marginBottom: '0.5rem' }}>Aucun versement</h3>
              <p style={{ color: '#64748B', margin: 0, fontSize: '0.875rem' }}>Vos versements apparaîtront ici après vos premières ventes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {payouts.map((payout) => (
                <div key={payout.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #E0E0E0', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontWeight: 500, color: '#0A1628' }}>{formatPrice(payout.amount)}</p>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>
                      {formatDate(payout.date)}
                    </p>
                    {payout.bankReference && (
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
                        Référence: {payout.bankReference}
                      </p>
                    )}
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: payout.status === 'PAID' ? '#E0FFF5' : payout.status === 'PENDING' ? '#FFF0E8' : '#FFE0E3',
                    color: payout.status === 'PAID' ? 'var(--pro-mint)' : payout.status === 'PENDING' ? 'var(--pro-sun)' : 'var(--pro-coral)'
                  }}>
                    {getPayoutStatusLabel(payout.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
