import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Villes de départ — Trouvez un voyage près de chez vous',
  description:
    'Retrouvez tous nos voyages de groupe au départ de votre ville. Transport porte-à-porte avec accompagnement personnalisé depuis 20 villes en France.',
  openGraph: {
    title: 'Villes de départ | Eventy Life',
    description:
      'Voyages de groupe au départ de votre ville avec transport porte-à-porte.',
  },
};

export default function DepartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
