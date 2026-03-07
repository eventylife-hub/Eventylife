'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

/**
 * Page: Pro Voyage Reservations (/pro/voyages/[id]/reservations)
 * 
 * Liste de toutes les réservations pour ce voyage:
 * - Tableau: ref booking, nom client, type chambre, occupancy, montant TTC, statut paiement
 * - Filtres: statut, type chambre
 * - Recherche par nom/email client
 * - Stats bar: total bookings, confirmed, pending, canceled
 * - Bouton export CSV
 * - Click row → ouvre détail réservation
 * 
 * API: GET /api/pro/travels/${id}/reservations
 */

interface Reservation {
  id: string;
  bookingReference: string;
  clientName: string;
  clientEmail: string;
  roomType: string;
  occupancy: number;
  amountTTC: number;
  paymentStatus: 'HOLD' | 'PARTIALLY_PAID' | 'CONFIRMED';
  createdAt: string;
}

interface ReservationStats {
  total: number;
  confirmed: number;
  pending: number;
  canceled: number;
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  HOLD: 'bg-yellow-100 text-yellow-800',
  PARTIALLY_PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  HOLD: 'En attente',
  PARTIALLY_PAID: 'Partiellement payée',
  CONFIRMED: 'Confirmée',
};

const PAYMENT_STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HOLD: Clock,
  PARTIALLY_PAID: Clock,
  CONFIRMED: CheckCircle2,
};

export default function ReservationsPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<ReservationStats>({ total: 0, confirmed: 0, pending: 0, canceled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRoomType, setFilterRoomType] = useState<string | null>(null);

  const roomTypes = [...new Set(reservations.map((r) => r.roomType))];

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterStatus) params.append('status', filterStatus);
        if (filterRoomType) params.append('roomType', filterRoomType);

        const res = await fetch(`/api/pro/travels/${travelId}/reservations?${params.toString()}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Erreur chargement réservations');

        const data = await res.json();
        setReservations(data.reservations || []);
        setStats(data.stats || stats);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchReservations();
    }
  }, [travelId, filterStatus, filterRoomType]);

  const filteredReservations = reservations.filter((r) => {
    if (search) {
      return (
        r.clientName.toLowerCase().includes(search.toLowerCase()) ||
        r.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
        r.bookingReference.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/pro/travels/${travelId}/reservations/export?format=csv`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur export');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservations-${travelId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Réservations</h1>
          <p className="text-slate-600 mt-2">Gestion de toutes les réservations pour ce voyage</p>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={exporting || filteredReservations.length === 0}
          className="gap-2"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Export...' : 'Exporter CSV'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-600 mt-1">Réservations totales</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-sm text-slate-600 mt-1">Confirmées</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <p className="text-sm text-slate-600 mt-1">En attente</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
            <p className="text-sm text-slate-600 mt-1">Annulées</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, email ou référence..."
              className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Statut paiement</label>
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          >
            <option value="">Tous</option>
            <option value="HOLD">En attente</option>
            <option value="PARTIALLY_PAID">Partiellement payée</option>
            <option value="CONFIRMED">Confirmée</option>
          </select>
        </div>

        {roomTypes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type chambre</label>
            <select
              value={filterRoomType || ''}
              onChange={(e) => setFilterRoomType(e.target.value || null)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            >
              <option value="">Tous</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Reservations Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle>Détail des réservations</CardTitle>
          <CardDescription>{filteredReservations.length} résultat(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReservations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Référence</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Client</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Type chambre</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Occupancy</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Montant TTC</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Statut</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => {
                    const StatusIcon = PAYMENT_STATUS_ICONS[res.paymentStatus];
                    return (
                      <tr
                        key={res.id}
                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">{res.bookingReference}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{res.clientName}</p>
                            <p className="text-xs text-slate-500">{res.clientEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{res.roomType}</td>
                        <td className="px-4 py-3 text-slate-600">{res.occupancy} pers.</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{formatPrice(res.amountTTC)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {StatusIcon && <StatusIcon className="w-4 h-4" />}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[res.paymentStatus]}`}>
                              {PAYMENT_STATUS_LABELS[res.paymentStatus]}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(res.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune réservation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
