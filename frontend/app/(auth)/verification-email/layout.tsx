import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vérification Email | Eventy Life',
  description: 'Vérifiez votre adresse email pour activer votre compte Eventy Life.',
};

export default function EmailVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
