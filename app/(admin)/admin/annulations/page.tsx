'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ExportCta } from '@/components/admin/export-cta';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Annulations | Admin Eventy',
  description: 'Suivi et gestion des demandes d\'annulation',
};

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

      const data = (await response.json() as unknown) as unknown;
      setCancellations(data.data || []);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des annulations');
      setCancellations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      PENDING: { class: 'admin-badge-sun', label: 'En attente' },
      APPROVED: { class: 'admin-badge-mint', label: 'Approuvée' },
      REJECTED: { class: 'admin-badge-coral', label: 'Refusée' },
      REFUNDED: { class: 'admin-badge-ocean', label: 'Remboursée' },
    };

    const badge = badges[status] || { class: 'admin-badge-ocean', label: status };
    return <span className={badge.class}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p style={{ color: 'var(--admin-text-secondary)' }}>Chargement des annulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Annulations</div>
          <h1 className="admin-page-title">Annulations</h1>
        </div>
        <div className="admin-header-actions">
          <ExportCta exportType="participants_csv" label="Exporter annulations" />
        </div>
      </div>

      {error && (
        <div className="admin-alert-bar danger">
          <span>{error}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres par statut</h3>
        </div>
        <div className="admin-panel-body">
          <div className="flex gap-3 flex-wrap">
            {['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'].map((status: unknown) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={filter === status ? 'admin-btn-primary' : 'admin-btn-secondary'}
                style={{
                  background:
                    filter === status
                      ? 'linear-gradient(135deg, var(--admin-accent), var(--admin-accent))'
                      : 'var(--admin-surface)',
                }}
              >
                {status === 'PENDING' && 'En attente'}
                {status === 'APPROVED' && 'Approuvées'}
                {status === 'REJECTED' && 'Refusées'}
                {status === 'REFUNDED' && 'Remboursées'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="admin-panel">
        <div className="admin-panel-body">
          {cancellations.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--admin-text-secondary)' }}>
              Aucune annulation pour ce filtre
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Voyage</th>
                    <th>Date demande</th>
                    <th style={{ textAlign: 'right' }}>Montant payé</th>
                    <th style={{ textAlign: 'center' }}>Statut</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellations.map((cancellation: Cancellation) => (
                    <tr key={cancellation.id}>
                      <td>
                        <div>
                          <p style={{ fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                            {cancellation.clientFirstName} {cancellation.clientLastName}
                          </p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
                            {cancellation.clientEmail}
                          </p>
                        </div>
                      </td>
                      <td style={{ color: 'var(--admin-text-primary)' }}>
                        {cancellation.travelTitle}
                      </td>
                      <td style={{ color: 'var(--admin-text-secondary)' }}>
                        {formatDate(cancellation.createdAt)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '500', color: 'var(--admin-text-primary)' }}>
                        {formatPrice(cancellation.refundAmount)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {getStatusBadge(cancellation.status)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/annulations/${cancellation.id}`}
                          className="admin-section-link"
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
      </div>
    </div>
  );
}
