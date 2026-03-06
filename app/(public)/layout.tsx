import type { Metadata } from 'next';

// Note: This layout provides default metadata for public pages
// Individual pages may override this with their own metadata in layout files

export const metadata: Metadata = {
  title: 'Eventy Life - Voyages en Groupe',
  description: 'Découvrez des voyages en groupe avec accompagnement, prix justes et qualité garantie.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
