import type { Metadata } from 'next';

/**
 * Layout route group (client) — Server Component
 * Ajoute noindex pour empêcher l'indexation de l'espace client connecté
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
    template: '%s | Mon Espace Eventy',
    default: 'Mon Espace | Eventy Life',
  },
};

export default function ClientGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
