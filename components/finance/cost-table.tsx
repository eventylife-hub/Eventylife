'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    title: '',
    costAmountHT: '',
    vatRateBps: '2000', // 20%
  });

  const handleAddCost = async () => {
    if (!formData.title || !formData.costAmountHT) return;

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

      if (!res.ok) throw new Error('Erreur ajout coût');

      setFormData({ title: '', costAmountHT: '', vatRateBps: '2000' });
      setAdding(false);
      onUpdate();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleDeleteCost = async (costId: string) => {
    try {
      // Supprimer un coût
      const res = await fetch(`/api/finance/costs/${costId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Erreur suppression');
      onUpdate();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
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
            {costs.map((cost: unknown) => (
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
                  <button
                    onClick={() => handleDeleteCost(cost.id)}
                    className="text-red-600 hover:text-red-700"
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
                  <Input
                    placeholder="Titre"
                    value={formData.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, title: (e.target as HTMLInputElement).value })
                    }
                    className="h-8"
                  />
                </td>
                <td className="py-2 text-right">
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.costAmountHT}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        costAmountHT: (e.target as HTMLInputElement).value,
                      })
                    }
                    className="h-8 text-right"
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
                  <button
                    onClick={() => {
                      setAdding(false);
                      setFormData({ title: '', costAmountHT: '', vatRateBps: '2000' });
                    }}
                    className="text-gray-400"
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
          <Button
            onClick={() => setAdding(true)}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter coût
          </Button>
        )}
        {adding && (
          <Button onClick={handleAddCost} className="gap-2">
            Ajouter
          </Button>
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
