'use client';

import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, XCircle, X } from 'lucide-react';
import { logger } from '@/lib/logger';
import { ToastNotification } from '@/components/ui/toast-notification';
interface Setting {
  key: string;
  value: string;
  description?: string;
}

/**
 * Page Paramètres - Gestion des paramètres et feature flags
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function ParametresPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [featureFlags, setFeatureFlags] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedSettings, setEditedSettings] = useState<Record<string, string>>({});
  const [editedFlags, setEditedFlags] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const [settingsRes, flagsRes] = await Promise.all([
          fetch('/api/admin/settings', { credentials: 'include', signal: controller.signal }),
          fetch('/api/admin/feature-flags', { credentials: 'include', signal: controller.signal }),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json() as Array<{key: string; value: string; description?: string}>;
          const validSettings = data.map<Setting>((s) => ({
            key: s.key,
            value: s.value ?? '',
            description: s.description,
          }));
          setSettings(validSettings);
        } else {
          logger.warn('API admin/settings indisponible — données démo');
          const FALLBACK_SETTINGS: Setting[] = [
            {
              key: 'SITE_NAME',
              value: 'Eventy',
              description: 'Nom du site',
            },
            {
              key: 'SUPPORT_EMAIL',
              value: 'support@eventy.fr',
              description: 'Email de support',
            },
            {
              key: 'MAX_BOOKING_DAYS',
              value: '365',
              description: 'Nombre maximum de jours pour une réservation',
            },
          ];
          setSettings(FALLBACK_SETTINGS);
        }

        if (flagsRes.ok) {
          const data = await flagsRes.json() as Record<string, unknown>[];
          setFeatureFlags(data);
        } else {
          logger.warn('API admin/feature-flags indisponible — données démo');
          const FALLBACK_FLAGS: Record<string, unknown>[] = [
            {
              key: 'ENABLE_BETA_FEATURES',
              enabled: true,
              description: 'Activer les fonctionnalités bêta',
            },
            {
              key: 'ENABLE_PAYMENTS',
              enabled: true,
              description: 'Activer les paiements en ligne',
            },
            {
              key: 'ENABLE_API_PUBLIC',
              enabled: false,
              description: 'Exposer l\'API publique',
            },
          ];
          setFeatureFlags(FALLBACK_FLAGS);
        }
      } catch (_error: unknown) {
        if (_error instanceof DOMException && _error.name === 'AbortError') return;
        logger.warn('API admin/settings et feature-flags indisponible — données démo');
        const FALLBACK_SETTINGS: Setting[] = [
          {
            key: 'SITE_NAME',
            value: 'Eventy',
            description: 'Nom du site',
          },
          {
            key: 'SUPPORT_EMAIL',
            value: 'support@eventy.fr',
            description: 'Email de support',
          },
          {
            key: 'MAX_BOOKING_DAYS',
            value: '365',
            description: 'Nombre maximum de jours pour une réservation',
          },
        ];
        const FALLBACK_FLAGS: Record<string, unknown>[] = [
          {
            key: 'ENABLE_BETA_FEATURES',
            enabled: true,
            description: 'Activer les fonctionnalités bêta',
          },
          {
            key: 'ENABLE_PAYMENTS',
            enabled: true,
            description: 'Activer les paiements en ligne',
          },
          {
            key: 'ENABLE_API_PUBLIC',
            enabled: false,
            description: 'Exposer l\'API publique',
          },
        ];
        setSettings(FALLBACK_SETTINGS);
        setFeatureFlags(FALLBACK_FLAGS);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setEditedSettings({ ...editedSettings, [key]: value });
  };

  const handleFlagToggle = (key: string, enabled: boolean) => {
    setEditedFlags({ ...editedFlags, [key]: enabled });
  };

  const handleSaveSetting = async (key: string) => {
    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: editedSettings[key] }),
      });

      if (response.ok) {
        setSettings(
          settings.map<Setting>((s) =>
            s.key === key ? { ...s, value: editedSettings[key] || '' } : s,
          ),
        );
        setToastMessage({ type: 'success', message: 'Paramètre mis à jour avec succès' });
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du paramètre' });
      }
    } catch (err: unknown) {
      logger.error('Setting save error:', err);
      setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde' });
    }
  };

  const handleSaveFlag = async (key: string) => {
    try {
      const response = await fetch(`/api/admin/feature-flags/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled: editedFlags[key] }),
      });

      if (response.ok) {
        setFeatureFlags(
          featureFlags.map((f) =>
            f.key === key ? { ...f, enabled: editedFlags[key] } : f,
          ),
        );
        setToastMessage({ type: 'success', message: 'Feature flag mis à jour avec succès' });
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du flag' });
      }
    } catch (err: unknown) {
      logger.error('Flag save error:', err);
      setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du flag' });
    }
  };

  if (loading) {
    return (
      <div className="admin-fade-in space-y-6">
        <div className="admin-page-header">
          <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Paramètres
          </h1>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="admin-fade-in space-y-6">
      <div className="admin-page-header">
        <h1 className="admin-page-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
          Paramètres
        </h1>
      </div>

      {/* Paramètres généraux */}
      <div className="admin-panel admin-fade-in delay-1">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Paramètres généraux
          </h3>
        </div>
        <div className="admin-panel-body space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor={`param-${setting.key}`} className="admin-input-label">{setting.key}</label>
                {setting.key.toLowerCase().includes('email') ||
                setting.key.toLowerCase().includes('url') ? (
                  <input
                    id={`param-${setting.key}`}
                    type={
                      setting.key.toLowerCase().includes('email')
                        ? 'email'
                        : 'url'
                    }
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSettingChange(setting.key, (e.target as HTMLInputElement).value)
                    }
                    className="admin-input"
                  />
                ) : (
                  <textarea
                    id={`param-${setting.key}`}
                    className="admin-input resize-none"
                    rows={2}
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSettingChange(setting.key, (e.target as HTMLInputElement).value)
                    }
                  />
                )}
              </div>
              <button type="button"
                onClick={() => handleSaveSetting(setting.key)}
                className="admin-btn-primary gap-2 flex items-center"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags */}
      <div className="admin-panel admin-fade-in delay-2">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title" style={{ fontFamily: 'var(--font-fraunces, Fraunces, serif)' }}>
            Feature Flags
          </h3>
        </div>
        <div className="admin-panel-body space-y-4">
          {featureFlags.map((flag) => {
            const key = flag.key as string;
            const enabled = flag.enabled as boolean;
            const description = flag.description as string | undefined;
            return (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg" style={{ backgroundColor: 'white', borderColor: 'rgba(10,22,40,.04)' }}>
                <div>
                  <p className="font-medium" style={{ color: '#0A1628' }}>{key}</p>
                  <p className="text-sm" style={{ color: '#666' }}>{description}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedFlags[key] !== undefined ? editedFlags[key] : enabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFlagToggle(key, (e.target as HTMLInputElement).checked)
                    }
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-medium">
                    {editedFlags[key] !== undefined
                      ? editedFlags[key]
                      ? 'Activé'
                      : 'Désactivé'
                      : enabled
                        ? 'Activé'
                        : 'Désactivé'}
                  </span>
                </label>
                {editedFlags[key] !== undefined && (
                  <button type="button"
                    onClick={() => handleSaveFlag(key)}
                    className="admin-btn-primary gap-2 flex items-center text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast de notification */}
      {toastMessage && (
        <ToastNotification
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
