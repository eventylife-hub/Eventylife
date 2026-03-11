/**
 * Route API Mock — GET /api/documents/client
 * Mode démo : documents du client (confirmations, factures, documents voyage)
 */
import { NextResponse } from 'next/server';

const MOCK_DOCUMENTS = [
  {
    id: 'doc_001',
    name: 'Confirmation — Marrakech Express',
    type: 'CONFIRMATION_RESERVATION',
    status: 'CONFIRMED',
    createdAt: '2026-01-10T14:35:00Z',
    fileAsset: {
      id: 'fa_001',
      mimeType: 'application/pdf',
      sizeBytes: 245000,
      storageKey: 'confirmations/bk_001.pdf',
    },
  },
  {
    id: 'doc_002',
    name: 'Confirmation — Barcelone & Gaudí',
    type: 'CONFIRMATION_RESERVATION',
    status: 'CONFIRMED',
    createdAt: '2026-02-05T09:20:00Z',
    fileAsset: {
      id: 'fa_002',
      mimeType: 'application/pdf',
      sizeBytes: 198000,
      storageKey: 'confirmations/bk_002.pdf',
    },
  },
  {
    id: 'doc_003',
    name: 'Facture — Marrakech Express',
    type: 'FACTURE',
    status: 'CONFIRMED',
    createdAt: '2026-01-15T08:00:00Z',
    fileAsset: {
      id: 'fa_003',
      mimeType: 'application/pdf',
      sizeBytes: 312000,
      storageKey: 'factures/inv_001.pdf',
    },
  },
  {
    id: 'doc_004',
    name: 'Programme de voyage — Marrakech',
    type: 'DOCUMENT_VOYAGE',
    status: 'CONFIRMED',
    createdAt: '2026-04-15T10:00:00Z',
    fileAsset: {
      id: 'fa_004',
      mimeType: 'application/pdf',
      sizeBytes: 1540000,
      storageKey: 'voyages/prog_001.pdf',
    },
  },
];

export async function GET() {
  return NextResponse.json(MOCK_DOCUMENTS);
}
