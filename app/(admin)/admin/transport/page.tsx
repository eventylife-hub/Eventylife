'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/admin/stats-card';
import { Download, Bus, Plane, Package, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface TransportTrip {
  id: string;
  tripName: string;
  departureMode: 'BUS' | 'FLIGHT' | 'MIXED';
  company: string;
  capacity: number;
  pricePerSeatCentimes: number;
  manifestStatus: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
  manifestLink?: string;
}

interface TransportStats {
  totalTripsWithTransport: number;
  pendingManifests: number;
  busCompanies: number;
  flightBookings: number;
}

/**
 * Page Transport - Gestion des transports
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function TransportPage() {
  const [trips, setTrips] = useState<TransportTrip[]>([]);
  const [stats, setStats] = useState<TransportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'CONFIRMED' | 'COMPLETED'>('PENDING');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'BUS' | 'FLIGHT' | 'MIXED'>('ALL');
  const [generatingManifest, setGeneratingManifest] = useState<string | null>(null);

  const statuses = [
    { value: 'PENDING' as const, label: 'En attente' },
    { value: 'CONFIRMED' as const, label: 'Confirmés' },
    { value: 'COMPLETED' as const, label: 'Complétés' },
  ];

  const modes = [
    { value: 'ALL' as const, label: 'Tous' },
    { value: 'BUS' as const, label: 'Bus' },
    { value: 'FLIGHT' as const, label: 'Avion' },
    { value: 'MIXED' as const, label: 'Mixte' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.append('status', statusFilter);
        if (modeFilter !== 'ALL') {
          params.append('mode', modeFilter);
        }

        const response = await fetch(`/api/admin/transport?${params.toString()}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = (await response.json() as unknown) as unknown;
          setTrips(data.data || []);
        } else {
          setError('Erreur lors du chargement des transports');
        }
      } catch (err: unknown) {
        console.error('Transport fetch error:', err);
        setError('Impossible de charger les transports. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, modeFilter]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/transport/stats', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = (await response.json() as unknown) as unknown;
          setStats(data);
        }
      } catch (err: unknown) {
        console.error('Transport stats fetch error:', err);
      }
    };

    fetchStats();
  }, []);

  const getDepartureModeIcon = (mode: string) => {
    switch (mode) {
      case 'BUS':
        return <Bus className="w-4 h-4" />;
      case 'FLIGHT':
        return <Plane className="w-4 h-4" />;
      case 'MIXED':
        return (
          <div className="flex gap-1">
            <Bus className="w-4 h-4" />
            <Plane className="w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'admin-badge admin-badge-warning';
      case 'CONFIRMED':
        return 'admin-badge admin-badge-info';
      case 'COMPLETED':
        return 'admin-badge admin-badge-success';
      default:
        return 'admin-badge admin-badge-neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmé';
      case 'COMPLETED':
        return 'Complété';
      default:
        return status;
    }
  };

  const handleGenerateManifest = async (tripId: string, format: 'PDF' | 'CSV') => {
    try {
      setGeneratingManifest(tripId);
      setError(null);
      const response = await fetch(`/api/admin/transport/${tripId}/manifest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manifest-${tripId}-${new Date().toISOString().split('T')[0]}.${format === 'PDF' ? 'pdf' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        // In production: show toast: "Manifeste généré et téléchargé avec succès"
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (response.status === 400) {
        setError('Impossible de générer le manifeste — vérifiez que le voyage a des participants');
      } else {
        setError('Erreur lors de la génération du manifeste');
      }
    } catch (err: unknown) {
      console.error('Manifest generation error:', err);
      setError('Impossible de générer le manifeste. Vérifiez votre connexion.');
    } finally {
      setGeneratingManifest(null);
    }
  };

  const columns: DataTableColumn<TransportTrip>[] = [
    {
      key: 'tripName',
      label: 'Voyage',
    },
    {
      key: 'departureMode',
      label: 'Mode',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          {getDepartureModeIcon(value as string)}
          <span className="text-sm">{value as string}</span>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Transporteur',
    },
    {
      key: 'capacity',
      label: 'Capacité',
      render: (value: unknown) => (
        <span className="font-medium">{(value as number)} places</span>
      ),
    },
    {
      key: 'pricePerSeatCentimes',
      label: 'Prix/place',
      render: (value: unknown) => (
        <span className="font-medium">{formatPrice(value as number)}</span>
      ),
    },
    {
      key: 'manifestStatus',
      label: 'Statut manifeste',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value as string)}`}>
          {getStatusLabel(value as string)}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: 'Générer manifeste (PDF)',
      onClick: (row: TransportTrip) => {
        handleGenerateManifest(row.id, 'PDF');
      },
      disabled: (row: TransportTrip) => generatingManifest === row.id,
    },
    {
      label: 'Générer manifeste (CSV)',
      onClick: (row: TransportTrip) => {
        handleGenerateManifest(row.id, 'CSV');
      },
      disabled: (row: TransportTrip) => generatingManifest === row.id,
    },
    {
      label: 'Éditer config',
      onClick: (row: TransportTrip) => {
        window.location.href = `/admin/voyages/${row.id}/transport`;
      },
    },
  ];

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Transport Admin
        </h1>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-sm font-medium hover:underline flex-shrink-0"
          >
            Fermer
          </button>
        </div>
      )}

      {/* KPIs */}
      {stats ? (
        <div className="admin-kpi-grid admin-fade-in delay-1">
          <StatsCard
            icon={<Package />}
            title="Voyages avec transport"
            value={stats.totalTripsWithTransport.toString()}
          />
          <StatsCard
            icon={<AlertCircle />}
            title="Manifestes en attente"
            value={stats.pendingManifests.toString()}
          />
          <StatsCard
            icon={<Bus />}
            title="Transporteurs bus"
            value={stats.busCompanies.toString()}
          />
          <StatsCard
            icon={<Plane />}
            title="Réservations avion"
            value={stats.flightBookings.toString()}
          />
        </div>
      ) : (
        <div className="admin-kpi-grid">
          {[...Array(4)].map((_: unknown, i: number) => (
            <div key={i} className="admin-kpi-card p-6 h-32 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      )}

      {/* Lien vers gestion des arrêts bus */}
      <div className="flex gap-2 admin-fade-in delay-2">
        <button
          onClick={() => (window.location.href = '/admin/transport/stops')}
          className="admin-btn-secondary"
        >
          Gérer les arrêts bus
        </button>
      </div>

      {/* Filtres et Table */}
      <div className="admin-panel admin-fade-in delay-3">
        <div className="admin-panel-body p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut du manifeste
              </label>
              <div className="flex gap-2">
                {statuses.map((s: unknown) => (
                  <button
                    key={s.value}
                    onClick={() => setStatusFilter(s.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      statusFilter === s.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de transport
              </label>
              <div className="flex gap-2">
                {modes.map((m: unknown) => (
                  <button
                    key={m.value}
                    onClick={() => setModeFilter(m.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      modeFilter === m.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={trips}
            loading={loading}
            emptyMessage="Aucun trajet trouvé"
            rowActions={rowActions}
          />
        </div>
      </div>
    </div>
  );
}
