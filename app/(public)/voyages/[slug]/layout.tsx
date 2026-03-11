import type { Metadata } from 'next';

/**
 * Pre-generate known voyage slugs at build time.
 * Falls back to on-demand ISR for unknown slugs.
 */
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/travels`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as Array<{ slug: string }>;
      return data.map((t) => ({ slug: t.slug }));
    }
  } catch {
    // API indisponible au build — fallback slugs connus
  }

  // Slugs de démonstration pour le build sans backend
  return [
    { slug: 'marrakech-express' },
    { slug: 'rome-eternelle' },
    { slug: 'barcelone-gaudi' },
    { slug: 'iles-eoliennes-baroque-sicilien' },
    { slug: 'istanbul-cappadoce' },
    { slug: 'lisbonne-algarve' },
  ];
}

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
