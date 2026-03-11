'use client';

import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * Composant - Aperçu de facture
 * Affiche un aperçu de facture client ou facture commission avant téléchargement
 */
interface InvoicePreviewProps {
  invoiceType: 'client' | 'pro';
  reference: string;
  date: string;
  client: {
    name: string;
    email: string;
  };
  travel: {
    title: string;
  };
  amounts: {
    totalHT?: number;
    totalTVA?: number;
    totalTTC: number;
    commission?: number;
  };
  paymentHistory?: Array<{
    date: string;
    amount: number;
    status: string;
  }>;
  onDownload?: () => void;
  isPreparing?: boolean;
}

export function InvoicePreview({
  invoiceType,
  reference,
  date,
  client,
  travel,
  amounts,
  paymentHistory,
  onDownload,
  isPreparing = false,
}: InvoicePreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8 space-y-8">
      {/* En-tête */}
      <div className="pb-8 border-b">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {invoiceType === 'client' ? 'FACTURE CLIENT' : 'FACTURE COMMISSION'}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="text-gray-500">Référence</p>
            <p className="font-mono font-bold text-gray-900">{reference}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-bold text-gray-900">{formatDate(date)}</p>
          </div>
        </div>
      </div>

      {/* Client / Informations */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-bold text-gray-900 mb-2">
            {invoiceType === 'client' ? 'Facturer à:' : 'Agence:'}
          </h3>
          <p className="text-gray-700 font-medium">{client.name}</p>
          <p className="text-gray-600 text-sm">{client.email}</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-2">Voyage</h3>
          <p className="text-gray-700">{travel.title}</p>
        </div>
      </div>

      {/* Détails */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-semibold text-gray-900">
                Description
              </th>
              {amounts.totalHT !== undefined && (
                <th className="text-right py-3 font-semibold text-gray-900">
                  Montant HT
                </th>
              )}
              {amounts.totalTVA !== undefined && (
                <th className="text-right py-3 font-semibold text-gray-900">
                  TVA (20%)
                </th>
              )}
              <th className="text-right py-3 font-semibold text-gray-900">
                {invoiceType === 'client' ? 'Montant TTC' : 'Commission'}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 text-gray-700">{travel.title}</td>
              {amounts.totalHT !== undefined && (
                <td className="text-right py-4 text-gray-700">
                  {formatCurrency(amounts.totalHT)}
                </td>
              )}
              {amounts.totalTVA !== undefined && (
                <td className="text-right py-4 text-gray-700">
                  {formatCurrency(amounts.totalTVA)}
                </td>
              )}
              <td className="text-right py-4 font-semibold text-gray-900">
                {formatCurrency(amounts.totalTTC)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2 border-t-2 border-gray-900">
            <span className="font-bold text-gray-900">
              {invoiceType === 'client' ? 'TOTAL TTC' : 'TOTAL COMMISSION'}
            </span>
            <span className="font-bold text-lg text-gray-900">
              {formatCurrency(amounts.totalTTC)}
            </span>
          </div>
        </div>
      </div>

      {/* Historique des paiements (client uniquement) */}
      {invoiceType === 'client' && paymentHistory && paymentHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">
            Historique des Paiements
          </h3>
          <div className="space-y-2">
            {paymentHistory.map((payment: unknown, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  Paiement {idx + 1} - {payment.status}
                </span>
                <span className="text-gray-700 font-medium">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="text-xs text-gray-500 pt-4 border-t">
        <p>Merci pour votre confiance!</p>
      </div>

      {/* Bouton d'action */}
      {onDownload && (
        <button
          onClick={onDownload}
          disabled={isPreparing}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreparing ? 'Préparation...' : '📥 Télécharger PDF'}
        </button>
      )}
    </div>
  );
}
