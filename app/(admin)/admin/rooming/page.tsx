'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { StatsCard } from '@/components/admin/stats-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Home, Users, Sofa, AlertCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  occupancy: number;
  guests: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'HOLD';
  bookingRef?: string;
}

interface RoomingData {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  holdRooms: number;
  trips: { id: string; name: string }[];
  selectedTrip?: {
    id: string;
    name: string;
    hotelBlock: string;
    checkInDate: string;
    checkOutDate: string;
    rooms: Room[];
  };
}

/**
 * Page Admin Rooming - Gestion globale des logements
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminRoomingPage() {
  const [rooming, setRooming] = useState<RoomingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooming = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedTrip) params.append('travelId', selectedTrip);

        const response = await fetch(`/api/admin/rooming?${params.toString()}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setRooming(data);
          if (!selectedTrip && data.trips.length > 0) {
            setSelectedTrip(data.trips[0].id);
          }
        }
      } catch (_error) {
        // Erreur silencieuse — les données se chargent au prochain retry
      } finally {
        setLoading(false);
      }
    };

    fetchRooming();
  }, [selectedTrip]);

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (selectedTrip) params.append('travelId', selectedTrip);

      const response = await fetch(`/api/admin/rooming/export?${params.toString()}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rooming-${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
      }
    } catch (_error) {
      setExportError('Erreur lors de l\'export. Veuillez réessayer.');
      setTimeout(() => setExportError(null), 5000);
    }
  };

  const statusConfig = {
    AVAILABLE: { label: 'Disponible', color: 'bg-green-100 text-green-800' },
    OCCUPIED: { label: 'Occupée', color: 'bg-blue-100 text-blue-800' },
    MAINTENANCE: { label: 'Maintenance', color: 'bg-gray-100 text-gray-800' },
    HOLD: { label: 'En hold', color: 'bg-yellow-100 text-yellow-800' },
  };

  const roomColumns: DataTableColumn<Room>[] = [
    {
      key: 'number',
      label: 'Chambre',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'capacity',
      label: 'Capacité',
    },
    {
      key: 'occupancy',
      label: 'Occupants',
      render: (value, row) => `${value} / ${row.capacity}`,
    },
    {
      key: 'guests',
      label: 'Clients',
      render: (value: unknown) => {
        const guestList = (value as string[]) || [];
        return (
          <div className="text-sm">
            {guestList.length > 0 ? (
              <ul>
                {guestList.slice(0, 2).map((guest, i) => (
                  <li key={i}>{guest}</li>
                ))}
                {guestList.length > 2 && <li className="text-gray-500">+{guestList.length - 2} autre(s)</li>}
              </ul>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${config?.color}`}>
            {config?.label}
          </span>
        );
      },
    },
    {
      key: 'bookingRef',
      label: 'Réservation',
      render: (value: unknown) => (
        <span className="font-mono text-xs">{(value as string | undefined) || '-'}</span>
      ),
    },
  ];

  if (loading || !rooming) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Fournisseurs & Hôtels
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-panel p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
        <div className="admin-panel p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const occupancyPercent = rooming.totalRooms > 0
    ? Math.round((rooming.occupiedRooms / rooming.totalRooms) * 100)
    : 0;

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Fournisseurs & Hôtels
        </h1>
      </div>

      {/* Toast erreur export */}
      {exportError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
          <span>{exportError}</span>
          <button
            onClick={() => setExportError(null)}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Fermer
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="admin-kpi-grid admin-fade-in delay-1">
        <StatsCard
          title="Total de chambres"
          value={rooming.totalRooms.toString()}
          icon={<Home className="w-5 h-5 text-blue-600" />}
          changePercent={0}
        />
        <StatsCard
          title="Chambres occupées"
          value={rooming.occupiedRooms.toString()}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          changePercent={occupancyPercent}
          trend="up"
        />
        <StatsCard
          title="Disponibles"
          value={rooming.availableRooms.toString()}
          icon={<Sofa className="w-5 h-5 text-blue-600" />}
          changePercent={0}
        />
        <StatsCard
          title="En hold"
          value={rooming.holdRooms.toString()}
          icon={<AlertCircle className="w-5 h-5 text-blue-600" />}
          changePercent={0}
        />
      </div>

      {/* Sélecteur de voyage */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-body p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sélectionner un voyage
              </label>
              <Select value={selectedTrip} onValueChange={setSelectedTrip}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rooming.trips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="admin-btn-secondary gap-2 flex items-center"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="admin-btn-secondary gap-2 flex items-center"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du voyage sélectionné */}
      {rooming.selectedTrip && (
        <div className="admin-panel admin-fade-in delay-3">
          <div className="admin-panel-header pb-3">
            <h3 className="admin-panel-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
              {rooming.selectedTrip.name}
            </h3>
          </div>
          <div className="admin-panel-body p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Bloc hôtel</label>
                <p className="font-semibold text-gray-900">{rooming.selectedTrip.hotelBlock}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Check-in</label>
                <p className="font-semibold text-gray-900">
                  {formatDate(rooming.selectedTrip.checkInDate)}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Check-out</label>
                <p className="font-semibold text-gray-900">
                  {formatDate(rooming.selectedTrip.checkOutDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau des chambres */}
      {rooming.selectedTrip && (
        <div className="admin-panel admin-fade-in delay-4">
          <div className="admin-panel-header pb-3">
            <h3 className="admin-panel-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
              Liste des chambres ({rooming.selectedTrip.rooms.length})
            </h3>
          </div>
          <div className="admin-panel-body p-6">
            <DataTable
              columns={roomColumns}
              data={rooming.selectedTrip.rooms}
              loading={false}
              emptyMessage="Aucune chambre trouvée"
              rowActions={[
                {
                  label: 'Détails',
                  onClick: (row) => {
                    setSelectedRoom(row as Room);
                  },
                },
                {
                  label: 'Modifier assignation',
                  onClick: (row) => {
                    setEditingRoom(row as Room);
                  },
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Résumé des blocs hôtel */}
      <div className="admin-panel admin-fade-in delay-5">
        <div className="admin-panel-header pb-3">
          <h3 className="admin-panel-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Résumé des blocs hôtel
          </h3>
        </div>
        <div className="admin-panel-body p-6">
          <div className="space-y-3">
            {rooming.trips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{trip.name}</span>
                <span className="text-sm text-gray-600">
                  {rooming.selectedTrip?.id === trip.id ? '(Sélectionné)' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal détail chambre */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="admin-panel w-full max-w-md">
            <div className="admin-panel-header flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
                Détails de la chambre {selectedRoom.number}
              </h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="admin-panel-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Type</label>
                  <p className="font-semibold text-gray-900 mt-1">{selectedRoom.type}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Capacité</label>
                  <p className="font-semibold text-gray-900 mt-1">{selectedRoom.capacity} personnes</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Occupants</label>
                  <p className="font-semibold text-gray-900 mt-1">{selectedRoom.occupancy} / {selectedRoom.capacity}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Statut</label>
                  <p className="font-semibold text-gray-900 mt-1">{statusConfig[selectedRoom.status]?.label}</p>
                </div>
              </div>

              {selectedRoom.guests.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600">Clients logés</label>
                  <ul className="mt-2 space-y-1">
                    {selectedRoom.guests.map((guest, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {guest}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRoom.bookingRef && (
                <div>
                  <label className="text-xs font-medium text-gray-600">Référence réservation</label>
                  <p className="font-mono text-sm text-gray-700 mt-1">{selectedRoom.bookingRef}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="admin-btn-secondary"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal édition assignation chambre */}
      {editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="admin-panel w-full max-w-md">
            <div className="admin-panel-header flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
                Modifier l'assignation - Chambre {editingRoom.number}
              </h2>
              <button
                onClick={() => setEditingRoom(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="admin-panel-body space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Type de chambre:</span> {editingRoom.type}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <span className="font-medium">Capacité:</span> {editingRoom.capacity} personnes
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Statut
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="OCCUPIED">Occupée</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="HOLD">En hold</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Clients logés (un par ligne)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Nom et prénom des clients..."
                  defaultValue={editingRoom.guests.join('\n')}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="admin-btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                  }}
                  className="admin-btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
