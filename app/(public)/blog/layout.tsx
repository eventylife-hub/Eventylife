import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Blog — Inspirations Voyage',
  description:
    'Découvrez nos articles, conseils et inspirations pour vos voyages de groupe. Destinations, astuces, témoignages de voyageurs Eventy Life.',
  openGraph: {
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Eventy Life' }],
    title: 'Blog Voyage | Eventy Life',
    description:
      'Articles, conseils et inspirations pour vos voyages de groupe Eventy Life.',
  },
  twitter: {
    images: ['/opengraph-image'],
    card: 'summary_large_image',
    title: 'Blog Voyage | Eventy Life',
    description:
      'Articles, conseils et inspirations pour vos voyages de groupe.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />
      {children}
    </>
  );
}
