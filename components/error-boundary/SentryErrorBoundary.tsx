'use client';

import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Props pour le composant SentryErrorBoundary
 */
interface SentryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * État du composant Error Boundary
 */
interface SentryErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Composant Error Boundary personnalisé qui intègre Sentry
 * Capture les erreurs React et les envoie à Sentry
 * Affiche une interface utilisateur conviviale en cas d'erreur
 */
export class SentryErrorBoundary extends React.Component<
  SentryErrorBoundaryProps,
  SentryErrorBoundaryState
> {
  constructor(props: SentryErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Capture les erreurs et met à jour l'état
   */
  static getDerivedStateFromError(error: Error): SentryErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Envoie l'erreur à Sentry
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Capturer l'erreur dans Sentry avec les informations de contexte
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  /**
   * Réinitialise l'état d'erreur
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Affiche le formulaire de feedback Sentry
   */
  private handleReportFeedback = (): void => {
    if (typeof window !== 'undefined' && Sentry.showReportDialog) {
      Sentry.showReportDialog({
        title: 'Avez-vous rencontré un problème?',
        subtitle: 'Nous vous aiderons à le résoudre rapidement.',
        subtitle2: '',
        labelComments: 'Décrivez ce qui s\'est passé',
        labelEmail: 'Email',
        labelName: 'Nom',
        onLoad: (): void => {
          // Callback quand le formulaire est chargé
        },
      });
    }
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children } = this.props;

    // Si il n'y a pas d'erreur, afficher le contenu normal
    if (!hasError) {
      return children;
    }

    // Afficher l'interface d'erreur
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          {/* En-tête avec icône d'erreur */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Une erreur est survenue
          </h1>

          {/* Message descriptif */}
          <p className="mb-2 text-center text-gray-600">
            Nous nous excusons pour le désagrément. Une erreur inattendue s'est produite.
          </p>

          {/* Message d'erreur en développement */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="break-words text-sm font-mono text-red-700">
                {error.toString()}
              </p>
            </div>
          )}

          {/* Information de suivi */}
          <p className="mb-6 text-center text-sm text-gray-500">
            Nos équipes ont été notifiées et travaillent sur la résolution du problème.
          </p>

          {/* Boutons d'action */}
          <div className="space-y-3">
            {/* Bouton de rafraîchissement */}
            <button
              onClick={this.handleReset}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Réessayer
            </button>

            {/* Bouton de feedback */}
            <button
              onClick={this.handleReportFeedback}
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Signaler le problème
            </button>
          </div>

          {/* Lien vers la page d'accueil */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Retourner à la page d'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Composant wrapper qui utilise l'Error Boundary de Sentry avec notre UI personnalisée
 */
export function SentryErrorBoundaryWrapper({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Sentry.ErrorBoundary fallback={<SentryErrorBoundary children={<></>} />}>
      <SentryErrorBoundary>{children}</SentryErrorBoundary>
    </Sentry.ErrorBoundary>
  );
}
