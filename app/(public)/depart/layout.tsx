import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Villes de départ — Trouvez un voyage près de chez vous',
  description:
    'Retrouvez tous nos voyages de groupe au départ de votre ville. Transport porte-à-porte avec accompagnement personnalisé depuis 20 villes en France.',
  openGraph: {
    title: 'Villes de départ | Eventy Life',
    description:
      'Voyages de groupe au départ de votre ville avec transport porte-à-porte.',
  },
  alternates: { canonical: 'https://eventy.fr/depart' },
};

export default function DepartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Villes de départ', href: '/depart' },
        ]}
      />
      {children}
    </>
  );
}
