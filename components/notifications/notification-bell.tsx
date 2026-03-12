'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotificationStore } from '@/lib/stores/notification-store';
import { NotificationItem } from './notification-item';

/**
 * Composant cloche de notifications dans le header
 * Affiche le badge avec le nombre de non-lus
 * Ouvre un dropdown avec les dernières notifications
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading: storeLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  // Charge les notifications au premier rendu
  useEffect(() => {
    fetchNotifications();

    // Met à jour les notifications toutes les 30 secondes (polling)
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Ferme le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      setIsLoading(true);
      await fetchNotifications();
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton cloche */}
      <button type="button"
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge avec nombre de non-lus */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button type="button"
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Contenu */}
          <div className="max-h-96 overflow-y-auto">
            {storeLoading || isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full" />
              </div>
            ) : recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">Aucune notification pour le moment</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {recentNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <Link href="/client/notifications">
                <button className="w-full px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                  Voir toutes les notifications
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
