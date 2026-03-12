import React from 'react';

interface ProStatCardProps {
  /** Label descriptif (ex: "Chiffre d'affaires") */
  label: string;
  /** Valeur principale formatée (ex: "19 766 €") */
  value: string;
  /** Variation ou info secondaire (ex: "+12% vs mois dernier") */
  trend?: string;
  /** Couleur du trend — positif ou négatif */
  trendType?: 'positive' | 'negative' | 'neutral';
  /** Icône ou emoji */
  icon?: React.ReactNode;
}

/**
 * Carte de statistique réutilisable pour le portail Pro.
 * Design ocean — cohérent avec le design system Pro.
 *
 * Exemple :
 * ```tsx
 * <ProStatCard
 *   label="Chiffre d'affaires"
 *   value="19 766 €"
 *   trend="+12% vs mois dernier"
 *   trendType="positive"
 *   icon="💰"
 * />
 * ```
 */
export const ProStatCard = React.memo(function ProStatCard({
  label,
  value,
  trend,
  trendType = 'neutral',
  icon,
}: ProStatCardProps) {
  const trendColors: Record<string, string> = {
    positive: '#059669',
    negative: '#DC2626',
    neutral: '#64748B',
  };

  return (
    <div
      className="pro-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
          {label}
        </span>
        {icon && (
          <span style={{ fontSize: '20px' }} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#0A1628',
          fontFamily: 'var(--font-fraunces, Fraunces, serif)',
        }}
      >
        {value}
      </span>
      {trend && (
        <span style={{ fontSize: '12px', color: trendColors[trendType], fontWeight: 500 }}>
          {trend}
        </span>
      )}
    </div>
  );
});
