'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface BusStop {
  city: string;
  publicName?: string;
  postalCode?: string;
  addressLine?: string;
  lat?: number;
  lng?: number;
}

interface TransportStop {
  busStop: BusStop;
}

/**
 * Composant Stop Map
 *
 * Affiche une liste visuelle ordonnée des arrêts de bus
 * Sans dépendance Google Maps (MVP simple)
 */
export function StopMap({ stops }: { stops: TransportStop[] }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {stops.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun arrêt</p>
          ) : (
            <>
              {/* Départ */}
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <div className="w-0.5 h-12 bg-gray-300 mt-1" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Départ</p>
                  <p className="text-xs text-gray-600">
                    {stops[0]?.busStop.city || 'Non spécifié'}
                  </p>
                </div>
              </div>

              {/* Arrêts intermédiaires */}
              {stops.slice(1, -1).map((stop, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <div className="w-0.5 h-12 bg-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {stop.busStop.publicName}
                    </p>
                    <p className="text-xs text-gray-600">{stop.busStop.city}</p>
                  </div>
                </div>
              ))}

              {/* Arrivée */}
              {stops.length > 1 && (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Arrivée</p>
                    <p className="text-xs text-gray-600">
                      {stops[stops.length - 1]?.busStop.city || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
