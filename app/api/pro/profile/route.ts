/**
 * Route API Mock — GET /api/pro/profile
 * Mode démo : profil du partenaire Pro
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
    id: 'pro_demo_001',
    companyName: 'Voyages du Soleil',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@voyages-soleil.fr',
    phone: '+33 6 12 34 56 78',
    siret: '12345678901234',
    status: 'ACTIVE',
    createdAt: '2025-09-01T10:00:00Z',
    onboardingCompleted: true,
  });
}
