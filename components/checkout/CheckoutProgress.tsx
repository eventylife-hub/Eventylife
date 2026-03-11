'use client';

interface CheckoutProgressProps {
  currentStep: number; // 1-4
}

const STEPS = [
  { number: 1, label: 'Chambres' },
  { number: 2, label: 'Participants' },
  { number: 3, label: 'Paiement' },
  { number: 4, label: 'Confirmation' },
];

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {STEPS.map((step, index) => (
          <div key={step.number} style={{ display: 'flex', alignItems: 'center', flex: index < STEPS.length - 1 ? 1 : 'none' }}>
            {/* Circle */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              transition: 'all 0.3s ease',
              background: step.number <= currentStep ? 'var(--terra, #C75B39)' : '#E2E8F0',
              color: step.number <= currentStep ? '#FFFFFF' : '#64748B',
              boxShadow: step.number === currentStep ? '0 0 0 4px rgba(199,91,57,0.2)' : 'none',
            }}>
              {step.number < currentStep ? '✓' : step.number}
            </div>
            {/* Label */}
            <span style={{
              fontSize: '12px',
              fontWeight: step.number === currentStep ? 700 : 500,
              color: step.number <= currentStep ? 'var(--navy, #1A1A2E)' : '#6B7280',
              marginLeft: '8px',
              whiteSpace: 'nowrap',
            }}>
              {step.label}
            </span>
            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                margin: '0 12px',
                background: step.number < currentStep ? 'var(--terra, #C75B39)' : '#E2E8F0',
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
