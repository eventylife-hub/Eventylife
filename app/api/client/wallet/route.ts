/**
 * Route API Mock — GET /api/client/wallet
 * Mode démo : portefeuille fidélité client
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_WALLET = {
  balanceCents: 5000,
  currency: 'EUR',
  transactions: [
    {
      id: 'tx_001',
      type: 'CREDIT',
      amountCents: 5000,
      description: 'Bonus de bienvenue',
      createdAt: '2026-01-15T10:00:00Z',
    },
  ],
  vouchers: [
    {
      id: 'voucher_001',
      code: 'WELCOME50',
      discountCents: 5000,
      minOrderCents: 50000,
      expiresAt: '2026-12-31T23:59:59Z',
      status: 'ACTIVE',
    },
  ],
};

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json(MOCK_WALLET);
}
