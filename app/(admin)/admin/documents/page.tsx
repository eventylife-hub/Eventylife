'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { extractErrorMessage } from '@/lib/api-error';
import { FocusTrap } from '@/components/a11y/focus-trap';
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

const FALLBACK_DOCUMENTS: AdminDocument[] = [
  { id: 'doc-1', name: 'Pièce d\'identité - Dupont.pdf', type: 'ID', status: 'CONFIRMED', userId: 'user-1', user: { email: 'jean.dupont@example.com', firstName: 'Jean', lastName: 'Dupont' }, createdAt: '2026-03-09T10:30:00Z' },
  { id: 'doc-2', name: 'Assurance voyage - Martin.pdf', type: 'INSURANCE', status: 'PENDING', userId: 'user-2', user: { email: 'pierre.martin@example.com', firstName: 'Pierre', lastName: 'Martin' }, createdAt: '2026-03-10T14:15:00Z' },
  { id: 'doc-3', name: 'Attestation vaccin - Laurent.pdf', type: 'VACCINATION', status: 'CONFIRMED', userId: 'user-3', user: { email: 'sophie.laurent@example.com', firstName: 'Sophie', lastName: 'Laurent' }, createdAt: '2026-03-08T09:00:00Z' },
  { id: 'doc-4', name: 'Formulaire agence - TravelPro.pdf', type: 'AGENCY_FORM', status: 'PENDING', proProfileId: 'pro-1', proProfile: { displayName: 'TravelPro Voyages' }, createdAt: '2026-03-11T11:20:00Z' },
  { id: 'doc-5', name: 'Contrat d\'assurance - Mercier.pdf', type: 'CONTRACT', status: 'REJECTED', userId: 'user-4', user: { email: 'luc.mercier@example.com', firstName: 'Luc', lastName: 'Mercier' }, createdAt: '2026-03-07T15:45:00Z' },
];

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
    const controller = new AbortController();
    fetchDocuments(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchDocuments = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/documents', {
        credentials: 'include',
        signal,
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      logger.warn('API /api/admin/documents indisponible — données démo');
      setDocuments(FALLBACK_DOCUMENTS);
      setError(null);
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
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Erreur inconnue');
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
    } catch (err: unknown) {
      const message = extractErrorMessage(err, 'Erreur inconnue');
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
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <div className="admin-breadcrumb">Accueil › Documents</div>
          <h1 className="admin-page-title">Docs & Signatures</h1>
        </div>
      </div>

      {error && (
        <div role="alert" className="admin-alert-bar danger">
          <span>{error}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => fetchDocuments()} className="admin-btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              Réessayer
            </button>
            <button type="button" onClick={() => setError(null)} className="admin-btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, bgColor: 'var(--admin-ocean-light)' },
          { label: 'En attente', value: stats.pending, bgColor: 'var(--admin-warning-bg, #FEF3C7)' },
          { label: 'Approuvés', value: stats.approved, bgColor: 'var(--admin-mint-soft)' },
          { label: 'Rejetés', value: stats.rejected, bgColor: 'var(--admin-coral-soft)' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="admin-kpi-card"
            style={{
              background: stat.bgColor,
              textAlign: 'center',
              padding: '16px',
              borderRadius: '10px',
            }}
          >
            <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--admin-text-primary)' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Filtres</h3>
        </div>
        <div className="admin-panel-body">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label htmlFor="doc-search" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                Rechercher
              </label>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '10px', width: '16px', height: '16px', color: 'var(--admin-text-secondary)' }} />
                <input
                  id="doc-search"
                  type="text"
                  placeholder="Par nom, email ou professionnel..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery((e.target as HTMLInputElement).value)}
                  className="admin-input"
                  style={{ paddingLeft: '36px' }}
                />
              </div>
            </div>
            <div style={{ minWidth: '150px' }}>
              <label htmlFor="doc-statusFilter" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', display: 'block', marginBottom: '8px' }}>
                Statut
              </label>
              <select
                id="doc-statusFilter"
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="admin-input"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Approuvés</option>
                <option value="REJECTED">Rejetés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3 className="admin-panel-title">Documents</h3>
        </div>
        <div className="admin-panel-body">
          {loading ? (
            <>
              <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: 40, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                <div style={{ height: 60, width: '100%', borderRadius: 12, background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              </div>
            </>
          ) : filteredDocuments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--admin-text-secondary)' }}>
              <FileText className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--admin-text-muted)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                Aucun document
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                Aucun document ne correspond à vos critères
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <caption className="sr-only">Liste des documents et signatures</caption>
                <thead>
                  <tr>
                    <th scope="col">Document</th>
                    <th scope="col">Utilisateur / Professionnel</th>
                    <th scope="col">Type</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Date</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FileText style={{ width: '20px', height: '20px', color: 'var(--admin-text-muted)' }} />
                          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '14px', color: 'var(--admin-text-primary)' }}>
                          {doc.user
                            ? `${doc.user.firstName} ${doc.user.lastName}`
                            : doc.proProfile?.displayName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>
                          {doc.user?.email}
                        </div>
                      </td>
                      <td style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                        {doc.type}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(doc.status)}
                          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                        {formatDate(doc.createdAt)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowApprovalModal(true);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--admin-accent)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                          Examiner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showApprovalModal && selectedDocument && (
        <FocusTrap
          onEscape={() => { setShowApprovalModal(false); setSelectedDocument(null); }}
          role="dialog"
          aria-modal={true}
          aria-labelledby="doc-review-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '448px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)' }}>
            <h3 id="doc-review-title" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--admin-text-primary)', marginBottom: '16px' }}>
              Examiner le document
            </h3>

            <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>
                  Nom du document
                </label>
                <p style={{ color: 'var(--admin-text-primary)', marginTop: '4px' }}>{selectedDocument.name}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>
                  Type
                </label>
                <p style={{ color: 'var(--admin-text-primary)', marginTop: '4px' }}>{selectedDocument.type}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-secondary)' }}>
                  Statut actuel
                </label>
                <p style={{ color: 'var(--admin-text-primary)', marginTop: '4px' }}>
                  {getStatusLabel(selectedDocument.status)}
                </p>
              </div>
            </div>

            {selectedDocument.status === 'PENDING' && (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label htmlFor="doc-rejectReason" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                    Motif du rejet (optionnel)
                  </label>
                  <textarea
                    id="doc-rejectReason"
                    value={approvalReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid var(--admin-border)',
                      borderRadius: '10px',
                      fontFamily: 'inherit',
                      color: 'var(--admin-text-primary)',
                    }}
                    placeholder="Entrez un motif si vous rejetez ce document..."
                    rows={4}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button type="button"
                    onClick={() => handleApprove(selectedDocument.id)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'var(--admin-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Approuver
                  </button>
                  <button type="button"
                    onClick={() => handleReject(selectedDocument.id)}
                    style={{
                      flex: 1,
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
                    Rejeter
                  </button>
                </div>
              </>
            )}

            <button type="button"
              onClick={() => {
                setShowApprovalModal(false);
                setSelectedDocument(null);
                setApprovalReason('');
              }}
              className="admin-btn-secondary"
              style={{ width: '100%' }}
            >
              Fermer
            </button>
          </div>
        </FocusTrap>
      )}
    </div>
  );
}
