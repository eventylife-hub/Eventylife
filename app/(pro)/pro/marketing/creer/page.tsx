'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { CampaignWizard } from '@/components/marketing/campaign-wizard';

// Interface pour les données de création de campagne
interface CreateCampaignData {
  title: string;
  description: string;
  targetAudience: string;
  budgetCents: number;
  startDate: Date | null;
  endDate: Date | null;
}

// Interface pour la réponse API
interface NewCampaignResponse {
  id: string;
}

/**
 * Page de création d'une campagne marketing
 * Utilise un wizard pour guider la création
 */
export default function CreerCampaignePage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Wizard steps
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleWizardComplete = async (campaignData: CreateCampaignData) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campaignData.title,
          description: campaignData.description,
          targetAudience: campaignData.targetAudience,
          budgetCents: campaignData.budgetCents,
          startDate: campaignData.startDate?.toISOString(),
          endDate: campaignData.endDate?.toISOString(),
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création');
      }

      const newCampaign = (await res.json()) as NewCampaignResponse;
      router.push(`/pro/marketing/${newCampaign.id}`);
    } catch (err: unknown) {
      // Gestion d'erreur typée
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/pro/marketing" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour au marketing
        </Link>

        <h1 className="text-3xl font-bold mb-6">Créer une campagne</h1>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-red-900">Erreur</h2>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <CampaignWizard
          onComplete={handleWizardComplete}
          loading={submitting}
        />
      </div>
    </div>
  );
}
