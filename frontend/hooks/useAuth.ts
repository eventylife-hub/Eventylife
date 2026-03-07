/**
 * Hook personnalisé pour l'authentification
 * Utile pour accéder aux données et actions d'authentification
 */

'use client'

import { useAuthStore } from '@/store/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const logout = useAuthStore((state) => state.logout);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'ADMIN';
  const isPro = user?.role === 'PRO';
  const isClient = user?.role === 'CLIENT';

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isPro,
    isClient,
    setUser,
    setLoading,
    setError,
    logout,
  };
}
