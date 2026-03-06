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
      selections.map((room) => {
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
      const selectedRooms = selections.filter((r) => r.occupancyCount > 0);
      if (selectedRooms.length === 0) {
        setError('Veuillez sélectionner au moins une chambre');
        setLoading(false);
        return;
      }

      // Appeler l'API
      await api.post(`/checkout/${bookingGroupId}/rooms`, {
        rooms: selectedRooms.map((r) => ({
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Sélection des chambres</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          // État Loading : skeleton
          <div className="border rounded-lg p-4 bg-gray-100 animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded mb-4 w-1/4"></div>
            <div className="h-10 bg-gray-300 rounded mb-4"></div>
          </div>
        ) : selections.length === 0 ? (
          // État Empty
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-600 mb-4">Aucune chambre disponible</p>
            <Button
              variant="outline"
              onClick={() => router.back()}
            >
              Retour
            </Button>
          </div>
        ) : (
          // État Data
          selections.map((room) => (
            <div key={room.roomTypeId} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{room.label}</h3>
              <p className="text-gray-600 text-sm mb-4">Capacité: {room.capacity} personne{room.capacity > 1 ? 's' : ''}</p>

              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium">Nombre de personnes:</label>
                <select
                  className="border rounded px-2 py-1"
                  value={room.occupancyCount}
                  onChange={(e) =>
                    handleOccupancyChange(room.roomTypeId, parseInt(e.target.value) || 0)
                  }
                >
                  <option value="0">Pas cette chambre</option>
                  {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} personne{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {room.occupancyCount > 0 && (
                <div className="text-sm text-gray-600">
                  <p>Prix par personne: {(room.perPersonTTC / 100).toFixed(2)} €</p>
                  <p>Total (pour cette chambre): {(room.priceTotalTTC / 100).toFixed(2)} €</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <PriceSummary rooms={selections} />

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
        <Button onClick={handleContinue} disabled={loading} className="flex-1">
          {loading ? 'Chargement...' : 'Continuer'}
        </Button>
      </div>
    </div>
  );
}
