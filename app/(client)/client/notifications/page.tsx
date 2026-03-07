'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { NotificationItem } from '@/components/notifications/notification-item';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            {filteredNotifications.length} notification(s)
            {unreadCount > 0 && ` • ${unreadCount} non lue(s)`}
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
            >
              Marquer tout comme lu
            </Button>
          )}

          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tous
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              Une erreur s'est produite: {error}
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-gray-600 text-lg mb-2">
                Aucune notification pour le moment
              </p>
              <p className="text-gray-500 mb-6">
                {filter
                  ? 'Essayez de changer le filtre pour voir d\'autres notifications'
                  : 'Vous recevrez des notifications quand des actions importantes auront lieu'}
              </p>
              <Link href="/client">
                <Button variant="outline">Retour au tableau de bord</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Loading indicator pour scroll infini */}
              {isLoading && (
                <div className="p-8 text-center">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full" />
                </div>
              )}

              {/* Sentinel pour intersection observer */}
              <div ref={observerTarget} className="p-4" />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Les notifications sont conservées pendant 30 jours, passé ce délai,
            elles seront supprimées automatiquement.
          </p>
        </div>
      </div>
    </div>
  );
}
