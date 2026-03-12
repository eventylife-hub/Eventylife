import React from 'react';

interface ProEmptyStateProps {
  /** Icône ou emoji à afficher */
  icon?: React.ReactNode;
  /** Titre principal */
  title: string;
  /** Description secondaire */
  description?: string;
  /** Texte du bouton CTA */
  ctaLabel?: string;
  /** Action du CTA */
  onCtaClick?: () => void;
  /** Lien href du CTA (alternatif à onCtaClick) */
  ctaHref?: string;
}

/**
 * État vide réutilisable pour le portail Pro.
 * Design ocean — cohérent avec le design system Pro.
 *
 * Exemple :
 * ```tsx
 * <ProEmptyState
 *   icon="📦"
 *   title="Aucun voyage créé"
 *   description="Commencez par créer votre premier voyage"
 *   ctaLabel="Créer un voyage →"
 *   ctaHref="/pro/voyages/nouveau"
 * />
 * ```
 */
export const ProEmptyState = React.memo(function ProEmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCtaClick,
  ctaHref,
}: ProEmptyStateProps) {
  return (
    <div
      className="pro-card"
      style={{
        textAlign: 'center',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {icon && (
        <div style={{ fontSize: '48px', marginBottom: '8px' }} aria-hidden="true">
          {icon}
        </div>
      )}
      <p style={{ color: '#0A1628', fontWeight: 600, fontSize: '16px', margin: 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ color: '#64748B', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
          {description}
        </p>
      )}
      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="pro-btn-ocean"
          style={{ marginTop: '8px', display: 'inline-block', minHeight: '44px', lineHeight: '44px' }}
        >
          {ctaLabel}
        </a>
      )}
      {ctaLabel && onCtaClick && !ctaHref && (
        <button
          type="button"
          onClick={onCtaClick}
          className="pro-btn-ocean"
          style={{ marginTop: '8px', minHeight: '44px' }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
});
