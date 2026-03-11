'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { Plus, MapPin, Image as ImageIcon, CheckCircle2, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  VALIDATED: 'bg-green-100 text-green-800',
  CHANGES_REQUESTED: 'bg-yellow-100 text-yellow-800',
  ARCHIVED: 'bg-slate-200 text-slate-600',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  VALIDATED: 'Validé',
  CHANGES_REQUESTED: 'Modifications',
  ARCHIVED: 'Archivé',
};

export default function BusStopsPage() {
  const { busStops, fetchBusStops } = useProStore();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchBusStops(activeFilter ? { type: activeFilter } : undefined);
      } catch (_error: unknown) {
        setError('Une erreur est survenue lors du chargement des arrêts de bus');
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, [activeFilter]);

  const filteredStops = activeFilter
    ? busStops.filter((s: unknown) => s.type === activeFilter)
    : busStops;

  const OCEAN = 'var(--pro-ocean)';
  const SUN = 'var(--pro-sun)';
  const DARK = '#0A1628';
  const SAND = '#FEFCF3';
  const MINT = 'var(--pro-mint)';

  return (
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: SAND, padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 className="pro-page-title">Mes arrêts de bus</h1>
            <p style={{ color: '#8896A6', marginTop: '8px' }}>Gérez vos points de départ et d&apos;arrivée</p>
          </div>
          <Link
            href="/pro/arrets/nouveau"
            className="pro-btn-sun"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus className="w-5 h-5" />
            Ajouter un arrêt
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ border: '1px solid #FFE0E3', backgroundColor: '#FFE0E3', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle className="h-4 w-4" style={{ color: 'var(--pro-coral)', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '14px', color: 'var(--pro-coral)' }}>
                {error}
              </p>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchBusStops(activeFilter ? { type: activeFilter } : undefined)
                    .catch(() => {
                      setError('Une erreur est survenue lors du chargement des arrêts de bus');
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
                className="pro-btn-outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Skeleton className="px-4 py-2 rounded-lg w-20" />
                <Skeleton className="px-4 py-2 rounded-lg w-24" />
                <Skeleton className="px-4 py-2 rounded-lg w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="px-4 py-2 rounded-lg w-20" />
                <Skeleton className="px-4 py-2 rounded-lg w-20" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_: unknown, idx: number) => (
                <div key={idx} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <Skeleton className="h-40" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Filter and View Toggle */}
        {!loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveFilter(null)}
                className={activeFilter === null ? 'pro-btn-ocean' : 'pro-btn-outline'}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveFilter('PICKUP_DEPARTURE')}
                className={activeFilter === 'PICKUP_DEPARTURE' ? 'pro-btn-ocean' : 'pro-btn-outline'}
              >
                Départs
              </button>
              <button
                onClick={() => setActiveFilter('DROPOFF_ARRIVAL')}
                className={activeFilter === 'DROPOFF_ARRIVAL' ? 'pro-btn-ocean' : 'pro-btn-outline'}
              >
                Arrivées
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setViewMode('cards')}
                className={viewMode === 'cards' ? 'pro-btn-sun' : 'pro-btn-outline'}
              >
                Cartes
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'pro-btn-sun' : 'pro-btn-outline'}
              >
                Carte
              </button>
            </div>
          </div>
        )}

        {/* Map View (Placeholder) */}
        {!loading && viewMode === 'map' && (
          <div className="pro-panel" style={{ marginBottom: '24px', height: '384px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <MapPin className="w-12 h-12" style={{ color: '#8896A6', margin: '0 auto 16px' }} />
              <p style={{ color: '#0A1628', fontWeight: 500 }}>Intégration Google Maps à venir</p>
              <p style={{ fontSize: '14px', color: '#8896A6', marginTop: '4px' }}>Cette fonction sera disponible bientôt</p>
            </div>
          </div>
        )}

        {/* Cards View */}
        {!loading && viewMode === 'cards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredStops.length === 0 ? (
              <div className="pro-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 24px' }}>
                <MapPin className="w-12 h-12" style={{ color: '#8896A6', margin: '0 auto 16px' }} />
                <p style={{ color: '#0A1628', fontWeight: 500 }}>Aucun arrêt créé</p>
                <Link
                  href="/pro/arrets/nouveau"
                  style={{ color: 'var(--pro-ocean)', fontWeight: 500, fontSize: '14px', marginTop: '8px', display: 'inline-block' }}
                >
                  Créer votre premier arrêt →
                </Link>
              </div>
            ) : (
              filteredStops.map((stop: unknown) => (
                <Link
                  key={stop.id}
                  href={`/pro/arrets/${stop.id}`}
                  className="pro-panel pro-fade-in"
                  style={{ overflow: 'hidden' }}
                >
                  {/* Image Placeholder */}
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #E8F7FC, #B3E5FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {/* Media Count */}
                    <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, color: '#0A1628', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ImageIcon className="w-4 h-4" />
                      {stop.media?.length || 0}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pro-panel-body">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 className="pro-panel-title" style={{ margin: 0, flex: 1 }}>
                        {stop.publicName}
                      </h3>
                      <span
                        className="pro-badge-ocean"
                        style={{ marginLeft: '8px', whiteSpace: 'nowrap' }}
                      >
                        {STATUS_LABELS[stop.status]}
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#8896A6', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Adresse</p>
                        <p style={{ fontSize: '14px', color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stop.addressLine}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#8896A6', textTransform: 'uppercase', fontWeight: 600 }}>
                          {stop.city}, {stop.postalCode}
                        </p>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 500, padding: '4px 8px', backgroundColor: '#E8F7FC', color: 'var(--pro-ocean)', borderRadius: '4px' }}>
                        {stop.type === 'PICKUP_DEPARTURE' ? '🚌 Départ' : '📍 Arrivée'}
                      </span>
                    </div>

                    {/* Status Info */}
                    {stop.status === 'DRAFT' && (
                      <div style={{ padding: '8px', backgroundColor: '#E0FFF5', borderRadius: '4px', fontSize: '12px', color: 'var(--pro-mint)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock className="w-3 h-3" />
                        À soumettre pour validation
                      </div>
                    )}

                    {stop.status === 'VALIDATED' && (
                      <div style={{ padding: '8px', backgroundColor: '#E0FFF5', borderRadius: '4px', fontSize: '12px', color: 'var(--pro-mint)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 className="w-3 h-3" />
                        Prêt à être utilisé
                      </div>
                    )}

                    {stop.status === 'CHANGES_REQUESTED' && (
                      <div style={{ padding: '8px', backgroundColor: '#FFE0E3', borderRadius: '4px', fontSize: '12px', color: 'var(--pro-coral)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle className="w-3 h-3" />
                        Modifications demandées
                      </div>
                    )}

                    <button style={{ width: '100%', padding: '8px 12px', backgroundColor: '#FFF0E8', color: 'var(--pro-sun)', borderRadius: '4px', border: 'none', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}>
                      Voir les détails →
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Stats Card */}
        {!loading && filteredStops.length > 0 && (
          <div className="pro-panel" style={{ marginTop: '32px' }}>
            <h3 className="pro-panel-title" style={{ marginBottom: '16px' }}>Résumé</h3>
            <div className="pro-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div className="pro-kpi-card" style={{ textAlign: 'center' }}>
                <p className="pro-kpi-value" style={{ color: 'var(--pro-ocean)' }}>{filteredStops.length}</p>
                <p className="pro-kpi-label">Arrêts total</p>
              </div>
              <div className="pro-kpi-card" style={{ textAlign: 'center' }}>
                <p className="pro-kpi-value" style={{ color: 'var(--pro-mint)' }}>
                  {filteredStops.filter((s: unknown) => s.status === 'VALIDATED').length}
                </p>
                <p className="pro-kpi-label">Validés</p>
              </div>
              <div className="pro-kpi-card" style={{ textAlign: 'center' }}>
                <p className="pro-kpi-value" style={{ color: 'var(--pro-ocean)' }}>
                  {filteredStops.filter((s: unknown) => s.status === 'DRAFT').length}
                </p>
                <p className="pro-kpi-label">Brouillons</p>
              </div>
              <div className="pro-kpi-card" style={{ textAlign: 'center' }}>
                <p className="pro-kpi-value" style={{ color: 'var(--pro-sun)' }}>
                  {filteredStops.filter((s: unknown) => s.status === 'CHANGES_REQUESTED').length}
                </p>
                <p className="pro-kpi-label">À modifier</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
