'use client';

/**
 * ÉTAPE 2: Détails des participants
 * Pour chaque personne dans chaque chambre:
 * - Prénom, nom (requis)
 * - Email, téléphone (requis pour le booker principal)
 * - Sélection point d'arrêt (bus stop)
 * - Assurance optionnelle avec prix
 */


import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { formatPrice } from '@/lib/utils';
import { api } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
interface ParticipantForm {
  roomBookingId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  busStopId?: string;
  insuranceSelected: boolean;
  insuranceAmountPerPersonTTC?: number;
}

interface BusStop {
  id: string;
  name: string;
  location: string;
}

export default function CheckoutStep2Page() {
  const router = useRouter();
  const params = useParams();
  const bookingGroupId = params.id as string;

  const { rooms, setCurrentStep, setParticipants: storeSetParticipants } = useCheckoutStore();

  const [participants, setParticipants] = useState<ParticipantForm[]>([]);
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBusStops, setLoadingBusStops] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser les participants à partir des chambres du store
  useEffect(() => {
    if (rooms.length > 0 && participants.length === 0) {
      const initialParticipants: ParticipantForm[] = [];
      for (const room of rooms) {
        for (let i = 0; i < room.occupancyCount; i++) {
          initialParticipants.push({
            roomBookingId: room.roomTypeId,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            busStopId: undefined,
            insuranceSelected: false,
            insuranceAmountPerPersonTTC: undefined,
          });
        }
      }
      setParticipants(initialParticipants);
    }
  }, [rooms, participants.length]);

  // Charger les arrêts de bus depuis l'API
  useEffect(() => {
    const loadBusStops = async () => {
      try {
        setLoadingBusStops(true);
        const response = await api.get<BusStop[]>(`/checkout/${bookingGroupId}/bus-stops`);

        if (response.success && response.data) {
          setBusStops(response.data);
        } else {
          // Garder les arrêts vides en cas d'erreur, ne pas bloquer le formulaire
          console.warn('Erreur lors du chargement des arrêts:', response.error?.message);
        }
      } catch (err: unknown) {
        // Erreur silencieuse pour ne pas bloquer le flux
        console.warn('Erreur lors du chargement des arrêts:', err);
      } finally {
        setLoadingBusStops(false);
      }
    };

    if (bookingGroupId) {
      loadBusStops();
    }
  }, [bookingGroupId]);

  const handleParticipantChange = (
    participantIndex: number,
    field: keyof ParticipantForm,
    value: string | boolean,
  ) => {
    setParticipants(
      participants.map((p, i) => {
        if (i === participantIndex) {
          return { ...p, [field]: value };
        }
        return p;
      }),
    );
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      setError(null);

      // Valider les participants
      const emptyParticipants = participants.filter((p) => !p.firstName || !p.lastName || !p.email || !p.phone,
      );

      if (emptyParticipants.length > 0) {
        setError('Tous les champs requis doivent être remplis');
        setLoading(false);
        return;
      }

      // Sauvegarder dans le store
      storeSetParticipants(participants);

      // Appeler l'API
      await api.post(`/checkout/${bookingGroupId}/participants`, {
        participants,
      });

      setCurrentStep(3);
      router.push(ROUTES.CHECKOUT.STEP_3);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Regrouper les participants par chambre pour l'affichage
  const participantsByRoom = rooms.map((room) => {
    const roomParticipants = participants.filter((p) => p.roomBookingId === room.roomTypeId,
    );
    return { room, participants: roomParticipants };
  });

  // État vide : pas de chambres sélectionnées
  if (rooms.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--cream, #FAF7F2)',
          padding: '2rem 1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#6B7280', marginBottom: '1rem' }}>
          Aucune chambre sélectionnée
        </p>
        <button type="button"
          onClick={() => router.back()}
          style={{
            backgroundColor: 'var(--terra, #C75B39)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: `0 10px 25px -5px rgba(199, 91, 57, 0.2)`,
          }}
        >
          Retour à la sélection
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--cream, #FAF7F2)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '42rem', margin: '0 auto' }} className="animate-fade-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'var(--navy, #1A1A2E)',
            }}
          >
            Détails des participants
          </h1>
        </div>

        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              backgroundColor: 'var(--terra-soft, #FEF2F2)',
              border: '1.5px solid #E5E0D8',
              borderRadius: '20px',
              padding: '1rem',
              color: 'var(--terra, #C75B39)',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {participantsByRoom.map(({ room, participants: roomParticipants }) => (
            <div key={room.roomTypeId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'var(--navy, #1A1A2E)',
                }}
              >
                {room.label} — {formatPrice(room.priceTotalTTC)}
              </h2>

              {roomParticipants.map((participant, personIndex) => {
                // Trouver l'index global du participant
                const globalIndex = participants.findIndex(
                  (p) =>
                    p.roomBookingId === room.roomTypeId &&
                    participants
                      .filter((pp) => pp.roomBookingId === room.roomTypeId)
                      .indexOf(p) === personIndex,
                );

                return (
                  <div
                    key={`${room.roomTypeId}-${personIndex}`}
                    style={{
                      backgroundColor: 'white',
                      border: '1.5px solid #E5E0D8',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: '600',
                        fontSize: '1.125rem',
                        color: 'var(--navy, #1A1A2E)',
                      }}
                    >
                      {room.label} — Personne {personIndex + 1}
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Prénom"
                        aria-label={`Prénom du participant ${personIndex + 1}`}
                        autoComplete="given-name"
                        value={participant.firstName}
                        onChange={(e) =>
                          handleParticipantChange(globalIndex, 'firstName', (e.target as HTMLInputElement).value)
                        }
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E0D8',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          outlineColor: 'var(--terra, #C75B39)',
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--terra, #C75B39)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = '#E5E0D8';
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Nom"
                        aria-label={`Nom du participant ${personIndex + 1}`}
                        autoComplete="family-name"
                        value={participant.lastName}
                        onChange={(e) =>
                          handleParticipantChange(globalIndex, 'lastName', (e.target as HTMLInputElement).value)
                        }
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E0D8',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          outlineColor: 'var(--terra, #C75B39)',
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--terra, #C75B39)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = '#E5E0D8';
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      <input
                        type="email"
                        placeholder="Email"
                        aria-label={`Email du participant ${personIndex + 1}`}
                        autoComplete="email"
                        value={participant.email}
                        onChange={(e) =>
                          handleParticipantChange(globalIndex, 'email', (e.target as HTMLInputElement).value)
                        }
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E0D8',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          outlineColor: 'var(--terra, #C75B39)',
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--terra, #C75B39)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = '#E5E0D8';
                        }}
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        aria-label={`Téléphone du participant ${personIndex + 1}`}
                        autoComplete="tel"
                        value={participant.phone}
                        onChange={(e) =>
                          handleParticipantChange(globalIndex, 'phone', (e.target as HTMLInputElement).value)
                        }
                        style={{
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E0D8',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          outlineColor: 'var(--terra, #C75B39)',
                        }}
                        onFocus={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = 'var(--terra, #C75B39)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLInputElement).style.borderColor = '#E5E0D8';
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          display: 'block',
                          marginBottom: '0.5rem',
                          color: 'var(--navy, #1A1A2E)',
                        }}
                      >
                        Point d&apos;arrêt
                      </label>
                      <select
                        value={participant.busStopId || ''}
                        onChange={(e) =>
                          handleParticipantChange(globalIndex, 'busStopId', (e.target as HTMLInputElement).value)
                        }
                        style={{
                          width: '100%',
                          backgroundColor: 'white',
                          border: '1.5px solid #E5E0D8',
                          borderRadius: '10px',
                          padding: '0.75rem',
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          cursor: 'pointer',
                          opacity: loadingBusStops ? 0.5 : 1,
                        }}
                        disabled={loadingBusStops}
                        onFocus={(e) => {
                          (e.target as HTMLSelectElement).style.borderColor = 'var(--terra, #C75B39)';
                        }}
                        onBlur={(e) => {
                          (e.target as HTMLSelectElement).style.borderColor = '#E5E0D8';
                        }}
                      >
                        <option value="">
                          {loadingBusStops ? 'Chargement...' : 'Sélectionner un point'}
                        </option>
                        {busStops.map((stop) => (
                          <option key={stop.id} value={stop.id}>
                            {stop.name} ({stop.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id={`insurance-${room.roomTypeId}-${personIndex}`}
                        checked={participant.insuranceSelected}
                        onChange={(e) =>
                          handleParticipantChange(
                            globalIndex,
                            'insuranceSelected',
                            (e.target as HTMLInputElement).checked,
                          )
                        }
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: 'var(--terra, #C75B39)',
                        }}
                      />
                      <label
                        htmlFor={`insurance-${room.roomTypeId}-${personIndex}`}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--navy, #1A1A2E)',
                          cursor: 'pointer',
                        }}
                      >
                        Assurance voyage optionnelle
                        {participant.insuranceAmountPerPersonTTC
                          ? ` (+${formatPrice(participant.insuranceAmountPerPersonTTC)})`
                          : ''}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button"
            onClick={() => router.back()}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              color: 'var(--terra, #C75B39)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontWeight: '600',
              border: '1.5px solid #E5E0D8',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(199,91,57,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Retour
          </button>
          <button type="button"
            onClick={handleContinue}
            disabled={loading}
            style={{
              flex: 1,
              backgroundColor: loading ? '#6B7280' : 'var(--terra, #C75B39)',
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
                (e.target as HTMLButtonElement).style.backgroundColor = '#D97B5E';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--terra, #C75B39)';
              }
            }}
          >
            {loading ? 'Chargement...' : 'Continuer vers le paiement'}
          </button>
        </div>
      </div>
    </div>
  );
}
