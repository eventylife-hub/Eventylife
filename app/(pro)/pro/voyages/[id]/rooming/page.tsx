'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { RoomingTable } from '@/components/rooming/rooming-table';
import { Download, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface RoomingStats {
  totalRooms?: number;
  occupiedRooms?: number;
  occupancyRate?: number;
  totalRoomBookings?: number;
  totalOccupants?: number;
  totalCapacity?: number;
  totalHotelRevenueCents?: number;
}

interface PageRoom {
  id: string;
  roomLabel?: string;
  roomType?: string;
  occupancyCount?: number;
  occupants?: string[];
  roomNumber?: string;
  pricingParts?: number;
  paymentStatus?: 'SUCCEEDED' | 'PENDING' | 'FAILED';
  isLocked?: boolean;
  [key: string]: unknown;
}

/**
 * Page Rooming List - Gestion des chambres d&apos;hôtel
 *
 * Affiche:
 * - Tableau: chambre, type, occupants, statut paiement
 * - Assign numéro de chambre (drag & drop ou input)
 * - Stats: taux occupation, chambres dispo
 * - Export PDF pour l&apos;hôtel
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA créer hôtel
 * - Error: Toast
 * - Data: Tableau + stats
 */
export default function RoomingPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomingList, setRoomingList] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<RoomingStats | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchRooming = async () => {
      try {
        setLoading(true);
        const [roomRes, statsRes] = await Promise.all([
          fetch(`/api/rooming/${travelId}`, { credentials: 'include' }),
          fetch(`/api/rooming/${travelId}/stats`, { credentials: 'include' }),
        ]);

        if (!roomRes.ok || !statsRes.ok) {
          throw new Error('Erreur chargement rooming');
        }

        const rooms = (await roomRes.json() as unknown) as unknown;
        const statsData = (await statsRes.json() as unknown) as unknown;

        setRoomingList(rooms);
        setStats(statsData);
        setError(null);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchRooming();
    }
  }, [travelId]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const res = await fetch(`/api/rooming/${travelId}/pdf`, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur export PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rooming-${travelId}.pdf`;
      a.click();
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
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>Rooming List</h1>
          <p style={{ color: '#4A5568', marginTop: '0.5rem', margin: 0 }}>Gestion des chambres d&apos;hôtel</p>
        </div>
        <button onClick={handleExportPDF} disabled={exporting} className="pro-btn-ocean" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: exporting ? 0.5 : 1 }}>
          <Download style={{ width: '1rem', height: '1rem' }} />
          {exporting ? 'Export...' : 'Exporter PDF'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--pro-coral)', flexShrink: 0 }} />
            <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
          </div>
          <button onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            Fermer
          </button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="pro-kpi-grid">
          <div className="pro-kpi-card">
            <div className="pro-kpi-value">{stats.totalRoomBookings}</div>
            <div className="pro-kpi-label">Chambres réservées</div>
          </div>

          <div className="pro-kpi-card">
            <div className="pro-kpi-value">{stats.totalOccupants}/{stats.totalCapacity}</div>
            <div className="pro-kpi-label">Occupants</div>
          </div>

          <div className="pro-kpi-card">
            <div className="pro-kpi-value" style={{ color: 'var(--pro-mint)' }}>{(stats.occupancyRate as number) || 0}%</div>
            <div className="pro-kpi-label">Taux occupancy</div>
          </div>

          <div className="pro-kpi-card">
            <div className="pro-kpi-value" style={{ color: 'var(--pro-sun)' }}>
              {formatPrice((stats.totalHotelRevenueCents as number) || 0)}
            </div>
            <div className="pro-kpi-label">Revenue hôtel</div>
          </div>
        </div>
      )}

      {/* Rooming Table */}
      {roomingList.length === 0 ? (
        <div className="pro-panel">
          <div className="pro-panel-body" style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
            <p style={{ color: '#4A5568', margin: 0 }}>Aucune chambre réservée</p>
          </div>
        </div>
      ) : (
        <div className="pro-panel">
          <div className="pro-panel-header">
            <h3 className="pro-panel-title">Chambres réservées</h3>
            <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>Détails et assignation</p>
          </div>
          <div className="pro-panel-body">
            <RoomingTable
              travelId={travelId}
              rooms={roomingList as unknown as unknown[]}
            />
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
