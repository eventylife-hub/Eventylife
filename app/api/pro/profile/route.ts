/**
 * Route API Mock — GET /api/pro/profile
 * Mode démo : profil du partenaire Pro
 */
import { NextResponse } from 'next/server';

export async function GET() {
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
