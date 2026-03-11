import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  const decodedSlug = decodeURIComponent(params.slug);
  const titleCase = decodedSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Avis - ${titleCase} | Eventy Life`,
    description: `Lisez les avis et témoignages des voyageurs pour le voyage ${titleCase}. Découvrez les retours d'expérience de nos clients sur ce voyage de groupe accompagné.`,
  };
};

export default function VoyageAvisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
