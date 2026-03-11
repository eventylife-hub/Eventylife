import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

/** Pre-generate known blog article slugs at build time */
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/blog`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = (await res.json()) as Array<{ slug: string }>;
      return data.map((a) => ({ slug: a.slug }));
    }
  } catch {
    // API indisponible au build
  }

  return [
    { slug: 'voyager-en-groupe-avantages' },
    { slug: 'preparer-son-voyage-en-bus' },
    { slug: 'top-destinations-groupe-2026' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const titleFormatted = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: titleFormatted,
    description: `Lisez notre article « ${titleFormatted} » sur le blog Eventy Life. Conseils voyage, astuces groupe, destinations et accompagnement.`,
    openGraph: {
      title: `${titleFormatted} — Blog Eventy Life`,
      description: `Découvrez « ${titleFormatted} » — un article du blog Eventy Life sur les voyages de groupe accompagnés.`,
      type: 'article',
      locale: 'fr_FR',
      siteName: 'Eventy Life',
    },
    twitter: {
      card: 'summary_large_image',
      title: titleFormatted,
      description: `Article blog Eventy Life : ${titleFormatted}`,
    },
    alternates: {
      canonical: `https://www.eventylife.fr/blog/${params.slug}`,
    },
  };
}

export default function BlogArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
