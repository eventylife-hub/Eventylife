import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Brochure — Catalogue de Voyages',
  description:
    'Téléchargez notre brochure et découvrez le catalogue complet des voyages de groupe Eventy Life. Destinations, tarifs, formules.',
  openGraph: {
    title: 'Brochure Voyages | Eventy Life',
    description:
      'Téléchargez notre brochure et découvrez le catalogue complet Eventy Life.',
  },
  alternates: { canonical: 'https://eventy.fr/brochure' },
};

export default function BrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Brochure', href: '/brochure' },
        ]}
      />
      {children}
    </>
  );
}
