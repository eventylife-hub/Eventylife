import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Eventy Life',
  description:
    'Contactez Eventy Life pour toute question sur nos voyages en groupe. Notre équipe vous répond rapidement pour vos demandes.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
