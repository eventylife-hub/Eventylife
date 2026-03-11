'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { StopCard } from '@/components/transport/stop-card';
import { StopMap } from '@/components/transport/stop-map';
import { AlertCircle } from 'lucide-react';
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

        const data = (await res.json() as unknown) as unknown;
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
      } catch (err: unknown) {
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
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
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

  if (!config) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628' }}>Configuration Transport</h1>
          <div className="pro-panel">
            <div className="pro-panel-body" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
              <p style={{ color: '#4A5568', marginBottom: '1rem', margin: 0 }}>Aucune configuration transport</p>
              <button onClick={handleSave} className="pro-btn-sun">Créer configuration</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', margin: 0 }}>Configuration Transport</h1>
        <p style={{ color: '#4A5568', marginTop: '0.5rem', margin: 0 }}>Gérez le mode de transport et les arrêts</p>
      </div>

      {error && (
        <div style={{ padding: '1.5rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'space-between' }}>
          <p style={{ color: 'var(--pro-coral)', margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            Fermer
          </button>
        </div>
      )}

      {/* Mode de transport */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Mode Transport</h3>
          <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>Sélectionnez le mode principal</p>
        </div>
        <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select value={departureMode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartureMode((e.target as HTMLInputElement).value)} className="pro-input">
            <option value="BUS">Bus</option>
            <option value="FLIGHT">Avion</option>
            <option value="MIXED">Mixte (Bus + Avion)</option>
          </select>

          {departureMode.includes('BUS') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                placeholder="Compagnie bus"
                value={busCompany}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusCompany((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Capacité bus"
                value={busCapacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusCapacity((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Prix par personne (€)"
                value={busPriceCents ? (parseInt(busPriceCents) / 100).toFixed(2) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusPriceCents((parseFloat((e.target as HTMLInputElement).value) * 100).toString())}
                className="pro-input"
              />
            </div>
          )}

          {departureMode.includes('FLIGHT') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                placeholder="Compagnie aérienne"
                value={flightCompany}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightCompany((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Prix vol (€)"
                value={flightPriceCents ? (parseInt(flightPriceCents) / 100).toFixed(2) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightPriceCents((parseFloat((e.target as HTMLInputElement).value) * 100).toString())}
                className="pro-input"
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              placeholder="Point de rendez-vous"
              value={meetingPoint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingPoint((e.target as HTMLInputElement).value)}
              className="pro-input"
            />
            <input
              type="time"
              value={meetingTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingTime((e.target as HTMLInputElement).value)}
              className="pro-input"
            />
          </div>

          <button onClick={handleSave} disabled={isSaving} className="pro-btn-sun" style={{ width: '100%', opacity: isSaving ? 0.5 : 1 }}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder configuration'}
          </button>
        </div>
      </div>

      {/* Arrêts */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Arrêts de route</h3>
          <p style={{ fontSize: '0.875rem', color: '#8896A6', margin: 0 }}>{stops.length} arrêt(s) configuré(s)</p>
        </div>
        <div className="pro-panel-body">
          {stops.length === 0 ? (
            <p style={{ color: '#4A5568', textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', margin: 0 }}>Aucun arrêt configuré</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <StopMap stops={stops as unknown as TransportStop[]} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stops.map((stop: unknown) => {
                  const stopType = (stop.type as string) === 'DROPOFF_ARRIVAL' ? 'ARRIVAL' : 'PICKUP_DEPARTURE';
                  return (
                    <StopCard
                      key={(stop.linkId as string) || (stop.id as string)}
                      stop={{
                        type: stopType as 'PICKUP_DEPARTURE' | 'ARRIVAL',
                        busStop: (stop.busStop as unknown) || { id: '', publicName: '', city: '' }
                      } as StopCardData}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
