/**
 * Route API Mock — GET /api/finance/dashboard/[id]
 * Mode démo : dashboard financier d'un Pro
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: _id } = await params;

  return NextResponse.json({
    totalCA: 9908200,
    totalRevenue: 9908200,
    totalCosts: 7926560,
    totalMargin: 1981640,
    totalVATMargin: 330273,
    averageMarginPercent: 20,
    travelCount: 3,
    byMonth: {
      '2026-01': { caTTC: 3416200, coutsTTC: 2732960, marge: 683240 },
      '2026-02': { caTTC: 3075600, coutsTTC: 2460480, marge: 615120 },
      '2026-03': { caTTC: 3416400, coutsTTC: 2733120, marge: 683280 },
    },
    travels: [
      { travelId: 'travel_001', name: 'Marrakech Express', caTTC: 3416200, coutsTTC: 2732960, marge: 683240, tvaMarge: 113873 },
      { travelId: 'travel_003', name: 'Barcelone & Gaudí', caTTC: 3075600, coutsTTC: 2460480, marge: 615120, tvaMarge: 102520 },
      { travelId: 'travel_005', name: 'Istanbul & le Bosphore', caTTC: 3416400, coutsTTC: 2733120, marge: 683280, tvaMarge: 113880 },
    ],
  });
}
