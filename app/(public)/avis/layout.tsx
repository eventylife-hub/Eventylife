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
    url: 'https://www.eventylife.fr/avis',
    locale: 'fr_FR',
    siteName: 'Eventy Life',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avis voyageurs | Eventy Life',
    description:
      'Témoignages vérifiés de nos voyageurs. Note moyenne 4.7/5 sur plus de 200 avis.',
  },
  alternates: {
    canonical: 'https://www.eventylife.fr/avis',
  },
};

export default function AvisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
