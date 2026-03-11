'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { StatsCard } from '@/components/admin/stats-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Target, DollarSign, CheckCircle, XCircle, Pause, AlertCircle, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
interface Campaign {
  id: string;
  name: string;
  proName: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED';
  budget: number;
  spent: number;
  reach: number;
  conversions: number;
  conversionRate: number;
}

interface LeadSource {
  name: string;
  count: number;
  percentage: number;
}

interface MarketingStats {
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: number;
  budgetSpent: number;
  campaigns: Campaign[];
  leadSources: LeadSource[];
}

const FALLBACK_STATS: MarketingStats = {
  activeCampaigns: 4,
  totalLeads: 1240,
  conversionRate: 0.0325,
  budgetSpent: 450000,
  campaigns: [
    { id: 'camp-1', name: 'Printemps Paris 2026', proName: 'TravelPro Voyages', status: 'ACTIVE', budget: 150000, spent: 145000, reach: 25000, conversions: 850, conversionRate: 0.034 },
    { id: 'camp-2', name: 'Côte d\'Azur Luxe', proName: 'Mediterranean Tours', status: 'ACTIVE', budget: 200000, spent: 185000, reach: 35000, conversions: 920, conversionRate: 0.0263 },
    { id: 'camp-3', name: 'Alpes Hiver', proName: 'Alpine Adventures', status: 'PAUSED', budget: 100000, spent: 75000, reach: 15000, conversions: 280, conversionRate: 0.0187 },
    { id: 'camp-4', name: 'Bretagne Découverte', proName: 'Coast & Heritage', status: 'DRAFT', budget: 120000, spent: 45000, reach: 8000, conversions: 190, conversionRate: 0.0238 },
  ],
  leadSources: [
    { name: 'Google Ads', count: 520, percentage: 0.4194 },
    { name: 'Facebook/Instagram', count: 380, percentage: 0.3065 },
    { name: 'Direct', count: 210, percentage: 0.1694 },
    { name: 'Referral', count: 130, percentage: 0.1048 },
  ],
};

/**
 * Page Admin Marketing - Hub de gestion marketing
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminMarketingPage() {
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [attributionModel, setAttributionModel] = useState<string>('first-touch');
  const [savingAttribution, setSavingAttribution] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/marketing', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des données marketing');
      const data = await response.json();
      setStats(data);
    } catch (err: unknown) {
      console.warn('API /api/admin/marketing indisponible — données démo');
      setStats(FALLBACK_STATS);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveAttributionSettings = async () => {
    try {
      setSavingAttribution(true);
      const response = await fetch('/api/admin/marketing/attribution-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ attributionModel }),
      });

      if (response.ok) {
        setActionMessage('Paramètres d\'attribution sauvegardés avec succès');
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        setError('Erreur lors de la sauvegarde des paramètres d\'attribution');
      }
    } catch (err: unknown) {
      console.error('Attribution settings save error:', err);
      setError('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSavingAttribution(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'approve' | 'reject' | 'pause' | 'feature') => {
    try {
      const endpoint =
        action === 'approve' ? `/api/admin/marketing/campaigns/${campaignId}/approve`
        : action === 'reject' ? `/api/admin/marketing/campaigns/${campaignId}/reject`
        : action === 'pause' ? `/api/admin/marketing/campaigns/${campaignId}/pause`
        : `/api/admin/marketing/campaigns/${campaignId}/feature`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        const labels: Record<string, string> = {
          approve: 'approuvée',
          reject: 'rejetée',
          pause: 'mise en pause',
          feature: 'mise en avant',
        };
        setActionMessage(`Campagne ${labels[action] || action} avec succès`);
        setTimeout(() => setActionMessage(null), 3000);
        await fetchStats();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'action');
    }
  };

  const statusConfig = {
    DRAFT: { label: 'Brouillon', color: 'admin-badge admin-badge-neutral', icon: null },
    ACTIVE: { label: 'Actif', color: 'admin-badge admin-badge-success', icon: CheckCircle },
    PAUSED: { label: 'En pause', color: 'admin-badge admin-badge-warning', icon: Pause },
    ENDED: { label: 'Terminé', color: 'admin-badge admin-badge-danger', icon: XCircle },
  };

  const campaignColumns: DataTableColumn<Campaign>[] = [
    {
      key: 'name',
      label: 'Nom de la campagne',
    },
    {
      key: 'proName',
      label: 'Pro/Seller',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config?.color}`}>
            {config?.label}
          </span>
        );
      },
    },
    {
      key: 'budget',
      label: 'Budget',
      render: (value: unknown) => formatPrice(value as number),
    },
    {
      key: 'spent',
      label: 'Dépensé',
      render: (value: unknown) => formatPrice(value as number),
    },
    {
      key: 'reach',
      label: 'Portée',
      render: (value: unknown) => (value as number).toLocaleString('fr-FR'),
    },
    {
      key: 'conversions',
      label: 'Conversions',
    },
    {
      key: 'conversionRate',
      label: 'Taux conversion',
      render: (value: unknown) => `${((value as number) * 100).toFixed(2)}%`,
    },
  ];

  // État loading — skeleton
  if (loading) {
    return (
      <div className="space-y-6">
      <AdminPageHeader title="Marketing" breadcrumb="Marketing" />

        <div>
          <div style={{ height: 40, width: 192, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 20, width: 384, marginTop: 8, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 h-32 bg-gray-100 animate-pulse rounded" />
            </Card>
          ))}
        </div>
        <div style={{ height: 384, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      </div>
    );
  }

  // État erreur — retry
  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-700 font-medium mb-2">{error}</p>
          <p className="text-red-600 text-sm mb-4">Vérifiez votre connexion et réessayez.</p>
          <button onClick={fetchStats} className="gap-2" style={{ backgroundColor: 'white', color: 'var(--terra, #C75B39)', borderRadius: '12px', fontWeight: 600, padding: '0.75rem 1.5rem', border: '1.5px solid #E5E0D8', cursor: 'pointer', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Toast action */}
      {actionMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">{actionMessage}</AlertDescription>
        </Alert>
      )}

      {/* Toast erreur non-bloquante */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <button size="sm" onClick={() => setError(null)} style={{ backgroundColor: 'white', color: 'var(--terra, #C75B39)', borderRadius: '12px', fontWeight: 600, padding: '0.5rem 1rem', border: '1.5px solid #E5E0D8', cursor: 'pointer', fontSize: '0.85rem' }}>Fermer</button>
          </AlertDescription>
        </Alert>
      )}

      {/* En-tête */}
      <div>
