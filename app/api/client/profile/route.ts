/**
 * Route API Mock — GET/PATCH /api/client/profile
 * Mode démo : profil client factice
 */
import { NextRequest, NextResponse } from 'next/server';

const MOCK_PROFILE = {
  id: 'usr_client_001',
  email: 'client@eventylife.fr',
  firstName: 'Jean',
  lastName: 'Martin',
  phone: '+33 6 12 34 56 78',
  birthDate: '1985-06-15',
  address: {
    street: '12 rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    country: 'FR',
  },
  avatarUrl: null,
  emailVerified: true,
  twoFactorEnabled: false,
  preferences: {
    newsletter: true,
    smsNotifications: false,
    language: 'fr',
  },
  createdAt: '2025-09-15T10:30:00Z',
};

export async function GET() {
  return NextResponse.json({ data: MOCK_PROFILE });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = { ...MOCK_PROFILE, ...body };
    return NextResponse.json({ data: updated, message: 'Profil mis à jour' });
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
