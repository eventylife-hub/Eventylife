import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Users, MapPin } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    contact: string;
    phone?: string;
    cuisineType?: string;
    capacity?: number;
    address?: string;
    notes?: string;
  };
}

/**
 * Card affichant un restaurant partenaire
 */
export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          {restaurant.cuisineType && (
            <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {restaurant.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>{restaurant.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <a
              href={`mailto:${restaurant.contact}`}
              className="text-blue-600 hover:underline"
            >
              {restaurant.contact}
            </a>
          </div>

          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <a href={`tel:${restaurant.phone}`} className="hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}

          {restaurant.capacity && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span>Capacité: {restaurant.capacity} personnes</span>
            </div>
          )}
        </div>

        {restaurant.notes && (
          <div className="bg-gray-50 rounded p-2 text-xs text-gray-700">
            {restaurant.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
