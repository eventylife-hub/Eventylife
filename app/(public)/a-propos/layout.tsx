import type { Metadata } from 'next';
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'À Propos — Notre Histoire',
  description:
    'Découvrez Eventy Life, votre agence spécialisée dans les voyages de groupe accompagnés. Notre mission : des voyages de qualité à prix justes.',
  openGraph: {
    title: 'À Propos — Eventy Life',
    description:
      'L\'agence de voyages de groupe qui met l\'humain au centre. Accompagnement porte-à-porte, qualité sans compromis.',
    url: 'https://www.eventylife.fr/a-propos',
  },
  alternates: { canonical: 'https://www.eventylife.fr/a-propos' },
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
