'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Download } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

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
      } catch (err) {
        console.error('Audit logs fetch error:', err);
        setError('Impossible de charger les logs d\'audit. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchLogs, 300);
    return () => clearTimeout(timer);
  }, [filters]);

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
    } catch (err) {
      console.error('Audit export error:', err);
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
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit</h1>
          <p className="text-gray-600 mt-2">
            {logs.length > 0 ? `${logs.length} actions enregistrées` : 'Consultez l\'historique complet des actions administrateur'}
          </p>
        </div>
        <Button onClick={handleExport} disabled={loading} className="gap-2 flex-shrink-0">
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-sm font-medium hover:underline flex-shrink-0"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <Input
                placeholder="Ex: USER_CREATED"
                value={filters.action}
                onChange={(e) =>
                  setFilters({ ...filters, action: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Filtre type entité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'entité
              </label>
              <Input
                placeholder="Ex: User"
                value={filters.entityType}
                onChange={(e) =>
                  setFilters({ ...filters, entityType: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Date de début */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                disabled={loading}
              />
            </div>

            {/* Date de fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Bouton réinitialiser filtres */}
          {(filters.action || filters.entityType || filters.startDate || filters.endDate) && (
            <div className="pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearFilters}
                disabled={loading}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={logs}
            loading={loading}
            emptyMessage="Aucun log d'audit trouvé"
          />
        </CardContent>
      </Card>
    </div>
  );
}
