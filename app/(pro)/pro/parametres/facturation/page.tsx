'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface BillingSettings {
  id: string;
  proId: string;
  invoicePrefix: string;
  invoiceNextNumber: number;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  key: string;
  iban: string;
  bic: string;
  defaultPaymentTerms: number;
  vatRate: number;
  marginRate: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Page Paramètres Facturation - Configuration des paramètres de facturation
 *
 * Affiche:
 * - Paramètres de facturation (numérotation, préfixe)
 * - Coordonnées bancaires (RIB/IBAN)
 * - Taux de TVA et marge
 * - Délais de paiement
 *
 * États UI:
 * - Loading: Skeleton
 * - Error: Données démo affichées
 * - Data: Formulaire paramètres
 */
export default function FacturationPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<BillingSettings | null>(null);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pro/billing-settings', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement des paramètres');

        const data = await res.json() as BillingSettings;
        setSettings(data);
      } catch {
        logger.warn('API facturation indisponible — données démo');
        setSettings({
          id: 'bill_001',
          proId: 'pro_001',
          invoicePrefix: 'FAC',
          invoiceNextNumber: 2451,
          bankName: 'Banque de France',
          bankAccountName: 'Agence Voyages Méditerranée SARL',
          bankAccountNumber: '12345678901234567890',
          bankCode: '30002',
          branchCode: '00001',
          accountNumber: '0123456789',
          key: '12',
          iban: 'FR1430002000010123456789',
          bic: 'BDFEFRPP',
          defaultPaymentTerms: 3060,
          vatRate: 2000,
          marginRate: 2000,
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2026-03-11T10:00:00Z',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ height: 40, width: 256, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 384, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 className="pro-page-title">Facturation</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Paramètres et coordonnées bancaires</p>
        </div>

        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="pro-panel-title">Paramètres de facturation</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Numérotation et identification des factures</p>
            </div>
            <button
              type="button"
              onClick={() => setEditable(!editable)}
              className={editable ? 'pro-btn-outline' : 'pro-btn-sun'}
            >
              {editable ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Numérotation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Préfixe factures</label>
                <input
                  type="text"
                  value={settings?.invoicePrefix || ''}
                  disabled={!editable}
                  className="pro-input"
                  readOnly={!editable}
                  placeholder="FAC"
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Prochain numéro</label>
                <input
                  type="number"
                  value={settings?.invoiceNextNumber || 0}
                  disabled={!editable}
                  className="pro-input"
                  readOnly={!editable}
                />
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#F0F9FF', borderRadius: '8px', border: '1px solid #E0F2FE' }}>
              <p style={{ fontSize: '13px', color: '#0369A1' }}>
                <strong>Format:</strong> {settings?.invoicePrefix}-{String(settings?.invoiceNextNumber || 0).padStart(6, '0')}
              </p>
            </div>

            {/* Coordonnées bancaires */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E0E0E0' }}>
              <h3 className="pro-panel-title" style={{ marginBottom: '16px' }}>Coordonnées bancaires</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Banque */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Nom de la banque</label>
                  <input
                    type="text"
                    value={settings?.bankName || ''}
                    disabled={!editable}
                    className="pro-input"
                    readOnly={!editable}
                  />
                </div>

                {/* Titulaire */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Titulaire du compte</label>
                  <input
                    type="text"
                    value={settings?.bankAccountName || ''}
                    disabled={!editable}
                    className="pro-input"
                    readOnly={!editable}
                  />
                </div>

                {/* IBAN */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>IBAN</label>
                  <input
                    type="text"
                    value={settings?.iban || ''}
                    disabled={!editable}
                    className="pro-input"
                    readOnly={!editable}
                    placeholder="FR14..."
                  />
                </div>

                {/* BIC */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>BIC</label>
                  <input
                    type="text"
                    value={settings?.bic || ''}
                    disabled={!editable}
                    className="pro-input"
                    readOnly={!editable}
                  />
                </div>

                {/* RIB complet (optionnel) */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid #E0E0E0' }}>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>RIB (optionnel)</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '4px' }}>Code banque</label>
                      <input
                        type="text"
                        value={settings?.bankCode || ''}
                        disabled={!editable}
                        className="pro-input"
                        readOnly={!editable}
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '4px' }}>Code guichet</label>
                      <input
                        type="text"
                        value={settings?.branchCode || ''}
                        disabled={!editable}
                        className="pro-input"
                        readOnly={!editable}
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '4px' }}>N° compte</label>
                      <input
                        type="text"
                        value={settings?.accountNumber || ''}
                        disabled={!editable}
                        className="pro-input"
                        readOnly={!editable}
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '4px' }}>Clé</label>
                      <input
                        type="text"
                        value={settings?.key || ''}
                        disabled={!editable}
                        className="pro-input"
                        readOnly={!editable}
                        style={{ fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Taux et délais */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E0E0E0' }}>
              <h3 className="pro-panel-title" style={{ marginBottom: '16px' }}>Taux et délais</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Taux TVA (%)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      value={(settings?.vatRate || 0) / 100}
                      disabled={!editable}
                      className="pro-input"
                      readOnly={!editable}
                      step="0.01"
                    />
                    <span style={{ fontSize: '13px', color: '#64748B' }}>%</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Taux marge (%)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      value={(settings?.marginRate || 0) / 100}
                      disabled={!editable}
                      className="pro-input"
                      readOnly={!editable}
                      step="0.01"
                    />
                    <span style={{ fontSize: '13px', color: '#64748B' }}>%</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#0A1628', display: 'block', marginBottom: '8px' }}>Délai de paiement par défaut (jours)</label>
                <input
                  type="number"
                  value={(settings?.defaultPaymentTerms || 0) / 100}
                  disabled={!editable}
                  className="pro-input"
                  readOnly={!editable}
                />
              </div>
            </div>

            {editable && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid #E0E0E0' }}>
                <button type="button" className="pro-btn-outline" onClick={() => setEditable(false)}>
                  Annuler
                </button>
                <button type="button" className="pro-btn-sun">
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
