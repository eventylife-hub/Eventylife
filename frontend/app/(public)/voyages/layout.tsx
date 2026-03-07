import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voyages en Groupe | Eventy Life',
  description:
    'Découvrez notre sélection de voyages en groupe accompagnés. Destinations variées, prix justes et qualité garantie pour vos voyages de groupe.',
};

export default function VoyagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
