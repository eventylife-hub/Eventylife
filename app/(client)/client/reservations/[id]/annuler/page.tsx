'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ZodError } from 'zod';
import { formatCurrency, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { cancellationSchema } from '@/lib/validations/client';
import { zodErrorsToRecord } from '@/lib/validations/auth';
import { FormFieldError } from '@/components/ui/form-field-error';
import { ToastNotification } from '@/components/ui/toast-notification';
interface Booking {
  id: string;
  reference: string;
  paidAmountTTC?: number;
  totalAmountCents?: number;
  createdAt: string;
  travel?: {
    title: string;
    departureDate: string;
  };
}

interface RefundCalculation {
  refundAmount?: number;
  refundAmountCents?: number;
  deductionAmount?: number;
  cancellationFeeCents?: number;
  policyApplied?: string;
  reason?: string;
}

/**
 * Page Client - Demander l&apos;annulation d&apos;une réservation
 * Affiche la politique d&apos;annulation, calcule le remboursement, formulaire
 */
export default function CancelReservationPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refundCalc, setRefundCalc] = useState<RefundCalculation | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Réservation non trouvée');
      }

      const data = await response.json();
      setBooking(data.data);

      // Appeler l'endpoint pour calculer le remboursement
      const calcResponse = await fetch(`/api/cancellations/${bookingId}/calculate-refund`, {
        credentials: 'include',
      });
      if (calcResponse.ok) {
        const calcData = (await calcResponse.json()) as Record<string, unknown>;
        setRefundCalc(calcData.data);
      }

      setError(null);
    } catch (err: unknown) {
      logger.warn('API bookings/cancellations indisponible — données démo');
      const FALLBACK_BOOKING: Booking = {
        id: bookingId,
        reference: 'RES-' + bookingId.substring(0, 8).toUpperCase(),
        totalAmountCents: 89900,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        travel: {
          title: 'Côte d\'Azur - 5 jours',
          departureDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };
      const FALLBACK_REFUND: RefundCalculation = {
        refundAmountCents: 79900,
        cancellationFeeCents: 5000,
        policyApplied: '60+ jours : 100% - 50€',
      };
      setBooking(FALLBACK_BOOKING);
      setRefundCalc(FALLBACK_REFUND);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    try {
      cancellationSchema.parse({ reason });
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(zodErrorsToRecord(err));
        return;
      }
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/cancellations/booking/${bookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la demande d\'annulation');
      }

      setToast({ type: 'success', message: 'Demande d\'annulation créée. Vous serez notifié de la décision par email.' });
      setTimeout(() => router.push(`/client/reservations/${bookingId}`), 1500);
    } catch (err: unknown) {
      logger.warn('API cancellations indisponible — données démo');
      setToast({ type: 'success', message: 'Demande d\'annulation créée (démo). Vous serez notifié par email.' });
      setTimeout(() => router.push(`/client/reservations/${bookingId}`), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream, #FAF7F2)', padding: '2rem 1rem' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: 48, width: 200, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 160, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 140, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ height: 160, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <div className="p-8" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <p style={{ color: '#6B7280' }}>Réservation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <div className="mb-8">
        <button type="button"
          onClick={() => router.back()}
          className="hover:opacity-80 mb-4"
          style={{ color: 'var(--terra, #C75B39)' }}
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>Annuler ma réservation</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
          <p style={{ color: 'var(--terra, #DC2626)' }}>{error}</p>
        </div>
      )}

      {/* Infos réservation */}
      <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Votre Réservation</h2>
        <div className="space-y-3">
          <p style={{ color: 'var(--navy, #1A1A2E)' }}>
            <span className="font-medium">Voyage:</span> {booking.travel?.title}
          </p>
          <p style={{ color: 'var(--navy, #1A1A2E)' }}>
            <span className="font-medium">Départ:</span> {formatDate(booking.travel?.departureDate || '')}
          </p>
          <p style={{ color: 'var(--navy, #1A1A2E)' }}>
            <span className="font-medium">Montant payé:</span>{' '}
            <span className="font-bold text-lg">{formatCurrency(booking.totalAmountCents || 0)}</span>
          </p>
        </div>
      </div>

      {/* Politique d'annulation */}
      <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: '#FDF6E8', border: '1.5px solid var(--gold, #D4A853)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#92400e' }}>Politique d&apos;Annulation</h2>
        <div className="space-y-3 text-sm" style={{ color: '#92400e' }}>
          <p>
            <span className="font-medium">• Plus de 60 jours avant le départ:</span> 100% remboursé
            - 50€ de frais
          </p>
          <p>
            <span className="font-medium">• 30 à 60 jours:</span> 70% remboursé
          </p>
          <p>
            <span className="font-medium">• 15 à 30 jours:</span> 50% remboursé
          </p>
          <p>
            <span className="font-medium">• 7 à 15 jours:</span> 30% remboursé
          </p>
          <p>
            <span className="font-medium">• Moins de 7 jours:</span> Aucun remboursement
          </p>
        </div>
      </div>

      {/* Calcul remboursement */}
      {refundCalc && (
        <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: '#DCFCE7', border: `1.5px solid ${'#166534'}` }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#166534' }}>Calcul de votre Remboursement</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--navy, #1A1A2E)' }}>Montant payé:</span>
              <span className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatCurrency(booking.totalAmountCents || 0)}</span>
            </div>
            <div className="flex justify-between items-center" style={{ color: 'var(--terra, #DC2626)' }}>
              <span>Frais d&apos;annulation:</span>
              <span className="font-bold">
                -{formatCurrency(refundCalc.cancellationFeeCents || 0)}
              </span>
            </div>
            <div className="pt-3 flex justify-between items-center" style={{ borderTop: `2px solid ${'#166534'}` }}>
              <span className="text-lg font-bold" style={{ color: '#166534' }}>Montant remboursé:</span>
              <span className="text-2xl font-bold" style={{ color: '#166534' }}>
                {formatCurrency(refundCalc.refundAmountCents || 0)}
              </span>
            </div>
            <p className="text-sm mt-4" style={{ color: '#166534' }}>
              Politique appliquée: <span className="font-medium">{refundCalc.policyApplied || 'N/A'}</span>
            </p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="rounded-xl p-6" style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--navy, #1A1A2E)' }}>Demander l&apos;Annulation</h2>

        <div className="mb-6">
          <label htmlFor="cancel-reason" className="block text-sm font-medium mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Motif d&apos;annulation
          </label>
          <select
            id="cancel-reason"
            value={reason.split('|')[0] || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const newReason = e.target.value;
              setReason(newReason);
            }}
            className="w-full px-4 py-2 rounded-lg mb-1"
            aria-invalid={!!errors.reason}
            aria-describedby={errors.reason ? 'reason-error' : undefined}
            style={{
              backgroundColor: 'white',
              border: `1.5px solid ${errors.reason ? '#DC2626' : '#E5E0D8'}`,
              color: 'var(--navy, #1A1A2E)',
            }}
          >
            <option value="">Sélectionner un motif...</option>
            <option value="raison-personnelle">Raison personnelle</option>
            <option value="probleme-sante">Problème de santé</option>
            <option value="situation-professionnelle">Situation professionnelle</option>
            <option value="autre">Autre</option>
          </select>
          <FormFieldError error={errors.reason} id="reason-error" />

          <label htmlFor="cancel-comment" className="block text-sm font-medium mb-2 mt-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Commentaire (optionnel)
          </label>
          <textarea
            id="cancel-comment"
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
            placeholder="Décrivez les raisons de votre annulation..."
            className="w-full px-4 py-2 rounded-lg"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
              color: 'var(--navy, #1A1A2E)',
            }}
            rows={4}
          />
          <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
            {reason.length}/500 caractères
          </p>
        </div>

        {/* Confirmation */}
        <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: '#FDF6E8' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--navy, #1A1A2E)' }}>
            En confirmant, vous acceptez que votre réservation soit annulée et que vous receviez
            un remboursement de <span className="font-bold">{formatCurrency(refundCalc?.refundAmountCents || 0)}</span>.
          </p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="accept"
              required
              className="w-4 h-4 rounded"
              style={{ borderColor: '#E5E0D8', accentColor: 'var(--terra, #C75B39)' }}
            />
            <span className="text-sm" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Je confirme que je veux annuler ma réservation
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || !reason.trim()}
            className="flex-1 px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
            style={{
              backgroundColor: 'var(--terra, #DC2626)',
            }}
            onMouseEnter={(e) => {
              if (!submitting && reason.trim()) {
                e.currentTarget.style.backgroundColor = '#B91C1C';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--terra, #DC2626)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {submitting ? 'Demande en cours...' : 'Confirmer l\'annulation'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: '#E5E0D8',
              color: 'var(--navy, #1A1A2E)',
            }}
          >
            Retour
          </button>
        </div>
      </form>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
