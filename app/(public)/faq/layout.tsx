import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Questions Fréquentes',
  description:
    'Trouvez les réponses à vos questions sur les voyages de groupe Eventy Life : réservation, transport porte-à-porte, paiement, accompagnement.',
  openGraph: {
    title: 'FAQ — Questions Fréquentes | Eventy Life',
    description:
      'Trouvez les réponses à vos questions sur les voyages de groupe Eventy Life.',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
