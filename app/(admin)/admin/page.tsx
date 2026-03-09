'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/stats-card';
import { Skeleton, SkeletonList } from '@/components/ui/skeleton';
import { Users, TrendingUp, AlertCircle, Wallet, RefreshCw, Activity, CheckCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  totalTravels: number;
  monthlyRevenueCents: number;
  monthlyRevenueGrowth?: number;
  pendingTravels?: number;
  pendingPros?: number;
  activePros?: number;
  recentActivity?: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
  }>;
  monthlyChart?: Array<{
    month: string;
    revenue: number;
  }>;
}

/**
 * Dashboard administrateur avec statistiques complètes
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      setError('Impossible de charger les statistiques. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p className="text-gray-600 mt-2">
          Bienvenue sur le tableau de bord Eventy Life
        </p>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Les données statistiques n&apos;ont pas pu être chargées.</p>
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

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton height="1rem" width="100%" />
                <Skeleton height="2rem" width="80%" />
                <Skeleton height="0.75rem" width="60%" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={<Users />}
              title="Utilisateurs actifs"
              value={stats?.totalUsers || 0}
              changePercent={(stats?.userGrowth) ?? 0}
              trend={((stats?.userGrowth) ?? 0) >= 0 ? 'up' : 'down'}
              href="/admin/utilisateurs"
            />

            <StatsCard
              icon={<TrendingUp />}
              title="Voyages actifs"
              value={stats?.totalTravels || 0}
              href="/admin/voyages"
            />

            <StatsCard
              icon={<Wallet />}
              title="Chiffre d&apos;affaires mensuel"
              value={formatPrice(stats?.monthlyRevenueCents || 0)}
              changePercent={stats?.monthlyRevenueGrowth || 0}
              trend={(stats?.monthlyRevenueGrowth || 0) >= 0 ? 'up' : 'down'}
              href="/admin/finance"
            />

            <StatsCard
              icon={<AlertCircle />}
              title="Actions en attente"
              value={
                (stats?.pendingTravels || 0) + (stats?.pendingPros || 0)
              }
              href="/admin/voyages?status=pending"
            />
          </div>

          {/* Sections principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Voyages en attente */}
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton height="1.5rem" width="40%" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonList count={3} height="40px" />
                </CardContent>
              </Card>
            ) : (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Voyages en attente</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {(stats?.pendingTravels ?? 0) > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-orange-600">
                      {stats?.pendingTravels ?? 0}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Voyages à approuver ou vérifier
                    </p>
                    <Link href="/admin/voyages?status=pending">
                      <Button className="w-full mt-4">
                        Voir les voyages en attente
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                    <p className="text-gray-600 text-center">
                      Aucun voyage en attente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {/* Profils Pro en attente */}
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton height="1.5rem" width="40%" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonList count={3} height="40px" />
                </CardContent>
              </Card>
            ) : (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Profils Pro en attente</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {(stats?.pendingPros ?? 0) > 0 ? (
                  <>
                    <div className="text-3xl font-bold text-green-600">
                      {stats?.pendingPros ?? 0}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Profils à vérifier et approuver
                    </p>
                    <Link href="/admin/pros?status=pending">
                      <Button className="w-full mt-4">
                        Voir les profils en attente
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                    <p className="text-gray-600 text-center">
                      Aucun profil en attente
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {/* Profils Pro actifs */}
            {loading ? (
              <Card>
                <CardHeader>
                  <Skeleton height="1.5rem" width="40%" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonList count={3} height="40px" />
                </CardContent>
              </Card>
            ) : (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Profils Pro actifs</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-blue-600">
                  {stats?.activePros || 0}
                </div>
                <p className="text-gray-600 text-sm">
                  Professionnels actifs sur la plateforme
                </p>
                <Link href="/admin/pros">
                  <Button variant="outline" className="w-full mt-4">
                    Gérer les profils Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
            )}
          </div>

          {/* Activity Log and Quick Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activité récente
                </h3>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonList count={6} height="60px" />
                ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.slice(0, 6).map((activity: any) => (
                      <div key={activity.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString('fr-FR')} à {new Date(activity.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                          activity.action === 'CREATED' ? 'bg-blue-100 text-blue-700' :
                          activity.action === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          activity.action === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.action}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucune activité pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Actions rapides</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/utilisateurs">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Utilisateurs
                    </Button>
                  </Link>
                  <Link href="/admin/voyages">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Voyages
                    </Button>
                  </Link>
                  <Link href="/admin/finance">
                    <Button variant="outline" className="w-full justify-start">
                      <Wallet className="w-4 h-4 mr-2" />
                      Finances
                    </Button>
                  </Link>
                  <Link href="/admin/parametres">
                    <Button variant="outline" className="w-full justify-start">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Paramètres
                    </Button>
                  </Link>
                  <Link href="/admin/audit">
                    <Button variant="outline" className="w-full justify-start">
                      <Activity className="w-4 h-4 mr-2" />
                      Audit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
