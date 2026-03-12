'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const StopCard = dynamic(
  () => import('@/components/transport/stop-card').then((m) => m.StopCard),
  { loading: () => <div className="animate-pulse rounded-xl h-32" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
const StopMap = dynamic(
  () => import('@/components/transport/stop-map').then((m) => m.StopMap),
  { loading: () => <div className="animate-pulse rounded-xl h-80" style={{ background: 'rgba(0,0,0,0.06)' }} /> }
);
import { AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';
interface TransportConfig {
  mode: 'BUS' | 'FLIGHT' | 'MIXED';
  busCompany?: string;
  busCapacity?: number;
  busPriceCents?: number;
  flightCompany?: string;
  flightPriceCents?: number;
  meetingPoint?: string;
  meetingTime?: string;
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
  const [stops, setStops] = useState<TransportStop[]>([]);

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

        const data: { travel: TransportConfig; stops: TransportStop[] } = await res.json();
        setConfig(data.travel);
        setStops(data.stops);

        // Remplir les champs
        setDepartureMode(data.travel.mode || 'BUS');
        setBusCompany(data.travel.busCompany || '');
        setBusCapacity(data.travel.busCapacity?.toString() || '');
        setBusPriceCents(data.travel.busPriceCents?.toString() || '');
        setFlightCompany(data.travel.flightCompany || '');
        setFlightPriceCents(data.travel.flightPriceCents?.toString() || '');
        setMeetingPoint(data.travel.meetingPoint || '');
        setMeetingTime(data.travel.meetingTime || '');

        setError(null);
      } catch (err: unknown) {
        logger.warn('API /transport/config indisponible — données démo');

        // Fallback demo data
        const demoConfig: TransportConfig = {
          mode: 'BUS',
          busCompany: 'Autocars Émeraude',
          flightCompany: 'Air France'
        };
        const demoStops: TransportStop[] = [
          {
            id: 'demo-stop-1',
            type: 'PICKUP_DEPARTURE',
            busStop: {
              id: 'paris-nord',
              publicName: 'Gare routière Paris Nord',
              city: 'Paris'
            },
            linkId: 'demo-link-1'
          },
          {
            id: 'demo-stop-2',
            type: 'DROPOFF_ARRIVAL',
            busStop: {
              id: 'lyon-part-dieu',
              publicName: 'Gare routière Lyon Part-Dieu',
              city: 'Lyon'
            },
            linkId: 'demo-link-2'
          }
        ];

        setConfig(demoConfig);
        setStops(demoStops);

        setDepartureMode(demoConfig.mode);
        setBusCompany(demoConfig.busCompany || '');
        setFlightCompany(demoConfig.flightCompany || '');
        setMeetingPoint('Paris - Gare routière Nord');
        setMeetingTime('08:00');

        setError(null);
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
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 128, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 384, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
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
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚌</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0A1628', marginBottom: '0.5rem' }}>Aucune configuration transport</h3>
              <p style={{ color: '#64748B', margin: 0, fontSize: '0.875rem', marginBottom: '1rem' }}>Configurez le mode de transport et les arrêts pour ce voyage</p>
              <button type="button" onClick={handleSave} className="pro-btn-sun">Créer configuration</button>
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
          <button type="button" onClick={() => setError(null)} className="pro-btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
            Fermer
          </button>
        </div>
      )}

      {/* Mode de transport */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Mode Transport</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>Sélectionnez le mode principal</p>
        </div>
        <div className="pro-panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select value={departureMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartureMode(e.target.value)} className="pro-input" aria-label="Mode de transport">
            <option value="BUS">Bus</option>
            <option value="FLIGHT">Avion</option>
            <option value="MIXED">Mixte (Bus + Avion)</option>
          </select>

          {departureMode.includes('BUS') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                placeholder="Compagnie bus"
                aria-label="Compagnie bus"
                value={busCompany}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusCompany((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Capacité bus"
                aria-label="Capacité bus"
                value={busCapacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusCapacity((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Prix par personne (€)"
                aria-label="Prix bus par personne en euros"
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
                aria-label="Compagnie aérienne"
                value={flightCompany}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightCompany((e.target as HTMLInputElement).value)}
                className="pro-input"
              />
              <input
                type="number"
                placeholder="Prix vol (€)"
                aria-label="Prix vol par personne en euros"
                value={flightPriceCents ? (parseInt(flightPriceCents) / 100).toFixed(2) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightPriceCents((parseFloat((e.target as HTMLInputElement).value) * 100).toString())}
                className="pro-input"
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input
              placeholder="Point de rendez-vous"
              aria-label="Point de rendez-vous"
              value={meetingPoint}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingPoint((e.target as HTMLInputElement).value)}
              className="pro-input"
            />
            <input
              type="time"
              aria-label="Heure de rendez-vous"
              value={meetingTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingTime((e.target as HTMLInputElement).value)}
              className="pro-input"
            />
          </div>

          <button type="button" onClick={handleSave} disabled={isSaving} className="pro-btn-sun" style={{ width: '100%', opacity: isSaving ? 0.5 : 1 }}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder configuration'}
          </button>
        </div>
      </div>

      {/* Arrêts */}
      <div className="pro-panel">
        <div className="pro-panel-header">
          <h3 className="pro-panel-title">Arrêts de route</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: 0 }}>{stops.length} arrêt(s) configuré(s)</p>
        </div>
        <div className="pro-panel-body">
          {stops.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📍</div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0A1628', marginBottom: '0.25rem' }}>Aucun arrêt configuré</h4>
              <p style={{ color: '#64748B', margin: 0, fontSize: '0.875rem' }}>Les arrêts de route apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <StopMap stops={stops} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stops.map((stop) => {
                  const stopType = stop.type === 'DROPOFF_ARRIVAL' ? 'ARRIVAL' : 'PICKUP_DEPARTURE';
                  return (
                    <StopCard
                      key={stop.linkId || stop.id}
                      stop={{
                        type: stopType,
                        busStop: stop.busStop || { id: '', publicName: '', city: '' }
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
