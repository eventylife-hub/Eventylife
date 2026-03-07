'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';

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
        const travelData = await travelResponse.json();
        setTravel(travelData.data);
      }

      // Fetch lifecycle history
      const historyResponse = await fetch(`/api/travels/${travelId}/lifecycle-history`, {
        credentials: 'include',
      });
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistory(historyData.data || []);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SUBMITTED: 'bg-yellow-100 text-yellow-800',
      APPROVED_P1: 'bg-blue-100 text-blue-800',
      APPROVED_P2: 'bg-blue-100 text-blue-800',
      PUBLISHED: 'bg-purple-100 text-purple-800',
      SALES_OPEN: 'bg-green-100 text-green-800',
      DEPARTURE_CONFIRMED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
      COMPLETED: 'bg-teal-100 text-teal-800',
      CANCELED: 'bg-red-100 text-red-800',
      NO_GO: 'bg-red-100 text-red-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
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
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
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

  if (!travel) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Voyage non trouvé</p>
      </div>
    );
  }

  const availableActions = getAvailableActions(travel.status);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cycle de Vie du Voyage</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* État actuel */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">État Actuel</h2>
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

      {/* Timeline */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des Transitions</h2>

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

      {/* Actions disponibles */}
      {availableActions.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Disponibles</h2>

          {selectedAction && (selectedAction === 'reject_p1' || selectedAction === 'cancel') && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Motif
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
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
              className="mt-4 px-6 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
            >
              Annuler
            </button>
          )}
        </div>
      )}

      {/* Actions admin supplémentaires */}
      {travel.status !== 'CANCELED' && travel.status !== 'NO_GO' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-900 mb-4">Actions Admin</h2>
          <button
            onClick={() => setSelectedAction('cancel')}
            disabled={processing}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Annuler le voyage
          </button>
        </div>
      )}
    </div>
  );
}
