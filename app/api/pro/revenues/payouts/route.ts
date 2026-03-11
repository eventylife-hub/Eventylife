/**
 * Route API Mock — GET /api/pro/revenues/payouts
 * Mode démo : historique des versements Pro
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    payouts: [
      { id: 'pay_001', date: '2026-02-28', amount: 512430, status: 'PAID', bankReference: 'VIR-2026-0228-001' },
      { id: 'pay_002', date: '2026-03-05', amount: 343770, status: 'PAID', bankReference: 'VIR-2026-0305-001' },
      { id: 'pay_003', date: '2026-03-15', amount: 389400, status: 'PENDING' },
    ],
    total: 3,
  });
}
