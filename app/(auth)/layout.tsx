/**
 * Layout pour les pages d'authentification
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentification | Eventy Life',
  description: 'Connectez-vous ou créez un compte pour accéder à votre espace Eventy Life.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
