/**
 * Utilitaire de gestion d'erreurs API — Eventy Life
 *
 * Uniformise la gestion des erreurs réseau et API
 * avec messages en français et support retry.
 */

import { logger } from './logger';
import { ERROR_MESSAGES } from './config';

/** Structure d'erreur API normalisée */
export interface ApiError {
  /** Message lisible en français */
  message: string;
  /** Code HTTP si disponible */
  status?: number;
  /** L'erreur peut être retentée (erreur réseau, 5xx) */
  retryable: boolean;
  /** Erreur originale pour le debug */
  original?: unknown;
}

/**
 * Normalise une erreur (fetch, réseau, ou inconnue)
 * en message français lisible + flag retryable.
 */
export function normalizeApiError(error: unknown, context?: string): ApiError {
  const prefix = context ? `[${context}] ` : '';

  // TypeError: Failed to fetch → erreur réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    logger.warn(`${prefix}Erreur réseau`, error);
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      retryable: true,
      original: error,
    };
  }

  // Response HTTP (quand on lance depuis un fetch .ok check)
  if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
    const status = (error as { status: number }).status;
    logger.warn(`${prefix}Erreur HTTP ${status}`);

    if (status === 401 || status === 403) {
      return { message: ERROR_MESSAGES.AUTH_ERROR, status, retryable: false, original: error };
    }
    if (status === 404) {
      return { message: ERROR_MESSAGES.NOT_FOUND, status, retryable: false, original: error };
    }
    if (status === 422) {
      return { message: ERROR_MESSAGES.VALIDATION_ERROR, status, retryable: false, original: error };
    }
    if (status >= 500) {
      return { message: ERROR_MESSAGES.SERVER_ERROR, status, retryable: true, original: error };
    }

    return { message: ERROR_MESSAGES.SERVER_ERROR, status, retryable: false, original: error };
  }

  // Error standard
  if (error instanceof Error) {
    logger.error(`${prefix}${error.message}`, error);
    return {
      message: error.message || ERROR_MESSAGES.SERVER_ERROR,
      retryable: false,
      original: error,
    };
  }

  // Fallback inconnu
  logger.error(`${prefix}Erreur inconnue`, error);
  return {
    message: ERROR_MESSAGES.SERVER_ERROR,
    retryable: true,
    original: error,
  };
}

/**
 * Exécute une fonction async avec retry automatique.
 *
 * @param fn Fonction async à exécuter
 * @param maxRetries Nombre max de tentatives (défaut: 2)
 * @param delayMs Délai entre les tentatives en ms (défaut: 1000)
 * @returns Le résultat de fn ou lance l'erreur normalisée
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 1000,
): Promise<T> {
  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = normalizeApiError(error);

      // Ne pas réessayer si l'erreur n'est pas retryable
      if (!lastError.retryable || attempt === maxRetries) {
        throw lastError;
      }

      // Attendre avant le prochain essai (backoff exponentiel)
      const delay = delayMs * Math.pow(2, attempt);
      logger.info(`Tentative ${attempt + 1}/${maxRetries} échouée, retry dans ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Fetch helper avec gestion d'erreur normalisée.
 * Lance une ApiError si la réponse n'est pas ok.
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const apiError = normalizeApiError(response);
    throw apiError;
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
