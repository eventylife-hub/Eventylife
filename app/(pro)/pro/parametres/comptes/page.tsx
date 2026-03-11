'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SecuritySettings {
  id: string;
  proId: string;
  lastPasswordChange?: string;
  twoFactorEnabled: boolean;
  loginAttempts: number;
  maxLoginAttempts: number;
  accountLocked: boolean;
  passwordExpiryDays: number;
  sessionTimeout: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
}

/**
 * Page Paramètres Comptes - Sécurité et authentification
 *
 * Affiche:
 * - Paramètres de sécurité (2FA, mot de passe)
 * - Clés API
 * - Sessions actives
 * - Tentatives de connexion
 *
 * États UI:
 * - Loading: Skeleton
 * - Error: Données démo affichées
 * - Data: Formulaire sécurité
 */
export default function ComptesPage() {
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        setLoading(true);
        const [secRes, keysRes] = await Promise.all([
          fetch('/api/pro/security-settings', { credentials: 'include' }),
          fetch('/api/pro/api-keys', { credentials: 'include' }),
        ]);

        if (!secRes.ok) throw new Error('Erreur lors du chargement des paramètres');
        if (!keysRes.ok) throw new Error('Erreur lors du chargement des clés');

        const secData = await secRes.json() as SecuritySettings;
        const keysData = await keysRes.json() as Record<string, unknown>;

        setSecurity(secData);
        setApiKeys(Array.isArray(keysData) ? keysData as ApiKey[] : []);
      } catch {
        console.warn('API sécurité indisponible — données démo');
        setSecurity({
          id: 'sec_001',
          proId: 'pro_001',
          lastPasswordChange: '2026-02-15T10:00:00Z',
          twoFactorEnabled: true,
          loginAttempts: 2,
          maxLoginAttempts: 5,
          accountLocked: false,
          passwordExpiryDays: 90,
          sessionTimeout: 3600,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2026-03-11T10:00:00Z',
        });
        setApiKeys([
          {
            id: 'key_001',
            name: 'Integration Slack',
            key: 'sk_live_51H...***',
            lastUsed: '2026-03-11T15:30:00Z',
            createdAt: '2026-01-20T10:00:00Z',
          },
          {
            id: 'key_002',
            name: 'Synchronisation Compta',
            key: 'sk_test_51H...***',
            lastUsed: '2026-03-10T12:15:00Z',
            createdAt: '2026-02-01T09:00:00Z',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSecuritySettings();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="pro-page-title">Comptes & Sécurité</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Gérez votre authentification et l&apos;accès à votre compte</p>
        </div>

        {/* Sécurité */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Sécurité</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Paramètres d&apos;authentification et de sécurité</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Mot de passe */}
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E0E0E0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Mot de passe</p>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    Changé le {security?.lastPasswordChange ? new Date(security.lastPasswordChange).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
                <button type="button" className="pro-btn-sun">
                  Changer le mot de passe
                </button>
              </div>
            </div>

            {/* Double authentification */}
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Authentification à deux facteurs (2FA)</p>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  {security?.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                </p>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: security?.twoFactorEnabled ? '#DCFCE7' : '#FEE2E2',
                  color: security?.twoFactorEnabled ? '#166534' : '#991B1B',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                {security?.twoFactorEnabled ? '✓ Activée' : 'Désactivée'}
              </div>
            </div>

            {/* Statut compte */}
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E0E0E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>État du compte</p>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  {security?.accountLocked ? 'Verrouillé' : 'Actif'}
                </p>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: security?.accountLocked ? '#FEE2E2' : '#DCFCE7',
                  color: security?.accountLocked ? '#991B1B' : '#166534',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                {security?.accountLocked ? 'Verrouillé' : '✓ Actif'}
              </div>
            </div>

            {/* Tentatives de connexion */}
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628', marginBottom: '12px' }}>Tentatives de connexion</p>
              <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#64748B' }}>Tentatives échouées</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>
                  {security?.loginAttempts || 0} / {security?.maxLoginAttempts || 5}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clés API */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="pro-panel-title">Clés API</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Intégrations et accès programmatique</p>
            </div>
            <button type="button" className="pro-btn-sun">
              Créer une clé
            </button>
          </div>

          {apiKeys.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead style={{ borderBottom: '1px solid #E0E0E0', backgroundColor: '#F9FAFB' }}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Nom</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Clé</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Créée le</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628' }}>Dernier accès</th>
                    <th style={{ paddingBottom: '12px', fontWeight: 600, color: '#0A1628', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', fontWeight: 500, color: '#0A1628' }}>{key.name}</td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B', fontFamily: 'monospace', fontSize: '12px' }}>
                        {key.key}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B' }}>
                        {new Date(key.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', color: '#64748B' }}>
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString('fr-FR') : 'Jamais utilisée'}
                      </td>
                      <td style={{ paddingTop: '12px', paddingBottom: '12px', textAlign: 'right' }}>
                        <button type="button" className="pro-btn-outline" style={{ padding: '4px 12px', fontSize: '12px' }}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <p style={{ color: '#64748B', marginBottom: '16px' }}>Aucune clé API créée</p>
              <button type="button" className="pro-btn-sun">
                Créer votre première clé
              </button>
            </div>
          )}
        </div>

        {/* Sessions actives */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Sessions actives</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Appareils et navigateurs avec accès à votre compte</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Chrome sur macOS</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Dernière utilisation: Aujourd&apos;hui à 14h30</p>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              >
                ✓ Actif
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>Safari sur iPhone</p>
                <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Dernière utilisation: Hier à 10h15</p>
              </div>
              <button type="button" className="pro-btn-outline" style={{ padding: '4px 12px', fontSize: '12px' }}>
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
