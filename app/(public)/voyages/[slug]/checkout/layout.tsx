import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réservation | Eventy Life',
  description: 'Finalisez votre réservation de voyage de groupe.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
