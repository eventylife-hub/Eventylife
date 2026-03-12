'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface NotificationPreferences {
  id: string;
  proId: string;
  emailNewReservation: boolean;
  emailReservationCancelled: boolean;
  emailPaymentReceived: boolean;
  emailPaymentFailed: boolean;
  emailTravelReminder: boolean;
  emailWeeklyReport: boolean;
  emailMonthlyReport: boolean;
  emailSystemAlerts: boolean;
  emailNewsletterUpdates: boolean;
  smsNewReservation: boolean;
  smsPaymentReminder: boolean;
  smsTravelReminder: boolean;
  pushNotificationsEnabled: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Page Paramètres Notifications - Préférences de notifications
 *
 * Affiche:
 * - Notifications email
 * - Notifications SMS
 * - Notifications push
 * - Fréquence des notifications
 *
 * États UI:
 * - Loading: Skeleton
 * - Error: Données démo affichées
 * - Data: Formulaire préférences
 */
export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    const fetchNotificationPrefs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/pro/notification-preferences', { credentials: 'include' });
        if (!res.ok) throw new Error('Erreur lors du chargement des préférences');

        const data = await res.json() as NotificationPreferences;
        setPrefs(data);
      } catch {
        logger.warn('API notifications indisponible — données démo');
        setPrefs({
          id: 'notif_001',
          proId: 'pro_001',
          emailNewReservation: true,
          emailReservationCancelled: true,
          emailPaymentReceived: true,
          emailPaymentFailed: true,
          emailTravelReminder: true,
          emailWeeklyReport: true,
          emailMonthlyReport: true,
          emailSystemAlerts: true,
          emailNewsletterUpdates: false,
          smsNewReservation: true,
          smsPaymentReminder: false,
          smsTravelReminder: true,
          pushNotificationsEnabled: true,
          notificationFrequency: 'immediate',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2026-03-11T10:00:00Z',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationPrefs();
  }, []);

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      [key]: !(prefs[key] as boolean),
    });
  };

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
          <h1 className="pro-page-title">Notifications</h1>
          <p style={{ color: '#64748B', marginTop: '8px' }}>Gérez vos préférences de notifications</p>
        </div>

        {/* Fréquence */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Fréquence des notifications</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['immediate', 'daily', 'weekly'].map((freq) => (
              <label key={freq} style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '1px solid #E0E0E0', borderRadius: '8px', cursor: 'pointer', backgroundColor: prefs?.notificationFrequency === freq ? '#F0F9FF' : '#FFFFFF' }}>
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={prefs?.notificationFrequency === freq}
                  onChange={() => {
                    if (prefs) setPrefs({ ...prefs, notificationFrequency: freq as 'immediate' | 'daily' | 'weekly' });
                  }}
                  style={{ marginRight: '12px', cursor: 'pointer' }}
                />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>
                    {freq === 'immediate' && 'Immédiat'}
                    {freq === 'daily' && 'Quotidien'}
                    {freq === 'weekly' && 'Hebdomadaire'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>
                    {freq === 'immediate' && 'Recevoir les notifications en temps réel'}
                    {freq === 'daily' && 'Recevoir un résumé chaque jour'}
                    {freq === 'weekly' && 'Recevoir un résumé chaque semaine'}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Notifications par email</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Événements importants et rapports</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'emailNewReservation', label: 'Nouvelle réservation', desc: 'Recevoir une notification pour chaque nouvelle réservation' },
              { key: 'emailReservationCancelled', label: 'Annulation de réservation', desc: 'Recevoir une notification lors d\'une annulation' },
              { key: 'emailPaymentReceived', label: 'Paiement reçu', desc: 'Confirmation de réception de paiement' },
              { key: 'emailPaymentFailed', label: 'Échec de paiement', desc: 'Alertes en cas d\'échec de paiement' },
              { key: 'emailTravelReminder', label: 'Rappel voyage', desc: 'Rappels avant un voyage programmé' },
              { key: 'emailWeeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé des activités de la semaine' },
              { key: 'emailMonthlyReport', label: 'Rapport mensuel', desc: 'Résumé des activités du mois' },
              { key: 'emailSystemAlerts', label: 'Alertes système', desc: 'Alertes de sécurité et maintenance' },
              { key: 'emailNewsletterUpdates', label: 'Mises à jour de newsletter', desc: 'Actualités et nouveautés Eventy' },
            ].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #E0E0E0' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(key as keyof NotificationPreferences)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: (prefs?.[key as keyof NotificationPreferences] as boolean) ? 'var(--pro-mint)' : '#E0E0E0',
                    color: (prefs?.[key as keyof NotificationPreferences] as boolean) ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {(prefs?.[key as keyof NotificationPreferences] as boolean) ? 'Activé' : 'Désactivé'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SMS */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px' }}>
            <h2 className="pro-panel-title">Notifications par SMS</h2>
            <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Alertes urgentes par message</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'smsNewReservation', label: 'Nouvelle réservation', desc: 'Recevoir un SMS pour chaque nouvelle réservation' },
              { key: 'smsPaymentReminder', label: 'Rappel paiement', desc: 'SMS de rappel pour les paiements attendus' },
              { key: 'smsTravelReminder', label: 'Rappel voyage', desc: 'SMS de rappel avant un voyage' },
            ].map(({ key, label, desc }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #E0E0E0' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0A1628' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(key as keyof NotificationPreferences)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: (prefs?.[key as keyof NotificationPreferences] as boolean) ? 'var(--pro-mint)' : '#E0E0E0',
                    color: (prefs?.[key as keyof NotificationPreferences] as boolean) ? '#FFFFFF' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {(prefs?.[key as keyof NotificationPreferences] as boolean) ? 'Activé' : 'Désactivé'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push */}
        <div className="pro-panel">
          <div style={{ borderBottom: '1px solid #E0E0E0', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="pro-panel-title">Notifications push</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Alertes dans votre navigateur</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (prefs) setPrefs({ ...prefs, pushNotificationsEnabled: !prefs.pushNotificationsEnabled });
              }}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: prefs?.pushNotificationsEnabled ? 'var(--pro-mint)' : '#E0E0E0',
                color: prefs?.pushNotificationsEnabled ? '#FFFFFF' : '#64748B',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {prefs?.pushNotificationsEnabled ? 'Activées' : 'Désactivées'}
            </button>
          </div>

          {prefs?.pushNotificationsEnabled && (
            <p style={{ fontSize: '13px', color: '#0369A1', backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '8px', border: '1px solid #E0F2FE' }}>
              ✓ Les notifications push sont activées. Vous recevrez des alertes importantes sur votre appareil.
            </p>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" className="pro-btn-outline">
            Réinitialiser
          </button>
          <button type="button" className="pro-btn-sun">
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
}
