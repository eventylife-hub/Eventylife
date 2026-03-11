import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avis voyageurs | Eventy Life',
  description:
    'Découvrez les témoignages vérifiés de nos voyageurs. Note moyenne 4.7/5 sur plus de 200 avis. Voyages de groupe tout compris avec accompagnement porte-à-porte.',
  openGraph: {
    title: 'Avis voyageurs | Eventy Life',
    description:
      'Découvrez les témoignages vérifiés de nos voyageurs. Note moyenne 4.7/5.',
    type: 'website',
  },
  alternates: {
    canonical: '/avis',
  },
};

export default function AvisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
