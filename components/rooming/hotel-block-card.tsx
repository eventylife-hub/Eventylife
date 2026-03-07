'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
export function HotelBlockCard({
  block,
  onEdit,
}: {
  block: HotelBlock;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{block.hotelName}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {block.hotelEmail}
            </CardDescription>
          </div>
          <Badge
            variant={
              block.status === 'CONFIRMED'
                ? 'default'
                : block.status === 'EXPIRED'
                ? 'destructive'
                : 'secondary'
            }
          >
            {block.status === 'CONFIRMED'
              ? 'Confirmé'
              : block.status === 'EXPIRED'
              ? 'Expiré'
              : 'Invitation'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
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
          <Button
            onClick={onEdit}
            size="sm"
            variant="outline"
            className="w-full gap-2 text-xs"
          >
            <Pencil className="w-3 h-3" />
            Modifier
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
