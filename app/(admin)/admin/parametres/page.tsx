'use client';

import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, XCircle, X } from 'lucide-react';
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const [settingsRes, flagsRes] = await Promise.all([
          fetch('/api/admin/settings', { credentials: 'include' }),
          fetch('/api/admin/feature-flags', { credentials: 'include' }),
        ]);

        if (settingsRes.ok) {
          const data = (await settingsRes.json() as unknown) as unknown;
          const validSettings = (data as Array<{key: string; value: string; description?: string}>).map<Setting>((s) => ({
            key: s.key,
            value: s.value ?? '',
            description: s.description,
          }));
          setSettings(validSettings);
        }

        if (flagsRes.ok) {
          const data = (await flagsRes.json() as unknown) as unknown;
          setFeatureFlags(data);
        }
      } catch (_error: unknown) {
        // Erreur silencieuse — les données se chargent au prochain retry
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du paramètre' });
      }
    } catch (err: unknown) {
      console.error('Setting save error:', err);
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
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du flag' });
      }
    } catch (err: unknown) {
      console.error('Flag save error:', err);
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
                <label className="admin-input-label">{setting.key}</label>
                {setting.key.toLowerCase().includes('email') ||
                setting.key.toLowerCase().includes('url') ? (
                  <input
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
                    className="admin-input resize-none"
                    rows={2}
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSettingChange(setting.key, (e.target as HTMLInputElement).value)
                    }
                  />
                )}
              </div>
              <button
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
                  <button
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
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toastMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 p-1 rounded hover:bg-black/5"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
