'use client';

import { useState, useEffect } from 'react';
// Remove Card, Button, Alert imports
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

const FinanceSummary = dynamic(
  () => import('@/components/finance/finance-summary').then((m) => m.FinanceSummary),
  { loading: () => <div className="animate-pulse rounded-xl h-48" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
const MarginChart = dynamic(
  () => import('@/components/finance/margin-chart').then((m) => m.MarginChart),
  { loading: () => <div className="animate-pulse rounded-xl h-64" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
interface FinanceDashboard {
  totalRevenue?: number;
  totalCA?: number;
  totalCosts: number;
  margin?: number;
  totalMargin?: number;
  totalVATMargin?: number;
  averageMarginPercent?: number;
  byMonth?: Record<string, Record<string, unknown>>;
  travelCount?: number;
  travels: Array<Record<string, unknown>>;
}

/**
 * Page Dashboard Finance - Vue d&apos;ensemble financière Pro
 *
 * Affiche:
 * - Résumé: CA total, coûts, marge, TVA (INVARIANT 6)
 * - Graphique évolution CA par mois
 * - Liste voyages avec rentabilité
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA créer voyage
 * - Error: Toast
 * - Data: Dashboard complet
 */
export default function FinanceDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<FinanceDashboard | null>(null);
  const [proProfileId, setProProfileId] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil Pro de l'utilisateur
        const res = await fetch('/api/pro/profile', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement du profil');

        const profile = (await res.json() as unknown) as unknown;
        setProProfileId(profile.id);

        // Charger le dashboard finance
        const finRes = await fetch(`/api/finance/dashboard/${profile.id}`, { credentials: 'include' });
        if (!finRes.ok) throw new Error('Erreur lors du chargement du dashboard financier');

        const data = (await finRes.json() as unknown) as unknown;
        setDashboard(data);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(errorMsg);
        console.error('Erreur finance dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton className="h-10 w-64" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h1 className="pro-page-title">Finance</h1>
          <div className="pro-panel" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <p style={{ color: '#8896A6', marginBottom: '16px' }}>Aucun voyage créé</p>
            <button type="button" onClick={() => (window.location.href = '/pro/voyages/new')} className="pro-btn-sun">
              Créer un voyage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="pro-page-title">Dashboard Finance</h1>
          <p style={{ color: '#8896A6', marginTop: '8px' }}>Vue d&apos;ensemble financière de votre activité</p>
        </div>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#FFE0E3', borderRadius: '8px', border: '1px solid #FFE0E3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</span>
            <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Fermer
            </button>
          </div>
        )}

      {/* Résumé */}
      <FinanceSummary
        caTTC={dashboard.totalCA || dashboard.totalRevenue || 0}
        costsTTC={dashboard.totalCosts}
        margin={dashboard.totalMargin || dashboard.margin || 0}
        tvaMarge={dashboard.totalVATMargin || 0}
        marginPercent={dashboard.averageMarginPercent || 0}
      />

      {/* Graphique */}
      {dashboard.byMonth && Object.entries(dashboard.byMonth).length > 0 && (
        <MarginChart data={Object.entries(dashboard.byMonth).map(([month, data]: [string, Record<string, unknown>]) => ({
          month,
          margin: ((data as Record<string, unknown>).marge as number) || 0,
          ca: ((data as Record<string, unknown>).caTTC as number) || 0,
        }))} />
      )}

      {/* Voyages */}
      <div className="pro-panel">
        <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '16px' }}>
          <h2 className="pro-panel-title">Voyages ({dashboard.travelCount || dashboard.travels.length || 0})</h2>
          <p style={{ fontSize: '14px', color: '#8896A6', marginTop: '4px' }}>Rentabilité par voyage</p>
        </div>
        <div>
          {dashboard.travels && dashboard.travels.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Voyage</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>CA TTC</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Coûts TTC</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Marge</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>TVA Marge</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.travels.map((tf: Record<string, unknown>) => {
                    const marge = (tf.marge as number) || 0;
                    return (
                      <tr key={tf.travelId as string} style={{ borderBottom: '1px solid #E0E0E0' }}>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', fontWeight: 500, color: '#0A1628' }}>{(tf.travelId as string)?.slice(0, 8) || 'N/A'}...</td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', color: '#0A1628' }}>{formatPrice(tf.caTTC as number)}</td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', color: '#0A1628' }}>{formatPrice(tf.coutsTTC as number)}</td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', fontWeight: 600 }}>
                          <span style={{ color: marge >= 0 ? 'var(--pro-mint)' : 'var(--pro-coral)' }}>
                            {formatPrice(marge)}
                          </span>
                        </td>
                        <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right', color: '#8896A6' }}>
                          {formatPrice(tf.tvaMarge as number)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <p style={{ color: '#8896A6' }}>Aucun voyage enregistré</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
