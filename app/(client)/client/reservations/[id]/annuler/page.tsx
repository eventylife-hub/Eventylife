'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
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
  const [refundCalc, setRefundCalc] = useState<RefundCalculation | null>(null);

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
        const calcData = (await calcResponse.json() as unknown) as unknown;
        setRefundCalc(calcData.data);
      }

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert('Veuillez entrer un motif d\'annulation');
      return;
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

      alert('Demande d\'annulation créée. Vous serez notifié de la décision par email.');
      router.push(`/client/reservations/${bookingId}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#E5E0D8', borderTopColor: 'var(--terra, #C75B39)' }}></div>
          <p style={{ color: '#6B7280' }}>Chargement...</p>
        </div>
      </div>
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
        <button
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
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Motif d&apos;annulation
          </label>
          <select
            value={reason.split('|')[0] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newReason = (e.target as HTMLInputElement).value;
              setReason(newReason);
            }}
            className="w-full px-4 py-2 rounded-lg mb-3"
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E5E0D8',
              color: 'var(--navy, #1A1A2E)',
            }}
          >
            <option value="">Sélectionner un motif...</option>
            <option value="raison-personnelle">Raison personnelle</option>
            <option value="probleme-sante">Problème de santé</option>
            <option value="situation-professionnelle">Situation professionnelle</option>
            <option value="autre">Autre</option>
          </select>

          <label className="block text-sm font-medium mb-2 mt-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Commentaire (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason((e.target as HTMLInputElement).value)}
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
    </div>
  );
}
