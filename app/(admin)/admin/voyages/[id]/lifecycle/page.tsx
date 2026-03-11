'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
interface Travel {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  timestamp?: string;
  actor?: string;
  reason?: string;
  createdAt?: string;
  actorUser?: {
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Page Admin - Gestion du cycle de vie d'un voyage
 * Timeline visuelle, états et transitions disponibles, historique
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function TravelLifecyclePage() {
  const params = useParams();
  const travelId = params.id as string;

  const [travel, setTravel] = useState<Travel | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [travelId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch travel details
      const travelResponse = await fetch(`/api/travels/${travelId}`, {
        credentials: 'include',
      });
      if (travelResponse.ok) {
        const travelData = (await travelResponse.json() as unknown) as unknown;
        setTravel(travelData.data);
      }

      // Fetch lifecycle history
      const historyResponse = await fetch(`/api/travels/${travelId}/lifecycle-history`, {
        credentials: 'include',
      });
      if (historyResponse.ok) {
        const historyData = (await historyResponse.json() as unknown) as unknown;
        setHistory(historyData.data || []);
      }

      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'admin-badge admin-badge-neutral',
      SUBMITTED: 'admin-badge admin-badge-warning',
      APPROVED_P1: 'admin-badge admin-badge-info',
      APPROVED_P2: 'admin-badge admin-badge-info',
      PUBLISHED: 'admin-badge admin-badge-violet',
      SALES_OPEN: 'admin-badge admin-badge-success',
      DEPARTURE_CONFIRMED: 'admin-badge admin-badge-success',
      IN_PROGRESS: 'admin-badge admin-badge-violet',
      COMPLETED: 'bg-teal-100 text-teal-800',
      CANCELED: 'admin-badge admin-badge-danger',
      NO_GO: 'admin-badge admin-badge-danger',
    };

    return colors[status] || 'admin-badge admin-badge-neutral';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: 'Brouillon',
      SUBMITTED: 'Soumis',
      APPROVED_P1: 'Approuvé Phase 1',
      APPROVED_P2: 'Approuvé Phase 2',
      PUBLISHED: 'Publié',
      SALES_OPEN: 'Réservations ouvertes',
      DEPARTURE_CONFIRMED: 'Départ confirmé',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Complété',
      CANCELED: 'Annulé',
      NO_GO: 'NO_GO',
    };

    return labels[status] || status;
  };

  const getAvailableActions = (status: string) => {
    const actions: Record<string, Array<{ action: string; label: string }>> = {
      DRAFT: [{ action: 'submit', label: 'Soumettre pour approbation' }],
      SUBMITTED: [
        { action: 'approve_p1', label: 'Approuver Phase 1' },
        { action: 'reject_p1', label: 'Rejeter Phase 1' },
      ],
      APPROVED_P1: [{ action: 'publish', label: 'Publier' }],
      APPROVED_P2: [{ action: 'publish', label: 'Publier' }],
      PUBLISHED: [{ action: 'open_booking', label: 'Ouvrir réservations' }],
      SALES_OPEN: [
        { action: 'confirm_departure', label: 'Confirmer départ' },
        { action: 'no_go', label: 'Marquer NO_GO' },
      ],
      DEPARTURE_CONFIRMED: [{ action: 'start', label: 'Démarrer voyage' }],
      IN_PROGRESS: [{ action: 'complete', label: 'Compléter voyage' }],
    };

    return actions[status] || [];
  };

