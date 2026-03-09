'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { AlertCircle, Search, X, Clock, XCircle } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface Booking {
  id: string;
  reference: string;
  clientEmail: string;
  clientName: string;
  tripName: string;
  roomType: string;
  amountTTC: number;
  paymentStatus: 'HOLD' | 'PARTIALLY_PAID' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';
  holdExpires: string;
  createdAt: string;
}

/**
 * Page Admin Bookings - Recherche et support des réservations
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [tripFilter, setTripFilter] = useState('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'extend' | 'exception' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const statusConfig = {
    HOLD: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    PARTIALLY_PAID: { label: 'Partiellement payé', color: 'bg-blue-100 text-blue-800' },
    CONFIRMED: { label: 'Confirmé', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
    EXPIRED: { label: 'Expiré', color: 'bg-gray-100 text-gray-800' },
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (tripFilter !== 'all') params.append('trip', tripFilter);
      if (dateRangeStart) params.append('startDate', dateRangeStart);
      if (dateRangeEnd) params.append('endDate', dateRangeEnd);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      } else {
        setError('Erreur lors du chargement des réservations');
      }
    } catch (_error) {
      setError('Une erreur est survenue lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, tripFilter, dateRangeStart, dateRangeEnd]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleAction = async () => {
    if (!selectedBooking || !actionType || !actionReason.trim()) {
      setToastMessage({ type: 'error', message: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      let endpoint = '';
      let method = 'POST';
      let body: Record<string, string> = { reason: actionReason };

      if (actionType === 'cancel') {
        endpoint = `/api/admin/bookings/${selectedBooking.id}/cancel`;
      } else if (actionType === 'extend') {
        endpoint = `/api/admin/bookings/${selectedBooking.id}/extend-hold`;
      } else if (actionType === 'exception') {
        endpoint = `/api/admin/bookings/${selectedBooking.id}/mark-exception`;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setToastMessage({ type: 'success', message: 'Action exécutée avec succès' });
        setShowActionModal(false);
        setActionReason('');
        fetchBookings();
      } else {
        setToastMessage({ type: 'error', message: 'Erreur lors de l\'exécution de l\'action' });
      }
    } catch (_error) {
      setToastMessage({ type: 'error', message: 'Erreur lors de l\'action' });
    }
  };

  const columns: DataTableColumn<Booking>[] = [
    {
      key: 'reference',
      label: 'Référence',
      render: (value: unknown) => <span className="font-mono text-sm">{value as string}</span>,
    },
    {
      key: 'clientName',
      label: 'Client',
      render: (value: unknown, row: Booking) => (
        <div className="text-sm">
          <div className="font-medium">{value as string}</div>
          <div className="text-gray-500">{row.clientEmail}</div>
        </div>
      ),
    },
    {
      key: 'tripName',
      label: 'Voyage',
    },
    {
      key: 'roomType',
      label: 'Type de chambre',
    },
    {
      key: 'amountTTC',
      label: 'Montant TTC',
      render: (value: unknown) => <span className="font-semibold">{formatPrice(value as number)}</span>,
    },
    {
      key: 'paymentStatus',
      label: 'Statut paiement',
      render: (value: unknown) => {
        const config = statusConfig[(value as string) as keyof typeof statusConfig];
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100'}`}>
            {config?.label || String(value)}
          </span>
        );
      },
    },
    {
      key: 'holdExpires',
      label: 'Validité hold',
      render: (value: unknown) => formatDate(value as string | Date),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Réservations</div>
          <h1 className="admin-page-title">Réservations</h1>
        </div>
      </div>

      {toastMessage && (
        <div
          className="admin-alert-bar"
          style={{
            background: toastMessage.type === 'success' ? 'var(--admin-mint-soft)' : 'var(--admin-coral-soft)',
            borderColor: toastMessage.type === 'success' ? 'var(--admin-mint)' : 'var(--admin-coral)',
            color: toastMessage.type === 'success' ? 'var(--admin-success)' : 'var(--admin-coral)',
          }}
        >
          <span>{toastMessage.message}</span>
          <button className="ml-4 text-sm font-medium hover:underline" onClick={() => setToastMessage(null)}>
            Fermer
          </button>
        </div>
      )}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres</h3>
        </div>
        <div className="admin-panel-body space-y-4">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="admin-kpi-label block mb-2">Chercher (ref, email, voyage)</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'var(--admin-text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Ex: BK-001234"
                    className="admin-input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="admin-kpi-label block mb-2">Statut</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input">
                  <option value="all">Tous les statuts</option>
                  <option value="HOLD">En attente</option>
                  <option value="PARTIALLY_PAID">Partiellement payé</option>
                  <option value="CONFIRMED">Confirmé</option>
                  <option value="CANCELLED">Annulé</option>
                  <option value="EXPIRED">Expiré</option>
                </select>
              </div>

              <div>
                <label className="admin-kpi-label block mb-2">Du</label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-kpi-label block mb-2">Au</label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search className="w-4 h-4" />
                Rechercher
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateRangeStart('');
                  setDateRangeEnd('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Réservations</h3>
        </div>
        <div className="admin-panel-body">
          {error && (
            <div className="admin-alert-bar danger mb-6">
              <span>{error}</span>
              <button className="ml-4 text-sm font-medium hover:underline" onClick={() => fetchBookings()}>
                Réessayer
              </button>
            </div>
          )}

          {loading && !error && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-secondary)' }}>
              Chargement des réservations...
            </div>
          )}

          {!loading && !error && (
            <>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--admin-text-secondary)' }}>
                  <AlertCircle className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--admin-text-muted)' }} />
                  <p style={{ marginBottom: '16px', fontWeight: '500' }}>Aucune réservation trouvée</p>
                  <button
                    className="admin-btn-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateRangeStart('');
                      setDateRangeEnd('');
                    }}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={bookings}
                  loading={false}
                  emptyMessage="Aucune réservation trouvée"
                  rowActions={[
                    {
                      label: 'Annuler + Rembourser',
                      onClick: (row) => {
                        setSelectedBooking(row);
                        setActionType('cancel');
                        setShowActionModal(true);
                      },
                    },
                    {
                      label: 'Prolonger hold',
                      onClick: (row) => {
                        setSelectedBooking(row);
                        setActionType('extend');
                        setShowActionModal(true);
                      },
                    },
                    {
                      label: 'Exception manuelle',
                      onClick: (row) => {
                        setSelectedBooking(row);
                        setActionType('exception');
                        setShowActionModal(true);
                      },
                    },
                  ]}
                />
              )}
            </>
          )}
        </div>
      </div>

      {showActionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '448px', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-primary)' }}>
                {actionType === 'cancel'
                  ? 'Annuler et Rembourser'
                  : actionType === 'extend'
                  ? 'Prolonger la validité du hold'
                  : 'Marquer en exception manuelle'}
              </h2>
              <button
                onClick={() => setShowActionModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-secondary)', fontSize: '18px' }}
              >
                ×
              </button>
            </div>

            <div style={{ background: 'var(--admin-ocean-light)', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid var(--admin-ocean)' }}>
              <p style={{ fontSize: '14px', color: 'var(--admin-ocean)' }}>
                <span style={{ fontWeight: '600' }}>Réservation:</span> {selectedBooking.reference}
              </p>
              <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                {selectedBooking.clientName} - {selectedBooking.tripName}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                Raison (obligatoire pour l'audit)
              </label>
              <textarea
                style={{
                  width: '100%',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'var(--admin-text-primary)',
                }}
                placeholder="Expliquez la raison de cette action..."
                rows={4}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={() => setShowActionModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAction}
                style={{
                  padding: '10px 16px',
                  background: 'var(--admin-coral)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Confirmer l'action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
