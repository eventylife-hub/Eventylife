/**
 * Route API Mock — POST /api/auth/login
 * Mode démo : accepte des credentials prédéfinis pour tester les portails
 * À remplacer par le vrai backend NestJS en production
 */
import { NextRequest, NextResponse } from 'next/server';

// Utilisateurs démo (mots de passe en clair = mode démo uniquement)
const DEMO_USERS = [
  {
    email: 'admin@eventylife.fr',
    password: 'Admin123!',
    user: {
      id: 'usr_admin_001',
      email: 'admin@eventylife.fr',
      firstName: 'David',
      lastName: 'Admin',
      role: 'ADMIN',
      avatarUrl: null,
      emailVerified: true,
    },
  },
  {
    email: 'pro@eventylife.fr',
    password: 'Pro123!',
    user: {
      id: 'usr_pro_001',
      email: 'pro@eventylife.fr',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'PRO',
      avatarUrl: null,
      emailVerified: true,
      proProfile: {
        id: 'pro_001',
        companyName: 'Voyages Dupont',
        status: 'ACTIVE',
        onboardingCompleted: true,
      },
    },
  },
  {
    email: 'client@eventylife.fr',
    password: 'Client123!',
    user: {
      id: 'usr_client_001',
      email: 'client@eventylife.fr',
      firstName: 'Jean',
      lastName: 'Martin',
      role: 'CLIENT',
      avatarUrl: null,
      emailVerified: true,
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Recherche utilisateur démo
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Simuler un token JWT (mode démo)
    const mockToken = `demo_${found.user.role.toLowerCase()}_${Date.now()}`;

    const response = NextResponse.json({
      user: found.user,
      accessToken: mockToken,
      message: 'Connexion réussie',
    });

    // Cookie httpOnly simulé (mode démo)
    response.cookies.set('access_token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set('refresh_token', `refresh_${mockToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
