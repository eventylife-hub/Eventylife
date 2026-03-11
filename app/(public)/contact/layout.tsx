import type { Metadata } from 'next';
import { ContactPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Contact | Eventy Life',
  description:
    'Contactez Eventy Life pour toute question sur nos voyages en groupe. Notre équipe vous répond rapidement pour vos demandes.',
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
