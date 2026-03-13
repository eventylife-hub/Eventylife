import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'FAQ — Questions Fréquentes',
  description:
    'Trouvez les réponses à vos questions sur les voyages de groupe Eventy Life : réservation, transport porte-à-porte, paiement, accompagnement.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'FAQ — Questions Fréquentes | Eventy Life',
    description:
      'Trouvez les réponses à vos questions sur les voyages de groupe Eventy Life.',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary_large_image',
    title: 'FAQ — Questions Fréquentes | Eventy Life',
    description:
      'Réponses à vos questions sur les voyages de groupe Eventy Life.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/faq' },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'FAQ', href: '/faq' },
        ]}
      />
      {children}
    </>
  );
}
