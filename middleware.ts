import { NextRequest, NextResponse } from 'next/server';

/**
 * Décoder manuellement un JWT sans dépendre d'une librairie externe
 */
function decodeJwt<T>(token: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT');
  }

  const payload = parts[1];
  if (!payload) {
    throw new Error('Invalid JWT payload');
  }

  const decoded = Buffer.from(payload, 'base64').toString('utf-8');
  return JSON.parse(decoded) as T;
}

// Routes publiques accessibles sans authentification
const PUBLIC_ROUTES = [
  '/',
  '/voyages',
  // Auth — routes principales FR
  '/connexion',
  '/inscription',
  '/mot-de-passe-oublie',
  '/verification-email',
  // Auth — anciennes routes EN (redirections)
  '/login',
  '/register',
  // Légal
  '/mentions-legales',
  '/cgv',
  '/cookies',
  '/politique-confidentialite',
  '/sitemap.xml',
];

// Pattern pour les routes avec paramètres dynamiques
const DYNAMIC_PUBLIC_PATTERNS = [
  /^\/voyages\/[^/]+$/,
];

interface JwtPayload {
  sub: string;
  email: string;
  role: 'CLIENT' | 'PRO' | 'ADMIN';
  iat: number;
  exp: number;
}

/**
 * Middleware d'authentification et de routage
 * Vérifie le JWT depuis le cookie httpOnly
 * Redirige vers /connexion si non authentifié
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si c'est une route publique
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Vérifier les patterns dynamiques publics
  if (DYNAMIC_PUBLIC_PATTERNS.some(pattern => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Récupérer le token JWT du cookie httpOnly
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // Non authentifié - rediriger vers connexion
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Décoder le JWT pour récupérer le rôle
    const decoded = decodeJwt<JwtPayload>(token);
    const userRole = decoded.role;

    // Vérifier l'expiration du token
    if (decoded.exp * 1000 < Date.now()) {
      const loginUrl = new URL('/connexion', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Routes admin - requièrent role ADMIN
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

    // Routes pro - requièrent role PRO ou ADMIN
    if (pathname.startsWith('/pro')) {
      if (userRole !== 'PRO' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

    // Routes client - requièrent role CLIENT ou ADMIN
    if (pathname.startsWith('/client')) {
      if (userRole !== 'CLIENT' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

    // Routes checkout - requièrent authentification
    if (pathname.startsWith('/checkout')) {
      return NextResponse.next();
    }

    // Routes par défaut - authentification requise
    return NextResponse.next();
  } catch (error) {
    // Token invalide - rediriger vers connexion
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configuration du matcher — uniquement les routes protégées
// Les routes publiques (/, /voyages, /connexion, etc.) ne passent PAS par le middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/pro/:path*',
    '/client/:path*',
    '/checkout/:path*',
  ],
};
