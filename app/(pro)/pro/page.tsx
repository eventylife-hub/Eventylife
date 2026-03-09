'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { BarChart, Users, TrendingUp, AlertCircle, RefreshCw, Calendar, DollarSign, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const SUN = '#FF6B35';
const OCEAN = '#0077B6';
const DARK = '#0A1628';
const SAND = '#FEFCF3';
const CORAL = '#E63946';
const MINT = '#06D6A0';

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
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px' }}>
      <div style={{ maxWidth: '1280px', marginX: 'auto' }}>
        {/* Header with Welcome */}
        <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h1 className="pro-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
              Bienvenue, {proProfile?.displayName || 'Pro'}!
            </h1>
            <p style={{ color: DARK, marginTop: '8px', opacity: 0.7 }}>
              Tableau de bord de votre espace professionnel
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="pro-btn-ocean"
            style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Actualiser
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', border: `1px solid ${CORAL}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 500, color: CORAL }}>{error}</p>
              <p style={{ fontSize: '14px', color: CORAL, marginTop: '4px', opacity: 0.8 }}>Vérifiez votre connexion et réessayez.</p>
            </div>
            <button
              onClick={fetchStats}
              className="pro-btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px', flexShrink: 0 }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Réessayer
            </button>
          </div>
        )}

        {/* Onboarding Alert Banner */}
        {!isOnboardingComplete && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#dbeafe', borderLeft: `4px solid ${OCEAN}`, borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertCircle style={{ width: '20px', height: '20px', color: OCEAN, marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontWeight: 600, color: DARK }}>Complétez votre inscription</h3>
                  <p style={{ fontSize: '14px', color: DARK, marginTop: '4px', opacity: 0.8 }}>
                    Vous avez complété {completedSteps}/6 étapes de l&apos;onboarding.
                  </p>
                  <Link
                    href="/pro/onboarding"
                    style={{ marginTop: '8px', display: 'inline-block', fontSize: '14px', fontWeight: 500, color: OCEAN, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Continuer l&apos;inscription →
                  </Link>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 500, color: OCEAN }}>
                {Math.round((completedSteps / 6) * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards Grid - with Loading State */}
        {loading ? (
          <div className="pro-kpi-grid" style={{ marginBottom: '32px' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="pro-kpi-card"
                style={{ height: '128px', backgroundColor: '#f3f4f6', animation: 'pulse 2s infinite' }}
              />
            ))}
          </div>
        ) : (
          <div className="pro-kpi-grid" style={{ marginBottom: '32px' }}>
            {/* Voyages Actifs */}
            <Link href="/pro/voyages">
              <div className="pro-kpi-card" style={{ borderLeft: `4px solid ${SUN}`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p className="pro-kpi-label">Voyages actifs</p>
                    <p className="pro-kpi-value">{stats.activeVoyages}</p>
                    <p className="pro-kpi-sub">Cliquer pour voir plus</p>
                  </div>
                  <div style={{ backgroundColor: SUN + '1A', padding: '12px', borderRadius: '8px' }}>
                    <BarChart style={{ width: '24px', height: '24px', color: SUN }} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Réservations Totales */}
            <Link href="/pro/reservations">
              <div className="pro-kpi-card" style={{ borderLeft: `4px solid ${MINT}`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p className="pro-kpi-label">Réservations</p>
                    <p className="pro-kpi-value">{stats.totalBookings}</p>
                    <p className="pro-kpi-sub">En cours</p>
                  </div>
                  <div style={{ backgroundColor: MINT + '1A', padding: '12px', borderRadius: '8px' }}>
                    <Users style={{ width: '24px', height: '24px', color: MINT }} />
                  </div>
                </div>
              </div>
            </Link>

            {/* CA Ce Mois */}
            <div className="pro-kpi-card" style={{ borderLeft: `4px solid #7B2FF7` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="pro-kpi-label">CA ce mois</p>
                  <p className="pro-kpi-value">
                    {formatPrice(stats.monthlyRevenue)}
                  </p>
                  <p className="pro-kpi-sub">Total: {formatPrice(stats.totalRevenue)}</p>
                </div>
                <div style={{ backgroundColor: '#7B2FF71A', padding: '12px', borderRadius: '8px' }}>
                  <DollarSign style={{ width: '24px', height: '24px', color: '#7B2FF7' }} />
                </div>
              </div>
            </div>

            {/* Taux d'Occupation */}
            <div className="pro-kpi-card" style={{ borderLeft: `4px solid ${OCEAN}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p className="pro-kpi-label">Taux d&apos;occupation</p>
                  <p className="pro-kpi-value">{stats.occupancyRate.toFixed(1)}%</p>
                  <p className="pro-kpi-sub">Note: {stats.averageRating.toFixed(1)}/5</p>
                </div>
                <div style={{ backgroundColor: OCEAN + '1A', padding: '12px', borderRadius: '8px' }}>
                  <Star style={{ width: '24px', height: '24px', color: OCEAN }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <Link
            href="/pro/voyages/nouveau"
            style={{
              background: `linear-gradient(135deg, ${SUN} 0%, ${SUN}dd 100%)`,
              color: 'white',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: `0 1px 4px rgba(10,22,40,.05)`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px rgba(${parseInt(SUN.slice(1, 3), 16)},${parseInt(SUN.slice(3, 5), 16)},${parseInt(SUN.slice(5, 7), 16)},.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 1px 4px rgba(10,22,40,.05)`;
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: '18px' }}>Créer un voyage</p>
              <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>Lancez votre première offre</p>
            </div>
            <span style={{ fontSize: '24px' }}>→</span>
          </Link>

          <Link
            href="/pro/arrets"
            style={{
              background: `linear-gradient(135deg, ${MINT} 0%, ${MINT}dd 100%)`,
              color: 'white',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: `0 1px 4px rgba(10,22,40,.05)`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 4px 12px rgba(${parseInt(MINT.slice(1, 3), 16)},${parseInt(MINT.slice(3, 5), 16)},${parseInt(MINT.slice(5, 7), 16)},.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = `0 1px 4px rgba(10,22,40,.05)`;
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: '18px' }}>Gérer mes arrêts</p>
              <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>Configurer les points de départ/arrivée</p>
            </div>
            <span style={{ fontSize: '24px' }}>→</span>
          </Link>
        </div>

        {/* Two Column Layout for Activity and Upcoming */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', gridTemplateColumns: '2fr 1fr' }}>
          {/* Recent Activity */}
          <div className="pro-panel">
            <div className="pro-panel-header">
              <h2 className="pro-panel-title">Activité récente</h2>
            </div>
            <div className="pro-panel-body">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: '48px', backgroundColor: '#f3f4f6', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
                  ))}
                </div>
              ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.recentActivity.slice(0, 5).map((activity: any) => (
                    <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: DARK }}>{activity.description}</p>
                        <p style={{ fontSize: '12px', color: DARK, opacity: 0.5, marginTop: '4px' }}>
                          {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          paddingX: '8px',
                          paddingY: '4px',
                          borderRadius: '9999px',
                          backgroundColor:
                            activity.type === 'booking' ? '#dcfce7' :
                            activity.type === 'cancelled' ? '#fee2e2' :
                            '#dbeafe',
                          color:
                            activity.type === 'booking' ? '#166534' :
                            activity.type === 'cancelled' ? '#991b1b' :
                            '#0c4a6e'
                        }}
                      >
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', paddingY: '32px', color: DARK, opacity: 0.5 }}>
                  <p style={{ fontSize: '14px' }}>Aucune activité pour le moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Departures */}
          <div className="pro-panel">
            <div className="pro-panel-header">
              <h2 className="pro-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar style={{ width: '20px', height: '20px' }} />
                Prochains départs
              </h2>
            </div>
            <div className="pro-panel-body">
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ height: '64px', backgroundColor: '#f3f4f6', borderRadius: '8px', animation: 'pulse 2s infinite' }} />
                  ))}
                </div>
              ) : proProfile?.recentTravels && proProfile.recentTravels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {proProfile.recentTravels.slice(0, 3).map((travel: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/pro/voyages/${travel.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 500, color: DARK, fontSize: '14px' }}>
                          {travel.name || travel.title}
                        </p>
                        <p style={{ fontSize: '12px', color: DARK, opacity: 0.6, marginTop: '4px' }}>
                          {new Date(travel.departureDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: OCEAN, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {travel.bookingCount || 0}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/pro/voyages"
                    style={{ marginTop: '12px', display: 'inline-block', fontSize: '14px', color: OCEAN, textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}
                  >
                    Voir tous les voyages →
                  </Link>
                </div>
              ) : (
                <div style={{ textAlign: 'center', paddingY: '32px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ fontSize: '14px', color: DARK, opacity: 0.6 }}>Aucun voyage pour le moment</p>
                  <Link
                    href="/pro/voyages/nouveau"
                    style={{ marginTop: '8px', display: 'inline-block', fontSize: '14px', color: OCEAN, textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}
                  >
                    Créer votre première offre →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
