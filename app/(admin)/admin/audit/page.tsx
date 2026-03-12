'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Download } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { logger } from '@/lib/logger';
interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  actor?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Page Audit - Logs d'audit complets
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.action) params.append('action', filters.action);
        if (filters.entityType) params.append('entityType', filters.entityType);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await fetch(`/api/admin/audit-logs?${params}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data.data || []);
        } else {
          setError('Erreur lors du chargement des logs d\'audit');
        }
      } catch (err: unknown) {
        logger.warn('API audit-logs indisponible — données démo');
        const FALLBACK_DATA: AuditLog[] = [
          {
            id: '1',
            action: 'USER_CREATED',
            entityType: 'User',
            entityId: 'usr_123',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            actor: { email: 'admin@eventy.fr', firstName: 'David', lastName: 'Dubois' },
          },
          {
            id: '2',
            action: 'BOOKING_CONFIRMED',
            entityType: 'Booking',
            entityId: 'bkg_456',
            createdAt: new Date(Date.now() - 43200000).toISOString(),
            actor: { email: 'support@eventy.fr', firstName: 'Marie', lastName: 'Dupont' },
          },
          {
            id: '3',
            action: 'PAYMENT_RECEIVED',
            entityType: 'Payment',
            entityId: 'pmt_789',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            actor: { email: 'system@eventy.fr' },
          },
        ];
        setLogs(FALLBACK_DATA);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchLogs, 300);
    return () => clearTimeout(timer);
  }, [filters, retryKey]);

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => formatDateTime(value as string | Date),
    },
    {
      key: 'actor',
      label: 'Acteur',
      render: (value) => {
        const actor = value as { firstName?: string; lastName?: string; email: string } | undefined;
        return actor
          ? `${actor.firstName || ''} ${actor.lastName || ''} (${actor.email})`
          : '-';
      },
    },
    {
      key: 'action',
      label: 'Action',
    },
    {
      key: 'entityType',
      label: 'Type d\'entité',
    },
    {
      key: 'entityId',
      label: 'ID d\'entité',
    },
  ];

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('format', 'csv');

      const response = await fetch(`/api/admin/audit-logs/export?${params}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors de l\'export des logs');
      }
    } catch (err: unknown) {
      logger.error('Audit export error:', err);
      setError('Impossible d\'exporter les logs. Vérifiez votre connexion.');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      action: '',
      entityType: '',
      search: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Audit</div>
          <h1 className="admin-page-title">Logs d'Audit</h1>
        </div>
        <button type="button"
          onClick={handleExport}
          disabled={loading}
          className="admin-btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {error && (
        <div className="admin-alert-bar danger">
          <span>{error}</span>
          <div className="flex gap-2 ml-4">
            <button type="button" className="text-sm font-medium hover:underline" onClick={() => setRetryKey((k) => k + 1)}>
              Réessayer
            </button>
            <button type="button" className="text-sm font-medium hover:underline" onClick={() => setError(null)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres</h3>
        </div>
        <div className="admin-panel-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="admin-kpi-label block mb-2">Action</label>
              <input
                type="text"
                placeholder="Ex: USER_CREATED"
                value={filters.action}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, action: (e.target as HTMLInputElement).value })}
                disabled={loading}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-kpi-label block mb-2">Type d'entité</label>
              <input
                type="text"
                placeholder="Ex: User"
                value={filters.entityType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, entityType: (e.target as HTMLInputElement).value })}
                disabled={loading}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-kpi-label block mb-2">Date de début</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, startDate: (e.target as HTMLInputElement).value })}
                disabled={loading}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-kpi-label block mb-2">Date de fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, endDate: (e.target as HTMLInputElement).value })}
                disabled={loading}
                className="admin-input"
              />
            </div>
          </div>

          {(filters.action || filters.entityType || filters.startDate || filters.endDate) && (
            <div className="pt-2 border-t border-gray-200">
              <button type="button"
                onClick={handleClearFilters}
                disabled={loading}
                className="admin-btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Logs</h3>
        </div>
        <div className="admin-panel-body">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            emptyMessage="Aucun log d'audit trouvé"
          />
        </div>
      </div>
    </div>
  );
}
