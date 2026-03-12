import React from 'react';

/**
 * Styles CSS shimmer injectés une seule fois.
 * Évite la duplication de <style> dans chaque loading.tsx.
 */
export const ProShimmerStyles = React.memo(function ProShimmerStyles() {
  return (
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  );
});

interface ProSkeletonBarProps {
  /** Largeur en pixels ou string CSS (ex: '100%') — défaut: '100%' */
  width?: number | string;
  /** Hauteur en pixels — défaut: 16 */
  height?: number;
  /** Border-radius en pixels — défaut: 12 */
  radius?: number;
  /** Affichage circulaire (ex: avatar) */
  circle?: boolean;
  /** Style supplémentaire */
  style?: React.CSSProperties;
}

/**
 * Barre skeleton avec animation shimmer.
 * Remplace le pattern inline répété dans tous les loading.tsx Pro.
 *
 * Exemple :
 * ```tsx
 * <ProShimmerStyles />
 * <ProSkeletonBar width={192} height={32} />
 * <ProSkeletonBar width="100%" height={16} />
 * <ProSkeletonBar circle width={40} height={40} />
 * ```
 */
export const ProSkeletonBar = React.memo(function ProSkeletonBar({
  width = '100%',
  height = 16,
  radius = 12,
  circle = false,
  style,
}: ProSkeletonBarProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        width: circle ? height : width,
        borderRadius: circle ? '50%' : radius,
        background: 'linear-gradient(90deg, #E5E0D8 25%, #F0ECE6 50%, #E5E0D8 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  );
});

interface ProSkeletonCardProps {
  /** Nombre de lignes skeleton dans la carte — défaut: 3 */
  lines?: number;
  /** Style supplémentaire sur le conteneur */
  style?: React.CSSProperties;
}

/**
 * Carte skeleton Pro complète — titre + lignes.
 * Pour les stat cards, panels, etc.
 */
export const ProSkeletonCard = React.memo(function ProSkeletonCard({
  lines = 3,
  style,
}: ProSkeletonCardProps) {
  return (
    <div
      className="pro-card"
      aria-hidden="true"
      style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', ...style }}
    >
      <ProSkeletonBar width={112} height={14} />
      <ProSkeletonBar width={80} height={28} />
      {Array.from({ length: Math.max(0, lines - 2) }).map((_, i) => (
        <ProSkeletonBar key={i} width={144} height={12} />
      ))}
    </div>
  );
});

interface ProSkeletonTableRowProps {
  /** Nombre de colonnes — défaut: 4 */
  columns?: number;
}

/**
 * Ligne skeleton pour les tableaux Pro.
 */
export const ProSkeletonTableRow = React.memo(function ProSkeletonTableRow({
  columns = 4,
}: ProSkeletonTableRowProps) {
  return (
    <div
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0' }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <ProSkeletonBar
          key={i}
          width={i === 0 ? 160 : i === columns - 1 ? 64 : 120}
          height={16}
          style={{ flex: i === 0 ? 2 : 1 }}
        />
      ))}
    </div>
  );
});
