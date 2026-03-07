'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FinanceSummary } from '@/components/finance/finance-summary';
import { CostTable } from '@/components/finance/cost-table';
import { Download } from 'lucide-react';

/**
 * Page Finance par Voyage - Détails financiers d'un voyage
 *
 * Affiche:
 * - CA détaillé (par type chambre)
 * - Coûts détaillés (tableau éditable)
 * - Calcul marge et TVA temps réel (INVARIANT 6)
 * - Export CSV et PDF
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA ajouter coûts
 * - Error: Toast
 * - Data: Dashboard + tableau
 */
export default function VoyageFinancePage() {
  const params = useParams();
  const travelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finance, setFinance] = useState<Record<string, unknown> | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/finance/travel/${travelId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur chargement finance');

        const data = await res.json();
        setFinance(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchFinance();
    }
  }, [travelId]);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);
      const res = await fetch(`/api/finance/travel/${travelId}/export?format=${format}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur export');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-${travelId}.${format}`;
      a.click();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Finance Voyage</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Données financières non disponibles</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Finance Voyage</h1>
          <p className="text-gray-600 mt-2">Analyse détaillée CA, coûts et marges</p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            variant="outline"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            CSV
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
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
        caTTC={((finance?.caTTC as unknown as number) || 0) as number}
        costsTTC={((finance?.coutsTTC as unknown as number) || 0) as number}
        margin={((finance?.marge as unknown as number) || 0) as number}
        tvaMarge={((finance?.tvaMarge as unknown as number) || 0) as number}
        marginPercent={
          ((finance?.caTTC as unknown as number) || 0) > 0
            ? Math.round((((finance?.marge as unknown as number) || 0) / ((finance?.caTTC as unknown as number) || 1)) * 100)
            : 0
        }
      />

      {/* Tableau coûts */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des coûts</CardTitle>
          <CardDescription>Modifier et ajouter des coûts</CardDescription>
        </CardHeader>
        <CardContent>
          <CostTable
            travelId={travelId}
            costs={((finance?.activityCosts as unknown as any[]) || []) as any[]}
            onUpdate={() => {
              // Recharger
              setLoading(true);
              fetch(`/api/finance/travel/${travelId}`, { credentials: 'include' })
                .then((r) => r.json())
                .then((data) => setFinance(data))
                .finally(() => setLoading(false));
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
