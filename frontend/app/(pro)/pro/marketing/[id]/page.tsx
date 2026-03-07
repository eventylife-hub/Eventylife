'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricsChart } from '@/components/marketing/metrics-chart';
import { AlertCircle, Loader2, Copy, Trash2 } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';

// Interface pour une campagne marketing
interface Campaign {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'LIVE' | 'ENDED';
  createdAt: string;
  startDate?: string;
  endDate?: string;
}

// Interface pour les métriques
interface CampaignMetrics {
  impressions: number;
  clicks: number;
  ctr: string;
  conversions: number;
  conversionRate: string;
  roi: string;
  budget: number;
  spent: number;
}

/**
 * Page de détail d'une campagne marketing
 * Affiche les métriques et les actions disponibles
 */
export default function CampagneDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [campRes, metricsRes] = await Promise.all([
          fetch(`/api/marketing/campaigns/${campaignId}`, { credentials: 'include' }),
          fetch(`/api/marketing/campaigns/${campaignId}/metrics`, { credentials: 'include' }),
        ]);

        if (!campRes.ok) throw new Error('Campagne non trouvée');

        const campData = await campRes.json();
        setCampaign(campData);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (err: unknown) {
        // Gestion d'erreur typée
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur inconnue est survenue');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId]);

  const handleLaunch = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/marketing/campaigns/${campaignId}/launch`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors du lancement');
      const data = await res.json();
      setCampaign(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/marketing/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors de la duplication');
      const newCampaign = await res.json();
      router.push(`/pro/marketing/${newCampaign.id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnd = async () => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/marketing/campaigns/${campaignId}/end`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors de la fermeture');
      const data = await res.json();
      setCampaign(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-32 mb-6" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-600">{error || 'Campagne non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/pro/marketing" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour au marketing
        </Link>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{campaign.title}</h1>
            <p className="text-gray-600 mt-1">
              Statut: <span className="font-semibold capitalize">{campaign.status}</span>
            </p>
          </div>

          <div className="flex gap-2">
            {campaign.status === 'DRAFT' && (
              <>
                <Button
                  onClick={handleLaunch}
                  disabled={actionLoading}
                  variant="default"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Lancer'
                  )}
                </Button>
                <Button
                  onClick={handleDuplicate}
                  disabled={actionLoading}
                  variant="outline"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            )}

            {campaign.status === 'LIVE' && (
              <Button
                onClick={handleEnd}
                disabled={actionLoading}
                variant="destructive"
              >
                Terminer
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {campaign.description || 'Aucune description'}
              </p>
            </CardContent>
          </Card>

          {/* Métriques */}
          {metrics && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricsChart metrics={metrics} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Impressions</p>
                      <p className="text-2xl font-bold">{metrics.impressions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clics</p>
                      <p className="text-2xl font-bold">{metrics.clicks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">CTR</p>
                      <p className="text-2xl font-bold">{metrics.ctr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversions</p>
                      <p className="text-2xl font-bold">{metrics.conversions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(metrics.budget)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dépensé</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(metrics.spent)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Infos */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Date de création</p>
                <p>{formatDate(campaign.createdAt)}</p>
              </div>
              {campaign.startDate && (
                <div>
                  <p className="text-sm text-gray-600">Début prévue</p>
                  <p>{formatDate(campaign.startDate)}</p>
                </div>
              )}
              {campaign.endDate && (
                <div>
                  <p className="text-sm text-gray-600">Fin prévue</p>
                  <p>{formatDate(campaign.endDate)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
