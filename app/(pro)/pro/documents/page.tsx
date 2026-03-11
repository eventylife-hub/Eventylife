'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  Loader,
  Download,
} from 'lucide-react';
import dynamic from 'next/dynamic';
const FileUpload = dynamic(() => import('@/components/uploads/file-upload').then(m => ({ default: m.FileUpload })), { ssr: false });
import { formatDate } from '@/lib/utils';
interface ProDocument {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  fileAsset?: {
    id: string;
    mimeType: string;
    sizeBytes: number;
  };
  createdAt: string;
}

export default function ProDocumentsPage() {
  const [documents, setDocuments] = useState<ProDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Récupérer les documents Pro
      const response = await fetch('/api/documents/pro', { credentials: 'include' });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch {
      console.warn('API documents/pro indisponible — données démo');
      setDocuments([
        {
          id: 'doc_001',
          name: 'Contrat Partenaire Eventy - Voyages du Soleil',
          type: 'CONTRAT',
          status: 'CONFIRMED',
          fileAsset: { id: 'asset_c01', mimeType: 'application/pdf', sizeBytes: 245000 },
          createdAt: '2026-01-15T10:30:00Z',
        },
        {
          id: 'doc_002',
          name: 'Avenant Contrat - Saison Été 2026',
          type: 'CONTRAT',
          status: 'PENDING',
          fileAsset: { id: 'asset_c02', mimeType: 'application/pdf', sizeBytes: 128000 },
          createdAt: '2026-02-20T14:00:00Z',
        },
        {
          id: 'doc_003',
          name: 'Extrait KBIS - Voyages du Soleil SAS',
          type: 'KBIS',
          status: 'CONFIRMED',
          fileAsset: { id: 'asset_k01', mimeType: 'application/pdf', sizeBytes: 89000 },
          createdAt: '2025-12-01T09:00:00Z',
        },
        {
          id: 'doc_004',
          name: 'Pièce identité - Jean Dupont',
          type: 'PIECE_IDENTITE',
          status: 'CONFIRMED',
          fileAsset: { id: 'asset_id01', mimeType: 'image/jpeg', sizeBytes: 512000 },
          createdAt: '2025-11-20T11:15:00Z',
        },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (assetId: string) => {
    if (!selectedDocType) return;

    try {
      setUploading(true);
      // Uploader le document
      const response = await fetch('/api/documents/pro/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: selectedDocType,
          assetId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du document');
      }

      // Recharger les documents
      await fetchDocuments();
      setShowUploadModal(false);
      setSelectedDocType('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setUploading(false);
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
        return 'Validé';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const handleDownload = async (doc: ProDocument) => {
    try {
      if (!doc.fileAsset?.id) {
        setError('Fichier non disponible');
        return;
      }

      const response = await fetch(`/api/assets/${doc.fileAsset.id}/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du fichier');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    }
  };

  const documentTypes = [
    { id: 'CONTRAT', label: 'Contrat signé' },
    { id: 'PIECE_IDENTITE', label: 'Pièce d\'identité' },
    { id: 'KBIS', label: 'Extrait KBIS' },
  ];

  const groupedDocs = {
    signed: documents.filter((d) => d.type === 'CONTRAT'),
    admin: documents.filter((d) =>
      ['PIECE_IDENTITE', 'KBIS'].includes(d.type),
    ),
  };

  return (
    <div className="pro-fade-in" style={{ minHeight: '100vh', backgroundColor: '#FEFCF3', paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="pro-page-title" style={{ marginBottom: '8px' }}>
            Mes documents
          </h1>
          <p style={{ color: '#8896A6' }}>
            Gérez vos contrats, documents administratifs et pièces justificatives
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFE0E3', borderRadius: '8px', color: 'var(--pro-coral)', border: '1px solid #FFE0E3' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
            <Loader className="h-8 w-8" style={{ color: '#8896A6', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Contrats signés */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 className="pro-section-title">
                  Contrats signés
                </h2>
              </div>

              {groupedDocs.signed.length === 0 ? (
                <div className="pro-panel" style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
                  <FileText className="w-8 h-8" style={{ color: '#8896A6', margin: '0 auto 12px' }} />
                  <p style={{ color: '#0A1628' }}>
                    Vous n\'avez pas encore de contrats signés
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {groupedDocs.signed.map((doc) => (
                    <div
                      key={doc.id}
                      className="pro-panel"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <FileText className="w-6 h-6" style={{ color: '#8896A6' }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#8896A6' }}>
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(doc.status)}
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#8896A6' }}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                        <button type="button"
                          onClick={() => handleDownload(doc)}
                          style={{ padding: '8px', color: 'var(--pro-ocean)', backgroundColor: 'transparent', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                          title="Télécharger le document"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Documents administratifs */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 className="pro-section-title">
                  Documents administratifs
                </h2>
                <button type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="pro-btn-sun"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Upload className="h-5 w-5" />
                  Ajouter un document
                </button>
              </div>

              {groupedDocs.admin.length === 0 ? (
                <div className="pro-panel" style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
                  <Upload className="w-8 h-8" style={{ color: '#8896A6', margin: '0 auto 12px' }} />
                  <p style={{ color: '#0A1628', marginBottom: '16px' }}>
                    Vous n\'avez pas encore téléchargé de documents administratifs
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {groupedDocs.admin.map((doc) => (
                    <div
                      key={doc.id}
                      className="pro-panel"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <FileText className="w-6 h-6" style={{ color: '#8896A6' }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 500, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#8896A6' }}>
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getStatusIcon(doc.status)}
                          <span style={{ fontSize: '12px', fontWeight: 500, color: '#8896A6' }}>
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Modal de téléchargement */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
          <div className="pro-panel" style={{ maxWidth: '448px', width: '100%' }}>
            <h3 className="pro-panel-title" style={{ marginBottom: '16px' }}>
              Ajouter un document administratif
            </h3>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#0A1628', marginBottom: '12px' }}>
                Type de document
              </label>
              <select
                value={selectedDocType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDocType((e.target as HTMLInputElement).value)}
                className="pro-input"
              >
                <option value="">Sélectionnez un type</option>
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedDocType && (
              <FileUpload
                accept={['application/pdf', 'image/jpeg', 'image/png']}
                maxSize={5 * 1024 * 1024}
                onUpload={handleUpload}
                label="Sélectionnez votre fichier"
              />
            )}

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedDocType('');
                }}
                disabled={uploading}
                className="pro-btn-outline"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
