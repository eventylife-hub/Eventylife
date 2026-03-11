'use client';

import React, { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, Clock, Filter, X } from 'lucide-react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Alertes | Admin Eventy',
  description: 'Gestion des alertes système et notifications critiques',
};

interface Alert {
  id: string;
  level: 'CRITIQUE' | 'WARNING' | 'INFO';
  type: 'EXPIRED_HOLD' | 'PENDING_VALIDATION' | 'FAILED_PAYMENT' | 'LOW_STOCK' | 'SLA_BREACH';
  title: string;
  description: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  assignedTo?: string;
  bookingRef?: string;
}

/**
 * Page Admin Centre Alertes - Centre de gestion des alertes
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminAlertesPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('unresolved');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const alertConfig = {
    CRITIQUE: { 
      label: 'Critique', 
      color: 'bg-red-100 text-red-800 border-red-300',
      bgColor: 'bg-red-50',
      icon: AlertCircle,
      priority: 3
    },
    WARNING: { 
      label: 'Avertissement', 
      color: 'bg-orange-100 text-orange-800 border-orange-300',
      bgColor: 'bg-orange-50',
      icon: AlertTriangle,
      priority: 2
    },
    INFO: { 
      label: 'Information', 
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      bgColor: 'bg-blue-50',
      icon: Info,
      priority: 1
    },
  };

  const typeConfig: Record<string, string> = {
    EXPIRED_HOLD: 'Holds expirés',
    PENDING_VALIDATION: 'Validations en attente',
    FAILED_PAYMENT: 'Paiements échoués',
    LOW_STOCK: 'Stock faible',
    SLA_BREACH: 'Violation SLA',
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (levelFilter !== 'all') params.append('level', levelFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/alerts?${params.toString()}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = (await response.json() as unknown) as unknown;
        setAlerts(data.data || []);
        setUnreadCount(data.data?.filter((a: Alert) => !a.resolved).length || 0);
      }
    } catch (_error: unknown) {
      // Erreur silencieuse — les données se chargent au prochain retry
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [levelFilter, statusFilter]);

  const handleBulkAction = async (action: 'acknowledge' | 'dismiss' | 'assign') => {
    if (selectedAlerts.length === 0) {
      setToastMessage({ type: 'error', message: 'Sélectionnez au moins une alerte' });
      return;
    }

    try {
      for (const alertId of selectedAlerts) {
        let endpoint = '';
        if (action === 'acknowledge') {
          endpoint = `/api/admin/alerts/${alertId}/acknowledge`;
        } else if (action === 'dismiss') {
          endpoint = `/api/admin/alerts/${alertId}/dismiss`;
        }

        await fetch(endpoint, {
          method: 'PATCH',
          credentials: 'include',
        });
      }

      setToastMessage({ type: 'success', message: 'Action effectuée' });
      setSelectedAlerts([]);
      fetchAlerts();
    } catch (_error: unknown) {
      setToastMessage({ type: 'error', message: 'Erreur lors de l\'action' });
    }
  };

  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id: unknown) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const toggleAllAlerts = () => {
    setSelectedAlerts(
      selectedAlerts.length === alerts.length
        ? []
        : alerts.map((a: unknown) => a.id)
    );
  };

  const columns: DataTableColumn<Alert>[] = [
    {
      key: 'level',
      label: 'Niveau',
      render: (value: unknown) => {
        const config = alertConfig[value as keyof typeof alertConfig];
        const Icon = config?.icon || AlertCircle;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className={`px-2 py-1 rounded text-xs font-medium ${config?.color}`}>
              {config?.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown) => <span>{typeConfig[(value as string) || 'UNKNOWN'] || ''}</span>,
    },
    {
      key: 'title',
      label: 'Titre',
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: unknown) => <span className="text-sm text-gray-600 truncate">{value as string}</span>,
    },
    {
      key: 'createdAt',
      label: 'Créé',
      render: (value: unknown) => formatDate(value as string | Date),
    },
    {
      key: 'resolved',
      label: 'Statut',
      render: (value: unknown) => {
        const isResolved = Boolean(value);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isResolved
              ? 'admin-badge admin-badge-success'
              : 'admin-badge admin-badge-warning'
          }`}>
            {isResolved ? 'Résolu' : 'Non résolu'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Alertes</div>
          <h1 className="admin-page-title">Centre des Alertes</h1>
        </div>
      </div>

      {/* KPI Unresolved alerts */}
      <div className="admin-fade-in">
        <div
          className="admin-kpi-card"
          style={{
            borderTop: '3px solid var(--admin-coral)',
            background: 'rgba(230, 57, 70, 0.04)',
          }}
        >
          <div className="admin-kpi-label">Alertes non résolues</div>
          <div className="admin-kpi-value" style={{ color: 'var(--admin-coral)' }}>
            {unreadCount}
          </div>
          <div className="admin-kpi-sub">Demandent votre attention</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres</h3>
        </div>
        <div className="admin-panel-body">
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="admin-kpi-label block mb-2">Niveau</label>
              <select
                value={levelFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLevelFilter((e.target as HTMLInputElement).value)}
                className="admin-input"
                style={{ width: '160px' }}
              >
                <option value="all">Tous les niveaux</option>
                <option value="CRITIQUE">Critique</option>
                <option value="WARNING">Avertissement</option>
                <option value="INFO">Information</option>
              </select>
            </div>

            <div>
              <label className="admin-kpi-label block mb-2">Statut</label>
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatusFilter((e.target as HTMLInputElement).value)}
                className="admin-input"
                style={{ width: '160px' }}
              >
                <option value="all">Toutes les alertes</option>
                <option value="unresolved">Non résolues</option>
                <option value="resolved">Résolues</option>
              </select>
            </div>

            <button
              className="admin-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Filter className="w-4 h-4" />
              Plus de filtres
            </button>
          </div>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedAlerts.length > 0 && (
        <div
          className="admin-alert-bar warning admin-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.08), rgba(255, 193, 7, 0.04))',
            borderColor: 'rgba(255, 193, 7, 0.2)',
          }}
        >
          <span className="font-medium" style={{ color: '#0A1628' }}>
            {selectedAlerts.length} alerte(s) sélectionnée(s)
          </span>
          <div className="alert-action flex gap-2 ml-auto">
            <button
              className="admin-btn-secondary"
              onClick={() => handleBulkAction('acknowledge')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Reconnaître
            </button>
            <button
              className="admin-btn-secondary"
              onClick={() => handleBulkAction('dismiss')}
            >
              <X className="w-4 h-4 mr-2" />
              Ignorer
            </button>
          </div>
        </div>
      )}

      {/* Tableau des alertes */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Alertes</h3>
        </div>
        <div className="admin-panel-body">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <input
              type="checkbox"
              checked={selectedAlerts.length === alerts.length && alerts.length > 0}
              onChange={toggleAllAlerts}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              Sélectionner {alerts.length} alertes
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8" style={{ color: 'var(--admin-text-muted)' }}>
              Chargement...
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--admin-text-muted)' }}>
              Aucune alerte trouvée
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: unknown, idx: number) => {
                const config = alertConfig[alert.level];
                return (
                  <div
                    key={alert.id}
                    className={`admin-fade-in p-4 rounded-lg flex gap-4 cursor-pointer transition`}
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                      background: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={() => toggleAlertSelection(alert.id)}
                      className="w-4 h-4 rounded cursor-pointer mt-1 flex-shrink-0"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-semibold" style={{ color: 'var(--admin-text-primary)' }}>
                            {alert.title}
                          </h4>
                          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-secondary)' }}>
                            {alert.description}
                          </p>
                        </div>
                        <span
                          className="admin-badge-coral text-xs font-medium whitespace-nowrap"
                          style={{
                            background:
                              alert.level === 'CRITIQUE'
                                ? 'var(--admin-coral-soft)'
                                : alert.level === 'WARNING'
                                ? 'var(--admin-warning-bg, #FEF3C7)'
                                : 'var(--admin-ocean-light)',
                            color:
                              alert.level === 'CRITIQUE'
                                ? 'var(--admin-coral)'
                                : alert.level === 'WARNING'
                                ? 'var(--admin-warning)'
                                : 'var(--admin-ocean)',
                          }}
                        >
                          {config?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
                        <span>{typeConfig[alert.type] || alert.type}</span>
                        <span>{formatDate(alert.createdAt)}</span>
                        {alert.resolved && (
                          <span style={{ color: 'var(--admin-success)', fontWeight: '600' }}>
                            Résolu le {formatDate(alert.resolvedAt || '')}
                          </span>
                        )}
                      </div>
                    </div>

                    {!alert.resolved && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          className="admin-btn-secondary"
                          style={{ fontSize: '0.875rem', padding: '6px 12px' }}
                          onClick={() => handleBulkAction('acknowledge')}
                        >
                          Répondre
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast de notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div
            className="admin-alert-bar"
            style={{
              background:
                toastMessage.type === 'success'
                  ? 'var(--admin-mint-soft)'
                  : 'var(--admin-coral-soft)',
              borderColor:
                toastMessage.type === 'success'
                  ? 'var(--admin-mint)'
                  : 'var(--admin-coral)',
              color:
                toastMessage.type === 'success'
                  ? 'var(--admin-success)'
                  : 'var(--admin-coral)',
            }}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 p-1 rounded hover:bg-black/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
