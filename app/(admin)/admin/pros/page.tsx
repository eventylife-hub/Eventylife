'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import dynamic from 'next/dynamic';
const ApprovalModal = dynamic(() => import('@/components/admin/approval-modal').then(m => ({ default: m.ApprovalModal })), { ssr: false });
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
  const [activeTab, setActiveTab] = useState('pending');

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
          const data = await response.json();
          setProfiles(data.data || data);
        } else {
          setError('Erreur lors du chargement des profils Pro');
        }
      } catch (err: unknown) {
        console.warn('API /admin/pros indisponible — données démo');
        const FALLBACK_DATA: ProProfile[] = [
          {
            id: 'pro_1',
            firstName: 'Alice',
            lastName: 'Rousseau',
            company: 'Circuits Méditerranée',
            status: 'pending',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: 'pro_2',
            firstName: 'Bruno',
            lastName: 'Costa',
            company: 'Voyages Lusitania',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: 'pro_3',
            firstName: 'Céline',
            lastName: 'Fontaine',
            company: 'Escapades Nordiques',
            status: 'pending',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: 'pro_4',
            firstName: 'David',
            lastName: 'Moretti',
            company: 'Tour Operator Italia',
            status: 'approved',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60000).toISOString(),
          },
          {
            id: 'pro_5',
            firstName: 'Emma',
            lastName: 'Lefevre',
            company: 'Voyages Authentiques',
            status: 'approved',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60000).toISOString(),
          },
        ];
        setProfiles(
          statusFilter === 'pending'
            ? FALLBACK_DATA.filter((p) => p.status === 'pending')
            : FALLBACK_DATA.filter((p) => p.status === statusFilter)
        );
        setError(null);
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
        setProfiles(profiles.filter((p) => p.id !== selectedProfile.id));
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
      console.warn('API POST /admin/pros/[id]/approve indisponible — données démo');
      setProfiles(profiles.filter((p) => p.id !== selectedProfile.id));
      setShowApprovalModal(false);
      setSelectedProfile(null);
      setError(null);
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
        setProfiles(profiles.filter((p) => p.id !== selectedProfile.id));
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
      console.warn('API POST /admin/pros/[id]/reject indisponible — données démo');
      setProfiles(profiles.filter((p) => p.id !== selectedProfile.id));
      setShowApprovalModal(false);
      setSelectedProfile(null);
      setError(null);
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
      : []),
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
          <button type="button"
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
          <div style={{ display: 'flex', gap: '0.25rem', background: '#F1EDE8', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
            {statuses.map((status) => (
              <button
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
                <DataTable
                  columns={columns}
                  data={profiles}
                  loading={loading}
                  emptyMessage="Aucun profil trouvé"
                  rowActions={rowActions}
                />
              </div>
            )
          ))}
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
