'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FinanceSummary } from '@/components/finance/finance-summary';
import { MarginChart } from '@/components/finance/margin-chart';
import { formatPrice } from '@/lib/utils';

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

        const profile = await res.json();
        setProProfileId(profile.id);

        // Charger le dashboard finance
        const finRes = await fetch(`/api/finance/dashboard/${profile.id}`, { credentials: 'include' });
        if (!finRes.ok) throw new Error('Erreur lors du chargement du dashboard financier');

        const data = await finRes.json();
        setDashboard(data);
      } catch (err) {
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
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Finance</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Aucun voyage créé</p>
            <Button onClick={() => (window.location.href = '/pro/voyages/new')}>
              Créer un voyage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Finance</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble financière de votre activité</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => setError(null)}>
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
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
      <Card>
        <CardHeader>
          <CardTitle>Voyages ({dashboard.travelCount || dashboard.travels.length || 0})</CardTitle>
          <CardDescription>Rentabilité par voyage</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard.travels && dashboard.travels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2 font-semibold">Voyage</th>
                    <th className="pb-2 font-semibold text-right">CA TTC</th>
                    <th className="pb-2 font-semibold text-right">Coûts TTC</th>
                    <th className="pb-2 font-semibold text-right">Marge</th>
                    <th className="pb-2 font-semibold text-right">TVA Marge</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {dashboard.travels.map((tf: Record<string, unknown>) => {
                    const marge = (tf.marge as number) || 0;
                    return (
                      <tr key={tf.travelId as string} className="border-b hover:bg-gray-50">
                        <td className="py-2 font-medium">{(tf.travelId as string)?.slice(0, 8) || 'N/A'}...</td>
                        <td className="py-2 text-right">{formatPrice(tf.caTTC as number)}</td>
                        <td className="py-2 text-right">{formatPrice(tf.coutsTTC as number)}</td>
                        <td className="py-2 text-right font-semibold">
                          <span className={marge >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatPrice(marge)}
                          </span>
                        </td>
                        <td className="py-2 text-right text-gray-600">
                          {formatPrice(tf.tvaMarge as number)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun voyage enregistré</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
