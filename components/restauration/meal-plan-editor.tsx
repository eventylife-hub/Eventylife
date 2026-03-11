import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';

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
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <Checkbox
            id="breakfast-enabled"
            checked={plan.breakfast?.enabled ?? false}
            onCheckedChange={(checked) =>
              handleMealChange(
                'breakfast',
                'enabled',
                checked === true
              )
            }
            disabled={submitting}
          />
          <Label htmlFor="breakfast-enabled" className="font-semibold">
            Petit-déjeuner
          </Label>
        </div>

        {plan.breakfast?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <Label htmlFor="breakfast-provider" className="text-xs">
                Prestataire
              </Label>
              <Input
                id="breakfast-provider"
                value={plan.breakfast?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('breakfast', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
              />
            </div>
          </div>
        )}
      </div>

      {/* Déjeuner */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="lunch-enabled"
            checked={plan.lunch?.enabled ?? false}
            onCheckedChange={(checked) =>
              handleMealChange('lunch', 'enabled', checked === true)
            }
            disabled={submitting}
          />
          <Label htmlFor="lunch-enabled" className="font-semibold">
            Déjeuner
          </Label>
        </div>

        {plan.lunch?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <Label htmlFor="lunch-provider" className="text-xs">
                Prestataire
              </Label>
              <Input
                id="lunch-provider"
                value={plan.lunch?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('lunch', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dîner */}
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="dinner-enabled"
            checked={plan.dinner?.enabled ?? false}
            onCheckedChange={(checked) =>
              handleMealChange('dinner', 'enabled', checked === true)
            }
            disabled={submitting}
          />
          <Label htmlFor="dinner-enabled" className="font-semibold">
            Dîner
          </Label>
        </div>

        {plan.dinner?.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <Label htmlFor="dinner-provider" className="text-xs">
                Prestataire
              </Label>
              <Input
                id="dinner-provider"
                value={plan.dinner?.provider || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleMealChange('dinner', 'provider', (e.target as HTMLInputElement).value)
                }
                placeholder="Nom du restaurant..."
                disabled={submitting}
              />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          'Sauvegarder le plan'
        )}
      </Button>
    </form>
  );
}
