import { MetadataRoute } from 'next';

/**
 * robots.txt dynamique — Eventy Life
 * Bloque les portails privés (admin, pro, client, auth, checkout)
 * Autorise uniquement les pages publiques pour le SEO
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eventy.fr';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/pro/',
          '/client/',
          '/connexion',
          '/inscription',
          '/login',
          '/register',
          '/mot-de-passe-oublie',
          '/reinitialiser-mot-de-passe',
          '/verification-email',
          '/checkout/',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
