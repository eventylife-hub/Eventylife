/**
 * Page 404 pour le checkout
 */

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function CheckoutNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Oups !</h1>
          <p className="text-gray-600">
            La page de checkout n'a pas pu être trouvée.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          Le voyage ou la session de réservation n'existe plus.
        </p>

        <Link href={ROUTES.VOYAGES}>
          <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
            Retour aux voyages
          </Button>
        </Link>
      </div>
    </div>
  );
}
