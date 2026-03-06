import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/nextjs';
import { useNotificationStore } from '@/lib/stores/notification-store';

/**
 * Hook pour connecter les notifications WebSocket en temps réel
 * L'authentification se fait via les cookies httpOnly envoyés automatiquement
 * lors du handshake WebSocket (même origine)
 */
export function useNotificationsWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayRef = useRef(1000);
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL ||
          (typeof window !== 'undefined'
            ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
            : 'ws://localhost:3001');

        // Les cookies httpOnly sont envoyés automatiquement avec le handshake WS
        const socket = new WebSocket(`${wsUrl}/notifications`);

        socket.onopen = () => {
          // Breadcrumb Sentry: WebSocket connecté
          Sentry.addBreadcrumb({
            category: 'websocket',
            message: 'Connexion WebSocket établie',
            level: 'info',
          });
          reconnectAttemptsRef.current = 0;
          reconnectDelayRef.current = 1000;

          // Ping périodique pour maintenir la connexion
          const pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000);

          socket.onclose = () => {
            clearInterval(pingInterval);
          };
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'notification' || data.type === 'notification:broadcast') {
              addNotification(data.notification || data);
            } else if (data.type === 'pong') {
              // Pong silencieux
            } else if (data.type === 'connected') {
              // WebSocket identifié — silencieux en production
            } else if (data.type === 'error' && data.code === 'UNAUTHORIZED') {
              // Cookie expiré ou invalide — ne pas reconnecter
              Sentry.captureMessage(
                'WebSocket: authentification échouée (cookie expiré ou invalide)',
                'warning'
              );
              reconnectAttemptsRef.current = maxReconnectAttempts;
              socket.close();
            }
          } catch (parseError) {
            // Capturer les erreurs de parsing des messages WebSocket
            Sentry.captureException(parseError, {
              contexts: {
                websocket: { action: 'message_parsing' },
              },
            });
          }
        };

        socket.onerror = (error) => {
          // Capturer les erreurs de connexion WebSocket
          Sentry.captureException(error, {
            contexts: {
              websocket: { action: 'connection_error' },
            },
          });
        };

        socket.onclose = () => {
          // Breadcrumb Sentry: WebSocket déconnecté
          Sentry.addBreadcrumb({
            category: 'websocket',
            message: 'Connexion WebSocket fermée',
            level: 'info',
          });
          socketRef.current = null;

          // Tentative de reconnexion avec backoff exponentiel
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            const delay = reconnectDelayRef.current;
            // Reconnexion silencieuse avec backoff exponentiel
            setTimeout(connectWebSocket, delay);
            reconnectDelayRef.current = Math.min(
              reconnectDelayRef.current * 2,
              30000,
            );
          } else {
            // Nombre maximum de reconnexions atteint
            Sentry.captureMessage(
              'Nombre maximum de reconnexions WebSocket atteint (5 tentatives)',
              'warning'
            );
          }
        };

        socketRef.current = socket;
      } catch (initError) {
        // Capturer les erreurs lors de l'initialisation du WebSocket
        Sentry.captureException(initError, {
          contexts: {
            websocket: { action: 'initialization' },
          },
        });
      }
    };

    if (typeof window !== 'undefined') {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [addNotification]);

  return socketRef.current;
}
