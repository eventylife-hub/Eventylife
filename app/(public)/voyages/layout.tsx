import type { Metadata } from 'next';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Nos Voyages en Groupe Accompagnés',
  description:
    'Découvrez notre sélection de voyages en groupe accompagnés. Destinations variées, prix justes et qualité garantie pour vos voyages de groupe.',
  openGraph: {
    title: 'Voyages en Groupe Accompagnés | Eventy Life',
    description:
      'Explorez nos voyages de groupe : Maroc, Italie, Espagne, Turquie… Transport porte-à-porte, accompagnateur dédié, prix tout compris.',
    url: 'https://www.eventylife.fr/voyages',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voyages en Groupe | Eventy Life',
    description:
      'Découvrez nos voyages de groupe accompagnés. Destinations variées, prix justes, transport inclus.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/voyages' },
};

/** Voyages connus pour le JSON-LD ItemList (fallback statique si API indisponible) */
const KNOWN_VOYAGES = [
  { name: 'Marrakech Express', slug: 'marrakech-express', dest: 'Marrakech, Maroc' },
  { name: 'Rome Éternelle', slug: 'rome-eternelle', dest: 'Rome, Italie' },
  { name: 'Barcelone & Gaudí', slug: 'barcelone-gaudi', dest: 'Barcelone, Espagne' },
  { name: 'Lisbonne & Fado', slug: 'lisbonne-fado', dest: 'Lisbonne, Portugal' },
  { name: 'Istanbul & le Bosphore', slug: 'istanbul-bosphore', dest: 'Istanbul, Turquie' },
  { name: 'Dubrovnik, Perle de l\'Adriatique', slug: 'dubrovnik-perle-adriatique', dest: 'Dubrovnik, Croatie' },
];

export default function VoyagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Nos voyages', href: '/voyages' },
        ]}
      />
      <ItemListJsonLd
        name="Voyages en Groupe Eventy Life"
        description="Sélection de voyages en groupe avec accompagnement humain porte-à-porte"
        items={KNOWN_VOYAGES.map((v, i) => ({
          name: v.name,
          url: `/voyages/${v.slug}`,
          position: i + 1,
          description: `Voyage de groupe accompagné vers ${v.dest}`,
        }))}
      />
      {children}
    </>
  );
}
