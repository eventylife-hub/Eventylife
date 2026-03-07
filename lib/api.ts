/**
 * Client API pour Eventy Life
 * Gère les requêtes HTTP avec authentification via cookies httpOnly
 * Les tokens sont gérés automatiquement par le backend via des cookies sécurisés
 * Inclut la protection CSRF via le pattern "Double Submit Cookie"
 */

import { API_CONFIG } from './constants';
import { ApiResponse, ApiError } from './types';

/**
 * Interface pour les options de requête
 */
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Extrait le token CSRF depuis le cookie csrf_token
 * Utilisé pour les requêtes mutantes (POST, PUT, PATCH, DELETE)
 */
function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * Rafraîchit la session en appelant /auth/refresh
 * Le refresh_token est envoyé automatiquement via cookie httpOnly
 */
async function refreshSession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Envoie les cookies httpOnly automatiquement
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Effectue une requête HTTP avec gestion d'authentification et CSRF
 * Les tokens sont envoyés automatiquement via cookies grâce à credentials: 'include'
 * Le token CSRF est ajouté au header X-CSRF-Token pour les requêtes mutantes
 */
async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const baseUrl = API_CONFIG.BASE_URL ?? 'http://localhost:3001/api';
  const url = `${baseUrl}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Ajouter le token CSRF pour les requêtes mutantes
  if (options.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Envoie les cookies httpOnly automatiquement
    });

    // Réauthentification automatique en cas de 401
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed) {
        // Réessayer la requête avec la nouvelle session
        response = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
      }
    }

    // Parser la réponse
    let data: Record<string, unknown>;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json() as Record<string, unknown>;
    } else {
      const text = await response.text();
      data = { success: response.ok, data: text };
    }

    if (!response.ok) {
      const errorObj = data?.error as Record<string, unknown> | undefined;
      return {
        success: false,
        error: {
          code: (errorObj?.code as string) || `HTTP_${response.status}`,
          message: (errorObj?.message as string) || `Erreur ${response.status}`,
        },
      };
    }

    return {
      success: true,
      data: (data?.data ?? data) as T,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Erreur réseau: ' + errorMessage,
      },
    };
  }
}

/**
 * Objet API exposant les méthodes HTTP
 * Les tokens sont gérés automatiquement par les cookies httpOnly côté serveur
 */
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: Record<string, unknown>, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: Record<string, unknown>, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: Record<string, unknown>, options?: FetchOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  // Compatibilité — tokens gérés par cookies httpOnly côté serveur
  getAccessToken: (): string | null => null,
  setAccessToken: (_token: string | null): void => {},
  setRefreshToken: (_token: string | null): void => {},
  getRefreshToken: (): string | null => null,
  refreshAccessToken: refreshSession,
};

export type { ApiResponse, ApiError };
