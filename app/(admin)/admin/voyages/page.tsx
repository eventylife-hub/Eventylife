'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import dynamic from 'next/dynamic';
const ApprovalModal = dynamic(() => import('@/components/admin/approval-modal').then(m => ({ default: m.ApprovalModal })), { ssr: false });
import { ExportCta } from '@/components/admin/export-cta';
import { formatDate, formatPrice } from '@/lib/utils';
import { Search, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/logger';
interface Travel {
  id: string;
  title: string;
  status: string;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
  startDate?: string;
  endDate?: string;
  bookingCount?: number;
  revenue?: number;
}

/**
 * Page de gestion des voyages
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function VoyagesPage() {
  const router = useRouter();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const statuses = [
    { value: 'all', label: 'Tous' },
    { value: 'pending', label: 'En attente' },
    { value: 'published', label: 'Publiés' },
    { value: 'ongoing', label: 'En cours' },
    { value: 'completed', label: 'Complétés' },
    { value: 'canceled', label: 'Annulés' },
  ];

  const fetchTravels = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint =
        statusFilter === 'pending'
          ? '/api/admin/travels/pending'
          : statusFilter === 'all'
          ? '/api/admin/travels'
          : `/api/admin/travels?status=${statusFilter.toUpperCase()}`;

      const response = await fetch(endpoint, { credentials: 'include' });
      if (response.ok) {
        let data = await response.json();
        data = data.data || data;

        // Filter by search query if present
        if (searchQuery) {
          data = data.filter((travel: Travel) =>
            travel.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setTravels(data);
      } else {
        setError('Erreur lors du chargement des voyages');
      }
    } catch (_error: unknown) {
      logger.warn('API /admin/travels indisponible — données démo');
      const FALLBACK_DATA: Travel[] = [
        {
          id: 'demo-1',
          title: 'Voyage à Barcelone',
          status: 'PENDING',
          createdBy: { firstName: 'Pierre', lastName: 'Martin' },
          startDate: '2026-06-15',
          endDate: '2026-06-22',
          bookingCount: 12,
          revenue: 450000,
        },
        {
          id: 'demo-2',
          title: 'Circuits Côte d\'Azur',
          status: 'PUBLISHED',
          createdBy: { firstName: 'Sophie', lastName: 'Dupont' },
          startDate: '2026-07-01',
          endDate: '2026-07-08',
          bookingCount: 25,
          revenue: 875000,
        },
        {
          id: 'demo-3',
          title: 'Escapade à Venise',
          status: 'SUBMITTED',
          createdBy: { firstName: 'Jean', lastName: 'Moreau' },
          startDate: '2026-05-20',
          endDate: '2026-05-27',
          bookingCount: 8,
          revenue: 320000,
        },
      ];
      setTravels(FALLBACK_DATA);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, [statusFilter]);

  const columns: DataTableColumn<Travel>[] = [
    {
      key: 'title',
      label: 'Nom',
    },
    {
      key: 'createdBy',
      label: 'PRO',
      render: (value: unknown) => {
        const creator = value as { firstName: string; lastName: string } | undefined;
        return creator ? `${creator.firstName} ${creator.lastName}` : '-';
      },
    },
    {
      key: 'startDate',
      label: 'Dates',
      render: (value, row) =>
        `${value ? formatDate(value as string | Date) : '-'} - ${row.endDate ? formatDate(row.endDate as string | Date) : '-'}`,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => {
        const statusColors = {
          'SUBMITTED': 'admin-badge admin-badge-info',
          'PENDING': 'admin-badge admin-badge-warning',
          'PUBLISHED': 'admin-badge admin-badge-success',
          'ON_GOING': 'admin-badge admin-badge-violet',
          'COMPLETED': 'admin-badge admin-badge-neutral',
          'CANCELED': 'admin-badge admin-badge-danger',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[(value as string) as keyof typeof statusColors] || 'admin-badge admin-badge-neutral'}`}>
            {value as string}
          </span>
        );
      },
    },
    {
      key: 'bookingCount',
      label: 'Réservations',
      render: (value) => `${(value as number) || 0}`,
    },
    {
      key: 'revenue',
      label: 'CA',
      render: (value) => formatPrice((value as number) || 0),
    },
  ];

  const handleApproveTravel = async () => {
    if (!selectedTravel) return;

    try {
      const endpoint =
        selectedTravel.status === 'SUBMITTED'
          ? `/api/admin/travels/${selectedTravel.id}/approve-p1`
          : `/api/admin/travels/${selectedTravel.id}/approve-p2`;

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setTravels(travels.filter((t) => t.id !== selectedTravel.id));
        setShowApprovalModal(false);
        setSelectedTravel(null);
      }
    } catch (_error: unknown) {
      // Erreur silencieuse — retry au prochain clic
    }
  };

  const handleRejectTravel = async (reason: string) => {
    if (!selectedTravel) return;

    try {
      const response = await fetch(`/api/admin/travels/${selectedTravel.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setTravels(travels.filter((t) => t.id !== selectedTravel.id));
        setShowApprovalModal(false);
        setSelectedTravel(null);
      }
    } catch (_error: unknown) {
      // Erreur silencieuse — retry au prochain clic
    }
  };

  const rowActions = [
    {
      label: 'Détails',
      onClick: (row: Travel) => {
        router.push(`/admin/voyages/${row.id}`);
      },
    },
    ...(statusFilter === 'pending'
      ? [
          {
            label: 'Décider',
            onClick: (row: Travel) => {
              setSelectedTravel(row);
              setShowApprovalModal(true);
            },
          },
        ]
      : []),
  ];

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Ops Voyages
        </h1>
      </div>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 admin-fade-in delay-1">
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={fetchTravels}
            className="admin-btn-secondary gap-2 flex items-center text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <ExportCta exportType="travels_csv" label="Exporter" />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center admin-fade-in delay-2">
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
          <button type="button"
            onClick={fetchTravels}
            className="admin-btn-secondary gap-2 flex items-center text-sm ml-4 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      )}

      {/* Search and Tabs */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-header">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un voyage..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery((e.target as HTMLInputElement).value)}
                className="admin-input pl-10 w-full"
                aria-label="Rechercher un voyage"
              />
            </div>
          </div>
        </div>
        <div className="admin-panel-body p-6 pt-0">
          <div style={{ display: 'flex', gap: '0.25rem', background: '#F1EDE8', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
            {statuses.map((status) => (
              <button
                type="button"
                key={status.value}
                onClick={() => {
                  setActiveTab(status.value);
                  setStatusFilter(status.value);
                }}
                style={{ padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', backgroundColor: activeTab === status.value ? 'white' : 'transparent', color: activeTab === status.value ? '#1A1A2E' : '#64748B', boxShadow: activeTab === status.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
              >
                {status.label}
              </button>
            ))}
          </div>

          {statuses.map((status) => (
            activeTab === status.value && (
              <div key={status.value}>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : travels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Aucun voyage trouvé</p>
                    {searchQuery && (
                      <button type="button"
                        onClick={() => setSearchQuery('')}
                        className="admin-btn-secondary text-sm"
                      >
                        Effacer la recherche
                      </button>
                    )}
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={travels}
                    loading={false}
                    emptyMessage="Aucun voyage trouvé"
                    rowActions={rowActions}
                  />
                )}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Modal d'approbation */}
      <ApprovalModal
        isOpen={showApprovalModal}
        entityName={selectedTravel?.title || ''}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedTravel(null);
        }}
        onApprove={handleApproveTravel}
        onReject={handleRejectTravel}
      />
    </div>
  );
}
