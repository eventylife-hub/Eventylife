import * as Sentry from '@sentry/nextjs';

/**
 * Initialisation de Sentry pour Next.js 14
 * Configure le monitoring des erreurs, les performances et la replay de sessions
 */

/**
 * Initialise Sentry avec les paramètres appropriés
 */
export function initializeSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const environment = process.env.NODE_ENV || 'development';
  const releaseVersion = process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unknown';

  if (!dsn) {
    console.warn('⚠️  NEXT_PUBLIC_SENTRY_DSN not configured, error reporting disabled');
    return;
  }

  // Initialiser Sentry pour Next.js
  Sentry.init({
    dsn,
    environment,
    release: releaseVersion,
    // Taux d'échantillonnage des traces (20% en production, 100% en développement)
    tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
    // Enregistrer les breadcrumbs pour les traces
    maxBreadcrumbs: 50,
    // Intégration de la limite des données de replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0, // Toujours capturer la replay en cas d'erreur
    // Filtrer les erreurs indésirables
    denyUrls: [
      // Ignorer les erreurs des scripts tiers
      /\/node_modules\//,
      /\/dist\//,
      /\/\.next\//,
    ],
    // Activer la capture de la stack trace
    attachStacktrace: true,
    // Intégrations
    integrations: [
      // Intégration Error Boundary pour les erreurs React
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });

  // Ajouter l'intégration du replay de session si disponible
  // Note: replayCanBegin is set automatically by Sentry when the replay integration is active
  // No need to manually set it
}

/**
 * Configure le contexte utilisateur dans Sentry (frontend)
 */
export function setSentryUser(userData: {
  id: string;
  email?: string;
  username?: string;
}): void {
  if (typeof window !== 'undefined') {
    Sentry.setUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
    });
  }
}

/**
 * Réinitialise le contexte utilisateur (déconnexion)
 */
export function clearSentryUser(): void {
  if (typeof window !== 'undefined') {
    Sentry.setUser(null);
  }
}

/**
 * Ajoute une information de suivi (breadcrumb) dans la timeline
 */
export function addSentryBreadcrumb(
  category: string,
  message: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>,
): void {
  if (typeof window !== 'undefined') {
    Sentry.addBreadcrumb({
      category,
      message,
      level,
      data,
      timestamp: Math.floor(Date.now() / 1000),
    });
  }
}

/**
 * Capture manuellement un message d'erreur
 */
export function captureSentryMessage(
  message: string,
  level: Sentry.SeverityLevel = 'error',
): void {
  if (typeof window !== 'undefined') {
    Sentry.captureMessage(message, level);
  }
}

/**
 * Capture manuellement une exception
 */
export function captureSentryException(
  error: Error,
  context?: Record<string, unknown>,
): void {
  if (typeof window !== 'undefined') {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}
