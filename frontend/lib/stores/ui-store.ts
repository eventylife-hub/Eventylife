/**
 * Store Zustand pour la gestion de l'état UI
 */

import { create } from 'zustand';

/**
 * Types pour les notifications
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * État du store
 */
interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Modal
  modals: Record<string, boolean>;
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
}

/**
 * Générer un ID unique pour les toasts
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Créer le store UI
 */
export const useUIStore = create<UIStore>((set) => ({
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Mobile menu
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  // Toasts
  toasts: [],
  addToast: (toast: Omit<Toast, 'id'>) =>
    set((state) => {
      const id = generateId();
      const newToast: Toast = { ...toast, id };
      
      // Auto-remove après durée
      const duration = toast.duration || 3000;
      if (duration > 0) {
        setTimeout(() => {
          set((s) => ({
            toasts: s.toasts.filter((t) => t.id !== id)
          }));
        }, duration);
      }

      return {
        toasts: [...state.toasts, newToast]
      };
    }),

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),

  clearToasts: () => set({ toasts: [] }),

  // Loading
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  // Modals
  modals: {},
  openModal: (key: string) =>
    set((state) => ({
      modals: { ...state.modals, [key]: true }
    })),

  closeModal: (key: string) =>
    set((state) => ({
      modals: { ...state.modals, [key]: false }
    }))
}));

/**
 * Hook helper pour les toasts
 */
export function useToast() {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message: string) =>
      addToast({ type: 'success', message, duration: 3000 }),
    
    error: (message: string) =>
      addToast({ type: 'error', message, duration: 4000 }),
    
    info: (message: string) =>
      addToast({ type: 'info', message, duration: 3000 }),
    
    warning: (message: string) =>
      addToast({ type: 'warning', message, duration: 3500 })
  };
}
