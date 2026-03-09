'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RoomingTable } from '@/components/rooming/rooming-table';
import { Download } from 'lucide-react';
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

        const rooms = await roomRes.json();
        const statsData = await statsRes.json();

        setRoomingList(rooms);
        setStats(statsData);
        setError(null);
      } catch (err) {
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
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Rooming List</h1>
          <p className="text-gray-600 mt-2">Gestion des chambres d&apos;hôtel</p>
        </div>
        <Button onClick={handleExportPDF} disabled={exporting} className="gap-2">
          <Download className="w-4 h-4" />
          {exporting ? 'Export...' : 'Exporter PDF'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => setError(null)}>
              Fermer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Chambres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoomBookings}</div>
              <p className="text-xs text-gray-500">réservées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Occupants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOccupants}</div>
              <p className="text-xs text-gray-500">/{stats.totalCapacity}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Taux occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.occupancyRate as number) || 0}%</div>
              <p className="text-xs text-gray-500">occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice((stats.totalHotelRevenueCents as number) || 0)}
              </div>
              <p className="text-xs text-gray-500">hôtel</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rooming Table */}
      {roomingList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Aucune chambre réservée</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Chambres réservées</CardTitle>
            <CardDescription>Détails et assignation</CardDescription>
          </CardHeader>
          <CardContent>
            <RoomingTable
              travelId={travelId}
              rooms={roomingList as unknown as any[]}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
