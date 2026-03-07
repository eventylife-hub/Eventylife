'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/admin/data-table';
import { Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Page de gestion des utilisateurs
 * - Recherche et filtrage en temps réel avec debounce
 * - Pagination complète
 * - Gestion d'erreurs robuste avec retry
 */
export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data: PaginatedResponse = await response.json();
        setUsers(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setPage(data.page || 1);
      } else if (response.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } catch (err) {
      console.error('Users fetch error:', err);
      setError('Impossible de charger les utilisateurs. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 when filters change
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: DataTableColumn<User>[] = [
    {
      key: 'firstName',
      label: 'Nom',
      render: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'role',
      label: 'Rôle',
      render: (value: unknown) => {
        const roleColors: Record<string, string> = {
          ADMIN: 'bg-red-100 text-red-800',
          PRO: 'bg-purple-100 text-purple-800',
          CLIENT: 'bg-blue-100 text-blue-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[value as string] || 'bg-gray-100 text-gray-800'}`}>
            {value as string}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Inscrit le',
      render: (value) => formatDate(value as string | Date),
    },
    {
      key: 'isActive',
      label: 'Statut',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: 'Détails',
      onClick: (row: User) => {
        window.location.href = `/admin/utilisateurs/${row.id}`;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600 mt-2">
            {total > 0 ? `${total} utilisateurs` : 'Recherchez, filtrez et gérez les utilisateurs de la plateforme'}
          </p>
        </div>
        {error && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchUsers()}
            className="gap-2 flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </Button>
        )}
      </div>

      {/* Affichage erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="text-sm text-red-700 mt-1">Vérifiez votre connexion et réessayez.</p>
          </div>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row items-end">
            {/* Recherche */}
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Nom, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Filtre rôle */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Tous les rôles</option>
                <option value="CLIENT">Client</option>
                <option value="PRO">Pro</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Filtre statut */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <option value="">Tous les statuts</option>
                <option value="true">Actifs</option>
                <option value="false">Inactifs</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            emptyMessage={search || roleFilter || statusFilter ? 'Aucun utilisateur ne correspond aux critères' : 'Aucun utilisateur trouvé'}
            rowActions={rowActions}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || loading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || loading}
              className="gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
