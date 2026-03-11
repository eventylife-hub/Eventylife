'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface NotificationItemProps {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Composant affichant une notification individuelle
 * Affiche l'icône basée sur le type, le titre, le message et le temps écoulé
 */
export function NotificationItem({
  id,
  type,
  title,
  message,
  linkUrl,
  isRead,
  createdAt,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'BOOKING':
        return '🎫';
      case 'PAYMENT':
        return '💳';
      case 'DOCUMENT':
        return '📄';
      case 'SYSTEM':
        return '⚙️';
      case 'MARKETING':
        return '📢';
      case 'SUPPORT':
        return '🆘';
      default:
        return '📢';
    }
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      BOOKING: 'Réservation',
      PAYMENT: 'Paiement',
      DOCUMENT: 'Document',
      SYSTEM: 'Système',
      MARKETING: 'Marketing',
      SUPPORT: 'Support',
    };
    return labels[type] || type;
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const Content = () => (
    <div
      className={`flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer ${
        !isRead ? 'bg-blue-50' : 'bg-white'
      }`}
      onClick={handleClick}
    >
      {/* Icône */}
      <div className="flex-shrink-0 text-2xl">{getIcon()}</div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{message}</p>
          </div>
          {!isRead && (
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-gray-700">
            {getTypeLabel()}
          </span>
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Action delete */}
      <button type="button"
        onClick={handleDelete}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition"
        aria-label="Supprimer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );

  // Si la notification a un lien, la rendre cliquable
  if (linkUrl) {
    return (
      <Link href={linkUrl}>
        <Content />
      </Link>
    );
  }

  return <Content />;
}
