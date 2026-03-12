import React from 'react';

interface ProPageHeaderProps {
  /** Titre principal de la page */
  title: string;
  /** Description sous le titre */
  description?: string;
  /** Actions à droite (boutons) */
  actions?: React.ReactNode;
}

/**
 * En-tête de page réutilisable pour le portail Pro.
 * Titre + description optionnelle + actions à droite.
 *
 * Exemple :
 * ```tsx
 * <ProPageHeader
 *   title="Mes voyages"
 *   description="Gérez vos voyages et suivez les réservations"
 *   actions={<button className="pro-btn-ocean">Créer un voyage</button>}
 * />
 * ```
 */
export const ProPageHeader = React.memo(function ProPageHeader({
  title,
  description,
  actions,
}: ProPageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        <h1 className="pro-page-title">{title}</h1>
        {description && (
          <p style={{ color: '#64748B', marginTop: '8px', fontSize: '14px' }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
});
