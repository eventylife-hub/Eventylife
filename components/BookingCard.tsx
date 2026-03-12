'use client';

import React from 'react';

import Link from 'next/link';

interface BookingCardProps {
  id: string;
  travelTitle: string;
  travelSlug: string;
  destinationCity: string;
  departureDate: string;
  returnDate: string;
  totalAmountTTC: number;
  participantCount: number;
  status: string;
  travelCoverImageUrl?: string;
}

const statusLabels: Record<string, string> = {
  CONFIRMED: 'Confirmée',
  HELD: 'En attente',
  PARTIALLY_PAID: 'Partiellement payée',
  DRAFT: 'Brouillon',
  EXPIRED: 'Expirée',
  CANCELED: 'Annulée',
};

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800',
  HELD: 'bg-blue-100 text-blue-800',
  PARTIALLY_PAID: 'bg-yellow-100 text-yellow-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-red-100 text-red-800',
};

export const BookingCard = React.memo(function BookingCard({
  id,
  travelTitle,
  travelSlug,
  destinationCity,
  departureDate,
  returnDate,
  totalAmountTTC,
  participantCount,
  status,
  travelCoverImageUrl,
}: BookingCardProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Link href={`/client/reservations/${id}`} className="group">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          {travelCoverImageUrl && (
            <div className="md:w-1/4 h-32 md:h-auto bg-slate-100 flex-shrink-0">
              <img
                src={travelCoverImageUrl}
                alt={travelTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Contenu */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {travelTitle}
              </h3>
              <p className="text-sm text-slate-600 mb-1">
                📍 {destinationCity}
              </p>
              <p className="text-sm text-slate-600 mb-2">
                📅 {formatDate(departureDate)} - {formatDate(returnDate)}
              </p>
              <p className="text-sm text-slate-600">
                👥 {participantCount} participant{participantCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Infos de droite */}
          <div className="p-6 md:border-l border-t md:border-t-0 border-slate-200 flex flex-col justify-between items-start md:items-end">
            <div className="text-right w-full md:w-auto mb-4 md:mb-0">
              <p className="text-2xl font-bold text-slate-900">
                {formatPrice(totalAmountTTC)}
              </p>
              <p className="text-xs text-slate-600">Total</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[status as keyof typeof statusColors]
              }`}
            >
              {statusLabels[status as keyof typeof statusLabels]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});
