'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  X
} from 'lucide-react';

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
        const data = await response.json();
        setAlerts(data.data || []);
        setUnreadCount(data.data?.filter((a: Alert) => !a.resolved).length || 0);
      }
    } catch (_error) {
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
    } catch (_error) {
      setToastMessage({ type: 'error', message: 'Erreur lors de l\'action' });
    }
  };

  const toggleAlertSelection = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  const toggleAllAlerts = () => {
    setSelectedAlerts(
      selectedAlerts.length === alerts.length
        ? []
        : alerts.map((a) => a.id)
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
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isResolved ? 'Résolu' : 'Non résolu'}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec badge de compteur */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centre d&apos;Alertes</h1>
          <p className="text-gray-600 mt-2">
            Gérez les alertes système et les actions requises
          </p>
        </div>
        <div className="bg-red-100 border-2 border-red-200 rounded-full px-6 py-3 text-center">
          <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          <div className="text-xs font-medium text-red-700">Non résolues</div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Niveau</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="CRITIQUE">Critique</SelectItem>
                  <SelectItem value="WARNING">Avertissement</SelectItem>
                  <SelectItem value="INFO">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les alertes</SelectItem>
                  <SelectItem value="unresolved">Non résolues</SelectItem>
                  <SelectItem value="resolved">Résolues</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions en masse */}
      {selectedAlerts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {selectedAlerts.length} alerte(s) sélectionnée(s)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('acknowledge')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Reconnaître
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('dismiss')}
                >
                  <X className="w-4 h-4 mr-2" />
                  Ignorer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des alertes */}
      <Card>
        <CardContent className="p-6">
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
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune alerte trouvée</div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const config = alertConfig[alert.level];
                return (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg flex gap-4 cursor-pointer hover:shadow-md transition ${config?.bgColor} border-gray-200`}
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
                          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${config?.color}`}>
                          {config?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                        <span>{typeConfig[alert.type] || alert.type}</span>
                        <span>{formatDate(alert.createdAt)}</span>
                        {alert.resolved && (
                          <span className="text-green-600 font-medium">
                            Résolu le {formatDate(alert.resolvedAt || '')}
                          </span>
                        )}
                      </div>
                    </div>

                    {!alert.resolved && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBulkAction('acknowledge')}
                        >
                          Répondre
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toast de notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toastMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
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
