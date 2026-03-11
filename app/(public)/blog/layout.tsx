import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Inspirations Voyage',
  description:
    'Découvrez nos articles, conseils et inspirations pour vos voyages de groupe. Destinations, astuces, témoignages de voyageurs Eventy Life.',
  openGraph: {
    title: 'Blog Voyage | Eventy Life',
    description:
      'Articles, conseils et inspirations pour vos voyages de groupe Eventy Life.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
