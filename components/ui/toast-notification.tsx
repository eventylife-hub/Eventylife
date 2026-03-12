'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface ToastNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  /** Durée d'affichage en ms (défaut 4000, 0 = pas d'auto-dismiss) */
  duration?: number;
  /** Afficher un bouton Réessayer */
  onRetry?: () => void;
}

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const COLORS: Record<string, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

/**
 * Composant Toast réutilisable — Eventy Life
 *
 * Utilisable dans les 3 portails (client, pro, admin).
 * Accessible : role="alert" + aria-live + bouton fermer.
 *
 * @example
 * ```tsx
 * {toast && (
 *   <ToastNotification
 *     type={toast.type}
 *     message={toast.message}
 *     onClose={() => setToast(null)}
 *     onRetry={toast.retryable ? handleRetry : undefined}
 *   />
 * )}
 * ```
 */
export const ToastNotification = React.memo(function ToastNotification({
  type,
  message,
  onClose,
  duration = 4000,
  onRetry,
}: ToastNotificationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = useCallback(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(onClose, duration);
    }
  }, [duration, onClose]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-md animate-in fade-in slide-in-from-bottom-4',
        COLORS[type],
      )}
    >
      <span className="text-lg flex-shrink-0" aria-hidden="true">
        {ICONS[type]}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onRetry();
          }}
          className="text-sm font-semibold underline hover:no-underline min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Réessayer l'action"
        >
          Réessayer
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-medium hover:underline min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
        aria-label="Fermer la notification"
      >
        ×
      </button>
    </div>
  );
});
