'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { ApprovalModal } from '@/components/admin/approval-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';
interface ProProfile {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  status: string;
  createdAt: string;
}

/**
 * Page Pro - Gestion des profils Pro
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function ProsPage() {
  const [profiles, setProfiles] = useState<ProProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedProfile, setSelectedProfile] = useState<ProProfile | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const statuses = [
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvés' },
    { value: 'rejected', label: 'Rejetés' },
  ];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint =
          statusFilter === 'pending'
            ? '/api/admin/pros/pending'
            : `/api/admin/pros?status=${statusFilter.toUpperCase()}`;

        const response = await fetch(endpoint, { credentials: 'include' });
        if (response.ok) {
          const data = (await response.json() as unknown) as unknown;
          setProfiles(data.data || data);
        } else {
          setError('Erreur lors du chargement des profils Pro');
        }
      } catch (err: unknown) {
        console.error('Pros fetch error:', err);
        setError('Impossible de charger les profils Pro. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [statusFilter]);

  const columns: DataTableColumn<ProProfile>[] = [
    {
      key: 'firstName',
      label: 'Nom',
      render: (value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'company',
      label: 'Entreprise',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value as React.ReactNode}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Créé le',
      render: (value) => formatDate(value as string | Date),
    },
  ];

  const handleApprovePro = async () => {
    if (!selectedProfile) return;

    try {
      const response = await fetch(`/api/admin/pros/${selectedProfile.id}/approve`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setProfiles(profiles.filter((p: unknown) => p.id !== selectedProfile.id));
        setShowApprovalModal(false);
        setSelectedProfile(null);
        // In production, show toast: "Profil approuvé avec succès"
      } else if (response.status === 409) {
        setError('Ce profil a déjà été traité');
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors de l\'approbation du profil');
      }
    } catch (err: unknown) {
      console.error('Pro approval error:', err);
      setError('Impossible d\'approuver le profil. Vérifiez votre connexion.');
    }
  };

  const handleRejectPro = async (reason: string) => {
    if (!selectedProfile) return;

    try {
      const response = await fetch(`/api/admin/pros/${selectedProfile.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setProfiles(profiles.filter((p: unknown) => p.id !== selectedProfile.id));
        setShowApprovalModal(false);
        setSelectedProfile(null);
        // In production, show toast: "Profil rejeté avec succès"
      } else if (response.status === 409) {
        setError('Ce profil a déjà été traité');
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du rejet du profil');
      }
    } catch (err: unknown) {
      console.error('Pro rejection error:', err);
      setError('Impossible de rejeter le profil. Vérifiez votre connexion.');
    }
  };

  const rowActions = [
    {
      label: 'Détails',
      onClick: (row: ProProfile) => {
        window.location.href = `/admin/pros/${row.id}`;
      },
    },
    ...(statusFilter === 'pending'
      ? [
          {
            label: 'Décider',
            onClick: (row: ProProfile) => {
              setSelectedProfile(row);
              setShowApprovalModal(true);
            },
          },
        ]
      : unknown[]),
  ];

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Validation Pro
        </h1>
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm font-medium hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Onglets */}
      <div className="admin-panel admin-fade-in delay-1">
        <div className="admin-panel-body p-6">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="mb-6">
              {statuses.map((status: unknown) => (
                <TabsTrigger key={status.value} value={status.value}>
                  {status.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {statuses.map((status: unknown) => (
              <TabsContent key={status.value} value={status.value}>
                <DataTable
                  columns={columns}
                  data={profiles}
                  loading={loading}
                  emptyMessage="Aucun profil trouvé"
                  rowActions={rowActions}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Modal d'approbation */}
      <ApprovalModal
        isOpen={showApprovalModal}
        entityName={selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName}` : ''}
        onClose={() => {
          setShowApprovalModal(false);
          setSelectedProfile(null);
        }}
        onApprove={handleApprovePro}
        onReject={handleRejectPro}
      />
    </div>
  );
}
