'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';

interface CancellationDetail {
  id: string;
  bookingRef: string;
  clientName: string;
  travelTitle: string;
  reason: string;
  requestedRefund: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  refundCalculation?: {
    refundAmountCents: number;
    cancellationFeeCents: number;
    policyApplied: string;
  };
  bookingGroup: {
    createdByUser: {
      firstName: string;
      lastName: string;
      email: string;
    };
    travel: {
      title: string;
      departureDate: string;
      returnDate: string;
    };
  };
  requestedAt: string;
  rejectionReason?: string;
  paidAmountCents: number;
}

/**
 * Page Admin - Détail d'une annulation
 * Info client, calcul remboursement, timeline, actions
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function CancellationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cancellationId = params.id as string;

  const [cancellation, setCancellation] = useState<CancellationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchDetail();
  }, [cancellationId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cancellations/${cancellationId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const data = await response.json();
      setCancellation(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/cancellations/${cancellationId}/process`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ decision: 'APPROVED' }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }

      setToast({ type: 'success', message: 'Annulation approuvée' });
      await fetchDetail();
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setToast({ type: 'error', message: 'Veuillez entrer un motif de refus' });
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/cancellations/${cancellationId}/process`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          decision: 'REJECTED',
          rejectionReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus');
      }

      setToast({ type: 'success', message: 'Annulation refusée' });
      await fetchDetail();
      setShowRejectForm(false);
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessRefund = async () => {
    if (!confirm('Êtes-vous sûr de vouloir traiter le remboursement ?')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`/api/cancellations/${cancellationId}/refund`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du remboursement');
      }

      setToast({ type: 'success', message: 'Remboursement traité avec succès' });
      await fetchDetail();
    } catch (err) {
      setToast({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally {
      setProcessing(false);
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

  if (!cancellation) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Annulation non trouvée</p>
      </div>
    );
  }

  const calc = cancellation.refundCalculation || {
    refundAmountCents: 0,
    cancellationFeeCents: 0,
    policyApplied: 'Unknown',
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Détail de l'Annulation</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`mb-6 p-4 rounded-lg border flex justify-between items-center ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-4 text-sm font-medium hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Infos client */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Client</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Nom:</span>{' '}
              {cancellation.bookingGroup.createdByUser.firstName}{' '}
              {cancellation.bookingGroup.createdByUser.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              {cancellation.bookingGroup.createdByUser.email}
            </p>
          </div>
        </div>

        {/* Infos voyage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Voyage</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Titre:</span> {cancellation.bookingGroup.travel.title}
            </p>
            <p>
              <span className="font-medium">Départ:</span>{' '}
              {formatDate(cancellation.bookingGroup.travel.departureDate)}
            </p>
            <p>
              <span className="font-medium">Retour:</span>{' '}
              {formatDate(cancellation.bookingGroup.travel.returnDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Calcul remboursement */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Calcul du Remboursement</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Montant payé</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(cancellation.paidAmountCents)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Remboursement net</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(calc.refundAmountCents)}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-gray-600">Politique appliquée</p>
            <p className="text-lg font-medium text-gray-900">{calc.policyApplied}</p>
            <p className="text-sm text-gray-600 mt-2">
              Frais d'annulation: {formatPrice(calc.cancellationFeeCents)}
            </p>
          </div>
        </div>
      </div>

      {/* Infos annulation */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Informations</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Statut:</span> {cancellation.status}
          </p>
          <p>
            <span className="font-medium">Demandée:</span> {formatDate(cancellation.requestedAt)}
          </p>
          <p>
            <span className="font-medium">Raison:</span> {cancellation.reason}
          </p>
          {cancellation.rejectionReason && (
            <p>
              <span className="font-medium">Motif refus:</span> {cancellation.rejectionReason}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {cancellation.status === 'PENDING' && (
        <div className="mt-8 space-y-4">
          {!showRejectForm ? (
            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Traitement...' : 'Approuver'}
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={processing}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Refuser
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motif de refus
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                rows={4}
              />
              <div className="flex gap-4">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {processing ? 'Traitement...' : 'Confirmer refus'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  disabled={processing}
                  className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {cancellation.status === 'APPROVED' && (
        <div className="mt-8">
          <button
            onClick={handleProcessRefund}
            disabled={processing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Remboursement en cours...' : 'Exécuter le remboursement'}
          </button>
        </div>
      )}
    </div>
  );
}
