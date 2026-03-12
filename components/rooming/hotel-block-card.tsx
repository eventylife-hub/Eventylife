'use client';

import React from 'react';

import { AlertCircle, Pencil } from 'lucide-react';

interface HotelBlock {
  hotelName: string;
  hotelEmail: string;
  status: 'INVITE_SENT' | 'CONFIRMED' | 'EXPIRED';
  expiresIn?: number;
  roomsConfirmed: number;
  roomsRequested: number;
  pricePerNightTTC?: number;
  checkInDate: string;
  checkOutDate: string;
  notes?: string;
}

/**
 * Composant Hotel Block Card
 *
 * Affiche les détails d'un bloc hôtel avec:
 * - Hôtel, chambres, prix
 * - Statut (INVITE_SENT, CONFIRMED, EXPIRED)
 * - Alerte expiration proche
 */
export const HotelBlockCard = React.memo(function HotelBlockCard({
  block,
  onEdit,
}: {
  block: HotelBlock;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-base">{block.hotelName}</h3>
            <p className="text-sm text-gray-500 text-xs mt-1">
              {block.hotelEmail}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              block.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-800'
                : block.status === 'EXPIRED'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {block.status === 'CONFIRMED'
              ? 'Confirmé'
              : block.status === 'EXPIRED'
              ? 'Expiré'
              : 'Invitation'}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {/* Alerte expiration */}
        {block.expiresIn && block.expiresIn <= 3 && block.expiresIn > 0 && (
          <div className="flex gap-2 bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-yellow-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Expires dans {block.expiresIn} jour(s)</span>
          </div>
        )}

        {/* Détails */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 text-xs">Chambres</p>
            <p className="font-semibold">
              {block.roomsConfirmed}/{block.roomsRequested}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Prix/nuit</p>
            <p className="font-semibold">
              {block.pricePerNightTTC
                ? (block.pricePerNightTTC / 100).toFixed(2)
                : '-'}
              €
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-600 space-y-1">
          <p>
            Arrivée: {new Date(block.checkInDate).toLocaleDateString('fr-FR')}
          </p>
          <p>
            Départ: {new Date(block.checkOutDate).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Notes */}
        {block.notes && (
          <p className="text-xs bg-gray-50 p-2 rounded">{block.notes}</p>
        )}

        {/* Actions */}
        {block.status !== 'CONFIRMED' && (
          <button type="button"
            onClick={onEdit}
            className="w-full px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] gap-2 text-xs flex items-center justify-center"
          >
            <Pencil className="w-3 h-3" />
            Modifier
          </button>
        )}
      </div>
    </div>
  );
});
