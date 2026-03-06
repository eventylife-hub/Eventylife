/**
 * Page légale
 */

import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Confidentialité | Eventy Life',
  description:
    'Protection de vos données personnelles - Informations légales sur la confidentialité d\'Eventy Life',
};

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card elevated>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Informations légales
          </h1>
          <p className="text-gray-600 mb-6">
            Page en construction. Les informations légales seront disponibles très bientôt.
          </p>
          <div className="prose prose-sm max-w-none">
            <p>
              Cette page contient les conditions générales de vente, la politique de confidentialité
              et les mentions légales du site Eventy Life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
