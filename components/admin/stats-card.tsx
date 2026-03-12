import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  changePercent?: number;
  trend?: 'up' | 'down';
  href?: string;
}

/**
 * Composant de carte de statistiques réutilisable
 * React.memo — évite les re-renders si les props ne changent pas
 */
export const StatsCard = React.memo(function StatsCard({
  icon,
  title,
  value,
  changePercent,
  trend,
  href,
}: StatsCardProps) {
  const TrendIcon = trend === 'up' ? '↑' : '↓';
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';

  const content = (
    <div className={`bg-white rounded-xl border shadow-md ${href ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              {changePercent !== undefined && (
                <div className={`text-sm font-medium ${trendColor}`}>
                  {TrendIcon} {Math.abs(changePercent)}%
                </div>
              )}
            </div>
          </div>
          <div className="text-3xl opacity-20">{icon}</div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
});
