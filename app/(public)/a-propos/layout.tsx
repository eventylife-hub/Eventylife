import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos | Eventy Life',
  description:
    'Découvrez Eventy Life, votre agence spécialisée dans les voyages de groupe accompagnés. Notre mission : des voyages de qualité à prix justes.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
