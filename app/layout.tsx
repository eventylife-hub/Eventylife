import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/layout/client-providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Eventy Life',
    default: 'Eventy Life — Voyages de Groupe avec Accompagnement',
  },
  description:
    'Découvrez des voyages en groupe avec accompagnement humain porte-à-porte, prix justes et qualité garantie. Bus et avion, départs de toute la France.',
  keywords: [
    'voyages groupe',
    'agence voyage groupe',
    'voyage accompagné',
    'voyage bus',
    'voyage avion groupe',
    'réservation voyage',
    'tourisme France',
    'porte-à-porte',
    'eventy life',
  ],
  authors: [{ name: 'Eventy Life' }],
  creator: 'Eventy Life',
  publisher: 'Eventy Life',
  metadataBase: new URL('https://eventy.fr'),
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/favicon.svg',
  },
  openGraph: {
    title: 'Eventy Life — Voyages de Groupe avec Accompagnement',
    description:
      'Voyages en groupe avec accompagnement humain porte-à-porte. Bus et avion, prix justes, qualité garantie.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Eventy Life',
    url: 'https://eventy.fr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventy Life — Voyages de Groupe',
    description:
      'Voyages en groupe avec accompagnement humain porte-à-porte.',
  },
  alternates: {
    canonical: 'https://eventy.fr',
  },
  category: 'travel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable} ${dmSans.className}`}>
        {children}
        <ClientProviders />
      </body>
    </html>
  );
}
