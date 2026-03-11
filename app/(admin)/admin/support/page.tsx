'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { ExportCta } from '@/components/admin/export-cta';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedTo?: string;
  clientName?: string;
  clientEmail?: string;
  responseCount?: number;
}

/**
 * Page Support - Gestion des tickets support
 * - Filtrage par statut et priorité
 * - Erreur handling avec retry
 * - Affichage du compte des tickets par statut
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('open');
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});

  const statuses = [
    { value: 'open', label: 'Ouvert', color: 'admin-badge admin-badge-info' },
    { value: 'in_progress', label: 'En cours', color: 'admin-badge admin-badge-warning' },
    { value: 'waiting', label: 'En attente', color: 'admin-badge admin-badge-warning' },
    { value: 'resolved', label: 'Résolu', color: 'admin-badge admin-badge-success' },
    { value: 'closed', label: 'Fermé', color: 'admin-badge admin-badge-neutral' },
  ];

  const fetchAllTickets = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/tickets', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const allData = data.data || [];
        setAllTickets(allData);

        // Calculate counts by status
        const counts: Record<string, number> = {};
        allData.forEach((ticket: SupportTicket) => {
          counts[ticket.status] = (counts[ticket.status] || 0) + 1;
        });
        setTicketCounts(counts);
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement des tickets');
      }
    } catch (err) {
      console.error('Tickets fetch error:', err);
      setError('Impossible de charger les tickets. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  useEffect(() => {
    // Filter tickets by status
    const filtered = allTickets.filter(t => t.status.toLowerCase() === statusFilter.toLowerCase());
    setTickets(filtered);
  }, [statusFilter, allTickets]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0':
        return 'admin-badge admin-badge-danger';
      case 'P1':
        return 'admin-badge admin-badge-warning';
      case 'P2':
        return 'admin-badge admin-badge-warning';
      default:
        return 'admin-badge admin-badge-neutral';
    }
  };

  const columns: DataTableColumn<SupportTicket>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (value, row) => {
        const titleValue = value as string;
        return (
          <>
            <p className="font-medium text-gray-900">{titleValue}</p>
            {row.clientName && (
              <p className="text-xs text-gray-500">{row.clientName} ({row.clientEmail})</p>
            )}
          </>
        );
      },
    },
    {
      key: 'priority',
      label: 'Priorité',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(value as string)}`}>
          {value as string}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => {
        const status = statuses.find((s) => s.value === (value as string));
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
            {status?.label}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Créé le',
      render: (value) => formatDate(value as string | Date),
    },
    {
      key: 'responseCount',
      label: 'Réponses',
      render: (value: unknown) => {
        const count = typeof value === 'number' ? value : 0;
        return <span className="font-medium">{count}</span>;
      },
    },
  ];

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Support & Tickets
        </h1>
      </div>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 admin-fade-in delay-1">
        <div className="flex gap-2">
          {error && (
            <button
              onClick={fetchAllTickets}
              className="admin-btn-secondary gap-2 flex items-center text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer
            </button>
          )}
          <ExportCta exportType="support_tickets_csv" label="Exporter" />
        </div>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-body p-6">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="mb-6">
              {statuses.map((status) => (
                <TabsTrigger key={status.value} value={status.value}>
                  {status.label}
                  {ticketCounts[status.value] !== undefined && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-700">
                      {ticketCounts[status.value] || 0}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {statuses.map((status) => (
              <TabsContent key={status.value} value={status.value}>
                <DataTable
                  columns={columns}
                  data={tickets}
                  loading={loading}
                  emptyMessage={`Aucun ticket dans le statut "${status.label}"`}
                  rowActions={[
                    {
                      label: 'Détails',
                      onClick: (row) => {
                        window.location.href = `/admin/support/${row.id}`;
                      },
                    },
                  ]}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
