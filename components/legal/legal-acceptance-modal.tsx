'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FocusTrap } from '@/components/a11y/focus-trap';

interface LegalDocumentVersion {
  id: string;
  type: string;
  version: string;
  content: string;
  isActive: boolean;
  createdAt: Date;
}

interface LegalAcceptanceModalProps {
  documents: LegalDocumentVersion[];
  onAccept: (documentIds: string[]) => Promise<void>;
  isOpen: boolean;
}

export function LegalAcceptanceModal({
  documents,
  onAccept,
  isOpen,
}: LegalAcceptanceModalProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckboxChange = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleAccept = async () => {
    if (selectedDocs.length !== documents.length) {
      setError('Vous devez accepter tous les documents obligatoires.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onAccept(selectedDocs);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de l\'acceptation des documents.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentLink = (type: string) => {
    switch (type) {
      case 'MENTIONS_LEGALES':
        return '/mentions-legales';
      case 'CGV':
        return '/cgv';
      case 'POLITIQUE_CONFIDENTIALITE':
        return '/politique-confidentialite';
      default:
        return '#';
    }
  };

  const getDocumentLabel = (type: string) => {
    switch (type) {
      case 'MENTIONS_LEGALES':
        return 'Mentions légales';
      case 'CGV':
        return 'Conditions Générales de Vente';
      case 'POLITIQUE_CONFIDENTIALITE':
        return 'Politique de Confidentialité';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="legal-modal-title">
      <FocusTrap>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 id="legal-modal-title" className="mb-6 text-2xl font-bold text-gray-900">
          Acceptation des documents légaux
        </h2>

        <p className="mb-6 text-gray-600">
          Afin de continuer, veuillez accepter les documents légaux suivants :
        </p>

        {/* Documents */}
        <div className="mb-6 space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={doc.id}
                checked={selectedDocs.includes(doc.id)}
                onChange={() => handleCheckboxChange(doc.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor={doc.id} className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    J&apos;accepte les{' '}
                    <Link
                      href={getDocumentLink(doc.type)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {getDocumentLabel(doc.type)}
                    </Link>
                  </span>
                  <span className="text-xs text-gray-500">v{doc.version}</span>
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button type="button"
            onClick={handleAccept}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Traitement...' : 'J\'accepte'}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          * L&apos;acceptation de ces documents est obligatoire pour utiliser nos
          services.
        </p>
      </div>
      </FocusTrap>
    </div>
  );
}
