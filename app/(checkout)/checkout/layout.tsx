/**
 * Layout pour le checkout
 * Affiche l'indicateur d'étapes et le timer du hold
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';
import { useCheckoutStore } from '@/lib/stores/checkout-store';
import { HoldTimer } from '@/components/checkout/hold-timer';
import { StepIndicator } from '@/components/checkout/step-indicator';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const { currentStep, holdExpiresAt } = useCheckoutStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 flex justify-between items-center">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-lg" />
            <span className="font-bold text-lg text-gray-900">Eventy Life</span>
          </Link>
          
          {holdExpiresAt && <HoldTimer expiresAt={holdExpiresAt} />}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-12" id="main-content" aria-label="Réservation">
        <Card elevated>
          <CardContent className="p-8">
            <StepIndicator currentStep={currentStep} />
            {children}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
