'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Composant Finance Summary
 *
 * Résumé des chiffres clés:
 * - CA TTC
 * - Coûts TTC
 * - Marge
 * - TVA Marge (INVARIANT 6)
 */
export function FinanceSummary({
  caTTC,
  costsTTC,
  margin,
  tvaMarge,
  marginPercent,
}: {
  caTTC: number;
  costsTTC: number;
  margin: number;
  tvaMarge: number;
  marginPercent: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">CA TTC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(caTTC / 100).toLocaleString('fr-FR')}€
          </div>
          <p className="text-xs text-gray-500">chiffre d&apos;affaires</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Coûts TTC</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(costsTTC / 100).toLocaleString('fr-FR')}€
          </div>
          <p className="text-xs text-gray-500">total coûts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Marge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {(margin / 100).toLocaleString('fr-FR')}€
            </div>
            {margin >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-xs text-gray-500">{marginPercent}% profit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">TVA Marge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(tvaMarge / 100).toLocaleString('fr-FR')}€
          </div>
          <p className="text-xs text-gray-500">
            {marginPercent > 0 ? '20% de la marge' : '-'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
