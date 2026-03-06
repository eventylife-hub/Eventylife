import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion | Eventy Life',
  description: 'Connectez-vous à votre compte Eventy Life pour accéder à votre espace client et gérer vos réservations.',
};

export default function ConnectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
