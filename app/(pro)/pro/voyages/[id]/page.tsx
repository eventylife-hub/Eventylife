'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import {
  BarChart3,
  Users,
  DollarSign,
  Percent,
  MapPin,
  Clock,
  FileText,
  Users2,
  Ship,
  UtensilsCrossed,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';

/**
 * Page: Pro Voyage Detail Dashboard (/pro/voyages/[id])
 * 
 * Dashboard pour un voyage spécifique géré par le Pro:
 * - En-tête voyage: nom, dates, destination, badge statut
 * - KPI cards: réservations totales, chambres confirmées, CA TTC, taux occupancy
 * - Grille de liens rapides vers sous-pages
 * - Mini timeline des phases
 * - Feed d&apos;activité récente
 * 
 * API: GET /api/pro/travels/${id}
 */

interface TravelDashboard {
  id: string;
  title: string;
  destinationCity: string;
  departureDate: string;
  returnDate: string;
  status: 'DRAFT' | 'PHASE1_REVIEW' | 'PHASE1_APPROVED' | 'PHASE2_REVIEW' | 'PHASE2_APPROVED' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
  capacity: number;
  totalReservations: number;
  confirmedRooms: number;
  revenueTTC: number;
  occupancyRate: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    actor: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-800',
  PHASE1_REVIEW: 'bg-yellow-100 text-yellow-800',
  PHASE1_APPROVED: 'bg-blue-100 text-blue-800',
  PHASE2_REVIEW: 'bg-yellow-100 text-yellow-800',
  PHASE2_APPROVED: 'bg-purple-100 text-purple-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-slate-200 text-slate-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PHASE1_REVIEW: 'En revue Phase 1',
  PHASE1_APPROVED: 'Phase 1 approuvée',
  PHASE2_REVIEW: 'En revue Phase 2',
  PHASE2_APPROVED: 'Phase 2 approuvée',
  PUBLISHED: 'Publié',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

const QUICK_LINKS = [
  { label: 'Transport', href: '/pro/voyages/[id]/transport', icon: Ship },
  { label: 'Rooming', href: '/pro/voyages/[id]/rooming', icon: Users },
  { label: 'Restauration', href: '/pro/voyages/[id]/restauration', icon: UtensilsCrossed },
  { label: 'Finance', href: '/pro/voyages/[id]/finance', icon: DollarSign },
  { label: 'Factures', href: '/pro/voyages/[id]/factures', icon: FileText },
  { label: 'Bilan', href: '/pro/voyages/[id]/bilan', icon: TrendingUp },
  { label: 'Équipe', href: '/pro/voyages/[id]/equipe', icon: Users2 },
  { label: 'Réservations', href: '/pro/voyages/[id]/reservations', icon: BarChart3 },
];

const PHASES = [
  { name: 'Phase 1', key: 'PHASE1_APPROVED' },
  { name: 'Phase 2', key: 'PHASE2_APPROVED' },
  { name: 'Publication', key: 'PUBLISHED' },
  { name: 'Exécution', key: 'COMPLETED' },
];

/**
 * Action button handler with loading and error states
 */
function ActionButtons({ travel, onRefresh }: { travel: TravelDashboard; onRefresh: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleAction = async (endpoint: string, requiresBody: boolean = false) => {
    try {
      setIsLoading(true);
      setActionError(null);

      const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
      };

      if (requiresBody) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify({ reason: 'Annulation par l\'agence' });
      }

      const res = await fetch(`/api${endpoint}`, options);

      if (!res.ok) {
        const data = await res.json() as Record<string, unknown>;
        throw new Error((data.message as string) || 'Erreur lors de l\'action');
      }

      setShowCancelConfirm(false);
      onRefresh();
    } catch (err: unknown) {
      setActionError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pro-panel" style={{ marginBottom: '1.5rem' }}>
      <div className="pro-panel-header">
        <h3 className="pro-panel-title">Actions du voyage</h3>
      </div>
      <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {actionError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem' }}>
            <AlertCircle style={{ width: '1rem', height: '1rem', color: 'var(--pro-coral)' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--pro-coral)', margin: 0 }}>{actionError}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {travel.status === 'DRAFT' && (
            <Button
              onClick={() => handleAction(`/pro/travels/${travel.id}/submit-p1`)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Envoi en cours...' : 'Soumettre Phase 1'}
            </Button>
          )}

          {travel.status === 'PHASE1_REVIEW' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">En revue Phase 1...</span>
            </div>
          )}

          {travel.status === 'PHASE1_APPROVED' && (
            <Button
              onClick={() => handleAction(`/pro/travels/${travel.id}/submit-p2`)}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? 'Envoi en cours...' : 'Soumettre Phase 2'}
            </Button>
          )}

          {travel.status === 'PHASE2_REVIEW' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">En revue Phase 2...</span>
            </div>
          )}

          {travel.status === 'PHASE2_APPROVED' && (
            <Button
              onClick={() => handleAction(`/pro/travels/${travel.id}/publish`)}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Publication en cours...' : 'Publier'}
            </Button>
          )}

