/**
 * Route API Mock — GET /api/admin/dashboard
 * Mode démo : données factices pour le dashboard admin
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      stats: {
        totalUsers: 2847,
        totalPros: 42,
        totalBookings: 1256,
        totalRevenue: 89450000, // centimes = 894 500 €
        activeTrips: 18,
        pendingTickets: 7,
        monthlyGrowth: 12.5,
      },
      recentActivity: [
        {
          id: 'act_001',
          type: 'BOOKING',
          description: 'Nouvelle réservation Maroc #RES-2026-0891',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: { firstName: 'Sophie', lastName: 'Laurent' },
        },
        {
          id: 'act_002',
          type: 'PAYMENT',
          description: 'Paiement reçu 890,00 € — Grèce #RES-2026-0889',
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          user: { firstName: 'Pierre', lastName: 'Moreau' },
        },
        {
          id: 'act_003',
          type: 'PRO_REGISTRATION',
          description: 'Nouveau partenaire pro inscrit — Voyages Martin',
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          user: { firstName: 'Claire', lastName: 'Martin' },
        },
        {
          id: 'act_004',
          type: 'SUPPORT',
          description: 'Ticket #TK-456 résolu — Problème de paiement',
          createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          user: { firstName: 'Marc', lastName: 'Dubois' },
        },
      ],
      topTrips: [
        { id: 'trip_001', name: 'Maroc — 8 jours', bookings: 34, revenue: 3026000, occupancy: 85 },
        { id: 'trip_002', name: 'Grèce — 10 jours', bookings: 28, revenue: 3612000, occupancy: 70 },
        { id: 'trip_003', name: 'Italie — 7 jours', bookings: 22, revenue: 2398000, occupancy: 55 },
      ],
    },
  });
}
