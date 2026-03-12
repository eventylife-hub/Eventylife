/**
 * Route API Mock — GET /api/pro/revenues/payouts
 * Mode démo : historique des versements Pro
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json({
    payouts: [
      { id: 'pay_001', date: '2026-02-28', amount: 512430, status: 'PAID', bankReference: 'VIR-2026-0228-001' },
      { id: 'pay_002', date: '2026-03-05', amount: 343770, status: 'PAID', bankReference: 'VIR-2026-0305-001' },
      { id: 'pay_003', date: '2026-03-15', amount: 389400, status: 'PENDING' },
    ],
    total: 3,
  });
}
