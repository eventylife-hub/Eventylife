import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brochure — Catalogue de Voyages',
  description:
    'Téléchargez notre brochure et découvrez le catalogue complet des voyages de groupe Eventy Life. Destinations, tarifs, formules.',
  openGraph: {
    title: 'Brochure Voyages | Eventy Life',
    description:
      'Téléchargez notre brochure et découvrez le catalogue complet Eventy Life.',
  },
};

export default function BrochureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
