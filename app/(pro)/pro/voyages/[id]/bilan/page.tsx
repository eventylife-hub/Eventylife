'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, XCircle, X } from 'lucide-react';

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
    } catch (err) {
      setToastMessage({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
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
    } catch (err) {
      setToastMessage({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement du bilan...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Voyage non trouvé</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{(dashboard?.travel as any)?.title || 'Voyage'}</h1>
      <p className="text-gray-600 mb-8">Bilan de voyage</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Financier */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé Financier</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Chiffre d&apos;affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(((dashboard?.statistics as any)?.totalRevenueCents as number) || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Statistiques Participants</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-gray-900">{((dashboard?.statistics as any)?.totalBookings as number) || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmés</span>
              <span className="font-bold text-gray-900">
                {((dashboard?.statistics as any)?.confirmedBookings as number) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taux remplissage</span>
              <span className="font-bold text-gray-900">
                {(((dashboard?.statistics as any)?.occupancyRate as number) || 0).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Avis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Avis Clients</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nombre d&apos;avis</p>
              <p className="text-2xl font-bold text-gray-900">
                {((dashboard?.feedbacks as any)?.totalFeedbacks as number) || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">
                  {(((dashboard?.feedbacks as any)?.averageRating as number) || 0).toFixed(1)}
                </span>
                <span className="text-lg text-yellow-500">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution */}
        {Object.keys(((dashboard?.feedbacks as any)?.ratingDistribution as Record<string, unknown>) || {}).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Distribution des Notes</h2>
            <div className="space-y-2">
              {Object.entries(((dashboard?.feedbacks as any)?.ratingDistribution as Record<string, unknown>) || {}).map(
                ([rating, count]: [string, unknown]) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-8 text-center font-medium text-gray-700">{rating}/5</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${(((count as number) || 0) / (((dashboard?.feedbacks as any)?.totalFeedbacks as number) || 1)) * 100}%`,
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          {((dashboard?.actions as any)?.canGenerateReport as boolean) && (
            <button
              onClick={handleGenerateReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              📄 Générer le rapport PDF
            </button>
          )}

          {((dashboard?.actions as any)?.canSendBilan as boolean) && (
            <button
              onClick={handleSendBilan}
              disabled={sending}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {sending ? 'Envoi en cours...' : '📧 Envoyer bilan aux participants'}
            </button>
          )}

          {((dashboard?.actions as any)?.canArchive as boolean) && (
            <button
              onClick={() => {
                if (confirm('Êtes-vous sûr de vouloir archiver ce voyage ?')) {
                  // Appel pour archiver
                }
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              📦 Archiver le voyage
            </button>
          )}
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
