'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
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
      } catch (_error: unknown) {
        console.warn('API admin/notifications indisponible — données démo');
        const FALLBACK_DATA: NotificationsData = {
          templates: [
            {
              id: 'tpl_1',
              name: 'Confirmation de réservation',
              channel: 'EMAIL',
              eventTrigger: 'booking.confirmed',
              active: true,
              lastModified: new Date(Date.now() - 86400000).toISOString(),
              modifiedBy: 'admin@eventy.fr',
            },
            {
              id: 'tpl_2',
              name: 'Alerte paiement',
              channel: 'SMS',
              eventTrigger: 'payment.failed',
              active: true,
              lastModified: new Date(Date.now() - 172800000).toISOString(),
              modifiedBy: 'support@eventy.fr',
            },
          ],
          recentHistory: [
            {
              id: 'hist_1',
              template: 'Confirmation de réservation',
              recipient: 'client@example.com',
              channel: 'EMAIL',
              status: 'DELIVERED',
              sentAt: new Date(Date.now() - 3600000).toISOString(),
              deliveredAt: new Date(Date.now() - 3000000).toISOString(),
            },
            {
              id: 'hist_2',
              template: 'Alerte paiement',
              recipient: '+33612345678',
              channel: 'SMS',
              status: 'SENT',
              sentAt: new Date(Date.now() - 7200000).toISOString(),
            },
          ],
          queueCount: 3,
          failedCount: 1,
        };
        setData(FALLBACK_DATA);
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
          const result = await res.json() as NotificationsData;
          setData(result);
        }
      }
    } catch (_error: unknown) {
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
          const result = await res.json() as NotificationsData;
          setData(result);
        }
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de l\'envoi' });
      }
    } catch (_error: unknown) {
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
          const result = await res.json() as NotificationsData;
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
    EMAIL: { label: 'Email', icon: Mail, color: 'admin-badge admin-badge-info' },
    SMS: { label: 'SMS', icon: MessageSquare, color: 'admin-badge admin-badge-success' },
    PUSH: { label: 'Push', icon: Bell, color: 'admin-badge admin-badge-violet' },
  };

  const statusConfig = {
    PENDING: { label: 'En attente', color: 'admin-badge admin-badge-warning', icon: Clock },
    SENT: { label: 'Envoyé', color: 'admin-badge admin-badge-info', icon: Send },
    DELIVERED: { label: 'Délivré', color: 'admin-badge admin-badge-success', icon: CheckCircle },
    FAILED: { label: 'Échoué', color: 'admin-badge admin-badge-danger', icon: AlertCircle },
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
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              background: channel === 'EMAIL' ? 'var(--admin-ocean-light)' : channel === 'SMS' ? 'var(--admin-mint-soft)' : 'var(--admin-coral-soft)',
              color: channel === 'EMAIL' ? 'var(--admin-ocean)' : channel === 'SMS' ? 'var(--admin-success)' : 'var(--admin-coral)',
            }}>
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
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            background: isActive ? 'var(--admin-mint-soft)' : 'var(--admin-surface-alt)',
            color: isActive ? 'var(--admin-success)' : 'var(--admin-text-secondary)',
          }}>
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
        const statusColor = status === 'PENDING' ? { bg: 'var(--admin-coral-soft)', color: 'var(--admin-coral)' } : status === 'SENT' ? { bg: 'var(--admin-ocean-light)', color: 'var(--admin-ocean)' } : status === 'DELIVERED' ? { bg: 'var(--admin-mint-soft)', color: 'var(--admin-success)' } : { bg: 'var(--admin-coral-soft)', color: 'var(--admin-coral)' };
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            background: statusColor.bg,
            color: statusColor.color,
          }}>
            {statusConfig[status]?.label}
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
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Notifications</div>
          <h1 className="admin-page-title">Monitoring</h1>
        </div>
        <button type="button" onClick={() => setShowManualSend(true)} className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Send className="w-4 h-4" />
          Envoyer manuellement
        </button>
      </div>

      {/* Statuts de la queue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="admin-kpi-card" style={{ background: 'var(--admin-coral-soft)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>En attente</label>
              <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-coral)', marginTop: '8px' }}>{data.queueCount}</p>
            </div>
            <Clock className="w-10 h-10" style={{ color: 'var(--admin-coral-soft)' }} />
          </div>
        </div>
        <div className="admin-kpi-card" style={{ background: 'var(--admin-coral-soft)', padding: '16px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>Échoués</label>
              <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-coral)', marginTop: '8px' }}>{data.failedCount}</p>
            </div>
            <AlertCircle className="w-10 h-10" style={{ color: 'var(--admin-coral-soft)' }} />
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="space-y-6">
        {/* Onglet Templates */}
        <div>
          {activeTab === 'templates' && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h3 className="admin-panel-title">Templates ({data.templates.length})</h3>
              </div>
              <div className="admin-panel-body">
                <DataTable
                  columns={templateColumns}
                  data={data.templates}
                  loading={false}
                  emptyMessage="Aucun template trouvé"
                  rowActions={[
                    {
                      label: 'Éditer',
                      onClick: (row) => {
                        router.push(`/admin/notifications/templates/${row.id}/edit`);
                      },
                    },
                    {
                      label: 'Dupliquer',
                      onClick: (row) => {
                        duplicateTemplate(row.id);
                      },
                    },
                  ]}
                />
              </div>
            </div>
          )}

          {/* Onglet Historique */}
          {activeTab === 'history' && (
            <div className="admin-panel">
              <div className="admin-panel-header">
                <h3 className="admin-panel-title">Historique</h3>
              </div>
              <div className="admin-panel-body">
                <DataTable
                  columns={historyColumns}
                  data={data.recentHistory}
                  loading={false}
                  emptyMessage="Aucun historique"
                  rowActions={[
                    {
                      label: 'Détails',
                      onClick: (row) => {
                        setSelectedNotification(row as NotificationDetails);
                      },
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--admin-border)', marginBottom: '16px' }}>
          <button type="button"
            onClick={() => setActiveTab('templates')}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'templates' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
              borderBottom: activeTab === 'templates' ? '2px solid var(--admin-accent)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Templates ({data.templates.length})
          </button>
          <button type="button"
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'history' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--admin-accent)' : 'none',
              marginBottom: '-1px',
            }}
          >
            Historique
          </button>
        </div>
      </div>

      {/* Modal Envoi manuel */}
      {showManualSend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '448px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-primary)' }}>Envoyer une notification</h2>
              <button type="button"
                onClick={() => setShowManualSend(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-secondary)', fontSize: '18px' }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div style={{ space: '16px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Destinataire
                </label>
                <input
                  type="email"
                autoComplete="email"
                  placeholder="email@example.com ou +33..."
                  value={manualRecipient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualRecipient((e.target as HTMLInputElement).value)}
                  className="admin-input"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Template
                </label>
                <select
                  value={manualTemplate}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setManualTemplate(e.target.value)}
                  className="admin-input"
                >
                  <option value="">Sélectionner un template</option>
                  {data.templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                  Canal
                </label>
                <select
                  value={manualChannel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setManualChannel(e.target.value as 'EMAIL' | 'SMS' | 'PUSH')}
                  className="admin-input"
                >
                  <option value="EMAIL">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="PUSH">Push</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button"
                onClick={() => setShowManualSend(false)}
                className="admin-btn-secondary"
                style={{ padding: '10px 16px' }}
              >
                Annuler
              </button>
              <button type="button"
                onClick={handleSendManual}
                className="admin-btn-primary"
                style={{ padding: '10px 16px' }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          animation: 'fadeInSlide 0.3s ease-out',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${toastMessage.type === 'success' ? 'var(--admin-success)' : 'var(--admin-coral)'}`,
            background: toastMessage.type === 'success' ? 'var(--admin-mint-soft)' : 'var(--admin-coral-soft)',
            color: toastMessage.type === 'success' ? 'var(--admin-success)' : 'var(--admin-coral)',
          }}>
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" style={{ flexShrink: 0 }} />
            ) : (
              <XCircleIcon className="w-5 h-5" style={{ flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{toastMessage.message}</span>
            <button type="button"
              onClick={() => setToastMessage(null)}
              style={{ marginLeft: '8px', padding: '4px 8px', borderRadius: '4px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, fontSize: '16px' }}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Panel latéral - Détails de la notification */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div style={{ background: 'white', width: '100%', maxWidth: '448px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)' }}>
            <div style={{ position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid var(--admin-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-primary)' }}>Détails de la notification</h2>
              <button type="button"
                onClick={() => setSelectedNotification(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-secondary)', fontSize: '18px' }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '24px', space: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Template
                </label>
                <p style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>{selectedNotification.template}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Destinataire
                </label>
                <p style={{ fontSize: '14px', color: 'var(--admin-text-primary)', wordBreak: 'break-all' }}>{selectedNotification.recipient}</p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Canal
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedNotification.channel === 'EMAIL' && <Mail className="w-4 h-4" />}
                  {selectedNotification.channel === 'SMS' && <MessageSquare className="w-4 h-4" />}
                  {selectedNotification.channel === 'PUSH' && <Bell className="w-4 h-4" />}
                  <span style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>
                    {channelConfig[selectedNotification.channel]?.label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Statut
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedNotification.status === 'PENDING' && <Clock className="w-4 h-4" />}
                  {selectedNotification.status === 'SENT' && <Send className="w-4 h-4" />}
                  {selectedNotification.status === 'DELIVERED' && <CheckCircle className="w-4 h-4" />}
                  {selectedNotification.status === 'FAILED' && <AlertCircle className="w-4 h-4" />}
                  <span style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>
                    {statusConfig[selectedNotification.status]?.label}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Envoyé le
                </label>
                <p style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>
                  {formatDateTime(selectedNotification.sentAt)}
                </p>
              </div>

              {selectedNotification.deliveredAt && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Délivré le
                  </label>
                  <p style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>
                    {formatDateTime(selectedNotification.deliveredAt)}
                  </p>
                </div>
              )}

              {selectedNotification.errorMessage && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Message d'erreur
                  </label>
                  <p style={{ fontSize: '14px', color: 'var(--admin-coral)', background: 'var(--admin-coral-soft)', padding: '8px', borderRadius: '4px' }}>
                    {selectedNotification.errorMessage}
                  </p>
                </div>
              )}

              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--admin-border)' }}>
                <button type="button"
                  className="admin-btn-secondary"
                  onClick={() => setSelectedNotification(null)}
                  style={{ width: '100%', padding: '10px 16px' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
