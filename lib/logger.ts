/**
 * Logger frontend production-safe (LOT 166)
 *
 * En développement : console.log/warn/error standard
 * En production : supprime les logs, route les erreurs vers Sentry
 *
 * Usage : import { logger } from '@/lib/logger';
 *         logger.info('Chargement terminé');
 *         logger.warn('API indisponible — données démo');
 *         logger.error('Erreur inattendue', error);
 */

import { captureSentryException, captureSentryMessage } from './sentry';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Logger conditionnel :
 * - DEV : console classique
 * - PROD : erreurs → Sentry, warn/info → silencieux
 */
export const logger = {
  /**
   * Information de débogage — silencieux en production
   */
  info: (...args: unknown[]): void => {
    if (!IS_PRODUCTION) {
      // eslint-disable-next-line no-console
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Avertissement — silencieux en production
   */
  warn: (...args: unknown[]): void => {
    if (!IS_PRODUCTION) {
      // eslint-disable-next-line no-console
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Erreur — console en dev, Sentry en production
   * SECURITY: Ne JAMAIS logger d'erreur détaillée en production côté client
   */
  error: (message: string, error?: unknown): void => {
    if (IS_PRODUCTION) {
      // En production, envoyer uniquement à Sentry (pas visible dans DevTools)
      if (error instanceof Error) {
        captureSentryException(error, { message });
      } else {
        captureSentryMessage(message, 'error');
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('[ERROR]', message, error);
    }
  },

  /**
   * Log conditionnel pour le développement uniquement
   */
  debug: (...args: unknown[]): void => {
    if (!IS_PRODUCTION) {
      // eslint-disable-next-line no-console
      console.debug('[DEBUG]', ...args);
    }
  },
};
