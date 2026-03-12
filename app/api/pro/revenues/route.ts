/**
 * Route API Mock — GET /api/pro/revenues
 * Mode démo : revenus Pro par période
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextRequest, NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

export async function GET(request: NextRequest) {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  const { searchParams } = new URL(request.url);
  const _period = searchParams.get('period') || 'thisMonth';

  return NextResponse.json({
    summary: {
      totalEarned: 1245600,
      pendingAmount: 389400,
      paidOutAmount: 856200,
      currency: 'EUR',
    },
    trips: [
      {
        tripId: '1',
        tripName: 'Marrakech Express',
        startDate: '2026-05-15',
        endDate: '2026-05-22',
        reservationCount: 38,
        totalRevenueInclTax: 3416200,
        commissionPercent: 15,
        netAmount: 512430,
      },
      {
        tripId: '3',
        tripName: 'Barcelone & Gaudí',
        startDate: '2026-06-20',
        endDate: '2026-06-25',
        reservationCount: 44,
        totalRevenueInclTax: 3075600,
        commissionPercent: 15,
        netAmount: 461340,
      },
      {
        tripId: '5',
        tripName: 'Istanbul & le Bosphore',
        startDate: '2026-07-18',
        endDate: '2026-07-25',
        reservationCount: 36,
        totalRevenueInclTax: 3416400,
        commissionPercent: 12,
        netAmount: 409968,
      },
    ],
  });
}
