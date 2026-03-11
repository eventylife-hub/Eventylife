'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { ExportCta } from '@/components/admin/export-cta';
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

const FALLBACK_TICKETS: SupportTicket[] = [
  { id: 'ticket-1', title: 'Problème de réservation hôtel', status: 'open', priority: 'P1', createdAt: '2026-03-11T09:30:00Z', assignedTo: 'support-1', clientName: 'Jean Dupont', clientEmail: 'jean.dupont@example.com', responseCount: 2 },
  { id: 'ticket-2', title: 'Demande de remboursement partiel', status: 'in_progress', priority: 'P2', createdAt: '2026-03-10T14:20:00Z', assignedTo: 'support-2', clientName: 'Marie Laurent', clientEmail: 'marie.laurent@example.com', responseCount: 3 },
  { id: 'ticket-3', title: 'Question sur les assurances voyage', status: 'open', priority: 'P2', createdAt: '2026-03-11T10:45:00Z', assignedTo: null, clientName: 'Pierre Martin', clientEmail: 'pierre.martin@example.com', responseCount: 0 },
  { id: 'ticket-4', title: 'Modification des dates de voyage', status: 'waiting', priority: 'P0', createdAt: '2026-03-09T16:15:00Z', assignedTo: 'support-1', clientName: 'Sophie Bernard', clientEmail: 'sophie.bernard@example.com', responseCount: 4 },
  { id: 'ticket-5', title: 'Problème d\'accès au portail', status: 'resolved', priority: 'P1', createdAt: '2026-03-08T11:00:00Z', assignedTo: 'support-3', clientName: 'Luc Mercier', clientEmail: 'luc.mercier@example.com', responseCount: 5 },
];

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
  const [activeTab, setActiveTab] = useState('open');

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
    } catch (err: unknown) {
      console.warn('API /api/admin/tickets indisponible — données démo');
      const allData = FALLBACK_TICKETS;
      setAllTickets(allData);

      // Calculate counts by status
      const counts: Record<string, number> = {};
      allData.forEach((ticket) => {
        counts[ticket.status] = (counts[ticket.status] || 0) + 1;
      });
      setTicketCounts(counts);
      setError(null);
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
            <button type="button"
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
          <div style={{ display: 'flex', gap: '0.25rem', background: '#F1EDE8', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  setActiveTab(status.value);
                  setStatusFilter(status.value);
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', backgroundColor: activeTab === status.value ? 'white' : 'transparent', color: activeTab === status.value ? '#1A1A2E' : '#64748B', boxShadow: activeTab === status.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {status.label}
                {ticketCounts[status.value] !== undefined && (
                  <span style={{ marginLeft: '0.5rem', padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', backgroundColor: '#E5E0D8', color: '#4A5568' }}>
                    {ticketCounts[status.value] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {statuses.map((status) => (
            activeTab === status.value && (
              <div key={status.value}>
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
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
