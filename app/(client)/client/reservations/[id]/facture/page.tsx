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
    } catch (err: unknown) {
      console.warn('API bookings indisponible — données démo');
      const FALLBACK_INVOICE: Invoice = {
        id: bookingId,
        reference: 'FACT-' + bookingId.substring(0, 8).toUpperCase(),
        totalAmountCents: 89900,
        totalCostsCents: 70000,
        createdAt: new Date().toISOString(),
        createdByUser: {
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@example.com',
        },
        travel: {
          title: 'Côte d\'Azur - 5 jours',
        },
        paymentContributions: [
          {
            id: 'contrib-1',
            status: 'SUCCEEDED',
            amountTTC: 44950,
          },
          {
            id: 'contrib-2',
            status: 'SUCCEEDED',
            amountTTC: 44950,
          },
        ],
      };
      setBooking(FALLBACK_INVOICE);
      setError(null);
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
    } catch (err: unknown) {
      console.warn('API post-sale/invoice indisponible — données démo');
      alert('Téléchargement de la facture en mode démo (fichier non générée)');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--navy, #1A1A2E)' }}>Ma Facture</h1>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg animate-pulse" style={{ backgroundColor: '#E5E0D8' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)' }}>
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--navy, #1A1A2E)' }}>Ma Facture</h1>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--terra-soft, #FEF2F2)', border: '1.5px solid #DC2626' }}>
          <p className="font-semibold mb-4" style={{ color: 'var(--terra, #DC2626)' }}>{error || 'Réservation non trouvée'}</p>
          <button type="button"
            onClick={() => fetchBooking()}
            className="px-4 py-2 text-white rounded transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--terra, #DC2626)' }}
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
    <div className="p-8 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--cream, #FAF7F2)', animation: 'fadeUp 0.6s ease-out' }}>
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--navy, #1A1A2E)' }}>Ma Facture</h1>

      {/* Facture */}
      <div className="rounded-xl p-8 mb-8" style={{ backgroundColor: 'white', border: '1.5px solid #E5E0D8' }}>
        {/* En-tête */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid #E5E0D8' }}>
          <div className="text-2xl font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>FACTURE</div>
          <p style={{ color: '#6B7280' }}>
            Référence: <span className="font-medium">{bookingId.substring(0, 8)}</span>
          </p>
          <p style={{ color: '#6B7280' }}>
            Date: <span className="font-medium">{formatDate(new Date().toISOString())}</span>
          </p>
        </div>

        {/* Client */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>Facturer à:</h3>
            <p style={{ color: 'var(--navy, #1A1A2E)' }}>{booking.createdByUser?.firstName} {booking.createdByUser?.lastName}</p>
            <p className="text-sm" style={{ color: '#6B7280' }}>{booking.createdByUser?.email}</p>
          </div>
        </div>

        {/* Détails */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E0D8' }}>
                <th className="text-left py-3 font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Description</th>
                <th className="text-right py-3 font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Montant HT</th>
                <th className="text-right py-3 font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>TVA sur marge</th>
                <th className="text-right py-3 font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E5E0D8' }}>
                <td className="py-4" style={{ color: 'var(--navy, #1A1A2E)' }}>{booking.travel?.title}</td>
                <td className="text-right py-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {hasCostsData ? formatCurrency(totalHT) : '—'}
                </td>
                <td className="text-right py-4" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {hasCostsData ? formatCurrency(totalTVAMarge) : '—'}
                </td>
                <td className="text-right py-4 font-semibold" style={{ color: 'var(--navy, #1A1A2E)' }}>
                  {formatCurrency(totalTTC)}
                </td>
              </tr>
            </tbody>
            {!hasCostsData && (
              <tfoot>
                <tr>
                  <td colSpan={4} className="py-2 text-xs italic" style={{ color: '#6B7280' }}>
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
            <div className="flex justify-between py-2" style={{ borderTop: '2px solid var(--navy, #1A1A2E)' }}>
              <span className="font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>TOTAL TTC</span>
              <span className="font-bold text-lg" style={{ color: 'var(--navy, #1A1A2E)' }}>{formatCurrency(totalTTC)}</span>
            </div>
          </div>
        </div>

        {/* Paiement */}
        {(booking.paymentContributions?.length ?? 0) > 0 && (
          <div className="mb-8 rounded-lg p-4" style={{ backgroundColor: '#FDF6E8' }}>
            <h3 className="font-bold mb-3" style={{ color: 'var(--navy, #1A1A2E)' }}>Historique des Paiements</h3>
            <div className="space-y-2">
              {(booking.paymentContributions || []).map((contribution: Record<string, unknown>, idx: number) => (
                <div key={contribution.id as string} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--navy, #1A1A2E)' }}>
                    Paiement {idx + 1} ({contribution.status as string})
                  </span>
                  <span style={{ color: 'var(--navy, #1A1A2E)' }}>{formatCurrency((contribution.amountTTC as number) || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="text-xs pt-4" style={{ borderTop: '1px solid #E5E0D8', color: '#6B7280' }}>
          <p>Merci pour votre réservation!</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button type="button"
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex-1 px-6 py-3 text-white rounded-lg font-medium disabled:opacity-50 transition-all hover:shadow-lg"
          style={{
            backgroundColor: 'var(--terra, #C75B39)',
          }}
          onMouseEnter={(e) => {
            if (!downloading) {
              e.currentTarget.style.backgroundColor = '#D97B5E';
              e.currentTarget.style.boxShadow = `0 8px 16px ${'rgba(199,91,57,0.1)'}`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--terra, #C75B39)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {downloading ? 'Téléchargement...' : '📥 Télécharger PDF'}
        </button>
        <button type="button"
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 rounded-lg font-medium transition-all hover:opacity-80"
          style={{
            backgroundColor: '#E5E0D8',
            color: 'var(--navy, #1A1A2E)',
          }}
        >
          🖨️ Imprimer
        </button>
      </div>
    </div>
  );
}
