/**
 * Route API Mock — GET /api/insurance/mine
 * Mode démo : assurances du client connecté
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_INSURANCES = [
  {
    subscriptionId: 'ins_001',
    travelId: '1',
    travelTitle: 'Marrakech Express',
    status: 'CONFIRMED',
    insuranceAmountTTC: 4500,
    coverageType: 'ANNULATION',
    subscribedAt: '2026-01-10T14:32:00Z',
  },
  {
    subscriptionId: 'ins_002',
    travelId: '3',
    travelTitle: 'Barcelone & Gaudí',
    status: 'PENDING',
    insuranceAmountTTC: 3500,
    coverageType: 'ANNULATION',
    subscribedAt: '2026-02-05T09:17:00Z',
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
    insurances: MOCK_INSURANCES,
    total: MOCK_INSURANCES.length,
  });
}
