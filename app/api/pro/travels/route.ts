/**
 * Route API Mock — GET /api/pro/travels
 * Mode démo : voyages gérés par le Pro
 */
import { NextRequest, NextResponse } from 'next/server';

const MOCK_PRO_TRAVELS = [
  {
    id: '1',
    slug: 'marrakech-express',
    title: 'Marrakech Express',
    destination: 'Marrakech, Maroc',
    startDate: '2026-05-15',
    endDate: '2026-05-22',
    pricePerPerson: 89900,
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 124,
    daysCount: 7,
    capacity: 50,
    bookings: 38,
    status: 'SALES_OPEN',
    transport: 'BUS',
    pickupCity: 'Bordeaux',
  },
  {
    id: '3',
    slug: 'barcelone-gaudi',
    title: 'Barcelone & Gaudí',
    destination: 'Barcelone, Espagne',
    startDate: '2026-06-20',
    endDate: '2026-06-25',
    pricePerPerson: 69900,
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    rating: 4.9,
    reviews: 156,
    daysCount: 5,
    capacity: 50,
    bookings: 44,
    status: 'SALES_OPEN',
    transport: 'BUS',
    pickupCity: 'Toulouse',
  },
  {
    id: '5',
    slug: 'istanbul-bosphore',
    title: 'Istanbul & le Bosphore',
    destination: 'Istanbul, Turquie',
    startDate: '2026-07-18',
    endDate: '2026-07-25',
    pricePerPerson: 94900,
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
    rating: 4.8,
    reviews: 98,
    daysCount: 7,
    capacity: 45,
    bookings: 36,
    status: 'SALES_OPEN',
    transport: 'AVION',
    pickupCity: 'Marseille',
  },
  {
    id: '7',
    slug: 'amsterdam-canaux',
    title: 'Amsterdam & les Canaux',
    destination: 'Amsterdam, Pays-Bas',
    startDate: '2026-09-05',
    endDate: '2026-09-10',
    pricePerPerson: 72900,
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop',
    rating: 0,
    reviews: 0,
    daysCount: 5,
    capacity: 40,
    bookings: 0,
    status: 'DRAFT',
    transport: 'BUS',
    pickupCity: 'Paris',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let filtered = MOCK_PRO_TRAVELS;
  if (status) {
    const statuses = status.split(',');
    filtered = filtered.filter((t) => statuses.includes(t.status));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
  });
}
