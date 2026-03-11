'use client';

/**
 * ÉTAPE 1: Sélection des chambres
 * Affiche les types de chambres disponibles
 * Permet de sélectionner l'occupancy pour chaque chambre
 * Calcule les prix par personne en respectant les INVARIANTS
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { api } from '@/lib/api';
import { PriceSummary } from '@/components/checkout/price-summary';
const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: 'var(--terra-soft)',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

interface RoomSelection {
  roomTypeId: string;
  label: string;
  capacity: number;
  priceTotalTTC: number; // en centimes
  occupancyCount: number;
  perPersonTTC: number;
  roundingRemainder: number;
}

export default function CheckoutStep1Page() {
  const router = useRouter();
  const params = useParams();
  const bookingGroupId = params.id as string;

  const { setRooms, setCurrentStep, rooms } = useCheckoutStore();

  const [selections, setSelections] = useState<RoomSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les chambres depuis l'API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<RoomSelection[]>(`/checkout/${bookingGroupId}/available-rooms`);

        if (response.success && response.data) {
          // Initialiser les sélections avec occupancy à 0
          const initialSelections = response.data.map(room => ({
            ...room,
            occupancyCount: 0,
            perPersonTTC: 0,
            roundingRemainder: 0,
          }));
          setSelections(initialSelections);
        } else {
          setError(response.error?.message || 'Erreur lors du chargement des chambres');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement des chambres';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (bookingGroupId) {
      loadRooms();
    }
  }, [bookingGroupId]);

  const handleOccupancyChange = (roomTypeId: string, occupancy: number) => {
    setSelections(
      selections.map((room: unknown) => {
        if (room.roomTypeId === roomTypeId) {
          // Calculer le prix par personne (INVARIANT 2)
          const perPersonTTC = Math.floor(room.priceTotalTTC / occupancy);
          const roundingRemainder = room.priceTotalTTC - perPersonTTC * occupancy;

          return {
            ...room,
            occupancyCount: occupancy,
            perPersonTTC,
            roundingRemainder,
          };
        }
        return room;
      }),
    );
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      setError(null);

      // Valider qu'au moins une chambre est sélectionnée
      const selectedRooms = selections.filter((r: unknown) => r.occupancyCount > 0);
      if (selectedRooms.length === 0) {
        setError('Veuillez sélectionner au moins une chambre');
        setLoading(false);
        return;
      }

      // Appeler l'API
      await api.post(`/checkout/${bookingGroupId}/rooms`, {
        rooms: selectedRooms.map((r: unknown) => ({
          roomTypeId: r.roomTypeId,
          occupancyCount: r.occupancyCount,
        })),
      });

      // Sauvegarder dans le store
      setRooms(selectedRooms);
      setCurrentStep(2);

      // Rediriger vers l'étape 2
      router.push(`/checkout/${bookingGroupId}/step-2`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // INVARIANT 2: priceTotalTTC EST déjà le total chambre
  // totalAmount = somme des priceTotalTTC (PAS × occupancyCount)
  const totalAmount = selections.reduce(
    (sum, room) => sum + room.priceTotalTTC,
    0,
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.cream,
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: C.navy,
              marginBottom: '0.5rem',
            }}
          >
            Sélection des chambres
          </h1>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: `1.5px solid ${C.border}`,
              borderRadius: '20px',
              padding: '1rem',
              color: C.terra,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <div
              style={{
                backgroundColor: 'white',
                border: `1.5px solid ${C.border}`,
                borderRadius: '20px',
                padding: '1.5rem',
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  height: '1.5rem',
                  backgroundColor: C.border,
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  width: '33%',
                }}
              ></div>
              <div
                style={{
                  height: '1rem',
                  backgroundColor: C.border,
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  width: '25%',
                }}
              ></div>
              <div
                style={{
                  height: '2.5rem',
                  backgroundColor: C.border,
                  borderRadius: '8px',
                }}
              ></div>
            </div>
          ) : selections.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                border: `1.5px solid ${C.border}`,
                borderRadius: '20px',
              }}
            >
              <p style={{ color: C.muted, marginBottom: '1rem' }}>
                Aucune chambre disponible
              </p>
              <button
                onClick={() => router.back()}
                style={{
                  backgroundColor: 'transparent',
                  color: C.terra,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: '600',
                  border: `1.5px solid ${C.border}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = C.terraSoft;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                Retour
              </button>
            </div>
          ) : (
            selections.map((room: unknown) => (
              <div
                key={room.roomTypeId}
                style={{
                  backgroundColor: 'white',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: '20px',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem', color: C.navy }}>
                  {room.label}
                </h3>
                <p style={{ color: C.muted, fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Capacité: {room.capacity} personne{room.capacity > 1 ? 's' : ''}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem', color: C.navy }}>
                    Nombre de personnes:
                  </label>
                  <select
                    style={{
                      width: '100%',
                      backgroundColor: 'white',
                      border: `1.5px solid ${C.border}`,
                      borderRadius: '10px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.875rem',
                      color: C.navy,
                      cursor: 'pointer',
                    }}
                    value={room.occupancyCount}
                    onChange={(e) =>
                      handleOccupancyChange(room.roomTypeId, parseInt((e.target as HTMLInputElement).value) || 0)
                    }
                    onFocus={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor = C.terra;
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor = C.border;
                    }}
                  >
                    <option value="0">Pas cette chambre</option>
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n: unknown) => (
                      <option key={n} value={n}>
                        {n} personne{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {room.occupancyCount > 0 && (
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: C.muted,
                      padding: '1rem',
                      backgroundColor: C.goldSoft,
                      borderRadius: '10px',
                      border: `1.5px solid ${C.border}`,
                    }}
                  >
                    <p style={{ marginBottom: '0.5rem' }}>
                      Prix par personne: {(room.perPersonTTC / 100).toFixed(2)} €
                    </p>
                    <p>
                      Total (pour cette chambre): {(room.priceTotalTTC / 100).toFixed(2)} €
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <PriceSummary rooms={selections} />

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: C.terra,
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: `1.5px solid ${C.border}`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = C.terraSoft;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Retour
          </button>
          <button
            onClick={handleContinue}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? C.muted : C.terra,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: `0 10px 25px -5px rgba(199, 91, 57, 0.2)`,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = C.terraLight;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = C.terra;
              }
            }}
          >
            {loading ? 'Chargement...' : 'Continuer'}
          </button>
        </div>
      </div>
    </div>
  );
}
