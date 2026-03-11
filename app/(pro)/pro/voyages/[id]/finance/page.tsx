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

        const data = (await res.json() as unknown) as unknown;
        setFinance(data);
        setError(null);
      } catch (err: unknown) {
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
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628' }}>Finance Voyage</h1>
          <div className="pro-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ color: '#4A5568', margin: 0 }}>Données financières non disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628' }}>Finance Voyage</h1>
          <p style={{ color: '#4A5568', marginTop: '0.5rem' }}>Analyse détaillée CA, coûts et marges</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        <div style={{ padding: '1rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--pro-coral)' }}>{error}</span>
          <button onClick={() => setError(null)} style={{ padding: '0.5rem 1rem', background: '#FFFFFF', color: 'var(--pro-coral)', border: '1px solid #E63946', borderRadius: '0.25rem', cursor: 'pointer' }}>
            Fermer
          </button>
        </div>
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
      <div className="pro-panel" style={{ marginBottom: '0' }}>
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Détail des coûts</h3>
          <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>Modifier et ajouter des coûts</p>
        </div>
        <div className="pro-panel-body" style={{ padding: '0' }}>
          <CostTable
            travelId={travelId}
            costs={((finance?.activityCosts as unknown as unknown[]) || []) as unknown[]}
            onUpdate={() => {
              // Recharger
              setLoading(true);
              fetch(`/api/finance/travel/${travelId}`, { credentials: 'include' })
                .then((r) => r.json())
                .then((data) => setFinance(data))
                .finally(() => setLoading(false));
            }}
          />
        </div>
      </div>
    </div>
    </div>
  );
}
