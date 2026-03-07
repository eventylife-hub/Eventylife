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
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la sauvegarde');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/client/reservations/${bookingId}`);
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/reservations/${bookingId}`} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Retour à la réservation
        </Link>

        <h1 className="text-3xl font-bold mb-6">Mes préférences alimentaires</h1>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              Préférences sauvegardées avec succès! Redirection en cours...
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configuration de vos préférences</CardTitle>
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
