import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, AlertCircle } from 'lucide-react';

interface DietaryFormProps {
  bookingId: string;
  onSubmit: (preferences: Record<string, unknown>) => void;
  loading?: boolean;
}

/**
 * Formulaire de préférences alimentaires
 */
export function DietaryForm({
  bookingId,
  onSubmit,
  loading,
}: DietaryFormProps) {
  const [diet, setDiet] = useState('omnivore');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const allergyOptions = [
    { id: 'peanut', label: 'Cacahuètes' },
    { id: 'shellfish', label: 'Fruits de mer' },
    { id: 'dairy', label: 'Produits laitiers' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'nuts', label: 'Fruits à coque' },
    { id: 'soy', label: 'Soja' },
  ];

  const handleAllergyChange = (allergyId: string) => {
    setAllergies((prev) =>
      prev.includes(allergyId)
        ? prev.filter((a) => a !== allergyId)
        : [...prev, allergyId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!diet) {
      setError('Veuillez sélectionner un régime alimentaire');
      return;
    }

    onSubmit({
      diet,
      allergies,
      specialNotes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Régime alimentaire */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Régime alimentaire</Label>
        <RadioGroup value={diet} onValueChange={setDiet}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="omnivore" id="omnivore" />
            <Label htmlFor="omnivore" className="cursor-pointer">
              Omnivore
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegetarian" id="vegetarian" />
            <Label htmlFor="vegetarian" className="cursor-pointer">
              Végétarien
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegan" id="vegan" />
            <Label htmlFor="vegan" className="cursor-pointer">
              Végan
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="halal" id="halal" />
            <Label htmlFor="halal" className="cursor-pointer">
              Halal
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="kosher" id="kosher" />
            <Label htmlFor="kosher" className="cursor-pointer">
              Casher
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="glutenFree" id="glutenFree" />
            <Label htmlFor="glutenFree" className="cursor-pointer">
              Sans gluten
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Allergies (optionnel)
        </Label>
        <div className="space-y-2">
          {allergyOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={option.id}
                checked={allergies.includes(option.id)}
                onCheckedChange={() => handleAllergyChange(option.id)}
                disabled={loading}
              />
              <Label htmlFor={option.id} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Notes spéciales */}
      <div className="space-y-2">
        <Label htmlFor="specialNotes">Notes spéciales (optionnel)</Label>
        <Textarea
          id="specialNotes"
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="Ex: Intolérances, préférences culinaires, etc."
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          'Sauvegarder mes préférences'
        )}
      </Button>
    </form>
  );
}
