/**
 * Route API Mock — GET /api/travels
 * Mode démo : liste des voyages disponibles
 */
import { NextRequest, NextResponse } from 'next/server';

const MOCK_TRAVELS = [
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
    id: '2',
    slug: 'rome-eternelle',
    title: 'Rome Éternelle',
    destination: 'Rome, Italie',
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    pricePerPerson: 74900,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 89,
    daysCount: 5,
    capacity: 45,
    bookings: 32,
    status: 'SALES_OPEN',
    transport: 'BUS',
    pickupCity: 'Lyon',
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
    id: '4',
    slug: 'lisbonne-fado',
    title: 'Lisbonne & Fado',
    destination: 'Lisbonne, Portugal',
    startDate: '2026-07-05',
    endDate: '2026-07-11',
    pricePerPerson: 79900,
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop',
    rating: 4.6,
    reviews: 67,
    daysCount: 6,
    capacity: 40,
    bookings: 28,
    status: 'SALES_OPEN',
    transport: 'AVION',
    pickupCity: 'Paris',
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
    id: '6',
    slug: 'dubrovnik-perle-adriatique',
    title: 'Dubrovnik, Perle de l\'Adriatique',
    destination: 'Dubrovnik, Croatie',
    startDate: '2026-08-02',
    endDate: '2026-08-08',
    pricePerPerson: 84900,
    image: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=600&h=400&fit=crop',
    rating: 4.7,
    reviews: 73,
    daysCount: 6,
    capacity: 40,
    bookings: 22,
    status: 'SALES_OPEN',
    transport: 'BUS',
    pickupCity: 'Nice',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let filtered = MOCK_TRAVELS;
  if (status) {
    filtered = filtered.filter((t) => t.status === status);
  }

  return NextResponse.json({
    data: filtered,
    total: filtered.length,
  });
}
