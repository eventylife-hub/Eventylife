/**
 * Données de démonstration — Eventy Life
 *
 * Centralisées ici pour faciliter la maintenance et le retrait
 * avant la mise en production. Les pages et stores importent
 * ces constantes pour le fallback quand l'API est indisponible.
 *
 * TODO: Supprimer ce fichier à la connexion de l'API réelle.
 */

import type { Notification } from '@/lib/stores/notification-store';

/* ─── Notifications ─────────────────────────────── */

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    userId: 'usr_client_001',
    type: 'BOOKING',
    title: 'Réservation confirmée',
    message:
      'Votre réservation pour Marrakech Express a été confirmée. Bon voyage !',
    linkUrl: '/client/reservations',
    isRead: false,
    createdAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'notif_002',
    userId: 'usr_client_001',
    type: 'PAYMENT',
    title: 'Paiement reçu',
    message:
      'Nous avons bien reçu votre acompte de 349,50 € pour Barcelone & Gaudí.',
    linkUrl: '/client/paiements',
    isRead: true,
    readAt: '2026-02-06T08:00:00Z',
    createdAt: '2026-02-05T09:16:00Z',
  },
  {
    id: 'notif_003',
    userId: 'usr_client_001',
    type: 'REMINDER',
    title: 'Solde à régler',
    message:
      "N'oubliez pas de régler le solde de 349,50 € pour votre voyage à Barcelone avant le 20 mai.",
    linkUrl: '/client/paiements',
    isRead: false,
    createdAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'notif_004',
    userId: 'usr_client_001',
    type: 'INFO',
    title: 'Nouveau voyage disponible',
    message:
      "Découvrez notre nouveau voyage à Dubrovnik, Perle de l'Adriatique ! Places limitées.",
    linkUrl: '/voyages/dubrovnik-perle-adriatique',
    isRead: true,
    readAt: '2026-03-06T14:00:00Z',
    createdAt: '2026-03-05T12:00:00Z',
  },
];

export const DEMO_NOTIFICATIONS_UNREAD_COUNT = 2;
