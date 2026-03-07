'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { StopCard } from '@/components/transport/stop-card';
import { StopMap } from '@/components/transport/stop-map';

interface TransportConfig {
  mode: 'BUS' | 'FLIGHT' | 'MIXED';
  busCompany?: string;
  flightCompany?: string;
}

interface TransportStop {
  id?: string;
  busStop: {
    id: string;
    publicName: string;
    city: string;
  };
  type: 'PICKUP_DEPARTURE' | 'DROPOFF_ARRIVAL';
  linkId?: string;
}

interface StopCardData {
  type: 'PICKUP_DEPARTURE' | 'ARRIVAL';
  busStop: {
    id: string;
    publicName: string;
    city: string;
  };
}

/**
 * Page Transport - Configuration mode de transport
 *
 * Affiche:
 * - Mode (bus/avion/mixte)
 * - Compagnie, capacité, prix
 * - Carte avec arrêts (drag & drop)
 * - Horaires par arrêt
 *
 * États UI:
 * - Loading: Skeleton
 * - Empty: CTA ajouter transport
 * - Error: Toast + retry
 * - Data: Formulaire + tableau arrêts
 */
export default function TransportPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<TransportConfig | null>(null);
  const [stops, setStops] = useState<Record<string, unknown>[]>([]);

  const [departureMode, setDepartureMode] = useState('BUS');
  const [busCompany, setBusCompany] = useState('');
  const [busCapacity, setBusCapacity] = useState('');
  const [busPriceCents, setBusPriceCents] = useState('');
  const [flightCompany, setFlightCompany] = useState('');
  const [flightPriceCents, setFlightPriceCents] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Charger la configuration transport
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/transport/${travelId}/config`, { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur chargement config transport');

        const data = await res.json();
        setConfig(data.travel);
        setStops(data.stops);

        // Remplir les champs
        setDepartureMode(data.travel.departureMode);
        setBusCompany(data.travel.busCompany || '');
        setBusCapacity(data.travel.busCapacity?.toString() || '');
        setBusPriceCents(data.travel.busPriceCents?.toString() || '');
        setFlightCompany(data.travel.flightCompany || '');
        setFlightPriceCents(data.travel.flightPriceCents?.toString() || '');
        setMeetingPoint(data.travel.meetingPoint || '');
        setMeetingTime(data.travel.meetingTime || '');

        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (travelId) {
      fetchConfig();
    }
  }, [travelId]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/transport/${travelId}/config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departureMode,
          busCompany: departureMode.includes('BUS') ? busCompany : null,
          busCapacity: departureMode.includes('BUS') ? parseInt(busCapacity) : null,
          busPriceCents: departureMode.includes('BUS') ? parseInt(busPriceCents) : null,
          flightCompany: departureMode.includes('FLIGHT') ? flightCompany : null,
          flightPriceCents: departureMode.includes('FLIGHT') ? parseInt(flightPriceCents) : null,
          meetingPoint,
          meetingTime,
        }), credentials: 'include' });

      if (!res.ok) throw new Error('Erreur sauvegarde');
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
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

  if (!config) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Configuration Transport</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500 mb-4">Aucune configuration transport</p>
            <Button onClick={handleSave}>Créer configuration</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Configuration Transport</h1>
        <p className="text-gray-600 mt-2">Gérez le mode de transport et les arrêts</p>
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

      {/* Mode de transport */}
      <Card>
        <CardHeader>
          <CardTitle>Mode Transport</CardTitle>
          <CardDescription>Sélectionnez le mode principal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={departureMode} onValueChange={setDepartureMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUS">Bus</SelectItem>
              <SelectItem value="FLIGHT">Avion</SelectItem>
              <SelectItem value="MIXED">Mixte (Bus + Avion)</SelectItem>
            </SelectContent>
          </Select>

          {departureMode.includes('BUS') && (
            <div className="space-y-3">
              <Input
                placeholder="Compagnie bus"
                value={busCompany}
                onChange={(e) => setBusCompany(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Capacité bus"
                value={busCapacity}
                onChange={(e) => setBusCapacity(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Prix par personne (€)"
                value={busPriceCents ? (parseInt(busPriceCents) / 100).toFixed(2) : ''}
                onChange={(e) => setBusPriceCents((parseFloat(e.target.value) * 100).toString())}
              />
            </div>
          )}

          {departureMode.includes('FLIGHT') && (
            <div className="space-y-3">
              <Input
                placeholder="Compagnie aérienne"
                value={flightCompany}
                onChange={(e) => setFlightCompany(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Prix vol (€)"
                value={flightPriceCents ? (parseInt(flightPriceCents) / 100).toFixed(2) : ''}
                onChange={(e) => setFlightPriceCents((parseFloat(e.target.value) * 100).toString())}
              />
            </div>
          )}

          <div className="space-y-3">
            <Input
              placeholder="Point de rendez-vous"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
            />
            <Input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* Arrêts */}
      <Card>
        <CardHeader>
          <CardTitle>Arrêts de route</CardTitle>
          <CardDescription>{stops.length} arrêt(s) configuré(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {stops.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun arrêt configuré</p>
          ) : (
            <div className="space-y-4">
              <StopMap stops={stops as unknown as TransportStop[]} />
              <div className="space-y-2">
                {stops.map((stop) => {
                  const stopType = (stop.type as string) === 'DROPOFF_ARRIVAL' ? 'ARRIVAL' : 'PICKUP_DEPARTURE';
                  return (
                    <StopCard
                      key={(stop.linkId as string) || (stop.id as string)}
                      stop={{
                        type: stopType as 'PICKUP_DEPARTURE' | 'ARRIVAL',
                        busStop: (stop.busStop as any) || { id: '', publicName: '', city: '' }
                      } as StopCardData}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
