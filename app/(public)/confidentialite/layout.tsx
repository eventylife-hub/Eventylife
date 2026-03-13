import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Eventy Life',
  description:
    'Politique de confidentialité d\'Eventy Life. Protection de vos données personnelles conformément au RGPD.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'Politique de Confidentialité | Eventy Life',
    description:
      'Protection de vos données personnelles conformément au RGPD.',
    url: 'https://www.eventylife.fr/confidentialite',
    type: 'website',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary',
    title: 'Confidentialité | Eventy Life',
    description:
      'Politique de confidentialité et protection des données RGPD.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/confidentialite' },
};

export default function ConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Confidentialité', href: '/confidentialite' },
        ]}
      />
      {children}
    </>
  );
}
