import type { Metadata } from 'next';

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
  alternates: {
    canonical: 'https://eventy.fr/comment-ca-marche',
  },
};

export default function CommentCaMarcheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
