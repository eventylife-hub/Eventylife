'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProStore } from '@/lib/stores/pro-store';
import { Plus, MapPin, Users, Clock, Grid, List, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const TABS = ['Brouillons', 'En révision', 'Publiés', 'Terminés', 'Annulés'];
const STATUS_MAP: Record<string, string> = {
  'Brouillons': 'DRAFT',
  'En révision': 'PHASE1_REVIEW,PHASE2_REVIEW',
  'Publiés': 'PUBLISHED,SALES_OPEN',
  'Terminés': 'COMPLETED',
  'Annulés': 'CANCELED',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-800',
  PHASE1_REVIEW: 'bg-blue-100 text-blue-800',
  PHASE2_REVIEW: 'bg-blue-100 text-blue-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  SALES_OPEN: 'bg-emerald-100 text-emerald-800',
  COMPLETED: 'bg-slate-200 text-slate-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PHASE1_REVIEW: 'Phase 1',
  PHASE2_REVIEW: 'Phase 2',
  PUBLISHED: 'Publié',
  SALES_OPEN: 'Ventes ouvertes',
  COMPLETED: 'Terminé',
  CANCELED: 'Annulé',
};

export default function TravelsPage() {
  const { travels, fetchTravels } = useProStore();
  const [activeTab, setActiveTab] = useState('Brouillons');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchTravels({
          status: (STATUS_MAP[activeTab] || 'DRAFT').split(','),
          search: search || undefined,
        });
      } catch (_error) {
        setError('Une erreur est survenue lors du chargement des voyages');
      } finally {
        setLoading(false);
      }
    };
    handleFetch();
  }, [activeTab, search]);

  const filteredTravels = travels.filter((t) => {
    if (search) {
      return (
        (t?.title as string)?.toLowerCase().includes(search.toLowerCase()) ||
        (t?.destinationCity as string)?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mes voyages</h1>
            <p className="text-slate-600 mt-2">Gérez tous vos voyages au même endroit</p>
          </div>
          <Link
            href="/pro/voyages/nouveau"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Créer un voyage
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un voyage..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        {/* Tabs and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium whitespace-nowrap rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Erreur */}
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
                  fetchTravels({
                    status: (STATUS_MAP[activeTab] || 'DRAFT').split(','),
                    search: search || undefined,
                  }).catch(() => {
                    setError('Une erreur est survenue lors du chargement des voyages');
                  }).finally(() => {
                    setLoading(false);
                  });
                }}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Chargement */}
        {loading && !error && (
          <>
            <div className="mb-6">
              <Skeleton className="h-12 rounded-lg mb-4" />
            </div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-slate-200">
                    <Skeleton className="h-48" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-12 rounded-none border-b" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Contenu */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTravels.map((travel) => (
                  <Link
                    key={travel.id}
                    href={`/pro/voyages/${travel.id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-slate-200"
                  >
                    <div className="h-48 bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-slate-900 line-clamp-2">{travel.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          STATUS_COLORS[travel.status] || 'bg-slate-100 text-slate-800'
                        }`}>
                          {STATUS_LABELS[travel.status] || travel.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {travel.destinationCity}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(travel.departureDate)} - {formatDate(travel.returnDate)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Capacité: {travel.capacity} places
                        </div>
                      </div>

                      <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 font-medium text-sm">
                        Voir les détails →
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Voyage</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Destination</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Dates</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTravels.map((travel) => (
                      <tr key={travel.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{travel.title}</td>
                        <td className="px-6 py-4 text-slate-600">{travel.destinationCity}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(travel.departureDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            STATUS_COLORS[travel.status] || 'bg-slate-100 text-slate-800'
                          }`}>
                            {STATUS_LABELS[travel.status] || travel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/pro/voyages/${travel.id}`}
                            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                          >
                            Voir →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredTravels.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium mb-4">Aucun voyage trouvé</p>
                <Link
                  href="/pro/voyages/nouveau"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Créer votre premier voyage →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
