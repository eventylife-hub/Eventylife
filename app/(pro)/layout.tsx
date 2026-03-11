import type { Metadata } from 'next';

/**
 * Layout route group (pro) — Server Component
 * Ajoute noindex pour empêcher l'indexation de l'espace pro
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  title: {
    template: '%s | Pro Eventy',
    default: 'Espace Professionnel | Eventy Life',
  },
};

export default function ProGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
