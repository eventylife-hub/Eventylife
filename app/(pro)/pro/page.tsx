'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { BarChart, Users, TrendingUp, AlertCircle, RefreshCw, Calendar, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

interface ProDashboardStats {
  activeVoyages: number;
  totalBookings: number;
  monthlyRevenue: number;
  occupancyRate: number;
  averageRating: number;
  totalRevenue: number;
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function ProDashboard() {
  const { proProfile, onboardingStatus, formationProgress, fetchProProfile, fetchOnboardingStatus, fetchFormationProgress } = useProStore();
  const [stats, setStats] = useState<ProDashboardStats>({
    activeVoyages: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    averageRating: 0,
    totalRevenue: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProProfile();
    fetchOnboardingStatus();
    fetchFormationProgress();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/pro/dashboard/stats', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      const data = await res.json();
      setStats({
        activeVoyages: data.activeVoyages ?? 0,
        totalBookings: data.totalBookings ?? 0,
        monthlyRevenue: data.monthlyRevenue ?? 0,
        occupancyRate: data.occupancyRate ?? 0,
        averageRating: data.averageRating ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        recentActivity: data.recentActivity ?? [],
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const isOnboardingComplete = onboardingStatus?.currentStatus === 'APPROVED';
  const completedSteps =
    [
      onboardingStatus?.step1_profile,
      onboardingStatus?.step2_legal,
      onboardingStatus?.step3_payout,
      onboardingStatus?.step4_documents,
      onboardingStatus?.step5_contracts,
      onboardingStatus?.step6_formation,
    ].filter(Boolean).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Welcome */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Bienvenue, {proProfile?.displayName || 'Pro'}!
            </h1>
            <p className="text-slate-600 mt-2">
              Tableau de bord de votre espace professionnel
            </p>
          </div>
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            className="gap-2 w-fit"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStats}
              className="gap-2 ml-4 flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </Button>
          </div>
        )}

        {/* Onboarding Alert Banner */}
        {!isOnboardingComplete && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900">Complétez votre inscription</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Vous avez complété {completedSteps}/6 étapes de l'onboarding.
                  </p>
                  <Link
                    href="/pro/onboarding"
                    className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    Continuer l'inscription →
                  </Link>
                </div>
              </div>
              <div className="text-right text-sm font-medium text-blue-600">
                {Math.round((completedSteps / 6) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards Grid - with Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 h-32 bg-slate-100 animate-pulse rounded" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Voyages Actifs */}
            <Link href="/pro/voyages">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Voyages actifs</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeVoyages}</p>
                    <p className="text-xs text-slate-500 mt-2">Cliquer pour voir plus</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <BarChart className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Réservations Totales */}
            <Link href="/pro/reservations">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Réservations</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalBookings}</p>
                    <p className="text-xs text-slate-500 mt-2">En cours</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Link>

            {/* CA Ce Mois */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">CA ce mois</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {formatPrice(stats.monthlyRevenue)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">Total: {formatPrice(stats.totalRevenue)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Taux d'Occupation */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Taux d'occupation</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.occupancyRate.toFixed(1)}%</p>
                  <p className="text-xs text-slate-500 mt-2">Note: {stats.averageRating.toFixed(1)}/5</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/pro/voyages/nouveau"
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-lg">Créer un voyage</p>
              <p className="text-sm text-indigo-100 mt-1">Lancez votre première offre</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/pro/arrets"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center justify-between group"
          >
            <div>
              <p className="font-semibold text-lg">Gérer mes arrêts</p>
              <p className="text-sm text-emerald-100 mt-1">Configurer les points de départ/arrivée</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Two Column Layout for Activity and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900">Activité récente</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        activity.type === 'booking' ? 'bg-green-100 text-green-700' :
                        activity.type === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">Aucune activité pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Departures */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Prochains départs
              </h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : proProfile?.recentTravels && proProfile.recentTravels.length > 0 ? (
                <div className="space-y-3">
                  {proProfile.recentTravels.slice(0, 3).map((travel: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/pro/voyages/${travel.id}`}
                      className="flex items-start justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                          {travel.name || travel.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(travel.departureDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 whitespace-nowrap ml-2">
                        {travel.bookingCount || 0}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/pro/voyages"
                    className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Voir tous les voyages →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Aucun voyage pour le moment</p>
                  <Link
                    href="/pro/voyages/nouveau"
                    className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Créer votre première offre →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
