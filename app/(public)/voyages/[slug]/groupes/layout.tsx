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
    title: `Groupes - ${titleCase} | Eventy Life`,
    description: `Rejoignez un groupe pour le voyage ${titleCase}. Parcourez les groupes disponibles et rejoignez celui qui vous convient pour cette aventure de voyage accompagné.`,
  };
};

export default function VoyageGroupesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
