import type { Metadata } from 'next';
import { WebPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Comment ça marche — Eventy Life',
  description:
    'Découvrez le processus de réservation Eventy Life en 4 étapes simples : choisissez votre voyage, réservez en ligne, on vient vous chercher, profitez du voyage.',
  openGraph: {
    title: 'Comment ça marche — Eventy Life',
    description:
      'De la réservation au retour, on s\'occupe de tout. Votre seul rôle : profiter du voyage.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comment ça marche — Eventy Life',
    description:
      'De la réservation au retour, on s\'occupe de tout. 4 étapes simples.',
  },
  alternates: {
    canonical: 'https://www.eventylife.fr/comment-ca-marche',
  },
};

export default function CommentCaMarcheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebPageJsonLd
        name="Comment ça marche — Eventy Life"
        description="Découvrez le processus de réservation Eventy Life en 4 étapes simples."
        url="/comment-ca-marche"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Comment ça marche', href: '/comment-ca-marche' },
        ]}
      />
      {children}
    </>
  );
}
