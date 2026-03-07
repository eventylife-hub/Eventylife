'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ExportCta } from '@/components/admin/export-cta';

interface Cancellation {
  id: string;
  bookingRef: string;
  travelTitle: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  refundAmount: number;
  createdAt: string;
}

/**
 * Page Admin - Liste des demandes d'annulation
 * Tableau avec filtres par statut et actions
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function CancellationsPage() {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCancellations();
  }, [filter]);

  const fetchCancellations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/cancellations?status=${filter}`,
        { credentials: 'include' },
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        throw new Error('Erreur lors du chargement des annulations');
      }

      const data = await response.json();
      setCancellations(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des annulations');
      setCancellations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
    };

    const labels: Record<string, string> = {
      PENDING: 'En attente',
      APPROVED: 'Approuvée',
      REJECTED: 'Refusée',
      REFUNDED: 'Remboursée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement des annulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestion des Annulations</h1>
          <p className="text-gray-600">
            Approuvez ou refusez les demandes d'annulation, gérez les remboursements
          </p>
        </div>
        <ExportCta exportType="participants_csv" label="Exporter annulations" />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="mb-6 flex gap-3">
        {['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status === 'PENDING' && 'En attente'}
            {status === 'APPROVED' && 'Approuvées'}
            {status === 'REJECTED' && 'Refusées'}
            {status === 'REFUNDED' && 'Remboursées'}
          </button>
        ))}
      </div>

      {/* Tableau */}
      {cancellations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Aucune annulation pour ce filtre</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Voyage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date demande
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Montant payé
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {cancellations.map((cancellation: Cancellation) => (
                <tr key={cancellation.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {cancellation.clientFirstName} {cancellation.clientLastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cancellation.clientEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{cancellation.travelTitle}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(cancellation.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {formatPrice(cancellation.refundAmount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(cancellation.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/annulations/${cancellation.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
