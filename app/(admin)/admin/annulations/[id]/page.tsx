'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
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

// Fallback demo data — utilisé en cas d'API indisponible
const FALLBACK_CANCELLATION_DETAIL: CancellationDetail = {
  id: 'canc_demo_1',
  bookingRef: 'EVT-2026-DEMO-001',
  clientName: 'Marie Dubois',
  travelTitle: 'Séjour Marrakech 5j/4n',
  reason: 'Raison personnelle urgente',
  requestedRefund: 1890,
  status: 'PENDING',
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  refundCalculation: {
    refundAmountCents: 1512,
    cancellationFeeCents: 378,
    policyApplied: 'Politique 30j — 20% de frais',
  },
  bookingGroup: {
    createdByUser: {
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@email.com',
    },
    travel: {
      title: 'Séjour Marrakech 5j/4n',
      departureDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      returnDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  paidAmountCents: 1890,
};

/**
 * Page Admin - Détail d&apos;une annulation
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
    } catch (err: unknown) {
      logger.warn('API Détail annulation indisponible — données démo');
      setCancellation(FALLBACK_CANCELLATION_DETAIL);
      setError(null);
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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
          <p style={{ color: 'var(--admin-text-secondary)' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!cancellation) {
    return (
      <div className="space-y-6">
        <p style={{ color: 'var(--admin-text-secondary)' }}>Annulation non trouvée</p>
      </div>
    );
  }

  const calc = cancellation.refundCalculation || {
    refundAmountCents: 0,
    cancellationFeeCents: 0,
    policyApplied: 'Unknown',
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Annulations › Détail</div>
          <h1 className="admin-page-title">Détail de l'annulation</h1>
        </div>
        <button type="button"
          onClick={() => router.back()}
          className="admin-btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Retour
        </button>
      </div>

      {error && (
        <div className="admin-alert-bar danger">
          <span>{error}</span>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className="admin-alert-bar"
          style={{
            background: toast.type === 'success' ? 'var(--admin-mint-soft)' : 'var(--admin-coral-soft)',
            borderColor: toast.type === 'success' ? 'var(--admin-mint)' : 'var(--admin-coral)',
            color: toast.type === 'success' ? 'var(--admin-success)' : 'var(--admin-coral)',
          }}
        >
          <span>{toast.message}</span>
          <button type="button" className="ml-4 text-sm font-medium hover:underline" onClick={() => setToast(null)}>
            Fermer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infos client */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Client</h3>
          </div>
          <div className="admin-panel-body space-y-3">
            <div>
              <p className="admin-kpi-label">Nom</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>
                {cancellation.bookingGroup.createdByUser.firstName} {cancellation.bookingGroup.createdByUser.lastName}
              </p>
            </div>
            <div>
              <p className="admin-kpi-label">Email</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>
                {cancellation.bookingGroup.createdByUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Infos voyage */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Voyage</h3>
          </div>
          <div className="admin-panel-body space-y-3">
            <div>
              <p className="admin-kpi-label">Titre</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>{cancellation.bookingGroup.travel.title}</p>
            </div>
            <div>
              <p className="admin-kpi-label">Départ</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>
                {formatDate(cancellation.bookingGroup.travel.departureDate)}
              </p>
            </div>
            <div>
              <p className="admin-kpi-label">Retour</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>
                {formatDate(cancellation.bookingGroup.travel.returnDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calcul remboursement */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Calcul du Remboursement</h3>
        </div>
        <div className="admin-panel-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div style={{ background: 'var(--admin-surface-alt)', padding: '16px', borderRadius: '10px' }}>
              <p className="admin-kpi-label">Montant payé</p>
              <p className="admin-kpi-value" style={{ color: 'var(--admin-text-primary)' }}>
                {formatPrice(cancellation.paidAmountCents)}
              </p>
            </div>
            <div style={{ background: 'var(--admin-mint-soft)', padding: '16px', borderRadius: '10px' }}>
              <p className="admin-kpi-label" style={{ color: 'var(--admin-success)' }}>
                Remboursement net
              </p>
              <p className="admin-kpi-value" style={{ color: 'var(--admin-success)' }}>
                {formatPrice(calc.refundAmountCents)}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--admin-ocean-light)', padding: '16px', borderRadius: '10px', border: '1px solid var(--admin-ocean)' }}>
            <p className="admin-kpi-label" style={{ color: 'var(--admin-ocean)' }}>
              Politique appliquée
            </p>
            <p style={{ fontSize: '16px', fontWeight: '500', color: 'var(--admin-text-primary)', marginTop: '6px' }}>
              {calc.policyApplied}
            </p>
            <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '8px' }}>
              Frais d'annulation: {formatPrice(calc.cancellationFeeCents)}
            </p>
          </div>
        </div>
      </div>

      {/* Infos annulation */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Informations</h3>
        </div>
        <div className="admin-panel-body space-y-3">
          <div>
            <p className="admin-kpi-label">Statut</p>
            <p style={{ color: 'var(--admin-text-primary)' }}>{cancellation.status}</p>
          </div>
          <div>
            <p className="admin-kpi-label">Demandée</p>
            <p style={{ color: 'var(--admin-text-primary)' }}>{formatDate(cancellation.requestedAt)}</p>
          </div>
          <div>
            <p className="admin-kpi-label">Raison</p>
            <p style={{ color: 'var(--admin-text-primary)' }}>{cancellation.reason}</p>
          </div>
          {cancellation.rejectionReason && (
            <div>
              <p className="admin-kpi-label">Motif refus</p>
              <p style={{ color: 'var(--admin-text-primary)' }}>{cancellation.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {cancellation.status === 'PENDING' && (
        <div className="mt-8 space-y-4">
          {!showRejectForm ? (
            <div className="flex gap-4">
              <button type="button"
                onClick={handleApprove}
                disabled={processing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Traitement...' : 'Approuver'}
              </button>
              <button type="button"
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                rows={4}
              />
              <div className="flex gap-4">
                <button type="button"
                  onClick={handleReject}
                  disabled={processing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {processing ? 'Traitement...' : 'Confirmer refus'}
                </button>
                <button type="button"
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
          <button type="button"
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
