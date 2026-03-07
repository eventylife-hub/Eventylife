/**
 * Point d'entrée centralisé pour tous les hooks personnalisés
 * Facilite les importations : import { useDebounce, useAuth } from '@/hooks'
 * au lieu de : import { useDebounce } from '@/hooks/use-debounce'
 */

export { useDebounce } from './use-debounce';
export { useFileUpload } from './use-file-upload';
export { useMediaQuery } from './use-media-query';
export { useNotificationsWebSocket } from './use-notifications-websocket';
export { usePagination } from './use-pagination';
export { useAuth } from './useAuth';
export { useCookieConsent } from './useCookieConsent';
