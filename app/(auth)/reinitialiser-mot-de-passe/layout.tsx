import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réinitialiser Mot de Passe | Eventy Life',
  description: 'Réinitialisez votre mot de passe Eventy Life pour regagner l\'accès à votre compte.',
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
