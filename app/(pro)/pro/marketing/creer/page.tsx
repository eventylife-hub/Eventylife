'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// shadcn component imports removed - using pro-panel and pro-btn-* classes
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
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '16px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        <Link href="/pro/marketing" style={{ fontSize: '14px', color: '#0077B6', textDecoration: 'none', marginBottom: '16px', display: 'inline-block' }}>
          ← Retour au marketing
        </Link>

        <h1 className="pro-page-title" style={{ marginBottom: '24px' }}>Créer une campagne</h1>

        {error && (
          <div style={{ borderRadius: '8px', border: '1px solid #FFE0E3', backgroundColor: '#FFE0E3', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle className="h-5 w-5" style={{ color: '#E63946', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h2 style={{ fontWeight: 600, color: '#E63946' }}>Erreur</h2>
              <p style={{ fontSize: '14px', color: '#E63946' }}>{error}</p>
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
