'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Download, FileText, Users, Phone, Truck, Plane, FileStack } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
interface ExportLog {
  id: string;
  createdAt: string;
  createdBy: string;
  exportType: string;
  scope: string;
  format: 'CSV' | 'PDF';
  motif: string;
  status: 'PENDING' | 'READY' | 'EXPIRED';
  downloadLink?: string;
}

type ExportType = 'ROOMING_LIST' | 'PARTICIPANTS' | 'EMERGENCY_CONTACTS' | 'BUS_MANIFEST' | 'FLIGHT_MANIFESTS' | 'SUPPORT_TICKETS' | 'LEGAL';

const FALLBACK_EXPORTS: ExportLog[] = [
  { id: 'export-1', createdAt: '2026-03-11T14:20:00Z', createdBy: 'admin@eventy.com', exportType: 'ROOMING_LIST', scope: 'Paris Luxe - Mars 2026', format: 'PDF', motif: 'Vérification des assignations hôtel', status: 'READY', downloadLink: '/downloads/export-1.pdf' },
  { id: 'export-2', createdAt: '2026-03-10T10:45:00Z', createdBy: 'manager@eventy.com', exportType: 'PARTICIPANTS', scope: 'Tous les voyages', format: 'CSV', motif: 'Rapport mensuel des participants', status: 'READY', downloadLink: '/downloads/export-2.csv' },
  { id: 'export-3', createdAt: '2026-03-09T09:15:00Z', createdBy: 'admin@eventy.com', exportType: 'EMERGENCY_CONTACTS', scope: 'Côte d\'Azur - Avril 2026', format: 'PDF', motif: 'Fichier d\'urgence pour l\'équipe médicale', status: 'READY', downloadLink: '/downloads/export-3.pdf' },
  { id: 'export-4', createdAt: '2026-03-11T16:30:00Z', createdBy: 'staff@eventy.com', exportType: 'BUS_MANIFEST', scope: 'Paris Luxe - Mars 2026', format: 'PDF', motif: 'Manifest transport pour le prestataire', status: 'PENDING' },
  { id: 'export-5', createdAt: '2026-03-08T11:00:00Z', createdBy: 'admin@eventy.com', exportType: 'FLIGHT_MANIFESTS', scope: 'Alpes - Février 2026', format: 'PDF', motif: 'Documents pour la compagnie aérienne', status: 'EXPIRED' },
];

