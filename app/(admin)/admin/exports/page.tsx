'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Download, FileText, Users, Phone, Truck, Plane, FileStack } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
          const data = await exportsRes.json();
          setExports(data.data || []);
        }

        if (tripsRes.ok) {
          const data = await tripsRes.json();
          setTrips(data.data || []);
        }
      } catch (_error) {
        // Erreur silencieuse — les données se chargent au prochain retry
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
    } catch (_error) {
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
    } catch (_error) {
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
    } catch (_error) {
      setToastMessage('Erreur lors de la régénération');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hub des exports</h1>
        <p className="text-gray-600 mt-2">
          Générez et gérez les exports de données de tous vos voyages
        </p>
      </div>

      {/* Toast erreur */}
      {toastMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex justify-between items-center">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 text-sm font-medium hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Actions rapides</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {exportTypes.map((type) => (
              <div key={type.value} className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => handleQuickExport(type.value as ExportType, 'CSV')}
                >
                  {type.icon}
                  <span className="text-sm">{type.label}</span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historique des exports */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold">Historique des exports</h3>
          <Button onClick={() => setIsDialogOpen(true)}>
            Générer un export
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={exports}
            loading={loading}
            emptyMessage="Aucun export trouvé"
            rowActions={rowActions}
          />
        </CardContent>
      </Card>

      {/* Modal de génération */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer un export</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="export-type">Type d'export</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as ExportType)}
              >
                <SelectTrigger id="export-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-trip">Voyage (optionnel)</Label>
              <Select value={selectedTrip} onValueChange={setSelectedTrip}>
                <SelectTrigger id="export-trip">
                  <SelectValue placeholder="Sélectionner un voyage" />
                </SelectTrigger>
                <SelectContent>
                  {trips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-format">Format</Label>
              <Select
                value={selectedFormat}
                onValueChange={(value) => setSelectedFormat(value as 'CSV' | 'PDF')}
              >
                <SelectTrigger id="export-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allowedFormats.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-motif">
                Motif <span className="text-red-500">*</span>
              </Label>
              <Input
                id="export-motif"
                placeholder="Raison de cet export (requis)"
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="min-h-10"
              />
              <p className="text-xs text-gray-500">
                Cet export sera enregistré à des fins d'audit
              </p>
            </div>

            <Button
              onClick={handleGenerateExport}
              disabled={isGenerating || !motif.trim()}
              className="w-full"
            >
              {isGenerating ? 'Génération...' : 'Générer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
