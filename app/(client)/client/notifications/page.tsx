'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { NotificationItem } from '@/components/notifications/notification-item';
/**
 * Page complète des notifications
 * Affiche toutes les notifications avec pagination infinie et filtrage
 */
export default function NotificationsPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  // Charge les notifications au montage
  useEffect(() => {
    fetchNotifications(50);
  }, [fetchNotifications]);

  // Intersection Observer pour le scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading) {
          fetchMore(50);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget?.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoading, fetchMore]);

  // Filtre les notifications si un type est sélectionné
  const filteredNotifications = filter
    ? notifications.filter((n) => n.type === filter)
    : notifications;

  // Types de notifications uniques
  const types = Array.from(new Set(notifications.map((n) => n.type)));

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: 'var(--navy, #1A1A2E)' }}>
          Notifications
        </h1>
        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          {filteredNotifications.length} notification(s)
          {unreadCount > 0 && ` • ${unreadCount} non lue(s)`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
        {unreadCount > 0 && (
          <button type="button"
            onClick={markAllAsRead}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: '#fff',
              color: 'var(--navy, #1A1A2E)',
              border: '1.5px solid #E5E0D8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            Marquer tout comme lu
          </button>
        )}

        {/* Filtres */}
        <div className="flex gap-2 flex-wrap">
          <button type="button"
            onClick={() => setFilter(null)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === null ? 'var(--terra, #C75B39)' : '#fff',
              color: filter === null ? '#fff' : 'var(--navy, #1A1A2E)',
              border: `1.5px solid ${filter === null ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== null) {
                e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== null) {
                e.currentTarget.style.background = '#fff';
              }
            }}
          >
            Tous
          </button>
          {types.map((type) => (
            <button type="button"
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: filter === type ? 'var(--terra, #C75B39)' : '#fff',
                color: filter === type ? '#fff' : 'var(--navy, #1A1A2E)',
                border: `1.5px solid ${filter === type ? 'var(--terra, #C75B39)' : '#E5E0D8'}`,
              }}
              onMouseEnter={(e) => {
                if (filter !== type) {
                  e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== type) {
                  e.currentTarget.style.background = '#fff';
                }
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1.5px solid #E5E0D8' }}>
        {error && (
          <div className="p-6" style={{ background: 'var(--terra-soft, #FEF2F2)', borderBottom: '1.5px solid #FCA5A5', color: 'var(--terra, #DC2626)' }}>
            <p className="text-sm font-medium">⚠️ Une erreur s'est produite: {error}</p>
          </div>
        )}

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-base font-bold mb-2" style={{ color: 'var(--navy, #1A1A2E)' }}>
              Aucune notification pour le moment
            </p>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              {filter
                ? 'Essayez de changer le filtre pour voir d\'autres notifications'
                : 'Vous recevrez des notifications quand des actions importantes auront lieu'}
            </p>
            <Link href="/client">
              <button type="button"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: '#fff',
                  color: 'var(--navy, #1A1A2E)',
                  border: '1.5px solid #E5E0D8',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(199,91,57,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
              >
                Retour au tableau de bord
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div style={{ borderTop: '1.5px solid #E5E0D8' }}>
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    borderBottom: index < filteredNotifications.length - 1 ? '1px solid #E5E0D8' : 'none',
                  }}
                >
                  <NotificationItem
                    {...notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>

            {/* Loading indicator pour scroll infini */}
            {isLoading && (
              <div className="p-8 text-center">
                <div className="inline-block w-6 h-6 border-2 rounded-full" style={{ borderColor: '#E5E0D8', borderTopColor: 'var(--terra, #C75B39)', animation: 'spin 1s linear infinite' }} />
              </div>
            )}

            {/* Sentinel pour intersection observer */}
            <div ref={observerTarget} className="p-4" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm" style={{ color: '#6B7280' }}>
        <p>
          Les notifications sont conservées pendant 30 jours, passé ce délai,
          elles seront supprimées automatiquement.
        </p>
      </div>
    </div>
  );
}
