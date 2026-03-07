'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Invoice {
  id: string;
  reference: string;
  totalTTC?: number;
  totalAmountCents?: number;
  totalCostsCents?: number;
  createdAt: string;
  createdByUser?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  travel?: {
    title: string;
  };
  paymentContributions?: Array<{
    id: string;
    status: string;
    amountTTC: number;
  }>;
}

/**
 * Page Client - Afficher et télécharger la facture
 */
export default function InvoicePage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Réservation non trouvée');
      }

      const data = await response.json();
      setBooking(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/post-sale/booking/${bookingId}/invoice`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${bookingId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ma Facture</h1>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Ma Facture</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold mb-4">{error || 'Réservation non trouvée'}</p>
          <button
            onClick={() => fetchBooking()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // TVA sur marge : TVA = (CA_TTC − coûts_TTC) × 20/120
  // Le backend fournit totalCostsCents (coûts d'achat TTC)
  // Si absent, on affiche uniquement le TTC sans décomposition TVA
  const totalTTC = booking.totalAmountCents || 0;
  const hasCostsData = typeof booking.totalCostsCents === 'number';
  const marginTTC = hasCostsData ? totalTTC - (booking.totalCostsCents || 0) : 0;
  const totalTVAMarge = hasCostsData ? Math.round(marginTTC * 20 / 120) : 0;
  const totalHT = totalTTC - totalTVAMarge;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ma Facture</h1>

      {/* Facture */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        {/* En-tête */}
        <div className="mb-8 pb-8 border-b">
          <div className="text-2xl font-bold text-gray-900 mb-2">FACTURE</div>
          <p className="text-gray-600">
            Référence: <span className="font-medium">{bookingId.substring(0, 8)}</span>
          </p>
          <p className="text-gray-600">
            Date: <span className="font-medium">{formatDate(new Date().toISOString())}</span>
          </p>
        </div>

        {/* Client */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Facturer à:</h3>
            <p className="text-gray-700">{booking.createdByUser?.firstName} {booking.createdByUser?.lastName}</p>
            <p className="text-gray-600 text-sm">{booking.createdByUser?.email}</p>
          </div>
        </div>

        {/* Détails */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold text-gray-900">Description</th>
                <th className="text-right py-3 font-semibold text-gray-900">Montant HT</th>
                <th className="text-right py-3 font-semibold text-gray-900">TVA sur marge</th>
                <th className="text-right py-3 font-semibold text-gray-900">Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 text-gray-700">{booking.travel?.title}</td>
                <td className="text-right py-4 text-gray-700">
                  {hasCostsData ? formatCurrency(totalHT) : '—'}
                </td>
                <td className="text-right py-4 text-gray-700">
                  {hasCostsData ? formatCurrency(totalTVAMarge) : '—'}
                </td>
                <td className="text-right py-4 font-semibold text-gray-900">
                  {formatCurrency(totalTTC)}
                </td>
              </tr>
            </tbody>
            {!hasCostsData && (
              <tfoot>
                <tr>
                  <td colSpan={4} className="py-2 text-xs text-gray-500 italic">
                    TVA sur marge : le détail HT/TVA sera disponible après validation comptable.
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t-2 border-gray-900">
              <span className="font-bold text-gray-900">TOTAL TTC</span>
              <span className="font-bold text-lg text-gray-900">{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </div>

        {/* Paiement */}
        {(booking.paymentContributions?.length ?? 0) > 0 && (
          <div className="mb-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-gray-900 mb-3">Historique des Paiements</h3>
            <div className="space-y-2">
              {(booking.paymentContributions || []).map((contribution: Record<string, unknown>, idx: number) => (
                <div key={contribution.id as string} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    Paiement {idx + 1} ({contribution.status as string})
                  </span>
                  <span className="text-gray-700">{formatCurrency((contribution.amountTTC as number) || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="text-xs text-gray-500 pt-4 border-t">
          <p>Merci pour votre réservation!</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {downloading ? 'Téléchargement...' : '📥 Télécharger PDF'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400"
        >
          🖨️ Imprimer
        </button>
      </div>
    </div>
  );
}
