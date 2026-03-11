/**
 * Composant résumé des prix
 * Affiche le breakdown complet:
 * - Par chambre: label, occupancy, prix par personne, sous-total
 * - Assurance (si applicable)
 * - Note rounding remainder
 * - Total TTC
 * 
 * Format français: "12,50 €"
 */

'use client';

import { formatPrice } from '@/lib/utils';

interface Room {
  roomTypeId: string;
  label: string;
  occupancyCount: number;
  priceTotalTTC: number;
  perPersonTTC: number;
  roundingRemainder: number;
}

interface PriceSummaryProps {
  rooms: Room[];
}

export function PriceSummary({ rooms }: PriceSummaryProps) {
  const totalTTC = rooms.reduce((sum, room) => sum + room.priceTotalTTC, 0);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Résumé des prix</h3>

      <div className="space-y-3 border-b border-gray-200 pb-4">
        {rooms.map((room) => (
          <div key={room.roomTypeId} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700 font-medium">{room.label}</span>
              <span className="text-gray-900 font-semibold">
                {formatPrice(room.priceTotalTTC)}
              </span>
            </div>

            <div className="text-xs text-gray-500 ml-2 space-y-1">
              <p>
                {room.occupancyCount} personne{room.occupancyCount > 1 ? 's' : ''} ×{' '}
                {formatPrice(room.perPersonTTC)}
              </p>

              {room.roundingRemainder > 0 && (
                <p className="text-orange-600">
                  Arrondi: +{formatPrice(room.roundingRemainder)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-lg font-bold">
        <span className="text-gray-900">Total TTC</span>
        <span className="text-blue-600">{formatPrice(totalTTC)}</span>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Tous les prix incluent la TVA. Hold valable 30 minutes.
      </p>
    </div>
  );
}
