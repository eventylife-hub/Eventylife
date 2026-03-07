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
      } catch (_error) {
        setError('Une erreur est survenue lors du chargement des arrêts de bus');
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, [activeFilter]);

  const filteredStops = activeFilter
    ? busStops.filter((s) => s.type === activeFilter)
    : busStops;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mes arrêts de bus</h1>
            <p className="text-slate-600 mt-2">Gérez vos points de départ et d'arrivée</p>
          </div>
          <Link
            href="/pro/arrets/nouveau"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Ajouter un arrêt
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="ml-3 text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button
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
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
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
              {[...Array(6)].map((_, idx) => (
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveFilter('PICKUP_DEPARTURE')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === 'PICKUP_DEPARTURE'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Départs
              </button>
              <button
                onClick={() => setActiveFilter('DROPOFF_ARRIVAL')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === 'DROPOFF_ARRIVAL'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Arrivées
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Cartes
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                Carte
              </button>
            </div>
          </div>
        )}

        {/* Map View (Placeholder) */}
        {!loading && viewMode === 'map' && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Intégration Google Maps à venir</p>
              <p className="text-sm text-slate-500 mt-1">Cette fonction sera disponible bientôt</p>
            </div>
          </div>
        )}

        {/* Cards View */}
        {!loading && viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStops.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Aucun arrêt créé</p>
                <Link
                  href="/pro/arrets/nouveau"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm mt-2 inline-block"
                >
                  Créer votre premier arrêt →
                </Link>
              </div>
            ) : (
              filteredStops.map((stop) => (
                <Link
                  key={stop.id}
                  href={`/pro/arrets/${stop.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-slate-200 overflow-hidden group"
                >
                  {/* Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center group-hover:from-slate-400 group-hover:to-slate-500 transition-colors relative">
                    {/* Media Count */}
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-slate-700 flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {stop.media?.length || 0}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-slate-900 line-clamp-2">
                        {stop.publicName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[stop.status]
                        }`}
                      >
                        {STATUS_LABELS[stop.status]}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Adresse</p>
                        <p className="line-clamp-1">{stop.addressLine}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">
                          {stop.city}, {stop.postalCode}
                        </p>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="mb-4">
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded">
                        {stop.type === 'PICKUP_DEPARTURE' ? '🚌 Départ' : '📍 Arrivée'}
                      </span>
                    </div>

                    {/* Status Info */}
                    {stop.status === 'DRAFT' && (
                      <div className="p-2 bg-blue-50 rounded text-xs text-blue-700 mb-3 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        À soumettre pour validation
                      </div>
                    )}

                    {stop.status === 'VALIDATED' && (
                      <div className="p-2 bg-green-50 rounded text-xs text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Prêt à être utilisé
                      </div>
                    )}

                    {stop.status === 'CHANGES_REQUESTED' && (
                      <div className="p-2 bg-yellow-50 rounded text-xs text-yellow-700 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        Modifications demandées
                      </div>
                    )}

                    <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 font-medium text-sm">
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
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Résumé</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">{filteredStops.length}</p>
                <p className="text-sm text-slate-600">Arrêts total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredStops.filter((s) => s.status === 'VALIDATED').length}
                </p>
                <p className="text-sm text-slate-600">Validés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredStops.filter((s) => s.status === 'DRAFT').length}
                </p>
                <p className="text-sm text-slate-600">Brouillons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredStops.filter((s) => s.status === 'CHANGES_REQUESTED').length}
                </p>
                <p className="text-sm text-slate-600">À modifier</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
