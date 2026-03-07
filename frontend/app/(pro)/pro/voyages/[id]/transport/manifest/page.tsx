'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';

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

        const data = await res.json();
        setManifest(data);
        setError(null);
      } catch (err) {
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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Manifest Passagers</h1>
          <p className="text-gray-600 mt-2">Liste détaillée des passagers par arrêt</p>
        </div>
        <Button onClick={handleExportPDF} disabled={exporting} className="gap-2">
          <Download className="w-4 h-4" />
          {exporting ? 'Export...' : 'Exporter PDF'}
        </Button>
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

      {manifest.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Aucun passager enregistré</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {manifest.map((stopData) => (
            <Card key={(stopData.stop as any)?.id as string}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {((stopData.stop as any)?.publicName as string) || 'Arrêt'} ({((stopData.stop as any)?.city as string) || ''})
                </CardTitle>
                <CardDescription>
                  {((stopData.passengers as any) || []).length as number} passager(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 font-semibold">Passager</th>
                        <th className="pb-2 font-semibold">Chambre</th>
                        <th className="pb-2 font-semibold">Mode</th>
                        <th className="pb-2 font-semibold">Statut paiement</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {((stopData.passengers as any) || []).map((p: Record<string, unknown>, idx: number) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-2">
                            {((p.firstName as string) && (p.lastName as string))
                              ? `${p.firstName} ${p.lastName}`
                              : (p.participantId as string) || '—'}
                          </td>
                          <td className="py-2">
                            {(p.roomLabel as string) || (p.roomType as string) || '—'}
                          </td>
                          <td className="py-2 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {(p.departureMode as string) || '—'}
                            </span>
                          </td>
                          <td className="py-2 text-xs">
                            <span className={`px-2 py-1 rounded ${
                              (p.paymentStatus as string) === 'SUCCEEDED'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {(p.paymentStatus as string) === 'SUCCEEDED' ? 'Payé' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
