'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';

interface BusStop {
  publicName: string;
  city: string;
  postalCode?: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
}

interface StopCardData {
  type: 'PICKUP_DEPARTURE' | 'ARRIVAL';
  busStop: BusStop;
}

/**
 * Composant Stop Card
 *
 * Affiche les détails d'un arrêt de bus
 */
export function StopCard({ stop }: { stop: StopCardData }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{stop.busStop.publicName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3" />
              {stop.busStop.city}, {stop.busStop.postalCode}
            </CardDescription>
          </div>
          <Badge variant={stop.type === 'PICKUP_DEPARTURE' ? 'default' : 'secondary'}>
            {stop.type === 'PICKUP_DEPARTURE' ? 'Départ' : 'Arrivée'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-gray-600">{stop.busStop.addressLine}</p>
        {stop.busStop.lat && stop.busStop.lng && (
          <p className="text-xs text-gray-500">
            Coordonnées: {stop.busStop.lat.toFixed(4)}, {stop.busStop.lng.toFixed(4)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
