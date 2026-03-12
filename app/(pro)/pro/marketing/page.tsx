'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// shadcn components removed - using pro-panel and pro-btn-* classes
import { CampaignCard } from '@/components/marketing/campaign-card';
import { AlertCircle, Plus, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { logger } from '@/lib/logger';
// Interface pour le dashboard marketing
interface MarketingDashboard {
  stats?: {
    activeCampaigns?: number;
    totalBudget?: number;
    totalBudgetSpent?: number;
  };
  campaigns?: Array<{
    id: string;
    title: string;
    description?: string;
    status: string;
    budget: number;
    createdAt: string;
    startDate?: string;
    endDate?: string;
  }>;
}

/**
 * Dashboard marketing pour les Pros
 * Affiche les stats globales et la liste des campagnes
 */
export default function MarketingPage() {
  const [dashboard, setDashboard] = useState<MarketingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/marketing/dashboard', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement');
        const data = await res.json() as MarketingDashboard;
        setDashboard(data);
      } catch {
        logger.warn('API marketing/dashboard indisponible — données démo');
        setDashboard({
          stats: {
            activeCampaigns: 2,
            totalBudget: 500000,
            totalBudgetSpent: 223000,
          },
          campaigns: [
            { id: 'camp_001', title: 'Lancement Été 2026', description: 'Campagne de lancement pour la saison estivale avec focus réseaux sociaux et Google Ads', status: 'ACTIVE', budget: 250000, createdAt: '2026-01-15T10:00:00Z', startDate: '2026-03-01', endDate: '2026-06-30' },
            { id: 'camp_002', title: 'Promo Early Bird', description: 'Offre -15% pour les réservations anticipées avant le 31 mars', status: 'ACTIVE', budget: 100000, createdAt: '2026-02-01T09:00:00Z', startDate: '2026-02-15', endDate: '2026-03-31' },
            { id: 'camp_003', title: 'Parrainage Automne', description: 'Programme de parrainage avec bonus 50€ pour le parrain et le filleul', status: 'PLANNED', budget: 150000, createdAt: '2026-03-01T14:00:00Z', startDate: '2026-09-01', endDate: '2026-11-30' },
          ],
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Loading state
  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 className="pro-page-title" style={{ marginBottom: '24px' }}>Marketing</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 96, borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 192, borderRadius: 8, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 className="pro-page-title" style={{ marginBottom: '24px' }}>Marketing</h1>
          <div style={{ borderRadius: '8px', border: '1px solid #FFE0E3', backgroundColor: '#FFE0E3', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <AlertCircle className="h-6 w-6" style={{ color: 'var(--pro-coral)', flexShrink: 0 }} />
              <div>
                <h2 style={{ fontWeight: 600, color: 'var(--pro-coral)' }}>Erreur</h2>
                <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { stats = {}, campaigns = [] } = dashboard || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h1 className="pro-page-title">Marketing</h1>
          <Link href="/pro/marketing/creer">
            <button type="button" className="pro-btn-sun" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus className="h-4 w-4" />
              Nouvelle campagne
            </button>
          </Link>
        </div>

        {/* Stats globales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Campagnes actives</div>
            <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: '#0A1628' }}>{stats.activeCampaigns || 0}</div>
          </div>

          <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Budget total</div>
            <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: '#0A1628' }}>
              {formatPrice(stats.totalBudget || 0)}
            </div>
          </div>

          <div className="pro-panel" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#64748B' }}>Budget dépensé</div>
            <div style={{ fontSize: '28px', fontWeight: 600, marginTop: '12px', color: '#0A1628' }}>
              {formatPrice(stats.totalBudgetSpent || 0)}
            </div>
          </div>
        </div>

        {/* Liste des campagnes */}
        {campaigns.length === 0 ? (
          <div className="pro-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📣</div>
            <h3 style={{ fontWeight: 600, fontSize: '1.125rem', color: '#0A1628', marginBottom: '8px' }}>Aucune campagne</h3>
            <p style={{ color: '#64748B', marginBottom: '16px' }}>
              Créez votre première campagne marketing pour promouvoir vos voyages
            </p>
            <Link href="/pro/marketing/creer">
              <button type="button" className="pro-btn-sun" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Plus className="h-4 w-4" />
                Créer une campagne
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}

        {campaigns.length > 0 && (
          <div style={{ marginTop: '32px', fontSize: '14px', color: '#64748B', textAlign: 'center' }}>
            {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
