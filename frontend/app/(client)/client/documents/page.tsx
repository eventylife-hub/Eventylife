'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader } from 'lucide-react';
import { FilePreview } from '@/components/uploads/file-preview';
import { formatDate } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  fileAsset?: {
    id: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
  };
}

type DocumentTab = 'confirmations' | 'factures' | 'voyage';

export default function ClientDocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocumentTab>('confirmations');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingUrls, setDownloadingUrls] = useState<Record<string, string>>({});
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents/client', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des documents');
      }
      const data = await response.json();
      setDocuments(data);

      // Charger les URLs de téléchargement pour les images
      for (const doc of data) {
        if (doc.fileAsset?.mimeType.startsWith('image/')) {
          try {
            const urlResponse = await fetch(`/api/documents/${doc.id}/download`, {
              credentials: 'include',
            });
            if (urlResponse.ok) {
              const { downloadUrl } = await urlResponse.json();
              setDownloadingUrls((prev) => ({
                ...prev,
                [doc.id]: downloadUrl,
              }));
            }
          } catch (err) {
            // Erreur silencieuse — URL non chargée pour ce document
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByType = (type: DocumentTab) => {
    const typeMap: Record<DocumentTab, string[]> = {
      confirmations: ['CONFIRMATION_RESERVATION'],
      factures: ['FACTURE'],
      voyage: ['DOCUMENT_VOYAGE'],
    };

    return documents.filter((doc) =>
      typeMap[type].includes(doc.type),
    );
  };

  const handleDownload = async (documentId: string) => {
    try {
      if (downloadingUrls[documentId]) {
        window.open(downloadingUrls[documentId], '_blank');
      } else {
        const response = await fetch(`/api/documents/${documentId}/download`, {
          credentials: 'include',
        });
        if (response.ok) {
          const { downloadUrl } = await response.json();
          window.open(downloadUrl, '_blank');
        }
      }
    } catch (err) {
      // Erreur silencieuse — téléchargement échoué
    }
  };

  const tabs = [
    { id: 'confirmations', label: 'Confirmations de réservation' },
    { id: 'factures', label: 'Factures' },
    { id: 'voyage', label: 'Documents de voyage' },
  ] as const;

  const currentDocs = getDocumentsByType(activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes documents
          </h1>
          <p className="text-gray-600">
            Consultez et téléchargez vos confirmations, factures et documents de voyage
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const count = getDocumentsByType(tab.id as DocumentTab).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DocumentTab)}
                  className={`pb-4 font-medium transition-colors relative ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                      {count}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : currentDocs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun document
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas encore de documents pour cette catégorie
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  <FileText className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {doc.status === 'CONFIRMED' ? 'Validé' : 'En attente'}
                  </span>
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Télécharger"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton Télécharger tout */}
        {currentDocs.length > 1 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={async () => {
                try {
                  setDownloadingAll(true);
                  for (const doc of currentDocs) {
                    await handleDownload(doc.id);
                    // Petit délai entre les téléchargements pour éviter le blocage navigateur
                    await new Promise((r) => setTimeout(r, 500));
                  }
                } catch (err) {
                  // Erreur silencieuse — téléchargement groupé échoué
                } finally {
                  setDownloadingAll(false);
                }
              }}
              disabled={downloadingAll}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {downloadingAll ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
              {downloadingAll ? 'Téléchargement en cours...' : 'Télécharger tous les documents'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
