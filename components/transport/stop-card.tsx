'use client';

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
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-base">{stop.busStop.publicName}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3" />
              {stop.busStop.city}, {stop.busStop.postalCode}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              stop.type === 'PICKUP_DEPARTURE'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {stop.type === 'PICKUP_DEPARTURE' ? 'Départ' : 'Arrivée'}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-2 text-sm">
        <p className="text-gray-600">{stop.busStop.addressLine}</p>
        {stop.busStop.lat && stop.busStop.lng && (
          <p className="text-xs text-gray-500">
            Coordonnées: {stop.busStop.lat.toFixed(4)}, {stop.busStop.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
