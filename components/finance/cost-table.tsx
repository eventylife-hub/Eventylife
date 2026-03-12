'use client';

import { useState } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Cost {
  id: string;
  title: string;
  costAmountHT: number;
  costAmountTTC: number;
  vatRateBps: number;
}

interface CostTableProps {
  travelId: string;
  costs?: Cost[];
  onUpdate: () => void;
}

/**
 * Composant Cost Table
 *
 * Tableau éditable des coûts avec:
 * - Liste coûts avec HT, TVA, TTC
 * - Ajouter/supprimer coûts
 * - Édition inline
 *
 * INVARIANT 3: Tous en centimes Int
 */
export function CostTable({
  travelId,
  costs = [],
  onUpdate,
}: CostTableProps) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    costAmountHT: '',
    vatRateBps: '2000', // 20%
  });

  const handleAddCost = async () => {
    if (!formData.title || !formData.costAmountHT) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // Ajouter un coût
      const res = await fetch(`/api/finance/travel/${travelId}/costs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          costAmountHT: Math.floor(parseFloat(formData.costAmountHT) * 100),
          vatRateBps: parseInt(formData.vatRateBps),
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout du coût. Veuillez réessayer.');

      setFormData({ title: '', costAmountHT: '', vatRateBps: '2000' });
      setAdding(false);
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'ajout du coût.';
      setError(message);
      logger.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    setError(null);

    try {
      // Supprimer un coût
      const res = await fetch(`/api/finance/costs/${costId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression du coût.');
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la suppression.';
      setError(message);
      logger.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="pb-2 font-semibold">Titre</th>
              <th className="pb-2 font-semibold text-right">Montant HT</th>
              <th className="pb-2 font-semibold text-right">TVA</th>
              <th className="pb-2 font-semibold text-right">Montant TTC</th>
              <th className="pb-2 font-semibold w-10"></th>
            </tr>
          </thead>
          <tbody className="space-y-1">
            {costs.map((cost) => (
              <tr key={cost.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{cost.title}</td>
                <td className="py-2 text-right">
                  {(cost.costAmountHT / 100).toFixed(2)}€
                </td>
                <td className="py-2 text-right text-xs text-gray-600">
                  {(cost.vatRateBps / 100).toFixed(1)}%
                </td>
                <td className="py-2 text-right font-semibold">
                  {(cost.costAmountTTC / 100).toFixed(2)}€
                </td>
                <td className="py-2 text-center">
                  <button type="button"
                    onClick={() => handleDeleteCost(cost.id)}
                    className="text-red-600 hover:text-red-700"
                    aria-label="Supprimer le coût"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Formulaire ajout */}
            {adding && (
              <tr className="border-b bg-blue-50">
                <td className="py-2">
                  <input
                    type="text"
                    placeholder="Titre"
                    aria-label="Titre du coût"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, title: (e.target as HTMLInputElement).value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-8"
                  />
                </td>
                <td className="py-2 text-right">
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    aria-label="Montant HT en euros"
                    value={formData.costAmountHT}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        costAmountHT: (e.target as HTMLInputElement).value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-8 text-right"
                  />
                </td>
                <td className="py-2 text-right">20%</td>
                <td className="py-2 text-right font-semibold">
                  {formData.costAmountHT
                    ? (parseFloat(formData.costAmountHT) * 1.2).toFixed(2)
                    : '0.00'}
                  €
                </td>
                <td className="py-2 text-center">
                  <button type="button"
                    onClick={() => {
                      setAdding(false);
                      setFormData({ title: '', costAmountHT: '', vatRateBps: '2000' });
                    }}
                    className="text-gray-400"
                    aria-label="Annuler l'ajout"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        {!adding && (
          <button type="button"
            onClick={() => setAdding(true)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] gap-2 flex items-center"
          >
            <Plus className="w-4 h-4" />
            Ajouter coût
          </button>
        )}
        {adding && (
          <button type="button"
            onClick={handleAddCost}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px] gap-2 flex items-center rounded-lg"
          >
            {isSubmitting ? 'Ajout...' : 'Ajouter'}
          </button>
        )}
      </div>

      {costs.length > 0 && (
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total HT:</span>
            <span className="font-semibold">
              {(
                costs.reduce((sum, c) => sum + c.costAmountHT, 0) / 100
              ).toFixed(2)}
              €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total TTC:</span>
            <span className="font-semibold">
              {(
                costs.reduce((sum, c) => sum + c.costAmountTTC, 0) / 100
              ).toFixed(2)}
              €
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
