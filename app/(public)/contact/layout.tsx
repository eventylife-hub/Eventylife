import type { Metadata } from 'next';
import { ContactPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Contactez Eventy Life — Voyages de Groupe',
  description:
    'Contactez Eventy Life pour toute question sur nos voyages en groupe. Notre équipe vous répond rapidement pour vos demandes.',
  openGraph: {
    title: 'Contactez Eventy Life',
    description:
      'Une question sur nos voyages de groupe ? Contactez notre équipe par email, téléphone ou formulaire.',
    url: 'https://www.eventylife.fr/contact',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Eventy Life',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contactez Eventy Life',
    description:
      'Une question sur nos voyages de groupe ? Notre équipe vous répond rapidement.',
  },
  alternates: { canonical: 'https://www.eventylife.fr/contact' },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContactPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: 'Accueil', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />
      {children}
    </>
  );
}
