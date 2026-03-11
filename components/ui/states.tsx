'use client';

/**
 * Composants réutilisables pour les 4 états UI (specs Eventy)
 * Loading → Skeleton (déjà dans skeleton.tsx)
 * Empty   → EmptyState avec CTA
 * Error   → ErrorState avec retry
 * Data    → Géré par le composant parent
 */

interface EmptyStateProps {
  /** Icône emoji ou composant */
  icon?: string;
  /** Titre de l'état vide */
  title: string;
  /** Description */
  description?: string;
  /** Texte du bouton CTA */
  ctaLabel?: string;
  /** Action du CTA */
  onAction?: () => void;
  /** Lien href du CTA (alternatif à onAction) */
  ctaHref?: string;
}

/**
 * État vide avec CTA — utilisé quand les données existent mais sont vides
 */
export function EmptyState({
  icon = '📭',
  title,
  description,
  ctaLabel,
  onAction,
  ctaHref,
}: EmptyStateProps) {
  const Wrapper = ctaHref ? 'a' : 'button';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: '#1A1A2E' }}
      >
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-md" style={{ color: '#6B7280' }}>
          {description}
        </p>
      )}
      {(ctaLabel && (onAction || ctaHref)) && (
        <Wrapper
          {...(ctaHref ? { href: ctaHref } : {})}
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#C75B39' }}
        >
          {ctaLabel}
        </Wrapper>
      )}
    </div>
  );
}

interface ErrorStateProps {
  /** Message d'erreur à afficher */
  message?: string | null;
  /** Callback pour réessayer */
  onRetry?: () => void;
  /** Texte du bouton retry */
  retryLabel?: string;
}

/**
 * État d'erreur avec bouton retry — affiche un message FR et propose de réessayer
 */
export function ErrorState({
  message = 'Une erreur est survenue',
  onRetry,
  retryLabel = 'Réessayer',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ color: '#1A1A2E' }}
      >
        Oups, quelque chose a mal tourné
      </h3>
      <p className="mb-6 max-w-md" style={{ color: '#6B7280' }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#C75B39' }}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

interface LoadingStateProps {
  /** Nombre de lignes skeleton */
  lines?: number;
  /** Afficher un message */
  message?: string;
}

/**
 * État de chargement simple avec pulse animation
 */
export function LoadingState({ lines = 3, message }: LoadingStateProps) {
  return (
    <div className="py-8 px-4 space-y-4">
      {message && (
        <p className="text-center text-sm mb-4" style={{ color: '#6B7280' }}>
          {message}
        </p>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl"
          style={{
            background: 'rgba(0, 0, 0, 0.06)',
            height: i === 0 ? '2rem' : '1rem',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}
