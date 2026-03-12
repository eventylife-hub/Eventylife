import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

/**
 * Décoder et vérifier un JWT avec HMAC-SHA256
 * En production, utilise JWT_SECRET pour vérifier la signature
 * En développement, accepte les tokens démo (signature non vérifiée) si JWT_SECRET absent
 *
 * SÉCURITÉ : Le middleware Next.js tourne côté serveur (Edge Runtime),
 * donc JWT_SECRET n'est JAMAIS exposé au navigateur.
 */
function verifyAndDecodeJwt<T>(token: string): T {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT invalide : format incorrect');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new Error('JWT invalide : parties manquantes');
  }

  // Vérifier la signature HMAC-SHA256 si JWT_SECRET disponible
  const jwtSecret = process.env.JWT_SECRET;

  if (jwtSecret) {
    const signatureInput = `${headerB64}.${payloadB64}`;
    const expectedSignature = crypto
      .createHmac('sha256', jwtSecret)
      .update(signatureInput)
      .digest('base64url');

    // Comparaison en temps constant pour prévenir les attaques timing
    const sigBuffer = Buffer.from(signatureB64, 'base64url');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64url');

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      throw new Error('JWT invalide : signature incorrecte');
    }
  } else if (process.env.NODE_ENV === 'production') {
    // En production, JWT_SECRET est OBLIGATOIRE
    throw new Error('JWT_SECRET manquant en production — configuration invalide');
  }
  // En dev sans JWT_SECRET, on accepte le token (démo)

  // Décoder le payload
  const decoded = Buffer.from(payloadB64, 'base64url').toString('utf-8');
  const payload = JSON.parse(decoded) as T;

  return payload;
}

// Routes publiques accessibles sans authentification
const PUBLIC_ROUTES = [
  '/',
  '/voyages',
  // Pages publiques
  '/contact',
  '/faq',
  '/a-propos',
  '/blog',
  '/brochure',
  '/partenaires',
  '/suivi-commande',
  '/confidentialite',
  '/depart',
  // Auth — routes principales FR
  '/connexion',
  '/inscription',
  '/mot-de-passe-oublie',
  '/reinitialiser-mot-de-passe',
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
  '/robots.txt',
];

// Pattern pour les routes avec paramètres dynamiques
const DYNAMIC_PUBLIC_PATTERNS = [
  /^\/voyages\/[^/]+$/,       // /voyages/:slug
  /^\/voyages\/[^/]+\/avis$/, // /voyages/:slug/avis
  /^\/voyages\/[^/]+\/groupes$/, // /voyages/:slug/groupes
  /^\/depart\/[^/]+$/,        // /depart/:ville
  /^\/p\/[^/]+$/,             // /p/:proSlug (page pro publique)
  /^\/blog\/.+$/,             // /blog/:slug
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
    // Non authentifié - rediriger vers connexion avec redirect sécurisé
    const loginUrl = new URL('/connexion', request.url);
    // Sécurité : ne transmettre que le pathname (pas d'URL externe)
    if (pathname.startsWith('/')) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Vérifier la signature et décoder le JWT
    const decoded = verifyAndDecodeJwt<JwtPayload>(token);
    const userRole = decoded.role;

    // Valider que le rôle est un rôle connu (défense en profondeur)
    const VALID_ROLES: ReadonlySet<string> = new Set(['CLIENT', 'PRO', 'ADMIN']);
    if (!userRole || !VALID_ROLES.has(userRole)) {
      throw new Error('JWT invalide : rôle inconnu');
    }

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
