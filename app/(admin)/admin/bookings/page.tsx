'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
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
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
        <p className="text-gray-600 mt-2">
          Recherchez et gérez les réservations clients
        </p>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-lg border flex justify-between items-center ${
            toastMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{toastMessage.message}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 text-sm font-medium hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Chercher (ref, email, voyage)
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ex: BK-001234"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Statut
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="HOLD">En attente</SelectItem>
                    <SelectItem value="PARTIALLY_PAID">Partiellement payé</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmé</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                    <SelectItem value="EXPIRED">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Du
                </label>
                <Input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Au
                </label>
                <Input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="default">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateRangeStart('');
                  setDateRangeEnd('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tableau des réservations */}
      <Card>
        <CardContent className="p-6">
          {/* Erreur */}
          {error && (
            <div className="mb-6">
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="ml-3 text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button
                  onClick={() => fetchBookings()}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Réessayer
                </Button>
              </div>
            </div>
          )}

          {/* Chargement */}
          {loading && !error && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
              <Skeleton className="h-10 rounded-lg mb-4" />
              <Skeleton className="h-12 rounded-lg mb-2" />
              <Skeleton className="h-12 rounded-lg mb-2" />
              <Skeleton className="h-12 rounded-lg mb-2" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          )}

          {/* Contenu */}
          {!loading && !error && (
            <>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Aucune réservation trouvée</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateRangeStart('');
                      setDateRangeEnd('');
                    }}
                    variant="outline"
                  >
                    Réinitialiser les filtres
                  </Button>
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
        </CardContent>
      </Card>

      {/* Modal d'action */}
      {showActionModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold">
                {actionType === 'cancel'
                  ? 'Annuler et Rembourser'
                  : actionType === 'extend'
                  ? 'Prolonger la validité du hold'
                  : 'Marquer en exception manuelle'}
              </h2>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Réservation:</span> {selectedBooking.reference}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.clientName} - {selectedBooking.tripName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Raison (obligatoire pour l'audit)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez la raison de cette action..."
                  rows={4}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowActionModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleAction}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirmer l'action
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
