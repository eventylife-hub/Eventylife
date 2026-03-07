import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuth() {
  return useAuthStore();
}

export default useAuth;
