/**
 * Point d'entrée centralisé pour tous les stores dans lib/stores
 * Facilite les importations : import { useAuthStore } from '@/lib/stores'
 * au lieu de : import { useAuthStore } from '@/lib/stores/auth-store'
 */

export { useAuthStore } from './auth-store';
export { useCheckoutStore } from './checkout-store';
export { useClientStore } from './client-store';
export { useNotificationStore } from './notification-store';
export { useProStore } from './pro-store';
export { useUIStore } from './ui-store';
