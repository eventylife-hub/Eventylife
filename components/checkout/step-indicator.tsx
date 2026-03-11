/**
 * Composant indicateur d'étapes du checkout
 * Affiche les 4 étapes avec statut visuel
 */

'use client';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Sélection' },
    { number: 2, label: 'Chambres' },
    { number: 3, label: 'Participants' },
    { number: 4, label: 'Paiement' },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step: unknown, i: number) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                transition-colors duration-200
                ${
                  currentStep >= step.number
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }
              `}
            >
              {currentStep > step.number ? (
                <span>✓</span>
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <label className="text-xs font-medium mt-2 text-gray-600 text-center whitespace-nowrap">
              {step.label}
            </label>
          </div>

          {i < steps.length - 1 && (
            <div
              className={`
                h-1 flex-1 mx-2 rounded transition-colors duration-200
                ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
