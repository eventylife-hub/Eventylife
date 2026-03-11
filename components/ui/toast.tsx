/**
 * Composant Toast pour les notifications
 */

'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';

/**
 * Composant Toast individuel
 */
interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const ToastItem = ({ id, type, message, onClose }: ToastItemProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border-2',
        'animate-in slide-in-from-bottom-4 duration-300',
        typeStyles[type]
      )}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button type="button"
        onClick={onClose}
        className="text-current opacity-70 hover:opacity-100 font-bold text-lg"
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Conteneur de toasts
 */
export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
