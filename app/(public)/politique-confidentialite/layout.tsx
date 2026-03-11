import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Eventy Life',
  description:
    'Politique de confidentialité d\'Eventy Life. Protection de vos données personnelles, vos droits RGPD et traitement de vos informations.',
  alternates: { canonical: 'https://eventy.fr/politique-confidentialite' },
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
