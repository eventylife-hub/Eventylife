import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | Eventy Life',
  description:
    'Conditions générales de vente d\'Eventy Life. Modalités de réservation, paiement, annulation et responsabilité pour nos voyages de groupe.',
  openGraph: {
    title: 'Conditions Générales de Vente | Eventy Life',
    description:
      'CGV Eventy Life — Réservation, paiement, annulation et responsabilité pour nos voyages de groupe.',
    url: 'https://www.eventylife.fr/cgv',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CGV | Eventy Life',
    description:
      'Conditions générales de vente pour les voyages de groupe Eventy Life.',
  },
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
