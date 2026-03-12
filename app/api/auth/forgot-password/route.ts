/**
 * Route API Mock — POST /api/auth/forgot-password
 * Mode démo : simule l'envoi d'un email de réinitialisation
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
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    // En mode démo, on simule toujours un succès
    return NextResponse.json({
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
