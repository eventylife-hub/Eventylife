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
 * Page Client - Demander l'annulation d'une réservation
 * Affiche la politique d'annulation, calcule le remboursement, formulaire
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
        const calcData = await calcResponse.json();
        setRefundCalc(calcData.data);
      }

      setError(null);
    } catch (err) {
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
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Réservation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Annuler ma réservation</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Infos réservation */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Votre Réservation</h2>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Voyage:</span> {booking.travel?.title}
          </p>
          <p>
            <span className="font-medium">Départ:</span> {formatDate(booking.travel?.departureDate || '')}
          </p>
          <p>
            <span className="font-medium">Montant payé:</span>{' '}
            <span className="font-bold text-lg">{formatCurrency(booking.totalAmountCents || 0)}</span>
          </p>
        </div>
      </div>

      {/* Politique d'annulation */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Politique d'Annulation</h2>
        <div className="space-y-3 text-sm text-blue-900">
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
        <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">Calcul de votre Remboursement</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-900">Montant payé:</span>
              <span className="font-bold">{formatCurrency(booking.totalAmountCents || 0)}</span>
            </div>
            <div className="flex justify-between items-center text-red-700">
              <span>Frais d'annulation:</span>
              <span className="font-bold">
                -{formatCurrency(refundCalc.cancellationFeeCents || 0)}
              </span>
            </div>
            <div className="border-t-2 border-green-200 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-green-900">Montant remboursé:</span>
              <span className="text-2xl font-bold text-green-700">
                {formatCurrency(refundCalc.refundAmountCents || 0)}
              </span>
            </div>
            <p className="text-sm text-green-800 mt-4">
              Politique appliquée: <span className="font-medium">{refundCalc.policyApplied || 'N/A'}</span>
            </p>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Demander l'Annulation</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Motif d'annulation
          </label>
          <select
            value={reason.split('|')[0] || ''}
            onChange={(e) => {
              const newReason = e.target.value;
              setReason(newReason);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
          >
            <option value="">Sélectionner un motif...</option>
            <option value="raison-personnelle">Raison personnelle</option>
            <option value="probleme-sante">Problème de santé</option>
            <option value="situation-professionnelle">Situation professionnelle</option>
            <option value="autre">Autre</option>
          </select>

          <label className="block text-sm font-medium text-gray-900 mb-2 mt-4">
            Commentaire (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Décrivez les raisons de votre annulation..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            {reason.length}/500 caractères
          </p>
        </div>

        {/* Confirmation */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-3">
            En confirmant, vous acceptez que votre réservation soit annulée et que vous receviez
            un remboursement de <span className="font-bold">{formatCurrency(refundCalc?.refundAmountCents || 0)}</span>.
          </p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="accept"
              required
              className="w-4 h-4 border border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900">
              Je confirme que je veux annuler ma réservation
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting || !reason.trim()}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Demande en cours...' : 'Confirmer l\'annulation'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
          >
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}
