import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

interface Props {
  params: { ville: string };
  children: React.ReactNode;
}

/** Villes de départ connues — pre-built at compile time */
export function generateStaticParams() {
  return [
    { ville: 'bordeaux' },
    { ville: 'paris' },
    { ville: 'lyon' },
    { ville: 'marseille' },
    { ville: 'toulouse' },
    { ville: 'nantes' },
    { ville: 'lille' },
    { ville: 'strasbourg' },
    { ville: 'montpellier' },
    { ville: 'nice' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ville = decodeURIComponent(params.ville);
  const villeFormatted = ville.charAt(0).toUpperCase() + ville.slice(1);

  return {
    title: `Voyages au départ de ${villeFormatted}`,
    description: `Découvrez tous les voyages de groupe Eventy Life au départ de ${villeFormatted}. Transport porte-à-porte, accompagnement personnalisé.`,
    openGraph: {
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
      title: `Voyages au départ de ${villeFormatted} | Eventy Life`,
      description: `Voyages de groupe au départ de ${villeFormatted} avec accompagnement porte-à-porte.`,
      url: `https://www.eventylife.fr/depart/${ville}`,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Eventy Life',
    },
    twitter: {
    images: ['/opengraph-image'],
      card: 'summary_large_image',
      title: `Voyages au départ de ${villeFormatted} | Eventy Life`,
      description: `Voyages de groupe au départ de ${villeFormatted} avec accompagnement porte-à-porte.`,
    },
    alternates: {
      canonical: `https://www.eventylife.fr/depart/${ville}`,
    },
  };
}

export default function DepartVilleLayout({ children, params }: Props) {
  const villeFormatted = params.ville.charAt(0).toUpperCase() + params.ville.slice(1);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Villes de départ', href: '/depart' },
          { name: villeFormatted, href: `/depart/${params.ville}` },
        ]}
      />
      {children}
    </>
  );
}
