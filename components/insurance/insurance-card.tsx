'use client';

import React from 'react';

import { ShieldCheck, Download } from 'lucide-react';

interface InsuranceCoverage {
  cancellation?: boolean;
  illness?: boolean;
  death?: boolean;
  liability?: boolean;
  baggage?: boolean;
  assistance?: boolean;
}

interface InsuranceOption {
  name: string;
  description: string;
  priceCents: number;
  coverage: InsuranceCoverage;
}

/**
 * Composant Insurance Card
 *
 * Affiche les détails d'une assurance avec:
 * - Option (basique, standard, premium)
 * - Couvertures incluses
 * - Prix
 * - Bouton télécharger certificat
 */
export const InsuranceCard = React.memo(function InsuranceCard({
  option,
  price,
  onSubscribe,
}: {
  option: InsuranceOption | null;
  price?: number;
  onSubscribe?: () => void;
}) {
  if (!option) return null;

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              {option.name}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {option.description}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">{option.priceCents / 100}€</span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {/* Couvertures */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Couvertures incluses:</p>
          <ul className="text-xs space-y-1">
            {option.coverage.cancellation && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Annulation maladie
              </li>
            )}
            {option.coverage.illness && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Couverture maladie
              </li>
            )}
            {option.coverage.death && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Assurance décès
              </li>
            )}
            {option.coverage.liability && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Responsabilité civile
              </li>
            )}
            {option.coverage.baggage && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Protection bagages
              </li>
            )}
            {option.coverage.assistance && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Assistance 24/24
              </li>
            )}
          </ul>
        </div>

        {/* Prix */}
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-600">Prix total</p>
          <p className="text-xl font-bold text-blue-600">
            {(price || option.priceCents) / 100}€
          </p>
        </div>

        {/* Actions */}
        {onSubscribe ? (
          <button
            onClick={onSubscribe}
            className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px] gap-2 flex items-center justify-center rounded-lg"
          >
            Souscrire
          </button>
        ) : (
          <button
            className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] gap-2 flex items-center justify-center"
          >
            <Download className="w-4 h-4" />
            Voir certificat
          </button>
        )}
      </div>
    </div>
  );
});
