import type { Metadata } from 'next';
import { API_URL_SERVER } from '@/lib/config';

/** Données SEO enrichies par voyage (fallback statique si API indisponible) */
const VOYAGE_SEO: Record<string, { title: string; dest: string; desc: string }> = {
  'marrakech-express': {
    title: 'Marrakech Express',
    dest: 'Marrakech, Maroc',
    desc: 'Voyage de groupe accompagné à Marrakech : médina, jardins Majorelle, Atlas. Transport porte-à-porte inclus.',
  },
  'rome-eternelle': {
    title: 'Rome Éternelle',
    dest: 'Rome, Italie',
    desc: 'Explorez Rome en groupe : Vatican, Colisée, Trastevere. Accompagnement humain et transport inclus.',
  },
  'barcelone-gaudi': {
    title: 'Barcelone & Gaudí',
    dest: 'Barcelone, Espagne',
    desc: 'Voyage de groupe à Barcelone : Sagrada Familia, Parc Güell, Ramblas. Accompagnateur dédié.',
  },
  'iles-eoliennes-baroque-sicilien': {
    title: 'Îles Éoliennes & Baroque Sicilien',
    dest: 'Sicile, Italie',
    desc: 'Voyage en Sicile : Éoliennes, Palerme, Syracuse, Agrigente. 8 jours tout compris, transport porte-à-porte.',
  },
  'istanbul-cappadoce': {
    title: 'Istanbul & Cappadoce',
    dest: 'Turquie',
    desc: 'Voyage de groupe en Turquie : Istanbul, Cappadoce, montgolfières. Accompagnement personnalisé.',
  },
  'lisbonne-algarve': {
    title: 'Lisbonne & Algarve',
    dest: 'Portugal',
    desc: 'Voyage au Portugal : Lisbonne, Sintra, Algarve. Transport et accompagnateur inclus.',
  },
};

/**
 * Pre-generate known voyage slugs at build time.
 * Falls back to on-demand ISR for unknown slugs.
 */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL_SERVER}/travels`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as Array<{ slug: string }>;
      return data.map((t) => ({ slug: t.slug }));
    }
  } catch {
    // API indisponible au build — fallback slugs connus
  }

  return Object.keys(VOYAGE_SEO).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const seo = VOYAGE_SEO[decodedSlug];

  // Titre lisible à partir du slug
  const titleCase = seo?.title ?? decodedSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const description = seo?.desc
    ?? `Découvrez le voyage ${titleCase}. Tarifs, itinéraire, dates et infos pratiques pour votre voyage de groupe accompagné avec Eventy Life.`;

  const url = `https://www.eventylife.fr/voyages/${slug}`;

  return {
    title: `${titleCase} — Voyage en Groupe`,
    description,
    openGraph: {
      title: `${titleCase} — Voyage de Groupe | Eventy Life`,
      description,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'Eventy Life',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${titleCase} — Eventy Life`,
      description,
    },
    alternates: {
      canonical: url,
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
