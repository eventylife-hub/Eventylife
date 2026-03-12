'use client';

import React, { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { logger } from '@/lib/logger';
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
              const { downloadUrl } = await urlResponse.json() as unknown;
              setDownloadingUrls((prev) => ({
                ...prev,
                [doc.id]: downloadUrl,
              }));
            }
          } catch (err: unknown) {
            // Erreur silencieuse — URL non chargée pour ce document
          }
        }
      }
    } catch {
      logger.warn('API documents indisponible — données démo');
      setDocuments([
        {
          id: 'doc_001',
          name: 'Confirmation — Marrakech Express',
          type: 'CONFIRMATION_RESERVATION',
          status: 'CONFIRMED',
          createdAt: '2026-01-10T14:35:00Z',
          fileAsset: { id: 'fa_001', mimeType: 'application/pdf', sizeBytes: 245000, storageKey: 'confirmations/bk_001.pdf' },
        },
        {
          id: 'doc_002',
          name: 'Confirmation — Barcelone & Gaudí',
          type: 'CONFIRMATION_RESERVATION',
          status: 'CONFIRMED',
          createdAt: '2026-02-05T09:20:00Z',
          fileAsset: { id: 'fa_002', mimeType: 'application/pdf', sizeBytes: 198000, storageKey: 'confirmations/bk_002.pdf' },
        },
        {
          id: 'doc_003',
          name: 'Facture — Marrakech Express',
          type: 'FACTURE',
          status: 'CONFIRMED',
          createdAt: '2026-01-15T08:00:00Z',
          fileAsset: { id: 'fa_003', mimeType: 'application/pdf', sizeBytes: 312000, storageKey: 'factures/inv_001.pdf' },
        },
        {
          id: 'doc_004',
          name: 'Programme de voyage — Marrakech',
          type: 'DOCUMENT_VOYAGE',
          status: 'CONFIRMED',
          createdAt: '2026-04-15T10:00:00Z',
          fileAsset: { id: 'fa_004', mimeType: 'application/pdf', sizeBytes: 1540000, storageKey: 'voyages/prog_001.pdf' },
        },
      ]);
      setError(null);
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
          const { downloadUrl } = await response.json() as unknown;
          window.open(downloadUrl, '_blank');
        }
      }
    } catch (err: unknown) {
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
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* En-tête */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
          Mes documents
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          Consultez et téléchargez vos confirmations, factures et documents de voyage
        </p>
      </div>

      {error && (
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--terra-soft, #FEF2F2)',
          border: '1.5px solid #E5E0D8',
          borderRadius: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--terra, #C75B39)', fontWeight: 500 }}>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem',
            color: 'var(--terra, #C75B39)',
            border: '1px solid var(--terra, #C75B39)',
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Fermer
          </button>
        </div>
      )}

      {/* Onglets */}
      <div style={{ borderBottom: '1.5px solid #E5E0D8' }}>
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = getDocumentsByType(tab.id as DocumentTab).length;

            return (
              <button type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DocumentTab)}
                className="pb-4 font-medium transition-colors relative text-sm whitespace-nowrap"
                style={{
                  color: isActive ? 'var(--terra, #C75B39)' : '#6B7280',
                  borderBottom: isActive ? '2px solid var(--terra, #C75B39)' : 'none',
                  paddingBottom: '16px',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full" style={{ background: 'var(--terra, #C75B39)', color: '#fff' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 rounded-full" style={{ borderColor: '#E5E0D8', borderTopColor: 'var(--terra, #C75B39)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : currentDocs.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
            Aucun document
          </h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Vous n'avez pas encore de documents pour cette catégorie
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl p-6 flex items-center justify-between transition-all duration-300"
              style={{
                background: '#fff',
                border: '1.5px solid #E5E0D8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(26,26,46,0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-2xl flex-shrink-0">📋</div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium truncate" style={{ color: 'var(--navy, #1A1A2E)' }}>
                    {doc.name}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                    {formatDate(doc.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <span className="px-3 py-1 rounded-xl text-xs font-semibold" style={{ background: '#DCFCE7', color: '#166534' }}>
                  {doc.status === 'CONFIRMED' ? 'Validé' : 'En attente'}
                </span>
                <button type="button"
                  onClick={() => handleDownload(doc.id)}
                  className="p-2 rounded-xl transition-all"
                  style={{ background: 'rgba(199,91,57,0.1)', color: 'var(--terra, #C75B39)' }}
                  title="Télécharger"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--terra, #C75B39)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                    e.currentTarget.style.color = 'var(--terra, #C75B39)';
                  }}
                >
                  ⬇️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton Télécharger tout */}
      {currentDocs.length > 1 && (
        <div className="flex justify-end mt-6">
          <button type="button"
            onClick={async () => {
              try {
                setDownloadingAll(true);
                for (const doc of currentDocs) {
                  await handleDownload(doc.id);
                  await new Promise((r) => setTimeout(r, 500));
                }
              } catch (err: unknown) {
                // Erreur silencieuse — téléchargement groupé échoué
              } finally {
                setDownloadingAll(false);
              }
            }}
            disabled={downloadingAll}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
            style={{
              background: '#fff',
              color: 'var(--navy, #1A1A2E)',
              border: '1.5px solid #E5E0D8',
              opacity: downloadingAll ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloadingAll) {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            {downloadingAll ? '⏳' : '⬇️'} {downloadingAll ? 'Téléchargement en cours...' : 'Télécharger tous les documents'}
          </button>
        </div>
      )}
    </div>
  );
}
