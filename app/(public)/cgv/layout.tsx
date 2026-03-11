import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | Eventy Life',
  description:
    'Conditions générales de vente d\'Eventy Life. Modalités de réservation, paiement, annulation et responsabilité pour nos voyages de groupe.',
  alternates: { canonical: 'https://www.eventylife.fr/cgv' },
};

export default function CGVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'CGV', href: '/cgv' },
        ]}
      />
      {children}
    </>
  );
}
