'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Users, Calendar, MapPin, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Reservation {
  id: string;
  voyageTitle: string;
  voyageId: string;
  clientName: string;
  clientEmail: string;
  passengers: number;
  status: string;
  departureDate: string;
  totalAmount: number;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  REFUNDED: 'bg-slate-100 text-slate-800',
};

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confirmee',
  PENDING: 'En attente',
  CANCELLED: 'Annulee',
  COMPLETED: 'Terminee',
  REFUNDED: 'Remboursee',
};

export default function ProReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/pro/reservations?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors du chargement');

      const data = await res.json();
      setReservations(data.items || data || []);
    } catch (err) {
      setError('Impossible de charger les reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReservations();
  };

  const filtered = reservations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reservations</h1>
            <p className="text-slate-600 mt-1">Gerez les reservations de vos voyages</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReservations}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher par client, voyage..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Button type="submit" size="sm">
                Rechercher
              </Button>
            </form>

            <div className="flex gap-2 flex-wrap">
              {['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(statusFilter === status ? null : status)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchReservations}>
              Reessayer
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Reservations List */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Aucune reservation trouvee</p>
                <p className="text-sm text-slate-500 mt-1">
                  Les reservations apparaitront ici quand des clients reserveront vos voyages.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((resa) => (
                  <Link
                    key={resa.id}
                    href={`/pro/voyages/${resa.voyageId}/reservations`}
                    className="block bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {resa.clientName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              STATUS_COLORS[resa.status] || 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {STATUS_LABELS[resa.status] || resa.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {resa.voyageTitle}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(resa.departureDate).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {resa.passengers} passager{resa.passengers > 1 ? 's' : ''}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {(resa.totalAmount / 100).toFixed(2)} EUR
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {filtered.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{filtered.length}</p>
                    <p className="text-sm text-slate-600">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {filtered.filter((r) => r.status === 'CONFIRMED').length}
                    </p>
                    <p className="text-sm text-slate-600">Confirmees</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {filtered.filter((r) => r.status === 'PENDING').length}
                    </p>
                    <p className="text-sm text-slate-600">En attente</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {filtered.reduce((sum, r) => sum + r.passengers, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Passagers</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
