import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Voyages en Groupe | Eventy Life',
  description:
    'Découvrez notre sélection de voyages en groupe accompagnés. Destinations variées, prix justes et qualité garantie pour vos voyages de groupe.',
  alternates: { canonical: 'https://eventy.fr/voyages' },
};

export default function VoyagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Nos voyages', href: '/voyages' },
        ]}
      />
      {children}
    </>
  );
}
