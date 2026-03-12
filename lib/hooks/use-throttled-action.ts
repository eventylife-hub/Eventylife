'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * Hook pour throttler une action asynchrone côté client
 *
 * Empêche le double-click / soumissions multiples.
 * Expose `isPending` pour désactiver le bouton pendant l'exécution.
 *
 * @param action - Fonction async à exécuter
 * @param cooldownMs - Délai minimum entre deux exécutions (défaut 2000ms)
 *
 * @example
 * ```tsx
 * const [handleSubmit, isPending] = useThrottledAction(
 *   async () => { await store.submitFeedback(data); },
 *   2000,
 * );
 *
 * <button onClick={handleSubmit} disabled={isPending}>
 *   {isPending ? 'Envoi…' : 'Envoyer'}
 * </button>
 * ```
 */
export function useThrottledAction<T extends unknown[]>(
  action: (...args: T) => Promise<void>,
  cooldownMs = 2_000,
): [(...args: T) => Promise<void>, boolean] {
  const [isPending, setIsPending] = useState(false);
  const lastCallRef = useRef<number>(0);

  const throttled = useCallback(
    async (...args: T) => {
      const now = Date.now();
      if (now - lastCallRef.current < cooldownMs) return;
      if (isPending) return;

      lastCallRef.current = now;
      setIsPending(true);
      try {
        await action(...args);
      } finally {
        setIsPending(false);
      }
    },
    [action, cooldownMs, isPending],
  );

  return [throttled, isPending];
}
