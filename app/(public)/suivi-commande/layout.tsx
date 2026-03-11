import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Suivi de Commande | Eventy Life',
  description:
    'Suivez l\'état de votre réservation Eventy Life. Entrez votre référence et votre email pour retrouver votre commande.',
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
