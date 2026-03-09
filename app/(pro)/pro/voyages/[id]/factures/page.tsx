'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Travel {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

/**
 * Page Pro - Gestion des factures du voyage
 * Facture commission Eventy, liste factures clients, export groupé
 */
export default function InvoicesPage() {
  const params = useParams();
  const travelId = params.id as string;

  const [travel, setTravel] = useState<Travel | null>(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [travelId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer le voyage
      const travelResponse = await fetch(`/api/travels/${travelId}`, { credentials: 'include' });
      if (travelResponse.ok) {
        const travelData = await travelResponse.json();
        setTravel(travelData.data);
      }

      // Récupérer les groupes de réservation
      const bookingsResponse = await fetch(`/api/travels/${travelId}/bookings`, { credentials: 'include' });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.data || []);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProInvoice = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/post-sale/travel/${travelId}/pro-invoice`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-commission-${travelId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setToastMessage({ type: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue' });
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClientInvoice = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/post-sale/booking/${bookingId}/invoice`, { credentials: 'include' });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-client-${bookingId.substring(0, 8)}.pdf`;
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
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Voyage non trouvé</p>
      </div>
    );
  }

  // Calcul total commission (15% par défaut)
  const totalRevenue = bookings.reduce((sum: number, bg: Record<string, unknown>) => sum + ((bg.paidAmountCents as number) || 0), 0);
  const commissionRate = 15;
  const commissionAmount = Math.floor((totalRevenue * commissionRate) / 100);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{travel.title}</h1>
      <p className="text-gray-600 mb-8">Gestion des factures</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Facture Commission */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Facture Commission Eventy</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Chiffre d&apos;affaires</p>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Commission ({commissionRate}%)</p>
            <p className="text-2xl font-bold text-red-600">{formatPrice(commissionAmount)}</p>
          </div>
        </div>

        <button
          onClick={handleDownloadProInvoice}
          disabled={downloading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {downloading ? 'Téléchargement...' : '📥 Télécharger facture commission'}
        </button>
      </div>

      {/* Factures Clients */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Factures Clients</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-600">Aucune réservation pour ce voyage</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Date de réservation
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: Record<string, unknown>) => (
                  <tr key={booking.id as string} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {((booking.createdByUser as any)?.firstName as string) || ''} {((booking.createdByUser as any)?.lastName as string) || ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {((booking.createdByUser as any)?.email as string) || ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {formatDate((booking.createdAt as string | Date) || '')}
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      {formatPrice((booking.paidAmountCents as number) || 0)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (booking.status as string) === 'FULLY_PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {(booking.status as string) === 'FULLY_PAID' ? 'Payée' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDownloadClientInvoice(booking.id as string)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
