import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Eventy Life',
  description:
    'Politique de confidentialité d\'Eventy Life. Protection de vos données personnelles, vos droits RGPD et traitement de vos informations.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'Politique de Confidentialité | Eventy Life',
    description:
      'Protection de vos données personnelles, vos droits RGPD et traitement de vos informations.',
    url: 'https://www.eventylife.fr/politique-confidentialite',
    type: 'website',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary',
    title: 'Politique de Confidentialité | Eventy Life',
    description:
      'Protection des données personnelles et droits RGPD chez Eventy Life.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/politique-confidentialite' },
};

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Politique de confidentialité', href: '/politique-confidentialite' },
        ]}
      />
      {children}
    </>
  );
}
