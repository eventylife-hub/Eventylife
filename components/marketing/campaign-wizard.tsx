'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Étape {step} / 3</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
              <Label htmlFor="title">Titre de la campagne *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Promo hiver 2026"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Détails de votre campagne..."
                rows={4}
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Étape 2: Audience & Budget */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Audience cible</Label>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Décrivez votre audience..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetEuros">Budget (€) *</Label>
              <Input
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
              />
            </div>
          </div>
        )}

        {/* Étape 3: Dates */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Vous pourrez modifier la campagne après création tant qu'elle n'est pas lancée.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {step < 3 ? (
            <Button onClick={handleNext} disabled={loading}>
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} variant="default">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la campagne'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
