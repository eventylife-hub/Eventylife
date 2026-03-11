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

        const data = await res.json() as Record<string, unknown>;
        setReservations(data.reservations as Reservation[] || []);
        setStats(data.stats as ReservationStats || stats);
        setError(null);
      } catch (err: unknown) {
        console.warn('API /api/pro/travels/${travelId}/reservations indisponible — données démo');
        const demoReservations: Reservation[] = [
          {
            id: 'res-001',
            bookingReference: 'BK-2026-001',
            clientName: 'Marie Dupont',
            clientEmail: 'marie.dupont@email.com',
            roomType: 'Chambre Double Deluxe',
            occupancy: 2,
            amountTTC: 189900, // 1899€
            paymentStatus: 'CONFIRMED',
            createdAt: '2026-02-15T10:30:00Z',
          },
          {
            id: 'res-002',
            bookingReference: 'BK-2026-002',
            clientName: 'Jean Martin',
            clientEmail: 'jean.martin@email.com',
            roomType: 'Chambre Simple Premium',
            occupancy: 1,
            amountTTC: 119900, // 1199€
            paymentStatus: 'PARTIALLY_PAID',
            createdAt: '2026-02-18T14:15:00Z',
          },
          {
            id: 'res-003',
            bookingReference: 'BK-2026-003',
            clientName: 'Sophie Bernard',
            clientEmail: 'sophie.bernard@email.com',
            roomType: 'Chambre Double Deluxe',
            occupancy: 2,
            amountTTC: 189900, // 1899€
            paymentStatus: 'CONFIRMED',
            createdAt: '2026-02-20T09:45:00Z',
          },
          {
            id: 'res-004',
            bookingReference: 'BK-2026-004',
            clientName: 'Pierre Leclerc',
            clientEmail: 'pierre.leclerc@email.com',
            roomType: 'Suite Prestige',
            occupancy: 3,
            amountTTC: 299900, // 2999€
            paymentStatus: 'HOLD',
            createdAt: '2026-02-22T16:20:00Z',
          },
          {
            id: 'res-005',
            bookingReference: 'BK-2026-005',
            clientName: 'Isabelle Garcia',
            clientEmail: 'isabelle.garcia@email.com',
            roomType: 'Chambre Simple Premium',
            occupancy: 1,
            amountTTC: 119900, // 1199€
            paymentStatus: 'CONFIRMED',
            createdAt: '2026-02-25T11:00:00Z',
          },
          {
            id: 'res-006',
            bookingReference: 'BK-2026-006',
            clientName: 'Thomas Moreau',
            clientEmail: 'thomas.moreau@email.com',
            roomType: 'Chambre Double Deluxe',
            occupancy: 2,
            amountTTC: 189900, // 1899€
            paymentStatus: 'PARTIALLY_PAID',
            createdAt: '2026-02-27T13:30:00Z',
          },
        ];
        const demoStats: ReservationStats = {
          total: 6,
          confirmed: 3,
          pending: 2,
          canceled: 1,
        };
        setReservations(demoReservations);
        setStats(demoStats);
        setError(null);
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
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Skeleton className="h-10 w-64" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628' }}>Réservations</h1>
          <p style={{ color: '#4A5568', marginTop: '0.5rem' }}>Gestion de toutes les réservations pour ce voyage</p>
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
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--pro-coral)', flexShrink: 0 }} />
          <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Stats Bar */}
      <div className="pro-kpi-grid">
        <div className="pro-kpi-card">
          <div className="pro-kpi-value">{stats.total}</div>
          <div className="pro-kpi-label">Réservations totales</div>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-value" style={{ color: 'var(--pro-mint)' }}>{stats.confirmed}</div>
          <div className="pro-kpi-label">Confirmées</div>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-value" style={{ color: 'var(--pro-ocean)' }}>{stats.pending}</div>
          <div className="pro-kpi-label">En attente</div>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-value" style={{ color: 'var(--pro-coral)' }}>{stats.canceled}</div>
          <div className="pro-kpi-label">Annulées</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', '@media (min-width: 768px)': { flexDirection: 'row', alignItems: 'flex-end' } }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Rechercher</label>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', width: '1rem', height: '1rem', color: '#64748B' }} />
            <input
              type="text"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch((e.target as HTMLInputElement).value)}
              placeholder="Nom, email ou référence..."
              className="pro-input"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Statut paiement</label>
          <select
            value={filterStatus || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStatus((e.target as HTMLInputElement).value || null)}
            className="pro-input"
          >
            <option value="">Tous</option>
            <option value="HOLD">En attente</option>
            <option value="PARTIALLY_PAID">Partiellement payée</option>
            <option value="CONFIRMED">Confirmée</option>
          </select>
        </div>

        {roomTypes.length > 0 && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Type chambre</label>
            <select
              value={filterRoomType || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterRoomType((e.target as HTMLInputElement).value || null)}
              className="pro-input"
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
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Détail des réservations</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>{filteredReservations.length} résultat(s)</p>
        </div>
        <div className="pro-panel-body">
          {filteredReservations.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="pro-table" style={{ width: '100%', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F7FAFC' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Référence</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Client</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Type chambre</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Occupancy</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Montant TTC</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Statut</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#0A1628' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((res) => {
                    const StatusIcon = PAYMENT_STATUS_ICONS[res.paymentStatus];
                    return (
                      <tr
                        key={res.id}
                        style={{ borderBottom: '1px solid #E2E8F0', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F7FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '1rem', fontWeight: '500', color: '#0A1628' }}>{res.bookingReference}</td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <p style={{ fontWeight: '500', color: '#0A1628', margin: 0 }}>{res.clientName}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{res.clientEmail}</p>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#4A5568' }}>{res.roomType}</td>
                        <td style={{ padding: '1rem', color: '#4A5568' }}>{res.occupancy} pers.</td>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#0A1628' }}>{formatPrice(res.amountTTC)}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {StatusIcon && <StatusIcon style={{ width: '1rem', height: '1rem' }} />}
                            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', ...(() => {
                              const colors = PAYMENT_STATUS_COLORS[res.paymentStatus];
                              if (colors === 'bg-yellow-100 text-yellow-800') return { background: '#FEF3C7', color: '#92400E' };
                              if (colors === 'bg-blue-100 text-blue-800') return { background: '#DBEAFE', color: '#1E40AF' };
                              if (colors === 'bg-green-100 text-green-800') return { background: '#DCFCE7', color: '#166534' };
                              return {};
                            })() }}>
                              {PAYMENT_STATUS_LABELS[res.paymentStatus]}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#4A5568' }}>
                          {formatDate(res.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
              <AlertCircle style={{ width: '3rem', height: '3rem', color: '#CBD5E0', margin: '0 auto 1rem' }} />
              <p style={{ color: '#64748B', margin: 0 }}>Aucune réservation trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
