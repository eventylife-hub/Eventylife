import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Mentions Légales | Eventy Life',
  description:
    'Mentions légales d\'Eventy Life. Informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle et les conditions d\'utilisation.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'Mentions Légales | Eventy Life',
    description:
      'Informations légales sur l\'éditeur, l\'hébergement et les conditions d\'utilisation.',
    url: 'https://www.eventylife.fr/mentions-legales',
    type: 'website',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary',
    title: 'Mentions Légales | Eventy Life',
    description:
      'Mentions légales d\'Eventy Life — éditeur, hébergement, propriété intellectuelle.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/mentions-legales' },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Mentions légales', href: '/mentions-legales' },
        ]}
      />
      {children}
    </>
  );
}
