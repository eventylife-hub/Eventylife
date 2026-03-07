/**
 * ÉTAPE 2: Détails des participants
 * Pour chaque personne dans chaque chambre:
 * - Prénom, nom (requis)
 * - Email, téléphone (requis pour le booker principal)
 * - Sélection point d'arrêt (bus stop)
 * - Assurance optionnelle avec prix
 */

'use client';

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
      const emptyParticipants = participants.filter(
        (p) => !p.firstName || !p.lastName || !p.email || !p.phone,
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
    const roomParticipants = participants.filter(
      (p) => p.roomBookingId === room.roomTypeId,
    );
    return { room, participants: roomParticipants };
  });

  // État vide : pas de chambres sélectionnées
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Aucune chambre sélectionnée</p>
        <Button onClick={() => router.back()}>Retour à la sélection</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Détails des participants</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {participantsByRoom.map(({ room, participants: roomParticipants }) => (
          <div key={room.roomTypeId} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
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
                  className="border rounded-lg p-6 space-y-4"
                >
                  <h3 className="font-semibold text-lg">
                    {room.label} — Personne {personIndex + 1}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Prénom"
                      value={participant.firstName}
                      onChange={(e) =>
                        handleParticipantChange(globalIndex, 'firstName', e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      value={participant.lastName}
                      onChange={(e) =>
                        handleParticipantChange(globalIndex, 'lastName', e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      value={participant.email}
                      onChange={(e) =>
                        handleParticipantChange(globalIndex, 'email', e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone"
                      value={participant.phone}
                      onChange={(e) =>
                        handleParticipantChange(globalIndex, 'phone', e.target.value)
                      }
                      className="border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Point d&apos;arrêt
                    </label>
                    <select
                      value={participant.busStopId || ''}
                      onChange={(e) =>
                        handleParticipantChange(globalIndex, 'busStopId', e.target.value)
                      }
                      className="border rounded px-3 py-2 w-full"
                      disabled={loadingBusStops}
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

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`insurance-${room.roomTypeId}-${personIndex}`}
                      checked={participant.insuranceSelected}
                      onChange={(e) =>
                        handleParticipantChange(
                          globalIndex,
                          'insuranceSelected',
                          e.target.checked,
                        )
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor={`insurance-${room.roomTypeId}-${personIndex}`}
                      className="text-sm"
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

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
        <Button onClick={handleContinue} disabled={loading} className="flex-1">
          {loading ? 'Chargement...' : 'Continuer vers le paiement'}
        </Button>
      </div>
    </div>
  );
}
