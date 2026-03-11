'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Check, X } from 'lucide-react';

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

  const handleEditRoom = (room: Room) => {
    setEditingRoomId(room.id);
    // Extraire le numéro du label (ex: "Room-101" -> "101")
    const number = room.roomLabel.split('-')[1] || '';
    setEditValue(number);
  };

  const handleSaveRoom = async () => {
    if (!editingRoomId) return;

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

      if (!res.ok) throw new Error('Erreur sauvegarde');

      setEditingRoomId(null);
      setEditValue('');
      // Recharger le parent
      window.location.reload();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
          {rooms.map((room: unknown) => (
            <tr key={room.id} className="border-b hover:bg-gray-50">
              <td className="py-2 font-medium">
                {editingRoomId === room.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue((e.target as HTMLInputElement).value)}
                      placeholder="N° chambre"
                      className="h-7 w-24"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveRoom}
                      disabled={isSaving}
                      variant="ghost"
                      className="h-7 px-2"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setEditingRoomId(null)}
                      variant="ghost"
                      className="h-7 px-2"
                      aria-label="Annuler la modification"
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
                  <button
                    onClick={() => handleEditRoom(room)}
                    className="text-blue-600 hover:text-blue-700"
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
  );
}
