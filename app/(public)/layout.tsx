import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/ui/back-to-top';
import { OrganizationJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: {
    template: '%s | Eventy Life — Voyages de Groupe',
    default: 'Eventy Life — Voyages de Groupe Organisés',
  },
  description:
    'Réservez votre prochain voyage de groupe organisé avec Eventy Life. Destinations uniques, transport inclus, prix tout compris. Vivez l\'aventure en groupe !',
  keywords: [
    'voyage de groupe',
    'voyage organisé',
    'bus voyage',
    'excursion groupe',
    'weekend groupe',
    'Eventy Life',
    'réservation voyage',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.eventylife.fr',
    siteName: 'Eventy Life',
    title: 'Eventy Life — Voyages de Groupe Organisés',
    description:
      'Réservez votre prochain voyage de groupe organisé. Destinations uniques, transport inclus, prix tout compris.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventy Life — Voyages de Groupe Organisés',
    description:
      'Réservez votre prochain voyage de groupe organisé. Destinations uniques, transport inclus, prix tout compris.',
  },
  alternates: {
    canonical: 'https://www.eventylife.fr',
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
