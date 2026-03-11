/**
 * ErrorBoundary réutilisable — attrape les erreurs React dans les portails
 *
 * Usage :
 *   <ErrorBoundary fallback={<p>Oups, une erreur est survenue.</p>}>
 *     <MonComposant />
 *   </ErrorBoundary>
 *
 * Ou avec le composant utilitaire par portail :
 *   <PortalErrorBoundary portal="client">
 *     <MonComposant />
 *   </PortalErrorBoundary>
 */
'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Élément affiché en cas d'erreur (statique) */
  fallback?: ReactNode;
  /** Callback optionnel appelé à chaque erreur capturée */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─── Composant classe (requis par React pour les error boundaries) ──

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log vers console (remplacer par Sentry en prod)
    console.error('[ErrorBoundary] Erreur capturée :', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Oups, une erreur est survenue
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Nous sommes désolés pour la gêne occasionnée.
              Veuillez réessayer ou contacter notre support si le problème persiste.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="bg-gray-900 text-red-400 text-xs p-3 rounded-lg mb-4 text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button type="button"
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              🔄 Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Composant utilitaire par portail ──────────────────────

type PortalName = 'client' | 'pro' | 'admin' | 'checkout' | 'public';

const PORTAL_LABELS: Record<PortalName, string> = {
  client: 'Espace Client',
  pro: 'Espace Pro',
  admin: 'Administration',
  checkout: 'Paiement',
  public: 'Eventy Life',
};

const PORTAL_COLORS: Record<PortalName, { bg: string; border: string; button: string }> = {
  client: { bg: 'bg-blue-50', border: 'border-blue-200', button: 'bg-blue-600 hover:bg-blue-700' },
  pro: { bg: 'bg-emerald-50', border: 'border-emerald-200', button: 'bg-emerald-600 hover:bg-emerald-700' },
  admin: { bg: 'bg-purple-50', border: 'border-purple-200', button: 'bg-purple-600 hover:bg-purple-700' },
  checkout: { bg: 'bg-orange-50', border: 'border-orange-200', button: 'bg-orange-600 hover:bg-orange-700' },
  public: { bg: 'bg-gray-50', border: 'border-gray-200', button: 'bg-gray-800 hover:bg-gray-900' },
};

interface PortalErrorBoundaryProps {
  children: ReactNode;
  portal: PortalName;
  /** Callback optionnel appelé à chaque erreur capturée */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary spécialisé par portail avec couleurs et libellés adaptés
 */
export function PortalErrorBoundary({ children, portal, onError }: PortalErrorBoundaryProps) {
  const label = PORTAL_LABELS[portal];
  const colors = PORTAL_COLORS[portal];

  const portalFallback = (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-4 py-12">
      <div className={`${colors.bg} border ${colors.border} rounded-xl p-8 max-w-md w-full text-center`}>
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Erreur dans {label}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Une erreur inattendue s'est produite.
          Veuillez rafraîchir la page ou contacter notre support.
        </p>
        <button type="button"
          onClick={() => window.location.reload()}
          className={`inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors font-medium text-sm ${colors.button}`}
        >
          🔄 Rafraîchir la page
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={portalFallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
