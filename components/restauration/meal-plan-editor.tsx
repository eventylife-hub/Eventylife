import React, { useState } from 'react';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { extractErrorMessage } from '@/lib/api-error';

interface MealPlan {
  [key: string]: {
    enabled?: boolean;
    provider?: string;
  };
}

interface MealPlanEditorProps {
  travelId: string;
  initialPlan: MealPlan;
}

/**
 * Éditeur du plan de repas jour par jour
 */
export function MealPlanEditor({
  travelId,
  initialPlan,
}: MealPlanEditorProps) {
  const [plan, setPlan] = useState<MealPlan>(initialPlan || {});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleMealChange = (
    mealType: 'breakfast' | 'lunch' | 'dinner',
    field: string,
    value: string | boolean
  ) => {
    setPlan((prev: MealPlan) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSubmitting(true);
      const res = await fetch(`/api/restauration/${travelId}/meal-plan`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan), credentials: 'include' });

      if (!res.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(extractErrorMessage(err, 'Erreur lors de la sauvegarde'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form aria-label="Éditer le plan repas" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Plan de repas sauvegardé</p>
        </div>
      )}

      {/* Petit-déjeuner */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="breakfast-enabled"
            checked={plan.breakfast?.enabled ?? false}
            onChange={(e) =>
              handleMealChange(
                'breakfast',
                'enabled',
                e.target.checked
              )
            }
            disabled={submitting}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="breakfast-enabled" className="block text-sm font-medium text-gray-700 font-semibold">
            Petit-déjeuner
          </label>
        </div>

        {plan.breakfast?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <label htmlFor="breakfast-provider" className="block text-sm font-medium text-gray-700 text-xs">
                Prestataire
              </label>
              <input
                id="breakfast-provider"
                value={plan.breakfast?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('breakfast', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Déjeuner */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lunch-enabled"
            checked={plan.lunch?.enabled ?? false}
            onChange={(e) =>
              handleMealChange('lunch', 'enabled', e.target.checked)
            }
            disabled={submitting}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="lunch-enabled" className="block text-sm font-medium text-gray-700 font-semibold">
            Déjeuner
          </label>
        </div>

        {plan.lunch?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <label htmlFor="lunch-provider" className="block text-sm font-medium text-gray-700 text-xs">
                Prestataire
              </label>
              <input
                id="lunch-provider"
                value={plan.lunch?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('lunch', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Dîner */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="dinner-enabled"
            checked={plan.dinner?.enabled ?? false}
            onChange={(e) =>
              handleMealChange('dinner', 'enabled', e.target.checked)
            }
            disabled={submitting}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="dinner-enabled" className="block text-sm font-medium text-gray-700 font-semibold">
            Dîner
          </label>
        </div>

        {plan.dinner?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <label htmlFor="dinner-provider" className="block text-sm font-medium text-gray-700 text-xs">
                Prestataire
              </label>
              <input
                id="dinner-provider"
                value={plan.dinner?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('dinner', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <button type="submit" disabled={submitting} className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] bg-blue-600 text-white hover:bg-blue-700">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          'Sauvegarder le plan'
        )}
      </button>
    </form>
  );
}