  const handleAction = async (action: string) => {
    if (action === 'reject_p1' || action === 'cancel') {
      if (!cancelReason.trim()) {
        alert('Veuillez entrer un motif');
        return;
      }
    }

    const endpoints: Record<string, string> = {
      submit: `POST /travels/${travelId}/submit`,
      approve_p1: `POST /admin/travels/${travelId}/approve`,
      reject_p1: `POST /admin/travels/${travelId}/reject`,
      approve_p2: `POST /admin/travels/${travelId}/approve-p2`,
      publish: `POST /travels/${travelId}/publish`,
      open_booking: `POST /travels/${travelId}/open-booking`,
      confirm_departure: `POST /travels/${travelId}/confirm-departure`,
      start: `POST /travels/${travelId}/start`,
      complete: `POST /travels/${travelId}/complete`,
      cancel: `POST /admin/travels/${travelId}/cancel`,
      no_go: `POST /admin/travels/${travelId}/no-go`,
    };

    try {
      setProcessing(true);
      const endpoint = endpoints[action] || '';
      const [method, path] = endpoint.split(' ');

      const response = await fetch(path || '', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:
          action === 'reject_p1' || action === 'cancel'
            ? JSON.stringify({ reason: cancelReason })
            : undefined,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la transition');
      }

      alert('Transition effectuée avec succès');
      setSelectedAction(null);
      setCancelReason('');
      await fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Cycle de vie du voyage
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Cycle de vie du voyage
          </h1>
        </div>
        <Link href="/admin/voyages">
          <button className="admin-btn-secondary gap-2 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </Link>
        <div className="admin-panel">
          <div className="admin-panel-body p-8 text-center">
            <p className="text-gray-600">Voyage non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  const availableActions = getAvailableActions(travel.status);

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Cycle de vie du voyage
        </h1>
      </div>

      <div className="admin-fade-in delay-1">
        <Link href="/admin/voyages">
          <button className="admin-btn-secondary gap-2 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </Link>
      </div>

      {error && (
        <div className="admin-fade-in delay-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* État actuel */}
      <div className="admin-panel admin-fade-in delay-3">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">État Actuel</h3>
        </div>
        <div className="admin-panel-body p-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <span className={`px-4 py-2 rounded-full font-medium ${getStatusBadgeColor(travel.status)}`}>
                {getStatusLabel(travel.status)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Titre</p>
              <p className="font-medium text-gray-900">{travel.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="admin-panel admin-fade-in delay-4">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Historique des Transitions</h3>
        </div>
        <div className="admin-panel-body p-6">
          {history.length === 0 ? (
            <p className="text-gray-600">Aucune transition enregistrée</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry: HistoryEntry, index: number) => (
                <div key={entry.id} className="flex gap-4 pb-4 border-l-2 border-blue-300 pl-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5 -ml-[1.5rem]"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.action}</p>
                    <p className="text-sm text-gray-600">{entry.reason || ''}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(entry.createdAt || '')}</p>
                    {entry.actorUser && (
                      <p className="text-xs text-gray-500">
                        Par: {entry.actorUser.firstName} {entry.actorUser.lastName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions disponibles */}
      {availableActions.length > 0 && (
        <div className="admin-panel admin-fade-in delay-5">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title">Actions Disponibles</h3>
          </div>
          <div className="admin-panel-body p-6">
            {selectedAction && (selectedAction === 'reject_p1' || selectedAction === 'cancel') && (
              <div className="mb-6 bg-gray-50 rounded-lg p-4">
                <label className="admin-input-label">
                  Motif
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCancelReason((e.target as HTMLInputElement).value)}
                  className="admin-input"
                  rows={4}
                  placeholder="Entrez le motif..."
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {availableActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => {
                    if (selectedAction === action.action) {
                      handleAction(action.action);
                    } else {
                      setSelectedAction(action.action);
                    }
                  }}
                  disabled={processing}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    selectedAction === action.action
                      ? 'admin-btn-primary'
                      : 'admin-btn-secondary'
                  }`}
                >
                  {selectedAction === action.action && processing && 'Traitement...'}
                  {selectedAction === action.action && !processing && 'Confirmer'}
                  {selectedAction !== action.action && action.label}
                </button>
              ))}
            </div>

            {selectedAction && (
              <button
                onClick={() => {
                  setSelectedAction(null);
                  setCancelReason('');
                }}
                className="mt-4 admin-btn-secondary px-6 py-2"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions admin supplémentaires */}
      {travel.status !== 'CANCELED' && travel.status !== 'NO_GO' && (
        <div className="admin-panel admin-fade-in delay-6 border border-red-200 bg-red-50">
          <div className="admin-panel-header">
            <h3 className="admin-panel-title text-red-900">Actions Admin</h3>
          </div>
          <div className="admin-panel-body p-6">
            <button
              onClick={() => setSelectedAction('cancel')}
              disabled={processing}
              className="admin-btn-destructive gap-2 flex items-center"
            >
              Annuler le voyage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
