/**
 * Composant Providers pour les dépendances globales
 * (React Query, Zustand, etc.)
 */

'use client';

import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wrapper pour tous les providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {/* QueryClientProvider et autres providers peuvent être ajoutés ici */}
      {children}
    </>
  );
}
