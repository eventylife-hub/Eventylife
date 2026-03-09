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

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: '#FEF0EB',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

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
    <div className="min-h-screen p-4" style={{ backgroundColor: C.cream, animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mx-auto max-w-2xl">
        <Link href={`/client/reservations/${bookingId}`} className="text-sm hover:opacity-80 mb-4 inline-block" style={{ color: C.terra }}>
          ← Retour à la réservation
        </Link>

        <h1 className="text-3xl font-bold mb-6" style={{ color: C.navy }}>Mes préférences alimentaires</h1>

        {error && (
          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#FEF2F2', border: `1.5px solid #DC2626` }}>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
              <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: C.forestBg, border: `1.5px solid ${C.forest}` }}>
            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: C.forest }} />
            <p className="text-sm" style={{ color: C.forest }}>
              Préférences sauvegardées avec succès! Redirection en cours...
            </p>
          </div>
        )}

        <Card style={{ border: `1.5px solid ${C.border}`, borderRadius: '20px', backgroundColor: 'white' }}>
          <CardHeader>
            <CardTitle style={{ color: C.navy }}>Configuration de vos préférences</CardTitle>
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
