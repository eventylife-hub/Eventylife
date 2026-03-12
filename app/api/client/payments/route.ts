/**
 * Route API Mock — GET /api/client/payments
 * Mode démo : historique paiements du client
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_PAYMENTS = [
  {
    id: 'pay_001',
    bookingId: 'bk_001',
    travelTitle: 'Marrakech Express',
    amountCents: 89900,
    currency: 'EUR',
    status: 'SUCCEEDED',
    method: 'CARD',
    cardLast4: '4242',
    type: 'FULL_PAYMENT',
    createdAt: '2026-01-10T14:35:00Z',
    receiptUrl: '#',
  },
  {
    id: 'pay_002',
    bookingId: 'bk_002',
    travelTitle: 'Barcelone & Gaudí',
    amountCents: 34950,
    currency: 'EUR',
    status: 'SUCCEEDED',
    method: 'CARD',
    cardLast4: '4242',
    type: 'DEPOSIT',
    createdAt: '2026-02-05T09:20:00Z',
    receiptUrl: '#',
  },
  {
    id: 'pay_003',
    bookingId: 'bk_002',
    travelTitle: 'Barcelone & Gaudí',
    amountCents: 34950,
    currency: 'EUR',
    status: 'PENDING',
    method: 'CARD',
    type: 'BALANCE',
    dueDate: '2026-05-20',
    createdAt: '2026-02-05T09:20:00Z',
  },
];

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json({
    items: MOCK_PAYMENTS,
    total: MOCK_PAYMENTS.length,
    totalPaidCents: 124850,
    totalPendingCents: 34950,
  });
}
