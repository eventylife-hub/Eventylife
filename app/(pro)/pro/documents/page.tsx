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
import { FileUpload } from '@/components/uploads/file-upload';
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
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
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
    } catch (err) {
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
    } catch (err) {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes documents
          </h1>
          <p className="text-gray-600">
            Gérez vos contrats, documents administratifs et pièces justificatives
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Contrats signés */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Contrats signés
                </h2>
              </div>

              {groupedDocs.signed.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <FileText className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-600">
                    Vous n\'avez pas encore de contrats signés
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedDocs.signed.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="text-xs font-medium text-gray-600">
                            {getStatusLabel(doc.status)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Documents administratifs
                </h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Upload className="h-5 w-5" />
                  Ajouter un document
                </button>
              </div>

              {groupedDocs.admin.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <Upload className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-600 mb-4">
                    Vous n\'avez pas encore téléchargé de documents administratifs
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupedDocs.admin.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-6 w-6 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(doc.status)}
                          <span className="text-xs font-medium text-gray-600">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Ajouter un document administratif
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de document
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedDocType('');
                }}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100"
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
