'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Download } from 'lucide-react';

interface InsuranceCoverage {
  cancellation?: boolean;
  illness?: boolean;
  death?: boolean;
  liability?: boolean;
  baggage?: boolean;
  assistance?: boolean;
}

interface InsuranceOption {
  name: string;
  description: string;
  priceCents: number;
  coverage: InsuranceCoverage;
}

/**
 * Composant Insurance Card
 *
 * Affiche les détails d'une assurance avec:
 * - Option (basique, standard, premium)
 * - Couvertures incluses
 * - Prix
 * - Bouton télécharger certificat
 */
export function InsuranceCard({
  option,
  price,
  onSubscribe,
}: {
  option: InsuranceOption | null;
  price?: number;
  onSubscribe?: () => void;
}) {
  if (!option) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              {option.name}
            </CardTitle>
            <CardDescription className="text-sm mt-2">
              {option.description}
            </CardDescription>
          </div>
          <Badge variant="outline">{option.priceCents / 100}€</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Couvertures */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">Couvertures incluses:</p>
          <ul className="text-xs space-y-1">
            {option.coverage.cancellation && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Annulation maladie
              </li>
            )}
            {option.coverage.illness && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Couverture maladie
              </li>
            )}
            {option.coverage.death && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Assurance décès
              </li>
            )}
            {option.coverage.liability && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Responsabilité civile
              </li>
            )}
            {option.coverage.baggage && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Protection bagages
              </li>
            )}
            {option.coverage.assistance && (
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Assistance 24/24
              </li>
            )}
          </ul>
        </div>

        {/* Prix */}
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-600">Prix total</p>
          <p className="text-xl font-bold text-blue-600">
            {(price || option.priceCents) / 100}€
          </p>
        </div>

        {/* Actions */}
        {onSubscribe ? (
          <Button onClick={onSubscribe} className="w-full gap-2">
            Souscrire
          </Button>
        ) : (
          <Button variant="outline" className="w-full gap-2">
            <Download className="w-4 h-4" />
            Voir certificat
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
