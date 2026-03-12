'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { ToastNotification } from '@/components/ui/toast-notification';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
/**
 * Page Pro - Bilan du voyage post-voyage
 * Résumé financier, stats, avis, actions
 */
export default function TravelBilanPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [dashboard, setDashboard] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, [travelId]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/post-sale/travel/${travelId}/dashboard`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const data = await response.json();
      setDashboard(data.data);
      setError(null);
    } catch (err: unknown) {
      logger.warn('API /api/post-sale/travel/{id}/dashboard indisponible — données démo');
      // Fallback demo data
      const demoDashboard: Record<string, unknown> = {
        travel: {
          id: travelId,
          title: 'Circuit Provence & Côte d\'Azur',
          description: 'Un voyage mémorable à travers les plus beaux paysages du sud',
        },
        statistics: {
          totalRevenueCents: 89900, // 899€
          totalBookings: 24,
          confirmedBookings: 22,
          occupancyRate: 91.67,
        },
        feedbacks: {
          totalFeedbacks: 20,
          averageRating: 4.6,
          ratingDistribution: {
            '5': 14,
            '4': 4,
            '3': 2,
            '2': 0,
            '1': 0,
          },
        },
        actions: {
          canGenerateReport: true,
          canSendBilan: true,
          canArchive: false,
        },
      };
      setDashboard(demoDashboard);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBilan = async () => {
    try {
      setSending(true);
      const response = await fetch(`/api/post-sale/travel/${travelId}/send-bilan`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l&apos;envoi");
      }

      setToastMessage({ type: 'success', message: 'Emails de bilan envoyés à tous les participants' });
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: extractErrorMessage(err, 'Erreur inconnue') });
    } finally {
      setSending(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`/api/post-sale/travel/${travelId}/report`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-voyage-${travelId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setToastMessage({ type: 'error', message: extractErrorMessage(err, 'Erreur inconnue') });
    }
  };

  if (loading) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', border: '4px solid #E8F7FC', borderTop: '4px solid #0077B6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#4A5568' }}>Chargement du bilan...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
        <p style={{ color: '#4A5568' }}>Voyage non trouvé</p>
      </div>
    );
  }

  return (
    <div className="pro-fade-in min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #FEFCF3 0%, #F0E6D8 100%)' }}>
    <div style={{ maxWidth: '60rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '0.5rem' }}>{(dashboard?.travel as unknown)?.title || 'Voyage'}</h1>
      <p style={{ color: '#4A5568', marginBottom: '2rem' }}>Bilan de voyage</p>

      {error && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#FFE0E3', border: '1px solid #E63946', borderRadius: '0.5rem', color: 'var(--pro-coral)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Financier */}
        <div className="pro-panel">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1rem', margin: 0 }}>Résumé Financier</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Chiffre d&apos;affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(((dashboard?.statistics as unknown)?.totalRevenueCents as number) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="pro-panel">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1rem', margin: 0 }}>Statistiques Participants</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-gray-900">{((dashboard?.statistics as unknown)?.totalBookings as number) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmés</span>
              <span className="font-bold text-gray-900">
                {((dashboard?.statistics as unknown)?.confirmedBookings as number) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taux remplissage</span>
              <span className="font-bold text-gray-900">
                {(((dashboard?.statistics as unknown)?.occupancyRate as number) || 0).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Avis */}
        <div className="pro-panel">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1rem', margin: 0 }}>Avis Clients</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nombre d&apos;avis</p>
              <p className="text-2xl font-bold text-gray-900">
                {((dashboard?.feedbacks as unknown)?.totalFeedbacks as number) || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">
                  {(((dashboard?.feedbacks as unknown)?.averageRating as number) || 0).toFixed(1)}
                </span>
                <span className="text-lg text-yellow-500">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        {Object.keys(((dashboard?.feedbacks as unknown)?.ratingDistribution as Record<string, unknown>) || {}).length > 0 && (
          <div className="pro-panel">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1rem', margin: 0 }}>Distribution des Notes</h2>
            <div className="space-y-2">
              {Object.entries(((dashboard?.feedbacks as unknown)?.ratingDistribution as Record<string, unknown>) || {}).map(
                ([rating, count]: [string, unknown]) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-8 text-center font-medium text-gray-700">{rating}/5</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(((count as number) || 0) / (((dashboard?.feedbacks as unknown)?.totalFeedbacks as number) || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-gray-600">{count as string}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pro-panel">
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0A1628', marginBottom: '1rem', margin: 0 }}>Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {((dashboard?.actions as unknown)?.canGenerateReport as boolean) && (
            <button type="button"
              onClick={handleGenerateReport}
              className="pro-btn-sun"
            >
              📄 Générer le rapport PDF
            </button>
          )}

          {((dashboard?.actions as unknown)?.canSendBilan as boolean) && (
            <button type="button"
              onClick={handleSendBilan}
              disabled={sending}
              className="pro-btn-ocean"
              style={{ opacity: sending ? 0.5 : 1 }}
            >
              {sending ? 'Envoi en cours...' : '📧 Envoyer bilan aux participants'}
            </button>
          )}

          {((dashboard?.actions as unknown)?.canArchive as boolean) && (
            <button type="button"
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir archiver ce voyage ?')) {
                  // Appel pour archiver
                }
              }}
              className="pro-btn-outline"
            >
              📦 Archiver le voyage
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <ToastNotification
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
    </div>
  );
}
