'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Mail,
  MessageSquare,
  Bell,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  XCircle as XCircleIcon
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

interface NotificationTemplate {
  id: string;
  name: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  eventTrigger: string;
  active: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface NotificationHistory {
  id: string;
  template: string;
  recipient: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  status: 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}

interface NotificationsData {
  templates: NotificationTemplate[];
  recentHistory: NotificationHistory[];
  queueCount: number;
  failedCount: number;
}

// Interface pour les détails d'une notification
interface NotificationDetails extends NotificationHistory {
  templateContent?: string;
  recipientDetails?: Record<string, unknown>;
}

/**
 * Page Admin Notifications - Gestion des notifications
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminNotificationsPage() {
  const router = useRouter();
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManualSend, setShowManualSend] = useState(false);
  const [manualRecipient, setManualRecipient] = useState('');
  const [manualTemplate, setManualTemplate] = useState('');
  const [manualChannel, setManualChannel] = useState<'EMAIL' | 'SMS' | 'PUSH'>('EMAIL');
  const [activeTab, setActiveTab] = useState('templates');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/notifications', {
          credentials: 'include',
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (_error) {
        // Erreur silencieuse — les données se chargent au prochain retry
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleTemplate = async (templateId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/notifications/templates/${templateId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: !active }),
      });

      if (response.ok) {
        // Refresh data
        const res = await fetch('/api/admin/notifications', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      }
    } catch (_error) {
      // Erreur silencieuse — retry au prochain clic
    }
  };

  const handleSendManual = async () => {
    if (!manualRecipient.trim() || !manualTemplate) {
      setToastMessage({ type: 'error', message: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          recipient: manualRecipient,
          templateId: manualTemplate,
          channel: manualChannel,
        }),
      });

      if (response.ok) {
        setToastMessage({ type: 'success', message: 'Notification envoyée' });
        setShowManualSend(false);
        setManualRecipient('');
        setManualTemplate('');

        // Refresh data
        const res = await fetch('/api/admin/notifications', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de l\'envoi' });
      }
    } catch (_error) {
      setToastMessage({ type: 'error', message: 'Erreur lors de l\'envoi' });
    }
  };

  // Fonction pour dupliquer un template
  const duplicateTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/templates/${templateId}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setToastMessage({ type: 'success', message: 'Modèle dupliqué avec succès' });
        // Recharger la liste des templates
        const res = await fetch('/api/admin/notifications', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la duplication' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la duplication';
      setToastMessage({ type: 'error', message });
    }
  };

  const channelConfig = {
    EMAIL: { label: 'Email', icon: Mail, color: 'bg-blue-100 text-blue-800' },
    SMS: { label: 'SMS', icon: MessageSquare, color: 'bg-green-100 text-green-800' },
    PUSH: { label: 'Push', icon: Bell, color: 'bg-purple-100 text-purple-800' },
  };

  const statusConfig = {
    PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    SENT: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800', icon: Send },
    DELIVERED: { label: 'Délivré', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    FAILED: { label: 'Échoué', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  };

  const templateColumns: DataTableColumn<NotificationTemplate>[] = [
    {
      key: 'name',
      label: 'Nom du template',
    },
    {
      key: 'channel',
      label: 'Canal',
      render: (value: unknown) => {
        const channel = value as NotificationTemplate['channel'];
        const config = channelConfig[channel];
        const Icon = config?.icon || Mail;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <span className={`px-2 py-1 rounded text-xs font-medium ${config?.color}`}>
              {config?.label}
            </span>
          </div>
        );
      },
    },
    {
      key: 'eventTrigger',
      label: 'Événement déclencheur',
    },
    {
      key: 'active',
      label: 'Actif',
      render: (value: unknown) => {
        const isActive = value as boolean;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Oui' : 'Non'}
          </span>
        );
      },
    },
    {
      key: 'lastModified',
      label: 'Modifié',
      render: (value: unknown) => formatDate(value as string | Date),
    },
  ];

  const historyColumns: DataTableColumn<NotificationHistory>[] = [
    {
      key: 'template',
      label: 'Template',
    },
    {
      key: 'recipient',
      label: 'Destinataire',
      render: (value: unknown) => <span className="text-sm truncate">{value as string}</span>,
    },
    {
      key: 'channel',
      label: 'Canal',
      render: (value: unknown) => {
        const channel = value as NotificationHistory['channel'];
        const config = channelConfig[channel];
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${config?.color}`}>
            {config?.label}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: unknown) => {
        const status = value as NotificationHistory['status'];
        const config = statusConfig[status];
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${config?.color}`}>
            {config?.label}
          </span>
        );
      },
    },
    {
      key: 'sentAt',
      label: 'Envoyé',
      render: (value: unknown) => formatDateTime(value as string | Date),
    },
  ];

  if (loading || !data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Gérez les templates de notifications et l'historique d'envois
          </p>
        </div>
        <Button variant="default" onClick={() => setShowManualSend(true)}>
          <Send className="w-4 h-4 mr-2" />
          Envoyer manuellement
        </Button>
      </div>

      {/* Statuts de la queue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-600">En attente</label>
                <p className="text-3xl font-bold text-orange-600 mt-1">{data.queueCount}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-600">Échoués</label>
                <p className="text-3xl font-bold text-red-600 mt-1">{data.failedCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="templates">Templates ({data.templates.length})</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Templates */}
        <TabsContent value="templates">
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={templateColumns}
                data={data.templates}
                loading={false}
                emptyMessage="Aucun template trouvé"
                rowActions={[
                  {
                    label: 'Éditer',
                    onClick: (row) => {
                      // Naviguer vers la page d'édition du template
                      router.push(`/admin/notifications/templates/${row.id}/edit`);
                    },
                  },
                  {
                    label: 'Dupliquer',
                    onClick: (row) => {
                      // Dupliquer le template
                      duplicateTemplate(row.id);
                    },
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <DataTable
                columns={historyColumns}
                data={data.recentHistory}
                loading={false}
                emptyMessage="Aucun historique"
                rowActions={[
                  {
                    label: 'Détails',
                    onClick: (row) => {
                      // Ouvrir le panel détails de la notification
                      setSelectedNotification(row as NotificationDetails);
                    },
                  },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Envoi manuel */}
      {showManualSend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold">Envoyer une notification</h2>
              <button
                onClick={() => setShowManualSend(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Destinataire
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com ou +33..."
                  value={manualRecipient}
                  onChange={(e) => setManualRecipient(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Template
                </label>
                <Select value={manualTemplate} onValueChange={setManualTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Canal
                </label>
                <Select value={manualChannel} onValueChange={(val: string) => setManualChannel(val as 'EMAIL' | 'SMS' | 'PUSH')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="PUSH">Push</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowManualSend(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="default"
                  onClick={handleSendManual}
                >
                  Envoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Toast de notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toastMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircleIcon className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 p-1 rounded hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Panel latéral - Détails de la notification */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Détails de la notification</h2>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Template
                </label>
                <p className="text-sm text-gray-900">{selectedNotification.template}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Destinataire
                </label>
                <p className="text-sm text-gray-900 break-all">{selectedNotification.recipient}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Canal
                </label>
                <div className="flex items-center gap-2">
                  {selectedNotification.channel === 'EMAIL' && <Mail className="w-4 h-4" />}
                  {selectedNotification.channel === 'SMS' && <MessageSquare className="w-4 h-4" />}
                  {selectedNotification.channel === 'PUSH' && <Bell className="w-4 h-4" />}
                  <span className="text-sm text-gray-900">
                    {channelConfig[selectedNotification.channel]?.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Statut
                </label>
                <div className="flex items-center gap-2">
                  {selectedNotification.status === 'PENDING' && <Clock className="w-4 h-4" />}
                  {selectedNotification.status === 'SENT' && <Send className="w-4 h-4" />}
                  {selectedNotification.status === 'DELIVERED' && <CheckCircle className="w-4 h-4" />}
                  {selectedNotification.status === 'FAILED' && <AlertCircle className="w-4 h-4" />}
                  <span className="text-sm text-gray-900">
                    {statusConfig[selectedNotification.status]?.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Envoyé le
                </label>
                <p className="text-sm text-gray-900">
                  {formatDateTime(selectedNotification.sentAt)}
                </p>
              </div>

              {selectedNotification.deliveredAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Délivré le
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(selectedNotification.deliveredAt)}
                  </p>
                </div>
              )}

              {selectedNotification.errorMessage && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    Message d'erreur
                  </label>
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {selectedNotification.errorMessage}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedNotification(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
