import type { Metadata } from 'next';

/**
 * Layout route group (admin) — Server Component
 * Ajoute noindex pour empêcher l'indexation du back-office
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
    template: '%s | Admin Eventy',
    default: 'Administration | Eventy Life',
  },
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
