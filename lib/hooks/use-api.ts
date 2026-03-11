'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';

/**
 * 4 états UI conformes aux specs Eventy :
 * Loading (skeleton) / Empty (CTA) / Error (toast FR + retry) / Data
 */
type LoadState = 'loading' | 'empty' | 'error' | 'data';

interface UseApiResult<T> {
  data: T | null;
  state: LoadState;
  error: string | null;
  /** Relancer la requête */
  refetch: () => Promise<void>;
  /** Mutation manuelle des données (optimistic update) */
  mutate: (updater: T | ((prev: T | null) => T | null)) => void;
}

interface UseApiOptions {
  /** Désactiver le fetch automatique au montage */
  enabled?: boolean;
  /** Données par défaut pendant le chargement */
  initialData?: unknown;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** Callback en cas de succès */
  onSuccess?: (data: unknown) => void;
}

/**
 * Hook de data fetching avec gestion des 4 états UI
 *
 * @example
 * ```tsx
 * const { data, state, error, refetch } = useApi<Travel[]>('/travels');
 *
 * if (state === 'loading') return <SkeletonGrid />;
 * if (state === 'error') return <ErrorState message={error} onRetry={refetch} />;
 * if (state === 'empty') return <EmptyState cta="Créer un voyage" />;
 * // state === 'data'
 * return <TravelList items={data} />;
 * ```
 */
export function useApi<T>(
  endpoint: string | null,
  options: UseApiOptions = {},
): UseApiResult<T> {
  const { enabled = true, initialData, onError, onSuccess } = options;

  const [data, setData] = useState<T | null>((initialData as T) ?? null);
  const [state, setState] = useState<LoadState>(initialData ? 'data' : 'loading');
  const [error, setError] = useState<string | null>(null);

  // Ref pour éviter les race conditions (requête annulée si le composant change)
  const requestRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    const currentRequest = ++requestRef.current;
    setState('loading');
    setError(null);

    try {
      const response = await apiClient.get(endpoint);

      // Ignorer si une requête plus récente est en cours
      if (currentRequest !== requestRef.current) return;

      if (response.success && response.data !== undefined) {
        const result = response.data as T;

        // Déterminer si les données sont vides
        const isEmpty = Array.isArray(result)
          ? result.length === 0
          : result === null || result === undefined;

        setData(result);
        setState(isEmpty ? 'empty' : 'data');
        onSuccess?.(result);
      } else {
        setData(null);
        setState('empty');
      }
    } catch (err) {
      if (currentRequest !== requestRef.current) return;

      const message =
        err instanceof Error ? err.message : 'Une erreur est survenue';

      setError(message);
      setState('error');
      onError?.(message);
    }
  }, [endpoint, onError, onSuccess]);

  // Fetch automatique au montage et quand l'endpoint change
  useEffect(() => {
    if (enabled && endpoint) {
      fetchData();
    }
  }, [enabled, endpoint, fetchData]);

  const mutate = useCallback(
    (updater: T | ((prev: T | null) => T | null)) => {
      if (typeof updater === 'function') {
        setData((prev) => (updater as (prev: T | null) => T | null)(prev));
      } else {
        setData(updater);
      }
      setState(updater === null ? 'empty' : 'data');
    },
    [],
  );

  return { data, state, error, refetch: fetchData, mutate };
}

/**
 * Hook pour les mutations (POST, PUT, PATCH, DELETE)
 *
 * @example
 * ```tsx
 * const { execute, isLoading, error } = useMutation<Travel>('/travels', 'POST');
 * const handleCreate = async (data: CreateTravelDto) => {
 *   const result = await execute(data);
 *   if (result) router.push(`/pro/voyages/${result.id}`);
 * };
 * ```
 */
export function useMutation<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body?: unknown): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        switch (method) {
          case 'POST':
            response = await apiClient.post(endpoint, body);
            break;
          case 'PUT':
            response = await apiClient.put(endpoint, body);
            break;
          case 'PATCH':
            response = await apiClient.patch(endpoint, body);
            break;
          case 'DELETE':
            response = await apiClient.delete(endpoint);
            break;
        }

        if (response.success) {
          return (response.data as T) ?? null;
        }

        throw new Error(response.message || 'Erreur serveur');
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Une erreur est survenue';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method],
  );

  return { execute, isLoading, error, clearError: () => setError(null) };
}

export default useApi;
