'use client';

import { formatDate } from '@/lib/utils';

/**
 * Composant - Chronologie du cycle de vie du voyage
 * Affiche visuellement les transitions d'état avec timeline et actions disponibles
 */
interface TimelineEvent {
  status: string;
  timestamp: string;
  actor?: string;
  description: string;
}

interface LifecycleTimelineProps {
  currentStatus: string;
  timeline: TimelineEvent[];
  availableActions: Array<{
    action: string;
    label: string;
    description?: string;
    requiresReason?: boolean;
  }>;
  onAction?: (action: string, reason?: string) => Promise<void>;
  isLoading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-900 border-gray-300',
  SUBMITTED: 'bg-blue-100 text-blue-900 border-blue-300',
  APPROVED_P1: 'bg-cyan-100 text-cyan-900 border-cyan-300',
  APPROVED_P2: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  PUBLISHED: 'bg-purple-100 text-purple-900 border-purple-300',
  SALES_OPEN: 'bg-green-100 text-green-900 border-green-300',
  DEPARTURE_CONFIRMED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  IN_PROGRESS: 'bg-orange-100 text-orange-900 border-orange-300',
  COMPLETED: 'bg-teal-100 text-teal-900 border-teal-300',
  CANCELED: 'bg-red-100 text-red-900 border-red-300',
  NO_GO: 'bg-red-200 text-red-950 border-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SUBMITTED: 'Soumis',
  APPROVED_P1: 'Approuvé Phase 1',
  APPROVED_P2: 'Approuvé Phase 2',
  PUBLISHED: 'Publié',
  SALES_OPEN: 'Ventes ouvertes',
  DEPARTURE_CONFIRMED: 'Départ confirmé',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  CANCELED: 'Annulé',
  NO_GO: 'N\'aura pas lieu',
};

export function LifecycleTimeline({
  currentStatus,
  timeline,
  availableActions,
  onAction,
  isLoading = false,
}: LifecycleTimelineProps) {
  const [selectedAction, setSelectedAction] = React.useState<string | null>(null);
  const [actionReason, setActionReason] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleActionSubmit = async (action: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAction?.(action, actionReason);
      setSelectedAction(null);
      setActionReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statut actuel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Statut Actuel</h2>
        <div
          className={`inline-block px-6 py-3 rounded-lg border-2 font-bold ${
            STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-900'
          }`}
        >
          {STATUS_LABELS[currentStatus] || currentStatus}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Historique</h2>
        <div className="space-y-4">
          {timeline.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Aucun historique</p>
          ) : (
            timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                {/* Point de timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      STATUS_COLORS[event.status] || 'bg-gray-200'
                    }`}
                  />
                  {idx < timeline.length - 1 && (
                    <div className="w-1 h-8 bg-gray-300 mt-2" />
                  )}
                </div>

                {/* Contenu */}
                <div className="pb-4">
                  <p className="font-semibold text-gray-900">
                    {STATUS_LABELS[event.status] || event.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(event.timestamp)}
                  </p>
                  {event.actor && (
                    <p className="text-sm text-gray-500">Par: {event.actor}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions disponibles */}
      {availableActions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-3">
            {availableActions.map((action) => (
              <div key={action.action}>
                <button
                  onClick={() => setSelectedAction(action.action)}
                  disabled={isLoading || isSubmitting}
                  className="w-full px-4 py-3 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition disabled:opacity-50"
                >
                  <p className="font-semibold text-blue-900">{action.label}</p>
                  {action.description && (
                    <p className="text-sm text-blue-700 mt-1">
                      {action.description}
                    </p>
                  )}
                </button>

                {/* Formulaire pour action sélectionnée */}
                {selectedAction === action.action && action.requiresReason && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <textarea
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      placeholder="Motif / Raison..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleActionSubmit(action.action)}
                        disabled={isSubmitting || !actionReason.trim()}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'En cours...' : 'Confirmer'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAction(null);
                          setActionReason('');
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-900 rounded font-medium hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Action sans raison */}
                {selectedAction === action.action && !action.requiresReason && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex gap-2">
                    <button
                      onClick={() => handleActionSubmit(action.action)}
                      disabled={isSubmitting}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'En cours...' : 'Confirmer'}
                    </button>
                    <button
                      onClick={() => setSelectedAction(null)}
                      className="px-3 py-2 bg-gray-300 text-gray-900 rounded font-medium hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import * as React from 'react';
