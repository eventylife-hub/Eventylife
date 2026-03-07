'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
          const data = await settingsRes.json();
          const validSettings = (data as Array<{key: string; value: string; description?: string}>).map<Setting>((s) => ({
            key: s.key,
            value: s.value ?? '',
            description: s.description,
          }));
          setSettings(validSettings);
        }

        if (flagsRes.ok) {
          const data = await flagsRes.json();
          setFeatureFlags(data);
        }
      } catch (_error) {
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
    } catch (err) {
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
    } catch (err) {
      console.error('Flag save error:', err);
      setToastMessage({ type: 'error', message: 'Erreur lors de la sauvegarde du flag' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">
          Gérez les paramètres de l'application et les feature flags
        </p>
      </div>

      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Paramètres généraux</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.key} className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {setting.key}
                </label>
                {setting.key.toLowerCase().includes('email') ||
                setting.key.toLowerCase().includes('url') ? (
                  <Input
                    type={
                      setting.key.toLowerCase().includes('email')
                        ? 'email'
                        : 'url'
                    }
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.value)
                    }
                  />
                ) : (
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    value={editedSettings[setting.key] || setting.value}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.value)
                    }
                  />
                )}
              </div>
              <Button
                size="sm"
                onClick={() => handleSaveSetting(setting.key)}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Feature Flags</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {featureFlags.map((flag) => {
            const key = flag.key as string;
            const enabled = flag.enabled as boolean;
            const description = flag.description as string | undefined;
            return (
              <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{key}</p>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedFlags[key] !== undefined ? editedFlags[key] : enabled}
                    onChange={(e) =>
                      handleFlagToggle(key, e.target.checked)
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
                  <Button
                    size="sm"
                    onClick={() => handleSaveFlag(key)}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
