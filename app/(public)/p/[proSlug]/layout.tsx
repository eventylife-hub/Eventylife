import type { Metadata } from 'next';

export function generateMetadata({ params }: { params: { proSlug: string } }): Metadata {
  const name = params.proSlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${name} — Partenaire Eventy Life`,
    description: `Découvrez les voyages proposés par ${name}, partenaire Eventy Life. Réservez en ligne votre prochain voyage de groupe.`,
    openGraph: {
      title: `${name} — Partenaire Eventy Life`,
      description: `Voyages de groupe proposés par ${name} sur Eventy Life.`,
      type: 'website',
      locale: 'fr_FR',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
