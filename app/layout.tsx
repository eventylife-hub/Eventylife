import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/toast';
import { CookieBanner } from '@/components/cookie-banner';

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
  title: 'Eventy Life - Voyages en Groupe',
  description: 'Découvrez des voyages en groupe avec accompagnement humain porte-à-porte, prix justes et qualité garantie.',
  keywords: [
    'voyages',
    'groupe',
    'agence voyage',
    'réservation voyage',
    'tourisme',
    'destinations',
    'porte-à-porte',
  ],
  authors: [{ name: 'Eventy Life' }],
  openGraph: {
    title: 'Eventy Life - Voyages en Groupe',
    description: 'Découvrez des voyages en groupe avec accompagnement humain porte-à-porte, prix justes et qualité garantie.',
    type: 'website',
    locale: 'fr_FR',
  },
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
        <ToastContainer />
        <CookieBanner />
      </body>
    </html>
  );
}
