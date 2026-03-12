import { logger } from '@/lib/logger';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { extractErrorMessage } from '@/lib/api-error';
import { DEMO_NOTIFICATIONS, DEMO_NOTIFICATIONS_UNREAD_COUNT } from '@/lib/demo-data';
import { API_URL } from '@/lib/config';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface PaginationState {
  items: Notification[];
  hasMore: boolean;
  nextCursor?: string;
  total: number;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  cursor?: string;

  // Actions
  fetchNotifications: (limit?: number) => Promise<void>;
  fetchMore: (limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearError: () => void;
}

const API_BASE_URL = API_URL;

/**
 * Store Zustand pour les notifications
 * Gère l'état des notifications et les interactions avec l'API
 */
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      cursor: undefined,

      /**
       * Récupère les notifications de l'utilisateur
       */
      fetchNotifications: async (limit = 20) => {
        set({ isLoading: true, error: null });
        try {
          // Auth token is in httpOnly cookie, sent automatically with credentials: 'include'
          const response = await fetch(
            `${API_BASE_URL}/notifications?limit=${limit}`,
            {
              credentials: 'include',
            },
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status}`);
          }

          const data = await response.json();
          set({
            notifications: data.items || [],
            cursor: data.nextCursor,
            isLoading: false,
          });

          // Récupère le nombre de non-lus
          const unreadResponse = await fetch(
            `${API_BASE_URL}/notifications/unread-count`,
            {
              credentials: 'include',
            },
          );

          if (unreadResponse.ok) {
            const unreadData = await unreadResponse.json();
            set({ unreadCount: unreadData.unreadCount });
          }
        } catch {
          logger.warn('API notifications indisponible — données démo');
          if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
            set({
              notifications: DEMO_NOTIFICATIONS,
              unreadCount: DEMO_NOTIFICATIONS_UNREAD_COUNT,
              error: null,
              isLoading: false,
            });
          } else {
            set({
              notifications: [],
              unreadCount: 0,
              error: 'Erreur chargement notifications',
              isLoading: false,
            });
          }
        }
      },

      /**
       * Charge plus de notifications (pagination)
       */
      fetchMore: async (limit = 20) => {
        const state = get();
        if (!state.cursor || state.isLoading) return;

        set({ isLoading: true, error: null });
        try {
          // Auth token is in httpOnly cookie, sent automatically with credentials: 'include'
          const response = await fetch(
            `${API_BASE_URL}/notifications?cursor=${state.cursor}&limit=${limit}`,
            {
              credentials: 'include',
            },
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch notifications: ${response.status}`);
          }

          const data = await response.json();
          set({
            notifications: [...state.notifications, ...(data.items || [])],
            cursor: data.nextCursor,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: extractErrorMessage(error, 'Erreur inconnue'),
            isLoading: false,
          });
        }
      },

      /**
       * Marque une notification comme lue
       */
      markAsRead: async (id: string) => {
        try {
          // Auth token is in httpOnly cookie, sent automatically with credentials: 'include'
          const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`Failed to mark notification as read`);
          }

          // Met à jour le store localement
          const state = get();
          set({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          });
        } catch (error) {
          set({
            error: extractErrorMessage(error, 'Erreur inconnue'),
          });
        }
      },

      /**
       * Marque toutes les notifications comme lues
       */
      markAllAsRead: async () => {
        try {
          // Auth token is in httpOnly cookie, sent automatically with credentials: 'include'
          const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`Failed to mark all notifications as read`);
          }

          // Met à jour le store localement
          const state = get();
          set({
            notifications: state.notifications.map((n) => ({
              ...n,
              isRead: true,
            })),
            unreadCount: 0,
          });
        } catch (error) {
          set({
            error: extractErrorMessage(error, 'Erreur inconnue'),
          });
        }
      },

      /**
       * Supprime une notification
       */
      deleteNotification: async (id: string) => {
        try {
          // Auth token is in httpOnly cookie, sent automatically with credentials: 'include'
          const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error(`Failed to delete notification`);
          }

          // Met à jour le store localement
          const state = get();
          const notificationToDelete = state.notifications.find(
            (n) => n.id === id,
          );
          set({
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notificationToDelete?.isRead
              ? state.unreadCount
              : Math.max(0, state.unreadCount - 1),
          });
        } catch (error) {
          set({
            error: extractErrorMessage(error, 'Erreur inconnue'),
          });
        }
      },

      /**
       * Ajoute une notification en temps réel (via WebSocket)
       */
      addNotification: (notification: Notification) => {
        const state = get();
        set({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        });
      },

      /**
       * Efface le message d'erreur
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    { name: 'NotificationStore' },
  ),
);
