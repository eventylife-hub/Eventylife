'use client';

import { formatCurrency } from '@/lib/utils';

/**
 * Composant - Affichage du calcul de remboursement
 * Détaille le calcul du remboursement avec montants payés, frais, et remboursement final
 */
interface RefundCalculatorProps {
  paidAmountCents: number;
  refundAmountCents: number;
  cancellationFeeCents: number;
  policyApplied: string;
  daysUntilDeparture?: number;
}

export function RefundCalculator({
  paidAmountCents,
  refundAmountCents,
  cancellationFeeCents,
  policyApplied,
  daysUntilDeparture,
}: RefundCalculatorProps) {
  const refundPercent = Math.round(
    (refundAmountCents / (paidAmountCents - cancellationFeeCents)) * 100
  );

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-green-900 mb-4">
        Calcul de votre Remboursement
      </h2>

      <div className="space-y-3">
        {/* Montant payé */}
        <div className="flex justify-between items-center">
          <span className="text-gray-900">Montant payé:</span>
          <span className="font-bold">{formatCurrency(paidAmountCents)}</span>
        </div>

        {/* Frais d'annulation */}
        {cancellationFeeCents > 0 && (
          <div className="flex justify-between items-center text-red-700">
            <span>Frais d&apos;annulation:</span>
            <span className="font-bold">
              -{formatCurrency(cancellationFeeCents)}
            </span>
          </div>
        )}

        {/* Pourcentage appliqué */}
        {refundPercent > 0 && (
          <div className="flex justify-between items-center text-gray-700">
            <span>Pourcentage appliqué ({policyApplied}):</span>
            <span className="font-bold">{refundPercent}%</span>
          </div>
        )}

        {/* Ligne de séparation */}
        <div className="border-t-2 border-green-200 pt-3" />

        {/* Montant remboursé */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-900">
            Montant remboursé:
          </span>
          <span className="text-2xl font-bold text-green-700">
            {formatCurrency(refundAmountCents)}
          </span>
        </div>
      </div>

      {/* Note informative */}
      <div className="mt-4 p-3 bg-green-100 rounded">
        <p className="text-sm text-green-800">
          <span className="font-medium">Politique appliquée:</span>{' '}
          {policyApplied}
        </p>
        {daysUntilDeparture !== undefined && (
          <p className="text-sm text-green-800 mt-1">
            <span className="font-medium">Jours avant départ:</span>{' '}
            {daysUntilDeparture}
          </p>
        )}
      </div>

      {/* Avertissement si pas de remboursement */}
      {refundAmountCents === 0 && (
        <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded">
          <p className="text-sm text-orange-800">
            Malheureusement, votre demande d&apos;annulation trop proche de la date
            de départ ne vous donne droit à aucun remboursement selon notre
            politique.
          </p>
        </div>
      )}
    </div>
  );
}
