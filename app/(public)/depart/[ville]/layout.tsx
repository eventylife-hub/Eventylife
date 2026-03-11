import type { Metadata } from 'next';

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
      title: `Voyages au départ de ${villeFormatted} | Eventy Life`,
      description: `Voyages de groupe au départ de ${villeFormatted} avec accompagnement porte-à-porte.`,
    },
  };
}

export default function DepartVilleLayout({ children }: Props) {
  return children;
}