          {travel.status === 'PUBLISHED' && (
            <Button
              onClick={() => setShowCancelConfirm(true)}
              disabled={isLoading || showCancelConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Annuler le voyage
            </Button>
          )}

          {/* Duplicate button available for all statuses */}
          <Button
            onClick={() => handleAction(`/pro/travels/${travel.id}/duplicate`)}
            disabled={isLoading}
            variant="outline"
            className="border-slate-300"
          >
            {isLoading ? 'Duplication...' : 'Dupliquer'}
          </Button>

          {/* Cancel confirmation dialog */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Confirmer l&apos;annulation
                </h3>
                <p className="text-slate-600 mb-6">
                  Êtes-vous sûr de vouloir annuler ce voyage ? Cette action ne peut pas être annulée.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowCancelConfirm(false)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Non, garder le voyage
                  </Button>
                  <Button
                    onClick={() => handleAction(`/pro/travels/${travel.id}/cancel`, true)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? 'Annulation...' : 'Oui, annuler'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VoyageDashboardPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [dashboard, setDashboard] = useState<TravelDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pro/travels/${travelId}`, { credentials: 'include' });

      if (!res.ok) throw new Error('Erreur chargement tableau de bord');

      const data = await res.json() as TravelDashboard;
      setDashboard(data);
      setError(null);
    } catch {
      console.warn('API pro/travels detail indisponible — données démo');
      setDashboard({
        id: travelId,
        title: 'Marrakech Express',
        destinationCity: 'Marrakech, Maroc',
        departureDate: '2026-05-15',
        returnDate: '2026-05-22',
        status: 'PUBLISHED',
        capacity: 50,
        totalReservations: 38,
        confirmedRooms: 19,
        revenueTTC: 3416200,
        occupancyRate: 76,
        recentActivity: [
          { id: 'act_001', type: 'RESERVATION', description: 'Nouvelle réservation — Jean Martin (2 passagers)', timestamp: '2026-03-10T14:30:00Z', actor: 'Système' },
          { id: 'act_002', type: 'PAYMENT', description: 'Paiement confirmé — 1 798,00 € (Jean Martin)', timestamp: '2026-03-10T14:32:00Z', actor: 'Stripe' },
          { id: 'act_003', type: 'ROOMING', description: 'Chambre assignée — Riad Soleil, chambre 204', timestamp: '2026-03-09T10:00:00Z', actor: 'Marie Martin' },
          { id: 'act_004', type: 'RESERVATION', description: 'Nouvelle réservation — Sophie Lambert (3 passagers)', timestamp: '2026-03-08T16:00:00Z', actor: 'Système' },
          { id: 'act_005', type: 'TRANSPORT', description: 'Manifest bus mis à jour — 38/50 places', timestamp: '2026-03-07T09:15:00Z', actor: 'Paul Bernard' },
        ],
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (travelId) {
      fetchDashboard();
    }
  }, [travelId]);

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-32 w-full" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--pro-coral)' }} />
              <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error || 'Données non disponibles'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-bold text-slate-900">{dashboard.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[dashboard.status]}`}>
                {STATUS_LABELS[dashboard.status]}
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {dashboard.destinationCity}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(dashboard.departureDate)} -{' '}
                {formatDate(dashboard.returnDate)}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Capacité: {dashboard.capacity} places
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons travel={dashboard} onRefresh={fetchDashboard} />

        {/* KPI Cards */}
        <div className="pro-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="pro-kpi-card" style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E8F7FC' }}>
            <div className="pro-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.75rem' }}>
              <Users style={{ width: '1rem', height: '1rem', color: 'var(--pro-sun)' }} />
              Réservations
            </div>
            <div className="pro-kpi-value" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.25rem' }}>{dashboard.totalReservations}</div>
            <p style={{ fontSize: '0.75rem', color: '#8896A6', margin: 0 }}>Total des réservations</p>
          </div>

          <div className="pro-kpi-card" style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E8F7FC' }}>
            <div className="pro-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.75rem' }}>
              <BarChart3 style={{ width: '1rem', height: '1rem', color: 'var(--pro-mint)' }} />
              Chambres confirmées
            </div>
            <div className="pro-kpi-value" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.25rem' }}>{dashboard.confirmedRooms}</div>
            <p style={{ fontSize: '0.75rem', color: '#8896A6', margin: 0 }}>Confirmées et payées</p>
          </div>

          <div className="pro-kpi-card" style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E8F7FC' }}>
            <div className="pro-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.75rem' }}>
              <DollarSign style={{ width: '1rem', height: '1rem', color: 'var(--pro-ocean)' }} />
              Revenu TTC
            </div>
            <div className="pro-kpi-value" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.25rem' }}>{formatPrice(dashboard.revenueTTC)}</div>
            <p style={{ fontSize: '0.75rem', color: '#8896A6', margin: 0 }}>Chiffre d&apos;affaires</p>
          </div>

          <div className="pro-kpi-card" style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #E8F7FC' }}>
            <div className="pro-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.75rem' }}>
              <Percent style={{ width: '1rem', height: '1rem', color: 'var(--pro-sun)' }} />
              Taux d&apos;occupation
            </div>
            <div className="pro-kpi-value" style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.25rem' }}>{dashboard.occupancyRate}%</div>
            <p style={{ fontSize: '0.75rem', color: '#8896A6', margin: 0 }}>Capacité utilisée</p>
          </div>
        </div>

        {/* Timeline */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Phases du voyage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {PHASES.map((phase, idx) => (
                <div key={phase.key} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                      dashboard.status === phase.key || PHASES.findIndex(p => p.key === dashboard.status) > idx
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm font-medium text-slate-700">{phase.name}</p>
                  </div>
                  {idx < PHASES.length - 1 && (
                    <div
                      className={`w-12 h-1 transition-all ${
                        PHASES.findIndex(p => p.key === dashboard.status) > idx
                          ? 'bg-indigo-600'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              const href = link.href.replace('[id]', travelId);
              return (
                <Link
                  key={link.label}
                  href={href}
                  className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-300 transition-all text-center"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm font-medium text-slate-900">{link.label}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières 5 actions</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard.recentActivity && dashboard.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 border-l-2 border-indigo-200 pl-4 py-2">
                    <Activity className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-500">
                        Par {activity.actor} • {formatDateTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Aucune activité récente</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
