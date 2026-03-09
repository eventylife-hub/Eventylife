'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { NotificationItem } from '@/components/notifications/notification-item';

const C = {
  navy: '#1A1A2E',
  cream: '#FAF7F2',
  terra: '#C75B39',
  terraLight: '#D97B5E',
  terraSoft: '#FEF0EB',
  gold: '#D4A853',
  goldSoft: '#FDF6E8',
  border: '#E5E0D8',
  muted: '#6B7280',
  forest: '#166534',
  forestBg: '#DCFCE7',
};

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
        <h1 className="font-display text-2xl sm:text-3xl font-bold" style={{ color: C.navy }}>
          Notifications
        </h1>
        <p className="text-sm mt-2" style={{ color: C.muted }}>
          {filteredNotifications.length} notification(s)
          {unreadCount > 0 && ` • ${unreadCount} non lue(s)`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-wrap">
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: '#fff',
              color: C.navy,
              border: `1.5px solid ${C.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.terraSoft;
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
          <button
            onClick={() => setFilter(null)}
            className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: filter === null ? C.terra : '#fff',
              color: filter === null ? '#fff' : C.navy,
              border: `1.5px solid ${filter === null ? C.terra : C.border}`,
            }}
            onMouseEnter={(e) => {
              if (filter !== null) {
                e.currentTarget.style.background = C.terraSoft;
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
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: filter === type ? C.terra : '#fff',
                color: filter === type ? '#fff' : C.navy,
                border: `1.5px solid ${filter === type ? C.terra : C.border}`,
              }}
              onMouseEnter={(e) => {
                if (filter !== type) {
                  e.currentTarget.style.background = C.terraSoft;
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
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1.5px solid ${C.border}` }}>
        {error && (
          <div className="p-6" style={{ background: '#FEF2F2', borderBottom: `1.5px solid #FCA5A5`, color: '#DC2626' }}>
            <p className="text-sm font-medium">⚠️ Une erreur s'est produite: {error}</p>
          </div>
        )}

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-base font-bold mb-2" style={{ color: C.navy }}>
              Aucune notification pour le moment
            </p>
            <p className="text-sm mb-6" style={{ color: C.muted }}>
              {filter
                ? 'Essayez de changer le filtre pour voir d\'autres notifications'
                : 'Vous recevrez des notifications quand des actions importantes auront lieu'}
            </p>
            <Link href="/client">
              <button
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: '#fff',
                  color: C.navy,
                  border: `1.5px solid ${C.border}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = C.terraSoft;
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
            <div style={{ borderTop: `1.5px solid ${C.border}` }}>
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  style={{
                    borderBottom: index < filteredNotifications.length - 1 ? `1px solid ${C.border}` : 'none',
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
                <div className="inline-block w-6 h-6 border-2 rounded-full" style={{ borderColor: C.border, borderTopColor: C.terra, animation: 'spin 1s linear infinite' }} />
              </div>
            )}

            {/* Sentinel pour intersection observer */}
            <div ref={observerTarget} className="p-4" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-sm" style={{ color: C.muted }}>
        <p>
          Les notifications sont conservées pendant 30 jours, passé ce délai,
          elles seront supprimées automatiquement.
        </p>
      </div>
    </div>
  );
}
