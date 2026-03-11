import type { Metadata } from 'next';
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Devenir Partenaire — Rejoignez Eventy Life',
  description:
    'Rejoignez le réseau de partenaires Eventy Life : hébergements, restaurants, activités, transporteurs. Développez votre activité avec nous.',
  openGraph: {
    title: 'Devenir Partenaire | Eventy Life',
    description:
      'Rejoignez le réseau de partenaires Eventy Life et développez votre activité.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/partenaires' },
};

export default function PartenairesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Devenir Partenaire — Eventy Life"
        description="Rejoignez le réseau de partenaires Eventy Life et développez votre activité."
        url="/partenaires"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Devenir partenaire', href: '/partenaires' },
        ]}
      />
      {children}
    </>
  );
}
