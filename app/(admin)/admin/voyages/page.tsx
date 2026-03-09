'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { ApprovalModal } from '@/components/admin/approval-modal';
import { ExportCta } from '@/components/admin/export-cta';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatPrice } from '@/lib/utils';
import { Search, RefreshCw } from 'lucide-react';

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
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

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
    } catch (_error) {
      setError('Impossible de charger les voyages');
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
          'SUBMITTED': 'bg-blue-100 text-blue-800',
          'PENDING': 'bg-orange-100 text-orange-800',
          'PUBLISHED': 'bg-green-100 text-green-800',
          'ON_GOING': 'bg-purple-100 text-purple-800',
          'COMPLETED': 'bg-gray-100 text-gray-800',
          'CANCELED': 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[(value as string) as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
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
    } catch (_error) {
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
    } catch (_error) {
      // Erreur silencieuse — retry au prochain clic
    }
  };

  const rowActions = [
    {
      label: 'Détails',
      onClick: (row: Travel) => {
        window.location.href = `/admin/voyages/${row.id}`;
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
          <button
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
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center admin-fade-in delay-2">
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
          <button
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input pl-10 w-full"
              />
            </div>
          </div>
        </div>
        <div className="admin-panel-body p-6 pt-0">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="mb-6">
              {statuses.map((status) => (
                <TabsTrigger key={status.value} value={status.value}>
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {statuses.map((status) => (
              <TabsContent key={status.value} value={status.value}>
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
                      <button
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
              </TabsContent>
            ))}
          </Tabs>
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
