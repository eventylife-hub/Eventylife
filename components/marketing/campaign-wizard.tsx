'use client';

import React, { useState } from 'react';
import { AlertCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

interface CampaignData {
  title: string;
  description: string;
  targetAudience: string;
  budgetCents: number;
  startDate: Date | null;
  endDate: Date | null;
}

interface CampaignWizardProps {
  onComplete: (data: CampaignData) => void;
  loading?: boolean;
}

/**
 * Wizard de création de campagne marketing
 * Guidage étape par étape
 */
export function CampaignWizard({ onComplete, loading }: CampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAudience: '',
    budgetEuros: '50',
    startDate: '',
    endDate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleNext = () => {
    setError(null);

    // Validation selon l'étape
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Le titre est requis');
        return;
      }
    } else if (step === 2) {
      if (!formData.budgetEuros || parseFloat(formData.budgetEuros) <= 0) {
        setError('Le budget doit être supérieur à 0');
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);

    if (!formData.title.trim()) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    // INVARIANT 3 : euros saisie → centimes Int pour l'API
    const { budgetEuros, ...rest } = formData;
    onComplete({
      ...rest,
      budgetCents: Math.round(parseFloat(budgetEuros) * 100),
      startDate: formData.startDate ? new Date(formData.startDate) : null,
      endDate: formData.endDate ? new Date(formData.endDate) : null,
    });
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold">Étape {step} / 3</h3>
      </div>
      <div className="p-6 space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Étape 1: Infos de base */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de la campagne *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Promo hiver 2026"
                disabled={loading}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détails de votre campagne..."
                rows={4}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Étape 2: Audience & Budget */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Audience cible</label>
              <textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Décrivez votre audience..."
                rows={3}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="budgetEuros" className="block text-sm font-medium text-gray-700">Budget (€) *</label>
              <input
                id="budgetEuros"
                name="budgetEuros"
                type="number"
                value={formData.budgetEuros}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="Ex: 500"
                disabled={loading}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Étape 3: Dates */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Vous pourrez modifier la campagne après création tant qu'elle n'est pas lancée.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-between pt-4 border-t">
          <button type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
            onClick={handleBack}
            disabled={step === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>

          {step < 3 ? (
            <button type="button"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px] rounded-lg flex items-center justify-center gap-2"
              onClick={handleNext}
              disabled={loading}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px] rounded-lg flex items-center justify-center gap-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la campagne'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
