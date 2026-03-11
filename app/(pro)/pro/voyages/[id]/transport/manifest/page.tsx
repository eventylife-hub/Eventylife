'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, AlertCircle } from 'lucide-react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Manifeste | Eventy Pro',
  description: 'Manifeste passagers',
};

/**
 * Page Manifest Passagers - Tableau des passagers par arrêt
 *
 * Affiche:
 * - Tableau: Arrêt | Passager | Téléphone | Chambre | Statut paiement
 * - Bouton export PDF
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA
 * - Error: Toast
 * - Data: Tableau
 */
export default function ManifestPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Record<string, unknown>[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/transport/${travelId}/manifest`, { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur chargement manifest');

        const data = (await res.json() as unknown) as unknown;
        setManifest(data);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchManifest();
    }
  }, [travelId]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/transport/${travelId}/summary-pdf`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur export PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transport-manifest-${travelId}.pdf`;
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
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>Manifest Passagers</h1>
          <p style={{ color: '#4A5568', marginTop: '0.5rem', margin: 0 }}>Liste détaillée des passagers par arrêt</p>
        </div>
        <button onClick={handleExportPDF} disabled={exporting} className="pro-btn-ocean" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: exporting ? 0.5 : 1 }}>
          <Download style={{ width: '1rem', height: '1rem' }} />
          {exporting ? 'Export...' : 'Exporter PDF'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            Fermer
          </button>
        </div>
      )}

      {manifest.length === 0 ? (
        <div className="pro-panel">
          <div className="pro-panel-body" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <p style={{ color: '#4A5568', margin: 0 }}>Aucun passager enregistré</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {manifest.map((stopData: unknown) => (
            <div key={(stopData.stop as unknown)?.id as string} className="pro-panel">
              <div className="pro-panel-header">
                <h3 className="pro-panel-title" style={{ fontSize: '1.125rem' }}>
                  {((stopData.stop as unknown)?.publicName as string) || 'Arrêt'} ({((stopData.stop as unknown)?.city as string) || ''})
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>
                  {((stopData.passengers as unknown) || []).length as number} passager(s)
                </p>
              </div>
              <div className="pro-panel-body">
                <div style={{ overflowX: 'auto' }}>
                  <table className="pro-table" style={{ width: '100%', fontSize: '0.875rem' }}>
                    <thead style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <tr style={{ textAlign: 'left' }}>
                        <th style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#0A1628' }}>Passager</th>
                        <th style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#0A1628' }}>Chambre</th>
                        <th style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#0A1628' }}>Mode</th>
                        <th style={{ paddingBottom: '0.5rem', fontWeight: '600', color: '#0A1628' }}>Statut paiement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {((stopData.passengers as unknown) || []).map((p: Record<string, unknown>, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#F7FAFC')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', color: '#0A1628' }}>
                            {((p.firstName as string) && (p.lastName as string))
                              ? `${p.firstName} ${p.lastName}`
                              : (p.participantId as string) || '—'}
                          </td>
                          <td style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', color: '#0A1628' }}>
                            {(p.roomLabel as string) || (p.roomType as string) || '—'}
                          </td>
                          <td style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.75rem' }}>
                            <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block' }}>
                              {(p.departureMode as string) || '—'}
                            </span>
                          </td>
                          <td style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              display: 'inline-block',
                              background: (p.paymentStatus as string) === 'SUCCEEDED' ? '#DCFCE7' : '#F3F4F6',
                              color: (p.paymentStatus as string) === 'SUCCEEDED' ? '#166534' : '#374151'
                            }}>
                              {(p.paymentStatus as string) === 'SUCCEEDED' ? 'Payé' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
