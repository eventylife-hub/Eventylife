/**
 * Route API Mock — GET /api/pro/reservations
 * Mode démo : réservations vues par le Pro
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextRequest, NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_RESERVATIONS = [
  { id: 'resa_001', voyageTitle: 'Marrakech Express', voyageId: '1', clientName: 'Jean Martin', clientEmail: 'jean.martin@mail.fr', passengers: 2, status: 'CONFIRMED', departureDate: '2026-05-15', totalAmount: 179800, createdAt: '2026-01-10T14:30:00Z' },
  { id: 'resa_002', voyageTitle: 'Marrakech Express', voyageId: '1', clientName: 'Marie Dupont', clientEmail: 'marie.dupont@mail.fr', passengers: 1, status: 'CONFIRMED', departureDate: '2026-05-15', totalAmount: 89900, createdAt: '2026-01-15T10:00:00Z' },
  { id: 'resa_003', voyageTitle: 'Barcelone & Gaudí', voyageId: '3', clientName: 'Sophie Lambert', clientEmail: 'sophie.lambert@mail.fr', passengers: 3, status: 'PENDING', departureDate: '2026-06-20', totalAmount: 209700, createdAt: '2026-02-20T16:00:00Z' },
  { id: 'resa_004', voyageTitle: 'Istanbul & le Bosphore', voyageId: '5', clientName: 'Pierre Moreau', clientEmail: 'pierre.moreau@mail.fr', passengers: 2, status: 'CONFIRMED', departureDate: '2026-07-18', totalAmount: 189800, createdAt: '2026-03-01T18:45:00Z' },
  { id: 'resa_005', voyageTitle: 'Barcelone & Gaudí', voyageId: '3', clientName: 'Isabelle Petit', clientEmail: 'isabelle.petit@mail.fr', passengers: 1, status: 'CANCELLED', departureDate: '2026-06-20', totalAmount: 69900, createdAt: '2026-02-25T11:00:00Z' },
];

export async function GET(request: NextRequest) {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let filtered = MOCK_RESERVATIONS;
  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.clientName.toLowerCase().includes(q) ||
        r.voyageTitle.toLowerCase().includes(q) ||
        r.clientEmail.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    items: filtered,
    total: filtered.length,
  });
}
