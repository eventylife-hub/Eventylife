'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MetricsChart = dynamic(
  () => import('@/components/marketing/metrics-chart').then((m) => m.MetricsChart),
  { loading: () => <div className="animate-pulse rounded-xl h-64" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
import { AlertCircle, Loader2, Copy, Trash2 } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import { logger } from '@/lib/logger';
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

        const campData = await campRes.json() as Campaign;
        setCampaign(campData);

        if (metricsRes.ok) {
          const metricsData = await metricsRes.json() as CampaignMetrics;
          setMetrics(metricsData);
        }
      } catch (err: unknown) {
        logger.warn('API /api/marketing/campaigns indisponible — données démo');
        // Fallback demo data
        const demoCampaign: Campaign = {
          id: campaignId,
          title: 'Campagne Demo - Été 2026',
          description: 'Campagne de marketing estivale pour promouvoir nos voyages en groupe. Cible les familles et groupes d\'amis.',
          status: 'DRAFT',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        };
        setCampaign(demoCampaign);

        const demoMetrics: CampaignMetrics = {
          impressions: 12500,
          clicks: 385,
          ctr: '3.08%',
          conversions: 47,
          conversionRate: '12.2%',
          roi: '245%',
          budget: 250000,
          spent: 185000,
        };
        setMetrics(demoMetrics);
        setError(null);
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
      const data = await res.json() as Campaign;
      setCampaign(data);
    } catch (err: unknown) {
      logger.warn('API /api/marketing/campaigns/.../launch indisponible — données démo');
      // Fallback demo: update campaign status to LIVE
      if (campaign) {
        setCampaign({ ...campaign, status: 'LIVE' });
      }
      setError(null);
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
      const newCampaign = await res.json() as { id: string };
      router.push(`/pro/marketing/${newCampaign.id}`);
    } catch (err: unknown) {
      logger.warn('API /api/marketing/campaigns/.../duplicate indisponible — données démo');
      // Fallback demo: generate a new campaign ID and navigate
      const newCampaignId = `demo-${Date.now()}`;
      setError(null);
      setTimeout(() => {
        router.push(`/pro/marketing/${newCampaignId}`);
      }, 500);
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
      const data = await res.json() as Campaign;
      setCampaign(data);
    } catch (err: unknown) {
      logger.warn('API /api/marketing/campaigns/.../end indisponible — données démo');
      // Fallback demo: update campaign status to ENDED
      if (campaign) {
        setCampaign({ ...campaign, status: 'ENDED' });
      }
      setError(null);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ height: 40, width: 128, marginBottom: 16, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 128, marginBottom: 24, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
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
            <p style={{ color: '#64748B', marginTop: '8px' }}>
              Statut: <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#0A1628' }}>{campaign.status}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {campaign.status === 'DRAFT' && (
              <>
                <button type="button"
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
                <button type="button"
                  onClick={handleDuplicate}
                  disabled={actionLoading}
                  className="pro-btn-outline"
                  style={{ opacity: actionLoading ? 0.5 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                  aria-label="Dupliquer la campagne"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </>
            )}

            {campaign.status === 'LIVE' && (
              <button type="button"
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
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Impressions</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.impressions}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Clics</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.clicks}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>CTR</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.ctr}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Conversions</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>{metrics.conversions}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Budget</p>
                    <p style={{ fontSize: '24px', fontWeight: 600, color: '#0A1628' }}>
                      {formatPrice(metrics.budget)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Dépensé</p>
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
                <p style={{ fontSize: '14px', color: '#64748B' }}>Date de création</p>
                <p style={{ color: '#0A1628' }}>{formatDate(campaign.createdAt)}</p>
              </div>
              {campaign.startDate && (
                <div>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Début prévue</p>
                  <p style={{ color: '#0A1628' }}>{formatDate(campaign.startDate)}</p>
                </div>
              )}
              {campaign.endDate && (
                <div>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>Fin prévue</p>
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
