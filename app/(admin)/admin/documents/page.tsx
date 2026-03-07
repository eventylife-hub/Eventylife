'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Loader,
  Download,
  Eye,
} from 'lucide-react';
import { Skeleton, SkeletonList } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';

interface AdminDocument {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  userId?: string;
  proProfileId?: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
  proProfile?: {
    displayName: string;
  };
  createdAt: string;
}

/**
 * Page Admin - Gestion des documents
 * Les identifiants de session sont transmis via les cookies httpOnly
 */
export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<AdminDocument | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalReason, setApprovalReason] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/documents', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }

      await fetchDocuments();
      setShowApprovalModal(false);
      setSelectedDocument(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    }
  };

  const handleReject = async (documentId: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: approvalReason }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rejet');
      }

      await fetchDocuments();
      setShowApprovalModal(false);
      setSelectedDocument(null);
      setApprovalReason('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        );
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Approuvé';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.user?.email.toLowerCase().includes(query) ||
      doc.user?.firstName.toLowerCase().includes(query) ||
      doc.proProfile?.displayName.toLowerCase().includes(query);

    const matchesStatus = !statusFilter || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'PENDING').length,
    approved: documents.filter((d) => d.status === 'CONFIRMED').length,
    rejected: documents.filter((d) => d.status === 'REJECTED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des documents
          </h1>
          <p className="text-gray-600">
            Examinez et validez les documents des utilisateurs et des professionnels
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-blue-100 text-blue-700' },
            {
              label: 'En attente',
              value: stats.pending,
              color: 'bg-yellow-100 text-yellow-700',
            },
            {
              label: 'Approuvés',
              value: stats.approved,
              color: 'bg-green-100 text-green-700',
            },
            {
              label: 'Rejetés',
              value: stats.rejected,
              color: 'bg-red-100 text-red-700',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-lg p-4 text-center`}
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="mb-6 flex gap-4 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou professionnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <SkeletonList count={5} height="60px" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun document
            </h3>
            <p className="text-gray-600">
              Aucun document ne correspond à vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Utilisateur / Professionnel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {doc.user
                            ? `${doc.user.firstName} ${doc.user.lastName}`
                            : doc.proProfile?.displayName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.user?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {doc.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="text-sm font-medium text-gray-600">
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(doc.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowApprovalModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-2 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          Examiner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'examen */}
      {showApprovalModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Examiner le document
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nom du document
                </label>
                <p className="text-gray-600">{selectedDocument.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="text-gray-600">{selectedDocument.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Statut actuel
                </label>
                <p className="text-gray-600">
                  {getStatusLabel(selectedDocument.status)}
                </p>
              </div>
            </div>

            {selectedDocument.status === 'PENDING' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motif du rejet (optionnel)
                  </label>
                  <textarea
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entrez un motif si vous rejetez ce document..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedDocument.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(selectedDocument.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Rejeter
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setShowApprovalModal(false);
                setSelectedDocument(null);
                setApprovalReason('');
              }}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
