/**
 * Route API Mock — POST /api/auth/forgot-password
 * Mode démo : simule l'envoi d'un email de réinitialisation
 */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
