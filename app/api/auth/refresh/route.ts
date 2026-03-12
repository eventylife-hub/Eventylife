/**
 * Route API Mock — POST /api/auth/refresh
 * Mode démo : simule un refresh token
 * ⚠️ SECURITY (LOT 166): Guard environnement — BLOQUÉ en production
 */
import { NextRequest, NextResponse } from 'next/server';

// SECURITY GUARD: Double vérification — NODE_ENV + flag explicite
const IS_DEV = process.env.NODE_ENV !== 'production' && process.env.ENABLE_MOCK_AUTH !== 'false';

export async function POST(request: NextRequest) {
  if (!IS_DEV) {
    return NextResponse.json(
      { message: 'Route désactivée en production.' },
      { status: 403 }
    );
  }
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken || !refreshToken.startsWith('refresh_demo_')) {
    return NextResponse.json(
      { message: 'Refresh token invalide' },
      { status: 401 }
    );
  }

  // Extraire le rôle du token
  const role = refreshToken.includes('admin') ? 'admin' : refreshToken.includes('pro') ? 'pro' : 'client';
  const newAccessToken = `demo_${role}_${Date.now()}`;

  const response = NextResponse.json({
    accessToken: newAccessToken,
    message: 'Token rafraîchi',
  });

  response.cookies.set('access_token', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15,
  });

  return response;
}
