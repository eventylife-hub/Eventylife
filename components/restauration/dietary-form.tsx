import React, { useState } from 'react';
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
    <form aria-label="Préférences alimentaires" onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Régime alimentaire */}
      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-gray-700 text-base font-semibold">Régime alimentaire</legend>
        <div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="omnivore" name="diet" value="omnivore" checked={diet === 'omnivore'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="omnivore" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Omnivore
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="vegetarian" name="diet" value="vegetarian" checked={diet === 'vegetarian'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="vegetarian" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Végétarien
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="vegan" name="diet" value="vegan" checked={diet === 'vegan'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="vegan" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Végan
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="halal" name="diet" value="halal" checked={diet === 'halal'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="halal" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Halal
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="kosher" name="diet" value="kosher" checked={diet === 'kosher'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="kosher" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Casher
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="radio" id="glutenFree" name="diet" value="glutenFree" checked={diet === 'glutenFree'} onChange={(e) => setDiet(e.target.value)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="glutenFree" className="block text-sm font-medium text-gray-700 cursor-pointer">
              Sans gluten
            </label>
          </div>
        </div>
      </fieldset>

      {/* Allergies */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 text-base font-semibold">
          Allergies (optionnel)
        </label>
        <div className="space-y-2">
          {allergyOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option.id}
                checked={allergies.includes(option.id)}
                onChange={() => handleAllergyChange(option.id)}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={option.id} className="block text-sm font-medium text-gray-700 cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notes spéciales */}
      <div className="space-y-2">
        <label htmlFor="specialNotes" className="block text-sm font-medium text-gray-700">Notes spéciales (optionnel)</label>
        <textarea
          id="specialNotes"
          value={specialNotes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSpecialNotes(e.target.value)}
          placeholder="Ex: Intolérances, préférences culinaires, etc."
          rows={3}
          disabled={loading}
          className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          'Sauvegarder mes préférences'
        )}
      </button>
    </form>
  );
}
