'use client';

/**
 * Composant - Affichage de la politique d'annulation
 * Affiche les conditions de remboursement par tranche de jours avant le départ
 */
export function CancellationPolicy() {
  const policies = [
    {
      daysRange: 'Plus de 60 jours',
      refundPercent: 100,
      fee: '50€',
      description: '100% remboursé - 50€ de frais de dossier',
    },
    {
      daysRange: '30 à 60 jours',
      refundPercent: 70,
      fee: 'Variable',
      description: '70% du montant payé remboursé',
    },
    {
      daysRange: '15 à 30 jours',
      refundPercent: 50,
      fee: 'Variable',
      description: '50% du montant payé remboursé',
    },
    {
      daysRange: '7 à 15 jours',
      refundPercent: 30,
      fee: 'Variable',
      description: '30% du montant payé remboursé',
    },
    {
      daysRange: 'Moins de 7 jours',
      refundPercent: 0,
      fee: 'Aucun',
      description: 'Aucun remboursement',
    },
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 className="text-xl font-bold text-blue-900 mb-4">
        Politique d'Annulation
      </h2>
      <div className="space-y-3">
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 pb-3 border-b border-blue-100 last:border-b-0"
          >
            <div className="flex-shrink-0 w-16">
              <span className="text-sm font-bold text-blue-900">
                {policy.daysRange}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-900">{policy.description}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-bold text-blue-900">
                {policy.refundPercent}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-blue-800 mt-4">
        Les frais et remboursements sont calculés automatiquement en fonction
        de la date de votre demande d'annulation.
      </p>
    </div>
  );
}
