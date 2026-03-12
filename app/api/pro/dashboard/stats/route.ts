/**
 * Route API Mock — GET /api/pro/dashboard/stats
 * Mode démo : données factices pour le dashboard pro
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
    data: {
      stats: {
        activeTrips: 5,
        totalBookings: 87,
        totalRevenue: 7845000, // centimes = 78 450 €
        pendingPayments: 3,
        nextDeparture: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
        averageRating: 4.7,
        totalReviews: 64,
      },
      activeVoyages: [
        {
          id: 'voy_001',
          title: 'Maroc — Marrakech & Désert',
          departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
          bookings: 34,
          capacity: 40,
          revenue: 3026000,
          status: 'SALES_OPEN',
        },
        {
          id: 'voy_002',
          title: 'Grèce — Athènes & Îles',
          departureDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
          bookings: 18,
          capacity: 35,
          revenue: 2322000,
          status: 'SALES_OPEN',
        },
      ],
      recentBookings: [
        {
          id: 'book_001',
          clientName: 'Marie Dupont',
          tripName: 'Maroc — 8 jours',
          amount: 89000,
          date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'CONFIRMED',
        },
        {
          id: 'book_002',
          clientName: 'Jean Martin',
          tripName: 'Grèce — 10 jours',
          amount: 129000,
          date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          status: 'PENDING_PAYMENT',
        },
      ],
    },
  });
}
