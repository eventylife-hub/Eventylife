'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Composant Margin Chart
 *
 * Graphique simple en barres SVG montrant l'évolution de la marge par mois
 * Pas de dépendance externe (recharts, etc.)
 */
export function MarginChart({
  data = [],
}: {
  data: Array<{ month: string; margin: number; ca: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution Marge</CardTitle>
          <CardDescription>Par mois</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Aucune donnée</p>
        </CardContent>
      </Card>
    );
  }

  // Récupérer les max pour l'échelle
  const maxMargin = Math.max(...data.map((d) => d.margin), 0);
  const maxCA = Math.max(...data.map((d) => d.ca), 0);
  const maxValue = Math.max(maxMargin, maxCA);

  const chartHeight = 300;
  const barWidth = 40;
  const spacing = 20;
  const chartWidth = data.length * (barWidth + spacing) + 40;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution Marge</CardTitle>
        <CardDescription>Par mois (en €)</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-4">
        <svg width={chartWidth} height={chartHeight + 60} className="min-w-full">
          {/* Grille */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="40"
              y1={chartHeight - (percent / 100) * chartHeight}
              x2={chartWidth}
              y2={chartHeight - (percent / 100) * chartHeight}
              stroke="#e5e7eb"
              strokeDasharray="4"
              strokeWidth="1"
            />
          ))}

          {/* Barres */}
          {data.map((item, idx: number) => {
            const x = 50 + idx * (barWidth + spacing);
            const barHeightMargin =
              maxValue > 0
                ? (Math.max(item.margin, 0) / maxValue) * (chartHeight - 20)
                : 0;
            const barHeightCA =
              maxValue > 0
                ? (Math.max(item.ca, 0) / maxValue) * (chartHeight - 20)
                : 0;

            return (
              <g key={idx}>
                {/* Barre CA (couleur neutre) */}
                <rect
                  x={x}
                  y={chartHeight - barHeightCA}
                  width={barWidth / 2 - 2}
                  height={barHeightCA}
                  fill="#e5e7eb"
                  rx="2"
                />
                {/* Barre Marge (couleur verte) */}
                <rect
                  x={x + barWidth / 2}
                  y={chartHeight - barHeightMargin}
                  width={barWidth / 2 - 2}
                  height={barHeightMargin}
                  fill={item.margin >= 0 ? '#10b981' : '#ef4444'}
                  rx="2"
                />
                {/* Label mois */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#666"
                >
                  {item.month.slice(5)}
                </text>
              </g>
            );
          })}

          {/* Légende */}
          <g>
            <rect x="50" y={chartHeight + 35} width="12" height="12" fill="#e5e7eb" />
            <text x="67" y={chartHeight + 43} fontSize="12" fill="#666">
              CA
            </text>

            <rect
              x="110"
              y={chartHeight + 35}
              width="12"
              height="12"
              fill="#10b981"
            />
            <text x="127" y={chartHeight + 43} fontSize="12" fill="#666">
              Marge
            </text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
}
