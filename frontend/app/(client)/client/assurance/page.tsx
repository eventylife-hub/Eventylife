'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { InsuranceCard } from '@/components/insurance/insurance-card';
import { Download } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

/**
 * Page Mes Assurances - Vue client
 *
 * Affiche:
 * - Liste souscriptions avec statut, couverture, prix
 * - Télécharger certificat PDF
 * - Bouton souscrire pour réservations sans assurance
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA souscrire
 * - Error: Toast
 * - Data: Cartes assurances
 */
export default function AssurancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insurances, setInsurances] = useState<Record<string, unknown>[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/insurance/mine', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Erreur chargement assurances');

        const data = await res.json();
        setInsurances(data.insurances);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const handleDownloadCertificate = async (subscriptionId: string) => {
    try {
      setDownloadingId(subscriptionId);
      const res = await fetch(`/api/insurance/${subscriptionId}/certificate`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erreur téléchargement');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${subscriptionId}.pdf`;
      a.click();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Assurances</h1>
        <p className="text-gray-600 mt-2">Gestion de vos assurances voyages</p>
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

      {insurances.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Aucune assurance souscrite</p>
            <Button onClick={() => (window.location.href = '/client/reservations')}>
              Souscrire une assurance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insurances.map((insurance: any) => (
            <Card key={insurance?.subscriptionId as string}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Assurance #{(insurance?.subscriptionId as string)?.slice(-8)}</CardTitle>
                    <CardDescription>Souscrite le {formatDate(insurance?.subscribedAt as string | Date)}</CardDescription>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded ${
                    insurance?.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {insurance?.status === 'CONFIRMED' ? 'Confirmée' : 'En attente'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Montant</span>
                    <span className="font-semibold">
                      {formatPrice(insurance?.insuranceAmountTTC as number)}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleDownloadCertificate(insurance?.subscriptionId as string)}
                    disabled={downloadingId === (insurance?.subscriptionId as string)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingId === insurance.subscriptionId
                      ? 'Téléchargement...'
                      : 'Télécharger certificat'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
