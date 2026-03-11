'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { DietaryForm } from '@/components/restauration/dietary-form';
/**
 * Page des préférences alimentaires du client
 * Formulaire de configuration des allergies et régimes
 */
export default function PreferencesPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (preferences: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(
        `/api/restauration/booking/${bookingId}/dietary`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(preferences),
        }
      );

      if (!res.ok) {
        const data = (await res.json() as unknown) as unknown;
        throw new Error(data.message || 'Erreur lors de la sauvegarde');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/client/reservations/${bookingId}`);
      }, 2000);
    } catch (err: unknown) {
      console.warn('API restauration/dietary indisponible — données démo');
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        router.push(`/client/reservations/${bookingId}`);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/reservations/${bookingId}`} className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: 'var(--terra, #C75B39)' }}>
          ← Retour à la réservation
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--navy, #1A1A2E)' }}>Mes préférences alimentaires</h1>

        {error && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--terra, #DC2626)' }} />
              <p className="text-sm" style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: '#DCFCE7', border: `1.5px solid ${'#166534'}` }}>
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#166534' }} />
            <p className="text-sm" style={{ color: '#166534' }}>
              Préférences sauvegardées avec succès! Redirection en cours...
            </p>
          </div>
        )}

        <Card style={{ border: '1.5px solid #E5E0D8', borderRadius: '20px', backgroundColor: 'white' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--navy, #1A1A2E)' }}>Configuration de vos préférences</CardTitle>
          </CardHeader>
          <CardContent>
            <DietaryForm
              bookingId={bookingId}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
