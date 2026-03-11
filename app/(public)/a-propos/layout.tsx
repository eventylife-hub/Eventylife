import type { Metadata } from 'next';
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'À Propos | Eventy Life',
  description:
    'Découvrez Eventy Life, votre agence spécialisée dans les voyages de groupe accompagnés. Notre mission : des voyages de qualité à prix justes.',
  alternates: { canonical: 'https://eventy.fr/a-propos' },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebPageJsonLd
        name="À Propos — Eventy Life"
        description="Découvrez Eventy Life, votre agence spécialisée dans les voyages de groupe accompagnés."
        url="/a-propos"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'À propos', href: '/a-propos' },
        ]}
      />
      {children}
    </>
  );
}
