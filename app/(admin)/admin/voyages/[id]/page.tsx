'use client';

import React, { useEffect, useState } from 'react';
import { StatsCard } from '@/components/admin/stats-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  BarChart3,
  DollarSign,
  Users,
  Percent,
  AlertCircle,
  ArrowRight,
  Link as LinkIcon,
  X,
  CheckCircle as CheckIcon
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
interface TravelDetail {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  destination: string;
  status: 'DRAFT' | 'PHASE_1' | 'PHASE_2' | 'PUBLISHED' | 'ON_GOING' | 'COMPLETED';
  creatorProName: string;
  bookings: number;
  revenue: number;
  occupancyPercent: number;
  pendingPayments: number;
  transport?: {
    type?: string;
    stops?: Array<{ id: string; name: string }>;
  };
  rooming?: {
    hotels?: Array<{ id: string; name: string; rooms?: number }>;
  };
  team?: Array<{
    id: string;
    name: string;
    role: string;
    email?: string;
  }>;
  auditLog?: Array<{
    id: string;
    action: string;
    timestamp: string;
    actor?: string;
    changes?: string;
  }>;
}

/**
 * Page Admin Voyage Detail - Vue détaillée d&apos;un voyage
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminVoyageDetailPage() {
  const params = useParams();
  const travelId = params.id as string;
  const [travel, setTravel] = useState<TravelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTravel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/travels/${travelId}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setTravel(data);
      } else {
        setError('Impossible de charger les détails du voyage');
      }
    } catch (err: unknown) {
      console.error('Voyage detail fetch error:', err);
      setError('Erreur lors du chargement du voyage. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (travelId) {
      fetchTravel();
    }
  }, [travelId]);

  const statusConfig = {
    DRAFT: { label: 'Brouillon', color: 'admin-badge admin-badge-neutral', step: 0 },
    PHASE_1: { label: 'Phase 1', color: 'admin-badge admin-badge-info', step: 1 },
    PHASE_2: { label: 'Phase 2', color: 'admin-badge admin-badge-violet', step: 2 },
    PUBLISHED: { label: 'Publié', color: 'admin-badge admin-badge-success', step: 3 },
    ON_GOING: { label: 'En cours', color: 'admin-badge admin-badge-warning', step: 4 },
    COMPLETED: { label: 'Complété', color: 'admin-badge admin-badge-violet', step: 5 },
  };

  const phases = ['DRAFT', 'PHASE_1', 'PHASE_2', 'PUBLISHED', 'ON_GOING', 'COMPLETED'] as const;

  const handleStatusTransition = async (newStatus: typeof phases[number]) => {
    try {
      const response = await fetch(`/api/admin/travels/${travelId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setToastMessage({ type: 'success', message: `Statut mis à jour en "${statusConfig[newStatus].label}"` });
        setTimeout(() => setToastMessage(null), 3000);
        const res = await fetch(`/api/admin/travels/${travelId}`, { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json() as unknown) as unknown;
          setTravel(data);
        }
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la mise à jour du statut' });
      }
    } catch (err: unknown) {
      console.error('Status transition error:', err);
      setToastMessage({ type: 'error', message: 'Erreur lors de la transition de statut' });
    }
  };

  // formatCurrency locale supprimée — utilise formatPrice de @/lib/utils

  if (loading) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Détails voyage
          </h1>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !travel) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Détails voyage
          </h1>
        </div>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-medium">{error || 'Voyage non trouvé'}</p>
          <p className="text-sm text-red-700 mt-2">Vérifiez que l&apos;ID du voyage est correct.</p>
          <button
            onClick={fetchTravel}
            className="admin-btn-secondary gap-2 flex items-center text-sm mt-4"
          >
            <ArrowRight className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[travel.status];
  const currentPhaseIndex = phases.indexOf(travel.status);

  return (
    <div className="admin-fade-in space-y-6">
      {/* En-tête */}
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Détails voyage
        </h1>
      </div>

      <div className="admin-fade-in delay-1">
        <p className="text-gray-600 mt-2">
          Voyage créé par <span className="font-medium">{travel.creatorProName}</span>
        </p>
      </div>

      {/* Carte d'information principale */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-body p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Destination</label>
              <p className="text-lg font-semibold text-gray-900">{travel.destination}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Dates</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(travel.startDate)} - {formatDate(travel.endDate)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Slug</label>
              <p className="text-sm font-mono text-gray-700">{travel.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Statut actuel</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStatusConfig.color}`}>
                {currentStatusConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline des phases */}
      <div className="admin-panel admin-fade-in delay-3">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Cycle de vie du voyage</h3>
        </div>
        <div className="admin-panel-body p-6">
          <div className="flex items-center justify-between">
            {phases.map((phase, index) => {
              const isActive = currentPhaseIndex === index;
              const isCompleted = currentPhaseIndex > index;
              const phaseConfig = statusConfig[phase];

              return (
                <React.Fragment key={phase}>
                  <button
                    onClick={() => handleStatusTransition(phase)}
                    className={`flex flex-col items-center gap-2 flex-1 ${
                      isCompleted ? 'opacity-100' : isActive ? 'opacity-100' : 'opacity-50'
                    }`}
                    disabled={index > currentPhaseIndex + 1}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? `${phaseConfig.color.replace('bg-', 'bg-').replace('text-', 'text-')}`
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className="text-xs font-medium text-center">{phaseConfig.label}</span>
                  </button>

                  {index < phases.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2 flex-wrap">
            {currentPhaseIndex < phases.length - 1 && (
              <button
                onClick={() => {
                  const nextPhase = phases[currentPhaseIndex + 1];
                  if (nextPhase) handleStatusTransition(nextPhase);
                }}
                className="admin-btn-primary gap-2 flex items-center text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Passer à {statusConfig[phases[currentPhaseIndex + 1] || 'DRAFT'].label}
              </button>
            )}
            <Link href={`/admin/voyages/${travelId}/lifecycle`}>
              <button className="admin-btn-secondary gap-2 flex items-center text-sm">
                <LinkIcon className="w-4 h-4" />
                Voir page lifecycle
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-kpi-grid admin-fade-in delay-4">
        <StatsCard
          title="Réservations"
          value={travel.bookings.toString()}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          changePercent={5}
          trend="up"
        />
        <StatsCard
          title="Chiffre d&apos;affaires"
          value={formatPrice(travel.revenue)}
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
          changePercent={12}
          trend="up"
        />
        <StatsCard
          title="Taux d&apos;occupation"
          value={`${travel.occupancyPercent}%`}
          icon={<Percent className="w-5 h-5 text-blue-600" />}
          changePercent={8}
          trend="up"
        />
        <StatsCard
          title="Paiements en attente"
          value={formatPrice(travel.pendingPayments)}
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          changePercent={travel.pendingPayments > 50000 ? 5 : 2}
          trend={travel.pendingPayments > 50000 ? 'down' : 'up'}
        />
      </div>

      {/* Onglets */}
      <div className="admin-panel admin-fade-in delay-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="rooming">Logements</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <div className="admin-panel-body p-6">
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Données du voyage</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Consultez les détails complets du voyage et ses métriques clés
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-600">ID du voyage</label>
                    <p className="font-mono text-sm mt-1">{travel.id}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-600">URL du voyage</label>
                    <p className="font-mono text-sm mt-1 break-all">/voyages/{travel.slug}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transport" className="mt-0">
              <div className="space-y-4">
                {travel?.transport ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="text-xs font-medium text-gray-600">Type de transport</label>
                        <p className="text-sm font-semibold text-gray-900 mt-2">{travel.transport.type || 'Non spécifié'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="text-xs font-medium text-gray-600">Nombre d&apos;arrêts</label>
                        <p className="text-sm font-semibold text-gray-900 mt-2">{travel.transport.stops?.length || 0}</p>
                      </div>
                    </div>
                    {travel.transport.stops && travel.transport.stops.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-gray-900 mb-3 block">Points d&apos;arrêt</label>
                        <div className="space-y-2">
                          {travel.transport.stops.map((stop, idx) => (
                            <div key={stop.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-semibold">
                                {idx + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-900">{stop.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucune configuration de transport</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="rooming" className="mt-0">
              <div className="space-y-4">
                {travel?.rooming?.hotels && travel.rooming.hotels.length > 0 ? (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-3 block">Hôtels et logements</label>
                      <div className="space-y-3">
                        {travel.rooming.hotels.map((hotel) => (
                          <div key={hotel.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{hotel.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Chambres: {hotel.rooms || 0}</p>
                              </div>
                              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Actif
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Taux d&apos;occupation:</strong> {travel.occupancyPercent}%
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucun logement configuré</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="finance" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <label className="text-xs font-medium text-green-600">Chiffre d&apos;affaires total</label>
                    <p className="text-2xl font-bold text-green-900 mt-2">{formatPrice(travel.revenue)}</p>
                    <p className="text-xs text-green-700 mt-2">{travel.bookings} réservations</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <label className="text-xs font-medium text-orange-600">Paiements en attente</label>
                    <p className="text-2xl font-bold text-orange-900 mt-2">{formatPrice(travel.pendingPayments)}</p>
                    <p className="text-xs text-orange-700 mt-2">À encaisser</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="text-xs font-medium text-blue-600">Taux d&apos;occupation</label>
                    <p className="text-2xl font-bold text-blue-900 mt-2">{travel.occupancyPercent}%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <label className="text-xs font-medium text-purple-600">Durée du voyage</label>
                    <p className="text-sm font-bold text-purple-900 mt-2">
                      {Math.ceil((new Date(travel.endDate).getTime() - new Date(travel.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <div className="space-y-4">
                {travel?.team && travel.team.length > 0 ? (
                  <div className="space-y-3">
                    {travel.team.map((member) => (
                      <div key={member.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                          {member.email && (
                            <p className="text-xs text-gray-600 mt-2 font-mono">{member.email}</p>
                          )}
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full flex-shrink-0 ml-2">
                          Assigné
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucun membre d&apos;équipe assigné</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="audit" className="mt-0">
              <div className="space-y-4">
                {travel?.auditLog && travel.auditLog.length > 0 ? (
                  <div className="space-y-2">
                    {travel.auditLog.map((log, idx) => (
                      <div key={log.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                            {(travel.auditLog || []).length - idx}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          {log.changes && (
                            <p className="text-xs text-gray-600 mt-1 font-mono truncate">{log.changes}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            {log.actor && <span>{log.actor}</span>}
                            <span>•</span>
                            <span>{new Date(log.timestamp).toLocaleDateString('fr-FR')} à {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Aucune modification enregistrée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toastMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckIcon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 p-1 rounded hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
