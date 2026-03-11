'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MetricsChart = dynamic(
  () => import('@/components/marketing/metrics-chart').then((m) => m.MetricsChart),
  { loading: () => <div className="animate-pulse rounded-xl h-64" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
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

        const campData = (await campRes.json() as unknown) as unknown;
        setCampaign(campData);

        if (metricsRes.ok) {
          const metricsData = (await metricsRes.json() as unknown) as unknown;
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
      const data = (await res.json() as unknown) as unknown;
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
      const newCampaign = (await res.json() as unknown) as unknown;
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
      const data = (await res.json() as unknown) as unknown;
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
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-32 mb-6" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ color: 'var(--pro-coral)' }}>{error || 'Campagne non trouvée'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Link href="/pro/marketing" style={{ fontSize: '14px', color: 'var(--pro-ocean)', textDecoration: 'none', marginBottom: '24px', display: 'inline-block' }}>
          ← Retour au marketing
        </Link>

        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', border: '1px solid #FFE0E3', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle className="h-5 w-5" style={{ color: 'var(--pro-coral)', flexShrink: 0, marginTop: '4px' }} />
            <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#0A1628' }}>{campaign.title}</h1>
            <p style={{ color: '#8896A6', marginTop: '8px' }}>
              Statut: <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#0A1628' }}>{campaign.status}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {campaign.status === 'DRAFT' && (
              <>
                <button
                  onClick={handleLaunch}
                  disabled={actionLoading}
                  className="pro-btn-sun"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: actionLoading ? 0.5 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Lancer'
                  )}
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={actionLoading}
                  className="pro-btn-outline"
                  style={{ opacity: actionLoading ? 0.5 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </>
            )}

            {campaign.status === 'LIVE' && (
              <button
                onClick={handleEnd}
                disabled={actionLoading}
                style={{
                  backgroundColor: 'var(--pro-coral)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.5 : 1,
                  fontWeight: 500,
                  fontSize: '14px'
                }}
              >
                Terminer
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Description */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>Description</h2>
            <p style={{ color: '#0A1628' }}>
              {campaign.description || 'Aucune description'}
            </p>
          </div>

          {/* Métriques */}
          {metrics && (
            <>
              <div className="pro-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>Performance</h2>
                <MetricsChart metrics={metrics} />
              </div>

              <div className="pro-panel" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>Statistiques</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Impressions</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.impressions}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Clics</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.clicks}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>CTR</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.ctr}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Conversions</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.conversions}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Budget</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>
                      {formatPrice(metrics.budget)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8896A6' }}>Dépensé</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>
                      {formatPrice(metrics.spent)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Infos */}
          <div className="pro-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0A1628', marginBottom: '16px' }}>Informations</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#8896A6' }}>Date de création</p>
                <p style={{ color: '#0A1628' }}>{formatDate(campaign.createdAt)}</p>
              </div>
              {campaign.startDate && (
                <div>
                  <p style={{ fontSize: '14px', color: '#8896A6' }}>Début prévue</p>
                  <p style={{ color: '#0A1628' }}>{formatDate(campaign.startDate)}</p>
                </div>
              )}
              {campaign.endDate && (
                <div>
                  <p style={{ fontSize: '14px', color: '#8896A6' }}>Fin prévue</p>
                  <p style={{ color: '#0A1628' }}>{formatDate(campaign.endDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
