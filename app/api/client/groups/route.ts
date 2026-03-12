/**
 * Route API Mock — GET /api/client/groups
 * Mode démo : groupes de voyage du client
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

const MOCK_GROUPS = [
  {
    id: 'grp_001',
    name: 'Les Voyageurs de Bordeaux',
    code: 'BORD2026',
    memberCount: 8,
    maxMembers: 12,
    travelTitle: 'Marrakech Express',
    travelSlug: 'marrakech-express',
    departureDate: '2026-05-15',
    status: 'ACTIVE',
    isOwner: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'grp_002',
    name: 'Famille Martin',
    code: 'MART2026',
    memberCount: 4,
    maxMembers: 6,
    travelTitle: 'Barcelone & Gaudí',
    travelSlug: 'barcelone-gaudi',
    departureDate: '2026-06-20',
    status: 'ACTIVE',
    isOwner: false,
    createdAt: '2026-02-10T14:30:00Z',
  },
];

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json({ items: MOCK_GROUPS, total: MOCK_GROUPS.length });
}
