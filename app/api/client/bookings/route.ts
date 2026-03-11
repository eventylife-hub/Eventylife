/**
 * Route API Mock — GET /api/client/bookings
 * Mode démo : réservations client factices
 */
import { NextRequest, NextResponse } from 'next/server';

const MOCK_BOOKINGS = [
  {
    id: 'bk_001',
    travelId: '1',
    title: 'Marrakech Express',
    slug: 'marrakech-express',
    destination: 'Marrakech, Maroc',
    departureDate: '2026-05-15',
    returnDate: '2026-05-22',
    destinationCity: 'Marrakech',
    coverImageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
    status: 'CONFIRMED',
    totalAmountCents: 89900,
    paidAmountCents: 89900,
    remainingAmountCents: 0,
    passengersCount: 2,
    roomType: 'DOUBLE',
    createdAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'bk_002',
    travelId: '3',
    title: 'Barcelone & Gaudí',
    slug: 'barcelone-gaudi',
    destination: 'Barcelone, Espagne',
    departureDate: '2026-06-20',
    returnDate: '2026-06-25',
    destinationCity: 'Barcelone',
    coverImageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    status: 'CONFIRMED',
    totalAmountCents: 69900,
    paidAmountCents: 34950,
    remainingAmountCents: 34950,
    passengersCount: 1,
    roomType: 'SINGLE',
    createdAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 'bk_003',
    travelId: '5',
    title: 'Istanbul & le Bosphore',
    slug: 'istanbul-bosphore',
    destination: 'Istanbul, Turquie',
    departureDate: '2026-07-18',
    returnDate: '2026-07-25',
    destinationCity: 'Istanbul',
    coverImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
    status: 'PENDING',
    totalAmountCents: 94900,
    paidAmountCents: 0,
    remainingAmountCents: 94900,
    passengersCount: 2,
    roomType: 'DOUBLE',
    createdAt: '2026-03-01T18:45:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status');

  let filtered = MOCK_BOOKINGS;
  if (status) {
    filtered = filtered.filter((b) => b.status === status.toUpperCase());
  }

  const items = filtered.slice(0, limit);

  return NextResponse.json({
    items,
    total: filtered.length,
    hasMore: false,
  });
}
