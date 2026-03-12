/**
 * Route API Mock — GET /api/reviews/mine
 * Mode démo : avis du client connecté
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_REVIEWS = [
  {
    id: 'rev_001',
    travelId: '1',
    travelTitle: 'Marrakech Express',
    travelSlug: 'marrakech-express',
    travelCoverImageUrl:
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop',
    rating: 5,
    comment:
      "Voyage incroyable ! L'organisation était parfaite du début à la fin. Notre accompagnateur Mohamed était exceptionnel. Les excursions étaient variées et adaptées à tous. Je recommande vivement !",
    status: 'APPROVED',
    createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 'rev_002',
    travelId: '3',
    travelTitle: 'Barcelone & Gaudí',
    travelSlug: 'barcelone-gaudi',
    travelCoverImageUrl:
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
    rating: 4,
    comment:
      "Très beau voyage, Barcelone est une ville magnifique. La Sagrada Familia m'a coupé le souffle. Seul petit bémol : le trajet en bus était un peu long.",
    status: 'APPROVED',
    createdAt: '2026-02-20T15:30:00Z',
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
    items: MOCK_REVIEWS,
    total: MOCK_REVIEWS.length,
  });
}