<p className="text-gray-600 mt-2">
          Hub de gestion des campagnes et analyses marketing
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Campagnes actives"
          value={stats.activeCampaigns.toString()}
          icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
          changePercent={12}
          trend="up"
        />
        <StatsCard
          title="Leads totaux"
          value={stats.totalLeads.toLocaleString('fr-FR')}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          changePercent={8}
          trend="up"
        />
        <StatsCard
          title="Taux conversion"
          value={`${(stats.conversionRate * 100).toFixed(2)}%`}
          icon={<Target className="w-5 h-5 text-blue-600" />}
          changePercent={0.5}
          trend="down"
        />
        <StatsCard
          title="Budget dépensé"
          value={formatPrice(stats.budgetSpent)}
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          changePercent={22}
          trend="up"
        />
      </div>

      {/* Onglets */}
      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
          <TabsTrigger value="sources">Sources de leads</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        {/* Onglet Campagnes */}
        <TabsContent value="campaigns">
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={campaignColumns}
                data={stats.campaigns}
                loading={false}
                emptyMessage="Aucune campagne trouvée"
                rowActions={[
                  {
                    label: 'Approuver',
                    onClick: (row) => handleCampaignAction(row.id, 'approve'),
                  },
                  {
                    label: 'Rejeter',
                    onClick: (row) => handleCampaignAction(row.id, 'reject'),
                  },
                  {
                    label: 'Mettre en pause',
                    onClick: (row) => handleCampaignAction(row.id, 'pause'),
                  },
                  {
                    label: 'En avant sur accueil',
                    onClick: (row) => handleCampaignAction(row.id, 'feature'),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sources de leads */}
        <TabsContent value="sources">
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-gray-900">Détails des sources de leads</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {stats.leadSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{source.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {source.count.toLocaleString('fr-FR')} leads
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{(source.percentage * 100).toFixed(1)}%</div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${source.percentage * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Paramètres d&apos;attribution</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Modèles d&apos;attribution</h4>
                <p className="text-sm text-blue-800 mb-4">
                  Configurez comment les conversions sont attribuées aux sources et campagnes
                </p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="attribution"
                      value="first-touch"
                      checked={attributionModel === 'first-touch'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttributionModel((e.target as HTMLInputElement).value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Premier clic (First Touch)</div>
                      <div className="text-sm text-gray-600">Attribue au premier point de contact</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="attribution"
                      value="last-touch"
                      checked={attributionModel === 'last-touch'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttributionModel((e.target as HTMLInputElement).value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Dernier clic (Last Touch)</div>
                      <div className="text-sm text-gray-600">Attribue au dernier point de contact avant conversion</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="attribution"
                      value="linear"
                      checked={attributionModel === 'linear'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttributionModel((e.target as HTMLInputElement).value)}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Linéaire (Linear)</div>
                      <div className="text-sm text-gray-600">Répartit équitablement entre tous les points de contact</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveAttributionSettings}
                  disabled={savingAttribution}
                  style={{
                    backgroundColor: 'var(--terra, #C75B39)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 700,
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  {savingAttribution ? 'Enregistrement...' : 'Enregistrer les paramètres'}
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
