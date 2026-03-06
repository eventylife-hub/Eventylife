/**
 * Store Zustand pour la gestion de l'authentification
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginFormData, RegisterFormData } from '../types/index';
import { api } from '../api';

/**
 * État du store
 */
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Getters
  token: string | null;

  // Actions
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

/**
 * Créer le store avec persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      get token() {
        return api.getAccessToken();
      },

      /**
       * Connexion
       * Les tokens sont gérés automatiquement par les cookies httpOnly côté serveur
       */
      login: async (data: LoginFormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', {
            email: data.email,
            password: data.password
          });

          if (response.success && response.data) {
            const { user } = response.data as { user: User };
            // Les cookies httpOnly sont définis automatiquement par le serveur

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error(response.error?.message || 'Erreur de connexion');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erreur inconnue';
          set({
            isLoading: false,
            error: message,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      /**
       * Inscription
       * Les tokens sont gérés automatiquement par les cookies httpOnly côté serveur
       */
      register: async (data: RegisterFormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password
          });

          if (response.success && response.data) {
            const { user } = response.data as { user: User };
            // Les cookies httpOnly sont définis automatiquement par le serveur

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error(response.error?.message || 'Erreur d\'inscription');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erreur inconnue';
          set({
            isLoading: false,
            error: message,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      /**
       * Déconnexion
       * Le serveur efface automatiquement les cookies httpOnly
       */
      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/auth/logout');
        } catch (_logoutError) {
          // Silencieux en production — la déconnexion est best-effort
        } finally {
          // Les cookies httpOnly sont automatiquement effacés par le serveur
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      /**
       * Rafraîchir la session
       * Appelle le endpoint de refresh et récupère les données utilisateur
       */
      refreshToken: async () => {
        try {
          const success = await api.refreshAccessToken();
          if (success) {
            await get().fetchCurrentUser();
            return true;
          }
          return false;
        } catch (_refreshError) {
          // Silencieux en production — échec de refresh géré par retour false
          return false;
        }
      },

      /**
       * Définir l'utilisateur courant
       */
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null
        });
      },

      /**
       * Récupérer l'utilisateur courant
       */
      fetchCurrentUser: async () => {
        try {
          const response = await api.get<User>('/auth/me');
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              error: null
            });
          } else {
            set({
              user: null,
              isAuthenticated: false
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false
          });
        }
      },

      /**
       * Effacer l'erreur
       */
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