/**
 * Page Exports Hub - Gestion centralisée des exports
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function ExportsPage() {
  const [exports, setExports] = useState<ExportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<'CSV' | 'PDF'>('CSV');
  const [selectedType, setSelectedType] = useState<ExportType>('ROOMING_LIST');
  const [motif, setMotif] = useState('');
  const [trips, setTrips] = useState<Array<{ id: string; title: string }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const exportTypes = [
    { value: 'ROOMING_LIST', label: 'Liste des chambres', icon: <FileText /> },
    { value: 'PARTICIPANTS', label: 'Participants', icon: <Users /> },
    { value: 'EMERGENCY_CONTACTS', label: 'Contacts d\'urgence', icon: <Phone /> },
    { value: 'BUS_MANIFEST', label: 'Manifeste bus', icon: <Truck /> },
    { value: 'FLIGHT_MANIFESTS', label: 'Manifestes avion', icon: <Plane /> },
    { value: 'SUPPORT_TICKETS', label: 'Tickets support', icon: <FileStack /> },
    { value: 'LEGAL', label: 'Documents légaux', icon: <FileText /> },
  ];

  const formatAllowedFormats = (type: ExportType): ('CSV' | 'PDF')[] => {
    switch (type) {
      case 'LEGAL':
        return ['PDF'];
      case 'ROOMING_LIST':
        return ['PDF', 'CSV'];
      default:
        return ['CSV', 'PDF'];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [exportsRes, tripsRes] = await Promise.all([
          fetch('/api/admin/exports', { credentials: 'include' }),
          fetch('/api/admin/travels', { credentials: 'include' }),
        ]);

        if (exportsRes.ok) {
          const data = await exportsRes.json() as { data?: ExportLog[] };
          setExports(data.data || []);
        }

        if (tripsRes.ok) {
          const data = await tripsRes.json() as { data?: Array<{ id: string; title: string }> };
          setTrips(data.data || []);
        }
      } catch (_error: unknown) {
        console.warn('API /api/admin/exports indisponible — données démo');
        setExports(FALLBACK_EXPORTS);
        setTrips([
          { id: 'trip-1', title: 'Paris Luxe - Mars 2026' },
          { id: 'trip-2', title: 'Côte d\'Azur - Avril 2026' },
          { id: 'trip-3', title: 'Alpes - Février 2026' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickExport = async (type: ExportType, format: 'CSV' | 'PDF') => {
    setSelectedType(type);
    setSelectedFormat(format);
    setMotif('');
    setSelectedTrip('');
    setIsDialogOpen(true);
  };

  const handleGenerateExport = async () => {
    if (!motif.trim()) {
      setToastMessage('Veuillez remplir le motif de l\'export');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch('/api/admin/exports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          exportType: selectedType,
          tripId: selectedTrip || undefined,
          format: selectedFormat,
          motif: motif.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExports([data, ...exports]);
        setIsDialogOpen(false);
        setMotif('');
        setSelectedTrip('');
      }
    } catch (_error: unknown) {
      setToastMessage('Erreur lors de la génération de l\'export');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (exportId: string) => {
    try {
      const response = await fetch(`/api/admin/exports/${exportId}/download`, {
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-${exportId}.file`;
        a.click();
      }
    } catch (_error: unknown) {
      setToastMessage('Erreur lors du téléchargement');
    }
  };

  const handleRegenerate = async (exportId: string) => {
    try {
      const response = await fetch(`/api/admin/exports/${exportId}/regenerate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setExports(exports.map((e) => (e.id === exportId ? data : e)));
      }
    } catch (_error: unknown) {
      setToastMessage('Erreur lors de la régénération');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'admin-badge admin-badge-warning';
      case 'READY':
        return 'admin-badge admin-badge-success';
      case 'EXPIRED':
        return 'admin-badge admin-badge-danger';
      default:
        return 'admin-badge admin-badge-neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En cours';
      case 'READY':
        return 'Prêt';
      case 'EXPIRED':
        return 'Expiré';
      default:
        return status;
    }
  };

  const columns: DataTableColumn<ExportLog>[] = [
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => formatDateTime(value as string | Date),
    },
    {
      key: 'createdBy',
      label: 'Créateur',
    },
    {
      key: 'exportType',
      label: 'Type d\'export',
    },
    {
      key: 'scope',
      label: 'Portée',
    },
    {
      key: 'format',
      label: 'Format',
    },
    {
      key: 'motif',
      label: 'Motif',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value as string)}`}>
          {getStatusLabel(value as string)}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: 'Télécharger',
      onClick: (row: ExportLog) => {
        if (row.status === 'READY' && row.downloadLink) {
          handleDownload(row.id);
        }
      },
      disabled: (row: ExportLog) => row.status !== 'READY',
    },
    {
      label: 'Régénérer',
      onClick: (row: ExportLog) => {
        if (row.status === 'EXPIRED') {
          handleRegenerate(row.id);
        }
      },
      disabled: (row: ExportLog) => row.status !== 'EXPIRED',
    },
  ];

  const allowedFormats = formatAllowedFormats(selectedType);

  /** Synchronise le format sélectionné quand le type change — useEffect pour éviter setState en render */
  useEffect(() => {
    const allowed = formatAllowedFormats(selectedType);
    if (!allowed.includes(selectedFormat)) {
      setSelectedFormat(allowed[0] || ('CSV' as 'CSV' | 'PDF'));
    }
  }, [selectedType, selectedFormat]);

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Exports</div>
          <h1 className="admin-page-title">Exports</h1>
        </div>
      </div>

      {toastMessage && (
        <div className="admin-alert-bar danger">
          <span>{toastMessage}</span>
          <button type="button" className="ml-4 text-sm font-medium hover:underline" onClick={() => setToastMessage(null)}>
            Fermer
          </button>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Actions rapides</h3>
        </div>
        <div className="admin-panel-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {exportTypes.map((type) => (
              <button type="button"
                key={type.value}
                onClick={() => handleQuickExport(type.value as ExportType, 'CSV')}
                className="admin-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-start' }}
              >
                {type.icon}
                <span style={{ fontSize: '14px' }}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="admin-panel-title">Historique des exports</h3>
          <button type="button" onClick={() => setIsDialogOpen(true)} className="admin-btn-primary" style={{ fontSize: '14px' }}>
            Générer un export
          </button>
        </div>
        <div className="admin-panel-body">
          <DataTable
            columns={columns}
            data={exports}
            loading={loading}
            emptyMessage="Aucun export trouvé"
            rowActions={rowActions}
          />
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '448px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-primary)', marginBottom: '16px' }}>
              Générer un export
            </h2>

            <div style={{ space: '16px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Type d'export
                </label>
                <select
                  value={selectedType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value as ExportType)}
                  className="admin-input"
                >
                  {exportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Voyage (optionnel)
                </label>
                <select
                  value={selectedTrip}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTrip(e.target.value)}
                  className="admin-input"
                >
                  <option value="">Sélectionner un voyage</option>
                  {trips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFormat(e.target.value as 'CSV' | 'PDF')}
                  className="admin-input"
                >
                  {allowedFormats.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Motif <span style={{ color: 'var(--admin-coral)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Raison de cet export (requis)"
                  value={motif}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMotif((e.target as HTMLInputElement).value)}
                  className="admin-input"
                />
                <p style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', marginTop: '6px' }}>
                  Cet export sera enregistré à des fins d'audit
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button"
                onClick={() => setIsDialogOpen(false)}
                className="admin-btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button type="button"
                onClick={handleGenerateExport}
                disabled={isGenerating || !motif.trim()}
                className="admin-btn-primary"
                style={{ flex: 1, opacity: isGenerating || !motif.trim() ? 0.5 : 1 }}
              >
                {isGenerating ? 'Génération...' : 'Générer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
