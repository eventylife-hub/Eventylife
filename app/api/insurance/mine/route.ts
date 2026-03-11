/**
 * Route API Mock — GET /api/insurance/mine
 * Mode démo : assurances du client connecté
 */
import { NextResponse } from 'next/server';

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
  return NextResponse.json({
    insurances: MOCK_INSURANCES,
    total: MOCK_INSURANCES.length,
  });
}
