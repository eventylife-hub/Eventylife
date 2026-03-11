'use client';

import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * Composant - Aperçu du rapport de voyage post-voyage
 * Affiche un résumé financier, statistiques, et avis clients avant génération PDF
 */
interface TravelReportPreviewProps {
  travel: {
    id: string;
    title: string;
    departureDate: string;
    returnDate: string;
    destination: string;
  };
  statistics: {
    totalRevenueCents: number;
    totalBookings: number;
    confirmedBookings: number;
    occupancyRate: number;
  };
  feedbacks: {
    totalFeedbacks: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
  };
  onGeneratePDF?: () => void;
  isGenerating?: boolean;
}

export function TravelReportPreview({
  travel,
  statistics,
  feedbacks,
  onGeneratePDF,
  isGenerating = false,
}: TravelReportPreviewProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{travel.title}</h1>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <p>
            <span className="font-medium">Destination:</span> {travel.destination}
          </p>
          <p>
            <span className="font-medium">Départ:</span>{' '}
            {formatDate(travel.departureDate)}
          </p>
          <p>
            <span className="font-medium">Retour:</span>{' '}
            {formatDate(travel.returnDate)}
          </p>
        </div>
      </div>

      {/* Résumé Financier */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Résumé Financier
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Chiffre d&apos;affaires total</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {formatCurrency(statistics.totalRevenueCents)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Bénéfice net (15% commission)</p>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {formatCurrency(
                Math.floor(
                  (statistics.totalRevenueCents * 85) / 100
                )
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Statistiques Participants */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Statistiques Participants
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">
              {statistics.totalBookings}
            </p>
            <p className="text-sm text-gray-600 mt-1">Réservations totales</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-900">
              {statistics.confirmedBookings}
            </p>
            <p className="text-sm text-gray-600 mt-1">Confirmées</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-900">
              {statistics.occupancyRate.toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Taux de remplissage</p>
          </div>
        </div>
      </div>

      {/* Avis Clients */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Avis Clients</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Nombre d&apos;avis reçus</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {feedbacks.totalFeedbacks}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Note moyenne</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-bold text-yellow-500">
                {feedbacks.averageRating}
              </span>
              <span className="text-2xl text-yellow-500">★</span>
            </div>
          </div>
        </div>

        {/* Distribution des notes */}
        {Object.keys(feedbacks.ratingDistribution).length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-4">
              Distribution des notes
            </h3>
            <div className="space-y-2">
              {Object.entries(feedbacks.ratingDistribution)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([rating, count]: [string, any]) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-8 text-center font-medium text-gray-700">
                      {rating}/5
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(count / feedbacks.totalFeedbacks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm text-gray-600">
                      {count} avis
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Bouton d'action */}
      {onGeneratePDF && (
        <div className="bg-blue-50 rounded-lg p-4">
          <button type="button"
            onClick={onGeneratePDF}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Génération en cours...' : '📄 Générer le rapport PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
