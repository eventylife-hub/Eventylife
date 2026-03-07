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
 * - Feed d'activité récente
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
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de l\'action');
      }

      setShowCancelConfirm(false);
      onRefresh();
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white border-slate-200 mb-6">
      <CardHeader>
        <CardTitle>Actions du voyage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">{actionError}</p>
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
                  Confirmer l'annulation
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
      </CardContent>
    </Card>
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

      const data = await res.json();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error || 'Données non disponibles'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{dashboard.totalReservations}</div>
              <p className="text-xs text-slate-500 mt-1">Total des réservations</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                Chambres confirmées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{dashboard.confirmedRooms}</div>
              <p className="text-xs text-slate-500 mt-1">Confirmées et payées</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Revenu TTC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{formatPrice(dashboard.revenueTTC)}</div>
              <p className="text-xs text-slate-500 mt-1">Chiffre d'affaires</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Percent className="w-4 h-4 text-purple-600" />
                Taux d'occupation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{dashboard.occupancyRate}%</div>
              <p className="text-xs text-slate-500 mt-1">Capacité utilisée</p>
            </CardContent>
          </Card>
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
