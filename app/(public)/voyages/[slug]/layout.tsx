import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  // Note: Decode slug for display
  const decodedSlug = decodeURIComponent(params.slug);
  const titleCase = decodedSlug
    .split('-')
    .map((word: unknown) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${titleCase} | Eventy Life - Voyage en Groupe`,
    description: `Découvrez les détails du voyage ${titleCase}. Tarifs, itinéraire, dates et informations pratiques pour votre voyage de groupe accompagné avec Eventy Life.`,
  };
};

export default function VoyageDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
