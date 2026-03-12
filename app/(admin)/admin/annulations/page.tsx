'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ExportCta } from '@/components/admin/export-cta';
import { logger } from '@/lib/logger';
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

// Fallback demo data — utilisé en cas d'API indisponible
const FALLBACK_CANCELLATIONS_PENDING: Cancellation[] = [
  {
    id: 'canc_1',
    bookingRef: 'EVT-2026-004',
    travelTitle: 'Séjour Marrakech 5j/4n',
    clientFirstName: 'Marie',
    clientLastName: 'Dubois',
    clientEmail: 'marie.dubois@email.com',
    reason: 'Raison personnelle',
    status: 'PENDING',
    refundAmount: 1890,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'canc_2',
    bookingRef: 'EVT-2026-005',
    travelTitle: 'Circuit Italie 7j/6n',
    clientFirstName: 'Jean',
    clientLastName: 'Martin',
    clientEmail: 'jean.martin@email.com',
    reason: 'Problème de santé',
    status: 'PENDING',
    refundAmount: 2450,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const FALLBACK_CANCELLATIONS_APPROVED: Cancellation[] = [
  {
    id: 'canc_3',
    bookingRef: 'EVT-2026-006',
    travelTitle: 'Croisière Méditerranée',
    clientFirstName: 'Sophie',
    clientLastName: 'Laurent',
    clientEmail: 'sophie.laurent@email.com',
    reason: 'Changement de plans',
    status: 'APPROVED',
    refundAmount: 3200,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const FALLBACK_CANCELLATIONS_REJECTED: Cancellation[] = [
  {
    id: 'canc_4',
    bookingRef: 'EVT-2026-007',
    travelTitle: 'Safari Kenya 8j/7n',
    clientFirstName: 'Pierre',
    clientLastName: 'Fournier',
    clientEmail: 'pierre.fournier@email.com',
    reason: 'Problème administratif',
    status: 'REJECTED',
    refundAmount: 0,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const FALLBACK_CANCELLATIONS_REFUNDED: Cancellation[] = [
  {
    id: 'canc_5',
    bookingRef: 'EVT-2026-008',
    travelTitle: 'Weekend Paris',
    clientFirstName: 'Anne',
    clientLastName: 'Bernard',
    clientEmail: 'anne.bernard@email.com',
    reason: 'Annulation acceptée',
    status: 'REFUNDED',
    refundAmount: 1200,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
    } catch (err: unknown) {
      logger.warn('API Annulations indisponible — données démo');
      let demoData: Cancellation[] = [];
      if (filter === 'PENDING') {
        demoData = FALLBACK_CANCELLATIONS_PENDING;
      } else if (filter === 'APPROVED') {
        demoData = FALLBACK_CANCELLATIONS_APPROVED;
      } else if (filter === 'REJECTED') {
        demoData = FALLBACK_CANCELLATIONS_REJECTED;
      } else if (filter === 'REFUNDED') {
        demoData = FALLBACK_CANCELLATIONS_REFUNDED;
      }
      setCancellations(demoData);
      setError(null);
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
      <>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ height: 32, width: 280, borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 48, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ height: 200, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </div>
      </>
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
        <div className="admin-fade-in p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
          <span className="text-red-800">{error}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => fetchCancellations()} className="admin-btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              Réessayer
            </button>
            <button type="button" onClick={() => setError(null)} className="admin-btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres par statut</h3>
        </div>
        <div className="admin-panel-body">
          <div className="flex gap-3 flex-wrap">
            {['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'].map((status) => (
              <button type="button"
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
