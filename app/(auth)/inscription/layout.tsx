import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription | Eventy Life',
  description: 'Créez votre compte Eventy Life en quelques minutes et commencez à explorer nos voyages en groupe.',
};

export default function InscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
