import type { Metadata } from 'next';

/**
 * Layout route group (checkout) — Server Component
 * Ajoute noindex pour empêcher l'indexation du tunnel de paiement
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
    template: '%s | Réservation Eventy',
    default: 'Réservation | Eventy Life',
  },
};

export default function CheckoutGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
