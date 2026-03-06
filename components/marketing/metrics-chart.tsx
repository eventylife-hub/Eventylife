import React from 'react';

interface MetricsChartProps {
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: string;
    conversionRate: string;
    roi: string;
  };
}

/**
 * Graphique SVG des métriques marketing
 * Affiche les principales métriques sous forme de graphique en barres
 */
export function MetricsChart({ metrics }: MetricsChartProps) {
  const maxValue = Math.max(metrics.impressions, metrics.clicks * 10, metrics.conversions * 100);
  const scale = 200 / (maxValue || 1);

  const impressionsHeight = (metrics.impressions * scale) || 10;
  const clicksHeight = (metrics.clicks * 10 * scale) || 10;
  const conversionsHeight = (metrics.conversions * 100 * scale) || 10;

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 300 200"
        className="w-full h-48 border border-gray-200 rounded-lg bg-gray-50 p-4"
      >
        {/* Axes */}
        <line x1="40" y1="180" x2="280" y2="180" stroke="#ccc" strokeWidth="1" />
        <line x1="40" y1="20" x2="40" y2="180" stroke="#ccc" strokeWidth="1" />

        {/* Barres */}
        {/* Impressions */}
        <rect
          x="60"
          y={180 - impressionsHeight}
          width="40"
          height={impressionsHeight}
          fill="#3b82f6"
        />
        <text x="80" y="195" textAnchor="middle" className="text-xs fill-gray-600">
          Vues
        </text>

        {/* Clics */}
        <rect
          x="130"
          y={180 - clicksHeight}
          width="40"
          height={clicksHeight}
          fill="#10b981"
        />
        <text x="150" y="195" textAnchor="middle" className="text-xs fill-gray-600">
          Clics
        </text>

        {/* Conversions */}
        <rect
          x="200"
          y={180 - conversionsHeight}
          width="40"
          height={conversionsHeight}
          fill="#f59e0b"
        />
        <text x="220" y="195" textAnchor="middle" className="text-xs fill-gray-600">
          Conversions
        </text>
      </svg>

      {/* Légende et stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{metrics.impressions}</div>
          <p className="text-xs text-gray-600">Impressions</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{metrics.clicks}</div>
          <p className="text-xs text-gray-600">Clics ({metrics.ctr})</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{metrics.conversions}</div>
          <p className="text-xs text-gray-600">Conversions ({metrics.conversionRate})</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm">
          <strong>ROI:</strong> {metrics.roi}
        </p>
      </div>
    </div>
  );
}
