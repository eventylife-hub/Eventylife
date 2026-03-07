import type { Metadata } from 'next';
import { Outfit, Fraunces } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/toast';
import { CookieBanner } from '@/components/cookie-banner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Eventy Life - Voyages en Groupe',
  description: 'Découvrez des voyages en groupe avec accompagnement, prix justes et qualité garantie.',
  keywords: [
    'voyages',
    'groupe',
    'agence voyage',
    'réservation voyage',
    'tourisme',
    'destinations',
  ],
  authors: [{ name: 'Eventy Life' }],
  openGraph: {
    title: 'Eventy Life - Voyages en Groupe',
    description: 'Découvrez des voyages en groupe avec accompagnement, prix justes et qualité garantie.',
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
      <body className={`${outfit.variable} ${fraunces.variable} ${outfit.className}`}>
        {children}
        <ToastContainer />
        <CookieBanner />
      </body>
    </html>
  );
}
