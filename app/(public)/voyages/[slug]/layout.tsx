import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const titleCase = decodedSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const description = `Découvrez le voyage ${titleCase}. Tarifs, itinéraire, dates et infos pratiques pour votre voyage de groupe accompagné avec Eventy Life.`;

  return {
    title: `${titleCase} — Voyage en Groupe`,
    description,
    openGraph: {
      title: `${titleCase} — Voyage de Groupe | Eventy Life`,
      description,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Eventy Life',
      url: `https://www.eventylife.fr/voyages/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titleCase} — Eventy Life`,
      description,
    },
    alternates: {
      canonical: `https://www.eventylife.fr/voyages/${params.slug}`,
    },
  };
}

export default function VoyageDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
