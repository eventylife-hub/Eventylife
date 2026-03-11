import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Mentions Légales | Eventy Life',
  description:
    'Mentions légales d\'Eventy Life. Informations sur l\'éditeur, l\'hébergement, la propriété intellectuelle et les conditions d\'utilisation.',
  alternates: { canonical: 'https://eventy.fr/mentions-legales' },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Mentions légales', href: '/mentions-legales' },
        ]}
      />
      {children}
    </>
  );
}
