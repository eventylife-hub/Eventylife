import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Politique de Cookies | Eventy Life',
  description:
    'Politique de cookies d\'Eventy Life. Gestion des cookies et traceurs conformément à la réglementation CNIL.',
  openGraph: {
    title: 'Politique de Cookies | Eventy Life',
    description:
      'Gestion des cookies et traceurs conformément à la réglementation CNIL.',
    url: 'https://www.eventylife.fr/cookies',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Cookies | Eventy Life',
    description:
      'Politique de cookies et gestion des traceurs Eventy Life.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/cookies' },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Politique de cookies', href: '/cookies' },
        ]}
      />
      {children}
    </>
  );
}
