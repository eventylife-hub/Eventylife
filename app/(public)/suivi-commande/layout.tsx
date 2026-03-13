import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Suivi de Commande | Eventy Life',
  description:
    'Suivez l\'état de votre réservation Eventy Life. Entrez votre référence et votre email pour retrouver votre commande.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'Suivi de Commande | Eventy Life',
    description:
      'Suivez l\'état de votre réservation. Entrez votre référence pour retrouver votre commande.',
    url: 'https://www.eventylife.fr/suivi-commande',
    type: 'website',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary',
    title: 'Suivi de Commande | Eventy Life',
    description:
      'Suivez votre réservation Eventy Life en temps réel.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/suivi-commande' },
};

export default function SuiviCommandeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Suivi de commande', href: '/suivi-commande' },
        ]}
      />
      {children}
    </>
  );
}
