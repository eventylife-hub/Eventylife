import { ApiResponse, ApiError } from '@/types/api';

/**
 * Erreur API enrichie avec le code HTTP et les données d'erreur
 */
class ApiClientError extends Error {
  statusCode: number;
  data: ApiError;

  constructor(message: string, statusCode: number, data: ApiError) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Client API centralisé pour toutes les requêtes
 * Gère automatiquement:
 * - Tokens stockés dans httpOnly cookies (pas localStorage)
 * - Inclusion automatique des cookies via credentials: 'include'
 * - Token CSRF (Double Submit Cookie) sur les requêtes mutantes
 * - Refresh token si 401
 * - Gestion cohérente des erreurs
 */
class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  /** Méthodes HTTP considérées comme mutantes (nécessitent le CSRF) */
  private static readonly MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

  /** Verrou pour éviter les race conditions lors du refresh token */
  private isRefreshing = false;
  private refreshQueue: Array<{
    resolve: (value: boolean) => void;
    reject: (reason: unknown) => void;
  }> = [];

  /** Compteur de retries pour éviter les boucles infinies */
  private static readonly MAX_RETRY_COUNT = 1;

  constructor(baseUrl: string = (process.env.NEXT_PUBLIC_API_URL ?? '/api')) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lit le token CSRF depuis le cookie non-httpOnly 'csrf_token'
   * Le middleware backend envoie ce cookie sur chaque GET
   * @returns Le token CSRF ou null s'il n'est pas disponible
   */
  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  }

  /**
   * Récupère le token JWT (tokens sont dans httpOnly cookies, pas accessible depuis JS)
   * Retourne null - l'authentification se fait via cookies automatiquement
   */
  private getToken(): string | null {
    // Les tokens sont stockés dans httpOnly cookies, pas accessibles depuis le JS
    return null;
  }

  /**
   * Sauvegarde le token JWT (no-op - les cookies sont gérés par le serveur)
   */
  private setToken(token: string): void {
    // Les tokens sont maintenant gérés côté serveur avec httpOnly cookies
    // Cette méthode est un no-op pour la rétro-compatibilité
  }

  /**
   * Récupère le refresh token (tokens sont dans httpOnly cookies, pas accessible depuis JS)
   */
  private getRefreshToken(): string | null {
    // Les tokens sont stockés dans httpOnly cookies, pas accessibles depuis le JS
    return null;
  }

  /**
   * Sauvegarde le refresh token (no-op - les cookies sont gérés par le serveur)
   */
  private setRefreshToken(token: string): void {
    // Les tokens sont maintenant gérés côté serveur avec httpOnly cookies
    // Cette méthode est un no-op pour la rétro-compatibilité
  }

  /**
   * Effectue une requête GET
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Effectue une requête POST
   */
  async post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Effectue une requête PATCH
   */
  async patch<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Effectue une requête DELETE
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Effectue une requête générique avec gestion d'erreur centralisée
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();

    // Construire les headers avec le CSRF token pour les requêtes mutantes
    const requestHeaders: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries(this.headers).map(([k, v]) => [k, String(v)]),
      ),
      ...(options.headers ? Object.fromEntries(
        Object.entries(options.headers).map(([k, v]) => [k, String(v)]),
      ) : {}),
    };

    // Ajouter le header X-CSRF-Token sur les requêtes mutantes (POST, PUT, PATCH, DELETE)
    if (ApiClient.MUTATING_METHODS.has(method)) {
      const csrfToken = this.getCsrfToken();
      if (csrfToken) {
        requestHeaders['X-CSRF-Token'] = csrfToken;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Envoie les httpOnly cookies automatiquement
        headers: requestHeaders,
      });

      // Gestion du 401 - Token expiré (avec protection anti-boucle)
      if (response.status === 401) {
        // Extraire le retry count pour éviter les boucles infinies
        const retryCount = (options as Record<string, unknown>).__retryCount as number || 0;

        if (retryCount >= ApiClient.MAX_RETRY_COUNT) {
          // Max retries atteint — forcer la déconnexion
          if (typeof window !== 'undefined') {
            window.location.href = '/connexion?reason=session-expired';
          }
          throw new Error('Session expirée — veuillez vous reconnecter');
        }

        const refreshed = await this.refreshAccessTokenSafe();
        if (refreshed) {
          // Réessayer la requête avec le nouveau token (incrémenter le compteur)
          return this.request<T>(endpoint, {
            ...options,
            __retryCount: retryCount + 1,
          } as RequestInit);
        } else {
          // Refresh échoué — rediriger vers connexion
          if (typeof window !== 'undefined') {
            window.location.href = '/connexion?reason=session-expired';
          }
          throw new Error('Session expirée — veuillez vous reconnecter');
        }
      }

      // Autres erreurs HTTP
      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          // Réponse non-JSON (HTML error page, timeout, etc.)
          errorData = {
            message: `Erreur serveur (${response.status})`,
            statusCode: response.status,
          } as ApiError;
        }
        throw new ApiClientError(
          errorData.message || 'Erreur API',
          response.status,
          errorData,
        );
      }

      // Succès
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erreur réseau');
    }
  }

  /**
   * Rafraîchit le token d'accès avec verrou anti-race-condition
   * Si un refresh est déjà en cours, les appels suivants attendent le résultat
   */
  private async refreshAccessTokenSafe(): Promise<boolean> {
    // Si un refresh est déjà en cours, attendre son résultat
    if (this.isRefreshing) {
      return new Promise<boolean>((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const result = await this.refreshAccessToken();

      // Résoudre toutes les requêtes en attente
      this.refreshQueue.forEach(({ resolve }) => resolve(result));
      this.refreshQueue = [];

      return result;
    } catch (error) {
      // Rejeter toutes les requêtes en attente
      this.refreshQueue.forEach(({ reject }) => reject(error));
      this.refreshQueue = [];

      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Rafraîchit le token d'accès (appel HTTP brut)
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Envoie les httpOnly cookies de refresh
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.setToken(data.accessToken);
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Définit les tokens après une connexion réussie (no-op - les tokens sont gérés côté serveur)
   * Les cookies httpOnly sont définis par le serveur lors du login
   */
  setAuthTokens(accessToken: string, refreshToken: string): void {
    // Les tokens sont maintenant gérés via httpOnly cookies du serveur
    // Cette méthode est conservée pour la rétro-compatibilité
    this.setToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Efface les tokens (déconnexion)
   * Les cookies httpOnly sont supprimés côté serveur lors du logout
   */
  clearAuthTokens(): void {
    // Les cookies httpOnly sont gérés côté serveur, pas besoin d'action côté client
  }
}

// Export singleton
export const apiClient = new ApiClient();
