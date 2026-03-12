'use client';

import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

interface UseToastOptions {
  /** Durée d'affichage en ms (défaut 3000) */
  duration?: number;
}

/**
 * Hook réutilisable pour les notifications toast
 *
 * @example
 * ```tsx
 * const { toast, showToast, hideToast } = useToast();
 *
 * showToast('success', 'Sauvegardé !');
 * showToast('error', 'Erreur réseau');
 *
 * {toast && (
 *   <div role="alert" aria-live="polite" className="...">
 *     {toast.message}
 *     <button onClick={hideToast} aria-label="Fermer la notification">×</button>
 *   </div>
 * )}
 * ```
 */
export function useToast(options: UseToastOptions = {}) {
  const { duration = 3000 } = options;
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({ type, message });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [duration],
  );

  return { toast, showToast, hideToast };
}
