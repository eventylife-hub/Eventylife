import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mot de Passe Oublié | Eventy Life',
  description:
    'Récupérez l\'accès à votre compte Eventy Life. Réinitialisez votre mot de passe en quelques étapes simples.',
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
