import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devenir Partenaire — Rejoignez Eventy Life',
  description:
    'Rejoignez le réseau de partenaires Eventy Life : hébergements, restaurants, activités, transporteurs. Développez votre activité avec nous.',
  openGraph: {
    title: 'Devenir Partenaire | Eventy Life',
    description:
      'Rejoignez le réseau de partenaires Eventy Life et développez votre activité.',
  },
};

export default function PartenairesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
