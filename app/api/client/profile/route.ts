/**
 * Route API Mock — GET/PATCH /api/client/profile
 * Mode démo : profil client factice
 *
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextRequest, NextResponse } from 'next/server';

const IS_DEV = process.env.NODE_ENV !== 'production';

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
  stats: {
    totalBookings: 3,
    confirmedBookings: 2,
    pendingBookings: 1,
    cancelledBookings: 0,
    totalAmountSpentCents: 234700,
  },
  createdAt: '2025-09-15T10:30:00Z',
};

export async function GET() {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  return NextResponse.json(MOCK_PROFILE);
}

export async function PATCH(request: NextRequest) {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
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
