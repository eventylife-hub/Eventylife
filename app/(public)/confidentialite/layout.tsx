import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Eventy Life',
  description:
    'Politique de confidentialité d\'Eventy Life. Protection de vos données personnelles conformément au RGPD.',
  alternates: { canonical: 'https://eventy.fr/confidentialite' },
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
