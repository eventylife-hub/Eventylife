'use client';

import { useState } from 'react';
import { Pencil, Check, X, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Room {
  id: string;
  roomLabel: string;
  roomType: string;
  occupancyCount: number;
  pricingParts: number;
  paymentStatus: 'SUCCEEDED' | 'PENDING' | 'FAILED';
  isLocked: boolean;
}

interface RoomingTableProps {
  travelId: string;
  rooms?: Room[];
}

/**
 * Composant Rooming Table
 *
 * Tableau des chambres avec:
 * - Chambre, type, occupants, statut paiement
 * - Assign numéro de chambre (édition inline)
 *
 * INVARIANT 1: pricingParts = occupancyCount
 * INVARIANT 5: Verrouillé post-paiement
 */
export function RoomingTable({
  travelId,
  rooms = [],
}: RoomingTableProps) {
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    // Extraire le numéro du label (ex: "Room-101" -> "101")
    const number = room.roomLabel.split('-')[1] || '';
    setEditValue(number);
  };

  const handleSaveRoom = async () => {
    if (!editingRoomId) return;

    setError(null);

    try {
      setIsSaving(true);
      const res = await fetch(
        `/api/rooming/booking/${editingRoomId}/assign`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            roomNumber: editValue,
          }),
        }
      );

      if (!res.ok) throw new Error('Erreur lors de l\'attribution de la chambre. Veuillez réessayer.');

      setEditingRoomId(null);
      setEditValue('');
      // Recharger le parent
      window.location.reload();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la sauvegarde.';
      setError(message);
      logger.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="pb-2 font-semibold">Chambre</th>
            <th className="pb-2 font-semibold">Type</th>
            <th className="pb-2 font-semibold text-center">Occupants</th>
            <th className="pb-2 font-semibold">Statut Paiement</th>
            <th className="pb-2 font-semibold w-12"></th>
          </tr>
        </thead>
        <tbody className="space-y-1">
          {rooms.map((room) => (
            <tr key={room.id} className="border-b hover:bg-gray-50">
              <td className="py-2 font-medium">
                {editingRoomId === room.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue((e.target as HTMLInputElement).value)}
                      placeholder="N° chambre"
                      aria-label="Numéro de chambre"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-7 w-24"
                    />
                    <button type="button"
                      onClick={handleSaveRoom}
                      disabled={isSaving}
                      className="px-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white"
                      aria-label="Enregistrer le numéro de chambre"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button"
                      onClick={() => setEditingRoomId(null)}
                      className="px-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center bg-white"
                      aria-label="Annuler la modification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  room.roomLabel
                )}
              </td>
              <td className="py-2 text-gray-600">{room.roomType}</td>
              <td className="py-2 text-center">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                  {room.occupancyCount}/{room.pricingParts}
                </span>
              </td>
              <td className="py-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    room.paymentStatus === 'SUCCEEDED'
                      ? 'bg-green-100 text-green-700'
                      : room.paymentStatus === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {room.paymentStatus === 'SUCCEEDED'
                    ? 'Payé'
                    : room.paymentStatus === 'PENDING'
                    ? 'En attente'
                    : 'N/A'}
                </span>
              </td>
              <td className="py-2 text-center">
                {!room.isLocked && (
                  <button type="button"
                    onClick={() => handleEditRoom(room)}
                    className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-blue-600 hover:text-blue-700"
                    aria-label={`Modifier la chambre ${room.roomNumber || ''}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
